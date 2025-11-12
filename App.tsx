import { useState, useEffect, useCallback } from 'react';
import React from 'react';
import { HangmanDrawing } from './components/HangmanDrawing';
import { Word } from './components/Word';
import { Keyboard } from './components/Keyboard';
import { getHint } from './services/geminiService';
import { playSound } from './services/soundService';

const WORDS = ["react", "tailwind", "gemini", "typescript", "hangman"];
const MAX_INCORRECT_GUESSES = 6;

function getNewWord() {
  return WORDS[Math.floor(Math.random() * WORDS.length)];
}

function App() {
  const [wordToGuess, setWordToGuess] = useState(getNewWord);
  const [guessedLetters, setGuessedLetters] = useState<string[]>([]);
  const [hint, setHint] = useState<string | null>(null);
  const [isLoadingHint, setIsLoadingHint] = useState<boolean>(false);

  const incorrectLetters = guessedLetters.filter(
    letter => !wordToGuess.includes(letter)
  );

  const isLoser = incorrectLetters.length >= MAX_INCORRECT_GUESSES;
  const isWinner = wordToGuess
    .split('')
    .every(letter => guessedLetters.includes(letter));

  const addGuessedLetter = useCallback(
    (letter: string) => {
      if (guessedLetters.includes(letter) || isLoser || isWinner) return;
      setGuessedLetters(currentLetters => [...currentLetters, letter]);

      if (wordToGuess.includes(letter)) {
        playSound('correct');
      } else {
        playSound('incorrect');
      }
    },
    [guessedLetters, isWinner, isLoser, wordToGuess]
  );

  const handleRestart = () => {
    setGuessedLetters([]);
    setWordToGuess(getNewWord());
    setHint(null);
    setIsLoadingHint(false);
  };

  const handleGetHint = useCallback(async () => {
    if (hint || isLoadingHint) return;
    setIsLoadingHint(true);
    const generatedHint = await getHint(wordToGuess);
    setHint(generatedHint);
    setIsLoadingHint(false);
  }, [wordToGuess, hint, isLoadingHint]);

  useEffect(() => {
    if (isWinner) playSound('win');
  }, [isWinner]);

  useEffect(() => {
    if (isLoser) playSound('lose');
  }, [isLoser]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (!key.match(/^[a-z]$/)) return;
      e.preventDefault();
      addGuessedLetter(key);
    };
    document.addEventListener('keypress', handler);
    return () => {
      document.removeEventListener('keypress', handler);
    };
  }, [addGuessedLetter]);

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-8 items-center p-4 md:p-8 min-h-screen justify-center">
      <h1 className="text-4xl md:text-5xl font-bold text-center text-white" style={{textShadow: '0 0 10px rgba(255,255,255,0.7)'}}>Gemini Hangman</h1>
      
      <div className="text-2xl text-center">
        {isWinner && <span className="text-green-400 font-bold">Congratulations! You won!</span>}
        {isLoser && <span className="text-red-400 font-bold">Nice try! You lost.</span>}
      </div>

      <HangmanDrawing numberOfGuesses={incorrectLetters.length} />

      <Word guessedLetters={guessedLetters} wordToGuess={wordToGuess} reveal={isLoser} />

      <div className="flex flex-col md:flex-row gap-4 w-full justify-center">
          <button 
              onClick={handleGetHint} 
              disabled={isLoadingHint || !!hint || isWinner || isLoser}
              className="px-6 py-3 bg-black/30 hover:bg-black/50 disabled:bg-black/50 disabled:cursor-not-allowed rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center space-x-2 text-white border border-gray-400"
          >
              {isLoadingHint ? (
                  <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="http://www.w3.org/2000/svg">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Getting Hint...</span>
                  </>
              ) : "Get a Hint"}
          </button>
          
          {(isWinner || isLoser) && (
              <button 
                  onClick={handleRestart} 
                  className="px-6 py-3 bg-rose-600/80 hover:bg-rose-600 rounded-lg font-semibold transition-colors duration-200 text-white border border-rose-400"
              >
                  Play Again
              </button>
          )}
      </div>

      {hint && (
          <div className="p-4 bg-black/50 border border-gray-500 rounded-lg text-center text-gray-200 max-w-lg">
              <p className="font-semibold text-cyan-300">Hint:</p>
              <p className="italic text-lg">{hint}</p>
          </div>
      )}

      <div className="w-full max-w-2xl mt-4">
        <Keyboard
          disabled={isWinner || isLoser}
          activeLetters={guessedLetters.filter(letter => wordToGuess.includes(letter))}
          inactiveLetters={incorrectLetters}
          addGuessedLetter={addGuessedLetter}
        />
      </div>

    </div>
  );
}

export default App;