// src/lib/deepseek.ts

const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;
const DEEPSEEK_API_URL = process.env.DEEPSEEK_API_BASE_URL || 'https://api.deepseek.com/chat/completions';

if (!DEEPSEEK_API_KEY) {
  console.warn(
    "DEEPSEEK_API_KEY environment variable is not set. AI functionality will not work."
  );
}

interface DeepSeekChoiceMessage {
  role: string;
  content: string;
}
interface DeepSeekChoice {
  index: number;
  message: DeepSeekChoiceMessage;
  finish_reason: string;
}
interface DeepSeekUsage {
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
}
interface DeepSeekResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: DeepSeekChoice[];
  usage: DeepSeekUsage;
}
interface DeepSeekApiErrorStructure {
  message: string;
  type?: string;
  param?: string | null;
  code?: string | null;
}
interface DeepSeekApiError {
  error?: DeepSeekApiErrorStructure; 
}

export async function getAnswerFromDeepSeek(
  context: string,
  question: string,
  partyNamesForPrompt: string[]
): Promise<string> {
  if (!DEEPSEEK_API_KEY) {
    return "Error: The AI service is not configured. Missing API key.";
  }

  const partiesMention = partyNamesForPrompt.length > 0 
    ? `the electoral programs of ${partyNamesForPrompt.join(' and ')}` 
    : "the provided electoral programs";

  const systemMessage = `You are an AI assistant specialized in analyzing Portuguese political party electoral programs. 
Your answers must be based *exclusively* on the provided "Context" from the party programs. 
Do not use any external knowledge or make assumptions beyond what is written in the context.
If the answer cannot be found in the provided context, clearly state that the information is not available in the documents.
Keep your answers concise, factual, and directly relevant to the user's question.
When citing information, you can refer to the party name if relevant (e.g., "According to Party X's program...").
Format your answer using Markdown for readability (e.g., lists, bolding for emphasis) if it enhances clarity.
If the user asks to compare two or more parties on a specific topic, present the comparison in a well-formatted Markdown table where appropriate.
Answer in Portuguese unless the user's question is in English. If the question is in English, answer in English. If the question is in Portuguese, answer in Portuguese.`;

  const userPrompt = `
Context from ${partiesMention}:
--- BEGIN CONTEXT ---
${context}
--- END CONTEXT ---

User's Question: "${question}"

Based *only* on the context provided above, please answer the user's question.
Answer:
  `.trim();

  try {
    const response = await fetch(DEEPSEEK_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: systemMessage },
          { role: 'user', content: userPrompt },
        ],
        max_tokens: 1536, 
        temperature: 0.2,
      }),
    });

    if (!response.ok) {
      let errorData: DeepSeekApiError | string;
      try {
        errorData = await response.json(); 
      } catch { // MODIFIED: Removed _e parameter entirely from this inner catch
        errorData = await response.text(); 
      }
      
      console.error("DeepSeek API Error:", response.status, response.statusText, errorData);
      
      let errorMessageDetail = "";
      if (typeof errorData === 'object' && errorData !== null && 'error' in errorData && 
          typeof (errorData as DeepSeekApiError).error === 'object' && (errorData as DeepSeekApiError).error !== null &&
          'message' in (errorData as DeepSeekApiError).error! && 
          typeof (errorData as DeepSeekApiError).error!.message === 'string') {
        errorMessageDetail = ` Message: ${(errorData as DeepSeekApiError).error!.message}`;
      } else if (typeof errorData === 'string' && errorData.length > 0) {
          errorMessageDetail = ` Details: ${errorData}`;
      } else if (response.statusText) {
          errorMessageDetail = ` Reason: ${response.statusText}`;
      }
      return `AI service request failed with status ${response.status}.${errorMessageDetail}`;
    }

    const data = await response.json() as DeepSeekResponse;
    
    if (data.choices && data.choices.length > 0 && data.choices[0].message) {
      return data.choices[0].message.content.trim();
    } else {
      console.error("DeepSeek API returned no choices or unexpected structure:", data);
      return "Error: Received an empty or invalid response from the AI service.";
    }

  } catch (error) {
    console.error('Error calling DeepSeek API:', error);
    if (error instanceof Error) {
      return `Error communicating with the AI service: ${error.message}`;
    }
    return 'An unknown error occurred while contacting the AI service.';
  }
}