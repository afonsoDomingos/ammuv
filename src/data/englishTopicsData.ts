import type { LearningTopic, LearningModule, Badge } from '../types/game';
import { VERB_TO_BE_MODULES } from './verbToBeData';

export const TOPIC_CATEGORIES: LearningTopic[] = [
  {
    id: 'verb_to_be',
    title: 'Verbo "To Be"',
    description: 'Gramática essencial: AM, IS, ARE nas formas afirmativa, negativa e interrogativa.',
    icon: 'Sparkles',
    badgeColor: 'bg-emerald-500',
    modulesCount: 4
  },
  {
    id: 'food_vocab',
    title: 'Comidas & Bebidas 🍎',
    description: 'Aprenda vocabulário prático de alimentos, bebidas, refeições e como pedir no restaurante.',
    icon: 'Utensils',
    badgeColor: 'bg-amber-500',
    modulesCount: 4
  },
  {
    id: 'family_house',
    title: 'Família & Casa 🏡',
    description: 'Vocabulário de membros da família, cômodos e objetos do dia a dia.',
    icon: 'Home',
    badgeColor: 'bg-sky-500',
    modulesCount: 4
  },
  {
    id: 'travel_places',
    title: 'Viagens & Lugares ✈️',
    description: 'Inglês essencial para viagens: aeroporto, hotel, cidade e direções.',
    icon: 'Plane',
    badgeColor: 'bg-purple-500',
    modulesCount: 4
  },
  {
    id: 'jobs_careers',
    title: 'Trabalho & Profissões 💼',
    description: 'Vocabulário do mundo profissional, cargos e escritório.',
    icon: 'Briefcase',
    badgeColor: 'bg-blue-600',
    modulesCount: 4
  },
  {
    id: 'daily_routine',
    title: 'Rotina & Verbos no Presente ⏰',
    description: 'Verbos de ação do dia a dia: Present Simple, horários e hábitos.',
    icon: 'Clock',
    badgeColor: 'bg-rose-500',
    modulesCount: 4
  }
];

// Additional 5 New Topics Modules Data
export const ADDITIONAL_TOPICS_MODULES: LearningModule[] = [
  // --- TOPIC 2: FOOD & DRINKS ---
  {
    id: 'food-m1',
    topicId: 'food_vocab',
    title: '1. Frutas & Bebidas',
    description: 'Aprenda o nome das principais frutas e bebidas em inglês.',
    category: 'food',
    level: 1,
    icon: 'Utensils',
    unlocked: true,
    exercises: [
      {
        id: 'food-1-1',
        type: 'image_choice',
        badgeTag: 'PALAVRA NOVA',
        question: 'Qual destas opções é "Apple" (Maçã)?',
        speakerText: 'An apple a day keeps the doctor away.',
        contextPt: 'Uma maçã por dia mantém o médico longe.',
        options: [
          { text: 'Apple', icon: '🍎' },
          { text: 'Water', icon: '💧' },
          { text: 'Bread', icon: '🍞' }
        ],
        correctAnswer: 'Apple',
        explanation: '"Apple" significa Maçã em inglês.'
      },
      {
        id: 'food-1-2',
        type: 'pair_matching',
        badgeTag: 'PARES DE PALAVRAS 🎴',
        question: 'Combine cada palavra em inglês com a sua tradução:',
        correctAnswer: 'matched_all',
        pairs: [
          { id: 'p1', en: 'Water', pt: 'Água' },
          { id: 'p2', en: 'Milk', pt: 'Leite' },
          { id: 'p3', en: 'Coffee', pt: 'Café' }
        ],
        explanation: 'Excelente! Water = Água, Milk = Leite, Coffee = Café.'
      },
      {
        id: 'food-1-3',
        type: 'listening',
        badgeTag: 'ESCUTE O ÁUDIO 🎧',
        question: 'Escute o que o mascote deseja beber:',
        speakerText: 'I would like orange juice, please.',
        contextPt: 'Eu gostaria de suco de laranja, por favor.',
        options: [
          { text: 'I would like orange juice, please.' },
          { text: 'I would like hot coffee, please.' },
          { text: 'I would like cold water, please.' }
        ],
        correctAnswer: 'I would like orange juice, please.',
        explanation: 'O mascote pediu "orange juice" (suco de laranja).'
      },
      {
        id: 'food-1-4',
        type: 'sentence_builder',
        badgeTag: 'MONTE A FRASE',
        question: 'Monte a frase em inglês: "Eu bebo água"',
        speakerText: 'I drink water.',
        contextPt: 'Eu bebo água.',
        words: ['I', 'drink', 'water', 'eat', 'coffee'],
        correctAnswer: 'I drink water',
        explanation: 'Estrutura: I (Eu) + drink (bebo) + water (água).'
      }
    ]
  },
  {
    id: 'food-m2',
    topicId: 'food_vocab',
    title: '2. No Restaurante',
    description: 'Como fazer um pedido de refeição em inglês.',
    category: 'food',
    level: 2,
    icon: 'Utensils',
    unlocked: true,
    exercises: [
      {
        id: 'food-2-1',
        type: 'multiple_choice',
        badgeTag: 'NO RESTAURANTE',
        question: 'Como pedir a conta em inglês de forma cortês?',
        speakerText: 'Can I have the check, please?',
        contextPt: 'Posso ter a conta, por favor?',
        options: [
          { text: 'Can I have the check, please?' },
          { text: 'Give me food now.' },
          { text: 'Where is my money?' }
        ],
        correctAnswer: 'Can I have the check, please?',
        explanation: '"Can I have the check, please?" é a forma mais educada de pedir a conta.'
      },
      {
        id: 'food-2-2',
        type: 'audio_dictation',
        badgeTag: 'DITADO DE ÁUDIO ✍️',
        question: 'Ouça o áudio e selecione a frase idêntica:',
        speakerText: 'This pizza is delicious.',
        contextPt: 'Esta pizza está deliciosa.',
        options: [
          { text: 'This pizza is delicious.' },
          { text: 'This soup is cold.' },
          { text: 'This bread is hot.' }
        ],
        correctAnswer: 'This pizza is delicious.',
        explanation: 'Você ouviu "This pizza is delicious".'
      }
    ]
  },

  // --- TOPIC 3: FAMILY & HOUSE ---
  {
    id: 'fam-m1',
    topicId: 'family_house',
    title: '1. Membros da Família',
    description: 'Mãe, pai, irmãos e familiares em inglês.',
    category: 'family',
    level: 1,
    icon: 'Home',
    unlocked: true,
    exercises: [
      {
        id: 'fam-1-1',
        type: 'pair_matching',
        badgeTag: 'PARES DE PALAVRAS 🎴',
        question: 'Combine os membros da família:',
        correctAnswer: 'matched_all',
        pairs: [
          { id: 'fp1', en: 'Mother', pt: 'Mãe' },
          { id: 'fp2', en: 'Father', pt: 'Pai' },
          { id: 'fp3', en: 'Brother', pt: 'Irmão' }
        ],
        explanation: 'Mother = Mãe, Father = Pai, Brother = Irmão.'
      },
      {
        id: 'fam-1-2',
        type: 'image_choice',
        badgeTag: 'PALAVRA NOVA',
        question: 'Qual opção representa "House" (Casa)?',
        speakerText: 'My house is big and clean.',
        contextPt: 'Minha casa é grande e limpa.',
        options: [
          { text: 'House', icon: '🏡' },
          { text: 'Car', icon: '🚗' },
          { text: 'Book', icon: '📚' }
        ],
        correctAnswer: 'House',
        explanation: '"House" significa Casa.'
      }
    ]
  },
  {
    id: 'fam-m2',
    topicId: 'family_house',
    title: '2. Cômodos da Casa',
    description: 'Quarto, cozinha, sala e banheiro.',
    category: 'house',
    level: 2,
    icon: 'Home',
    unlocked: true,
    exercises: [
      {
        id: 'fam-2-1',
        type: 'multiple_choice',
        badgeTag: 'CÔMODOS DA CASA',
        question: 'Onde preparamos a comida em inglês?',
        speakerText: 'Kitchen',
        contextPt: 'Cozinha',
        options: [
          { text: 'Kitchen' },
          { text: 'Bedroom' },
          { text: 'Bathroom' }
        ],
        correctAnswer: 'Kitchen',
        explanation: '"Kitchen" é a cozinha.'
      }
    ]
  },

  // --- TOPIC 4: TRAVEL & PLACES ---
  {
    id: 'travel-m1',
    topicId: 'travel_places',
    title: '1. No Aeroporto',
    description: 'Passaporte, voo e bagagem.',
    category: 'travel',
    level: 1,
    icon: 'Plane',
    unlocked: true,
    exercises: [
      {
        id: 'tr-1-1',
        type: 'pair_matching',
        badgeTag: 'VOCABULÁRIO DE VIAGEM 🎴',
        question: 'Combine as palavras de viagem:',
        correctAnswer: 'matched_all',
        pairs: [
          { id: 'tp1', en: 'Passport', pt: 'Passaporte' },
          { id: 'tp2', en: 'Flight', pt: 'Voo' },
          { id: 'tp3', en: 'Luggage', pt: 'Bagagem' }
        ],
        explanation: 'Passport = Passaporte, Flight = Voo, Luggage = Bagagem.'
      },
      {
        id: 'tr-1-2',
        type: 'listening',
        badgeTag: 'ESCUTE O ÁUDIO 🎧',
        question: 'Onde fica a informação?',
        speakerText: 'Where is my gate?',
        contextPt: 'Onde fica o meu portão de embarque?',
        options: [
          { text: 'Where is my gate?' },
          { text: 'Where is my ticket?' },
          { text: 'Where is my bag?' }
        ],
        correctAnswer: 'Where is my gate?',
        explanation: '"Gate" significa portão de embarque.'
      }
    ]
  },

  // --- TOPIC 5: JOBS & CAREERS ---
  {
    id: 'jobs-m1',
    topicId: 'jobs_careers',
    title: '1. Profissões',
    description: 'Médico, professor, engenheiro e programador.',
    category: 'jobs',
    level: 1,
    icon: 'Briefcase',
    unlocked: true,
    exercises: [
      {
        id: 'jb-1-1',
        type: 'image_choice',
        badgeTag: 'PALAVRA NOVA',
        question: 'Quem ensina os alunos na escola?',
        speakerText: 'Teacher',
        contextPt: 'Professor(a)',
        options: [
          { text: 'Teacher', icon: '👩‍🏫' },
          { text: 'Doctor', icon: '👩‍⚕️' },
          { text: 'Pilot', icon: '👨‍✈️' }
        ],
        correctAnswer: 'Teacher',
        explanation: '"Teacher" significa Professor ou Professora.'
      }
    ]
  },

  // --- TOPIC 6: DAILY ROUTINE ---
  {
    id: 'routine-m1',
    topicId: 'daily_routine',
    title: '1. Minha Manhã',
    description: 'Acordar, tomar café e trabalhar.',
    category: 'routine',
    level: 1,
    icon: 'Clock',
    unlocked: true,
    exercises: [
      {
        id: 'rt-1-1',
        type: 'sentence_builder',
        badgeTag: 'MONTE A FRASE',
        question: 'Escreva em inglês: "Eu me levanto cedo"',
        speakerText: 'I wake up early.',
        contextPt: 'Eu me levanto cedo.',
        words: ['I', 'wake', 'up', 'early', 'sleep'],
        correctAnswer: 'I wake up early',
        explanation: '"Wake up" significa acordar/levantar-se.'
      }
    ]
  }
];

export const ALL_LEARNING_MODULES: LearningModule[] = [
  ...VERB_TO_BE_MODULES.map((m) => ({ ...m, topicId: 'verb_to_be' as const })),
  ...ADDITIONAL_TOPICS_MODULES
];

export const ALL_GAME_BADGES: Badge[] = [
  {
    id: 'badge-first-step',
    title: 'Primeiros Passos',
    description: 'Concluiu o primeiro módulo de inglês!',
    icon: 'Target',
    condition: (stats) => Object.keys(stats.completedModules).length >= 1
  },
  {
    id: 'badge-streak-3',
    title: 'Em Chamas 🔥',
    description: 'Alcançou uma sequência de 3 acertos seguidos!',
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
    id: 'badge-multi-topic',
    title: 'Explorador de Tópicos 🧭',
    description: 'Concluiu módulos em mais de um tópico diferente!',
    icon: 'Sparkles',
    condition: (stats) => Object.keys(stats.completedModules).length >= 3
  }
];
