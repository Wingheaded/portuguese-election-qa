// src/lib/constants.ts

export interface Party {
  id: string; // A short, unique identifier (e.g., 'PS', 'AD')
  name: string; // The full name of the party (e.g., 'Partido Socialista')
  logo: string; // The path to the party's logo image (e.g., '/logos/ps.png')
  // color?: string; // Optional: if we wanted to assign a specific color to each party
}

export const PARTIES: Party[] = [
  { id: 'AD', name: 'Aliança Democrática', logo: '/legislativas2025/logos/AD.png' },
  { id: 'BE', name: 'Bloco de Esquerda', logo: '/legislativas2025/logos/BE.png' },
  { id: 'CDU', name: 'CDU - Coligação Democrática Unitária', logo: '/legislativas2025/logos/CDU.png' },
  { id: 'CH', name: 'Chega', logo: '/legislativas2025/logos/Chega.png' },
  { id: 'IL', name: 'Iniciativa Liberal', logo: '/legislativas2025/logos/IL.png' },
  { id: 'L', name: 'Livre', logo: '/legislativas2025/logos/Livre.png' },
  { id: 'PAN', name: 'PAN - Pessoas-Animais-Natureza', logo: '/legislativas2025/logos/PAN.png' },
  { id: 'PS', name: 'Partido Socialista', logo: '/legislativas2025/logos/PS.png' },
  // Add or remove parties as needed based on the GitHub repository content
];

// This is the base URL for fetching the Markdown files from GitHub
export const GITHUB_MARKDOWN_BASE_URL = 'https://raw.githubusercontent.com/Wingheaded/eleicoes-md/refs/heads/main/';

// This mapping helps us find the correct Markdown file for each party ID.
// The keys (e.g., 'AD') should match the `id` in the PARTIES array above.
// The values (e.g., 'AD') should match the filename (without .md) in the GitHub repository.
// IMPORTANT: Adjust these values if the filenames in the GitHub repo are different!
// src/lib/constants.ts
// ... (PARTIES array and GITHUB_MARKDOWN_BASE_URL remain the same as above) ...
export const PARTY_ID_TO_FILENAME_MAP: { [key: string]: string } = {
  'AD': 'AD',         // Matches AD.md
  'BE': 'BE',         // Matches BE.md
  'CDU': 'CDU',       // Matches CDU.md
  'CH': 'Chega',      // << CHANGED: 'CH' (id) now maps to 'Chega' (filename 'Chega.md')
  'IL': 'IL',         // Matches IL.md
  'L': 'Livre',       // << CHANGED: 'L' (id) now maps to 'Livre' (filename 'Livre.md')
  'PAN': 'PAN',       // Matches PAN.md
  'PS': 'PS'          // Matches PS.md
};