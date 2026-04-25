import { GoogleGenAI, Type } from "@google/genai";
import { Language, ScoredSyndrome, ApiKeyEntry } from '../types';

const getSystemInstruction = (language: Language, cdssAnalysis?: ScoredSyndrome[]) => {
  const topSyndrome = cdssAnalysis && cdssAnalysis.length > 0 ? cdssAnalysis[0].syndrome : null;
  const tpContext = topSyndrome?.treatment_principle?.length ? `\nPRINSIP TERAPI DARI CDSS: ${topSyndrome.treatment_principle.join(', ')}` : '';
  const herbContext = topSyndrome?.herbal_prescription ? `\nRESEP KLASIK DARI CDSS: ${topSyndrome.herbal_prescription}` : '';

  return `Anda adalah Pakar Senior TCM (Giovanni Maciocia). 
Tugas: Diagnosis instan dalam JSON.
WAJIB: 10-12 titik akupunktur + Master Tung jika relevan.
ANALISIS: Pisahkan BEN (Akar) dan BIAO (Cabang).
SKOR: Sertakan "score" (0-100) untuk setiap item diferensiasi.${tpContext}${herbContext}
Gunakan PRINSIP TERAPI dan RESEP KLASIK dari CDSS jika tersedia.
Lakukan diferensiasi 8 Prinsip dan Organ Zang-Fu.
OBESITAS: Berikan analisis jika ada indikasi.
KECANTIKAN: Berikan saran jika relevan.

Bahasa: ${language}.
HANYA kembalikan JSON. Jangan ada teks lain sebelum atau sesudah JSON.`;
};

export const sendMessageToGeminiStream = async (
  message: string,
  image: string | undefined,
  history: any[],
  language: Language,
  isPregnant: boolean,
  cdssAnalysis?: ScoredSyndrome[],
  apiKeys?: ApiKeyEntry[],
  onChunk?: (text: string) => void,
  onKeyExhausted?: (key: string) => void
) => {
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
      throw new Error("Semua API Key Gemini Anda telah mencapai batas kuota (Exhausted). Silakan reset status kunci di menu Settings.");
    } else {
      throw new Error("Tidak ada API Key Gemini yang ditemukan. Silakan tambahkan API Key di menu Settings.");
    }
  }

  let lastError: any = null;
  const maxRetries = Math.min(availableKeys.length, 3);

  for (let i = 0; i < maxRetries; i++) {
    const currentKeyEntry = availableKeys[i];
    const apiKey = currentKeyEntry.key;

    try {
      const ai = new GoogleGenAI({ apiKey });
      
      const parts: any[] = [{ text: message }];
      if (image) {
        const mimeType = image.split(';')[0].split(':')[1];
        const base64Data = image.split(',')[1];
        parts.push({
          inlineData: {
            mimeType,
            data: base64Data
          }
        });
      }

      // Prepare history (last 6 messages, excluding errors)
      const historyParts = history
        .filter(msg => (msg.role === 'user' || msg.role === 'model') && !msg.isError)
        .slice(-6)
        .map(msg => ({
          role: msg.role === 'user' ? 'user' : 'model',
          parts: [{ text: msg.text.substring(0, 1000) }] // Truncate long history messages
        }));

      const contents = [
        ...historyParts,
        { role: 'user', parts }
      ];

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: contents,
        config: {
          systemInstruction: getSystemInstruction(language, cdssAnalysis),
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              conversationalResponse: { type: Type.STRING },
              diagnosis: {
                type: Type.OBJECT,
                properties: {
                  patternId: { type: Type.STRING },
                  explanation: { type: Type.STRING },
                  differentiation: {
                    type: Type.OBJECT,
                    properties: {
                      ben: { 
                        type: Type.ARRAY, 
                        items: { 
                          type: Type.OBJECT,
                          properties: {
                            label: { type: Type.STRING },
                            value: { type: Type.STRING },
                            score: { type: Type.NUMBER }
                          }
                        }
                      },
                      biao: { 
                        type: Type.ARRAY, 
                        items: { 
                          type: Type.OBJECT,
                          properties: {
                            label: { type: Type.STRING },
                            value: { type: Type.STRING },
                            score: { type: Type.NUMBER }
                          }
                        }
                      }
                    }
                  },
                  treatment_principle: { type: Type.ARRAY, items: { type: Type.STRING } },
                  classical_prescription: { type: Type.STRING },
                  recommendedPoints: { 
                    type: Type.ARRAY, 
                    items: { 
                      type: Type.OBJECT,
                      properties: {
                        code: { type: Type.STRING },
                        description: { type: Type.STRING }
                      }
                    }
                  },
                  masterTungPoints: { 
                    type: Type.ARRAY, 
                    items: { 
                      type: Type.OBJECT,
                      properties: {
                        code: { type: Type.STRING },
                        description: { type: Type.STRING }
                      }
                    }
                  },
                  wuxingElement: { type: Type.STRING },
                  wuxingRelationships: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        type: { type: Type.STRING },
                        targetElement: { type: Type.STRING },
                        description: { type: Type.STRING }
                      }
                    }
                  },
                  lifestyleAdvice: { type: Type.STRING },
                  herbal_recommendation: { 
                    type: Type.OBJECT,
                    properties: {
                      formula_name: { type: Type.STRING },
                      chief: { type: Type.ARRAY, items: { type: Type.STRING } }
                    }
                  },
                  obesity_indication: { type: Type.STRING },
                  beauty_acupuncture: { type: Type.STRING },
                  keySymptoms: { type: Type.ARRAY, items: { type: Type.STRING } },
                  tongueDescription: { type: Type.STRING },
                  pulseDescription: { type: Type.STRING }
                }
              }
            }
          },
          temperature: 0.1,
          maxOutputTokens: 8192,
        }
      });
      let rawText: string | undefined = "";
      try {
        rawText = response.text;
      } catch (e) {
        console.error("Error getting response text:", e);
        const candidate = response.candidates?.[0];
        if (candidate?.finishReason === 'SAFETY') {
          throw new Error("Konten diblokir oleh filter keamanan AI. Silakan coba kata-kata lain.");
        }
        if (candidate?.finishReason === 'MAX_TOKENS') {
          // If max tokens hit, try to extract whatever we have
          const parts = candidate.content?.parts;
          if (parts && parts.length > 0) {
            rawText = parts.map(p => p.text).join("");
          } else {
            throw new Error("Respon terlalu panjang dan terpotong. Silakan coba pertanyaan yang lebih spesifik.");
          }
        } else {
          throw new Error("Gagal mengambil respon dari AI.");
        }
      }

      if (!rawText) {
        throw new Error("Gagal mengambil respon dari AI (Respon kosong).");
      }

      let cleanText = rawText.trim();
      
      // Handle potential markdown code blocks
      if (cleanText.startsWith('```json')) {
        cleanText = cleanText.replace(/^```json\n?/, '').replace(/\n?```$/, '').trim();
      } else if (cleanText.startsWith('```')) {
        cleanText = cleanText.replace(/^```\n?/, '').replace(/\n?```$/, '').trim();
      }

      if (onChunk) onChunk(cleanText);
      
      try {
        const parsed = JSON.parse(cleanText);
        return { data: parsed };
      } catch (parseError) {
        console.error("JSON Parse Error. Raw:", cleanText);
        
        // Attempt to find JSON object with regex if parsing failed
        const jsonMatch = cleanText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          try {
            const secondAttempt = JSON.parse(jsonMatch[0]);
            return { data: secondAttempt };
          } catch (e) {
            console.error("Second parse attempt failed");
          }
        }
        
        throw new Error("Gagal memproses format data dari AI. Silakan coba lagi.");
      }
    } catch (error: any) {
      console.error(`Gemini Error with key ${apiKey.substring(0, 8)}...:`, error);
      lastError = error;

      const errMsg = error.message?.toLowerCase() || "";
      if (errMsg.includes("429") || errMsg.includes("quota") || errMsg.includes("limit") || errMsg.includes("403")) {
        if (onKeyExhausted) onKeyExhausted(apiKey);
        continue; 
      } else if (errMsg.includes("api key not found") || errMsg.includes("invalid api key")) {
        throw new Error(`API Key tidak valid: ${apiKey.substring(0, 8)}...`);
      } else {
        throw error; 
      }
    }
  }

  throw lastError || new Error("Semua API Key gagal digunakan.");
};
