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
  HelpCircle, 
  Sparkles, 
  FileText,
  Copy,
  Lock,
  Key,
  ShieldCheck,
  Zap,
  LogOut
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

  const handleLogout = () => {
    soundFx.playClick();
    sessionStorage.removeItem('muvlern_admin_unlocked');
    setIsUnlocked(false);
    setPasswordInput('');
  };

  if (!isOpen) return null;

  // Render Authentication Gate if locked
  if (!isUnlocked) {
    return (
      <div className="modal-backdrop" onClick={onClose}>
        <div className="modal-card max-w-md bg-slate-900 border-2 border-slate-700 border-b-8 border-slate-950 text-white rounded-[28px] shadow-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
          
          {/* Header */}
          <div className="p-5 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center shadow-inner">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <h2 className="font-black text-lg text-white font-['Outfit'] tracking-wide">Painel do Administrador</h2>
                <p className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> Área Restrita & Gestão
                </p>
              </div>
            </div>
            
            <button className="close-btn" onClick={() => { soundFx.playClick(); onClose(); }} title="Fechar">
              <X className="w-5 h-5 text-slate-700" />
            </button>
          </div>

          {/* Form Content */}
          <form onSubmit={handleLogin} className="p-6 space-y-5 bg-slate-900/95">
            <div className="text-center space-y-2">
              <div className="w-16 h-16 mx-auto rounded-3xl bg-gradient-to-b from-emerald-400 to-emerald-600 text-slate-950 flex items-center justify-center shadow-lg shadow-emerald-500/20 border-b-4 border-emerald-700">
                <Key className="w-8 h-8 stroke-[2.5]" />
              </div>
              <h3 className="font-black text-xl text-white font-['Outfit']">Identificação Requerida</h3>
              <p className="text-xs font-bold text-slate-400 leading-relaxed max-w-xs mx-auto">
                Digite a senha de acesso para gerenciar e cadastrar questões no aplicativo.
              </p>
            </div>

            {/* Credenciais Badge Card */}
            <div className="p-4 bg-slate-800/80 border-2 border-slate-700/80 rounded-2xl text-xs space-y-2">
              <p className="flex items-center gap-1.5 font-black text-amber-400 uppercase tracking-wider text-[11px]">
                <Sparkles className="w-3.5 h-3.5 fill-amber-400" /> Credenciais Demonstrativas
              </p>
              <div className="grid grid-cols-2 gap-2 text-slate-200 font-bold">
                <div className="p-2.5 bg-slate-900/90 rounded-xl border border-slate-700 text-center">
                  <span className="text-[10px] text-slate-400 uppercase block font-black mb-0.5">Senha</span>
                  <code className="text-emerald-400 font-black text-sm">admin123</code>
                </div>
                <div className="p-2.5 bg-slate-900/90 rounded-xl border border-slate-700 text-center">
                  <span className="text-[10px] text-slate-400 uppercase block font-black mb-0.5">PIN</span>
                  <code className="text-amber-400 font-black text-sm">1234</code>
                </div>
              </div>
            </div>

            {loginError && (
              <div className="p-3 bg-rose-500/20 border-2 border-rose-500/40 text-rose-300 rounded-xl text-xs font-black text-center animate-shake">
                {loginError}
              </div>
            )}

            <div className="space-y-1.5">
              <label className="block text-xs font-black text-slate-400 uppercase tracking-wider">
                Senha ou PIN de Acesso
              </label>
              <input
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="Digite admin123 ou 1234..."
                className="w-full px-4 py-3.5 rounded-2xl bg-slate-800 border-2 border-slate-700 text-white font-extrabold text-base outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 transition-all placeholder:text-slate-500"
                autoFocus
              />
            </div>

            <div className="space-y-2.5 pt-1">
              <button type="submit" className="primary-btn w-full py-3.5 text-base shadow-lg shadow-emerald-500/20">
                <Lock className="w-5 h-5" /> Entrar no Painel Admin
              </button>

              <button
                type="button"
                onClick={() => {
                  setPasswordInput('admin123');
                  setTimeout(() => handleLogin(), 100);
                }}
                className="w-full py-3 px-4 rounded-2xl bg-emerald-500/10 hover:bg-emerald-500/20 active:translate-y-0.5 text-emerald-400 font-black text-xs border-2 border-emerald-500/30 border-b-4 transition flex items-center justify-center gap-2"
              >
                <Zap className="w-4 h-4 fill-emerald-400" /> Preencher & Entrar Automaticamente
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
      <div className="admin-modal-card" onClick={(e) => e.stopPropagation()}>
        
        {/* Header */}
        <div className="admin-modal-header">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/20 backdrop-blur-md rounded-2xl text-white shadow-md border border-white/30">
              <ShieldCheck className="w-6 h-6 text-amber-300 fill-amber-300" />
            </div>
            <div>
              <h2 className="modal-title text-white font-['Outfit'] font-black tracking-wide text-xl">
                Muv<span className="text-amber-300">Lern</span> <span className="text-xs font-black uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded-full ml-1 text-emerald-100">Admin</span>
              </h2>
              <p className="text-xs text-emerald-100 font-extrabold">Painel de Gestão & Exercícios</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={handleLogout}
              className="px-3 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 font-extrabold text-xs border border-rose-500/40 transition flex items-center gap-1.5"
              title="Fazer Logout do Painel Admin"
            >
              <LogOut className="w-3.5 h-3.5" /> Sair
            </button>

            <button 
              className="close-btn"
              onClick={() => { soundFx.playClick(); onClose(); }}
              title="Fechar"
            >
              <X className="w-5 h-5 text-slate-700" />
            </button>
          </div>
        </div>

        {/* Feedback Alert Toast */}
        {feedbackMsg && (
          <div className={`px-4 py-3 text-xs font-black text-center shadow-md ${
            feedbackMsg.type === 'success' ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'
          }`}>
            {feedbackMsg.text}
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="grammar-tabs bg-slate-100 border-b-2 border-slate-200 p-2">
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
            <form onSubmit={handleCreateQuestion} className="space-y-4">
              
              {/* Topic & Module Pickers Card */}
              <div className="admin-card-section">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="admin-label">
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
                      className="admin-select"
                    >
                      {TOPIC_CATEGORIES.map(t => (
                        <option key={t.id} value={t.id}>{t.title}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="admin-label">
                      2. Escolha o Módulo Destino
                    </label>
                    <select
                      value={selectedModuleId}
                      onChange={(e) => setSelectedModuleId(e.target.value)}
                      className="admin-select"
                    >
                      {availableModules.map(m => (
                        <option key={m.id} value={m.id}>{m.title}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Exercise Modality Picker Card */}
              <div className="admin-card-section">
                <label className="admin-label mb-3">
                  3. Modalidade da Questão (Tipo de Exercício)
                </label>
                <div className="admin-modality-grid">
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
                      className={`admin-modality-btn ${exerciseType === mod.id ? 'active' : ''}`}
                    >
                      <span className="text-xl">{mod.icon}</span>
                      <span>{mod.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Question Enunciado & Common Fields Card */}
              <div className="admin-card-section space-y-4">
                <div>
                  <label className="admin-label">
                    Enunciado da Pergunta *
                  </label>
                  <input
                    type="text"
                    value={questionText}
                    onChange={(e) => setQuestionText(e.target.value)}
                    placeholder="Ex: Como se diz 'Eu sou um estudante' em inglês?"
                    className="admin-input"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="admin-label">
                      Áudio Pronunciado (speakerText)
                    </label>
                    <input
                      type="text"
                      value={speakerText}
                      onChange={(e) => setSpeakerText(e.target.value)}
                      placeholder="Ex: I am a student."
                      className="admin-input"
                    />
                  </div>

                  <div>
                    <label className="admin-label">
                      Tag / Badge da Pergunta
                    </label>
                    <select
                      value={badgeTag}
                      onChange={(e) => setBadgeTag(e.target.value)}
                      className="admin-select"
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

              {/* DYNAMIC FORM PER MODALITY CARD */}
              <div className="admin-card-section space-y-4">
                <h4 className="text-xs font-black text-purple-700 uppercase tracking-wider">
                  Configuração Específica: {exerciseType.toUpperCase()}
                </h4>

                {/* 1. MULTIPLE CHOICE / FILL BLANK / LISTENING */}
                {(exerciseType === 'multiple_choice' || exerciseType === 'fill_blank' || exerciseType === 'listening') && (
                  <div className="space-y-3">
                    <p className="text-xs font-bold text-slate-500">
                      Digite as opções e selecione o botão de opção da <strong>resposta correta</strong>:
                    </p>
                    {options.map((opt, idx) => (
                      <div key={idx} className="admin-option-row">
                        <input
                          type="radio"
                          name="correctOption"
                          checked={correctOptionIdx === idx}
                          onChange={() => setCorrectOptionIdx(idx)}
                          className="admin-radio"
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
                          className="admin-input flex-1"
                        />
                      </div>
                    ))}
                  </div>
                )}

                {/* 2. SENTENCE BUILDER */}
                {exerciseType === 'sentence_builder' && (
                  <div className="space-y-4">
                    <div>
                      <label className="admin-label">
                        Banco de Palavras (separadas por vírgula)
                      </label>
                      <input
                        type="text"
                        value={sentenceWords}
                        onChange={(e) => setSentenceWords(e.target.value)}
                        placeholder="I, am, happy, today, is, you"
                        className="admin-input"
                      />
                    </div>

                    <div>
                      <label className="admin-label">
                        Frase Correta Esperada
                      </label>
                      <input
                        type="text"
                        value={sentenceCorrect}
                        onChange={(e) => setSentenceCorrect(e.target.value)}
                        placeholder="I am happy today"
                        className="admin-input"
                      />
                    </div>
                  </div>
                )}

                {/* 3. IMAGE CHOICE */}
                {exerciseType === 'image_choice' && (
                  <div className="space-y-3">
                    {imageOptions.map((opt, idx) => (
                      <div key={idx} className="admin-option-row">
                        <input
                          type="radio"
                          name="correctImgOption"
                          checked={imageCorrectIdx === idx}
                          onChange={() => setImageCorrectIdx(idx)}
                          className="admin-radio"
                        />
                        <input
                          type="text"
                          value={opt.icon}
                          onChange={(e) => {
                            const newOpts = [...imageOptions];
                            newOpts[idx].icon = e.target.value;
                            setImageOptions(newOpts);
                          }}
                          placeholder="Ícone (ex: 🍎)"
                          className="admin-input w-24 text-center font-black text-xl"
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
                          className="admin-input flex-1"
                        />
                      </div>
                    ))}
                  </div>
                )}

                {/* 4. TRUE / FALSE */}
                {exerciseType === 'true_false' && (
                  <div className="flex items-center gap-6 p-3 bg-slate-50 border-2 border-slate-200 rounded-2xl">
                    <label className="flex items-center gap-2 font-black text-sm text-slate-700 cursor-pointer">
                      <input
                        type="radio"
                        name="tf"
                        value="True"
                        checked={tfCorrect === 'True'}
                        onChange={() => setTfCorrect('True')}
                        className="admin-radio"
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
                        className="admin-radio"
                      />
                      ❌ Falso (False)
                    </label>
                  </div>
                )}

                {/* 5. PAIR MATCHING */}
                {exerciseType === 'pair_matching' && (
                  <div className="space-y-3">
                    <p className="text-xs font-bold text-slate-500 mb-2">Cadastre os pares em inglês e português:</p>
                    {pairs.map((p, idx) => (
                      <div key={p.id} className="grid grid-cols-2 gap-3">
                        <input
                          type="text"
                          value={p.en}
                          onChange={(e) => {
                            const newPairs = [...pairs];
                            newPairs[idx].en = e.target.value;
                            setPairs(newPairs);
                          }}
                          placeholder={`Inglês #${idx + 1}`}
                          className="admin-input"
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
                          className="admin-input"
                        />
                      </div>
                    ))}
                  </div>
                )}

                {/* 6. AUDIO DICTATION */}
                {exerciseType === 'audio_dictation' && (
                  <div className="space-y-4">
                    <div>
                      <label className="admin-label">
                        Áudio a ser falado pelo sintetizador
                      </label>
                      <input
                        type="text"
                        value={speakerText}
                        onChange={(e) => setSpeakerText(e.target.value)}
                        placeholder="Ex: Good morning, how are you?"
                        className="admin-input"
                      />
                    </div>
                    <div>
                      <label className="admin-label">
                        Resposta Exata Esperada do Aluno
                      </label>
                      <input
                        type="text"
                        value={sentenceCorrect}
                        onChange={(e) => setSentenceCorrect(e.target.value)}
                        placeholder="Ex: Good morning, how are you?"
                        className="admin-input"
                      />
                    </div>
                  </div>
                )}

                {/* Explanation Field */}
                <div className="pt-2">
                  <label className="admin-label">
                    Explicação Pedagógica (exibida após resposta)
                  </label>
                  <textarea
                    rows={3}
                    value={explanation}
                    onChange={(e) => setExplanation(e.target.value)}
                    placeholder="Ex: Usamos 'AM' sempre que o sujeito for 'I' (Eu)."
                    className="admin-textarea"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button type="submit" className="primary-btn w-full py-4 text-base shadow-lg">
                <PlusCircle className="w-5 h-5" /> ADICIONAR PERGUNTA MANUALMENTE
              </button>
            </form>
          )}

          {/* TAB 2: MANAGE QUESTIONS LIST */}
          {activeTab === 'manage' && (
            <div className="space-y-4">
              {customQuestionsList.length === 0 ? (
                <div className="text-center py-16 text-slate-400">
                  <HelpCircle className="w-14 h-14 mx-auto mb-3 opacity-40" />
                  <p className="font-black text-lg text-slate-700">Nenhuma pergunta manual cadastrada ainda.</p>
                  <p className="text-xs font-bold mt-1">Use a aba "Criar Pergunta" para adicionar seus próprios exercícios!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {customQuestionsList.map((item) => (
                    <div 
                      key={item.question.id}
                      className="admin-card-section flex items-center justify-between gap-4 mb-0"
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
                        <h4 className="font-black text-base text-slate-800">{item.question.question}</h4>
                        <p className="text-xs font-bold text-emerald-600">
                          Resposta correta: {item.question.correctAnswer}
                        </p>
                      </div>

                      <button
                        onClick={() => handleDeleteQuestion(item.question.id)}
                        className="p-3 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 transition shrink-0"
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
              <div className="admin-card-section space-y-4">
                <h4 className="font-black text-base text-slate-800 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-purple-600" /> Exportar ou Importar em JSON
                </h4>
                <p className="text-xs font-bold text-slate-500 leading-relaxed">
                  Você pode salvar em arquivo ou transferir suas perguntas customizadas entre diferentes navegadores:
                </p>

                <textarea
                  rows={8}
                  value={jsonString}
                  onChange={(e) => setJsonString(e.target.value)}
                  placeholder="Cole o código JSON de perguntas aqui..."
                  className="admin-textarea font-mono text-xs"
                />

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <button onClick={handleExportJson} className="secondary-btn flex-1 py-3 text-xs">
                    <Copy className="w-4 h-4" /> Gerar & Copiar JSON
                  </button>

                  <button onClick={handleImportJson} className="primary-btn flex-1 py-3 text-xs">
                    <Upload className="w-4 h-4" /> Importar Perguntas do JSON
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="modal-footer justify-between">
          <span className="text-xs font-bold text-slate-400 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-emerald-500 fill-emerald-500" /> MuvLern Admin System
          </span>
          <div className="flex items-center gap-2">
            <button className="secondary-btn text-xs px-4 py-2 text-rose-600 border-rose-200" onClick={handleLogout}>
              <LogOut className="w-3.5 h-3.5 text-rose-600" /> Sair
            </button>
            <button className="secondary-btn text-xs px-5 py-2" onClick={() => { soundFx.playClick(); onClose(); }}>
              Fechar Painel
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
