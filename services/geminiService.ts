
import { GoogleGenAI } from "@google/genai";
import { Language, NewsResult, WebSource, TrackedTopic } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

interface TrackOptions {
  topic?: string;
  language: Language;
  selectedSources: string[];
  includeEPapers: boolean;
  isWireRequest?: boolean;
  context?: string;
}

export const trackNewsTopic = async (options: TrackOptions): Promise<NewsResult> => {
  const { topic, language, selectedSources, includeEPapers, isWireRequest, context } = options;

  try {
    let sourceInstruction = "";
    if (selectedSources.length > 0) {
      sourceInstruction = `STRICT SOURCE FILTERING: Prioritize info from: ${selectedSources.join(", ")}.`;
    }

    let prompt = "";
    if (isWireRequest) {
      prompt = `Role: Wire Service Operator. Fetch Top 10 Critical News Headlines for India/Global in ${language}. Start directly with bullet points. Tone: Urgent. Include as much detail as possible for each headline.`;
    } else {
      prompt = `
        Role: Lead Investigative Journalist & Intelligence Officer.
        Subject: "${topic}"
        Context: "${context || 'General news tracking'}"
        Language: ${language}
        ${sourceInstruction}
        
        Task: Provide an EXHAUSTIVE and COMPLETE intelligence briefing. Do not summarize briefly. 
        I need a full report covering all facets of the latest developments from the last 24-48 hours.
        
        Requirements:
        1. STRUCTURE: Use a clear headline, followed by a multi-section report (Introduction, Key Findings, Local Impact, Future Outlook).
        2. DETAIL: Provide specific names, dates, amounts, and locations. 
        3. CITATIONS: Mention the newspaper or source name within the text when reporting a specific fact (e.g., "According to The Hindu...").
        4. COMPLETENESS: Ensure the report reaches a logical conclusion. Do not cut off mid-sentence.
        
        Formatting: Use **Bold** for names and figures. Use paragraphs.
      `;
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        temperature: 0.1, // Lower temperature for more factual consistency
        maxOutputTokens: 2500, // Increased to prevent "half" news
      },
    });

    const summaryText = response.text || "Dispatch received but empty.";
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const sources: WebSource[] = groundingChunks
      .filter((chunk: any) => chunk.web)
      .map((chunk: any) => ({
        uri: chunk.web.uri,
        title: chunk.web.title || new URL(chunk.web.uri).hostname,
      }));

    return {
      id: crypto.randomUUID(),
      topic: isWireRequest ? "WIRE DISPATCH" : (topic || "Unknown"),
      summary: summaryText,
      language,
      timestamp: new Date().toISOString(),
      sources: sources.filter((v, i, a) => a.findIndex(t => t.uri === v.uri) === i),
      isWire: isWireRequest
    };
  } catch (error: any) {
    throw new Error(error.message || "Telegraph signal lost.");
  }
};

export const runWatchlistScan = async (topics: TrackedTopic[]): Promise<NewsResult[]> => {
  const activeTopics = topics.filter(t => t.isActive);
  const results: NewsResult[] = [];

  for (const item of activeTopics) {
    try {
      const res = await trackNewsTopic({
        topic: item.keyword,
        language: item.language,
        selectedSources: [],
        includeEPapers: false,
        context: item.context
      });
      results.push({ ...res, isWatchlistReport: true });
    } catch (e) {
      console.error(`Failed to scan topic: ${item.keyword}`);
    }
  }
  return results;
};
