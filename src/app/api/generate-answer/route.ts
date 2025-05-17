// src/app/api/generate-answer/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { fetchAndChunkMarkdownForContext } from '@/lib/markdownFetcher'; 
import { getAnswerFromDeepSeek } from '@/lib/deepseek';       
import { PARTIES } from '@/lib/constants';                     

interface GenerateAnswerRequestBody {
  question: string;
  selectedPartyIds: string[];
}

const AVERAGE_CHARS_PER_TOKEN = 4; 
const CONTEXT_TOKEN_LIMIT = 60000; 

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as GenerateAnswerRequestBody;
    const { question, selectedPartyIds } = body;

    if (!question || typeof question !== 'string' || question.trim().length === 0) {
      return NextResponse.json({ error: 'Question is required and cannot be empty.' }, { status: 400 });
    }
    if (!Array.isArray(selectedPartyIds)) {
      return NextResponse.json({ error: 'selectedPartyIds must be an array.' }, { status: 400 });
    }

    console.log(`[API Route] Received question: "${question}", Selected Parties: ${selectedPartyIds.join(', ') || 'Defaulting to all relevant'}`);

    // Fixed: Removed allChunksByParty from destructuring as it's not used, and removed 'question' from call
    const { contextForAI, individualPartyContents } = await fetchAndChunkMarkdownForContext(
      selectedPartyIds 
    );

    if (!contextForAI) { 
         const fetchErrorMsg = selectedPartyIds.length > 0 
            ? "Could not retrieve and process program content for the selected parties. Please try again or select different parties."
            : "Could not retrieve and process any party program content at this time. Please try again later.";
         return NextResponse.json({ 
            answer: fetchErrorMsg,
            sourceDocuments: individualPartyContents, 
            query: question 
        }, { status: 200 });
    }

    const estimatedContextCharacters = contextForAI.length + question.length; 
    const estimatedContextTokens = estimatedContextCharacters / AVERAGE_CHARS_PER_TOKEN;
    const estimatedTotalTokens = estimatedContextTokens + 500 + 1536; 

    console.log(`[API Route] Estimated Context (from chunks) Tokens: ${estimatedContextTokens.toFixed(0)}`);
    console.log(`[API Route] Estimated Total Tokens (incl. prompts/completion): ${estimatedTotalTokens.toFixed(0)}`);

    if (estimatedTotalTokens > CONTEXT_TOKEN_LIMIT) {
        const selectedPartyNames = selectedPartyIds.length > 0 
           ? PARTIES.filter(p => selectedPartyIds.includes(p.id)).map(p => p.name).join(', ') 
           // Fixed: Used selectedPartyIds here
           : (selectedPartyIds.length === 0 ? 'all parties' : 'selected parties'); 
        const sizeErrorMsg = `The selected program sections for ${selectedPartyNames} are still too large (${estimatedTotalTokens.toFixed(0)} tokens) for the AI model (${CONTEXT_TOKEN_LIMIT} token limit). Please try a more specific selection or a different question if querying many parties.`;
        console.warn(`[API Route] Chunked context size exceeded limit check: ${sizeErrorMsg}`);
        return NextResponse.json({ 
            answer: sizeErrorMsg,
            sourceDocuments: individualPartyContents,
            query: question 
        }, { status: 200 }); 
    }

    const partyIdsForPrompt = selectedPartyIds.length > 0 ? selectedPartyIds : PARTIES.map(p => p.id);
    const partyNamesForPrompt = partyIdsForPrompt
        .map(id => PARTIES.find(p => p.id === id)?.name)
        .filter(name => name !== undefined) as string[];

    const aiResponse = await getAnswerFromDeepSeek(contextForAI, question, partyNamesForPrompt);

    return NextResponse.json({ 
      answer: aiResponse, 
      sourceDocuments: individualPartyContents, 
      query: question 
    });

  } catch (error) {
    console.error('[API Route Error] Error in /api/generate-answer:', error);
    let errorMessage = 'Failed to generate answer due to an unexpected server error.';
    if (error instanceof SyntaxError) {
        errorMessage = 'Invalid request format. Please ensure you are sending valid JSON in the request body.';
        return NextResponse.json({ error: errorMessage, details: error.message }, { status: 400 });
    } else if (error instanceof Error) {
        errorMessage = error.message; 
    }
    
    return NextResponse.json({ error: 'Failed to generate answer.', details: errorMessage }, { status: 500 });
  }
}