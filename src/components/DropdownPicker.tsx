/**
 * DropdownPicker.tsx
 * A custom dropdown component using Modal + FlatList.
 * No external UI libraries — uses only React Native built-ins.
 * Styled with the Agrisaarthi green theme.
 */

import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Modal,
    FlatList,
    StyleSheet,
} from 'react-native';
import Colors from '../constants/colors';

interface DropdownPickerProps {
    /** Label shown above the dropdown */
    label: string;
    /** Array of option strings */
    options: string[];
    /** Currently selected value */
    selectedValue: string;
    /** Callback when user picks an option */
    onValueChange: (value: string) => void;
    /** Placeholder text when nothing is selected */
    placeholder?: string;
}

const DropdownPicker: React.FC<DropdownPickerProps> = ({
    label,
    options,
    selectedValue,
    onValueChange,
    placeholder = 'Select an option',
}) => {
    const [isOpen, setIsOpen] = useState(false);

    /** Handle option selection */
    const handleSelect = (value: string) => {
        onValueChange(value);
        setIsOpen(false);
    };

    return (
        <View style={styles.container}>
            {/* Label */}
            <Text style={styles.label}>{label}</Text>

            {/* Trigger button */}
            <TouchableOpacity
                style={[styles.trigger, isOpen && styles.triggerActive]}
                onPress={() => setIsOpen(true)}
                activeOpacity={0.7}
            >
                <Text
                    style={[
                        styles.triggerText,
                        !selectedValue && styles.placeholderText,
                    ]}
                >
                    {selectedValue || placeholder}
                </Text>
                <Text style={styles.arrow}>{isOpen ? '▲' : '▼'}</Text>
            </TouchableOpacity>

            {/* Dropdown modal */}
            <Modal
                visible={isOpen}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setIsOpen(false)}
            >
                <TouchableOpacity
                    style={styles.overlay}
                    activeOpacity={1}
                    onPress={() => setIsOpen(false)}
                >
                    <View style={styles.dropdown}>
                        {/* Dropdown header */}
                        <View style={styles.dropdownHeader}>
                            <Text style={styles.dropdownTitle}>{label}</Text>
                        </View>

                        {/* Options list */}
                        <FlatList
                            data={options}
                            keyExtractor={(item) => item}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={[
                                        styles.option,
                                        item === selectedValue && styles.optionSelected,
                                    ]}
                                    onPress={() => handleSelect(item)}
                                    activeOpacity={0.6}
                                >
                                    <Text
                                        style={[
                                            styles.optionText,
                                            item === selectedValue && styles.optionTextSelected,
                                        ]}
                                    >
                                        {item}
                                    </Text>
                                    {item === selectedValue && (
                                        <Text style={styles.checkmark}>✓</Text>
                                    )}
                                </TouchableOpacity>
                            )}
                            ItemSeparatorComponent={() => <View style={styles.separator} />}
                        />
                    </View>
                </TouchableOpacity>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 18,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.textPrimary,
        marginBottom: 8,
    },
    trigger: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: Colors.surface,
        borderWidth: 1.5,
        borderColor: Colors.border,
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 14,
    },
    triggerActive: {
        borderColor: Colors.primary,
    },
    triggerText: {
        fontSize: 16,
        color: Colors.textPrimary,
        flex: 1,
    },
    placeholderText: {
        color: Colors.textMuted,
    },
    arrow: {
        fontSize: 12,
        color: Colors.textMuted,
        marginLeft: 8,
    },

    // Modal overlay
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 30,
    },

    // Dropdown card
    dropdown: {
        backgroundColor: Colors.surface,
        borderRadius: 16,
        width: '100%',
        maxHeight: 400,
        overflow: 'hidden',
        // Shadow
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 8,
    },
    dropdownHeader: {
        backgroundColor: Colors.primary,
        paddingVertical: 14,
        paddingHorizontal: 20,
    },
    dropdownTitle: {
        fontSize: 17,
        fontWeight: '700',
        color: Colors.textLight,
    },

    // Option items
    option: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 14,
        paddingHorizontal: 20,
    },
    optionSelected: {
        backgroundColor: Colors.background,
    },
    optionText: {
        fontSize: 16,
        color: Colors.textPrimary,
    },
    optionTextSelected: {
        color: Colors.primary,
        fontWeight: '700',
    },
    checkmark: {
        fontSize: 18,
        color: Colors.primary,
        fontWeight: 'bold',
    },
    separator: {
        height: 1,
        backgroundColor: Colors.divider,
        marginHorizontal: 16,
    },
});

export default DropdownPicker;
