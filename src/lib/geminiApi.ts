// Google Gemini AI Integration
import { GoogleGenerativeAI } from '@google/generative-ai';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';

let genAI: GoogleGenerativeAI | null = null;

if (GEMINI_API_KEY) {
  genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
}

export interface PredictionRequest {
  type: 'lottery' | 'sports';
  historicalData: any[];
  gameType?: string;
  additionalContext?: string;
}

export interface PredictionResponse {
  predictions: any[];
  confidence: number;
  analysis: string;
  factors: string[];
}

export async function generatePrediction(request: PredictionRequest): Promise<PredictionResponse> {
  if (!genAI) {
    throw new Error('Gemini AI not initialized. Check API key.');
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const prompt = buildPrompt(request);
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Parse the AI response
    const parsedResponse = parseAIResponse(text, request.type);
    return parsedResponse;
  } catch (error) {
    console.error('Error generating prediction:', error);
    throw error;
  }
}

function buildPrompt(request: PredictionRequest): string {
  const { type, historicalData, gameType, additionalContext } = request;

  if (type === 'lottery') {
    return `
      You are an expert data analyst specializing in lottery number patterns.
      
      Game Type: ${gameType}
      Historical Data: ${JSON.stringify(historicalData.slice(0, 20))}
      ${additionalContext ? `Additional Context: ${additionalContext}` : ''}
      
      Analyze the historical patterns and provide:
      1. Predicted numbers for the next drawing
      2. Confidence level (0-100%)
      3. Key factors influencing your prediction
      4. Pattern analysis
      
      Return your response in JSON format with the following structure:
      {
        "predictions": [array of predicted numbers],
        "confidence": number,
        "analysis": "detailed analysis",
        "factors": ["factor1", "factor2", ...]
      }
    `;
  } else {
    return `
      You are an expert sports analyst.
      
      Historical Data: ${JSON.stringify(historicalData.slice(0, 10))}
      ${additionalContext ? `Additional Context: ${additionalContext}` : ''}
      
      Analyze the data and provide:
      1. Game outcome predictions
      2. Confidence level (0-100%)
      3. Key factors influencing your prediction
      4. Statistical analysis
      
      Return your response in JSON format with the following structure:
      {
        "predictions": [array of predictions],
        "confidence": number,
        "analysis": "detailed analysis",
        "factors": ["factor1", "factor2", ...]
      }
    `;
  }
}

function parseAIResponse(text: string, type: string): PredictionResponse {
  try {
    // Try to extract JSON from the response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
  } catch (error) {
    console.error('Error parsing AI response:', error);
  }

  // Fallback response if parsing fails
  return {
    predictions: [],
    confidence: 50,
    analysis: text,
    factors: ['Pattern analysis', 'Historical trends'],
  };
}

export async function analyzePatterns(data: any[]): Promise<string> {
  if (!genAI) {
    throw new Error('Gemini AI not initialized. Check API key.');
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const prompt = `Analyze the following data patterns and provide insights: ${JSON.stringify(data)}`;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error analyzing patterns:', error);
    throw error;
  }
}
