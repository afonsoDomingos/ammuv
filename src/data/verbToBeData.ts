import type { LearningModule, Badge } from '../types/game';

export const VERB_TO_BE_MODULES: LearningModule[] = [
  {
    id: 'module-1-affirmative',
    title: '1. Verbo To Be: Afirmativo',
    description: 'Domine a forma afirmativa do Verbo To Be (AM, IS, ARE) com exercícios visuais e auditivos.',
    category: 'affirmative',
    level: 1,
    icon: 'Sparkles',
    unlocked: true,
    exercises: [
      {
        id: 'aff-1',
        type: 'image_choice',
        badgeTag: 'PALAVRA NOVA',
        question: 'Qual destas imagens representa "I am a student"?',
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
        type: 'listening',
        badgeTag: 'ESCUTE O ÁUDIO 🎧',
        question: 'Escute o áudio e selecione a opção correta:',
        speakerText: 'She is happy today.',
        contextPt: 'Ela está feliz hoje.',
        options: [
          { text: 'She is happy today' },
          { text: 'They are happy today' },
          { text: 'I am happy today' }
        ],
        correctAnswer: 'She is happy today',
        explanation: 'O mascote disse "She is happy today" (Ela está feliz hoje).'
      },
      {
        id: 'aff-3',
        type: 'true_false',
        badgeTag: 'VERDADEIRO OU FALSO ⚡',
        question: 'A frase abaixo está gramaticalmente correta?\n"They is doctors."',
        speakerText: 'They is doctors.',
        contextPt: 'Gramática em foco',
        options: [
          { text: 'Falso (Incorreto)' },
          { text: 'Verdadeiro (Correto)' }
        ],
        correctAnswer: 'Falso (Incorreto)',
        explanation: 'Incorreto! Para "They" (plural), a forma correta é "ARE": "They are doctors".'
      },
      {
        id: 'aff-4',
        type: 'sentence_builder',
        badgeTag: 'MONTE A FRASE',
        question: 'Escreva em inglês:',
        speakerText: 'Nós estamos prontos.',
        contextPt: 'Nós estamos prontos.',
        words: ['We', 'are', 'ready', 'is', 'am'],
        correctAnswer: 'We are ready',
        explanation: '"We" (Nós) exige a forma "are": "We are ready".'
      },
      {
        id: 'aff-5',
        type: 'fill_blank',
        badgeTag: 'COMPLETE A LACUNA',
        question: 'Selecione o verbo correto para completar a frase:',
        speakerText: 'It ___ a beautiful day.',
        contextPt: 'Está um dia bonito.',
        options: [
          { text: 'is' },
          { text: 'am' },
          { text: 'are' }
        ],
        correctAnswer: 'is',
        explanation: 'Para objetos, animais e clima (It), usamos a forma "IS".'
      }
    ]
  },
  {
    id: 'module-2-negative',
    title: '2. Verbo To Be: Negativo',
    description: 'Aprenda a negar usando NOT, ISN\'T e AREN\'T em situações reais.',
    category: 'negative',
    level: 2,
    icon: 'ShieldAlert',
    unlocked: true,
    exercises: [
      {
        id: 'neg-1',
        type: 'image_choice',
        badgeTag: 'PALAVRA NOVA',
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
        id: 'neg-2',
        type: 'listening',
        badgeTag: 'ESCUTE O ÁUDIO 🎧',
        question: 'Escute a frase negativa:',
        speakerText: 'I am not tired.',
        contextPt: 'Eu não estou cansado.',
        options: [
          { text: 'I am not tired' },
          { text: 'He is not tired' },
          { text: 'We are not tired' }
        ],
        correctAnswer: 'I am not tired',
        explanation: 'A negação na 1ª pessoa é "I am not tired".'
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
        type: 'true_false',
        badgeTag: 'VERDADEIRO OU FALSO ⚡',
        question: 'A frase abaixo significa "Ela não é professora"?\n"She isn\'t a teacher."',
        speakerText: 'She isn\'t a teacher.',
        contextPt: 'Tradução em foco',
        options: [
          { text: 'Verdadeiro (Correto)' },
          { text: 'Falso (Incorreto)' }
        ],
        correctAnswer: 'Verdadeiro (Correto)',
        explanation: 'Correto! "She isn\'t a teacher" significa "Ela não é uma professora".'
      }
    ]
  },
  {
    id: 'module-3-interrogative',
    title: '3. Perguntas & Respostas',
    description: 'Aprenda a fazer perguntas e respostas curtas com inversão gramatical.',
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
        type: 'listening',
        badgeTag: 'ESCUTE O ÁUDIO 🎧',
        question: 'Escute a pergunta falada pelo mascote:',
        speakerText: 'Is she your sister?',
        contextPt: 'Ela é sua irmã?',
        options: [
          { text: 'Is she your sister?' },
          { text: 'Are she your sister?' },
          { text: 'Am she your sister?' }
        ],
        correctAnswer: 'Is she your sister?',
        explanation: 'Com o sujeito "She", usamos a forma "Is" no início da pergunta.'
      },
      {
        id: 'int-3',
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
        id: 'int-4',
        type: 'multiple_choice',
        badgeTag: 'RESPOSTA CURTA',
        question: 'Qual a resposta curta afirmativa para: "Is he at home?"',
        speakerText: 'Is he at home?',
        contextPt: 'Ele está em casa?',
        options: [
          { text: 'Yes, he is.' },
          { text: 'Yes, he am.' },
          { text: 'Yes, he are.' }
        ],
        correctAnswer: 'Yes, he is.',
        explanation: 'Para respostas curtas afirmativas com "he", a resposta é: "Yes, he is."'
      }
    ]
  },
  {
    id: 'module-4-mastery',
    title: '4. Desafio Mestre do To Be',
    description: 'Desafio completo misturando afirmativas, negativas e perguntas!',
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
      },
      {
        id: 'mix-3',
        type: 'true_false',
        badgeTag: 'DESAFIO FINAL',
        question: 'A frase abaixo está gramaticalmente correta?\n"We is happy to meet you."',
        speakerText: 'We is happy to meet you.',
        contextPt: 'Nós estamos felizes em conhecer você.',
        options: [
          { text: 'Falso (Incorreto)' },
          { text: 'Verdadeiro (Correto)' }
        ],
        correctAnswer: 'Falso (Incorreto)',
        explanation: 'Incorreto! "We" exige o verbo "ARE": "We are happy to meet you".'
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
