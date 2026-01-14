import { GoogleGenAI, GenerateContentResponse, Type, Modality } from "@google/genai";
import { Persona, Message, ProactiveAdvice } from "./types";

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

export class GeminiService {
  public lastError: string | null = null;
  private recoveryAttempts: number = 0;

  private getAI() {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      throw new Error("CORE_AUTH_FAILURE: API key missing from environment.");
    }
    return new GoogleGenAI({ apiKey });
  }

  private async sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Auto-Healing Call Wrapper
   */
  private async callWithAutoHealing(fn: () => Promise<any>, contextPruner?: () => void, retries = MAX_RETRIES): Promise<any> {
    try {
      this.lastError = null;
      return await fn();
    } catch (error: any) {
      const msg = error?.message || error?.toString() || "";
      
      // Auto-Healing: Context Overflow
      if (msg.includes("too many tokens") || msg.includes("context limit")) {
        console.warn("Auto-Healing: Context overflow. Pruning history...");
        if (contextPruner) {
          contextPruner();
          return this.callWithAutoHealing(fn, contextPruner, retries - 1);
        }
      }

      // Auto-Healing: Key Mismatch
      if (msg.includes("Requested entity was not found")) {
        if (window.aistudio?.openSelectKey) {
          await window.aistudio.openSelectKey();
        }
        throw new Error("Neural link configuration outdated. Please re-select your AI Project.");
      }

      // Retry Logic for transient errors
      if (retries > 0 && (msg.includes("429") || msg.includes("500") || msg.includes("fetch"))) {
        const delay = RETRY_DELAY * (MAX_RETRIES - retries + 1);
        await this.sleep(delay);
        return this.callWithAutoHealing(fn, contextPruner, retries - 1);
      }
      
      this.lastError = msg;
      throw error;
    }
  }

  async generateResponse(persona: Persona, prompt: string, history: Message[] = [], image?: { data: string; mimeType: string }) {
    // Create a local history copy for pruning logic
    let currentHistory = [...history];

    const pruner = () => {
      currentHistory = currentHistory.slice(Math.floor(currentHistory.length / 2));
    };

    return this.callWithAutoHealing(async () => {
      const ai = this.getAI();
      const recentHistory = currentHistory.slice(-10);
      
      const contents = recentHistory.map(h => ({
        role: h.role === 'model' ? 'model' : 'user',
        parts: h.parts.map(p => {
          const part: any = {};
          if (p.text && p.text.trim()) part.text = p.text;
          if (p.inlineData) part.inlineData = p.inlineData;
          return part;
        }).filter(p => p.text || p.inlineData)
      })).filter(c => c.parts.length > 0);

      const currentParts: any[] = [];
      if (prompt && prompt.trim()) currentParts.push({ text: prompt.trim() });
      if (image) {
        currentParts.push({
          inlineData: {
            data: image.data.includes(',') ? image.data.split(',')[1] : image.data,
            mimeType: image.mimeType
          }
        });
      }

      if (currentParts.length === 0) return { text: "No input provided.", tokens: 0 };
      contents.push({ role: 'user', parts: currentParts });

      const response: GenerateContentResponse = await ai.models.generateContent({
        model: persona.model || 'gemini-3-flash-preview',
        contents,
        config: { 
          systemInstruction: persona.systemInstruction, 
          temperature: 0.7
        }
      });

      return {
        text: response.text,
        tokens: response.usageMetadata?.totalTokenCount || 0
      };
    }, pruner).catch(error => {
      return { text: `NEURAL_FAULT: ${this.lastError || "The link was severed by the host."}`, tokens: 0 };
    });
  }

  async generateIdeaSuggestions(persona: Persona): Promise<ProactiveAdvice[]> {
    return this.callWithAutoHealing(async () => {
      const ai = this.getAI();
      const prompt = `Act as a Neural Creative Strategist. Based on "${persona.name}" generate 3 innovative content ideas. JSON array format.`;
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        config: { 
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                content: { type: Type.STRING },
                type: { type: Type.STRING }
              },
              required: ['title', 'content', 'type']
            }
          }
        }
      });
      return JSON.parse(response.text || '[]').map((j: any) => ({ ...j, id: crypto.randomUUID(), timestamp: Date.now() }));
    }).catch(() => []);
  }

  // Helper methods for smart prompt, image gen, etc follow similar callWithAutoHealing patterns...
  async generateSmartPrompt(persona: Persona, history: Message[] = [], currentInput: string = ""): Promise<string> {
    return this.callWithAutoHealing(async () => {
      const ai = this.getAI();
      const response: GenerateContentResponse = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [{ role: 'user', parts: [{ text: `Suggest logical follow-up for: ${currentInput}` }] }],
        config: { temperature: 0.8 }
      });
      return response.text?.trim() || "";
    });
  }

  async generateImage(prompt: string, config: { aspectRatio: string, imageSize: string }) {
    return this.callWithAutoHealing(async () => {
      const isHighRes = config.imageSize === '2K' || config.imageSize === '4K';
      const ai = this.getAI();
      const model = isHighRes ? 'gemini-3-pro-image-preview' : 'gemini-2.5-flash-image';
      const response = await ai.models.generateContent({
        model,
        contents: { parts: [{ text: prompt }] },
        config: { imageConfig: { aspectRatio: config.aspectRatio, imageSize: isHighRes ? config.imageSize : undefined } }
      });
      const part = response.candidates?.[0]?.content?.parts.find(p => p.inlineData);
      if (!part) throw new Error("EMPTY_DATA_BUFFER");
      return { url: `data:${part.inlineData!.mimeType};base64,${part.inlineData!.data}`, tokens: response.usageMetadata?.totalTokenCount || 0 };
    });
  }

  async editImage(base64Image: string, prompt: string, mimeType: string) {
    return this.callWithAutoHealing(async () => {
      const ai = this.getAI();
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: { parts: [{ inlineData: { data: base64Image.split(',')[1], mimeType } }, { text: prompt }] }
      });
      const part = response.candidates?.[0]?.content?.parts.find(p => p.inlineData);
      if (!part) throw new Error("EDIT_STREAM_NULL");
      return { url: `data:${part.inlineData!.mimeType};base64,${part.inlineData!.data}`, tokens: response.usageMetadata?.totalTokenCount || 0 };
    });
  }

  async generateSpeech(text: string, voiceName: string = 'Kore') {
    return this.callWithAutoHealing(async () => {
      const ai = this.getAI();
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ role: 'user', parts: [{ text }] }],
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName } } }
        }
      });
      return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    });
  }

  async translateText(text: string, targetLanguage: string): Promise<string> {
    return this.callWithAutoHealing(async () => {
      const ai = this.getAI();
      const response: GenerateContentResponse = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [{ role: 'user', parts: [{ text: `Translate to ${targetLanguage}: "${text}".` }] }],
      });
      return response.text || "";
    });
  }

  async getQuantumResponse(prompt: string): Promise<{ type: string; text: string; tokens: number }[]> {
    return this.callWithAutoHealing(async () => {
      const ai = this.getAI();
      const response: GenerateContentResponse = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        config: { systemInstruction: "Provide 3 views: [Analytical]:, [Creative]:, and [Concise]:." }
      });
      const text = response.text || "";
      const tokens = response.usageMetadata?.totalTokenCount || 0;
      const parts = text.split(/\[(Analytical|Creative|Concise)\]:/g).filter(p => p.trim());
      const results: { type: string; text: string; tokens: number }[] = [];
      for (let i = 0; i < parts.length; i += 2) {
        if (parts[i] && parts[i+1]) results.push({ type: parts[i], text: parts[i+1].trim(), tokens: i === 0 ? tokens : 0 });
      }
      return results.length === 0 ? [{ type: 'Analytical', text, tokens }] : results;
    });
  }

  async generateCreativePrompt(currentPrompt?: string, selections?: any): Promise<string> {
    return this.callWithAutoHealing(async () => {
      const ai = this.getAI();
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [{ role: 'user', parts: [{ text: `Expert Image Architect. Styles: ${selections?.styles?.join(', ') || 'High-fidelity'}. Target: ${currentPrompt || "Visionary art."}` }] }],
      });
      return response.text || "A cinematic masterpiece.";
    });
  }
}

export const gemini = new GeminiService();