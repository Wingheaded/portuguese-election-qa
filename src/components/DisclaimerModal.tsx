// src/components/DisclaimerModal.tsx
"use client"; 

import { X } from "lucide-react"; 
import { useEffect } from "react";

interface DisclaimerModalProps {
  isOpen: boolean;    
  onClose: () => void; 
}

export function DisclaimerModal({ isOpen, onClose }: DisclaimerModalProps) {
  const portfolioUrl = "https://sites.google.com/view/joselearningsolutions/home"; 

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden'; 
      window.addEventListener('keydown', handleEsc);
    } else {
      document.body.style.overflow = 'auto'; 
    }

    return () => {
      window.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose]); 

  if (!isOpen) { 
    return null;
  }

  // Define problematic strings as variables
  const appTitleString = '"Q&A Programas Eleitorais Legislativas Portuguesas"';
  const repoNameString = '"Wingheaded/eleicoes-md"';
  const creditNameString = "Jose Antonio Gomes, Jose's Learning Solutions";


  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 transition-opacity duration-300 ease-in-out"
      onClick={onClose} 
      role="dialog"
      aria-modal="true"
      aria-labelledby="disclaimer-modal-title"
    >
      <div 
        className="bg-white p-6 sm:p-8 rounded-lg shadow-xl max-w-lg w-full relative text-slate-700 transform transition-all duration-300 ease-in-out scale-95 opacity-0 animate-modal-appear"
        onClick={(e) => e.stopPropagation()} 
        style={{ animationFillMode: 'forwards' }} 
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-1.5 text-slate-500 hover:text-slate-800 rounded-full hover:bg-slate-200 transition-colors"
          aria-label="Fechar aviso legal"
        >
          <X size={20} />
        </button>
        
        <h2 id="disclaimer-modal-title" className="text-2xl font-bold mb-4 text-sky-600"> 
          Informação Importante
        </h2>
        
        <div className="space-y-3 text-sm sm:text-base max-h-[60vh] sm:max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
          <p>
            {`Esta aplicação ${appTitleString} destina-se exclusivamente a `}<strong>fins informativos</strong>.
            É uma ferramenta experimental, apolítica, concebida para ajudar os eleitores a explorar e compreender os programas eleitorais de diversos partidos políticos portugueses, utilizando dados publicamente disponíveis.
          </p>
          <p>
            As respostas são geradas por uma IA (DeepSeek) com base em documentos Markdown provenientes do repositório GitHub{` `}
            <a 
              href="https://github.com/Wingheaded/eleicoes-md" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-sky-600 hover:underline"
            >
              {repoNameString}
            </a>
            . 
            Embora sejam feitos esforços para fornecer informações precisas com base no contexto fornecido, as respostas geradas por IA podem conter imprecisões, interpretações erradas ou omissões. 
            Consulte sempre os programas originais dos partidos e fontes oficiais para obter informações definitivas.
          </p>
          <p>
            Esta ferramenta não apoia qualquer partido político ou ideologia. A seleção de partidos baseia-se na disponibilidade dos dados dos programas no formato especificado.
          </p>
          <p>
            <strong>Não é Aconselhamento Profissional:</strong> A informação fornecida por esta aplicação não deve ser considerada como aconselhamento político, legal ou qualquer outra forma de aconselhamento profissional.
          </p>
          <p className="mt-4 font-semibold">
            Créditos: Aplicação conceptualizada e desenvolvida por{` `}
            <a 
              href={portfolioUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-sky-600 hover:underline focus:outline-none focus:ring-1 focus:ring-sky-500 rounded px-0.5 mx-1"
            >
              {creditNameString.replace("'", "'")} {/* Explicitly replace apostrophe for creditNameString */}
            </a>
            .
          </p>
        </div>
        
        <button
          onClick={onClose}
          className="mt-6 w-full sm:w-auto px-6 py-2.5 bg-sky-600 text-white font-medium rounded-md hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
        >
          Compreendi
        </button>
      </div>
    </div>
  );
}