/**
 * config.ts
 * Application configuration — placeholder values for external services.
 * Replace these with real keys before connecting to any API.
 */

const Config = {
    // ── Supabase ────────────────────────────────────────────────────
    /** Supabase project URL (found in Project Settings → API) */
    SUPABASE_URL: 'YOUR_SUPABASE_URL_HERE',

    /** Supabase anonymous / public key */
    SUPABASE_ANON_KEY: 'YOUR_SUPABASE_ANON_KEY_HERE',

    // ── OpenWeatherMap ──────────────────────────────────────────────
    /** OpenWeatherMap API key for weather data */
    OPENWEATHERMAP_API_KEY: 'YOUR_OPENWEATHERMAP_API_KEY_HERE',

    // ── App metadata ────────────────────────────────────────────────
    APP_NAME: 'Agrisaarthi',
    APP_VERSION: '1.0.0',
} as const;

export default Config;
