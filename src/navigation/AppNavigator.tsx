/**
 * AppNavigator.tsx
 * Main navigation stack for Agrisaarthi.
 * Uses React Navigation's native-stack navigator.
 */

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Screens
import HomeScreen from '../screens/HomeScreen';

// Constants
import Colors from '../constants/colors';

/**
 * Root stack parameter list.
 * Add new screens here as the app grows.
 */
export type RootStackParamList = {
    Home: undefined;
    // Future screens:
    // Weather: undefined;
    // CropDetails: { cropId: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

/**
 * AppNavigator
 * Configures the app-wide stack navigation with
 * a green-themed header matching the Agrisaarthi brand.
 */
const AppNavigator: React.FC = () => {
    return (
        <Stack.Navigator
            initialRouteName="Home"
            screenOptions={{
                // Hide the default header — HomeScreen has its own styled header
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
                name="Home"
                component={HomeScreen}
                options={{ title: 'Agrisaarthi' }}
            />
        </Stack.Navigator>
    );
};

export default AppNavigator;
