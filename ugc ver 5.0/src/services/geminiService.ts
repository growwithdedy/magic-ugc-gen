import { GoogleGenAI } from "@google/genai";

export const MODELS = {
  TEXT: "gemini-3-flash-preview",
  IMAGE: "gemini-3.1-flash-image-preview",
  TTS: "gemini-2.5-flash-preview-tts"
};

/**
 * Creates a new GoogleGenAI instance using the current API key.
 * For gemini-3.1-flash-image-preview, it's important to create a new instance 
 * right before the call to ensure it uses the key selected in the dialog.
 */
export const getAI = () => {
  const customKey = localStorage.getItem('GEMINI_CUSTOM_API_KEY');
  const apiKey = customKey || process.env.GEMINI_API_KEY || "";
  return new GoogleGenAI({ apiKey });
};

// Keep the static instance for non-image tasks if needed, 
// but getAI() is safer for image generation.
export const ai = getAI();
