
import { GoogleGenAI, Type } from "@google/genai";
import { MarketInsight, Platform } from "../types";

const API_KEY = process.env.API_KEY || "";

export const fetchImportTrends = async (location?: { lat: number; lng: number }): Promise<{ insight: MarketInsight; sources: any[] }> => {
  const ai = new GoogleGenAI({ apiKey: API_KEY });
  
  const prompt = `Analise em tempo real os produtos mais importados e comprados por angolanos nas plataformas AliExpress, Shein e Alibaba. 
  Considere tendências atuais de 2024 e 2025 e a logística para Angola.

  IMPORTANTE: Para cada produto, você deve pesquisar e estimar o preço de revenda local em Angola (mercados informais como o Trinta ou Kicolo, lojas no Facebook/Instagram e lojas físicas em Luanda). 
  
  Retorne os dados estritamente em formato JSON com a seguinte estrutura:
  {
    "title": "Análise de Importações e Revenda Angola",
    "summary": "Resumo executivo do comportamento do consumidor e oportunidades de lucro na revenda.",
    "trends": [
      {
        "id": "1",
        "name": "Nome do Produto",
        "platform": "AliExpress | Shein | Alibaba",
        "category": "Eletrônicos | Moda | Casa",
        "description": "Por que este produto é popular e qual o seu potencial de revenda?",
        "popularityScore": 0-100,
        "estimatedPriceKz": "Preço de importação em Kwanzas (Kz)",
        "estimatedResalePriceKz": "Preço estimado de revenda em Angola (Kz)",
        "potentialProfitKz": "Lucro bruto estimado por unidade (Kz)",
        "tags": ["Tag1", "Tag2"]
      }
    ]
  }
  Gere pelo menos 8 tendências variadas.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
      },
    });

    const jsonText = response.text || "{}";
    const data = JSON.parse(jsonText) as MarketInsight;
    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

    return { insight: data, sources };
  } catch (error) {
    console.error("Erro ao buscar dados do Gemini:", error);
    throw error;
  }
};
