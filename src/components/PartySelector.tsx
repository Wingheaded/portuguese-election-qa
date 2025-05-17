// src/components/PartySelector.tsx
"use client";

import { PARTIES } from "@/lib/constants";
import Image from "next/image";

interface PartySelectorProps {
  selectedParties: string[]; // Now expects this prop
  onPartyToggle: (partyId: string) => void; // Now expects this prop
}

export function PartySelector({ selectedParties, onPartyToggle }: PartySelectorProps) {
  return (
    <div className="mb-6 p-4 sm:p-6 border border-black/10 rounded-xl shadow-lg bg-white/10 backdrop-blur-md"> {/* CHANGED bg-white/75 to bg-white/60 */}
      <h2 className="text-lg font-semibold mb-3 text-white [text-shadow:0_1px_2px_rgba(0,0,0,0.6)]">  
        Selecione o/s Partido/s a Consultar:
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {PARTIES.map((party) => (
          <label
            key={party.id}
            className={`flex items-center justify-center p-3 rounded-md cursor-pointer transition-all
                        border-2 
                        ${selectedParties.includes(party.id) // Conditional styling for selected parties
                          ? 'border-sky-500 bg-sky-50 dark:bg-sky-900/50 ring-2 ring-sky-500' 
                          : 'border-slate-300 dark:border-slate-600 hover:bg-slate-200 dark:hover:bg-slate-700'
                        }
                        focus-within:ring-2 focus-within:ring-sky-500 focus-within:border-sky-500`}
            title={party.name}
          >
            <input
              type="checkbox"
              value={party.id} // Good practice to add value
              checked={selectedParties.includes(party.id)} // Control checked state from props
              onChange={() => onPartyToggle(party.id)} // Call handler from props on change
              className="form-checkbox h-6 w-6 text-sky-600 rounded border-slate-400 dark:border-slate-500 focus:ring-sky-500 bg-white dark:bg-slate-700 dark:checked:bg-sky-500 flex-shrink-0 mr-3"
            />
            <div 
              className="flex-shrink-0 h-[50px] flex items-center"
            > 
              <Image 
                src={party.logo} 
                alt={`${party.name} logo`}
                height={50}
                width={50}
                style={{ height: '50px', width: 'auto', maxWidth: '150px' }}
                className="rounded-sm" 
              />
            </div>
          </label>
        ))}
      </div>
      <p className="mt-3 text-xs text-white [text-shadow:0_1px_1px_rgba(0,0,0,0.7)] opacity-90">
        Dica: Selecionar partidos específicos resulta em respostas mais rápidas e direcionadas.
      </p>
    </div>
  );
}