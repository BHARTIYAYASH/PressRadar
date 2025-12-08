import { GoogleGenAI } from "@google/genai";
import { Language, NewsResult, WebSource } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

interface TrackOptions {
  topic?: string;
  language: Language;
  selectedSources: string[];
  includeEPapers: boolean;
  isWireRequest?: boolean;
}

export const trackNewsTopic = async (options: TrackOptions): Promise<NewsResult> => {
  if (!apiKey) {
    throw new Error("API Key missing. Please check your environment configuration.");
  }

  const { topic, language, selectedSources, includeEPapers, isWireRequest } = options;

  try {
    let sourceInstruction = "";
    if (selectedSources.length > 0) {
      sourceInstruction = `
        STRICT SOURCE FILTERING:
        You must prioritize information ONLY from the following publications: ${selectedSources.join(", ")}.
        If news is not available in these specific sources, explicitly state that in the opening sentence.
      `;
    }

    let ePaperInstruction = "";
    if (includeEPapers) {
      ePaperInstruction = `
        E-PAPER & PDF SEARCH:
        The user is specifically looking for "E-Paper" or digital print editions. 
        - Actively search for mentions or links from 'tradingref.com', 'epaper.thehindu.com', 'epaper.timesgroup.com', etc.
        - If you find a direct PDF or E-Paper viewer link, highlight it at the top of the summary.
      `;
    }

    let prompt = "";

    if (isWireRequest) {
      prompt = `
        Role: You are a Wire Service Operator (like PTI or Reuters).
        Task: Fetch the "Top 5 Critical News Headlines" for India and Global Markets right now.
        
        Directives:
        1. Ignore specific topics. Give me the most important breaking news in the last 6 hours.
        2. Language: Output in ${language}.
        3. Format: Return a clean list. Use asterisks for bolding headlines like this: **HEADLINE**. 
        4. Structure:
           - **HEADLINE 1**: Brief summary.
           - **HEADLINE 2**: Brief summary.
        5. Tone: Urgent, factual, telegraphic style. Avoid introductory fluff like "Here are the headlines". Start directly with the news.
      `;
    } else {
      prompt = `
        Role: You are a senior News Archivist and Editor.
        Task: Track coverage for the topic: "${topic}".
        
        ${sourceInstruction}
        
        ${ePaperInstruction}
        
        Directives:
        1. Search for recent coverage (last 24-48 hours).
        2. Language: Output in ${language}.
        3. Tone: Formal, journalistic.
        4. Formatting: Use **Bold** for key entities or stats. Break into paragraphs.
        5. Structure: Write a cohesive "Editor's Note" or column about how this story is developing.
      `;
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        temperature: 0.3,
      },
    });

    const summaryText = response.text || "No wire dispatch received.";

    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const sources: WebSource[] = [];
    
    groundingChunks.forEach((chunk: any) => {
      if (chunk.web) {
        sources.push({
          uri: chunk.web.uri,
          title: chunk.web.title || new URL(chunk.web.uri).hostname,
        });
      }
    });

    const uniqueSources = sources.filter((source, index, self) =>
      index === self.findIndex((t) => (
        t.uri === source.uri
      ))
    );

    return {
      id: crypto.randomUUID(),
      topic: isWireRequest ? "WIRE SERVICE DISPATCH" : (topic || "Unknown Topic"),
      summary: summaryText,
      language,
      timestamp: new Date().toISOString(),
      sources: uniqueSources,
      isWire: isWireRequest
    };

  } catch (error: any) {
    console.error("Gemini News Tracking Error:", error);
    throw new Error(error.message || "Failed to retrieve news from the wire.");
  }
};