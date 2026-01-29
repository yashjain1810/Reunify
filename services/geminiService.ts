
import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY;

export async function reunifyPhotos(
  childImageData: { base64: string; mimeType: string },
  adultImageData: { base64: string; mimeType: string }
): Promise<string> {
  if (!API_KEY) {
    throw new Error("API key is missing.");
  }

  const ai = new GoogleGenAI({ apiKey: API_KEY });
  
  // We use gemini-2.5-flash-image for high-quality image editing and generation
  const model = "gemini-2.5-flash-image";

  const prompt = `
    I am providing two reference images of the same person.
    Image 1: A photo of the person as a child.
    Image 2: A photo of the person as an adult.
    
    TASK: Generate a single high-quality, photorealistic image where the adult version of the person is warmly hugging the childhood version of themselves.
    
    REQUIREMENTS:
    - The interaction must look natural and emotionally resonant.
    - Match the lighting, skin tones, and facial features from the provided reference photos to ensure it looks like the same person at two different ages.
    - Replace the original backgrounds with a smooth, soft, minimalist white background.
    - Use natural, soft studio lighting to create a gentle and heartfelt mood.
    - The output should focus on the hug and the connection between the two versions of the person.
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: {
        parts: [
          {
            inlineData: {
              data: childImageData.base64,
              mimeType: childImageData.mimeType,
            },
          },
          {
            inlineData: {
              data: adultImageData.base64,
              mimeType: adultImageData.mimeType,
            },
          },
          { text: prompt },
        ],
      },
      config: {
        imageConfig: {
          aspectRatio: "1:1",
        }
      }
    });

    const candidate = response.candidates?.[0];
    if (!candidate) throw new Error("No response generated.");

    for (const part of candidate.content.parts) {
      if (part.inlineData) {
        return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      }
    }

    throw new Error("No image data found in the response.");
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    throw new Error(error.message || "Failed to generate image.");
  }
}
