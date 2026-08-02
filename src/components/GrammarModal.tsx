import React, { useState } from 'react';
import { X, CheckCircle2, Lightbulb } from 'lucide-react';
import { soundFx } from '../utils/soundFx';

interface GrammarModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GrammarModal: React.FC<GrammarModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'affirmative' | 'negative' | 'interrogative'>('affirmative');

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div className="flex items-center gap-2">
            <Lightbulb className="w-6 h-6 text-amber-500 fill-amber-500" />
            <h2 className="modal-title">Guia Definitivo: Verbo "To Be"</h2>
          </div>
          <button 
            className="close-btn" 
            onClick={() => { soundFx.playClick(); onClose(); }}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Intro Tip */}
        <div className="grammar-tip-banner">
          <p>
            💡 <strong>O que é o Verbo To Be?</strong> Em inglês, ele significa <strong>SER</strong> ou <strong>ESTAR</strong>. 
            Formas no presente: <span className="highlight-pill">AM</span>, <span className="highlight-pill">IS</span> e <span className="highlight-pill">ARE</span>.
          </p>
        </div>

        {/* Tabs */}
        <div className="grammar-tabs">
          <button 
            className={`tab-btn ${activeTab === 'affirmative' ? 'active' : ''}`}
            onClick={() => { soundFx.playClick(); setActiveTab('affirmative'); }}
          >
            Afirmativa
          </button>
          <button 
            className={`tab-btn ${activeTab === 'negative' ? 'active' : ''}`}
            onClick={() => { soundFx.playClick(); setActiveTab('negative'); }}
          >
            Negativa
          </button>
          <button 
            className={`tab-btn ${activeTab === 'interrogative' ? 'active' : ''}`}
            onClick={() => { soundFx.playClick(); setActiveTab('interrogative'); }}
          >
            Perguntas
          </button>
        </div>

        {/* Tab Content */}
        <div className="grammar-content">
          {activeTab === 'affirmative' && (
            <div className="tab-pane">
              <h3>Estrutura: Sujeito + Verbo To Be</h3>
              <div className="table-wrapper">
                <table className="grammar-table">
                  <thead>
                    <tr>
                      <th>Pronome (Sujeito)</th>
                      <th>Verbo</th>
                      <th>Forma Contraída</th>
                      <th>Exemplo (EN)</th>
                      <th>Tradução (PT)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><strong>I</strong> (Eu)</td>
                      <td><span className="verb-highlight">AM</span></td>
                      <td>I'm</td>
                      <td>I am happy.</td>
                      <td>Eu estou feliz.</td>
                    </tr>
                    <tr>
                      <td><strong>You</strong> (Você)</td>
                      <td><span className="verb-highlight">ARE</span></td>
                      <td>You're</td>
                      <td>You are smart.</td>
                      <td>Você é inteligente.</td>
                    </tr>
                    <tr>
                      <td><strong>He</strong> (Ele)</td>
                      <td><span className="verb-highlight">IS</span></td>
                      <td>He's</td>
                      <td>He is a doctor.</td>
                      <td>Ele é um médico.</td>
                    </tr>
                    <tr>
                      <td><strong>She</strong> (Ela)</td>
                      <td><span className="verb-highlight">IS</span></td>
                      <td>She's</td>
                      <td>She is nice.</td>
                      <td>Ela é legal.</td>
                    </tr>
                    <tr>
                      <td><strong>It</strong> (Coisa/Animal)</td>
                      <td><span className="verb-highlight">IS</span></td>
                      <td>It's</td>
                      <td>It is sunny.</td>
                      <td>Está ensolarado.</td>
                    </tr>
                    <tr>
                      <td><strong>We</strong> (Nós)</td>
                      <td><span className="verb-highlight">ARE</span></td>
                      <td>We're</td>
                      <td>We are friends.</td>
                      <td>Nós somos amigos.</td>
                    </tr>
                    <tr>
                      <td><strong>They</strong> (Eles/Elas)</td>
                      <td><span className="verb-highlight">ARE</span></td>
                      <td>They're</td>
                      <td>They are ready.</td>
                      <td>Eles estão prontos.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'negative' && (
            <div className="tab-pane">
              <h3>Estrutura: Sujeito + Verbo To Be + NOT</h3>
              <div className="table-wrapper">
                <table className="grammar-table">
                  <thead>
                    <tr>
                      <th>Pronome</th>
                      <th>Completo</th>
                      <th>Contração Comum</th>
                      <th>Exemplo (EN)</th>
                      <th>Tradução (PT)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>I</td>
                      <td>I am not</td>
                      <td>I'm not</td>
                      <td>I am not tired.</td>
                      <td>Eu não estou cansado.</td>
                    </tr>
                    <tr>
                      <td>He / She / It</td>
                      <td>is not</td>
                      <td><span className="verb-highlight">isn't</span></td>
                      <td>She isn't here.</td>
                      <td>Ela não está aqui.</td>
                    </tr>
                    <tr>
                      <td>We / You / They</td>
                      <td>are not</td>
                      <td><span className="verb-highlight">aren't</span></td>
                      <td>They aren't late.</td>
                      <td>Eles não estão atrasados.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'interrogative' && (
            <div className="tab-pane">
              <h3>Estrutura: Verbo To Be + Sujeito + ?</h3>
              <p className="note-text">⚠️ <strong>Regra de Ouro:</strong> Em perguntas, inverta a posição! O verbo passa para a frente do sujeito.</p>
              
              <div className="table-wrapper">
                <table className="grammar-table">
                  <thead>
                    <tr>
                      <th>Pergunta</th>
                      <th>Resposta Curta Sim (+)</th>
                      <th>Resposta Curta Não (-)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><strong>Am I</strong> right?</td>
                      <td>Yes, you are.</td>
                      <td>No, you aren't.</td>
                    </tr>
                    <tr>
                      <td><strong>Is he</strong> at home?</td>
                      <td>Yes, he is.</td>
                      <td>No, he isn't.</td>
                    </tr>
                    <tr>
                      <td><strong>Are you</strong> hungry?</td>
                      <td>Yes, I am.</td>
                      <td>No, I'm not.</td>
                    </tr>
                    <tr>
                      <td><strong>Are they</strong> ready?</td>
                      <td>Yes, they are.</td>
                      <td>No, they aren't.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="modal-footer">
          <button className="primary-btn flex-1" onClick={() => { soundFx.playClick(); onClose(); }}>
            <CheckCircle2 className="w-5 h-5" /> Entendi! Voltar ao Jogo
          </button>
        </div>
      </div>
    </div>
  );
};
