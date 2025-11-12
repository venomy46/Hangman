import React from 'react';

type WordProps = {
  guessedLetters: string[];
  wordToGuess: string;
  reveal?: boolean;
};

export function Word({ guessedLetters, wordToGuess, reveal = false }: WordProps) {
  return (
    <div className="flex gap-2 md:gap-4 text-4xl md:text-6xl font-bold tracking-widest font-mono uppercase">
      {wordToGuess.split('').map((letter, index) => (
        <span
          key={index}
          className="border-b-4 md:border-b-8 border-gray-200 w-10 md:w-16 text-center"
        >
          <span
            className={`${
              guessedLetters.includes(letter) || reveal
                ? 'visible'
                : 'invisible'
            } ${
              !guessedLetters.includes(letter) && reveal ? 'text-red-400' : 'text-gray-200'
            }`}
          >
            {letter}
          </span>
        </span>
      ))}
    </div>
  );
}