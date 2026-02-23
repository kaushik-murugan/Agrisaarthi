/**
 * SettingsScreen.tsx
 * Allows farmers to change language, location, crop, and other farm settings.
 * All changes persist to AsyncStorage and trigger app-wide re-renders.
 */

import React, { useEffect, useState, useCallback } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Alert,
    StatusBar,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';

// Components
import DropdownPicker from '../components/DropdownPicker';

// Hooks & constants
import { useTranslation } from '../hooks/useTranslation';
import { useLanguage } from '../contexts/LanguageContext';
import Colors from '../constants/colors';
import { LANGUAGE_MAP, LANGUAGE_DISPLAY } from '../constants/translations';

// Types
import type {
    FarmerProfile,
    PreferredLanguage,
    PrimaryCrop,
    SoilType,
    IrrigationType,
} from '../types/farmer';

// ── Constants ──────────────────────────────────────────────────────────

const LANGUAGE_OPTIONS: PreferredLanguage[] = ['English', 'Hindi', 'Tamil', 'Telugu'];
const CROP_OPTIONS: PrimaryCrop[] = ['Wheat', 'Rice', 'Cotton', 'Sugarcane', 'Tomato', 'Onion', 'Other'];
const SOIL_OPTIONS: SoilType[] = ['Sandy', 'Clay', 'Loamy', 'Black Soil', 'Red Soil'];
const IRRIGATION_OPTIONS: IrrigationType[] = ['Rainfed', 'Canal', 'Drip', 'Borewell'];

const PROFILE_KEY = 'farmer_profile';

// ── Component ──────────────────────────────────────────────────────────

const SettingsScreen: React.FC = () => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const { t } = useTranslation();
    const { setLanguage } = useLanguage();

    // Form state
    const [selectedLanguage, setSelectedLanguage] = useState<PreferredLanguage>('English');
    const [village, setVillage] = useState<string>('');
    const [primaryCrop, setPrimaryCrop] = useState<PrimaryCrop>('Wheat');
    const [soilType, setSoilType] = useState<SoilType>('Loamy');
    const [farmSize, setFarmSize] = useState<string>('');
    const [irrigationType, setIrrigationType] = useState<IrrigationType>('Rainfed');

    // ── Load current profile ──────────────────────────────────────

    const loadProfile = useCallback(async () => {
        try {
            const raw = await AsyncStorage.getItem(PROFILE_KEY);
            if (raw) {
                const profile: FarmerProfile = JSON.parse(raw);
                setSelectedLanguage(profile.preferredLanguage ?? 'English');
                setVillage(profile.village ?? '');
                setPrimaryCrop(profile.primaryCrop ?? 'Wheat');
                setSoilType(profile.soilType ?? 'Loamy');
                setFarmSize(profile.farmSize ?? '');
                setIrrigationType(profile.irrigationType ?? 'Rainfed');
            }
        } catch (error) {
            console.error('[SettingsScreen] Failed to load profile:', error);
        }
    }, []);

    useEffect(() => {
        loadProfile();
    }, [loadProfile]);

    // ── Save settings ─────────────────────────────────────────────

    const handleSave = async () => {
        try {
            // Read existing profile to preserve fields like fullName, createdAt
            const raw = await AsyncStorage.getItem(PROFILE_KEY);
            const existing: Partial<FarmerProfile> = raw ? JSON.parse(raw) : {};

            const updatedProfile: FarmerProfile = {
                fullName: existing.fullName ?? '',
                village,
                preferredLanguage: selectedLanguage,
                primaryCrop,
                soilType,
                farmSize,
                irrigationType,
                createdAt: existing.createdAt ?? new Date().toISOString(),
            };

            // Save to AsyncStorage
            await AsyncStorage.setItem(PROFILE_KEY, JSON.stringify(updatedProfile));

            // Update language context — triggers app-wide re-render
            const langCode = LANGUAGE_MAP[selectedLanguage];
            if (langCode) {
                setLanguage(langCode);
            }

            // Show success toast in the NEW language (after context update)
            // Small delay to let context update propagate
            setTimeout(() => {
                Alert.alert('✅', t('settingsSaved'));
            }, 100);
        } catch (error) {
            console.error('[SettingsScreen] Failed to save settings:', error);
        }
    };

    // ── Render ─────────────────────────────────────────────────────

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />

            {/* ── Header ────────────────────────────────────────── */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                    activeOpacity={0.7}
                >
                    <Text style={styles.backText}>← {t('back')}</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>⚙️ {t('settings')}</Text>
            </View>

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                style={{ flex: 1 }}
            >
                <ScrollView
                    style={styles.scrollView}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                >
                    {/* ── Section 1: Personal Settings ─────────────── */}
                    <View style={styles.sectionCard}>
                        <Text style={styles.sectionTitle}>
                            👤 {t('personalSettings')}
                        </Text>

                        <DropdownPicker
                            label={t('changeLanguage')}
                            options={LANGUAGE_OPTIONS}
                            selectedValue={selectedLanguage}
                            onValueChange={(val) =>
                                setSelectedLanguage(val as PreferredLanguage)
                            }
                            placeholder={t('language')}
                        />

                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>
                                {t('changeLocation')}
                            </Text>
                            <TextInput
                                style={styles.textInput}
                                value={village}
                                onChangeText={setVillage}
                                placeholder={t('location')}
                                placeholderTextColor={Colors.textMuted}
                            />
                        </View>
                    </View>

                    {/* ── Section 2: Farm Settings ─────────────────── */}
                    <View style={styles.sectionCard}>
                        <Text style={styles.sectionTitle}>
                            🌾 {t('farmSettings')}
                        </Text>

                        <DropdownPicker
                            label={t('changeCrop')}
                            options={CROP_OPTIONS}
                            selectedValue={primaryCrop}
                            onValueChange={(val) =>
                                setPrimaryCrop(val as PrimaryCrop)
                            }
                            placeholder={t('crop')}
                        />

                        <DropdownPicker
                            label={t('changeSoilType')}
                            options={SOIL_OPTIONS}
                            selectedValue={soilType}
                            onValueChange={(val) =>
                                setSoilType(val as SoilType)
                            }
                            placeholder={t('soilType')}
                        />

                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>
                                {t('changeFarmSize')}
                            </Text>
                            <TextInput
                                style={styles.textInput}
                                value={farmSize}
                                onChangeText={setFarmSize}
                                placeholder={t('farmSize')}
                                placeholderTextColor={Colors.textMuted}
                                keyboardType="numeric"
                            />
                        </View>

                        <DropdownPicker
                            label={t('changeIrrigation')}
                            options={IRRIGATION_OPTIONS}
                            selectedValue={irrigationType}
                            onValueChange={(val) =>
                                setIrrigationType(val as IrrigationType)
                            }
                            placeholder={t('irrigationType')}
                        />
                    </View>

                    {/* ── Section 3: App Info ──────────────────────── */}
                    <View style={styles.sectionCard}>
                        <Text style={styles.sectionTitle}>
                            ℹ️ {t('appInfo')}
                        </Text>
                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>{t('appVersion')}</Text>
                            <Text style={styles.infoValue}>1.0.0</Text>
                        </View>
                        <View style={styles.infoDivider} />
                        <Text style={styles.infoTagline}>
                            {t('madeForIndianFarmers')}
                        </Text>
                    </View>

                    {/* ── Save button ──────────────────────────────── */}
                    <TouchableOpacity
                        style={styles.saveButton}
                        onPress={handleSave}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.saveButtonText}>
                            💾 {t('saveSettings')}
                        </Text>
                    </TouchableOpacity>

                    {/* Bottom spacing */}
                    <View style={{ height: 40 }} />
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

// ── Styles ─────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },

    // Header
    header: {
        backgroundColor: Colors.primary,
        paddingVertical: 20,
        paddingHorizontal: 24,
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
    },
    backButton: {
        marginBottom: 8,
    },
    backText: {
        fontSize: 15,
        color: Colors.textLight,
        opacity: 0.9,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: Colors.textLight,
        letterSpacing: 0.5,
    },

    // Scroll
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 16,
        paddingTop: 20,
    },

    // Section cards
    sectionCard: {
        backgroundColor: Colors.surface,
        borderRadius: 16,
        padding: 20,
        marginBottom: 16,
        // Shadow
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: Colors.primary,
        marginBottom: 16,
    },

    // Text inputs
    inputGroup: {
        marginBottom: 18,
    },
    inputLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.textPrimary,
        marginBottom: 8,
    },
    textInput: {
        backgroundColor: Colors.surface,
        borderWidth: 1.5,
        borderColor: Colors.border,
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 14,
        fontSize: 16,
        color: Colors.textPrimary,
    },

    // App info
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 8,
    },
    infoLabel: {
        fontSize: 15,
        color: Colors.textSecondary,
    },
    infoValue: {
        fontSize: 15,
        fontWeight: '600',
        color: Colors.textPrimary,
    },
    infoDivider: {
        height: 1,
        backgroundColor: Colors.divider,
        marginVertical: 12,
    },
    infoTagline: {
        fontSize: 15,
        color: Colors.textSecondary,
        textAlign: 'center',
        paddingVertical: 4,
    },

    // Save button
    saveButton: {
        backgroundColor: Colors.primary,
        borderRadius: 14,
        paddingVertical: 18,
        alignItems: 'center',
        marginTop: 8,
        // Shadow
        shadowColor: Colors.primaryDark,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
    },
    saveButtonText: {
        fontSize: 18,
        fontWeight: '700',
        color: Colors.textLight,
        letterSpacing: 0.5,
    },
});

export default SettingsScreen;
