// src/app/page.tsx
"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { PartySelector } from "@/components/PartySelector";
import { QuestionInput } from "@/components/QuestionInput";
import { AnswerDisplay } from "@/components/AnswerDisplay";
import { ExportButtons } from "@/components/ExportButtons";
import { DisclaimerModal } from "@/components/DisclaimerModal";
import { LoadingSpinner } from "@/components/LoadingSpinner"; 
import { AlertTriangle, Info } from "lucide-react";

interface ApiResponse {
  answer: string;
  sourceDocuments?: Record<string, string>;
  query: string; 
  error?: string; 
  details?: string;
}

export default function HomePage() {
  const [question, setQuestion] = useState("");
  const [selectedPartyIds, setSelectedPartyIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [apiResponse, setApiResponse] = useState<ApiResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showDisclaimer, setShowDisclaimer] = useState(false);

  useEffect(() => {
    const disclaimerShown = localStorage.getItem("disclaimerShown");
    if (!disclaimerShown) {
      setShowDisclaimer(true);
    }
  }, []); 

  const handleDisclaimerClose = () => {
    setShowDisclaimer(false);
    localStorage.setItem("disclaimerShown", "true");
  }; 

  const handleQuestionChange = (newQuestion: string) => {
    setQuestion(newQuestion);
  }; 

  const handlePartyToggle = (partyId: string) => {
    setSelectedPartyIds((prevSelectedPartyIds) => {
      if (prevSelectedPartyIds.includes(partyId)) {
        return prevSelectedPartyIds.filter((id) => id !== partyId);
      } else {
        return [...prevSelectedPartyIds, partyId];
      }
    }); 
  }; 

  const handleSubmit = async () => {
    if (!question.trim()) {
      setError("Por favor, introduza uma questão.");
      return;
    }
    setIsLoading(true);
    setError(null);
    setApiResponse(null);

    try {
      const basePath = process.env.NEXT_PUBLIC_BASE_PATH || ""; 
      const apiUrl = `${basePath}/api/generate-answer`;
      // console.log(`[Frontend] Calling API at: ${apiUrl}`); 

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, selectedPartyIds }),
      });
      const data: ApiResponse = await response.json();
      if (!response.ok) {
        throw new Error(data.error || data.details || `O pedido à API falhou com o estado ${response.status}`);
      }
      setApiResponse(data);
    } catch (err) {
      // console.error("Erro na submissão:", err); 
      const errorMessage = err instanceof Error ? err.message : "Ocorreu um erro desconhecido ao obter a resposta.";
      setError(errorMessage);
      setApiResponse(null);
    } finally {
      setIsLoading(false);
    }
  }; 

  const handleNewConversation = () => {
    setQuestion(""); 
    setSelectedPartyIds([]); 
    setApiResponse(null); 
    setError(null); 
    setIsLoading(false); 
    // console.log("New conversation started. State reset.");
  };

  return ( 
    <>
      <Header onNewConversation={handleNewConversation} />
      
      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-6 sm:mb-8">
            <p className="text-sm text-white px-2 [text-shadow:0_1px_2px_rgba(0,0,0,0.6)]">
              Faça perguntas sobre os programas eleitorais dos partidos políticos portugueses. 
              Desenvolvido com IA. Os resultados são apenas para fins informativos.
            </p>
            <button 
              onClick={() => setShowDisclaimer(true)} 
              className="mt-2 text-xs text-sky-300 hover:text-white hover:underline flex items-center justify-center mx-auto [text-shadow:0_1px_2px_rgba(0,0,0,0.6)]"
            >
              <Info size={14} className="mr-1 flex-shrink-0"/> Sobre esta ferramenta e Aviso Legal
            </button>
          </div>
          
          <PartySelector
            selectedParties={selectedPartyIds}
            onPartyToggle={handlePartyToggle}
          />
          <QuestionInput
            question={question}
            onQuestionChange={handleQuestionChange}
            onSubmit={handleSubmit}
            isLoading={isLoading}
          />

          {isLoading && (
            <div className="mt-8 p-6 text-center flex flex-col items-center justify-center border border-slate-300/50 rounded-xl shadow-lg bg-white/75 backdrop-blur-md">
              <LoadingSpinner 
                size={40} 
                spinnerColorClass="border-sky-500" 
                trackColorClass="border-slate-300"
                borderWidthClass="border-[5px]"
              />
              <p className="mt-4 text-slate-700">A gerar resposta... Isto pode demorar um momento.</p>
            </div>
          )}

          {error && !isLoading && (
            <div className="mt-6 p-4 text-red-800 bg-red-100 border border-red-400 rounded-lg shadow-md flex items-start">
              <AlertTriangle size={20} className="mr-2 flex-shrink-0 mt-1 text-red-600" />
              <div>
                <p className="font-semibold">Erro:</p> 
                <p>{error}</p>
              </div>
            </div>
          )}
          
          {apiResponse && !isLoading && (
            <>
              <AnswerDisplay 
                answer={apiResponse.answer} 
              />
              <ExportButtons 
                answerText={apiResponse.answer} 
                questionText={apiResponse.query || question} 
              />
            </>
          )}
          
          {!isLoading && !apiResponse && !error && (
             <div className="mt-8 text-center text-white [text-shadow:0_1px_2px_rgba(0,0,0,0.6)]">
                <h3 className="text-xl font-semibold">A resposta aparecerá aqui...</h3>
                <p className="text-sm">Coloque uma questão e selecione os partidos para começar.</p>
             </div>
          )}
        </div>
      </main>
      
      <DisclaimerModal 
        isOpen={showDisclaimer} 
        onClose={handleDisclaimerClose} 
      />
    </>
  );
}