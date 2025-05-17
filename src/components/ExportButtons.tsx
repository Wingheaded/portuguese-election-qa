// src/components/ExportButtons.tsx
"use client"; 

import { Copy, Download } from "lucide-react"; 
import { useState } from "react";
import ReactDOMServer from 'react-dom/server';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface ExportButtonsProps {
  answerText: string;       
  questionText: string;     
}

const downloadedHtmlStyles = `
  body { font-family: sans-serif; line-height: 1.6; padding: 20px; margin: 0; }
  h1, h2, h3 { color: #333; }
  h1 { font-size: 1.8em; margin-bottom: 0.5em; }
  h2 { font-size: 1.4em; margin-bottom: 0.4em; }
  p { margin-bottom: 1em; }
  ul, ol { margin-bottom: 1em; padding-left: 20px; }
  li { margin-bottom: 0.3em; }
  table { border-collapse: collapse; width: 100%; margin-bottom: 1em; }
  th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
  th { background-color: #f2f2f2; }
  blockquote { border-left: 4px solid #eee; padding-left: 1em; margin-left: 0; color: #666; }
  code { background-color: #f9f9f9; padding: 2px 4px; border-radius: 4px; font-family: monospace; }
  pre { background-color: #f0f0f0; padding: 10px; border-radius: 4px; overflow-x: auto; }
  pre code { background-color: transparent; padding: 0; }
  a { color: #007bff; text-decoration: none; }
  a:hover { text-decoration: underline; }
`;

export function ExportButtons({ answerText, questionText }: ExportButtonsProps) {
  const [copyStatus, setCopyStatus] = useState<string>("Copiar para a Área de Transferência");

  if (!answerText) { 
    return null;
  }

  const handleCopyToClipboard = () => {
    const textToCopy = `Pergunta: ${questionText}\n\nResposta:\n${answerText}`;
    navigator.clipboard.writeText(textToCopy)
      .then(() => {
        setCopyStatus("Copiado!");
        setTimeout(() => setCopyStatus("Copiar para a Área de Transferência"), 2000); 
      })
      .catch(err => {
        console.error('Falha ao copiar: ', err);
        setCopyStatus("Falha ao Copiar!");
        setTimeout(() => setCopyStatus("Copiar para a Área de Transferência"), 2000);
      });
  };

  const handleDownloadHtml = () => {
    const safeQuestionSummary = questionText
      .replace(/[^\w\s-]/g, '') 
      .replace(/\s+/g, '_')     
      .substring(0, 30);        
    const filename = `Q&A_Eleicoes_${safeQuestionSummary || 'resposta'}.html`;

    const answerHtml = ReactDOMServer.renderToStaticMarkup(
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {answerText}
      </ReactMarkdown>
    );

    // THIS IS THE CORRECTED htmlContent
    const htmlContent = `
      <!DOCTYPE html>
      <html lang="pt">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Q&A Eleições: ${safeQuestionSummary || 'Resposta'}</title>
        <style>${downloadedHtmlStyles}</style>
      </head>
      <body>
        <h1>Pergunta:</h1>
        <p>${questionText.replace(/</g, "<").replace(/>/g, ">")}</p>
        <hr>
        <h2>Resposta:</h2>
        <div>${answerHtml}</div>
      </body>
      </html>
    `.trim(); // Added .trim() for good measure to remove any leading/trailing whitespace from the template string

    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = filename; 
    document.body.appendChild(link); 
    link.click();
    document.body.removeChild(link); 
    URL.revokeObjectURL(url); 
  };

  return (
    <div className="mt-6 flex items-center space-x-3">
      <button
        onClick={handleCopyToClipboard}
        className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-sky-700 bg-sky-100 hover:bg-sky-200 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:ring-offset-white"
        title="Copiar pergunta e resposta para a área de transferência"
      >
        <Copy size={16} />
        <span>{copyStatus}</span>
      </button>
      <button
        onClick={handleDownloadHtml}
        className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-sky-700 bg-sky-100 hover:bg-sky-200 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:ring-offset-white"
        title="Descarregar pergunta e resposta como ficheiro HTML (.html)"
      >
        <Download size={16} />
        <span>Descarregar</span> 
      </button>
    </div>
  );
}