/**
 * farmer.ts
 * TypeScript interface for the farmer profile data model.
 * Used during onboarding and stored in AsyncStorage.
 */

/** Supported language options for the app */
export type PreferredLanguage = 'English' | 'Hindi' | 'Tamil' | 'Telugu';

/** Primary crop types available for selection */
export type PrimaryCrop =
    | 'Wheat'
    | 'Rice'
    | 'Cotton'
    | 'Sugarcane'
    | 'Tomato'
    | 'Onion'
    | 'Other';

/** Soil type classifications */
export type SoilType = 'Sandy' | 'Clay' | 'Loamy' | 'Black Soil' | 'Red Soil';

/** Irrigation method types */
export type IrrigationType = 'Rainfed' | 'Canal' | 'Drip' | 'Borewell';

/**
 * FarmerProfile
 * Represents the complete farmer profile collected during onboarding.
 * This will be stored in AsyncStorage with key 'farmer_profile'.
 */
export interface FarmerProfile {
    // ── Step 1: Personal Information ──
    fullName: string;
    village: string;
    preferredLanguage: PreferredLanguage;

    // ── Step 2: Farm Information ──
    primaryCrop: PrimaryCrop;
    soilType: SoilType;
    farmSize: string; // stored as string from number input
    irrigationType: IrrigationType;

    // ── Metadata ──
    createdAt: string; // ISO date string
}
