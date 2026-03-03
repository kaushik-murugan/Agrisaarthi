/**
 * aiService.ts
 * Integrates with Groq API (LLaMA 3) to provide
 * context-aware farming advice based on the farmer's profile
 * and current weather conditions.
 */

export const getAIAdvice = async (
    question: string,
    farmerProfile: any,
    weatherData: any
): Promise<string> => {
    try {
        const apiKey = process.env.EXPO_PUBLIC_GROQ_API_KEY;

        // Debug logs
        console.log('=== AI Service Debug ===');
        console.log('Groq API Key exists:', !!apiKey);
        console.log('API Key length:', apiKey?.length);
        console.log('Question:', question);

        if (!apiKey) {
            return 'ERROR: API key not found in environment';
        }

        const systemPrompt = `You are Agrisaarthi, an expert farming assistant for Indian farmers. You already know everything about this farmer - never ask for information you already have.

FARMER PROFILE (use this context for every response):
- Name: ${farmerProfile.name}
- Location: ${farmerProfile.location}
- Primary Crop: ${farmerProfile.crop}
- Soil Type: ${farmerProfile.soilType}
- Farm Size: ${farmerProfile.farmSize} acres
- Irrigation Type: ${farmerProfile.irrigationType}

CURRENT WEATHER IN ${farmerProfile.location}:
- Temperature: ${weatherData?.temp}°C
- Humidity: ${weatherData?.humidity}%
- Rainfall Chance: ${weatherData?.rainfall}%
- Condition: ${weatherData?.condition}

INSTRUCTIONS:
- Never ask the farmer for information you already have
- Always give specific advice based on their crop and weather
- You MUST respond ONLY in ${farmerProfile.language} language. This is critical. If language is Tamil, respond entirely in Tamil script. If Hindi, use Devanagari script. If Telugu, use Telugu script. If English, respond in English.
- Keep responses under 150 words
- Start with a relevant farming emoji
- Be direct and actionable`;

        console.log('Making Groq API call...');

        const response = await fetch(
            'https://api.groq.com/openai/v1/chat/completions',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`,
                },
                body: JSON.stringify({
                    model: 'llama-3.3-70b-versatile',
                    messages: [
                        { role: 'system', content: systemPrompt },
                        { role: 'user', content: question }
                    ],
                    max_tokens: 300,
                    temperature: 0.7,
                })
            }
        );

        console.log('Groq Response status:', response.status);
        const data = await response.json();
        console.log('Groq Response:', JSON.stringify(data));

        if (!response.ok) {
            return `API Error ${response.status}: ${data.error?.message}`;
        }

        return data.choices[0].message.content;

    } catch (error: any) {
        console.log('Catch error:', error.message);
        console.log('Error type:', error.constructor.name);
        return `Debug Error: ${error.message}`;
    }
};
