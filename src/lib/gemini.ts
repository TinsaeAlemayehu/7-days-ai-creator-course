import { GoogleGenAI } from "@google/genai";

const getApiKey = () => {
  // Try import.meta.env first (standard for Vite)
  const metaKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (metaKey && metaKey !== "undefined") return metaKey;

  // Fallback to process.env if defined
  try {
    // @ts-ignore
    if (typeof process !== 'undefined' && process.env.GEMINI_API_KEY) {
      // @ts-ignore
      return process.env.GEMINI_API_KEY;
    }
  } catch (e) {}
  
  return "";
};

const apiKey = getApiKey();
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export const getMentorResponse = async (mentorName: string, personality: string, message: string) => {
  if (!ai) {
    return "I'm currently thinking offline, but you're doing a great job! 🚀";
  }

  const model = "gemini-3-flash-preview";
  const systemInstruction = `You are ${mentorName}, an AI mentor for kids aged 8-16. 
  Your personality is: ${personality}. 
  Keep your responses short, funny, very encouraging, and full of emojis. 
  Never use complex jargon. If you must use a technical term, explain it with a fun analogy.
  The goal is to make the child feel like a genius.`;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: message,
      config: { systemInstruction }
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Oops! My circuits got a little tangled. You're doing great though! 🚀";
  }
};
