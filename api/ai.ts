import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenerativeAI } from '@google/generative-ai';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || '';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { action, prompt, context } = req.body;

    // If Gemini API Key is available, call Gemini API!
    if (GEMINI_API_KEY) {
      const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

      let systemPrompt = `Você é o "Muvy", o tutor de inteligência artificial divertido e amigável do MuvLern (estilo Duolingo).
Sua missão é ensinar o Verbo "To Be" (am, is, are, am not, isn't, aren't, perguntas).
Seja encorajador, use emojis e responda em português com explicações simples e exemplos em inglês.`;

      if (action === 'generate_exercise') {
        systemPrompt += ` Gere um exercício JSON válido sobre o Verbo To Be no formato:
{"question": "...", "speakerText": "...", "contextPt": "...", "options": [{"text": "..."}, {"text": "..."}, {"text": "..."}], "correctAnswer": "...", "explanation": "..."}`;
      }

      const fullPrompt = `${systemPrompt}\n\nUsuário: ${prompt || 'Explique como usar o verbo to be.'}\nContexto: ${context || ''}`;
      const result = await model.generateContent(fullPrompt);
      const textResponse = result.response.text();

      return res.status(200).json({ reply: textResponse });
    }

    // Intelligent AI Tutor Fallback Engine (when API Key is not set in environment)
    if (action === 'explain_rule') {
      return res.status(200).json({
        reply: `🦉 **Dica do Muvy AI:**\nO verbo **To Be** tem 3 formas no presente:\n- **AM**: Apenas para "I" (I am = Eu sou/estou)\n- **IS**: Para ele/ela/coisas ("He is", "She is", "It is")\n- **ARE**: Para o plural ("We are", "You are", "They are")\n\n💡 *Exemplo:* "She is a doctor" (Ela é médica).`
      });
    }

    if (action === 'generate_exercise') {
      const aiGeneratedExercises = [
        {
          question: '🤖 Exercício IA: Escolha a forma correta para "He":',
          speakerText: 'He ___ a great musician.',
          contextPt: 'Ele é um grande músico.',
          options: [{ text: 'is' }, { text: 'am' }, { text: 'are' }],
          correctAnswer: 'is',
          explanation: 'Para a 3ª pessoa do singular (He), usamos a forma "is".'
        },
        {
          question: '🤖 Exercício IA: Qual a forma negativa de "They are ready"?',
          speakerText: 'They ___ ready.',
          contextPt: 'Eles não estão prontos.',
          options: [{ text: 'aren\'t' }, { text: 'isn\'t' }, { text: 'am not' }],
          correctAnswer: 'aren\'t',
          explanation: 'Para o plural "They" no negativo, usamos "aren\'t" (are not).'
        }
      ];

      const randomEx = aiGeneratedExercises[Math.floor(Math.random() * aiGeneratedExercises.length)];
      return res.status(200).json({ exercise: randomEx });
    }

    return res.status(200).json({
      reply: `🦉 **Muvy AI diz:** Ótima pergunta! Para usar o Verbo To Be com confiança, lembre-se: **I am**, **He/She/It is**, e **We/You/They are**! Gostaria de praticar um exercício gerado por IA?`
    });

  } catch (error: unknown) {
    console.error('AI API Error:', error);
    const message = error instanceof Error ? error.message : 'AI Processing error';
    return res.status(500).json({ error: message });
  }
}
