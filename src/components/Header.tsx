// src/components/Header.tsx
import Image from 'next/image';
import Link from 'next/link';
import { MessageSquarePlus } from 'lucide-react'; // Icon for "New Conversation"

// --- Define props for Header ---
interface HeaderProps {
  onNewConversation: () => void; // Function to call when "New Conversation" is clicked
}
// --- END Props Definition ---

// Modified to accept and use onNewConversation prop
export function Header({ onNewConversation }: HeaderProps) { 
  // Style choices from previous steps (e.g., Option 4 for background, specific text style)
  const headerBackgroundAndBorderStyle = "border-b border-white/20"; 
  const titleTextStyle = "text-white [text-shadow:0_1px_3px_rgba(0,0,0,0.7)]";
  const scrollOverlapSolutionClasses = "bg-black/5 backdrop-blur-sm"; 
  
  const headerBaseClasses = `
    py-3 sm:py-4 px-4 sm:px-6 lg:px-8 
    sticky top-0 z-20 
    transition-colors duration-300 ease-in-out
  `;

  const portfolioUrl = "https://sites.google.com/view/joselearningsolutions/home"; 

  return (
    <header 
      className={`${headerBaseClasses} ${headerBackgroundAndBorderStyle} ${scrollOverlapSolutionClasses}`}
    >
      <div className="container mx-auto flex justify-between items-center">
        {/* Left side: Logo and Title */}
        <div className="flex items-center space-x-3">
          <Link 
            href={portfolioUrl} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="block hover:opacity-80 transition-opacity"
            aria-label="Visitar o portfólio de Jose's Learning Solutions"
          >
            <Image 
              src="/legislativas2025/logos/joseLogoSimplesWhite.png"
              alt="Logótipo Jose's Learning Solutions"    
              width={40}  
              height={40} 
              className="rounded-sm" 
              priority 
            />
          </Link>
          <h1 
            className={`
              text-lg sm:text-xl font-bold 
              transition-colors duration-300 ease-in-out
              ${titleTextStyle}
            `}
          >
            Q&A Programas Eleitorais - Portugal 2025
          </h1>
        </div>

        {/* Right side: New Conversation Button */}
        <div>
          <button
            onClick={onNewConversation} // Call the handler from props
            className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-white hover:bg-white/10 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-white/50 [text-shadow:0_1px_2px_rgba(0,0,0,0.5)]"
            title="Iniciar nova conversa" 
          >
            <MessageSquarePlus size={18} />
            <span>Nova Conversa</span>
          </button>
        </div>
      </div>
    </header>
  );
}