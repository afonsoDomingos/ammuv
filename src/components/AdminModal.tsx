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
      <div className="admin-login-overlay" onClick={onClose}>
        <div className="admin-login-card" onClick={(e) => e.stopPropagation()}>

          {/* LEFT PANEL — Branding & Illustration */}
          <div className="admin-login-left">
            <div className="admin-login-brand">
              <div className="admin-login-logo-badge">
                <ShieldCheck className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="admin-login-brand-name">
                  Muv<span className="text-amber-300">Lern</span>
                </h1>
                <span className="admin-login-brand-tag">Admin Dashboard</span>
              </div>
            </div>

            <div className="admin-login-illustration">
              <div className="admin-login-graphic">
                <div className="admin-login-ring ring-1" />
                <div className="admin-login-ring ring-2" />
                <div className="admin-login-ring ring-3" />
                <div className="admin-login-center-icon">
                  <Key className="w-10 h-10 text-white" />
                </div>
              </div>
              <h2 className="admin-login-tagline">Gestão de Questões<br />&amp; Exercícios</h2>
              <p className="admin-login-desc">Crie, edite e gerencie todo o conteúdo educacional do aplicativo em um só lugar.</p>
            </div>

            {/* Stats row */}
            <div className="admin-login-stats">
              {[
                { label: 'Módulos', value: '12+' },
                { label: 'Modalidades', value: '8' },
                { label: 'Alunos', value: '∞' },
              ].map(s => (
                <div key={s.label} className="admin-login-stat">
                  <span className="admin-login-stat-value">{s.value}</span>
                  <span className="admin-login-stat-label">{s.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT PANEL — Login Form */}
          <div className="admin-login-right">
            {/* Close button */}
            <button
              className="admin-login-close"
              onClick={() => { soundFx.playClick(); onClose(); }}
              title="Fechar"
            >
              <X className="w-4 h-4" />
            </button>

            <form onSubmit={handleLogin} className="admin-login-form">
              <div className="admin-login-form-header">
                <h2 className="admin-login-form-title">Bem-vindo de volta</h2>
                <p className="admin-login-form-sub">Entre com suas credenciais para acessar o painel administrativo.</p>
              </div>

              {/* Demo credentials */}
              <div className="admin-login-creds">
                <div className="admin-login-creds-title">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Credenciais de demonstração</span>
                </div>
                <div className="admin-login-creds-row">
                  <div className="admin-login-cred-pill">
                    <span className="admin-cred-key">Senha</span>
                    <code className="admin-cred-val green">admin123</code>
                  </div>
                  <div className="admin-login-cred-pill">
                    <span className="admin-cred-key">PIN</span>
                    <code className="admin-cred-val amber">1234</code>
                  </div>
                </div>
              </div>

              {/* Error message */}
              {loginError && (
                <div className="admin-login-error">
                  <span>⚠️ {loginError}</span>
                </div>
              )}

              {/* Password field */}
              <div className="admin-login-field">
                <label className="admin-login-field-label">Senha ou PIN de Acesso</label>
                <div className="admin-login-field-wrap">
                  <Lock className="admin-login-field-icon" />
                  <input
                    type="password"
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    placeholder="Digite a senha ou PIN..."
                    className="admin-login-input"
                    autoFocus
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="admin-login-actions">
                <button type="submit" className="admin-login-submit">
                  <ShieldCheck className="w-5 h-5" />
                  Entrar no Painel Admin
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setPasswordInput('admin123');
                    setTimeout(() => handleLogin(), 100);
                  }}
                  className="admin-login-autofill"
                >
                  <Zap className="w-4 h-4" />
                  Preencher &amp; Entrar Automaticamente
                </button>
              </div>

              <p className="admin-login-footer-note">
                🔒 Acesso protegido por autenticação por sessão
              </p>
            </form>
          </div>

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
    <div className="admin-fullscreen">
      <div className="admin-modal-card">
        
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
        <div className="admin-content-body">

          {/* TAB 1: CREATE QUESTION FORM */}
          {activeTab === 'create' && (
            <form onSubmit={handleCreateQuestion} className="admin-create-layout">
              
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
              <div className="admin-card-section admin-full-col">
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
              <div className="admin-full-col">
                <button type="submit" className="primary-btn w-full py-4 text-base shadow-lg">
                  <PlusCircle className="w-5 h-5" /> ADICIONAR PERGUNTA MANUALMENTE
                </button>
              </div>
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
