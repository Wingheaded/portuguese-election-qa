// src/components/AnswerDisplay.tsx
"use client";

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw'; 

interface AnswerDisplayProps {
  answer: string;
  // query prop removed
}

const CustomLink = ({ href, children }: { href?: string; children?: React.ReactNode }) => {
  const isInternal = href && href.startsWith('#');
  return (
    <a 
      href={href} 
      target={isInternal ? '_self' : '_blank'} 
      rel={isInternal ? undefined : 'noopener noreferrer'}
      className="text-sky-600 hover:underline"
    >
      {children}
      {!isInternal && href && <span className="ml-1">🔗</span>}
    </a>
  );
};

// query prop removed from destructuring
export function AnswerDisplay({ answer }: AnswerDisplayProps) { 
  if (!answer) {
    return null;
  }

  return (
    <div className="mt-8 p-6 border border-black/10 rounded-xl shadow-lg bg-white/75 backdrop-blur-md">
      <h2 className="text-xl font-semibold mb-4 text-slate-800"> 
        Resposta:
      </h2>
      <div className="prose prose-slate max-w-none"> 
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeRaw]} 
          components={{
            a: CustomLink,
            // 'node' (or '_node') removed from parameters
            table: ({/* node, */ ...props}) => (
              <div className="overflow-x-auto my-6"> 
                <table 
                  className="min-w-full border border-collapse border-slate-300" 
                  {...props} 
                />
              </div>
            ),
            thead: ({/* node, */ ...props}) => (
              <thead 
                className="bg-slate-100" 
                {...props} 
              />
            ),
            th: ({/* node, */ ...props}) => (
              <th 
                className="border border-slate-300 px-4 py-2 text-left text-sm font-semibold text-slate-700" 
                {...props} 
              />
            ),
            td: ({/* node, */ ...props}) => (
              <td 
                className="border border-slate-300 px-4 py-2 text-sm text-slate-700 align-top"
                {...props} 
              />
            ),
          }}
        >
          {answer}
        </ReactMarkdown>
      </div>
    </div>
  );
}