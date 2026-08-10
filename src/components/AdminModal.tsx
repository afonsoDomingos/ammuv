import React, { useState } from 'react';
import type { Exercise, ExerciseType, TopicCategory, OptionItem, MatchingPair } from '../types/game';
import { TOPIC_CATEGORIES, ALL_LEARNING_MODULES } from '../data/englishTopicsData';
import { 
  getCustomQuestions, 
  saveCustomQuestion, 
  deleteCustomQuestion, 
  exportCustomQuestionsJson, 
  importCustomQuestionsJson,
  type CustomQuestionItem 
} from '../services/customQuestionService';
import { soundFx } from '../utils/soundFx';
import { 
  X, 
  PlusCircle, 
  List, 
  Download, 
  Upload, 
  Trash2, 
  Check, 
  HelpCircle, 
  Volume2, 
  Sparkles, 
  FileText,
  Copy,
  Lock,
  Key
} from 'lucide-react';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  onQuestionsUpdated: () => void;
}

export const AdminModal: React.FC<AdminModalProps> = ({
  isOpen,
  onClose,
  onQuestionsUpdated
}) => {
  const [activeTab, setActiveTab] = useState<'create' | 'manage' | 'json'>('create');
  
  // Selection State
  const [selectedTopic, setSelectedTopic] = useState<TopicCategory>('verb_to_be');
  const availableModules = ALL_LEARNING_MODULES.filter(m => m.topicId === selectedTopic || (!m.topicId && selectedTopic === 'verb_to_be'));
  const [selectedModuleId, setSelectedModuleId] = useState<string>(availableModules[0]?.id || 'vtb-m1');
  const [exerciseType, setExerciseType] = useState<ExerciseType>('multiple_choice');

  // Form Fields State
  const [badgeTag, setBadgeTag] = useState<string>('PALAVRA NOVA');
  const [questionText, setQuestionText] = useState<string>('');
  const [speakerText, setSpeakerText] = useState<string>('');
  const [contextPt, setContextPt] = useState<string>('');
  const [explanation, setExplanation] = useState<string>('');

  // Modality Specific Form Fields
  // Multiple Choice / Listening / Fill Blank
  const [options, setOptions] = useState<string[]>(['', '', '', '']);
  const [correctOptionIdx, setCorrectOptionIdx] = useState<number>(0);

  // Sentence Builder
  const [sentenceWords, setSentenceWords] = useState<string>('I, am, happy, today');
  const [sentenceCorrect, setSentenceCorrect] = useState<string>('I am happy today');

  // Image Choice
  const [imageOptions, setImageOptions] = useState<{ text: string; icon: string }[]>([
    { text: 'Apple', icon: '🍎' },
    { text: 'Water', icon: '💧' },
    { text: 'Bread', icon: '🍞' }
  ]);
  const [imageCorrectIdx, setImageCorrectIdx] = useState<number>(0);

  // True / False
  const [tfCorrect, setTfCorrect] = useState<string>('True');

  // Pair Matching
  const [pairs, setPairs] = useState<MatchingPair[]>([
    { id: 'p1', en: 'Water', pt: 'Água' },
    { id: 'p2', en: 'Milk', pt: 'Leite' },
    { id: 'p3', en: 'Coffee', pt: 'Café' }
  ]);

  // JSON Import/Export State
  const [jsonString, setJsonString] = useState<string>('');
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Auth Lock State
  const [isUnlocked, setIsUnlocked] = useState<boolean>(() => {
    return sessionStorage.getItem('muvlern_admin_unlocked') === 'true';
  });
  const [passwordInput, setPasswordInput] = useState<string>('');
  const [loginError, setLoginError] = useState<string | null>(null);

  const handleLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanPwd = passwordInput.trim().toLowerCase();
    if (cleanPwd === 'admin' || cleanPwd === 'admin123' || cleanPwd === '1234') {
      soundFx.playVictory();
      setIsUnlocked(true);
      sessionStorage.setItem('muvlern_admin_unlocked', 'true');
      setLoginError(null);
    } else {
      soundFx.playWrong();
      setLoginError('Senha incorreta! Use: admin123 ou PIN: 1234');
    }
  };

  if (!isOpen) return null;

  // Render Authentication Gate if locked
  if (!isUnlocked) {
    return (
      <div className="modal-backdrop" onClick={onClose}>
        <div className="modal-card max-w-md" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header bg-slate-900 text-white rounded-t-[26px]">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-500 rounded-xl text-white shadow-md">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h2 className="modal-title text-white">Painel do Administrador</h2>
                <p className="text-xs text-slate-400 font-bold">Acesso Restrito</p>
              </div>
            </div>
            <button className="close-btn" onClick={() => { soundFx.playClick(); onClose(); }}>
              <X className="w-5 h-5 text-slate-700" />
            </button>
          </div>

          <form onSubmit={handleLogin} className="p-6 space-y-4 bg-slate-50">
            <div className="text-center space-y-2">
              <div className="w-14 h-14 mx-auto rounded-full bg-emerald-100 border-2 border-emerald-300 flex items-center justify-center text-emerald-700">
                <Key className="w-7 h-7" />
              </div>
              <h3 className="font-black text-lg text-slate-800">Identificação de Administrador</h3>
              <p className="text-xs font-bold text-slate-500">
                Digite a senha de administrador para gerenciar o banco de questões.
              </p>
            </div>

            <div className="p-3 bg-emerald-50 border-2 border-emerald-200 rounded-2xl text-xs font-bold text-emerald-900 space-y-1">
              <p className="flex items-center gap-1 font-black text-emerald-800">
                <Sparkles className="w-4 h-4 text-emerald-600" /> Credenciais de Acesso:
              </p>
              <p>• <strong>Senha Padrão:</strong> <code className="bg-white px-2 py-0.5 rounded border border-emerald-300 font-black">admin123</code></p>
              <p>• <strong>PIN Rápido:</strong> <code className="bg-white px-2 py-0.5 rounded border border-emerald-300 font-black">1234</code></p>
            </div>

            {loginError && (
              <div className="p-3 bg-rose-100 border border-rose-300 text-rose-700 rounded-xl text-xs font-black text-center">
                {loginError}
              </div>
            )}

            <div>
              <label className="block text-xs font-black text-slate-600 uppercase mb-1">
                Senha / PIN
              </label>
              <input
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="Digite admin123 ou 1234..."
                className="w-full p-3 rounded-xl border-2 border-slate-200 font-extrabold text-base outline-none focus:border-emerald-500 bg-white"
                autoFocus
              />
            </div>

            <div className="space-y-2 pt-2">
              <button type="submit" className="primary-btn w-full py-3 text-base">
                <Lock className="w-4 h-4" /> Entrar no Painel Admin
              </button>

              <button
                type="button"
                onClick={() => {
                  setPasswordInput('admin123');
                  setTimeout(() => handleLogin(), 100);
                }}
                className="secondary-btn w-full py-2.5 text-xs text-emerald-700 border-emerald-200"
              >
                ⚡ Preencher & Logar Automaticamente
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  const showFeedback = (text: string, type: 'success' | 'error' = 'success') => {
    setFeedbackMsg({ text, type });
    setTimeout(() => setFeedbackMsg(null), 3000);
  };

  const handleCreateQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    soundFx.playClick();

    if (!questionText.trim()) {
      showFeedback('Por favor, digite o enunciado da pergunta.', 'error');
      return;
    }

    const newId = `custom-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    let createdExercise: Exercise;

    switch (exerciseType) {
      case 'multiple_choice':
      case 'fill_blank':
      case 'listening': {
        const cleanOpts: OptionItem[] = options
          .filter(o => o.trim().length > 0)
          .map(o => ({ text: o.trim() }));

        if (cleanOpts.length < 2) {
          showFeedback('Preencha pelo menos 2 opções de resposta.', 'error');
          return;
        }

        const selectedAnswer = cleanOpts[correctOptionIdx]?.text || cleanOpts[0].text;

        createdExercise = {
          id: newId,
          type: exerciseType,
          badgeTag,
          question: questionText,
          speakerText: speakerText.trim() || undefined,
          contextPt: contextPt.trim() || undefined,
          options: cleanOpts,
          correctAnswer: selectedAnswer,
          explanation: explanation.trim() || `A resposta correta é: ${selectedAnswer}.`
        };
        break;
      }

      case 'sentence_builder': {
        const wordsArray = sentenceWords
          .split(',')
          .map(w => w.trim())
          .filter(w => w.length > 0);

        if (wordsArray.length === 0 || !sentenceCorrect.trim()) {
          showFeedback('Preencha o banco de palavras e a frase correta.', 'error');
          return;
        }

        createdExercise = {
          id: newId,
          type: 'sentence_builder',
          badgeTag,
          question: questionText,
          speakerText: speakerText.trim() || undefined,
          contextPt: contextPt.trim() || undefined,
          words: wordsArray,
          correctAnswer: sentenceCorrect.trim(),
          explanation: explanation.trim() || `Frase montada corretamente: "${sentenceCorrect.trim()}".`
        };
        break;
      }

      case 'image_choice': {
        const cleanImgOpts = imageOptions.filter(o => o.text.trim().length > 0);
        if (cleanImgOpts.length < 2) {
          showFeedback('Preencha pelo menos 2 opções com ícones.', 'error');
          return;
        }

        const selectedAnswer = cleanImgOpts[imageCorrectIdx]?.text || cleanImgOpts[0].text;

        createdExercise = {
          id: newId,
          type: 'image_choice',
          badgeTag,
          question: questionText,
          speakerText: speakerText.trim() || undefined,
          contextPt: contextPt.trim() || undefined,
          options: cleanImgOpts,
          correctAnswer: selectedAnswer,
          explanation: explanation.trim() || `A imagem/ícone correto representa: ${selectedAnswer}.`
        };
        break;
      }

      case 'true_false': {
        createdExercise = {
          id: newId,
          type: 'true_false',
          badgeTag,
          question: questionText,
          speakerText: speakerText.trim() || undefined,
          contextPt: contextPt.trim() || undefined,
          options: [{ text: 'True' }, { text: 'False' }],
          correctAnswer: tfCorrect,
          explanation: explanation.trim() || `Afirmação é ${tfCorrect === 'True' ? 'Verdadeira' : 'Falsa'}.`
        };
        break;
      }

      case 'pair_matching': {
        const cleanPairs = pairs.filter(p => p.en.trim() && p.pt.trim());
        if (cleanPairs.length < 2) {
          showFeedback('Adicione pelo menos 2 pares de palavras.', 'error');
          return;
        }

        createdExercise = {
          id: newId,
          type: 'pair_matching',
          badgeTag,
          question: questionText,
          correctAnswer: 'matched_all',
          pairs: cleanPairs,
          explanation: explanation.trim() || 'Você combinou todos os pares de palavras com sucesso!'
        };
        break;
      }

      case 'audio_dictation': {
        if (!speakerText.trim() || !sentenceCorrect.trim()) {
          showFeedback('Preencha o áudio para tocar e a resposta escrita esperada.', 'error');
          return;
        }

        createdExercise = {
          id: newId,
          type: 'audio_dictation',
          badgeTag,
          question: questionText || 'Escute o áudio e digite o que você ouviu:',
          speakerText: speakerText.trim(),
          correctAnswer: sentenceCorrect.trim(),
          explanation: explanation.trim() || `O texto falado foi: "${sentenceCorrect.trim()}".`
        };
        break;
      }

      default:
        showFeedback('Modalidade inválida.', 'error');
        return;
    }

    saveCustomQuestion(createdExercise, selectedTopic, selectedModuleId);
    onQuestionsUpdated();
    showFeedback('Pergunta adicionada manualmente com sucesso! 🎉');

    // Reset Form fields
    setQuestionText('');
    setSpeakerText('');
    setContextPt('');
    setExplanation('');
  };

  const handleDeleteQuestion = (id: string) => {
    soundFx.playClick();
    deleteCustomQuestion(id);
    onQuestionsUpdated();
    showFeedback('Pergunta removida.');
  };

  const handleExportJson = () => {
    soundFx.playClick();
    const exported = exportCustomQuestionsJson();
    setJsonString(exported);
    navigator.clipboard?.writeText(exported);
    showFeedback('JSON copiado para a área de transferência! 📋');
  };

  const handleImportJson = () => {
    soundFx.playClick();
    if (!jsonString.trim()) {
      showFeedback('Cole um JSON válido na caixa abaixo.', 'error');
      return;
    }
    const success = importCustomQuestionsJson(jsonString);
    if (success) {
      onQuestionsUpdated();
      showFeedback('Perguntas importadas com sucesso! 🎉');
    } else {
      showFeedback('Erro ao importar JSON. Verifique a formatação.', 'error');
    }
  };

  const customQuestionsList: CustomQuestionItem[] = getCustomQuestions();

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card max-w-3xl h-[85vh]" onClick={(e) => e.stopPropagation()}>
        
        {/* Header */}
        <div className="modal-header bg-slate-900 text-white rounded-t-[26px]">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500 rounded-xl text-white shadow-md">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="modal-title text-white flex items-center gap-2">
                Painel do Administrador
              </h2>
              <p className="text-xs text-slate-400 font-bold">Gerenciador de Perguntas & Exercícios</p>
            </div>
          </div>
          <button 
            className="close-btn"
            onClick={() => { soundFx.playClick(); onClose(); }}
          >
            <X className="w-5 h-5 text-slate-700" />
          </button>
        </div>

        {/* Feedback Alert Toast */}
        {feedbackMsg && (
          <div className={`px-4 py-2.5 text-xs font-black text-center ${
            feedbackMsg.type === 'success' ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'
          }`}>
            {feedbackMsg.text}
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="grammar-tabs bg-slate-100 border-b border-slate-200">
          <button 
            className={`tab-btn flex items-center justify-center gap-2 ${activeTab === 'create' ? 'active' : ''}`}
            onClick={() => { soundFx.playClick(); setActiveTab('create'); }}
          >
            <PlusCircle className="w-4 h-4 text-emerald-600" /> Criar Pergunta
          </button>

          <button 
            className={`tab-btn flex items-center justify-center gap-2 ${activeTab === 'manage' ? 'active' : ''}`}
            onClick={() => { soundFx.playClick(); setActiveTab('manage'); }}
          >
            <List className="w-4 h-4 text-sky-600" /> Cadastradas ({customQuestionsList.length})
          </button>

          <button 
            className={`tab-btn flex items-center justify-center gap-2 ${activeTab === 'json' ? 'active' : ''}`}
            onClick={() => { soundFx.playClick(); setActiveTab('json'); }}
          >
            <Download className="w-4 h-4 text-purple-600" /> JSON Backup
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 p-5 overflow-y-auto bg-slate-50">

          {/* TAB 1: CREATE QUESTION FORM */}
          {activeTab === 'create' && (
            <form onSubmit={handleCreateQuestion} className="space-y-5">
              
              {/* Topic & Module Pickers */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-white rounded-2xl border-2 border-slate-200 shadow-sm">
                <div>
                  <label className="block text-xs font-black text-slate-600 uppercase mb-1.5">
                    1. Escolha o Tópico
                  </label>
                  <select
                    value={selectedTopic}
                    onChange={(e) => {
                      const topId = e.target.value as TopicCategory;
                      setSelectedTopic(topId);
                      const mods = ALL_LEARNING_MODULES.filter(m => m.topicId === topId || (!m.topicId && topId === 'verb_to_be'));
                      if (mods.length > 0) setSelectedModuleId(mods[0].id);
                    }}
                    className="w-full p-2.5 rounded-xl border-2 border-slate-200 font-extrabold text-sm outline-none focus:border-emerald-500 bg-white"
                  >
                    {TOPIC_CATEGORIES.map(t => (
                      <option key={t.id} value={t.id}>{t.title}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-600 uppercase mb-1.5">
                    2. Escolha o Módulo Destino
                  </label>
                  <select
                    value={selectedModuleId}
                    onChange={(e) => setSelectedModuleId(e.target.value)}
                    className="w-full p-2.5 rounded-xl border-2 border-slate-200 font-extrabold text-sm outline-none focus:border-emerald-500 bg-white"
                  >
                    {availableModules.map(m => (
                      <option key={m.id} value={m.id}>{m.title}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Exercise Modality Picker */}
              <div className="p-4 bg-white rounded-2xl border-2 border-slate-200 shadow-sm">
                <label className="block text-xs font-black text-slate-600 uppercase mb-2">
                  3. Modalidade da Questão (Tipo de Exercício)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'multiple_choice', label: 'Múltipla Escolha', icon: '📝' },
                    { id: 'sentence_builder', label: 'Montar Frase', icon: '🧩' },
                    { id: 'fill_blank', label: 'Preencher Lacuna', icon: '✍️' },
                    { id: 'image_choice', label: 'Escolha c/ Ícone', icon: '🖼️' },
                    { id: 'true_false', label: 'Verdadeiro/Falso', icon: '⚖️' },
                    { id: 'listening', label: 'Escuta e Resposta', icon: '🎧' },
                    { id: 'pair_matching', label: 'Pares de Palavras', icon: '🎴' },
                    { id: 'audio_dictation', label: 'Ditado de Áudio', icon: '🎙️' }
                  ].map(mod => (
                    <button
                      type="button"
                      key={mod.id}
                      onClick={() => setExerciseType(mod.id as ExerciseType)}
                      className={`p-2.5 rounded-xl font-black text-xs border-2 text-center transition flex flex-col items-center gap-1 ${
                        exerciseType === mod.id
                          ? 'bg-emerald-50 border-emerald-500 text-emerald-800 shadow-sm'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <span className="text-lg">{mod.icon}</span>
                      <span>{mod.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Question Enunciado & Common Fields */}
              <div className="p-4 bg-white rounded-2xl border-2 border-slate-200 shadow-sm space-y-4">
                <div>
                  <label className="block text-xs font-black text-slate-600 uppercase mb-1">
                    Enunciado da Pergunta *
                  </label>
                  <input
                    type="text"
                    value={questionText}
                    onChange={(e) => setQuestionText(e.target.value)}
                    placeholder="Ex: Como se diz 'Eu sou um estudante' em inglês?"
                    className="w-full p-3 rounded-xl border-2 border-slate-200 font-extrabold text-sm outline-none focus:border-emerald-500"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-black text-slate-600 uppercase mb-1">
                      Áudio Pronunciado (speakerText)
                    </label>
                    <input
                      type="text"
                      value={speakerText}
                      onChange={(e) => setSpeakerText(e.target.value)}
                      placeholder="Ex: I am a student."
                      className="w-full p-2.5 rounded-xl border-2 border-slate-200 font-extrabold text-sm outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black text-slate-600 uppercase mb-1">
                      Tag / Badge da Pergunta
                    </label>
                    <select
                      value={badgeTag}
                      onChange={(e) => setBadgeTag(e.target.value)}
                      className="w-full p-2.5 rounded-xl border-2 border-slate-200 font-extrabold text-sm outline-none focus:border-emerald-500 bg-white"
                    >
                      <option value="PALAVRA NOVA">PALAVRA NOVA 🌟</option>
                      <option value="REVISÃO">REVISÃO 🔄</option>
                      <option value="CULTURA & DICAS">CULTURA & DICAS 💡</option>
                      <option value="DESAFIO IA">DESAFIO IA 🤖</option>
                      <option value="PARES DE PALAVRAS">PARES DE PALAVRAS 🎴</option>
                      <option value="ESCUTE O ÁUDIO">ESCUTE O ÁUDIO 🎧</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* DYNAMIC FORM PER MODALITY */}
              <div className="p-4 bg-white rounded-2xl border-2 border-slate-200 shadow-sm space-y-4">
                <h4 className="text-xs font-black text-purple-700 uppercase tracking-wider">
                  Configuração Específica: {exerciseType.toUpperCase()}
                </h4>

                {/* 1. MULTIPLE CHOICE / FILL BLANK / LISTENING */}
                {(exerciseType === 'multiple_choice' || exerciseType === 'fill_blank' || exerciseType === 'listening') && (
                  <div className="space-y-3">
                    <p className="text-xs font-bold text-slate-500">
                      Digite as opções e marque a caixa da <strong>resposta correta</strong>:
                    </p>
                    {options.map((opt, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="correctOption"
                          checked={correctOptionIdx === idx}
                          onChange={() => setCorrectOptionIdx(idx)}
                          className="w-5 h-5 accent-emerald-600 cursor-pointer"
                        />
                        <span className="font-black text-xs text-slate-500 w-6">#{idx + 1}</span>
                        <input
                          type="text"
                          value={opt}
                          onChange={(e) => {
                            const newOpts = [...options];
                            newOpts[idx] = e.target.value;
                            setOptions(newOpts);
                          }}
                          placeholder={`Opção ${idx + 1}`}
                          className="flex-1 p-2.5 rounded-xl border-2 border-slate-200 font-extrabold text-sm outline-none focus:border-emerald-500"
                        />
                      </div>
                    ))}
                  </div>
                )}

                {/* 2. SENTENCE BUILDER */}
                {exerciseType === 'sentence_builder' && (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-black text-slate-600 uppercase mb-1">
                        Banco de Palavras (separadas por vírgula)
                      </label>
                      <input
                        type="text"
                        value={sentenceWords}
                        onChange={(e) => setSentenceWords(e.target.value)}
                        placeholder="I, am, happy, today, is, you"
                        className="w-full p-2.5 rounded-xl border-2 border-slate-200 font-extrabold text-sm outline-none focus:border-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-black text-slate-600 uppercase mb-1">
                        Frase Correta Esperada
                      </label>
                      <input
                        type="text"
                        value={sentenceCorrect}
                        onChange={(e) => setSentenceCorrect(e.target.value)}
                        placeholder="I am happy today"
                        className="w-full p-2.5 rounded-xl border-2 border-slate-200 font-extrabold text-sm outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>
                )}

                {/* 3. IMAGE CHOICE */}
                {exerciseType === 'image_choice' && (
                  <div className="space-y-3">
                    {imageOptions.map((opt, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="correctImgOption"
                          checked={imageCorrectIdx === idx}
                          onChange={() => setImageCorrectIdx(idx)}
                          className="w-5 h-5 accent-emerald-600 cursor-pointer"
                        />
                        <input
                          type="text"
                          value={opt.icon}
                          onChange={(e) => {
                            const newOpts = [...imageOptions];
                            newOpts[idx].icon = e.target.value;
                            setImageOptions(newOpts);
                          }}
                          placeholder="Ícone/Emoji (ex: 🍎)"
                          className="w-20 p-2.5 rounded-xl border-2 border-slate-200 text-center font-black text-xl"
                        />
                        <input
                          type="text"
                          value={opt.text}
                          onChange={(e) => {
                            const newOpts = [...imageOptions];
                            newOpts[idx].text = e.target.value;
                            setImageOptions(newOpts);
                          }}
                          placeholder="Nome da Opção (ex: Apple)"
                          className="flex-1 p-2.5 rounded-xl border-2 border-slate-200 font-extrabold text-sm outline-none focus:border-emerald-500"
                        />
                      </div>
                    ))}
                  </div>
                )}

                {/* 4. TRUE / FALSE */}
                {exerciseType === 'true_false' && (
                  <div className="flex items-center gap-6">
                    <label className="flex items-center gap-2 font-black text-sm text-slate-700 cursor-pointer">
                      <input
                        type="radio"
                        name="tf"
                        value="True"
                        checked={tfCorrect === 'True'}
                        onChange={() => setTfCorrect('True')}
                        className="w-5 h-5 accent-emerald-600"
                      />
                      ✅ Verdadeiro (True)
                    </label>

                    <label className="flex items-center gap-2 font-black text-sm text-slate-700 cursor-pointer">
                      <input
                        type="radio"
                        name="tf"
                        value="False"
                        checked={tfCorrect === 'False'}
                        onChange={() => setTfCorrect('False')}
                        className="w-5 h-5 accent-rose-600"
                      />
                      ❌ Falso (False)
                    </label>
                  </div>
                )}

                {/* 5. PAIR MATCHING */}
                {exerciseType === 'pair_matching' && (
                  <div className="space-y-3">
                    <p className="text-xs font-bold text-slate-500">Cadastre os pares em inglês e português:</p>
                    {pairs.map((p, idx) => (
                      <div key={p.id} className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          value={p.en}
                          onChange={(e) => {
                            const newPairs = [...pairs];
                            newPairs[idx].en = e.target.value;
                            setPairs(newPairs);
                          }}
                          placeholder={`Inglês #${idx + 1}`}
                          className="p-2.5 rounded-xl border-2 border-slate-200 font-extrabold text-sm"
                        />
                        <input
                          type="text"
                          value={p.pt}
                          onChange={(e) => {
                            const newPairs = [...pairs];
                            newPairs[idx].pt = e.target.value;
                            setPairs(newPairs);
                          }}
                          placeholder={`Português #${idx + 1}`}
                          className="p-2.5 rounded-xl border-2 border-slate-200 font-extrabold text-sm"
                        />
                      </div>
                    ))}
                  </div>
                )}

                {/* 6. AUDIO DICTATION */}
                {exerciseType === 'audio_dictation' && (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-black text-slate-600 uppercase mb-1">
                        Áudio a ser falado pelo sintetizador
                      </label>
                      <input
                        type="text"
                        value={speakerText}
                        onChange={(e) => setSpeakerText(e.target.value)}
                        placeholder="Ex: Good morning, how are you?"
                        className="w-full p-2.5 rounded-xl border-2 border-slate-200 font-extrabold text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-black text-slate-600 uppercase mb-1">
                        Resposta Exata Esperada do Aluno
                      </label>
                      <input
                        type="text"
                        value={sentenceCorrect}
                        onChange={(e) => setSentenceCorrect(e.target.value)}
                        placeholder="Ex: Good morning, how are you?"
                        className="w-full p-2.5 rounded-xl border-2 border-slate-200 font-extrabold text-sm"
                      />
                    </div>
                  </div>
                )}

                {/* Explanation Field */}
                <div>
                  <label className="block text-xs font-black text-slate-600 uppercase mb-1">
                    Explicação Pedagógica (exibida após resposta)
                  </label>
                  <textarea
                    rows={2}
                    value={explanation}
                    onChange={(e) => setExplanation(e.target.value)}
                    placeholder="Ex: Usamos 'AM' sempre que o sujeito for 'I' (Eu)."
                    className="w-full p-3 rounded-xl border-2 border-slate-200 font-extrabold text-sm outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button type="submit" className="primary-btn w-full py-3.5 text-base">
                <PlusCircle className="w-5 h-5" /> Adicionar Pergunta Manualmente
              </button>
            </form>
          )}

          {/* TAB 2: MANAGE QUESTIONS LIST */}
          {activeTab === 'manage' && (
            <div className="space-y-4">
              {customQuestionsList.length === 0 ? (
                <div className="text-center py-12 text-slate-400">
                  <HelpCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p className="font-extrabold text-base">Nenhuma pergunta manual cadastrada ainda.</p>
                  <p className="text-xs">Use a aba "Criar Pergunta" para adicionar seus próprios exercícios!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {customQuestionsList.map((item) => (
                    <div 
                      key={item.question.id}
                      className="p-4 bg-white rounded-2xl border-2 border-slate-200 border-b-4 flex items-center justify-between gap-3 shadow-sm"
                    >
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-purple-100 text-purple-700 uppercase">
                            {item.question.type}
                          </span>
                          <span className="text-xs font-extrabold text-slate-400">
                            Módulo: {item.moduleId}
                          </span>
                        </div>
                        <h4 className="font-black text-sm text-slate-800">{item.question.question}</h4>
                        <p className="text-xs font-bold text-emerald-600">
                          Resposta correta: {item.question.correctAnswer}
                        </p>
                      </div>

                      <button
                        onClick={() => handleDeleteQuestion(item.question.id)}
                        className="p-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 transition shrink-0"
                        title="Remover Pergunta"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: JSON IMPORT / EXPORT */}
          {activeTab === 'json' && (
            <div className="space-y-4">
              <div className="p-4 bg-white rounded-2xl border-2 border-slate-200 space-y-3">
                <h4 className="font-black text-sm text-slate-800 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-purple-600" /> Exportar ou Importar em JSON
                </h4>
                <p className="text-xs font-bold text-slate-500">
                  Você pode salvar em arquivo ou transferir suas perguntas customizadas entre diferentes navegadores:
                </p>

                <textarea
                  rows={8}
                  value={jsonString}
                  onChange={(e) => setJsonString(e.target.value)}
                  placeholder="Cole o código JSON de perguntas aqui..."
                  className="w-full p-3 rounded-xl border-2 border-slate-200 font-mono text-xs outline-none focus:border-purple-500"
                />

                <div className="flex flex-col sm:flex-row gap-3">
                  <button onClick={handleExportJson} className="secondary-btn flex-1 py-2.5 text-xs">
                    <Copy className="w-4 h-4" /> Gerar & Copiar JSON
                  </button>

                  <button onClick={handleImportJson} className="primary-btn flex-1 py-2.5 text-xs">
                    <Upload className="w-4 h-4" /> Importar Perguntas do JSON
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="modal-footer justify-between">
          <span className="text-xs font-bold text-slate-400 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-emerald-500" /> MuvLern Admin System
          </span>
          <button className="secondary-btn text-xs px-5 py-2" onClick={() => { soundFx.playClick(); onClose(); }}>
            Fechar Painel
          </button>
        </div>

      </div>
    </div>
  );
};
