/**
 * HomeScreen.tsx
 * The main landing screen of Agrisaarthi.
 * Displays a personalized greeting using the farmer's name
 * from AsyncStorage, plus feature cards.
 *
 * All user-facing strings are resolved via the useTranslation hook,
 * so the UI renders in the farmer's preferred language.
 */

import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Colors from '../constants/colors';
import type { FarmerProfile } from '../types/farmer';
import { useTranslation } from '../hooks/useTranslation';

const HomeScreen: React.FC = () => {
    const [farmerName, setFarmerName] = useState<string>('Farmer');

    /** Translation hook — resolves strings based on saved language */
    const { t } = useTranslation();

    useEffect(() => {
        /** Load farmer profile from AsyncStorage to display greeting */
        const loadProfile = async () => {
            try {
                const data = await AsyncStorage.getItem('farmer_profile');
                if (data) {
                    const profile: FarmerProfile = JSON.parse(data);
                    setFarmerName(profile.fullName);
                }
            } catch (error) {
                console.error('Error loading farmer profile:', error);
            }
        };

        loadProfile();
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar
                barStyle="light-content"
                backgroundColor={Colors.primary}
            />

            {/* ── Header area ────────────────────────────────────────── */}
            <View style={styles.header}>
                <Text style={styles.headerEmoji}>🌾</Text>
                <Text style={styles.headerTitle}>{t('appName')}</Text>
                <Text style={styles.headerSubtitle}>
                    {t('tagline')}
                </Text>
            </View>

            {/* ── Welcome card ───────────────────────────────────────── */}
            <View style={styles.content}>
                <View style={styles.card}>
                    <Text style={styles.cardIcon}>🌱</Text>
                    <Text style={styles.cardTitle}>
                        {t('greeting', { name: farmerName })} 🙏
                    </Text>
                    <Text style={styles.cardDescription}>
                        {t('welcomeDesc')}
                    </Text>
                </View>

                {/* ── Feature pills ──────────────────────────────────────── */}
                <View style={styles.featuresRow}>
                    <View style={styles.featurePill}>
                        <Text style={styles.featureEmoji}>🌤️</Text>
                        <Text style={styles.featureText}>{t('weather')}</Text>
                    </View>
                    <View style={styles.featurePill}>
                        <Text style={styles.featureEmoji}>🤖</Text>
                        <Text style={styles.featureText}>{t('aiAdvice')}</Text>
                    </View>
                    <View style={styles.featurePill}>
                        <Text style={styles.featureEmoji}>🌿</Text>
                        <Text style={styles.featureText}>{t('cropCare')}</Text>
                    </View>
                </View>
            </View>

            {/* ── Footer tagline ────────────────────────────────────── */}
            <View style={styles.footer}>
                <Text style={styles.footerText}>
                    🇮🇳  {t('madeForFarmers')}
                </Text>
            </View>
        </SafeAreaView>
    );
};

/* ── Styles ─────────────────────────────────────────────────────── */
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },

    // Header
    header: {
        backgroundColor: Colors.primary,
        paddingVertical: 32,
        paddingHorizontal: 24,
        alignItems: 'center',
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
    },
    headerEmoji: {
        fontSize: 48,
        marginBottom: 8,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: Colors.textLight,
        letterSpacing: 1,
    },
    headerSubtitle: {
        fontSize: 14,
        color: Colors.textLight,
        opacity: 0.85,
        marginTop: 4,
    },

    // Content
    content: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 24,
    },

    // Card
    card: {
        backgroundColor: Colors.surface,
        borderRadius: 16,
        padding: 24,
        alignItems: 'center',
        // Shadow (iOS)
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        // Elevation (Android)
        elevation: 4,
    },
    cardIcon: {
        fontSize: 40,
        marginBottom: 12,
    },
    cardTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: Colors.textPrimary,
        marginBottom: 8,
        textAlign: 'center',
    },
    cardDescription: {
        fontSize: 14,
        color: Colors.textSecondary,
        textAlign: 'center',
        lineHeight: 22,
    },

    // Feature pills
    featuresRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 24,
    },
    featurePill: {
        backgroundColor: Colors.surface,
        borderRadius: 12,
        paddingVertical: 14,
        paddingHorizontal: 18,
        alignItems: 'center',
        minWidth: 90,
        // Shadow
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.06,
        shadowRadius: 4,
        elevation: 2,
    },
    featureEmoji: {
        fontSize: 24,
        marginBottom: 4,
    },
    featureText: {
        fontSize: 12,
        fontWeight: '600',
        color: Colors.textPrimary,
    },

    // Footer
    footer: {
        paddingVertical: 16,
        alignItems: 'center',
    },
    footerText: {
        fontSize: 12,
        color: Colors.textMuted,
    },
});

export default HomeScreen;
