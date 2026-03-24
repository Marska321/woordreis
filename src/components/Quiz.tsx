import React, { useState } from 'react';
import { QuizTheme, QuizQuestion } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, XCircle, Trophy, RefreshCcw, BrainCircuit, ChevronLeft } from 'lucide-react';

const QUIZ_DATA: QuizTheme[] = [
  {
    theme: "Diere (Animals)",
    questions: [
      {
        question: "Wat is 'n 'Leeu' in Engels?",
        options: ["Tiger", "Lion", "Leopard", "Cheetah"],
        correctAnswer: "Lion",
        explanation: "Die leeu is die koning van die oerwoud."
      },
      {
        question: "Hoe sê mens 'Elephant' in Afrikaans?",
        options: ["Kameelperd", "Seekoei", "Olifant", "Renoster"],
        correctAnswer: "Olifant",
        explanation: "Olifante het groot ore en 'n lang snoet."
      },
      {
        question: "Wat is 'n 'Hond'?",
        options: ["Cat", "Dog", "Horse", "Cow"],
        correctAnswer: "Dog"
      },
      {
        question: "Wat is 'n 'Kameelperd'?",
        options: ["Camel", "Horse", "Giraffe", "Zebra"],
        correctAnswer: "Giraffe",
        explanation: "Kameelperd letterlik beteken 'camel horse'."
      }
    ]
  },
  {
    theme: "Kos (Food)",
    questions: [
      {
        question: "Wat is 'Appel'?",
        options: ["Orange", "Banana", "Apple", "Pear"],
        correctAnswer: "Apple"
      },
      {
        question: "Hoe sê mens 'Bread' in Afrikaans?",
        options: ["Melk", "Brood", "Kaas", "Vleis"],
        correctAnswer: "Brood"
      },
      {
        question: "Wat is 'Melk'?",
        options: ["Water", "Juice", "Milk", "Coffee"],
        correctAnswer: "Milk"
      }
    ]
  },
  {
    theme: "Familie (Family)",
    questions: [
      {
        question: "Wie is jou 'Ma'?",
        options: ["Father", "Mother", "Sister", "Brother"],
        correctAnswer: "Mother"
      },
      {
        question: "Wat is 'Oupa'?",
        options: ["Grandmother", "Uncle", "Grandfather", "Cousin"],
        correctAnswer: "Grandfather"
      }
    ]
  }
];

const Quiz: React.FC = () => {
  const [selectedTheme, setSelectedTheme] = useState<QuizTheme | null>(null);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const handleThemeSelect = (theme: QuizTheme) => {
    setSelectedTheme(theme);
    setCurrentQuestionIdx(0);
    setScore(0);
    setShowResult(false);
    setSelectedOption(null);
    setIsCorrect(null);
  };

  const handleOptionSelect = (option: string) => {
    if (selectedOption) return;

    const currentQuestion = selectedTheme!.questions[currentQuestionIdx];
    const correct = option === currentQuestion.correctAnswer;
    
    setSelectedOption(option);
    setIsCorrect(correct);
    if (correct) setScore(prev => prev + 1);

    setTimeout(() => {
      if (currentQuestionIdx < selectedTheme!.questions.length - 1) {
        setCurrentQuestionIdx(prev => prev + 1);
        setSelectedOption(null);
        setIsCorrect(null);
      } else {
        setShowResult(true);
      }
    }, 2000);
  };

  const resetQuiz = () => {
    setSelectedTheme(null);
  };

  if (!selectedTheme) {
    return (
      <div className="flex-1 bg-[#E4E3E0] p-8 font-mono overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          <div className="mb-12">
            <h1 className="text-4xl font-bold tracking-tighter mb-4 flex items-center gap-3">
              <BrainCircuit size={32} /> WOORDESKAT VASVRA
            </h1>
            <p className="opacity-60 text-sm italic">TOETS JOU KENNIS VAN AFRIKAANSE WOORDE.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {QUIZ_DATA.map((theme, idx) => (
              <button
                key={idx}
                onClick={() => handleThemeSelect(theme)}
                className="border border-[#141414] p-8 bg-[#fff]/50 hover:bg-[#141414] hover:text-[#E4E3E0] transition-all text-left shadow-[4px_4px_0_0_#141414]"
              >
                <div className="text-xs opacity-50 mb-2 uppercase tracking-widest">TEMA_{idx + 1}</div>
                <h2 className="text-2xl font-bold">{theme.theme}</h2>
                <p className="text-[10px] mt-4 opacity-60">{theme.questions.length} VRAE</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (showResult) {
    return (
      <div className="flex-1 bg-[#E4E3E0] flex items-center justify-center p-8 font-mono">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="max-w-md w-full border border-[#141414] bg-[#fff] p-12 text-center shadow-[8px_8px_0_0_#141414]"
        >
          <Trophy size={64} className="mx-auto mb-6 opacity-20" />
          <h2 className="text-3xl font-bold mb-2">VASVRA VOLTOOI!</h2>
          <p className="text-sm opacity-60 mb-8 uppercase">JOU PUNTE VIR {selectedTheme.theme}</p>
          
          <div className="text-6xl font-bold mb-8">
            {score} / {selectedTheme.questions.length}
          </div>

          <button
            onClick={resetQuiz}
            className="w-full bg-[#141414] text-[#E4E3E0] py-4 font-bold flex items-center justify-center gap-2 hover:bg-[#333] transition-colors"
          >
            <RefreshCcw size={18} /> PROBEER WEER
          </button>
        </motion.div>
      </div>
    );
  }

  const currentQuestion = selectedTheme.questions[currentQuestionIdx];

  return (
    <div className="flex-1 bg-[#E4E3E0] flex items-center justify-center p-8 font-mono">
      <div className="max-w-2xl w-full">
        <div className="mb-8 flex justify-between items-end">
          <div>
            <div className="text-[10px] opacity-50 uppercase tracking-widest mb-1">{selectedTheme.theme}</div>
            <h2 className="text-xl font-bold">VRAAG {currentQuestionIdx + 1} VAN {selectedTheme.questions.length}</h2>
          </div>
          <div className="text-xs opacity-50">PUNTE: {score}</div>
        </div>

        <div className="border border-[#141414] bg-[#fff] p-12 shadow-[8px_8px_0_0_#141414] relative overflow-hidden">
          <h3 className="text-2xl font-bold mb-12">{currentQuestion.question}</h3>

          <div className="grid grid-cols-1 gap-4">
            {currentQuestion.options.map((option, idx) => {
              const isSelected = selectedOption === option;
              const isCorrectOption = option === currentQuestion.correctAnswer;
              
              let bgColor = 'bg-transparent';
              let borderColor = 'border-[#141414]';
              let textColor = 'text-[#141414]';

              if (selectedOption) {
                if (isCorrectOption) {
                  bgColor = 'bg-green-500';
                  textColor = 'text-white';
                  borderColor = 'border-green-600';
                } else if (isSelected && !isCorrectOption) {
                  bgColor = 'bg-red-500';
                  textColor = 'text-white';
                  borderColor = 'border-red-600';
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleOptionSelect(option)}
                  disabled={!!selectedOption}
                  className={`w-full text-left p-4 border-2 ${borderColor} ${bgColor} ${textColor} font-bold transition-all flex justify-between items-center group`}
                >
                  {option}
                  {selectedOption && isCorrectOption && <CheckCircle2 size={20} />}
                  {selectedOption && isSelected && !isCorrectOption && <XCircle size={20} />}
                </button>
              );
            })}
          </div>

          <AnimatePresence>
            {selectedOption && currentQuestion.explanation && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                className="mt-8 pt-8 border-t border-[#141414]/10 text-xs italic opacity-60"
              >
                VERDUIDELIKING: {currentQuestion.explanation}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Progress bar */}
          <div className="absolute bottom-0 left-0 w-full h-1 bg-[#141414]/10">
            <motion.div 
              className="h-full bg-[#141414]"
              initial={{ width: 0 }}
              animate={{ width: `${((currentQuestionIdx + 1) / selectedTheme.questions.length) * 100}%` }}
            />
          </div>
        </div>

        <button 
          onClick={resetQuiz}
          className="mt-8 text-[10px] opacity-40 hover:opacity-100 transition-opacity flex items-center gap-1"
        >
          <ChevronLeft size={12} /> TERUG NA TEMAS
        </button>
      </div>
    </div>
  );
};

export default Quiz;
