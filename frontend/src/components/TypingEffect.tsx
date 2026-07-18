import React, { useState, useEffect } from 'react';

interface TypingEffectProps {
  arStrings: string[];
  enStrings: string[];
  lang: 'ar' | 'en';
}

export const TypingEffect: React.FC<TypingEffectProps> = ({ arStrings, enStrings, lang }) => {
  const strings = lang === 'ar' ? arStrings : enStrings;
  
  const [currentText, setCurrentText] = useState('');
  const [stringIndex, setStringIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState(80);

  useEffect(() => {
    // Reset indicators if strings list or language changes
    setCurrentText('');
    setStringIndex(0);
    setCharIndex(0);
    setIsDeleting(false);
    setTypingSpeed(80);
  }, [lang]);

  useEffect(() => {
    if (strings.length === 0) return;

    const currentString = strings[stringIndex % strings.length];
    
    const handleTyping = () => {
      if (!isDeleting) {
        // Typing letters
        setCurrentText(currentString.slice(0, charIndex + 1));
        setCharIndex((prev) => prev + 1);
        setTypingSpeed(75); // Standard typing speed

        if (charIndex + 1 === currentString.length) {
          // Pause at the end of the text
          setTypingSpeed(2200);
          setIsDeleting(true);
        }
      } else {
        // Deleting letters
        setCurrentText(currentString.slice(0, charIndex - 1));
        setCharIndex((prev) => prev - 1);
        setTypingSpeed(35); // Fast backspacing speed

        if (charIndex - 1 === 0) {
          setIsDeleting(false);
          setStringIndex((prev) => prev + 1);
          setTypingSpeed(450); // Pause before starting typing next word
        }
      }
    };

    const timer = setTimeout(handleTyping, typingSpeed);
    return () => clearTimeout(timer);
  }, [charIndex, isDeleting, stringIndex, strings, typingSpeed]);

  return (
    <span className="inline-flex items-center gap-1 min-h-[1.4em] select-none">
      <span className="bg-gradient-to-r from-[#9d027c] via-[#bd0390] to-blue-600 bg-clip-text text-transparent drop-shadow-sm font-black pb-1 transition-all duration-300">
        {currentText}
      </span>
      {/* Sleek retro-futuristic inline glowing typing cursor */}
      <span 
        className="w-1.5 h-[0.95em] bg-[#9d027c] inline-block animate-[pulse_1.0s_infinite] shadow-[0_0_8px_rgba(157,2,124,0.65)] rounded-sm"
        style={{ verticalAlign: 'middle' }}
      />
    </span>
  );
};
