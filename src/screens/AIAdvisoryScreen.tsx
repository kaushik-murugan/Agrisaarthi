/**
 * AIAdvisoryScreen.tsx
 * Chat-style AI farming advisor powered by Gemini.
 *
 * Features:
 *   - Context-aware advice using farmer profile + live weather
 *   - Quick question buttons for common farming queries
 *   - Chat bubble UI with typing indicator
 *   - Timestamps on every message
 *   - Auto-scroll to latest message
 */

import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    StatusBar,
    Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';

import { getAIAdvice } from '../services/aiService';
import { getCurrentWeather, type WeatherData } from '../services/weatherService';
import { useTranslation } from '../hooks/useTranslation';
import Colors from '../constants/colors';
import type { FarmerProfile } from '../types/farmer';

// ── Types ──────────────────────────────────────────────────────────────

interface ChatMessage {
    id: string;
    text: string;
    sender: 'farmer' | 'ai';
    timestamp: Date;
}

// ── Quick question presets ─────────────────────────────────────────────

const QUICK_QUESTIONS = [
    { text: 'Should I irrigate today? 💧', key: 'quickIrrigate' },
    { text: 'Any pest risk this week? 🐛', key: 'quickPest' },
    { text: 'What fertilizer should I use? 🌱', key: 'quickFertilizer' },
    { text: 'Is this weather good for my crop? 🌤️', key: 'quickWeather' },
    { text: 'What should I do today on my farm? 📋', key: 'quickToday' },
];

// ── Typing Indicator ───────────────────────────────────────────────────

const TypingIndicator: React.FC = () => {
    const dot1 = useRef(new Animated.Value(0)).current;
    const dot2 = useRef(new Animated.Value(0)).current;
    const dot3 = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const animateDot = (dot: Animated.Value, delay: number) =>
            Animated.loop(
                Animated.sequence([
                    Animated.delay(delay),
                    Animated.timing(dot, {
                        toValue: -8,
                        duration: 300,
                        useNativeDriver: true,
                    }),
                    Animated.timing(dot, {
                        toValue: 0,
                        duration: 300,
                        useNativeDriver: true,
                    }),
                ]),
            );

        const a1 = animateDot(dot1, 0);
        const a2 = animateDot(dot2, 150);
        const a3 = animateDot(dot3, 300);

        a1.start();
        a2.start();
        a3.start();

        return () => {
            a1.stop();
            a2.stop();
            a3.stop();
        };
    }, [dot1, dot2, dot3]);

    return (
        <View style={styles.typingRow}>
            <View style={styles.aiBubble}>
                <Text style={styles.aiAvatar}>🌾</Text>
                <View style={styles.typingDots}>
                    {[dot1, dot2, dot3].map((dot, i) => (
                        <Animated.View
                            key={i}
                            style={[
                                styles.dot,
                                { transform: [{ translateY: dot }] },
                            ]}
                        />
                    ))}
                </View>
            </View>
        </View>
    );
};

// ── Component ──────────────────────────────────────────────────────────

const AIAdvisoryScreen: React.FC = () => {
    const navigation =
        useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const { t } = useTranslation();

    // State
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [inputText, setInputText] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [profile, setProfile] = useState<FarmerProfile | null>(null);
    const [weather, setWeather] = useState<WeatherData | null>(null);
    const [showQuickQuestions, setShowQuickQuestions] = useState(true);

    // Refs
    const scrollViewRef = useRef<ScrollView>(null);

    // ── Format timestamp ──────────────────────────────────────────

    const formatTime = (date: Date): string => {
        return date.toLocaleTimeString('en-IN', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
        });
    };

    // ── Scroll to bottom ──────────────────────────────────────────

    const scrollToBottom = useCallback(() => {
        setTimeout(() => {
            scrollViewRef.current?.scrollToEnd({ animated: true });
        }, 100);
    }, []);

    // ── Load profile + weather, show welcome ──────────────────────

    useEffect(() => {
        const init = async () => {
            try {
                // Load farmer profile
                const raw = await AsyncStorage.getItem('farmer_profile');
                let farmerProfile: FarmerProfile | null = null;
                if (raw) {
                    farmerProfile = JSON.parse(raw);
                    setProfile(farmerProfile);
                }

                // Fetch current weather
                const loc = farmerProfile?.village ?? 'Delhi';
                const currentWeather = await getCurrentWeather(loc);
                setWeather(currentWeather);

                // Show welcome message
                const name = farmerProfile?.fullName ?? 'Farmer';
                const crop = farmerProfile?.primaryCrop ?? 'Crop';
                const location = farmerProfile?.village ?? 'your area';

                const welcomeMsg: ChatMessage = {
                    id: `ai_${Date.now()}`,
                    text: t('welcomeMessage', { name, crop, location }),
                    sender: 'ai',
                    timestamp: new Date(),
                };
                setMessages([welcomeMsg]);
            } catch (error) {
                console.error(
                    '[AIAdvisoryScreen] Init error:',
                    error,
                );
            }
        };

        init();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // ── Send message ──────────────────────────────────────────────

    const handleSend = useCallback(
        async (text?: string) => {
            const question = (text ?? inputText).trim();
            if (!question) return;

            // Hide quick questions once conversation starts
            setShowQuickQuestions(false);

            // Add farmer message
            const farmerMsg: ChatMessage = {
                id: `farmer_${Date.now()}`,
                text: question,
                sender: 'farmer',
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, farmerMsg]);
            setInputText('');
            setIsTyping(true);
            scrollToBottom();

            // Get AI response
            const defaultProfile: FarmerProfile = {
                fullName: 'Farmer',
                village: 'Delhi',
                preferredLanguage: 'English',
                primaryCrop: 'Wheat',
                soilType: 'Loamy',
                farmSize: '5',
                irrigationType: 'Rainfed',
                createdAt: new Date().toISOString(),
            };

            const aiResponse = await getAIAdvice(
                question,
                profile ?? defaultProfile,
                weather,
            );

            const aiMsg: ChatMessage = {
                id: `ai_${Date.now()}`,
                text: aiResponse,
                sender: 'ai',
                timestamp: new Date(),
            };

            setMessages((prev) => [...prev, aiMsg]);
            setIsTyping(false);
            scrollToBottom();
        },
        [inputText, profile, weather, scrollToBottom],
    );

    // ── Quick question handler ────────────────────────────────────

    const handleQuickQuestion = useCallback(
        (question: string) => {
            handleSend(question);
        },
        [handleSend],
    );

    // ── Render ─────────────────────────────────────────────────────

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar
                barStyle="light-content"
                backgroundColor={Colors.primary}
            />

            {/* ── Header ─────────────────────────────────────── */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                    activeOpacity={0.7}
                >
                    <Text style={styles.backText}>← {t('back')}</Text>
                </TouchableOpacity>
                <View style={styles.headerTitleRow}>
                    <Text style={styles.headerEmoji}>🤖</Text>
                    <Text style={styles.headerTitle}>
                        {t('aiAdvisor')}
                    </Text>
                </View>
                <Text style={styles.headerSubtitle}>
                    {t('quickQuestions')}
                </Text>
            </View>

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                style={styles.chatArea}
                keyboardVerticalOffset={0}
            >
                {/* ── Messages ───────────────────────────────── */}
                <ScrollView
                    ref={scrollViewRef}
                    style={styles.messagesList}
                    contentContainerStyle={styles.messagesContent}
                    showsVerticalScrollIndicator={false}
                    onContentSizeChange={scrollToBottom}
                >
                    {/* Quick question buttons (shown at start) */}
                    {showQuickQuestions && (
                        <View style={styles.quickQuestionsContainer}>
                            <Text style={styles.quickQuestionsLabel}>
                                💡 {t('quickQuestions')}
                            </Text>
                            {QUICK_QUESTIONS.map((q) => (
                                <TouchableOpacity
                                    key={q.key}
                                    style={styles.quickButton}
                                    onPress={() =>
                                        handleQuickQuestion(q.text)
                                    }
                                    activeOpacity={0.7}
                                >
                                    <Text style={styles.quickButtonText}>
                                        {q.text}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    )}

                    {/* Chat bubbles */}
                    {messages.map((msg) => (
                        <View
                            key={msg.id}
                            style={[
                                styles.messageRow,
                                msg.sender === 'farmer'
                                    ? styles.farmerRow
                                    : styles.aiRow,
                            ]}
                        >
                            {msg.sender === 'ai' && (
                                <Text style={styles.aiAvatar}>🌾</Text>
                            )}
                            <View
                                style={[
                                    styles.messageBubble,
                                    msg.sender === 'farmer'
                                        ? styles.farmerBubble
                                        : styles.aiBubbleStyle,
                                ]}
                            >
                                <Text
                                    style={[
                                        styles.messageText,
                                        msg.sender === 'farmer'
                                            ? styles.farmerText
                                            : styles.aiText,
                                    ]}
                                >
                                    {msg.text}
                                </Text>
                                <Text
                                    style={[
                                        styles.timestamp,
                                        msg.sender === 'farmer'
                                            ? styles.farmerTimestamp
                                            : styles.aiTimestamp,
                                    ]}
                                >
                                    {formatTime(msg.timestamp)}
                                </Text>
                            </View>
                        </View>
                    ))}

                    {/* Typing indicator */}
                    {isTyping && <TypingIndicator />}

                    {/* Bottom spacer */}
                    <View style={{ height: 8 }} />
                </ScrollView>

                {/* ── Input bar ──────────────────────────────── */}
                <View style={styles.inputBar}>
                    <TextInput
                        style={styles.textInput}
                        value={inputText}
                        onChangeText={setInputText}
                        placeholder={t('typeQuestion')}
                        placeholderTextColor={Colors.textMuted}
                        multiline
                        maxLength={500}
                        returnKeyType="send"
                        onSubmitEditing={() => handleSend()}
                        blurOnSubmit={false}
                    />
                    <TouchableOpacity
                        style={[
                            styles.sendButton,
                            !inputText.trim() && styles.sendButtonDisabled,
                        ]}
                        onPress={() => handleSend()}
                        activeOpacity={0.7}
                        disabled={!inputText.trim()}
                    >
                        <Text style={styles.sendIcon}>➤</Text>
                    </TouchableOpacity>
                </View>
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
        paddingVertical: 16,
        paddingHorizontal: 24,
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
    },
    backButton: {
        marginBottom: 6,
    },
    backText: {
        fontSize: 15,
        color: Colors.textLight,
        opacity: 0.9,
    },
    headerTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    headerEmoji: {
        fontSize: 28,
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: Colors.textLight,
        letterSpacing: 0.5,
    },
    headerSubtitle: {
        fontSize: 13,
        color: Colors.textLight,
        opacity: 0.8,
        marginTop: 4,
    },

    // Chat area
    chatArea: {
        flex: 1,
    },
    messagesList: {
        flex: 1,
    },
    messagesContent: {
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 8,
    },

    // Quick questions
    quickQuestionsContainer: {
        marginBottom: 16,
    },
    quickQuestionsLabel: {
        fontSize: 15,
        fontWeight: '600',
        color: Colors.textSecondary,
        marginBottom: 10,
    },
    quickButton: {
        borderWidth: 1.5,
        borderColor: Colors.primary,
        borderRadius: 20,
        paddingVertical: 12,
        paddingHorizontal: 18,
        marginBottom: 8,
        backgroundColor: Colors.surface,
    },
    quickButtonText: {
        fontSize: 15,
        color: Colors.primary,
        fontWeight: '600',
    },

    // Message rows
    messageRow: {
        flexDirection: 'row',
        marginBottom: 12,
        alignItems: 'flex-end',
    },
    farmerRow: {
        justifyContent: 'flex-end',
    },
    aiRow: {
        justifyContent: 'flex-start',
    },

    // Bubbles
    messageBubble: {
        maxWidth: '78%',
        borderRadius: 18,
        paddingHorizontal: 16,
        paddingVertical: 12,
        // Shadow
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.06,
        shadowRadius: 4,
        elevation: 2,
    },
    farmerBubble: {
        backgroundColor: Colors.primary,
        borderBottomRightRadius: 4,
    },
    aiBubbleStyle: {
        backgroundColor: '#F0F8F0',
        borderBottomLeftRadius: 4,
        marginLeft: 4,
    },

    // Message text
    messageText: {
        fontSize: 15,
        lineHeight: 22,
    },
    farmerText: {
        color: Colors.textLight,
    },
    aiText: {
        color: Colors.textPrimary,
    },

    // Timestamps
    timestamp: {
        fontSize: 10,
        marginTop: 6,
    },
    farmerTimestamp: {
        color: 'rgba(255,255,255,0.65)',
        textAlign: 'right',
    },
    aiTimestamp: {
        color: Colors.textMuted,
    },

    // AI avatar
    aiAvatar: {
        fontSize: 24,
        marginRight: 4,
        marginBottom: 2,
    },

    // Typing indicator
    typingRow: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        marginBottom: 12,
    },
    aiBubble: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F0F8F0',
        borderRadius: 18,
        borderBottomLeftRadius: 4,
        paddingHorizontal: 16,
        paddingVertical: 14,
        marginLeft: 4,
    },
    typingDots: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        marginLeft: 4,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: Colors.primary,
        opacity: 0.6,
    },

    // Input bar
    inputBar: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        paddingHorizontal: 12,
        paddingVertical: 10,
        borderTopWidth: 1,
        borderTopColor: Colors.divider,
        backgroundColor: Colors.surface,
    },
    textInput: {
        flex: 1,
        backgroundColor: Colors.background,
        borderRadius: 24,
        paddingHorizontal: 18,
        paddingVertical: 12,
        fontSize: 15,
        color: Colors.textPrimary,
        maxHeight: 100,
        borderWidth: 1,
        borderColor: Colors.border,
    },
    sendButton: {
        width: 46,
        height: 46,
        borderRadius: 23,
        backgroundColor: Colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 10,
        // Shadow
        shadowColor: Colors.primaryDark,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 4,
    },
    sendButtonDisabled: {
        backgroundColor: '#B0BEC5',
        shadowOpacity: 0,
        elevation: 0,
    },
    sendIcon: {
        fontSize: 20,
        color: Colors.textLight,
        fontWeight: 'bold',
    },
});

export default AIAdvisoryScreen;
