/**
 * cropIntelligence.ts
 * Smart farming engine with crop-specific agronomic conditions.
 *
 * Uses scientifically accurate temperature, humidity, and rainfall
 * thresholds per crop type instead of generic weather rules.
 *
 * Alert titles and descriptions are translation keys so they
 * can be translated at render-time via t().
 */

import type { WeatherData } from '../services/weatherService';

// ── Types ──────────────────────────────────────────────────────────────

/** Severity levels for farming alerts */
export type AlertSeverity = 'danger' | 'warning' | 'good';

/** A single actionable farming alert */
export interface FarmingAlert {
    id: string;
    type: string;
    /** Translation key for the alert title */
    title: string;
    /** Translation key for the alert description */
    description: string;
    /** Optional params for description placeholder substitution */
    descriptionParams?: Record<string, string | number>;
    severity: AlertSeverity;
    emoji: string;
}

/** Agronomic conditions for a specific crop */
interface CropCondition {
    minTemp: number;       // °C — minimum tolerable temperature
    maxTemp: number;       // °C — maximum tolerable temperature
    optTemp: number;       // °C — optimal growth temperature
    minHumidity: number;   // % — minimum ideal humidity
    maxHumidity: number;   // % — maximum ideal humidity
    minRainfall: number;   // % — minimum rain probability needed
    maxWindStress: number; // km/h — max wind before stress
}

// ── Crop-specific conditions table (real agricultural science) ──────

const cropConditions: Record<string, CropCondition> = {
    Wheat: {
        minTemp: 15, maxTemp: 20, optTemp: 18,
        minHumidity: 50, maxHumidity: 70,
        minRainfall: 20, maxWindStress: 35
    },
    Rice: {
        minTemp: 22, maxTemp: 32, optTemp: 27,
        minHumidity: 80, maxHumidity: 95,
        minRainfall: 40, maxWindStress: 30
    },
    Cotton: {
        minTemp: 20, maxTemp: 35, optTemp: 28,
        minHumidity: 50, maxHumidity: 75,
        minRainfall: 10, maxWindStress: 40
    },
    Sugarcane: {
        minTemp: 24, maxTemp: 33, optTemp: 28,
        minHumidity: 70, maxHumidity: 90,
        minRainfall: 20, maxWindStress: 40
    },
    Tomato: {
        minTemp: 21, maxTemp: 27, optTemp: 24,
        minHumidity: 60, maxHumidity: 80,
        minRainfall: 15, maxWindStress: 35
    },
    Onion: {
        minTemp: 13, maxTemp: 24, optTemp: 20,
        minHumidity: 50, maxHumidity: 70,
        minRainfall: 10, maxWindStress: 35
    },
    Other: {
        minTemp: 20, maxTemp: 32, optTemp: 26,
        minHumidity: 55, maxHumidity: 80,
        minRainfall: 15, maxWindStress: 40
    },
};

/** Look up conditions for a crop type, default to 'Other' */
const getConditions = (cropType: string): CropCondition =>
    cropConditions[cropType] ?? cropConditions['Other'];

// ── Crop-specific tip keys ─────────────────────────────────────────

/** Map of crop → { condition → translation key } for specific advice */
const cropSpecificTips: Record<string, { key: string; id: string; emoji: string }[]> = {
    Wheat: [
        { key: 'descWheatHighTemp', id: 'wheat_high_temp', emoji: '🌾' },
    ],
    Rice: [
        { key: 'descRiceLowHumidity', id: 'rice_low_humidity', emoji: '🌾' },
    ],
    Tomato: [
        { key: 'descTomatoHighTemp', id: 'tomato_high_temp', emoji: '🍅' },
    ],
    Cotton: [
        { key: 'descCottonHighHumidity', id: 'cotton_high_humidity', emoji: '🌿' },
    ],
    Onion: [
        { key: 'descOnionColdTemp', id: 'onion_cold_temp', emoji: '🧅' },
    ],
};

// ── Alert generation ───────────────────────────────────────────────────

/**
 * Analyse current weather conditions using crop-specific agronomic
 * thresholds and return a list of farming alerts.
 *
 * @param weatherData - Current weather snapshot
 * @param cropType    - Farmer's primary crop
 * @returns Array of FarmingAlert objects
 */
export const generateFarmingAlerts = (
    weatherData: WeatherData,
    cropType: string,
): FarmingAlert[] => {
    const alerts: FarmingAlert[] = [];
    const cond = getConditions(cropType);
    const temp = weatherData.temperature;

    // ── Temperature rules (crop-specific) ──────────────────────────

    if (temp > cond.maxTemp + 10) {
        // Extreme heat — well beyond crop's tolerance
        alerts.push({
            id: 'heat_stress',
            type: 'temperature',
            title: 'alertHeatStress',
            description: 'descHeatStress',
            descriptionParams: { crop: cropType, maxTemp: cond.maxTemp },
            severity: 'danger',
            emoji: '🔥',
        });
    } else if (temp < cond.minTemp - 5) {
        // Extreme cold — well below crop's tolerance
        alerts.push({
            id: 'cold_stress',
            type: 'temperature',
            title: 'alertColdStress',
            description: 'descColdStress',
            descriptionParams: { crop: cropType, minTemp: cond.minTemp },
            severity: 'danger',
            emoji: '🥶',
        });
    } else if (temp > cond.maxTemp) {
        // Suboptimal: above crop's max but not extreme
        alerts.push({
            id: 'suboptimal_temp_high',
            type: 'temperature',
            title: 'alertSuboptimalTemp',
            description: 'descSuboptimalTemp',
            descriptionParams: { crop: cropType, minTemp: cond.minTemp, maxTemp: cond.maxTemp },
            severity: 'warning',
            emoji: '🌡️',
        });
    } else if (temp < cond.minTemp) {
        // Suboptimal: below crop's min but not extreme
        alerts.push({
            id: 'suboptimal_temp_low',
            type: 'temperature',
            title: 'alertSuboptimalTemp',
            description: 'descSuboptimalTemp',
            descriptionParams: { crop: cropType, minTemp: cond.minTemp, maxTemp: cond.maxTemp },
            severity: 'warning',
            emoji: '🌡️',
        });
    } else {
        // Within crop's optimal range
        alerts.push({
            id: 'optimal_temp',
            type: 'temperature',
            title: 'alertOptimalConditions',
            description: 'descOptimalConditions',
            descriptionParams: { crop: cropType },
            severity: 'good',
            emoji: '✅',
        });
    }

    // ── Crop-specific tips ─────────────────────────────────────────

    // Wheat above maxTemp
    if (cropType === 'Wheat' && temp > cond.maxTemp) {
        alerts.push({
            id: 'wheat_high_temp',
            type: 'crop_tip',
            title: 'alertCropTip',
            description: 'descWheatHighTemp',
            descriptionParams: { crop: cropType },
            severity: 'warning',
            emoji: '🌾',
        });
    }

    // Rice humidity below minHumidity
    if (cropType === 'Rice' && weatherData.humidity < cond.minHumidity) {
        alerts.push({
            id: 'rice_low_humidity',
            type: 'crop_tip',
            title: 'alertCropTip',
            description: 'descRiceLowHumidity',
            descriptionParams: { crop: cropType },
            severity: 'warning',
            emoji: '🌾',
        });
    }

    // Tomato above maxTemp
    if (cropType === 'Tomato' && temp > cond.maxTemp) {
        alerts.push({
            id: 'tomato_high_temp',
            type: 'crop_tip',
            title: 'alertCropTip',
            description: 'descTomatoHighTemp',
            descriptionParams: { crop: cropType },
            severity: 'warning',
            emoji: '🍅',
        });
    }

    // Cotton humidity above maxHumidity
    if (cropType === 'Cotton' && weatherData.humidity > cond.maxHumidity) {
        alerts.push({
            id: 'cotton_high_humidity',
            type: 'crop_tip',
            title: 'alertCropTip',
            description: 'descCottonHighHumidity',
            descriptionParams: { crop: cropType },
            severity: 'warning',
            emoji: '🌿',
        });
    }

    // Onion below minTemp
    if (cropType === 'Onion' && temp < cond.minTemp) {
        alerts.push({
            id: 'onion_cold_temp',
            type: 'crop_tip',
            title: 'alertCropTip',
            description: 'descOnionColdTemp',
            descriptionParams: { crop: cropType },
            severity: 'warning',
            emoji: '🧅',
        });
    }

    // ── Rainfall / humidity rules (crop-specific) ──────────────────

    if (weatherData.rainProbability > 70) {
        // Rain expected — save water
        alerts.push({
            id: 'skip_irrigation',
            type: 'rainfall',
            title: 'alertSkipIrrigation',
            description: 'descSkipIrrigation',
            severity: 'good',
            emoji: '🌧️',
        });
    } else if (weatherData.rainProbability < cond.minRainfall) {
        // Low rainfall for this crop — needs irrigation
        alerts.push({
            id: 'low_rainfall',
            type: 'rainfall',
            title: 'alertLowRainfall',
            description: 'descLowRainfall',
            descriptionParams: { crop: cropType, minRainfall: cond.minRainfall },
            severity: 'warning',
            emoji: '💧',
        });
    }

    if (weatherData.humidity > cond.maxHumidity) {
        // High humidity for this crop — fungal disease risk
        alerts.push({
            id: 'fungal_risk',
            type: 'humidity',
            title: 'alertFungalRisk',
            description: 'descFungalRisk',
            descriptionParams: { crop: cropType, maxHumidity: cond.maxHumidity },
            severity: 'warning',
            emoji: '🍄',
        });
    } else if (weatherData.humidity < cond.minHumidity) {
        // Low humidity for this crop — dehydration risk
        alerts.push({
            id: 'low_humidity',
            type: 'humidity',
            title: 'alertLowHumidity',
            description: 'descLowHumidity',
            descriptionParams: { crop: cropType, minHumidity: cond.minHumidity },
            severity: 'warning',
            emoji: '💧',
        });
    }

    // ── Wind rules (crop-specific) ─────────────────────────────────

    if (weatherData.windSpeed > cond.maxWindStress) {
        alerts.push({
            id: 'wind_alert',
            type: 'wind',
            title: 'alertHighWind',
            description: 'descHighWind',
            descriptionParams: { crop: cropType, maxWind: cond.maxWindStress },
            severity: 'warning',
            emoji: '💨',
        });
    }

    // If no specific alerts were generated, add a generic "all clear"
    if (alerts.length === 0) {
        alerts.push({
            id: 'all_clear',
            type: 'general',
            title: 'alertAllClear',
            description: 'descAllClear',
            descriptionParams: { crop: cropType },
            severity: 'good',
            emoji: '👍',
        });
    }

    return alerts;
};

// ── Crop Stress Index ──────────────────────────────────────────────────

/**
 * Calculate a crop stress score from 1 (best) to 10 (worst) based on
 * how far current conditions deviate from the specific crop's optimal ranges.
 *
 * @param weatherData - Current weather snapshot
 * @param cropType    - Farmer's primary crop (looked up in conditions table)
 * @returns Stress index from 1 to 10
 */
export const calculateCropStressIndex = (
    weatherData: WeatherData,
    cropType: string = 'Other',
): number => {
    const cond = getConditions(cropType);
    let stress = 0;

    // — Temperature contribution —
    // Each degree outside the crop's ideal range adds 1 point
    const temp = weatherData.temperature;
    if (temp > cond.maxTemp) {
        stress += Math.min(5, temp - cond.maxTemp);
    } else if (temp < cond.minTemp) {
        stress += Math.min(5, cond.minTemp - temp);
    }
    // Within range → 0 stress

    // — Humidity contribution —
    // Outside crop's ideal humidity range → +2 points
    if (weatherData.humidity < cond.minHumidity || weatherData.humidity > cond.maxHumidity) {
        stress += 2;
    }

    // — Wind contribution —
    if (weatherData.windSpeed > cond.maxWindStress) {
        stress += Math.min(2, (weatherData.windSpeed - cond.maxWindStress) / 10);
    }

    // — Rainfall contribution —
    if (weatherData.rainProbability < cond.minRainfall) {
        stress += 1;
    }

    // Normalize to 1–10 scale
    return Math.max(1, Math.min(10, Math.round(stress + 1)));
};

/**
 * Map a stress index to a human-readable label and color key.
 */
export const getStressLevel = (
    index: number,
): { label: 'good' | 'moderate' | 'high'; color: string } => {
    if (index <= 3) return { label: 'good', color: '#43A047' };      // green
    if (index <= 6) return { label: 'moderate', color: '#FB8C00' };  // yellow/orange
    return { label: 'high', color: '#E53935' };                       // red
};
