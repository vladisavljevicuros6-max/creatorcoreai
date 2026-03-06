import { GoogleGenAI, Type } from "@google/genai";
import { v4 as uuidv4 } from "uuid";
import { Idea, GenerationRequest } from "../types";

export function getGemini(): GoogleGenAI {
  const key = process.env.GEMINI_API_KEY;
  if (!key) {
    throw new Error("GEMINI_API_KEY environment variable is required");
  }
  return new GoogleGenAI({ apiKey: key });
}

export async function generateIdeas(req: GenerationRequest): Promise<Idea[]> {
  const ai = getGemini();
  
  const prompt = `Generate exactly 3 highly detailed, creative, and unique content ideas for a ${req.platform} creator.
Channel: "${req.channel}"
Description/Niche: "${req.description}"
Style/Template: "${req.template}"

For each idea, provide:
- A compelling, click-worthy title (optimized for ${req.platform})
- A strong hook (first 5 seconds) that grabs attention
- A thorough explanation of why this idea will resonate with the audience (psychology, trends, pain points)
- Step-by-step production tips: filming techniques, editing style, audio, pacing, any props or B-roll needed
- A detailed thumbnail concept: visual elements, text overlay, colors, composition
- SEO Title (optimized for search)
- SEO Description (optimized for search)
- 5 relevant, high-search-volume hashtags
- A virality score from 1 to 100

Make every idea distinct, practical, and tailored to the niche. Avoid generic advice.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.1-pro-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              hook: { type: Type.STRING },
              explanation: { type: Type.STRING },
              productionTips: { type: Type.STRING },
              thumbnailSuggestion: { type: Type.STRING },
              seoTitle: { type: Type.STRING },
              seoDescription: { type: Type.STRING },
              hashtags: { type: Type.ARRAY, items: { type: Type.STRING } },
              viralityScore: { type: Type.INTEGER },
            },
            required: ["title", "hook", "explanation", "productionTips", "thumbnailSuggestion", "seoTitle", "seoDescription", "hashtags", "viralityScore"],
          },
        },
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response from Gemini");
    
    const parsed = JSON.parse(text);
    return parsed.map((idea: any) => ({
      ...idea,
      id: uuidv4(),
      platform: req.platform,
    }));
  } catch (error: any) {
    console.error("Error generating ideas:", error);
    throw new Error(`Failed to generate ideas: ${error.message}`);
  }
}

export async function generateScript(idea: Idea): Promise<string> {
  const ai = getGemini();
  const prompt = `Write a comprehensive, highly detailed, and long-form video script (at least 5-10 minutes of speaking time) for the following content idea on ${idea.platform}:
Title: ${idea.title}
Hook: ${idea.hook}
Production Tips: ${idea.productionTips}

Include:
- Detailed visual cues and camera directions (e.g., [Camera zooms in slowly], [B-roll of X playing for 5 seconds])
- Word-for-word spoken dialogue that is engaging, well-paced, and informative
- Timestamps for each section
- A strong call to action at the end
Make it sound natural, authoritative, and perfectly tailored to the platform's pacing. Do not write a short summary; write the FULL script.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.1-pro-preview",
      contents: prompt,
    });

    if (!response.text) {
      throw new Error("Empty response from script generator");
    }

    return response.text;
  } catch (error: any) {
    console.error("Error generating script:", error);
    throw new Error(`Failed to generate script: ${error.message}`);
  }
}
