export interface AiChatResponse {
  reply?: string;
  exercise?: {
    question: string;
    speakerText?: string;
    contextPt?: string;
    options: { text: string }[];
    correctAnswer: string;
    explanation: string;
  };
}

export async function askAiTutor(prompt: string, action?: string, context?: string): Promise<AiChatResponse> {
  try {
    const response = await fetch('/api/ai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, action, context })
    });

    if (!response.ok) {
      throw new Error('AI Response Error');
    }

    return await response.json();
  } catch (error) {
    console.warn('AI API Call fallback:', error);
    return {
      reply: `🦉 **Muvy AI Tutor:**\nNo Verbo **To Be**, lembre-se sempre da regra principal:\n- **I am** (Eu sou/estou)\n- **He / She / It is** (Ele/Ela é/está)\n- **We / You / They are** (Nós/Vocês/Eles são/estão)`
    };
  }
}
