import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

export const geminiModel = "gemini-3-flash-preview";

export async function getAIResponse(prompt: string, systemInstruction?: string) {
  try {
    const response = await ai.models.generateContent({
      model: geminiModel,
      contents: prompt,
      config: {
        systemInstruction,
      },
    });
    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
}

export async function gradeWriting(text: string, task: string) {
  const prompt = `Grade the following English writing task:
  Task: ${task}
  Student's Writing: ${text}
  
  Provide feedback in Vietnamese. Include:
  1. Overall Score (0-10 or IELTS band).
  2. Detailed feedback on: Task Response, Coherence & Cohesion, Lexical Resource, Grammatical Range & Accuracy.
  3. Suggestions for improvement.
  4. A corrected version of the text.`;

  return getAIResponse(prompt, "You are an expert IELTS/TOEIC examiner. Provide feedback in Vietnamese.");
}

export async function getSpeakingFeedback(transcript: string, topic: string) {
  const prompt = `Provide feedback on this English speaking transcript for the topic: ${topic}
  Transcript: ${transcript}
  
  Provide feedback in Vietnamese. Include:
  1. Fluency & Coherence.
  2. Lexical Resource.
  3. Grammatical Range & Accuracy.
  4. Pronunciation tips (based on the text).
  5. Sample high-band answer.`;

  return getAIResponse(prompt, "You are an expert IELTS/TOEIC speaking coach. Provide feedback in Vietnamese.");
}
