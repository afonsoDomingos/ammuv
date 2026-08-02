import type { LearningModule, Badge } from '../types/game';

export const VERB_TO_BE_MODULES: LearningModule[] = [
  {
    id: 'module-1-affirmative',
    title: '1. Verbo To Be: Afirmativo',
    description: 'Aprenda a usar AM, IS e ARE em frases afirmativas simples.',
    category: 'affirmative',
    level: 1,
    icon: 'Sparkles',
    unlocked: true,
    exercises: [
      {
        id: 'aff-1',
        type: 'image_choice',
        badgeTag: 'PALAVRA NOVA',
        question: 'Qual destas opções significa "Eu sou um estudante"?',
        speakerText: 'I am a student.',
        contextPt: 'Eu sou um estudante.',
        options: [
          { text: 'I am a student', icon: '👨‍🎓' },
          { text: 'She is a doctor', icon: '👩‍⚕️' },
          { text: 'They are happy', icon: '😃' }
        ],
        correctAnswer: 'I am a student',
        explanation: 'Com o pronome "I" (Eu), usamos sempre a forma "AM": "I am a student".'
      },
      {
        id: 'aff-2',
        type: 'multiple_choice',
        badgeTag: 'PRÁTICA DO TO BE',
        question: 'Selecione o significado correto:',
        speakerText: 'She is happy today.',
        contextPt: 'Ela está feliz hoje.',
        options: [
          { text: 'Ela está feliz hoje' },
          { text: 'Ela não está feliz hoje' },
          { text: 'Nós estamos felizes hoje' }
        ],
        correctAnswer: 'Ela está feliz hoje',
        explanation: 'Para a 3ª pessoa do singular (He, She, It), usamos a forma "IS": "She is happy".'
      },
      {
        id: 'aff-3',
        type: 'sentence_builder',
        badgeTag: 'MONTE A FRASE',
        question: 'Escreva em inglês:',
        speakerText: 'Eles são médicos.',
        contextPt: 'Eles são médicos.',
        words: ['They', 'are', 'doctors', 'is', 'am'],
        correctAnswer: 'They are doctors',
        explanation: 'Para o plural (They), a forma correta do Verbo To Be é "ARE".'
      },
      {
        id: 'aff-4',
        type: 'fill_blank',
        badgeTag: 'COMPLETE A LACUNA',
        question: 'Selecione a forma correta para completar:',
        speakerText: 'It ___ sunny today.',
        contextPt: 'Está ensolarado hoje.',
        options: [
          { text: 'is' },
          { text: 'am' },
          { text: 'are' }
        ],
        correctAnswer: 'is',
        explanation: 'Para o pronome "It" (clima, objetos, animais), usamos a forma "IS".'
      },
      {
        id: 'aff-5',
        type: 'sentence_builder',
        badgeTag: 'MONTE A FRASE',
        question: 'Escreva em português:',
        speakerText: 'We are ready.',
        contextPt: 'Nós estamos prontos.',
        words: ['Nós', 'estamos', 'prontos', 'eles', 'não'],
        correctAnswer: 'Nós estamos prontos',
        explanation: '"We are ready" traduz-se como "Nós estamos prontos".'
      }
    ]
  },
  {
    id: 'module-2-negative',
    title: '2. Verbo To Be: Negativo',
    description: 'Aprenda a negar usando NOT, ISN\'T e AREN\'T.',
    category: 'negative',
    level: 2,
    icon: 'ShieldAlert',
    unlocked: true,
    exercises: [
      {
        id: 'neg-1',
        type: 'multiple_choice',
        badgeTag: 'PALAVRA NOVA',
        question: 'Selecione a tradução correta:',
        speakerText: 'I am not tired.',
        contextPt: 'Eu não estou cansado.',
        options: [
          { text: 'Eu não estou cansado' },
          { text: 'Eu estou com sono' },
          { text: 'Ele não está cansado' }
        ],
        correctAnswer: 'Eu não estou cansado',
        explanation: 'A negação na 1ª pessoa é formada adicionando "not" após o am: "I am not tired".'
      },
      {
        id: 'neg-2',
        type: 'image_choice',
        badgeTag: 'PRÁTICA DO TO BE',
        question: 'Qual imagem representa "He isn\'t at home"?',
        speakerText: 'He isn\'t at home.',
        contextPt: 'Ele não está em casa.',
        options: [
          { text: 'He isn\'t at home', icon: '🚫🏠' },
          { text: 'He is at home', icon: '🏡' },
          { text: 'She is sleeping', icon: '😴' }
        ],
        correctAnswer: 'He isn\'t at home',
        explanation: '"Isn\'t" é a forma contraída de "is not", usada com He, She e It.'
      },
      {
        id: 'neg-3',
        type: 'sentence_builder',
        badgeTag: 'MONTE A FRASE',
        question: 'Escreva em inglês:',
        speakerText: 'Nós não estamos atrasados.',
        contextPt: 'Nós não estamos atrasados.',
        words: ['We', 'aren\'t', 'late', 'is', 'am'],
        correctAnswer: 'We aren\'t late',
        explanation: '"Aren\'t" é a contração de "are not", usada para We, You e They.'
      },
      {
        id: 'neg-4',
        type: 'fill_blank',
        badgeTag: 'COMPLETE A LACUNA',
        question: 'Escolha a opção correta:',
        speakerText: 'She ___ a teacher.',
        contextPt: 'Ela não é uma professora.',
        options: [
          { text: 'isn\'t' },
          { text: 'aren\'t' },
          { text: 'am not' }
        ],
        correctAnswer: 'isn\'t',
        explanation: 'Com o pronome "She" no negativo, usamos "isn\'t".'
      }
    ]
  },
  {
    id: 'module-3-interrogative',
    title: '3. Perguntas & Respostas',
    description: 'Aprenda a fazer perguntas invertendo a ordem do verbo.',
    category: 'interrogative',
    level: 3,
    icon: 'HelpCircle',
    unlocked: true,
    exercises: [
      {
        id: 'int-1',
        type: 'multiple_choice',
        badgeTag: 'PERGUNTA & RESPOSTA',
        question: 'Como se pergunta "Você está com fome?" em inglês?',
        speakerText: 'Are you hungry?',
        contextPt: 'Você está com fome?',
        options: [
          { text: 'Are you hungry?' },
          { text: 'You is hungry?' },
          { text: 'Am you hungry?' }
        ],
        correctAnswer: 'Are you hungry?',
        explanation: 'Em perguntas, o verbo "To Be" vem ANTES do sujeito: "Are you...?"'
      },
      {
        id: 'int-2',
        type: 'sentence_builder',
        badgeTag: 'MONTE A FRASE',
        question: 'Escreva a pergunta em inglês:',
        speakerText: 'Onde você está?',
        contextPt: 'Where are you?',
        words: ['Where', 'are', 'you', '?', 'is'],
        correctAnswer: 'Where are you ?',
        explanation: 'Estrutura: Palavra interrogativa (Where) + Verbo (are) + Sujeito (you).'
      },
      {
        id: 'int-3',
        type: 'multiple_choice',
        badgeTag: 'RESPOSTA CURTA',
        question: 'Responda à pergunta: "Is she your sister?"',
        speakerText: 'Is she your sister?',
        contextPt: 'Ela é sua irmã?',
        options: [
          { text: 'Yes, she is.' },
          { text: 'Yes, she am.' },
          { text: 'Yes, she are.' }
        ],
        correctAnswer: 'Yes, she is.',
        explanation: 'Em respostas curtas afirmativas com "she", usamos "is": "Yes, she is."'
      }
    ]
  },
  {
    id: 'module-4-mastery',
    title: '4. Desafio Mestre do To Be',
    description: 'Mistura completa de afirmativas, negativas e perguntas!',
    category: 'mixed',
    level: 4,
    icon: 'Trophy',
    unlocked: true,
    exercises: [
      {
        id: 'mix-1',
        type: 'multiple_choice',
        badgeTag: 'DESAFIO FINAL',
        question: 'Selecione a combinação correta:',
        speakerText: 'I am a teacher, and they are students.',
        contextPt: 'Eu sou professor, e eles são estudantes.',
        options: [
          { text: 'I am / they are' },
          { text: 'I is / they is' },
          { text: 'I are / they am' }
        ],
        correctAnswer: 'I am / they are',
        explanation: '"I" exige "am" e "they" exige "are".'
      },
      {
        id: 'mix-2',
        type: 'sentence_builder',
        badgeTag: 'DESAFIO FINAL',
        question: 'Monte a frase negativa:',
        speakerText: 'Ele não está pronto hoje.',
        contextPt: 'He isn\'t ready today.',
        words: ['He', 'isn\'t', 'ready', 'today', 'am'],
        correctAnswer: 'He isn\'t ready today',
        explanation: 'Estrutura: Sujeito (He) + Negação (isn\'t) + Adjetivo (ready) + Tempo (today).'
      }
    ]
  }
];

export const GAME_BADGES: Badge[] = [
  {
    id: 'badge-first-step',
    title: 'Primeiros Passos',
    description: 'Concluiu o primeiro módulo do Verbo To Be!',
    icon: 'Target',
    condition: (stats) => Object.keys(stats.completedModules).length >= 1
  },
  {
    id: 'badge-streak-3',
    title: 'Em Chamas 🔥',
    description: 'Alcançou uma sequência (streak) de 3 acertos seguidos!',
    icon: 'Flame',
    condition: (stats) => stats.streak >= 3
  },
  {
    id: 'badge-xp-100',
    title: 'Estudante Dedicado',
    description: 'Acumulou 100 pontos de XP!',
    icon: 'Award',
    condition: (stats) => stats.xp >= 100
  },
  {
    id: 'badge-master',
    title: 'Mestre do To Be',
    description: 'Concluiu todos os 4 módulos do Verbo To Be!',
    icon: 'Crown',
    condition: (stats) => Object.keys(stats.completedModules).length >= 4
  }
];
