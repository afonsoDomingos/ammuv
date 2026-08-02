import React, { useState, useEffect } from 'react';
import type { Exercise } from '../types/game';
import { soundFx } from '../utils/soundFx';
import { X, Heart, Sparkles, Volume2, Check, RefreshCw, Flag, Flame, Headphones } from 'lucide-react';
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
  const [availableWords, setAvailableWords] = useState<string[]>([]);
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<'idle' | 'correct' | 'incorrect'>('idle');
  const [showComboBanner, setShowComboBanner] = useState(false);

  useEffect(() => {
    setSelectedOption(null);
    setFeedback('idle');
    setShowComboBanner(false);

    if (exercise.type === 'sentence_builder' && exercise.words) {
      const shuffled = [...exercise.words].sort(() => Math.random() - 0.5);
      setAvailableWords(shuffled);
      setSelectedWords([]);
    }

    // Auto-play audio for listening questions!
    if (exercise.type === 'listening' && exercise.speakerText) {
      const timer = setTimeout(() => {
        speakText(exercise.speakerText!);
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [exercise]);

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

  const handleSubmit = () => {
    if (feedback !== 'idle') return;

    let isCorrect = false;

    if (exercise.type === 'multiple_choice' || exercise.type === 'fill_blank' || exercise.type === 'image_choice' || exercise.type === 'listening' || exercise.type === 'true_false') {
      if (!selectedOption) return;
      isCorrect = selectedOption.trim() === exercise.correctAnswer.trim();
    } else if (exercise.type === 'sentence_builder') {
      const constructedSentence = selectedWords.join(' ').trim();
      isCorrect = constructedSentence === exercise.correctAnswer.trim();
    }

    if (isCorrect) {
      const nextCombo = currentStreak + 1;
      soundFx.playCorrect(nextCombo);
      setFeedback('correct');
      if (nextCombo >= 2) {
        setShowComboBanner(true);
      }
      onAnswer(true);
    } else {
      soundFx.playWrong();
      setFeedback('incorrect');
      onAnswer(false);
    }
  };

  const handleSkip = () => {
    soundFx.playWrong();
    setFeedback('incorrect');
    onAnswer(false);
  };

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.85;
      window.speechSynthesis.speak(utterance);
    }
  };

  const isCheckDisabled =
    (exercise.type === 'sentence_builder' && selectedWords.length === 0) ||
    ((exercise.type === 'multiple_choice' || exercise.type === 'fill_blank' || exercise.type === 'image_choice' || exercise.type === 'listening' || exercise.type === 'true_false') && !selectedOption);

  return (
    <div className="exercise-screen-wrapper flex flex-col min-h-screen justify-between pb-28">
      {/* Duolingo Top Header */}
      <div className="duo-header max-w-4xl mx-auto w-full px-4 py-4 flex items-center gap-4">
        <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 transition">
          <X className="w-6 h-6 stroke-[3]" />
        </button>

        <div className="progress-track flex-1">
          <div 
            className="progress-fill" 
            style={{ width: `${((currentIndex + 1) / totalExercises) * 100}%` }}
          />
        </div>

        <div className="flex items-center gap-1 text-red-500 font-extrabold text-lg">
          <Heart className="w-6 h-6 fill-red-500 text-red-500" />
          <span>{heartsRemaining}</span>
        </div>
      </div>

      {/* Main Content Card */}
      <div className={`exercise-card max-w-3xl mx-auto w-full px-4 py-2 ${feedback === 'incorrect' ? 'shake-animation' : ''}`}>
        
        {/* Badge Pill Tag */}
        {exercise.badgeTag && (
          <div className="flex justify-center mb-3">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-black bg-purple-100 text-purple-600 uppercase tracking-wider shadow-sm">
              <Sparkles className="w-4 h-4" />
              {exercise.badgeTag}
            </span>
          </div>
        )}

        {/* Question Title */}
        <h1 className="text-2xl sm:text-3xl font-black text-center text-gray-800 mb-6">
          {exercise.question}
        </h1>

        {/* Listening Big Speaker Area */}
        {exercise.type === 'listening' && exercise.speakerText && (
          <div className="flex flex-col items-center justify-center my-6">
            <button
              onClick={() => speakText(exercise.speakerText!)}
              className="w-24 h-24 rounded-3xl bg-sky-500 hover:bg-sky-600 active:translate-y-1 text-white flex items-center justify-center shadow-lg border-b-4 border-sky-700 transition"
              title="Ouvir áudio em alta definição"
            >
              <Volume2 className="w-12 h-12 animate-pulse" />
            </button>
            <span className="text-xs font-extrabold text-sky-600 mt-2 flex items-center gap-1">
              <Headphones className="w-3.5 h-3.5" /> Toque para ouvir novamente
            </span>
          </div>
        )}

        {/* Standard Mascot & Speech Bubble Header */}
        {exercise.type !== 'listening' && exercise.speakerText && (
          <div className="mascot-container justify-center mb-8">
            <Mascot 
              size="md"
              mood={feedback === 'correct' ? 'excited' : feedback === 'incorrect' ? 'sad' : 'happy'}
            />
            <div className="mascot-speech-bubble flex items-center gap-3 max-w-md">
              <button 
                onClick={() => speakText(exercise.speakerText!)}
                className="p-2.5 rounded-xl bg-sky-100 hover:bg-sky-200 text-sky-600 transition shrink-0"
              >
                <Volume2 className="w-6 h-6 text-sky-500" />
              </button>
              <div>
                <span className="text-xl font-extrabold text-gray-800 underline decoration-dotted decoration-purple-400">
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
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto mb-6">
            {exercise.options.map((opt, idx) => {
              const isSelected = selectedOption === opt.text;
              let cardStyle = 'bg-white border-2 border-gray-200 border-b-4 hover:bg-gray-50';

              if (feedback !== 'idle') {
                if (opt.text === exercise.correctAnswer) {
                  cardStyle = 'bg-emerald-100 border-2 border-emerald-500 border-b-4 text-emerald-800';
                } else if (isSelected && feedback === 'incorrect') {
                  cardStyle = 'bg-rose-100 border-2 border-rose-500 border-b-4 text-rose-800';
                }
              } else if (isSelected) {
                cardStyle = 'bg-sky-100 border-2 border-sky-400 border-b-4 text-sky-700';
              }

              return (
                <button
                  key={idx}
                  disabled={feedback !== 'idle'}
                  onClick={() => {
                    soundFx.playClick();
                    setSelectedOption(opt.text);
                  }}
                  className={`p-5 rounded-2xl flex flex-col items-center justify-between min-h-[160px] transition-all relative ${cardStyle}`}
                >
                  <div className="text-5xl my-2">{opt.icon || '📘'}</div>
                  <span className="font-extrabold text-base">{opt.text}</span>
                  <span className="absolute bottom-2 right-2 text-xs font-bold text-gray-400 border border-gray-200 rounded-md px-1.5 py-0.5">
                    {idx + 1}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {/* Multiple Choice & Listening Options */}
        {(exercise.type === 'multiple_choice' || exercise.type === 'fill_blank' || exercise.type === 'listening' || exercise.type === 'true_false') && exercise.options && (
          <div className="flex flex-col gap-3 max-w-md mx-auto mb-6">
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
                  className={`option-btn ${optionStyle}`}
                >
                  <span className="option-label">{idx + 1}</span>
                  <span className="option-text flex-1">{opt.text}</span>
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
                <span className="placeholder-text">Toque nas palavras para montar a frase...</span>
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

      {/* Duolingo Action Bar (Idle) */}
      {feedback === 'idle' && (
        <div className="card-actions flex items-center justify-between max-w-4xl mx-auto px-4">
          <button onClick={handleSkip} className="action-btn px-6 py-3 text-gray-500 font-extrabold border-2 border-gray-200 border-b-4 rounded-2xl hover:bg-gray-100">
            PULAR
          </button>

          <button
            disabled={isCheckDisabled}
            onClick={handleSubmit}
            className="check-answer-btn px-8 py-3"
          >
            VERIFICAR
          </button>
        </div>
      )}

      {/* Duolingo Fixed Feedback Banner */}
      {feedback !== 'idle' && (
        <div className={`feedback-banner-fixed ${feedback === 'correct' ? 'banner-correct' : 'banner-incorrect'}`}>
          <div className="feedback-banner-content max-w-4xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`w-14 h-14 rounded-full flex items-center justify-center bg-white shadow-md ${feedback === 'correct' ? 'text-emerald-500' : 'text-rose-500'}`}>
                {feedback === 'correct' ? (
                  <Check className="w-8 h-8 stroke-[4]" />
                ) : (
                  <X className="w-8 h-8 stroke-[4]" />
                )}
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h3 className={`feedback-title text-2xl font-black ${feedback === 'correct' ? 'text-emerald-700' : 'text-rose-700'}`}>
                    {feedback === 'correct' ? 'Excelente!' : 'Que pena!'}
                  </h3>
                  {showComboBanner && (
                    <span className="inline-flex items-center gap-1 bg-amber-400 text-amber-950 font-black text-xs px-2.5 py-0.5 rounded-full animate-bounce">
                      <Flame className="w-3.5 h-3.5 fill-amber-950" /> {currentStreak + 1}x COMBO!
                    </span>
                  )}
                </div>

                <p className="explanation-body text-gray-800 font-bold">{exercise.explanation}</p>
                {feedback === 'incorrect' && (
                  <p className="correct-answer-hint text-rose-600 font-extrabold mt-1">
                    Resposta correta: {exercise.correctAnswer}
                  </p>
                )}
                <button className="flex items-center gap-1 text-xs font-black text-gray-400 hover:text-gray-600 mt-2">
                  <Flag className="w-3.5 h-3.5" /> REPORTAR
                </button>
              </div>
            </div>

            <button onClick={onNext} className="next-exercise-btn px-8 py-4 text-lg">
              CONTINUAR
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
