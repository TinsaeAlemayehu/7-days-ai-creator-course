import { GoogleGenAI } from "@google/genai";

const getApiKey = () => {
  // Try Vite's define replacement first
  const key = process.env.GEMINI_API_KEY;
  if (key && key !== "undefined") return key;
  
  // Fallback to import.meta.env (standard for many Vite deployments like Netlify)
  return import.meta.env.VITE_GEMINI_API_KEY || "";
};

const ai = new GoogleGenAI({ apiKey: getApiKey() });

export const getMentorResponse = async (mentorName: string, personality: string, message: string) => {
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
