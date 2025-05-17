// src/components/QuestionInput.tsx
"use client";

import { Send } from "lucide-react";
import { LoadingSpinner } from "./LoadingSpinner"; 

interface QuestionInputProps {
  question: string;
  onQuestionChange: (question: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

export function QuestionInput({ question, onQuestionChange, onSubmit, isLoading }: QuestionInputProps) {
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); 
    if (!isLoading && question.trim()) { 
      onSubmit();
    }
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className="mb-6"
    >
      <label 
        htmlFor="question-input" 
        className="block text-lg font-semibold mb-2 text-white [text-shadow:0_1px_2px_rgba(0,0,0,0.6)]"
         // Uses white text with shadow, as adjusted previously
      >
        Coloque a sua questão:
      </label>
       {/* Using items-stretch makes button height match textarea height */}
      <div className="flex items-stretch space-x-2"> 
        <textarea
          id="question-input"
          value={question} 
          onChange={(e) => onQuestionChange(e.target.value)} 
          placeholder="Ex: Quais são as propostas para a saúde?"
          rows={3}
           //  w-full and flex-grow make it take up width.
           // resize-none PREVENTS the textarea height from changing.
          className="flex-grow w-full p-3 border border-black/20 rounded-lg bg-white/80 backdrop-blur-sm text-slate-800 focus:ring-sky-500 focus:border-sky-500 outline-none transition-colors resize-none shadow-sm" 
          disabled={isLoading} 
        />
        <button
          type="submit"
          disabled={isLoading || !question.trim()} 
           // Button height will be controlled by the parent's items-stretch.
           // flex-shrink-0 ensures button width is preserved.
          className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-opacity flex-shrink-0"
        >
          {isLoading ? (
            <LoadingSpinner 
              size={20} 
              spinnerColorClass="border-white" 
              trackColorClass="border-sky-300/50"
              borderWidthClass="border-2"
            />
          ) : (
            <Send size={20} />
          )}
          <span className="sr-only">Submeter Questão</span>
        </button>
      </div>
    </form>
  );
}