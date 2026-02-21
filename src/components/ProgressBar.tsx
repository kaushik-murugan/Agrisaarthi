/**
 * ProgressBar.tsx
 * Displays a segmented progress indicator for multi-step forms.
 * Shows "Step X of Y" text and a visual bar with filled/unfilled segments.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Colors from '../constants/colors';

interface ProgressBarProps {
    /** Current step number (1-indexed) */
    currentStep: number;
    /** Total number of steps */
    totalSteps: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ currentStep, totalSteps }) => {
    return (
        <View style={styles.container}>
            {/* Step label */}
            <Text style={styles.stepText}>
                Step {currentStep} of {totalSteps}
            </Text>

            {/* Segmented bar */}
            <View style={styles.barContainer}>
                {Array.from({ length: totalSteps }, (_, index) => (
                    <View
                        key={index}
                        style={[
                            styles.segment,
                            index < currentStep ? styles.segmentFilled : styles.segmentEmpty,
                            // Remove right margin on last segment
                            index === totalSteps - 1 && { marginRight: 0 },
                        ]}
                    />
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 20,
        paddingVertical: 16,
        backgroundColor: Colors.surface,
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
    },
    stepText: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.primary,
        marginBottom: 10,
        textAlign: 'center',
    },
    barContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    segment: {
        flex: 1,
        height: 6,
        borderRadius: 3,
        marginRight: 6,
    },
    segmentFilled: {
        backgroundColor: Colors.primary,
    },
    segmentEmpty: {
        backgroundColor: Colors.border,
    },
});

export default ProgressBar;
