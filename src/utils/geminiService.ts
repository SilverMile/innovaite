import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY as string;

if (!API_KEY) {
  console.error('VITE_GEMINI_API_KEY not found in environment variables');
}

const genAI = new GoogleGenerativeAI(API_KEY);

export interface WasteItem {
  name: string;
  category: 'recyclable' | 'organic' | 'hazardous' | 'landfill';
  instruction: string;
}

export const identifyWaste = async (imageBase64: string): Promise<WasteItem[]> => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `Analyze this image and identify all waste items visible. 
    For each item, provide:
    1. Item name
    2. Bin category: recyclable, organic, hazardous, or landfill
    3. Brief disposal instruction for Dubai, UAE
    
    Format response as valid JSON array only:
    [
      {
        "name": "Plastic Bottle",
        "category": "recyclable",
        "instruction": "Remove cap and rinse before recycling"
      }
    ]
    
    Return ONLY the JSON array, no other text.`;

    const imagePart = {
      inlineData: {
        data: imageBase64.split(',')[1] || imageBase64,
        mimeType: 'image/jpeg',
      },
    };

    const result = await model.generateContent([prompt, imagePart]);
    const response = await result.response;
    const text = response.text();
    
    console.log('AI Response:', text);
    
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      const items = JSON.parse(jsonMatch[0]);
      return items;
    }
    
    throw new Error('Could not parse AI response');
  } catch (error) {
    console.error('Error identifying waste:', error);
    throw error;
  }
};
