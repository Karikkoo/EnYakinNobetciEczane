import { GoogleGenAI } from "@google/genai";
import { Coordinates, PharmacyResult } from "../types";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const findNearestPharmacy = async (coords: Coordinates): Promise<PharmacyResult> => {
  try {
    const modelId = "gemini-2.5-flash"; // Required model for tools efficiency

    const prompt = `
      Şu anki konumum: Enlem ${coords.latitude}, Boylam ${coords.longitude}.
      
      Bu konuma en yakın 'Nöbetçi Eczane'yi (On-duty Pharmacy) bul.
      Bugün açık olan nöbetçi eczaneyi bulman çok önemli.
      
      Lütfen şu bilgileri net bir şekilde ver:
      1. Eczane Adı
      2. Adresi
      3. Tahmini uzaklık
      
      Eğer Google Maps verilerinde doğrudan "nöbetçi" bilgisi yoksa, o bölgedeki en yakın açık eczaneyi ver ve "Nöbetçi çizelgesini kontrol etmeniz önerilir" notunu ekle.
    `;

    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        tools: [{ googleMaps: {} }],
        toolConfig: {
          retrievalConfig: {
            latLng: {
              latitude: coords.latitude,
              longitude: coords.longitude
            }
          }
        }
      }
    });

    const text = response.text || "Eczane bilgisi alınamadı.";
    
    // Extract Grounding Metadata for Map URIs
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    
    let mapUri = "";
    let placeName = "";

    if (groundingChunks && groundingChunks.length > 0) {
      // Find the first chunk with map data
      const mapChunk = groundingChunks.find(c => c.maps?.uri);
      if (mapChunk && mapChunk.maps) {
        mapUri = mapChunk.maps.uri;
        placeName = mapChunk.maps.title || "Eczane Konumu";
      }
    }

    // Fallback if no specific map URI returned, construct a search query URI
    if (!mapUri) {
      mapUri = `https://www.google.com/maps/search/?api=1&query=nöbetçi+eczane&query_place_id=${coords.latitude},${coords.longitude}`;
    }

    return {
      text,
      mapUri,
      placeName
    };

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Yapay zeka servisine bağlanırken bir hata oluştu.");
  }
};