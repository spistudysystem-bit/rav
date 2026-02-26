
import { GoogleGenAI, Type, Modality } from "@google/genai";
import { UserData, LectureContent } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const GG33_CORE_PERSONA = `
You are the Senior Intelligence Handler for the House of Rav. Your identity is a master of GG33 Numerology, Astrology, and the Matrix.

## MISSION DIRECTIVE
- YOU ARE AN EXHAUSTIVE NARRATOR.
- DO NOT summarize. DO NOT provide brief overviews. 
- EVERY RESPONSE must be a full-length investigative dossier (minimum 400 to 600 words).
- Provide deep context, historical resonance, and tactical psychological mapping.
- If a subject has a specific vibration, explain the light, the shadow, and the structural implications in the physical plane in great detail.
- Treat every query as a high-clearance intelligence request that requires a complete strategic breakdown.

## SYMBOL FIREWALL (CRITICAL)
- NEVER use the symbols '#', '$', '%', or '*'.
- Use words instead: 
  - Instead of '%', write 'percent'.
  - Instead of '#', write 'Number' or 'Sequence'.
  - Instead of '$', write 'Capital', 'Currency', or 'Wealth Assets'.
  - Instead of '*', write 'Operational Note' or 'Directive'.
- Failure to adhere to this firewall compromises the uplink.

## METAPHYSICAL FRAMEWORK
- 28 is the ultimate wealth, authority, and leadership frequency.
- Master Numbers (11, 22, 33) represent high-frequency energy that must be channeled into specific structural goals.
- Use a tone that is confident, authoritative, and tactically precise (Kaxig).
`;

/**
 * Generates audio narration for a given text using Gemini TTS.
 */
export async function generateSpeech(text: string): Promise<string> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: `Read the following intelligence report with authority and precision: ${text}` }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Charon' },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!base64Audio) throw new Error("No audio data returned");
    return base64Audio;
  } catch (error) {
    console.error("Narration synthesis failed:", error);
    throw error;
  }
}

/**
 * Generates an exhaustive narrative dossier on the subject's numerical signature.
 */
export async function getNumerologyReading(type: string, userData: UserData, lpValue: number, zodiac: string) {
  const prompt = `
    INITIATE FULL INVESTIGATIVE DOSSIER: ${type}
    Subject: ${userData.name}
    Life Path: ${lpValue}
    Zodiac: ${zodiac}
    
    Narrate a comprehensive deep-dive. Explain the intersection of the Life Path and Zodiac. 
    Analyze the subject's current vibrational alignment with the 2025 focus year.
    Detail the tactical advantages, psychological shadow-work requirements, and the specific path to wealth-manifestation.
    I require at least 5 paragraphs of high-density strategic intelligence.
    STRICT CONSTRAINT: No symbols like #, $, %, or * are permitted. Use words only.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: { 
        systemInstruction: GG33_CORE_PERSONA,
        temperature: 0.8
      }
    });
    return { text: response.text || "Directives currently scrambled. Maintain manual protocols." };
  } catch (error) {
    return { text: "The temporal link is unstable. Recalibrating systems." };
  }
}

/**
 * Generates tactical recommendations with exhaustive narrative context for each.
 */
export async function getTacticalRecommendations(
  userData: UserData, 
  lpValue: number, 
  vibrationalAxes: any[], 
  history: any[]
): Promise<{ category: string; message: string; priority: 'High' | 'Medium' | 'Low' }[]> {
  const prompt = `
    GENERATE TACTICAL FIELD DIRECTIVES
    Subject: ${userData.name}
    Life Path: ${lpValue}
    
    Provide 4 highly detailed tactical recommendations. 
    Each directive must be a full, exhaustive paragraph of narrative guidance (approx 100 words per recommendation).
    Contextualize the advice within the subject's vibrational profile.
    STRICT CONSTRAINT: Do not use #, $, %, or *.
    Return as a JSON array.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        systemInstruction: GG33_CORE_PERSONA,
        temperature: 0.75,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              category: { type: Type.STRING },
              message: { type: Type.STRING },
              priority: { type: Type.STRING, enum: ['High', 'Medium', 'Low'] }
            },
            required: ["category", "message", "priority"]
          }
        }
      }
    });

    return JSON.parse(response.text || '[]');
  } catch (error) {
    return [{ category: 'System', message: 'Uplink unstable. Maintain core discipline and monitor signal strength.', priority: 'High' }];
  }
}

/**
 * Generates a full narrative Daily Briefing.
 */
export async function getDailyBriefing(userData: UserData, lpValue: number): Promise<string> {
  const today = new Date().toLocaleDateString();
  const prompt = `
    EXHAUSTIVE MORNING INTELLIGENCE BRIEFING
    Subject: ${userData.name}
    Life Path: ${lpValue}
    Temporal Coordinate: ${today}
    
    Provide an exhaustive briefing on the day's atmospheric conditions. 
    Narrate the strategic flow of the next 24 hours. 
    Identify specific windows of opportunity and high-risk temporal zones.
    Write in a long-form narrative prose style. No bullet points without deep explanation.
    STRICT CONSTRAINT: Do not use #, $, %, or *.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: { 
        systemInstruction: GG33_CORE_PERSONA,
        temperature: 0.8 
      }
    });
    return response.text || "Morning briefing transmission failed. Trust your intuition.";
  } catch (error) {
    return "Communication jammed. Secure the perimeter and await manual updates.";
  }
}

/**
 * Long-form chat with the Handler.
 */
export async function chatWithHandler(history: { role: 'user' | 'handler', content: string }[], input: string): Promise<string> {
  const chatHistory = history.map(h => ({
    role: h.role === 'handler' ? 'model' : 'user',
    parts: [{ text: h.content }]
  }));

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: [
        ...chatHistory,
        { role: 'user', parts: [{ text: input }] }
      ],
      config: {
        systemInstruction: GG33_CORE_PERSONA + "\nNARRATE EVERY RESPONSE FULLY. AVOID SHORT ANSWERS. NEVER USE SYMBOLS like #, $, %, or *.",
        temperature: 0.8,
      }
    });
    return response.text || "Transmission error. Frequency compromised.";
  } catch (error) {
    return "Communication jammed. Repeat query at a higher frequency later.";
  }
}

/**
 * Deep-dive intelligence report on Universal Laws.
 */
export async function getUniversalLawLecture(lawName: string, category: string, summary: string): Promise<LectureContent> {
  const prompt = `
    EXHAUSTIVE PROTOCOL LECTURE: ${lawName}
    Category: ${category}
    Context: ${summary}
    
    Narrate a complete deep-dive into this universal law. 
    Provide real-world tactical applications, historical context, and psychological integration strategies.
    Every field in the JSON must be a full narrative explanation.
    STRICT CONSTRAINT: Do not use #, $, %, or *.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        systemInstruction: GG33_CORE_PERSONA,
        temperature: 0.8,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            effortQuantification: { type: Type.STRING },
            cliffnotes: { type: Type.STRING },
            roadmap: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  step: { type: Type.INTEGER },
                  title: { type: Type.STRING },
                  detail: { type: Type.STRING }
                }
              }
            },
            contrastAnalogy: { type: Type.STRING },
            mnemonic: { type: Type.STRING },
            popCultureAnalogy: { type: Type.STRING },
            practicalWorkflow: { type: Type.STRING },
            psychologicalInsight: { type: Type.STRING },
            assessment: { type: Type.ARRAY, items: { type: Type.STRING } },
            holyShitInsight: { type: Type.STRING }
          }
        }
      }
    });

    return JSON.parse(response.text || '{}');
  } catch (error) {
    throw error;
  }
}
