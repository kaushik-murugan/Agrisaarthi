/**
 * weatherService.ts
 * Fetches current weather and 5-day forecast from OpenWeatherMap API.
 * Falls back to mock data if the API call fails so the app never crashes.
 */

// ── Types ──────────────────────────────────────────────────────────────

/** Current weather response (simplified from OpenWeatherMap) */
export interface WeatherData {
    location: string;
    temperature: number;       // °C
    feelsLike: number;         // °C
    humidity: number;          // %
    windSpeed: number;         // km/h
    description: string;       // e.g. "clear sky"
    icon: string;              // OWM icon code
    rainProbability: number;   // % (derived from clouds / rain)
    pressure: number;          // hPa
    visibility: number;        // metres
}

/** Single day in the 5-day forecast */
export interface ForecastDay {
    date: string;              // ISO date string
    dayName: string;           // e.g. "Mon"
    tempHigh: number;          // °C
    tempLow: number;           // °C
    description: string;
    icon: string;
    rainProbability: number;   // %
}

/** 5-day forecast wrapper */
export interface ForecastData {
    location: string;
    days: ForecastDay[];
}

// ── Constants ──────────────────────────────────────────────────────────

const API_KEY = process.env.EXPO_PUBLIC_WEATHER_API_KEY ?? '';
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

// ── Emoji mapping for weather icons ────────────────────────────────────

/**
 * Maps OpenWeatherMap icon codes to emoji for display.
 */
export const weatherIconToEmoji = (iconCode: string): string => {
    const map: Record<string, string> = {
        '01d': '☀️', '01n': '🌙',
        '02d': '⛅', '02n': '☁️',
        '03d': '☁️', '03n': '☁️',
        '04d': '☁️', '04n': '☁️',
        '09d': '🌧️', '09n': '🌧️',
        '10d': '🌦️', '10n': '🌧️',
        '11d': '⛈️', '11n': '⛈️',
        '13d': '❄️', '13n': '❄️',
        '50d': '🌫️', '50n': '🌫️',
    };
    return map[iconCode] ?? '🌤️';
};

// ── Mock data (fallback when API fails) ────────────────────────────────

const getMockWeatherData = (location: string): WeatherData => ({
    location,
    temperature: 32,
    feelsLike: 34,
    humidity: 65,
    windSpeed: 12,
    description: 'partly cloudy',
    icon: '02d',
    rainProbability: 30,
    pressure: 1013,
    visibility: 10000,
});

const getMockForecastData = (location: string): ForecastData => {
    const days: ForecastDay[] = [];
    const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];

    for (let i = 0; i < 5; i++) {
        const date = new Date();
        date.setDate(date.getDate() + i + 1);
        days.push({
            date: date.toISOString(),
            dayName: dayNames[i],
            tempHigh: 33 + Math.round(Math.random() * 4),
            tempLow: 22 + Math.round(Math.random() * 3),
            description: 'partly cloudy',
            icon: '02d',
            rainProbability: Math.round(Math.random() * 50),
        });
    }

    return { location, days };
};

// ── API functions ──────────────────────────────────────────────────────

/**
 * Fetch current weather for a given location (city name).
 * Returns mock data on any error so the app stays functional.
 */
export const getCurrentWeather = async (
    location: string,
): Promise<WeatherData> => {
    try {
        const url =
            `${BASE_URL}/weather?q=${encodeURIComponent(location)}` +
            `&appid=${API_KEY}&units=metric`;

        const response = await fetch(url);

        if (!response.ok) {
            console.warn(
                `[weatherService] API returned ${response.status} for "${location}". Using mock data.`,
            );
            return getMockWeatherData(location);
        }

        const data = await response.json();

        // Derive rain probability from clouds percentage + any rain data
        const rainProbability = data.rain
            ? Math.min(100, 70 + Math.round(data.rain['1h'] * 10))
            : data.clouds?.all ?? 0;

        return {
            location: data.name ?? location,
            temperature: Math.round(data.main.temp),
            feelsLike: Math.round(data.main.feels_like),
            humidity: data.main.humidity,
            windSpeed: Math.round((data.wind?.speed ?? 0) * 3.6), // m/s → km/h
            description: data.weather?.[0]?.description ?? 'unknown',
            icon: data.weather?.[0]?.icon ?? '01d',
            rainProbability,
            pressure: data.main.pressure,
            visibility: data.visibility ?? 10000,
        };
    } catch (error) {
        console.error('[weatherService] getCurrentWeather failed:', error);
        return getMockWeatherData(location);
    }
};

/**
 * Fetch 5-day / 3-hour forecast and aggregate into daily highs/lows.
 * Returns mock data on any error.
 */
export const getFiveDayForecast = async (
    location: string,
): Promise<ForecastData> => {
    try {
        const url =
            `${BASE_URL}/forecast?q=${encodeURIComponent(location)}` +
            `&appid=${API_KEY}&units=metric`;

        const response = await fetch(url);

        if (!response.ok) {
            console.warn(
                `[weatherService] Forecast API returned ${response.status}. Using mock data.`,
            );
            return getMockForecastData(location);
        }

        const data = await response.json();

        // Group the 3-hour entries by date and aggregate
        const dailyMap: Record<
            string,
            { temps: number[]; icons: string[]; descs: string[]; rain: number[] }
        > = {};

        for (const entry of data.list) {
            const dateKey = entry.dt_txt.split(' ')[0]; // "YYYY-MM-DD"
            if (!dailyMap[dateKey]) {
                dailyMap[dateKey] = { temps: [], icons: [], descs: [], rain: [] };
            }
            dailyMap[dateKey].temps.push(entry.main.temp);
            dailyMap[dateKey].icons.push(entry.weather?.[0]?.icon ?? '01d');
            dailyMap[dateKey].descs.push(entry.weather?.[0]?.description ?? '');
            dailyMap[dateKey].rain.push(entry.pop ? entry.pop * 100 : 0);
        }

        // Convert to ForecastDay[], skip today, take up to 5
        const shortDay = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const todayStr = new Date().toISOString().split('T')[0];

        const days: ForecastDay[] = Object.entries(dailyMap)
            .filter(([dateKey]) => dateKey !== todayStr)
            .slice(0, 5)
            .map(([dateKey, info]) => {
                const d = new Date(dateKey);
                return {
                    date: dateKey,
                    dayName: shortDay[d.getDay()],
                    tempHigh: Math.round(Math.max(...info.temps)),
                    tempLow: Math.round(Math.min(...info.temps)),
                    description: info.descs[Math.floor(info.descs.length / 2)],
                    icon: info.icons[Math.floor(info.icons.length / 2)],
                    rainProbability: Math.round(
                        Math.max(...info.rain),
                    ),
                };
            });

        return {
            location: data.city?.name ?? location,
            days,
        };
    } catch (error) {
        console.error('[weatherService] getFiveDayForecast failed:', error);
        return getMockForecastData(location);
    }
};
