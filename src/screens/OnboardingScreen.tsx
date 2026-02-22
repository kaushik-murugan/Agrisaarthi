/**
 * OnboardingScreen.tsx
 * 3-step farmer onboarding flow for Agrisaarthi.
 *
 * Step 1 — Personal Information (name, village, language)
 * Step 2 — Farm Information (crop, soil, size, irrigation)
 * Step 3 — Confirmation summary + save to AsyncStorage
 *
 * All user-facing strings are resolved via the useTranslation hook,
 * so the UI adapts to the farmer's preferred language.
 * Note: On first launch (no saved profile), English is used as the default.
 */

import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    StyleSheet,
    Alert,
    KeyboardAvoidingView,
    Platform,
    StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

// Components
import ProgressBar from '../components/ProgressBar';
import DropdownPicker from '../components/DropdownPicker';

// Types
import type { FarmerProfile } from '../types/farmer';
import type { RootStackParamList } from '../navigation/AppNavigator';

// Constants
import Colors from '../constants/colors';

// Translation hook
import { useTranslation } from '../hooks/useTranslation';

// ── Dropdown option arrays ──────────────────────────────────────────
const LANGUAGE_OPTIONS = ['English', 'Hindi', 'Tamil', 'Telugu'];
const CROP_OPTIONS = ['Wheat', 'Rice', 'Cotton', 'Sugarcane', 'Tomato', 'Onion', 'Other'];
const SOIL_OPTIONS = ['Sandy', 'Clay', 'Loamy', 'Black Soil', 'Red Soil'];
const IRRIGATION_OPTIONS = ['Rainfed', 'Canal', 'Drip', 'Borewell'];

/** AsyncStorage key for farmer profile */
const STORAGE_KEY = 'farmer_profile';

/** Total number of onboarding steps */
const TOTAL_STEPS = 3;

// ── Navigation prop type ────────────────────────────────────────────
type OnboardingNavProp = NativeStackNavigationProp<RootStackParamList, 'Onboarding'>;

interface Props {
    navigation: OnboardingNavProp;
}

/**
 * OnboardingScreen
 * Guides the farmer through a 3-step profile setup.
 */
const OnboardingScreen: React.FC<Props> = ({ navigation }) => {
    // ── Current step (1-indexed) ──
    const [step, setStep] = useState(1);

    // ── Form state ──
    const [fullName, setFullName] = useState('');
    const [village, setVillage] = useState('');
    const [preferredLanguage, setPreferredLanguage] = useState('');
    const [primaryCrop, setPrimaryCrop] = useState('');
    const [soilType, setSoilType] = useState('');
    const [farmSize, setFarmSize] = useState('');
    const [irrigationType, setIrrigationType] = useState('');

    // ── Saving state ──
    const [isSaving, setIsSaving] = useState(false);

    /** Translation hook — defaults to English on first launch */
    const { t } = useTranslation();

    /**
     * Validates that all required fields for the current step are filled.
     */
    const isStepValid = (): boolean => {
        switch (step) {
            case 1:
                return fullName.trim() !== '' && village.trim() !== '' && preferredLanguage !== '';
            case 2:
                return primaryCrop !== '' && soilType !== '' && farmSize.trim() !== '' && irrigationType !== '';
            case 3:
                return true; // Confirmation step — always valid
            default:
                return false;
        }
    };

    /**
     * Navigates to the next step.
     */
    const handleNext = () => {
        if (!isStepValid()) {
            Alert.alert('Missing Fields', 'Please fill in all required fields before continuing.');
            return;
        }
        if (step < TOTAL_STEPS) {
            setStep(step + 1);
        }
    };

    /**
     * Navigates to the previous step.
     */
    const handleBack = () => {
        if (step > 1) {
            setStep(step - 1);
        }
    };

    /**
     * Saves the farmer profile to AsyncStorage and navigates to Home.
     */
    const handleFinish = async () => {
        setIsSaving(true);
        try {
            const profile: FarmerProfile = {
                fullName: fullName.trim(),
                village: village.trim(),
                preferredLanguage: preferredLanguage as FarmerProfile['preferredLanguage'],
                primaryCrop: primaryCrop as FarmerProfile['primaryCrop'],
                soilType: soilType as FarmerProfile['soilType'],
                farmSize: farmSize.trim(),
                irrigationType: irrigationType as FarmerProfile['irrigationType'],
                createdAt: new Date().toISOString(),
            };

            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(profile));

            // Navigate to Home and reset the stack so user can't go back to onboarding
            navigation.reset({
                index: 0,
                routes: [{ name: 'Home' }],
            });
        } catch (error) {
            Alert.alert('Error', 'Failed to save your profile. Please try again.');
            console.error('AsyncStorage save error:', error);
        } finally {
            setIsSaving(false);
        }
    };

    // ────────────────────────────────────────────────────────────────────
    // STEP 1 — Personal Information
    // ────────────────────────────────────────────────────────────────────
    const renderStep1 = () => (
        <View style={styles.stepContainer}>
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionEmoji}>👤</Text>
                <Text style={styles.sectionTitle}>{t('personalInfo')}</Text>
            </View>

            <View style={styles.card}>
                {/* Full Name */}
                <Text style={styles.inputLabel}>{t('name')} *</Text>
                <TextInput
                    style={styles.textInput}
                    placeholder="Enter your full name"
                    placeholderTextColor={Colors.textMuted}
                    value={fullName}
                    onChangeText={setFullName}
                    autoCapitalize="words"
                    returnKeyType="next"
                />

                {/* Village / District */}
                <Text style={styles.inputLabel}>{t('location')} *</Text>
                <TextInput
                    style={styles.textInput}
                    placeholder="Enter your village or district"
                    placeholderTextColor={Colors.textMuted}
                    value={village}
                    onChangeText={setVillage}
                    autoCapitalize="words"
                    returnKeyType="done"
                />

                {/* Preferred Language */}
                <DropdownPicker
                    label={`${t('language')} *`}
                    options={LANGUAGE_OPTIONS}
                    selectedValue={preferredLanguage}
                    onValueChange={setPreferredLanguage}
                    placeholder="Select your language"
                />
            </View>
        </View>
    );

    // ────────────────────────────────────────────────────────────────────
    // STEP 2 — Farm Information
    // ────────────────────────────────────────────────────────────────────
    const renderStep2 = () => (
        <View style={styles.stepContainer}>
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionEmoji}>🌾</Text>
                <Text style={styles.sectionTitle}>{t('farmInfo')}</Text>
            </View>

            <View style={styles.card}>
                {/* Primary Crop */}
                <DropdownPicker
                    label={`${t('crop')} *`}
                    options={CROP_OPTIONS}
                    selectedValue={primaryCrop}
                    onValueChange={setPrimaryCrop}
                    placeholder="Select your primary crop"
                />

                {/* Soil Type */}
                <DropdownPicker
                    label={`${t('soilType')} *`}
                    options={SOIL_OPTIONS}
                    selectedValue={soilType}
                    onValueChange={setSoilType}
                    placeholder="Select soil type"
                />

                {/* Farm Size */}
                <Text style={styles.inputLabel}>{t('farmSize')} *</Text>
                <View style={styles.farmSizeRow}>
                    <TextInput
                        style={[styles.textInput, styles.farmSizeInput]}
                        placeholder="e.g. 5"
                        placeholderTextColor={Colors.textMuted}
                        value={farmSize}
                        onChangeText={setFarmSize}
                        keyboardType="numeric"
                        returnKeyType="done"
                    />
                    <View style={styles.acresBadge}>
                        <Text style={styles.acresText}>acres</Text>
                    </View>
                </View>

                {/* Irrigation Type */}
                <DropdownPicker
                    label={`${t('irrigationType')} *`}
                    options={IRRIGATION_OPTIONS}
                    selectedValue={irrigationType}
                    onValueChange={setIrrigationType}
                    placeholder="Select irrigation type"
                />
            </View>
        </View>
    );

    // ────────────────────────────────────────────────────────────────────
    // STEP 3 — Confirmation
    // ────────────────────────────────────────────────────────────────────
    const renderStep3 = () => (
        <View style={styles.stepContainer}>
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionEmoji}>✅</Text>
                <Text style={styles.sectionTitle}>{t('confirmation')}</Text>
            </View>

            {/* Summary card */}
            <View style={styles.card}>
                <Text style={styles.summaryHeading}>👤 {t('personalInfo')}</Text>
                <SummaryRow label={t('name')} value={fullName} />
                <SummaryRow label={t('location')} value={village} />
                <SummaryRow label={t('language')} value={preferredLanguage} />

                <View style={styles.summaryDivider} />

                <Text style={styles.summaryHeading}>🌾 {t('farmInfo')}</Text>
                <SummaryRow label={t('crop')} value={primaryCrop} />
                <SummaryRow label={t('soilType')} value={soilType} />
                <SummaryRow label={t('farmSize')} value={`${farmSize} acres`} />
                <SummaryRow label={t('irrigationType')} value={irrigationType} />
            </View>

            {/* Finish button */}
            <TouchableOpacity
                style={[styles.finishButton, isSaving && styles.buttonDisabled]}
                onPress={handleFinish}
                disabled={isSaving}
                activeOpacity={0.8}
            >
                <Text style={styles.finishButtonEmoji}>🚜</Text>
                <Text style={styles.finishButtonText}>
                    {isSaving ? t('loading') : t('startButton')}
                </Text>
            </TouchableOpacity>
        </View>
    );

    // ────────────────────────────────────────────────────────────────────
    // MAIN RENDER
    // ────────────────────────────────────────────────────────────────────
    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />

            {/* App title */}
            <View style={styles.header}>
                <Text style={styles.headerEmoji}>🌱</Text>
                <Text style={styles.headerTitle}>{t('appName')}</Text>
                <Text style={styles.headerSubtitle}>
                    {t('step', { current: step, total: TOTAL_STEPS })}
                </Text>
            </View>

            {/* Progress bar */}
            <ProgressBar currentStep={step} totalSteps={TOTAL_STEPS} />

            {/* Step content */}
            <KeyboardAvoidingView
                style={styles.keyboardView}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
            >
                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    {step === 1 && renderStep1()}
                    {step === 2 && renderStep2()}
                    {step === 3 && renderStep3()}
                </ScrollView>
            </KeyboardAvoidingView>

            {/* Navigation buttons (Back / Next) — hidden on step 3 since it has its own finish button */}
            {step < TOTAL_STEPS && (
                <View style={styles.navRow}>
                    {step > 1 ? (
                        <TouchableOpacity
                            style={styles.backButton}
                            onPress={handleBack}
                            activeOpacity={0.7}
                        >
                            <Text style={styles.backButtonText}>← {t('back')}</Text>
                        </TouchableOpacity>
                    ) : (
                        <View style={styles.spacer} />
                    )}

                    <TouchableOpacity
                        style={[styles.nextButton, !isStepValid() && styles.buttonDisabled]}
                        onPress={handleNext}
                        disabled={!isStepValid()}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.nextButtonText}>{t('next')} →</Text>
                    </TouchableOpacity>
                </View>
            )}

            {/* Back button on step 3 */}
            {step === TOTAL_STEPS && (
                <View style={styles.navRow}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={handleBack}
                        activeOpacity={0.7}
                    >
                        <Text style={styles.backButtonText}>← {t('back')}</Text>
                    </TouchableOpacity>
                    <View style={styles.spacer} />
                </View>
            )}
        </SafeAreaView>
    );
};

// ────────────────────────────────────────────────────────────────────
// HELPER: Summary row component for Step 3
// ────────────────────────────────────────────────────────────────────
const SummaryRow: React.FC<{ label: string; value: string }> = ({ label, value }) => (
    <View style={styles.summaryRow}>
        <Text style={styles.summaryLabel}>{label}</Text>
        <Text style={styles.summaryValue}>{value}</Text>
    </View>
);

// ────────────────────────────────────────────────────────────────────
// STYLES
// ────────────────────────────────────────────────────────────────────
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
        alignItems: 'center',
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
    },
    headerEmoji: {
        fontSize: 36,
        marginBottom: 4,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: Colors.textLight,
        letterSpacing: 1,
    },
    headerSubtitle: {
        fontSize: 13,
        color: Colors.textLight,
        opacity: 0.85,
        marginTop: 2,
    },

    // Keyboard avoiding view
    keyboardView: {
        flex: 1,
    },

    // ScrollView
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 24,
    },

    // Step container
    stepContainer: {
        paddingHorizontal: 20,
        paddingTop: 20,
    },

    // Section header
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    sectionEmoji: {
        fontSize: 24,
        marginRight: 10,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: Colors.textPrimary,
    },

    // Card
    card: {
        backgroundColor: Colors.surface,
        borderRadius: 16,
        padding: 20,
        // Shadow (iOS)
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        // Elevation (Android)
        elevation: 3,
    },

    // Text inputs
    inputLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.textPrimary,
        marginBottom: 8,
    },
    textInput: {
        backgroundColor: Colors.background,
        borderWidth: 1.5,
        borderColor: Colors.border,
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 14,
        fontSize: 16,
        color: Colors.textPrimary,
        marginBottom: 18,
    },

    // Farm size row
    farmSizeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 18,
    },
    farmSizeInput: {
        flex: 1,
        marginBottom: 0,
        borderTopRightRadius: 0,
        borderBottomRightRadius: 0,
    },
    acresBadge: {
        backgroundColor: Colors.primary,
        paddingHorizontal: 16,
        paddingVertical: 15,
        borderTopRightRadius: 12,
        borderBottomRightRadius: 12,
        borderWidth: 1.5,
        borderLeftWidth: 0,
        borderColor: Colors.primary,
    },
    acresText: {
        fontSize: 15,
        fontWeight: '700',
        color: Colors.textLight,
    },

    // Navigation row
    navRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 14,
        borderTopWidth: 1,
        borderTopColor: Colors.border,
        backgroundColor: Colors.surface,
    },
    spacer: {
        flex: 1,
    },
    backButton: {
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 12,
        borderWidth: 1.5,
        borderColor: Colors.border,
        backgroundColor: Colors.surface,
    },
    backButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.textSecondary,
    },
    nextButton: {
        paddingVertical: 12,
        paddingHorizontal: 28,
        borderRadius: 12,
        backgroundColor: Colors.primary,
    },
    nextButtonText: {
        fontSize: 16,
        fontWeight: '700',
        color: Colors.textLight,
    },
    buttonDisabled: {
        opacity: 0.5,
    },

    // Finish button (Step 3)
    finishButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.primary,
        borderRadius: 16,
        paddingVertical: 16,
        marginTop: 24,
        // Shadow
        shadowColor: Colors.primaryDark,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
    },
    finishButtonEmoji: {
        fontSize: 22,
        marginRight: 10,
    },
    finishButtonText: {
        fontSize: 17,
        fontWeight: '700',
        color: Colors.textLight,
    },

    // Summary (Step 3)
    summaryHeading: {
        fontSize: 16,
        fontWeight: '700',
        color: Colors.primary,
        marginBottom: 10,
        marginTop: 4,
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 8,
    },
    summaryLabel: {
        fontSize: 15,
        color: Colors.textSecondary,
        flex: 1,
    },
    summaryValue: {
        fontSize: 15,
        fontWeight: '600',
        color: Colors.textPrimary,
        flex: 1,
        textAlign: 'right',
    },
    summaryDivider: {
        height: 1,
        backgroundColor: Colors.divider,
        marginVertical: 14,
    },
});

export default OnboardingScreen;
