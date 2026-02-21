/**
 * AppNavigator.tsx
 * Main navigation stack for Agrisaarthi.
 * Uses React Navigation's native-stack navigator.
 *
 * On first launch (no farmer profile in AsyncStorage),
 * shows Onboarding first. Otherwise goes directly to Home.
 */

import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Screens
import HomeScreen from '../screens/HomeScreen';
import OnboardingScreen from '../screens/OnboardingScreen';

// Constants
import Colors from '../constants/colors';

/**
 * Root stack parameter list.
 * Add new screens here as the app grows.
 */
export type RootStackParamList = {
    Onboarding: undefined;
    Home: undefined;
    // Future screens:
    // Weather: undefined;
    // CropDetails: { cropId: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

/**
 * AppNavigator
 * Checks AsyncStorage for an existing farmer profile.
 * If no profile exists → starts at Onboarding.
 * If profile exists → starts at Home.
 */
const AppNavigator: React.FC = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [hasProfile, setHasProfile] = useState(false);

    useEffect(() => {
        /** Check if a farmer profile already exists in AsyncStorage */
        const checkProfile = async () => {
            try {
                const profile = await AsyncStorage.getItem('farmer_profile');
                setHasProfile(profile !== null);
            } catch (error) {
                console.error('Error checking farmer profile:', error);
                setHasProfile(false);
            } finally {
                setIsLoading(false);
            }
        };

        checkProfile();
    }, []);

    // Show a loading spinner while checking AsyncStorage
    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={Colors.primary} />
            </View>
        );
    }

    return (
        <Stack.Navigator
            initialRouteName={hasProfile ? 'Home' : 'Onboarding'}
            screenOptions={{
                // Hide the default header — screens have their own styled headers
                headerShown: false,
                // Animation
                animation: 'slide_from_right',
                // Content background
                contentStyle: {
                    backgroundColor: Colors.background,
                },
            }}
        >
            <Stack.Screen
                name="Onboarding"
                component={OnboardingScreen}
                options={{ title: 'Get Started' }}
            />
            <Stack.Screen
                name="Home"
                component={HomeScreen}
                options={{ title: 'Agrisaarthi' }}
            />
        </Stack.Navigator>
    );
};

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.background,
    },
});

export default AppNavigator;
