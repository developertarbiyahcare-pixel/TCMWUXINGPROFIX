
// Fix: Update model to gemini-3-flash-preview for better image analysis and compliance with latest guidelines.

import { GoogleGenAI } from "@google/genai";
import { ApiKeyEntry } from '../types';

export async function analyzeTongueImage(
  base64Image: string, 
  apiKeys?: ApiKeyEntry[],
  onKeyExhausted?: (key: string) => void
): Promise<{ text: string }> {
  const availableKeys = (apiKeys || []).filter(k => !k.isExhausted && k.key.trim() !== "");
  
  if (availableKeys.length === 0) {
    const envKey = process.env.GEMINI_API_KEY;
    if (envKey) {
      availableKeys.push({ key: envKey, isExhausted: false });
    }
  }

  if (availableKeys.length === 0) {
    const hasKeys = (apiKeys || []).length > 0;
    if (hasKeys) {
      throw new Error("Semua API Key Gemini Anda telah mencapai batas kuota (Exhausted). Silakan reset status kunci di menu Settings atau tambahkan kunci baru.");
    } else {
      throw new Error("Tidak ada API Key Gemini yang ditemukan. Silakan tambahkan API Key di menu Settings untuk memulai analisis lidah.");
    }
  }

  const [mimeTypePrefix, base64Data] = base64Image.split(';base64,');
  const mimeType = mimeTypePrefix ? mimeTypePrefix.split(':')[1] : "image/jpeg";

  const prompt = `
  Kamu adalah ahli diagnosis lidah TCM (Traditional Chinese Medicine) tingkat profesor.
  Analisis foto lidah ini dengan sangat detail dan akurat.
  Jawab dalam Bahasa Indonesia, format:

  1. Warna badan lidah: ...
  2. Warna lapisan/sabur: ...
  3. Kualitas sabur: ...
  4. Fitur khusus: (crack, teeth marks, red points, deviated, swollen, thin, dll)
  5. Kesimpulan pola utama: (contoh: Kidney Yin Deficiency with Empty Heat, Spleen Qi Deficiency with Dampness, Liver Fire, dll)
  6. Rekomendasi titik akupuntur tambahan (3-5 titik): ...

  Hanya jawab berdasarkan foto lidah ini, jangan tambah-tambah.
  `;

  let lastError: any = null;
  const maxRetries = Math.min(availableKeys.length, 3);

  for (let i = 0; i < maxRetries; i++) {
    const apiKey = availableKeys[i].key;
    try {
      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: {
          parts: [
            { text: prompt },
            {
              inlineData: {
                mimeType: mimeType,
                data: base64Data
              }
            }
          ]
        },
        config: {
          maxOutputTokens: 1024,
          temperature: 0.1,
        }
      });

      return {
        text: response.text || "Maaf, tidak dapat menganalisis gambar ini."
      };
    } catch (error: any) {
      console.error(`Tongue Analysis Error with key ${apiKey.substring(0, 8)}...:`, error);
      lastError = error;
      const errMsg = error.message?.toLowerCase() || "";
      if (errMsg.includes("429") || errMsg.includes("quota") || errMsg.includes("403") || errMsg.includes("limit")) {
        if (onKeyExhausted) onKeyExhausted(apiKey);
        continue;
      } else {
        throw error;
      }
    }
  }

  throw lastError || new Error("Gagal melakukan analisis lidah.");
}
