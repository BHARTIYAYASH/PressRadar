import { GoogleGenAI } from "@google/genai";
import { Language, NewsResult, WebSource } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const trackNewsTopic = async (topic: string, language: Language): Promise<NewsResult> => {
  if (!apiKey) {
    throw new Error("API Key missing. Please check your environment configuration.");
  }

  try {
    const prompt = `
      Role: You are a senior News Archivist and Editor for a major newspaper desk.
      Task: Track down the latest coverage for the specific topic: "${topic}".
      
      Directives:
      1. Search specifically for how this topic is being covered in major daily newspapers (both print and e-paper editions) and credible news websites.
      2. If the user asks about a specific e-paper source (like tradingref.com or similar), try to find if there is public news matching that context, but prioritize finding the *actual news content* from primary sources (Times of India, Hindustan Times, The Hindu, Economic Times, global dailies etc.).
      3. Construct a "Daily Briefing" style summary.
      4. Language: Output MUST be in ${language}.
      5. Tone: Formal, journalistic, objective (like a newspaper report).
      6. Date Relevance: Focus on the last 24-48 hours.
      7. Highlight if this topic is "Front Page" worthy material.
      
      Output Format:
      Provide a cohesive news narrative. Do not use bullet points unless listing specific stats. Write it like a column.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        temperature: 0.3,
      },
    });

    const summaryText = response.text || "No report could be filed for this topic at this hour.";

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
      topic,
      summary: summaryText,
      language,
      timestamp: new Date(),
      sources: uniqueSources
    };

  } catch (error: any) {
    console.error("Gemini News Tracking Error:", error);
    throw new Error(error.message || "Failed to retrieve news from the wire.");
  }
};