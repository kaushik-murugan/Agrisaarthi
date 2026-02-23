/**
 * WeatherScreen.tsx
 * Displays current weather, crop stress index, smart farming alerts,
 * and a 5-day forecast for the farmer's saved location.
 *
 * Data sources:
 *   - Weather: weatherService.ts (OpenWeatherMap)
 *   - Alerts:  cropIntelligence.ts
 *   - Profile: AsyncStorage → farmer_profile (village, primaryCrop)
 *   - i18n:    useTranslation hook (via LanguageContext)
 */

import React, { useEffect, useState, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    ActivityIndicator,
    RefreshControl,
    StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Services & utilities
import {
    getCurrentWeather,
    getFiveDayForecast,
    weatherIconToEmoji,
    type WeatherData,
    type ForecastData,
} from '../services/weatherService';
import {
    generateFarmingAlerts,
    calculateCropStressIndex,
    getStressLevel,
    type FarmingAlert,
} from '../utils/cropIntelligence';

// Hooks & constants
import { useTranslation } from '../hooks/useTranslation';
import Colors from '../constants/colors';
import type { TranslationKey } from '../constants/translations';

// ── Helper: map OWM description to translation key ──────────────────

const weatherDescriptionKey = (desc: string): TranslationKey => {
    const map: Record<string, TranslationKey> = {
        'clear sky': 'weatherClearSky',
        'few clouds': 'weatherFewClouds',
        'scattered clouds': 'weatherScatteredClouds',
        'broken clouds': 'weatherBrokenClouds',
        'shower rain': 'weatherShowerRain',
        'rain': 'weatherRain',
        'light rain': 'weatherLightRain',
        'thunderstorm': 'weatherThunderstorm',
        'snow': 'weatherSnow',
        'mist': 'weatherMist',
        'partly cloudy': 'weatherPartlyCloudy',
        'overcast clouds': 'weatherOvercastClouds',
        'moderate rain': 'weatherModerateRain',
        'heavy rain': 'weatherHeavyRain',
        'heavy intensity rain': 'weatherHeavyRain',
        'haze': 'weatherHaze',
    };
    return map[desc.toLowerCase()] ?? 'weatherPartlyCloudy';
};

// ── Helper: map short day name to translation key ───────────────────

const dayNameKey = (shortName: string): TranslationKey => {
    const map: Record<string, TranslationKey> = {
        Sun: 'daySun',
        Mon: 'dayMon',
        Tue: 'dayTue',
        Wed: 'dayWed',
        Thu: 'dayThu',
        Fri: 'dayFri',
        Sat: 'daySat',
    };
    return map[shortName] ?? 'dayMon';
};

// ── Helper: format today's date ────────────────────────────────────

const formatDate = (): string => {
    const d = new Date();
    return d.toLocaleDateString('en-IN', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
};

// ── Component ──────────────────────────────────────────────────────────

const WeatherScreen: React.FC = () => {
    // Farmer profile
    const [location, setLocation] = useState<string>('');
    const [cropType, setCropType] = useState<string>('Crop');

    // Weather data
    const [weather, setWeather] = useState<WeatherData | null>(null);
    const [forecast, setForecast] = useState<ForecastData | null>(null);

    // Derived intelligence
    const [alerts, setAlerts] = useState<FarmingAlert[]>([]);
    const [stressIndex, setStressIndex] = useState<number>(1);

    // UI state
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    // Translations
    const { t, language } = useTranslation();

    // ── Load farmer profile from AsyncStorage ──────────────────────

    const loadProfile = useCallback(async () => {
        try {
            const raw = await AsyncStorage.getItem('farmer_profile');
            if (raw) {
                const profile = JSON.parse(raw);
                // 'village' holds location, 'primaryCrop' holds crop
                const loc = profile.village ?? profile.location ?? 'Delhi';
                const crop = profile.primaryCrop ?? profile.crop ?? 'Crop';
                setLocation(loc);
                setCropType(crop);
                return { loc, crop };
            }
        } catch (err) {
            console.error('[WeatherScreen] Failed to load profile:', err);
        }
        // Defaults
        setLocation('Delhi');
        setCropType('Crop');
        return { loc: 'Delhi', crop: 'Crop' };
    }, []);

    // ── Fetch weather data ─────────────────────────────────────────

    const fetchWeather = useCallback(
        async (loc: string, crop: string) => {
            try {
                setError(null);
                const [currentWeather, forecastData] = await Promise.all([
                    getCurrentWeather(loc),
                    getFiveDayForecast(loc),
                ]);

                setWeather(currentWeather);
                setForecast(forecastData);

                // Generate farming intelligence
                const farmAlerts = generateFarmingAlerts(currentWeather, crop);
                setAlerts(farmAlerts);

                const stress = calculateCropStressIndex(currentWeather, crop);
                setStressIndex(stress);
            } catch (err) {
                console.error('[WeatherScreen] Fetch error:', err);
                setError('weatherLoadError');
            }
        },
        [],
    );

    // ── Initial load + re-load when language changes (profile may have changed) ──

    useEffect(() => {
        const init = async () => {
            setIsLoading(true);
            const { loc, crop } = await loadProfile();
            await fetchWeather(loc, crop);
            setIsLoading(false);
        };
        init();
    }, [loadProfile, fetchWeather, language]);

    // ── Pull-to-refresh ────────────────────────────────────────────

    const onRefresh = useCallback(async () => {
        setIsRefreshing(true);
        const { loc, crop } = await loadProfile();
        await fetchWeather(loc, crop);
        setIsRefreshing(false);
    }, [fetchWeather, loadProfile]);

    // ── Severity → border color mapping ────────────────────────────

    const severityColor = (severity: string): string => {
        if (severity === 'danger') return Colors.error;
        if (severity === 'warning') return Colors.warning;
        return Colors.success;
    };

    // ── Loading state ──────────────────────────────────────────────

    if (isLoading) {
        return (
            <SafeAreaView style={styles.centered}>
                <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />
                <ActivityIndicator size="large" color={Colors.primary} />
                <Text style={styles.loadingText}>{t('loading')}</Text>
            </SafeAreaView>
        );
    }

    // ── Error state ────────────────────────────────────────────────

    if (error && !weather) {
        return (
            <SafeAreaView style={styles.centered}>
                <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />
                <Text style={styles.errorEmoji}>⚠️</Text>
                <Text style={styles.errorText}>{t('weatherLoadError')}</Text>
            </SafeAreaView>
        );
    }

    // ── Stress level info ──────────────────────────────────────────

    const stress = getStressLevel(stressIndex);
    const stressLabel =
        stress.label === 'good'
            ? t('goodConditions')
            : stress.label === 'moderate'
                ? t('moderateStress')
                : t('highStress');

    // Stress description — fully translated with crop placeholder
    const stressDescription =
        stress.label === 'good'
            ? t('stressGoodDesc', { crop: cropType })
            : stress.label === 'moderate'
                ? t('stressModerateDesc', { crop: cropType })
                : t('stressHighDesc', { crop: cropType });

    // ── Main render ────────────────────────────────────────────────

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />

            <ScrollView
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={isRefreshing}
                        onRefresh={onRefresh}
                        colors={[Colors.primary]}
                        tintColor={Colors.primary}
                    />
                }
            >
                {/* ── Header: location + date ─────────────────────── */}
                <View style={styles.header}>
                    <Text style={styles.headerEmoji}>🌾</Text>
                    <Text style={styles.headerTitle}>{t('weatherTitle')}</Text>
                    <Text style={styles.locationText}>
                        📍 {weather?.location ?? location}
                    </Text>
                    <Text style={styles.dateText}>{formatDate()}</Text>
                </View>

                <View style={styles.content}>
                    {/* ── Current weather card ─────────────────────── */}
                    {weather && (
                        <View style={styles.weatherCard}>
                            <Text style={styles.weatherEmoji}>
                                {weatherIconToEmoji(weather.icon)}
                            </Text>
                            <Text style={styles.tempText}>
                                {weather.temperature}°C
                            </Text>
                            <Text style={styles.descText}>
                                {t(weatherDescriptionKey(weather.description))}
                            </Text>
                            <Text style={styles.feelsLikeText}>
                                {t('feelsLike')} {weather.feelsLike}°C
                            </Text>

                            {/* Weather metrics row */}
                            <View style={styles.metricsRow}>
                                <View style={styles.metricItem}>
                                    <Text style={styles.metricEmoji}>💧</Text>
                                    <Text style={styles.metricValue}>
                                        {weather.humidity}%
                                    </Text>
                                    <Text style={styles.metricLabel}>
                                        {t('humidity')}
                                    </Text>
                                </View>
                                <View style={styles.metricItem}>
                                    <Text style={styles.metricEmoji}>🌧️</Text>
                                    <Text style={styles.metricValue}>
                                        {weather.rainProbability}%
                                    </Text>
                                    <Text style={styles.metricLabel}>
                                        {t('rainfall')}
                                    </Text>
                                </View>
                                <View style={styles.metricItem}>
                                    <Text style={styles.metricEmoji}>💨</Text>
                                    <Text style={styles.metricValue}>
                                        {weather.windSpeed} km/h
                                    </Text>
                                    <Text style={styles.metricLabel}>
                                        {t('wind')}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    )}

                    {/* ── Crop Stress Index ────────────────────────── */}
                    <View style={styles.stressCard}>
                        <Text style={styles.sectionTitle}>
                            {t('cropStressIndex')}
                        </Text>
                        <View style={styles.stressRow}>
                            {/* Circular indicator */}
                            <View
                                style={[
                                    styles.stressCircle,
                                    { borderColor: stress.color },
                                ]}
                            >
                                <Text
                                    style={[
                                        styles.stressNumber,
                                        { color: stress.color },
                                    ]}
                                >
                                    {stressIndex}
                                </Text>
                                <Text style={styles.stressOutOf}>/10</Text>
                            </View>
                            <View style={styles.stressInfo}>
                                <Text
                                    style={[
                                        styles.stressLabel,
                                        { color: stress.color },
                                    ]}
                                >
                                    {stressLabel}
                                </Text>
                                <Text style={styles.stressDesc}>
                                    {stressDescription}
                                </Text>
                            </View>
                        </View>
                    </View>

                    {/* ── Smart Alerts section ─────────────────────── */}
                    <Text style={styles.sectionTitle}>
                        🔔 {t('todayAlerts')}
                    </Text>

                    {alerts.map((alert) => (
                        <View
                            key={alert.id}
                            style={[
                                styles.alertCard,
                                {
                                    borderLeftColor: severityColor(
                                        alert.severity,
                                    ),
                                },
                            ]}
                        >
                            <View style={styles.alertHeader}>
                                <Text style={styles.alertEmoji}>
                                    {alert.emoji}
                                </Text>
                                <Text
                                    style={[
                                        styles.alertTitle,
                                        {
                                            color: severityColor(
                                                alert.severity,
                                            ),
                                        },
                                    ]}
                                >
                                    {t(alert.title as TranslationKey)}
                                </Text>
                            </View>
                            <Text style={styles.alertDesc}>
                                {t(alert.description as TranslationKey, alert.descriptionParams)}
                            </Text>
                        </View>
                    ))}

                    {/* ── 5-Day Forecast strip ─────────────────────── */}
                    {forecast && forecast.days.length > 0 && (
                        <>
                            <Text style={styles.sectionTitle}>
                                📅 {t('forecast')}
                            </Text>
                            <ScrollView
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                style={styles.forecastScroll}
                            >
                                {forecast.days.map((day) => (
                                    <View
                                        key={day.date}
                                        style={styles.forecastDay}
                                    >
                                        <Text style={styles.forecastDayName}>
                                            {t(dayNameKey(day.dayName))}
                                        </Text>
                                        <Text style={styles.forecastEmoji}>
                                            {weatherIconToEmoji(day.icon)}
                                        </Text>
                                        <Text style={styles.forecastHigh}>
                                            {day.tempHigh}°
                                        </Text>
                                        <Text style={styles.forecastLow}>
                                            {day.tempLow}°
                                        </Text>
                                        <Text style={styles.forecastRain}>
                                            🌧️ {day.rainProbability}%
                                        </Text>
                                    </View>
                                ))}
                            </ScrollView>
                        </>
                    )}

                    {/* Bottom spacing */}
                    <View style={{ height: 24 }} />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

// ── Styles ─────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.background,
        padding: 24,
    },

    // Loading
    loadingText: {
        marginTop: 12,
        fontSize: 16,
        color: Colors.textSecondary,
    },

    // Error
    errorEmoji: {
        fontSize: 48,
        marginBottom: 12,
    },
    errorText: {
        fontSize: 16,
        color: Colors.error,
        textAlign: 'center',
    },

    // Header
    header: {
        backgroundColor: Colors.primary,
        paddingVertical: 28,
        paddingHorizontal: 24,
        alignItems: 'center',
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
    },
    headerEmoji: {
        fontSize: 36,
        marginBottom: 4,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: Colors.textLight,
        letterSpacing: 0.5,
    },
    locationText: {
        fontSize: 15,
        color: Colors.textLight,
        opacity: 0.9,
        marginTop: 6,
    },
    dateText: {
        fontSize: 13,
        color: Colors.textLight,
        opacity: 0.75,
        marginTop: 2,
    },

    // Content wrapper
    content: {
        paddingHorizontal: 16,
        paddingTop: 20,
    },

    // Current weather card
    weatherCard: {
        backgroundColor: Colors.surface,
        borderRadius: 16,
        padding: 24,
        alignItems: 'center',
        marginBottom: 16,
        // Shadow
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
    },
    weatherEmoji: {
        fontSize: 56,
        marginBottom: 4,
    },
    tempText: {
        fontSize: 48,
        fontWeight: 'bold',
        color: Colors.textPrimary,
    },
    descText: {
        fontSize: 16,
        color: Colors.textSecondary,
        textTransform: 'capitalize',
        marginTop: 2,
    },
    feelsLikeText: {
        fontSize: 14,
        color: Colors.textMuted,
        marginTop: 4,
    },

    // Metrics row
    metricsRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        marginTop: 20,
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: Colors.divider,
    },
    metricItem: {
        alignItems: 'center',
        flex: 1,
    },
    metricEmoji: {
        fontSize: 20,
        marginBottom: 4,
    },
    metricValue: {
        fontSize: 16,
        fontWeight: '700',
        color: Colors.textPrimary,
    },
    metricLabel: {
        fontSize: 11,
        color: Colors.textMuted,
        marginTop: 2,
    },

    // Stress card
    stressCard: {
        backgroundColor: Colors.surface,
        borderRadius: 16,
        padding: 20,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.06,
        shadowRadius: 6,
        elevation: 2,
    },
    stressRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 12,
    },
    stressCircle: {
        width: 72,
        height: 72,
        borderRadius: 36,
        borderWidth: 4,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    stressNumber: {
        fontSize: 26,
        fontWeight: 'bold',
    },
    stressOutOf: {
        fontSize: 12,
        color: Colors.textMuted,
        marginTop: -4,
    },
    stressInfo: {
        flex: 1,
    },
    stressLabel: {
        fontSize: 18,
        fontWeight: '700',
    },
    stressDesc: {
        fontSize: 13,
        color: Colors.textSecondary,
        marginTop: 4,
        lineHeight: 18,
    },

    // Section title
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: Colors.textPrimary,
        marginBottom: 12,
        marginTop: 8,
    },

    // Alert cards
    alertCard: {
        backgroundColor: Colors.surface,
        borderRadius: 12,
        padding: 16,
        marginBottom: 10,
        borderLeftWidth: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 1,
    },
    alertHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 6,
    },
    alertEmoji: {
        fontSize: 20,
        marginRight: 8,
    },
    alertTitle: {
        fontSize: 16,
        fontWeight: '700',
    },
    alertDesc: {
        fontSize: 14,
        color: Colors.textSecondary,
        lineHeight: 20,
    },

    // Forecast strip
    forecastScroll: {
        marginBottom: 8,
    },
    forecastDay: {
        backgroundColor: Colors.surface,
        borderRadius: 12,
        padding: 14,
        marginRight: 10,
        alignItems: 'center',
        minWidth: 80,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 1,
    },
    forecastDayName: {
        fontSize: 13,
        fontWeight: '600',
        color: Colors.textPrimary,
        marginBottom: 6,
    },
    forecastEmoji: {
        fontSize: 28,
        marginBottom: 6,
    },
    forecastHigh: {
        fontSize: 16,
        fontWeight: '700',
        color: Colors.textPrimary,
    },
    forecastLow: {
        fontSize: 14,
        color: Colors.textMuted,
        marginTop: 2,
    },
    forecastRain: {
        fontSize: 11,
        color: Colors.info,
        marginTop: 4,
    },
});

export default WeatherScreen;
