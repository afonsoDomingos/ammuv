import React, { useState } from 'react';
import { X, Bot, Sparkles, Send, Lightbulb, BookOpen } from 'lucide-react';
import { soundFx } from '../utils/soundFx';
import { askAiTutor } from '../services/aiService';
import { Mascot } from './Mascot';

interface AiTutorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ChatMessage {
  sender: 'user' | 'ai';
  text: string;
}

export const AiTutorModal: React.FC<AiTutorModalProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      sender: 'ai',
      text: '🦉 Olá! Eu sou o **Muvy AI**, seu tutor inteligente de inglês! Como posso te ajudar a dominar o Verbo "To Be" hoje?'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputText;
    if (!query.trim() || isLoading) return;

    soundFx.playClick();
    const newMessages: ChatMessage[] = [...messages, { sender: 'user', text: query }];
    setMessages(newMessages);
    setInputText('');
    setIsLoading(true);

    const res = await askAiTutor(query);
    setIsLoading(false);

    if (res.reply) {
      setMessages([...newMessages, { sender: 'ai', text: res.reply }]);
    }
  };

  const handleQuickPrompt = (promptText: string) => {
    handleSendMessage(promptText);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card max-w-2xl h-[600px]" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header bg-purple-50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-600 rounded-2xl text-white shadow-md">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <h2 className="modal-title flex items-center gap-2 text-purple-950">
                Muvy AI Tutor <Sparkles className="w-4 h-4 text-amber-500 fill-amber-500" />
              </h2>
              <p className="text-xs font-bold text-purple-700">Tutor de Inteligência Artificial do Verbo To Be</p>
            </div>
          </div>
          <button 
            className="close-btn"
            onClick={() => { soundFx.playClick(); onClose(); }}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Prompts Bar */}
        <div className="flex gap-2 p-3 bg-purple-100/50 overflow-x-auto text-xs font-black">
          <button
            onClick={() => handleQuickPrompt("Como usar AM, IS e ARE?")}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border-2 border-purple-200 text-purple-800 hover:bg-purple-200 transition shrink-0"
          >
            <Lightbulb className="w-3.5 h-3.5 text-amber-500" /> Como usar am/is/are?
          </button>
          <button
            onClick={() => handleQuickPrompt("Como fazer perguntas no Verbo To Be?")}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border-2 border-purple-200 text-purple-800 hover:bg-purple-200 transition shrink-0"
          >
            <BookOpen className="w-3.5 h-3.5 text-sky-500" /> Como fazer perguntas?
          </button>
        </div>

        {/* Chat Messages Body */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex items-start gap-3 ${
                msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
              }`}
            >
              {msg.sender === 'ai' ? (
                <Mascot size="sm" mood="excited" />
              ) : (
                <div className="w-9 h-9 rounded-full bg-purple-600 text-white font-extrabold flex items-center justify-center text-sm shadow-md">
                  Você
                </div>
              )}

              <div
                className={`p-3.5 rounded-2xl max-w-[80%] text-sm font-bold shadow-sm leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-purple-600 text-white rounded-tr-none'
                    : 'bg-white border-2 border-slate-200 text-slate-800 rounded-tl-none'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-3">
              <Mascot size="sm" mood="thinking" />
              <div className="p-3 bg-white border-2 border-slate-200 rounded-2xl rounded-tl-none text-xs font-extrabold text-purple-600 animate-pulse">
                Muvy AI está pensando na explicação perfeita... 🧠
              </div>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="p-3 border-t-2 border-slate-200 bg-white flex items-center gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Pergunte qualquer dúvida sobre o Verbo To Be..."
            className="flex-1 px-4 py-3 border-2 border-slate-200 rounded-2xl text-sm font-extrabold outline-none focus:border-purple-500 transition"
          />
          <button
            onClick={() => handleSendMessage()}
            disabled={!inputText.trim() || isLoading}
            className="p-3 rounded-2xl bg-purple-600 hover:bg-purple-700 disabled:opacity-40 text-white font-black transition shadow-md"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
