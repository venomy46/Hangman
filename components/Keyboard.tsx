import React from 'react';

const KEYS = 'abcdefghijklmnopqrstuvwxyz'.split('');

type KeyboardProps = {
  activeLetters: string[];
  inactiveLetters: string[];
  addGuessedLetter: (letter: string) => void;
  disabled?: boolean;
};

export function Keyboard({
  activeLetters,
  inactiveLetters,
  addGuessedLetter,
  disabled = false,
}: KeyboardProps) {
  return (
    <div className="grid grid-cols-7 sm:grid-cols-9 md:grid-cols-13 gap-2 self-stretch">
      {KEYS.map(key => {
        const isActive = activeLetters.includes(key);
        const isInactive = inactiveLetters.includes(key);
        return (
          <button
            onClick={() => addGuessedLetter(key)}
            className={`
              w-full text-2xl font-bold uppercase p-2 aspect-square
              rounded-lg border-2 border-gray-400 text-white
              transition-all duration-200
              ${isActive ? 'bg-green-500 border-green-400' : ''}
              ${isInactive ? 'bg-black/50 opacity-60 border-gray-600' : ''}
              ${!isActive && !isInactive ? 'bg-white/10 hover:bg-white/20 focus:bg-white/30' : ''}
            `}
            disabled={isInactive || isActive || disabled}
            key={key}
          >
            {key}
          </button>
        );
      })}
    </div>
  );
}