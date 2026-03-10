import { GoogleGenAI } from "@google/genai";

export const MODELS = {
  TEXT: "gemini-3-flash-preview",
  IMAGE: "gemini-3.1-flash-image-preview",
  TTS: "gemini-2.5-flash-preview-tts"
};

/**
 * Creates a new GoogleGenAI instance using the provided or stored API key.
 */
export const getAI = (apiKey?: string) => {
  const finalKey = apiKey || localStorage.getItem('gemini_api_key') || "";
  return new GoogleGenAI({ apiKey: finalKey });
};

export const ai = getAI();
