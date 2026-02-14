import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ArrowLeft, Sprout } from 'lucide-react-native';
import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Alert, ImageBackground, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { RootStackParamList } from '../navigation/types';
import { authService } from '../services/authService';
import { useAuthStore } from '../store/authStore';
import { colors } from '../theme/colors';

const BG_IMAGE = require('../assets/login_bg.jpg');

export const LoginScreen = () => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const [step, setStep] = useState<'input' | 'otp'>('input');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [email, setEmail] = useState('');
    const [activeInput, setActiveInput] = useState<'phone' | 'email' | null>(null);
    const [otp, setOtp] = useState('');
    const [timer, setTimer] = useState(30);
    const [isLoading, setIsLoading] = useState(false);
    const setToken = useAuthStore((state) => state.setToken);
    const setUser = useAuthStore((state) => state.setUser);
    const otpInputRef = useRef<TextInput>(null);

    // Timer logic
    useEffect(() => {
        let interval: any;
        if (step === 'otp' && timer > 0) {
            interval = setInterval(() => setTimer((t) => t - 1), 1000);
        }
        return () => clearInterval(interval);
    }, [step, timer]);

    const handleContinue = async (otpOverride?: string) => {
        if (step === 'input') {
            // Determine which method to use
            let method = activeInput;
            
            // Auto-detect if user didn't explicitly focus but filled one
            if (!method) {
                if (phoneNumber && !email) method = 'phone';
                else if (email && !phoneNumber) method = 'email';
                else if (phoneNumber && email) {
                    // Default to phone if both filled? Or alert error?
                    // For now let's assume phone priority if ambiguous
                    method = 'phone'; 
                } else {
                    Alert.alert("Error", "Please enter a phone number or email address");
                    return;
                }
            } else {
                // If method is explicitly set by focus, validate that input
                if (method === 'phone' && !phoneNumber) {
                     Alert.alert("Error", "Please enter a phone number");
                     return;
                }
                if (method === 'email' && !email) {
                    Alert.alert("Error", "Please enter an email address");
                    return;
                }
            }
            
            try {
                if (method === 'phone') {
                    // Stripping any typed country code if necessary, but assuming clean input for now
                    await authService.sendOtp(phoneNumber, '+91', 2);
                } else {
                    await authService.sendOtp(email, '', 1);
                }
                
                setStep('otp');
                setTimer(30); // Reset timer
            } catch (error: any) {
                Alert.alert("Error", error.response?.data?.message || "Failed to send OTP");
            } finally {
                setIsLoading(false);
            }
        } else {
            // Verify OTP
            const otpValue = otpOverride ?? otp;
            if (!otpValue) {
                Alert.alert("Error", "Please enter OTP");
                return;
            }

            setIsLoading(true);
            try {
                let method = activeInput;
                if (!method) {
                     if (phoneNumber && !email) method = 'phone';
                     else if (email && !phoneNumber) method = 'email';
                     else method = 'phone';
                }
                const contact = method === 'phone' ? phoneNumber : email;

                const response = await authService.verifyOtp(contact, otpValue, method === 'phone' ? 2 : 1, method === 'phone' ? '+91' : '');
                
                if (response.token) {
                    setToken(response.token);
                    setUser(response.data);
                    navigation.reset({
                        index: 0,
                        routes: [{ name: 'Main' }],
                    });
                } else {
                     Alert.alert("Error", "Invalid response from server");
                }
            } catch (error: any) {
                Alert.alert("Error", error.response?.data?.message || "Invalid OTP");
            } finally {
                setIsLoading(false);
            }
        }
    };

    const handleBack = () => {
        setStep('input');
        setOtp('');
    };

    const handleResend = async () => {
        if (timer > 0) return;
        setIsLoading(true);
        try {
            let method = activeInput;
            if (!method) {
                    if (phoneNumber && !email) method = 'phone';
                    else if (email && !phoneNumber) method = 'email';
                    else method = 'phone';
            }
            
            if (method === 'phone') {
                await authService.sendOtp(phoneNumber, '+91', 2);
            } else {
                await authService.sendOtp(email, '', 1);
            }

            setTimer(30);
            Alert.alert("Success", "OTP resent successfully");
        } catch (error: any) {
             Alert.alert("Error", error.response?.data?.message || "Failed to resend OTP");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <View className="flex-1 bg-black">
            {/* Background Image Section */}
            <View className="flex-1">
                <ImageBackground 
                    source={BG_IMAGE} 
                    className="flex-1 justify-start"
                    resizeMode="cover"
                >
                    {/* Optional: Add a gradient overlay if text readability on top is an issue, 
                        but design shows clean image. Status bar area might need handling. */}
                </ImageBackground>
            </View>

            {/* Bottom Sheet Content */}
            <View 
                className="h-full absolute bottom-0 w-full justify-end"
                pointerEvents="box-none"
            >
                 <KeyboardAvoidingView 
                    behavior={Platform.OS === "ios" ? "padding" : "height"} 
                    className="w-full"
                >
                    <View className="bg-[#FFFFF0] rounded-t-[32px] px-8 pt-10 pb-12 w-full h-auto min-h-[60%] justify-end">
                       
                        {/* Back Button (OTP Mode) */}
                        {step === 'otp' && (
                            <TouchableOpacity 
                                onPress={handleBack}
                                className="absolute top-6 left-6 z-10 p-2"
                            >
                                <ArrowLeft size={24} color={colors['text-primary']} />
                            </TouchableOpacity>
                        )}

                        <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled" contentContainerStyle={{ paddingBottom: 20 }}>
                            {/* Logo & Header */}
                            <View className="items-center mb-8">
                                <View className="flex-row items-center gap-2 mb-6">
                                    <Sprout size={32} color={colors.primary} />
                                    <Text className="text-text-primary text-2xl font-bold tracking-widest font-modern">FLAHY</Text>
                                </View>
                                
                                {step === 'input' ? (
                                    <>
                                        <Text className="text-text-primary text-2xl font-medium text-center">Welcome to Dashboard</Text>
                                        <Text className="text-text-secondary mt-2 text-base">Log in to your account</Text>
                                    </>
                                ) : (
                                    <>
                                        <Text className="text-text-primary text-2xl font-medium text-center">Verification</Text>
                                        <Text className="text-text-secondary mt-2 text-base text-center px-4">
                                            Enter the code sent to your device
                                        </Text>
                                    </>
                                )}
                            </View>

                            {step === 'input' ? (
                                <View className="gap-6">
                                    {/* Phone Input */}
                                    <View>
                                        <Text className="text-text-primary font-medium mb-2">Phone Number</Text>
                                        <View className={`flex-row border rounded-xl overflow-hidden h-14 bg-white items-center ${activeInput === 'phone' ? 'border-primary' : 'border-gray-300'}`}>
                                            <View className="bg-gray-50 border-r border-gray-200 h-full justify-center px-4 flex-row items-center gap-1">
                                                <Text className="text-text-primary font-medium">+91</Text>
                                                <Text className="text-[10px] text-text-secondary">▼</Text>
                                            </View>
                                            <TextInput
                                                style={{ flex: 1, paddingHorizontal: 16, color: colors['text-primary'], fontSize: 16, padding: 0 }}
                                                placeholder="123456789"
                                                placeholderTextColor="#A0A0A0"
                                                keyboardType="phone-pad"
                                                returnKeyType="done"
                                                onSubmitEditing={() => handleContinue()}
                                                value={phoneNumber}
                                                onChangeText={(text) => {
                                                    setPhoneNumber(text);
                                                    if (text) setActiveInput('phone');
                                                }}
                                                onFocus={() => {
                                                    setActiveInput('phone');
                                                }}
                                            />
                                        </View>
                                    </View>

                                    {/* Divider */}
                                    <View className="flex-row items-center gap-4 py-2">
                                        <View className="h-[1px] bg-gray-300 flex-1" />
                                        <Text className="text-text-secondary">Or continue with:</Text>
                                        <View className="h-[1px] bg-gray-300 flex-1" />
                                    </View>

                                    {/* Email Input */}
                                    <View>
                                        <Text className="text-text-primary font-medium mb-2">Email address</Text>
                                        <View className={`border rounded-xl overflow-hidden h-14 bg-white items-center flex-row ${activeInput === 'email' ? 'border-primary' : 'border-gray-300'}`}>
                                            <TextInput
                                                style={{ flex: 1, paddingHorizontal: 16, color: colors['text-primary'], fontSize: 16, padding: 0 }}
                                                placeholder="john.carter@gmail.com"
                                                placeholderTextColor="#A0A0A0"
                                                keyboardType="email-address"
                                                autoCapitalize="none"
                                                returnKeyType="done"
                                                onSubmitEditing={() => handleContinue()}
                                                value={email}
                                                onChangeText={(text) => {
                                                    setEmail(text);
                                                    if (text) setActiveInput('email');
                                                }}
                                                onFocus={() => {
                                                    setActiveInput('email');
                                                }}
                                            />
                                        </View>
                                    </View>
                                </View>
                            ) : (
                                /* OTP Input — 6 individual boxes */
                                <View style={{ marginBottom: 32 }}>
                                    {/* Hidden TextInput captures keyboard */}
                                    <TextInput
                                        ref={otpInputRef}
                                        value={otp}
                                        onChangeText={(text) => {
                                            const cleaned = text.replace(/[^0-9]/g, '');
                                            setOtp(cleaned);
                                            if (cleaned.length === 6) {
                                                handleContinue(cleaned);
                                            }
                                        }}
                                        keyboardType="number-pad"
                                        returnKeyType="done"
                                        onSubmitEditing={handleContinue}
                                        maxLength={6}
                                        autoFocus
                                        style={{ position: 'absolute', opacity: 0, height: 0, width: 0 }}
                                    />

                                    {/* Visual OTP boxes */}
                                    <Pressable
                                        onPress={() => otpInputRef.current?.focus()}
                                        style={otpStyles.boxRow}
                                    >
                                        {Array.from({ length: 6 }).map((_, i) => {
                                            const digit = otp[i] || '';
                                            const isFocused = otp.length === i;
                                            return (
                                                <View
                                                    key={i}
                                                    style={[
                                                        otpStyles.box,
                                                        isFocused && otpStyles.boxFocused,
                                                        digit ? otpStyles.boxFilled : null,
                                                    ]}
                                                >
                                                    <Text style={[otpStyles.digit, !digit && otpStyles.placeholder]}>
                                                        {digit || '0'}
                                                    </Text>
                                                </View>
                                            );
                                        })}
                                    </Pressable>

                                    {/* Resend */}
                                    <TouchableOpacity
                                        onPress={handleResend}
                                        disabled={timer > 0 || isLoading}
                                        style={{ alignItems: 'center', marginTop: 24 }}
                                    >
                                        <Text style={{ fontWeight: '500', fontSize: 14, color: timer > 0 ? colors['text-secondary'] : colors.primary }}>
                                            {timer > 0 ? `Resend OTP in ${timer}s` : 'Resend OTP'}
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                            
                            {/* Continue Button */}
                            <TouchableOpacity 
                                onPress={handleContinue}
                                disabled={isLoading}
                                className="h-14 bg-[#2CAEA6] rounded-xl items-center justify-center mt-8 active:opacity-90"
                            >
                                {isLoading ? (
                                    <ActivityIndicator color="white" />
                                ) : (
                                    <Text className="text-white font-semibold text-lg">Continue</Text>
                                )}
                            </TouchableOpacity>

                        </ScrollView>
                    </View>
                 </KeyboardAvoidingView>
            </View>
        </View>
    );
};

const otpStyles = StyleSheet.create({
    boxRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 10,
    },
    box: {
        width: 48,
        height: 56,
        borderRadius: 12,
        borderWidth: 1.5,
        borderColor: '#E5E7EB',
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
    },
    boxFocused: {
        borderColor: colors.teal,
        borderWidth: 2,
    },
    boxFilled: {
        borderColor: colors.primary,
        backgroundColor: colors['green-light'],
    },
    digit: {
        fontSize: 24,
        fontWeight: '700',
        color: colors['text-primary'],
    },
    placeholder: {
        color: '#D1D5DB',
        fontWeight: '400',
    },
});
