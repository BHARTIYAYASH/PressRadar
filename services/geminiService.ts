import { GoogleGenAI } from "@google/genai";
import { Language, NewsResult, WebSource } from "../types";

// API Key environment variable se le rahe hain
const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const trackNewsTopic = async (topic: string, language: Language): Promise<NewsResult> => {
  // Pehle check kar rahe hain ki API Key available hai ya nahi
  if (!apiKey) {
    throw new Error("API Key missing hai. Process.env.API_KEY set karna padega.");
  }

  // Hum gemini-2.5-flash use kar rahe hain taaki search results fast aur grounded milein.
  // googleSearch tool use karne se model real-time news dhoondh pata hai.
  try {
    const prompt = `
      You are a professional news analyst.
      Task: Search for the latest and most relevant news articles regarding the topic: "${topic}".
      
      Requirements:
      1. Analyze the search results.
      2. Write a comprehensive, professional news summary.
      3. The output MUST be written in ${language}.
      4. Focus on factual accuracy and recent events.
      5. Do not include your own opinion, just summarize the found news.
      6. If the topic is financial or political, look for recent market movements or policy changes.
    `;

    // Model ko call kar rahe hain content generate karne ke liye
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        temperature: 0.3, // Thoda kam temperature rakha hai taaki factual reporting mile
      },
    });

    const summaryText = response.text || "Summary generate nahi ho payi.";

    // Grounding chunks extract kar rahe hain taaki sources verify ho sakein.
    // SDK ka structure vary kar sakta hai, isliye safely access kar rahe hain.
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    
    const sources: WebSource[] = [];
    
    // Har chunk se web source nikal kar list mein add kar rahe hain
    groundingChunks.forEach((chunk: any) => {
      if (chunk.web) {
        sources.push({
          uri: chunk.web.uri,
          title: chunk.web.title || new URL(chunk.web.uri).hostname,
        });
      }
    });

    // Duplicate sources ko remove kar rahe hain taaki list clean rahe aur repeated links na dikhein
    const uniqueSources = sources.filter((source, index, self) =>
      index === self.findIndex((t) => (
        t.uri === source.uri
      ))
    );

    // Final result object return kar rahe hain jo frontend pe dikhega
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
    throw new Error(error.message || "News track karne mein kuch issue aa gaya.");
  }
};