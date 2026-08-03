import React from 'react';

interface MascotProps {
  mood?: 'happy' | 'excited' | 'sad' | 'thinking' | 'wink';
  speechBubble?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const Mascot: React.FC<MascotProps> = ({
  mood = 'happy',
  speechBubble,
  size = 'md'
}) => {
  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-36 h-36'
  }[size];

  return (
    <div className="mascot-container flex items-end gap-3">
      {/* Speech Bubble with dynamic typing style */}
      {speechBubble && (
        <div className="mascot-speech-bubble transition-all duration-300">
          <p className="animate-fadeIn">{speechBubble}</p>
          <div className="bubble-tail" />
        </div>
      )}

      {/* Dynamic Animated Mascot SVG (Muvy the Learning Owl) */}
      <div className={`mascot-svg-wrapper ${sizeClasses} ${mood} transition-transform duration-300 transform hover:scale-105`}>
        <svg viewBox="0 0 120 120" className="w-full h-full drop-shadow-lg">
          {/* Owl Body */}
          <ellipse cx="60" cy="65" rx="42" ry="46" fill="#58cc02" />
          {/* Belly Overlay */}
          <ellipse cx="60" cy="72" rx="30" ry="32" fill="#79dd09" />

          {/* Feather Details */}
          <path d="M 50 68 Q 60 74 70 68" stroke="#58cc02" strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d="M 52 78 Q 60 84 68 78" stroke="#58cc02" strokeWidth="3" fill="none" strokeLinecap="round" />

          {/* Eyes Base */}
          <circle cx="43" cy="48" r="16" fill="#ffffff" stroke="#e5e5e5" strokeWidth="2" />
          <circle cx="77" cy="48" r="16" fill="#ffffff" stroke="#e5e5e5" strokeWidth="2" />

          {/* Pupils according to dynamic mood */}
          {mood === 'happy' && (
            <>
              <circle cx="45" cy="48" r="8" fill="#18181b" />
              <circle cx="79" cy="48" r="8" fill="#18181b" />
              <circle cx="47" cy="45" r="3" fill="#ffffff" />
              <circle cx="81" cy="45" r="3" fill="#ffffff" />
            </>
          )}

          {mood === 'excited' && (
            <>
              <path d="M 35 48 A 8 8 0 0 1 51 48" stroke="#18181b" strokeWidth="4" fill="none" strokeLinecap="round" />
              <path d="M 69 48 A 8 8 0 0 1 85 48" stroke="#18181b" strokeWidth="4" fill="none" strokeLinecap="round" />
            </>
          )}

          {mood === 'wink' && (
            <>
              <circle cx="45" cy="48" r="8" fill="#18181b" />
              <circle cx="47" cy="45" r="3" fill="#ffffff" />
              <path d="M 69 48 Q 77 40 85 48" stroke="#18181b" strokeWidth="4" fill="none" strokeLinecap="round" />
            </>
          )}

          {mood === 'sad' && (
            <>
              <circle cx="43" cy="50" r="7" fill="#18181b" />
              <circle cx="77" cy="50" r="7" fill="#18181b" />
              <path d="M 33 38 Q 43 44 49 40" stroke="#18181b" strokeWidth="3" fill="none" />
              <path d="M 71 40 Q 77 44 87 38" stroke="#18181b" strokeWidth="3" fill="none" />
            </>
          )}

          {mood === 'thinking' && (
            <>
              <circle cx="43" cy="46" r="7" fill="#18181b" />
              <circle cx="75" cy="44" r="7" fill="#18181b" />
            </>
          )}

          {/* Orange Beak */}
          <polygon points="60,54 53,64 67,64" fill="#ff9600" />

          {/* Cute Orange Feet */}
          <ellipse cx="48" cy="108" rx="8" ry="4" fill="#ff9600" />
          <ellipse cx="72" cy="108" rx="8" ry="4" fill="#ff9600" />

          {/* Dynamic Wings Animation */}
          {mood === 'excited' ? (
            <>
              <ellipse cx="14" cy="55" rx="8" ry="18" fill="#46a302" transform="rotate(-30 14 55)" className="animate-bounce" />
              <ellipse cx="106" cy="55" rx="8" ry="18" fill="#46a302" transform="rotate(30 106 55)" className="animate-bounce" />
            </>
          ) : (
            <>
              <ellipse cx="18" cy="68" rx="7" ry="16" fill="#46a302" transform="rotate(15 18 68)" />
              <ellipse cx="102" cy="68" rx="7" ry="16" fill="#46a302" transform="rotate(-15 102 68)" />
            </>
          )}
        </svg>
      </div>
    </div>
  );
};
