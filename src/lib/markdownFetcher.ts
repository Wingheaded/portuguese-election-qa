// src/lib/markdownFetcher.ts
import { GITHUB_MARKDOWN_BASE_URL, PARTY_ID_TO_FILENAME_MAP, PARTIES } from './constants';

const markdownCache = new Map<string, { data: string; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; 

const TARGET_CHUNK_CHAR_SIZE = 6000; 
const OVERLAP_CHARS = 200; 

// MODIFIED: Removed partyIdForLog from parameters
function chunkMarkdownByLogic(markdownText: string): string[] {
  const chunks: string[] = [];
  const sections = markdownText.split(/\n(?=##\s)/).map(section => section.trim()).filter(s => s.length > 0);

  if (sections.length === 0 && markdownText.length > 0) {
    sections.push(markdownText);
  }
  
  // console.log(`[Chunker] Document split into ${sections.length} initial sections.`);

  // MODIFIED: Removed sectionIndex from forEach parameters
  sections.forEach((section /*, sectionIndex */) => {
    if (section.length <= TARGET_CHUNK_CHAR_SIZE) {
      chunks.push(section);
    } else {
      // console.log(`[Chunker] Section is too large (${section.length} chars), attempting further splits.`);
      let currentPosition = 0;
      while (currentPosition < section.length) {
        let endPosition = Math.min(currentPosition + TARGET_CHUNK_CHAR_SIZE, section.length);
        
        if (endPosition < section.length) { 
            let breakPoint = section.lastIndexOf('\n\n', endPosition); 
            if (breakPoint <= currentPosition + OVERLAP_CHARS) { 
                breakPoint = section.lastIndexOf('\n### ', endPosition); 
            }
            if (breakPoint > currentPosition + OVERLAP_CHARS) { 
                endPosition = breakPoint;
            }
        }

        const chunkContent = section.substring(currentPosition, endPosition).trim();
        if (chunkContent) {
            chunks.push(chunkContent);
        }
        
        currentPosition = endPosition - (endPosition < section.length ? OVERLAP_CHARS : 0); 
        if (currentPosition <= section.lastIndexOf(chunkContent, endPosition)) currentPosition = endPosition; 
        if (currentPosition >= section.length && section.length > 0 && chunks.length === 0) { 
            chunks.push(section.substring(0, TARGET_CHUNK_CHAR_SIZE).trim()); 
            break;
        }
      }
    }
  });

  if (chunks.length === 0 && markdownText.length > 0) {
    // console.warn(`[Chunker] Fallback: Document could not be effectively chunked...`);
    chunks.push(markdownText.substring(0, TARGET_CHUNK_CHAR_SIZE).trim());
  }
  
  // console.log(`[Chunker] Produced ${chunks.length} chunks.`);
  return chunks.filter(chunk => chunk.length > 0);
}

async function fetchRawMarkdownContent(partyId: string): Promise<string> {
  const partyFilename = PARTY_ID_TO_FILENAME_MAP[partyId.toUpperCase()];
  if (!partyFilename) {
    return `Program for party ID '${partyId}' not found or mapping is missing.`;
  }
  const url = `${GITHUB_MARKDOWN_BASE_URL}${partyFilename}.md`;

  const cachedEntry = markdownCache.get(url);
  if (cachedEntry && (Date.now() - cachedEntry.timestamp < CACHE_TTL)) {
    return cachedEntry.data;
  }

  try {
    const response = await fetch(url, { next: { revalidate: CACHE_TTL / 1000 } }); 
    if (!response.ok) {
      console.error(`Failed to fetch ${url}: ${response.status} ${response.statusText}`);
      return `Error fetching program for ${partyId} (${response.statusText}). Please check the party ID and data source.`;
    }
    const content = await response.text();
    markdownCache.set(url, { data: content, timestamp: Date.now() });
    return content;
  } catch (error) {
    console.error(`Network or other error fetching Markdown for ${partyId} from ${url}:`, error);
    return `Error fetching program for ${partyId}. Please try again later.`;
  }
}

export async function fetchAndChunkMarkdownForContext(
  partyIds: string[]
): Promise<{ contextForAI: string; individualPartyContents: Record<string, string>; allChunksByParty: Record<string, string[]> }> {
  
  let partyIdsToFetch = partyIds;
  if (partyIdsToFetch.length === 0) {
    partyIdsToFetch = PARTIES.map(p => p.id);
  }

  const individualPartyContents: Record<string, string> = {}; 
  const allChunksByParty: Record<string, string[]> = {}; 
  const contextChunksForAI: string[] = [];

  for (const id of partyIdsToFetch) {
    const partyInfo = PARTIES.find(p => p.id === id);
    const partyDisplayName = partyInfo ? partyInfo.name : id;

    const rawContent = await fetchRawMarkdownContent(id);
    individualPartyContents[id] = rawContent; 

    if (rawContent.startsWith("Error fetching program") || rawContent.startsWith("Program for party ID")) {
        allChunksByParty[id] = [rawContent]; 
        contextChunksForAI.push(`--- CONTENT FOR ${partyDisplayName} (${id}) ---\n\n${rawContent}\n\n--- END CONTENT FOR ${partyDisplayName} (${id}) ---\n\n`);
        continue;
    }
    
    // MODIFIED: Removed partyIdForLog argument from chunkMarkdownByLogic call
    const chunks = chunkMarkdownByLogic(rawContent);
    allChunksByParty[id] = chunks;
    
    let chunksToAddForThisParty: string[] = [];
    if (partyIdsToFetch.length === 1) {
      chunksToAddForThisParty = chunks.slice(0, 10); 
    } else if (partyIdsToFetch.length <= 3) {
      chunksToAddForThisParty = chunks.slice(0, 3);  
    } else {
      chunksToAddForThisParty = chunks.slice(0, 1); 
    }
    
    if (chunksToAddForThisParty.length > 0) {
        const partyHeader = `--- RELEVANT SECTIONS FROM ${partyDisplayName} (${id}) ---\n\n`;
        const partyFooter = `\n\n--- END SECTIONS FOR ${partyDisplayName} (${id}) ---\n\n`;
        contextChunksForAI.push(partyHeader + chunksToAddForThisParty.join("\n\n...\n\n") + partyFooter); 
    }
  }

  const contextForAI = contextChunksForAI.join('\n');

  return { contextForAI, individualPartyContents, allChunksByParty };
}