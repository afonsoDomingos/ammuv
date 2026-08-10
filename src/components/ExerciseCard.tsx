import React, { useState, useEffect, useCallback } from 'react';
import type { Exercise } from '../types/game';
import { soundFx } from '../utils/soundFx';
import { X, Heart, Sparkles, Volume2, Check, RefreshCw, Flag, Flame, Headphones, Turtle, Zap } from 'lucide-react';
import { Mascot } from './Mascot';

interface ExerciseCardProps {
  exercise: Exercise;
  currentIndex: number;
  totalExercises: number;
  heartsRemaining: number;
  currentStreak: number;
  onAnswer: (isCorrect: boolean) => void;
  onNext: () => void;
  onClose: () => void;
}

export const ExerciseCard: React.FC<ExerciseCardProps> = ({
  exercise,
  currentIndex,
  totalExercises,
  heartsRemaining,
  currentStreak,
  onAnswer,
  onNext,
  onClose
}) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [typedInput, setTypedInput] = useState<string>('');
  const [availableWords, setAvailableWords] = useState<string[]>([]);
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<'idle' | 'correct' | 'incorrect'>('idle');
  const [showComboBanner, setShowComboBanner] = useState(false);
  const [floatingXp, setFloatingXp] = useState<number | null>(null);

  // State for pair matching
  const [selectedPairEn, setSelectedPairEn] = useState<string | null>(null);
  const [selectedPairPt, setSelectedPairPt] = useState<string | null>(null);
  const [matchedPairs, setMatchedPairs] = useState<string[]>([]);

  useEffect(() => {
    setSelectedOption(null);
    setTypedInput('');
    setFeedback('idle');
    setShowComboBanner(false);
    setFloatingXp(null);
    setSelectedPairEn(null);
    setSelectedPairPt(null);
    setMatchedPairs([]);

    if (exercise.type === 'sentence_builder' && exercise.words) {
      const shuffled = [...exercise.words].sort(() => Math.random() - 0.5);
      setAvailableWords(shuffled);
      setSelectedWords([]);
    }

    if ((exercise.type === 'listening' || exercise.type === 'audio_dictation') && exercise.speakerText) {
      const timer = setTimeout(() => {
        speakText(exercise.speakerText!, 0.9);
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [exercise]);

  const speakText = (text: string, rate: number = 0.9) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = rate;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleSelectWordChip = (word: string, index: number) => {
    if (feedback !== 'idle') return;
    soundFx.playPop();

    const updatedAvailable = [...availableWords];
    updatedAvailable.splice(index, 1);
    setAvailableWords(updatedAvailable);
    setSelectedWords([...selectedWords, word]);
  };

  const handleRemoveWordChip = (word: string, index: number) => {
    if (feedback !== 'idle') return;
    soundFx.playPop();

    const updatedSelected = [...selectedWords];
    updatedSelected.splice(index, 1);
    setSelectedWords(updatedSelected);
    setAvailableWords([...availableWords, word]);
  };

  // Pair Matching Click Handler
  const handlePairClick = (item: { type: 'en' | 'pt'; text: string; pairId: string }) => {
    if (feedback !== 'idle') return;
    soundFx.playClick();

    if (item.type === 'en') {
      setSelectedPairEn(item.text);
      if (selectedPairPt) {
        checkPairMatch(item.text, selectedPairPt);
      }
    } else {
      setSelectedPairPt(item.text);
      if (selectedPairEn) {
        checkPairMatch(selectedPairEn, item.text);
      }
    }
  };

  const checkPairMatch = (enText: string, ptText: string) => {
    const pair = exercise.pairs?.find((p) => p.en === enText && p.pt === ptText);
    if (pair) {
      soundFx.playPop();
      const newMatched = [...matchedPairs, pair.id];
      setMatchedPairs(newMatched);
      setSelectedPairEn(null);
      setSelectedPairPt(null);

      // If all pairs matched!
      if (exercise.pairs && newMatched.length === exercise.pairs.length) {
        const nextCombo = currentStreak + 1;
        soundFx.playCorrect(nextCombo);
        setFeedback('correct');
        setFloatingXp(20);
        onAnswer(true);
      }
    } else {
      soundFx.playWrong();
      setSelectedPairEn(null);
      setSelectedPairPt(null);
    }
  };

  const handleSubmit = useCallback(() => {
    if (feedback !== 'idle') return;

    let isCorrect = false;

    if (exercise.type === 'multiple_choice' || exercise.type === 'fill_blank' || exercise.type === 'image_choice' || exercise.type === 'listening' || exercise.type === 'true_false') {
      if (!selectedOption) return;
      isCorrect = selectedOption.trim() === exercise.correctAnswer.trim();
    } else if (exercise.type === 'audio_dictation') {
      isCorrect = typedInput.trim().toLowerCase() === exercise.correctAnswer.trim().toLowerCase();
    } else if (exercise.type === 'sentence_builder') {
      const constructedSentence = selectedWords.join(' ').trim();
      isCorrect = constructedSentence === exercise.correctAnswer.trim();
    } else if (exercise.type === 'pair_matching') {
      isCorrect = matchedPairs.length === (exercise.pairs?.length || 0);
    }

    if (isCorrect) {
      const nextCombo = currentStreak + 1;
      const xpGain = 15 + Math.min(nextCombo * 2, 20);
      
      soundFx.playCorrect(nextCombo);
      setFeedback('correct');
      setFloatingXp(xpGain);

      if (nextCombo >= 2) {
        setShowComboBanner(true);
      }
      onAnswer(true);
    } else {
      soundFx.playWrong();
      setFeedback('incorrect');
      onAnswer(false);
    }
  }, [feedback, exercise, selectedOption, typedInput, selectedWords, matchedPairs, currentStreak, onAnswer]);

  const handleSkip = () => {
    soundFx.playWrong();
    setFeedback('incorrect');
    onAnswer(false);
  };

  const isCheckDisabled =
    (exercise.type === 'sentence_builder' && selectedWords.length === 0) ||
    (exercise.type === 'audio_dictation' && !typedInput.trim()) ||
    (exercise.type === 'pair_matching' && matchedPairs.length !== (exercise.pairs?.length || 0)) ||
    ((exercise.type === 'multiple_choice' || exercise.type === 'fill_blank' || exercise.type === 'image_choice' || exercise.type === 'listening' || exercise.type === 'true_false') && !selectedOption);

  return (
    <div className="exercise-screen-wrapper flex flex-col min-h-[90vh] justify-between pb-32 relative overflow-hidden">
      
      {/* Floating Dynamic XP Popup */}
      {floatingXp && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-50 pointer-events-none animate-floatUp">
          <span className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-full bg-amber-400 text-amber-950 font-black text-xl shadow-2xl border-2 border-amber-300">
            <Zap className="w-6 h-6 fill-amber-950" /> +{floatingXp} XP!
          </span>
        </div>
      )}

      {/* Top Header */}
      <div className="duo-header max-w-4xl mx-auto w-full px-4 py-3 flex items-center gap-3">
        <button onClick={onClose} className="close-btn" title="Fechar Exercício">
          <X className="w-5 h-5 stroke-[3]" />
        </button>

        <div className="progress-track flex-1">
          <div 
            className="progress-fill" 
            style={{ width: `${((currentIndex + 1) / totalExercises) * 100}%` }}
          />
        </div>

        <div className="flex items-center gap-1 text-red-500 font-extrabold text-base sm:text-lg">
          <Heart className="w-5 h-5 sm:w-6 sm:h-6 fill-red-500 text-red-500" />
          <span>{heartsRemaining}</span>
        </div>
      </div>

      {/* Main Content Area */}
      <div className={`exercise-card max-w-3xl mx-auto w-full px-4 sm:px-6 py-2 ${feedback === 'incorrect' ? 'shake-animation' : ''}`}>
        
        {/* Badge Tag */}
        {exercise.badgeTag && (
          <div className="flex justify-center mb-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-purple-100 text-purple-700 uppercase tracking-wider shadow-sm">
              <Sparkles className="w-3.5 h-3.5" />
              {exercise.badgeTag}
            </span>
          </div>
        )}

        {/* Question Title */}
        <h1 className="text-xl sm:text-3xl font-black text-center text-gray-800 mb-6 leading-snug">
          {exercise.question}
        </h1>

        {/* Listening / Audio Dictation Header */}
        {(exercise.type === 'listening' || exercise.type === 'audio_dictation') && exercise.speakerText && (
          <div className="flex flex-col items-center justify-center my-6 gap-3">
            <div className="flex items-center gap-3">
              <button
                onClick={() => speakText(exercise.speakerText!, 0.9)}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-sky-500 hover:bg-sky-600 active:translate-y-1 text-white flex items-center justify-center shadow-lg border-b-4 border-sky-700 transition"
              >
                <Volume2 className="w-10 h-10 sm:w-12 sm:h-12 animate-pulse" />
              </button>

              <button
                onClick={() => speakText(exercise.speakerText!, 0.55)}
                className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl bg-amber-400 hover:bg-amber-500 active:translate-y-1 text-amber-950 flex items-center justify-center shadow-md border-b-4 border-amber-600 transition"
              >
                <Turtle className="w-8 h-8" />
              </button>
            </div>

            <span className="text-xs font-extrabold text-sky-600 flex items-center gap-1">
              <Headphones className="w-3.5 h-3.5" /> Toque para ouvir em velocidade normal ou devagar
            </span>
          </div>
        )}

        {/* Audio Dictation Input Mode */}
        {exercise.type === 'audio_dictation' && (
          <div className="max-w-md mx-auto mb-6">
            <input
              type="text"
              value={typedInput}
              onChange={(e) => setTypedInput(e.target.value)}
              placeholder="Digite exatamente o que você ouviu..."
              className="w-full px-5 py-4 text-lg font-black border-2 border-slate-300 rounded-2xl outline-none focus:border-sky-500 transition shadow-inner"
            />
          </div>
        )}

        {/* Pair Matching Mode */}
        {exercise.type === 'pair_matching' && exercise.pairs && (
          <div className="grid grid-cols-2 gap-4 max-w-lg mx-auto mb-6">
            {/* English Column */}
            <div className="flex flex-col gap-3">
              <span className="text-xs font-black text-slate-400 uppercase text-center">Inglês</span>
              {exercise.pairs.map((pair) => {
                const isMatched = matchedPairs.includes(pair.id);
                const isSelected = selectedPairEn === pair.en;

                return (
                  <button
                    key={pair.id + '-en'}
                    disabled={isMatched}
                    onClick={() => handlePairClick({ type: 'en', text: pair.en, pairId: pair.id })}
                    className={`p-4 rounded-2xl font-black text-base transition border-2 border-b-4 ${
                      isMatched
                        ? 'bg-emerald-100 border-emerald-400 text-emerald-700 opacity-50'
                        : isSelected
                        ? 'bg-sky-100 border-sky-500 text-sky-800 scale-105'
                        : 'bg-white border-slate-200 text-slate-800 hover:bg-slate-50'
                    }`}
                  >
                    {pair.en}
                  </button>
                );
              })}
            </div>

            {/* Portuguese Column */}
            <div className="flex flex-col gap-3">
              <span className="text-xs font-black text-slate-400 uppercase text-center">Português</span>
              {exercise.pairs.map((pair) => {
                const isMatched = matchedPairs.includes(pair.id);
                const isSelected = selectedPairPt === pair.pt;

                return (
                  <button
                    key={pair.id + '-pt'}
                    disabled={isMatched}
                    onClick={() => handlePairClick({ type: 'pt', text: pair.pt, pairId: pair.id })}
                    className={`p-4 rounded-2xl font-black text-base transition border-2 border-b-4 ${
                      isMatched
                        ? 'bg-emerald-100 border-emerald-400 text-emerald-700 opacity-50'
                        : isSelected
                        ? 'bg-sky-100 border-sky-500 text-sky-800 scale-105'
                        : 'bg-white border-slate-200 text-slate-800 hover:bg-slate-50'
                    }`}
                  >
                    {pair.pt}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Mascot & Speech Header */}
        {exercise.type !== 'listening' && exercise.type !== 'audio_dictation' && exercise.speakerText && (
          <div className="mascot-container flex-col sm:flex-row items-center sm:items-end justify-center mb-8 gap-4">
            <Mascot 
              size="md"
              mood={feedback === 'correct' ? 'excited' : feedback === 'incorrect' ? 'sad' : selectedOption ? 'wink' : 'happy'}
            />
            <div className="mascot-speech-bubble flex items-center gap-3 max-w-md w-full">
              <button 
                onClick={() => speakText(exercise.speakerText!, 0.9)}
                className="p-2.5 rounded-xl bg-sky-100 hover:bg-sky-200 text-sky-600 transition shrink-0"
              >
                <Volume2 className="w-5 h-5 text-sky-500" />
              </button>

              <button 
                onClick={() => speakText(exercise.speakerText!, 0.55)}
                className="p-2.5 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-700 transition shrink-0"
              >
                <Turtle className="w-5 h-5 text-amber-600" />
              </button>

              <div className="flex-1">
                <span className="text-lg sm:text-xl font-extrabold text-gray-800 underline decoration-dotted decoration-purple-400">
                  {exercise.speakerText}
                </span>
                {exercise.contextPt && (
                  <p className="text-xs font-bold text-gray-500 mt-0.5">💡 {exercise.contextPt}</p>
                )}
              </div>
              <div className="bubble-tail" />
            </div>
          </div>
        )}

        {/* Image Choice Grid */}
        {exercise.type === 'image_choice' && exercise.options && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 max-w-2xl mx-auto mb-6">
            {exercise.options.map((opt, idx) => {
              const isSelected = selectedOption === opt.text;
              let cardStyle = 'bg-white border-2 border-slate-200 border-b-4 hover:bg-slate-50';

              if (feedback !== 'idle') {
                if (opt.text === exercise.correctAnswer) {
                  cardStyle = 'bg-emerald-100 border-2 border-emerald-500 border-b-4 text-emerald-800';
                } else if (isSelected && feedback === 'incorrect') {
                  cardStyle = 'bg-rose-100 border-2 border-rose-500 border-b-4 text-rose-800';
                }
              } else if (isSelected) {
                cardStyle = 'bg-sky-100 border-2 border-sky-400 border-b-4 text-sky-700 shadow-md';
              }

              return (
                <button
                  key={idx}
                  disabled={feedback !== 'idle'}
                  onClick={() => {
                    soundFx.playClick();
                    setSelectedOption(opt.text);
                  }}
                  className={`p-4 sm:p-5 rounded-2xl flex sm:flex-col items-center justify-between sm:justify-between min-h-[90px] sm:min-h-[160px] transition-all relative ${cardStyle}`}
                >
                  <div className="text-3xl sm:text-5xl my-1">{opt.icon || '📘'}</div>
                  <span className="font-black text-base sm:text-lg">{opt.text}</span>
                  <span className="text-xs font-black text-slate-400 border-2 border-slate-200 rounded-lg px-2 py-0.5 shadow-sm">
                    {idx + 1}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {/* Multiple Choice List */}
        {(exercise.type === 'multiple_choice' || exercise.type === 'fill_blank' || exercise.type === 'listening' || exercise.type === 'true_false') && exercise.options && (
          <div className="flex flex-col gap-3.5 max-w-lg mx-auto mb-8">
            {exercise.options.map((opt, idx) => {
              const isSelected = selectedOption === opt.text;
              let optionStyle = 'option-btn-default';

              if (feedback !== 'idle') {
                if (opt.text === exercise.correctAnswer) {
                  optionStyle = 'option-btn-correct';
                } else if (isSelected && feedback === 'incorrect') {
                  optionStyle = 'option-btn-incorrect';
                }
              } else if (isSelected) {
                optionStyle = 'option-btn-selected';
              }

              return (
                <button
                  key={idx}
                  disabled={feedback !== 'idle'}
                  onClick={() => {
                    soundFx.playClick();
                    setSelectedOption(opt.text);
                  }}
                  className={`option-btn group ${optionStyle}`}
                >
                  <span className="option-label group-hover:scale-105 transition-transform">
                    {idx + 1}
                  </span>
                  
                  <span className="option-text flex-1 text-base sm:text-lg font-black tracking-wide">
                    {opt.text}
                  </span>

                  {feedback !== 'idle' && opt.text === exercise.correctAnswer && (
                    <Check className="w-6 h-6 text-emerald-600 stroke-[3] animate-bounce" />
                  )}
                  {feedback !== 'idle' && isSelected && feedback === 'incorrect' && (
                    <X className="w-6 h-6 text-rose-600 stroke-[3]" />
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* Sentence Builder */}
        {exercise.type === 'sentence_builder' && (
          <div className="sentence-builder-area max-w-lg mx-auto mb-6">
            <div className="selected-words-box">
              {selectedWords.length === 0 ? (
                <span className="placeholder-text text-sm sm:text-base">Toque nas palavras para montar a frase...</span>
              ) : (
                selectedWords.map((word, idx) => (
                  <button
                    key={idx}
                    disabled={feedback !== 'idle'}
                    onClick={() => handleRemoveWordChip(word, idx)}
                    className="word-chip chip-selected"
                  >
                    {word}
                  </button>
                ))
              )}
            </div>

            <div className="available-words-pool">
              {availableWords.map((word, idx) => (
                <button
                  key={idx}
                  disabled={feedback !== 'idle'}
                  onClick={() => handleSelectWordChip(word, idx)}
                  className="word-chip chip-available"
                >
                  {word}
                </button>
              ))}
            </div>

            {selectedWords.length > 0 && feedback === 'idle' && (
              <button
                onClick={() => {
                  soundFx.playPop();
                  setAvailableWords(exercise.words || []);
                  setSelectedWords([]);
                }}
                className="reset-chips-btn"
              >
                <RefreshCw className="w-4 h-4" /> Recomeçar
              </button>
            )}
          </div>
        )}

      </div>

      {/* Action Bar */}
      {feedback === 'idle' && (
        <div className="card-actions flex items-center justify-between max-w-4xl mx-auto px-4 py-3">
          <button onClick={handleSkip} className="secondary-btn px-6 sm:px-8">
            PULAR
          </button>

          <button
            disabled={isCheckDisabled}
            onClick={handleSubmit}
            className="check-answer-btn px-6 sm:px-10 py-3"
          >
            VERIFICAR
          </button>
        </div>
      )}

      {/* Feedback Banner */}
      {feedback !== 'idle' && (
        <div className={`feedback-banner-fixed ${feedback === 'correct' ? 'banner-correct' : 'banner-incorrect'}`}>
          <div className="feedback-banner-content max-w-4xl mx-auto flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center bg-white shadow-md shrink-0 ${feedback === 'correct' ? 'text-emerald-500' : 'text-rose-500'}`}>
                {feedback === 'correct' ? (
                  <Check className="w-7 h-7 sm:w-8 sm:h-8 stroke-[4]" />
                ) : (
                  <X className="w-7 h-7 sm:w-8 sm:h-8 stroke-[4]" />
                )}
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h3 className={`feedback-title text-xl sm:text-2xl font-black ${feedback === 'correct' ? 'text-emerald-700' : 'text-rose-700'}`}>
                    {feedback === 'correct' ? 'Excelente!' : 'Que pena!'}
                  </h3>
                  {showComboBanner && (
                    <span className="inline-flex items-center gap-1 bg-amber-400 text-amber-950 font-black text-xs px-2.5 py-0.5 rounded-full animate-bounce">
                      <Flame className="w-3.5 h-3.5 fill-amber-950" /> {currentStreak + 1}x COMBO!
                    </span>
                  )}
                </div>

                <p className="explanation-body text-gray-800 font-bold text-sm sm:text-base">{exercise.explanation}</p>
                {feedback === 'incorrect' && (
                  <p className="correct-answer-hint text-rose-600 font-extrabold text-xs sm:text-sm mt-0.5">
                    Resposta correta: {exercise.correctAnswer}
                  </p>
                )}
                <button className="flex items-center gap-1 text-xs font-black text-gray-400 hover:text-gray-600 mt-1">
                  <Flag className="w-3.5 h-3.5" /> REPORTAR
                </button>
              </div>
            </div>

            <button onClick={onNext} className="next-exercise-btn px-6 sm:px-8 py-3.5 text-base sm:text-lg">
              CONTINUAR
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
