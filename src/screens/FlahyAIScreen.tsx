import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { WebView } from 'react-native-webview';
import { Header } from '../components/Header';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { colors } from '../theme/colors';

/*
import { Bot, FileText, Send, Sparkles, Zap } from 'lucide-react-native';
import { FlatList, KeyboardAvoidingView, Platform, Text, TextInput, TouchableOpacity } from 'react-native';

const OPENAI_API_KEY = 'sk-abcdef1234567890abcdef1234567890abcdef12'; // User provided key

type Message = {
    id: string;
    role: 'user' | 'assistant';
    content: string;
};

const SUGGESTIONS = [
    { id: '1', text: "Analyze my latest report", icon: FileText },
    { id: '2', text: "What's in my recent uploads?", icon: Zap },
];
*/

export const FlahyAIScreen = () => {
    const navigation = useNavigation();
    /*
    const [messages, setMessages] = useState<Message[]>([
        { id: '1', role: 'assistant', content: 'Hello! I am FlahyAI. How can I help you today?' }
    ]);
    const [inputText, setInputText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const flatListRef = useRef<FlatList>(null);

    const sendMessage = async (text: string = inputText) => {
        const msgText = text.trim();
        if (!msgText || isLoading) return;

        const userMsg: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: msgText,
        };

        setMessages(prev => [...prev, userMsg]);
        setInputText('');
        setIsLoading(true);

        try {
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${OPENAI_API_KEY}`,
                },
                body: JSON.stringify({
                    model: 'gpt-3.5-turbo',
                    messages: [
                        { role: 'system', content: 'You are a helpful AI assistant for the Flahy app.' },
                        ...messages.map(m => ({ role: m.role, content: m.content })),
                        { role: 'user', content: msgText }
                    ],
                }),
            });

            const data = await response.json();

            if (data.error) {
                console.error('OpenAI Error:', data.error);
                const errorMsg: Message = {
                    id: Date.now().toString(),
                    role: 'assistant',
                    content: `Error: ${data.error.message || 'Something went wrong.'}`
                };
                setMessages(prev => [...prev, errorMsg]);
            } else if (data.choices && data.choices.length > 0) {
                const aiMsg: Message = {
                    id: Date.now().toString(),
                    role: 'assistant',
                    content: data.choices[0].message.content.trim(),
                };
                setMessages(prev => [...prev, aiMsg]);
            }
        } catch (error) {
            console.error('Network Error:', error);
             const errorMsg: Message = {
                id: Date.now().toString(),
                role: 'assistant',
                content: 'Sorry, I am having trouble connecting to the server.'
            };
            setMessages(prev => [...prev, errorMsg]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSuggestionPress = (text: string) => {
        sendMessage(text);
    };
    */
    
    // Webview loading state
    const [isLoadingWeb, setIsLoadingWeb] = useState(true);

    return (
        <ScreenWrapper className="flex-1 bg-background" edges={['top', 'bottom']}>
            <Header showBack={true} onBack={() => navigation.goBack()} />
            <View className="flex-1 bg-white relative">
                {isLoadingWeb && (
                    <View className="absolute inset-0 items-center justify-center z-10 bg-white">
                        <ActivityIndicator size="large" color={colors.primary} />
                    </View>
                )}
                <WebView 
                    source={{ uri: 'https://flahyhealth.com/flahy-ai?reportId=9a8ebc5d-2924-408c-a8f8-5c2ad317443a' }}
                    style={{ flex: 1 }}
                    onLoadEnd={() => setIsLoadingWeb(false)}
                    onError={(syntheticEvent) => {
                        const { nativeEvent } = syntheticEvent;
                        console.warn('WebView error: ', nativeEvent);
                    }}
                    onHttpError={(syntheticEvent) => {
                        const { nativeEvent } = syntheticEvent;
                        console.warn('WebView HttpError: ', nativeEvent);
                    }}
                    startInLoadingState={true}
                    bounces={false}
                    javaScriptEnabled={true}
                    domStorageEnabled={true}
                    thirdPartyCookiesEnabled={true}
                    mixedContentMode="always"
                    originWhitelist={['*']}
                    scalesPageToFit={true}
                    keyboardShouldPersistTaps="handled"
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                    overScrollMode="never"
                    renderLoading={() => <View className="absolute inset-0 items-center justify-center bg-white"><ActivityIndicator size="large" color={colors.primary} /></View>}
                />
            </View>
            {/*
            <KeyboardAvoidingView 
                behavior={Platform.OS === "ios" ? "padding" : undefined} 
                keyboardVerticalOffset={Platform.OS === "ios" ? 10 : 0}
                className="flex-1"
            >
                <View className="flex-1 px-4">
                    <FlatList
                        ref={flatListRef}
                        data={messages}
                        keyExtractor={item => item.id}
                        contentContainerStyle={{ paddingTop: 20, paddingBottom: 100 }}
                        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
                        ListFooterComponent={
                             // Show suggestions only if very few messages exist (initial state)
                             messages.length < 3 ? (
                                <View className="mt-6">
                                    <Text className="text-text-secondary text-sm mb-3 ml-1 font-medium">Suggestions</Text>
                                    <View className="flex-row gap-2 flex-wrap">
                                        {SUGGESTIONS.map(s => (
                                            <TouchableOpacity 
                                                key={s.id} 
                                                onPress={() => handleSuggestionPress(s.text)}
                                                className="bg-white border border-gray-100 px-4 py-2 rounded-full shadow-sm flex-row items-center gap-2"
                                            >
                                                <s.icon size={14} color={colors.primary} />
                                                <Text className="text-primary text-sm font-medium">{s.text}</Text>
                                            </TouchableOpacity>
                                        ))}
                                    </View>
                                </View>
                            ) : null
                        }
                        renderItem={({ item }) => (
                            <View className={`flex-row mb-4 ${item.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                {item.role === 'assistant' && (
                                    <View className="w-8 h-8 rounded-full bg-white shadow-sm items-center justify-center mr-2 border border-gray-100">
                                        <Bot size={16} color={colors.primary} />
                                    </View>
                                )}
                                <View 
                                    className={`px-5 py-3.5 max-w-[80%] shadow-sm ${
                                        item.role === 'user' 
                                            ? 'bg-primary rounded-2xl rounded-tr-sm' 
                                            : 'bg-white border border-gray-100 rounded-2xl rounded-tl-sm'
                                    }`}
                                >
                                    <Text className={`text-base leading-6 ${item.role === 'user' ? 'text-white' : 'text-text-primary'}`}>
                                        {item.content}
                                    </Text>
                                </View>
                            </View>
                        )}
                    />
                </View>

                // Floating Input Area
                <View className="px-4 pb-2 bg-transparent">
                    <View className="flex-row items-end gap-3 bg-white p-2 rounded-[2rem] shadow-lg border border-gray-100 mb-2">
                         <View className="w-10 h-10 rounded-full bg-gray-50 items-center justify-center">
                            <Sparkles size={20} color={colors['text-secondary']} />
                         </View>

                        <View className="flex-1 py-2 justify-center">
                            <TextInput
                                value={inputText}
                                onChangeText={setInputText}
                                placeholder="Message FlahyAI..."
                                placeholderTextColor={colors['text-secondary']}
                                className="text-text-primary text-base max-h-24 p-0"
                                textAlignVertical="top"
                                multiline
                            />
                        </View>
                        <TouchableOpacity 
                            onPress={() => sendMessage()}
                            disabled={isLoading}
                            className={`w-10 h-10 rounded-full items-center justify-center mb-0.5 ${
                                isLoading || !inputText.trim() ? 'bg-gray-100' : 'bg-primary shadow-md shadow-primary/30'
                            }`}
                        >
                            {isLoading ? (
                                <ActivityIndicator color={colors.primary} size="small" />
                            ) : (
                                <Send size={18} color={!inputText.trim() ? colors['text-secondary'] : 'white'} className={!inputText.trim() ? '' : 'ml-0.5'} />
                            )}
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>
            */}
        </ScreenWrapper>
    );
};
