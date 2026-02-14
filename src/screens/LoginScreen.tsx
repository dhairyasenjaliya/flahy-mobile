import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ArrowLeft, Sprout } from 'lucide-react-native';
import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Alert, ImageBackground, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { SignupForm } from '../components/SignupForm';
import { RootStackParamList } from '../navigation/types';
import { authService } from '../services/authService';
import { useAuthStore } from '../store/authStore';
import { colors } from '../theme/colors';

const BG_IMAGE = require('../assets/login_bg.jpg');

import { RouteProp, useRoute } from '@react-navigation/native';
// ...
export const LoginScreen = () => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const route = useRoute<RouteProp<RootStackParamList, 'Login'>>(); // Get route params
    
    // Modes: 'welcome' (initial), 'login' (phone flow), 'signup' (form)
    const [mode, setMode] = useState<'welcome' | 'login' | 'signup'>(route.params?.initialMode || 'welcome');
    
    // Login State
    const [loginStep, setLoginStep] = useState<'input' | 'otp'>('input');
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
        if (loginStep === 'otp' && timer > 0) {
            interval = setInterval(() => setTimer((t) => t - 1), 1000);
        }
        return () => clearInterval(interval);
    }, [loginStep, timer]);

    const handleContinueLogin = async (otpOverride?: string) => {
        if (isLoading) return; 
        if (loginStep === 'input') {
             // ... [Existing Login Input Logic] ...
             // Determine method
            let method = activeInput;
            if (!method) {
                if (phoneNumber && !email) method = 'phone';
                else if (email && !phoneNumber) method = 'email';
                else if (phoneNumber && email) method = 'phone';
                else {
                    Alert.alert("Error", "Please enter a phone number or email address");
                    return;
                }
            } else {
                if (method === 'phone' && !phoneNumber) { Alert.alert("Error", "Please enter a phone number"); return; }
                if (method === 'email' && !email) { Alert.alert("Error", "Please enter an email address"); return; }
            }
            
            setIsLoading(true);
            try {
                if (method === 'phone') {
                    await authService.sendOtp(phoneNumber, '+91', 2);
                } else {
                    await authService.sendOtp(email, '', 1);
                }
                setLoginStep('otp');
                setTimer(30);
            } catch (error: any) {
                Alert.alert("Error", error.response?.data?.message || "Failed to send OTP");
            } finally {
                setIsLoading(false);
            }
        } else {
             // ... [Existing Login OTP Logic] ...
             const otpValue = otpOverride ?? otp;
            if (!otpValue) { Alert.alert("Error", "Please enter OTP"); return; }

            setIsLoading(true);
            try {
                let method = activeInput;
                if (!method) {
                     if (phoneNumber && !email) method = 'phone';
                     else if (email && !phoneNumber) method = 'email';
                     else method = 'phone';
                }
                const contact = method === 'phone' ? phoneNumber : email;

                // Mode is 'login' here.
                const response = await authService.verifyOtp(contact, otpValue, method === 'phone' ? 2 : 1, method === 'phone' ? '+91' : '');
                
                if (response.token) {
                    setToken(response.token);
                    setUser(response.data);
                    navigation.reset({ index: 0, routes: [{ name: 'Dashboard' }] });
                } else {
                     Alert.alert("Error", "Invalid response");
                }
            } catch (error: any) {
                Alert.alert("Error", error.response?.data?.message || "Invalid OTP");
            } finally {
                setIsLoading(false);
            }
        }
    };

    const handleSignupSubmit = async (data: any) => {
        console.log("Signup Data:", data);
        // Implement actual signup logic here later (send OTP? or direct register?)
        // For now, let's pretend it goes to OTP or success
        Alert.alert("Signup", "Signup flow to be implemented. Data logged.");
    };

    const handleBack = () => {
        if (mode === 'login') {
            if (loginStep === 'otp') {
                setLoginStep('input');
                setOtp('');
            } else {
                setMode('welcome');
            }
        } else if (mode === 'signup') {
            setMode('welcome');
        }
    };

    // ... [Resend Logic for Login] ...
    const handleResend = async () => {
        if (timer > 0) return;
        setIsLoading(true);
        try {
            let method = activeInput || (phoneNumber ? 'phone' : 'email'); // Simplified fallback
            if (method === 'phone') await authService.sendOtp(phoneNumber, '+91', 2);
            else await authService.sendOtp(email, '', 1);
            setTimer(30);
            Alert.alert("Success", "OTP resent successfully");
        } catch (error: any) {
             Alert.alert("Error", error.response?.data?.message || "Failed to resend OTP");
        } finally {
            setIsLoading(false);
        }
    };

    if (mode === 'signup') {
        return (
            <ScreenWrapper>
                <View className="flex-1 px-4">
                    <View className="flex-row items-center mb-6 mt-2 ml-1">
                        <TouchableOpacity 
                            onPress={handleBack}
                            className="p-2 -ml-2 mr-2"
                        >
                            <ArrowLeft size={24} color={colors['text-primary']} />
                        </TouchableOpacity>
                        <Text className="text-text-primary text-2xl font-bold">Sign Up</Text>
                    </View>
                    <SignupForm 
                        onSubmit={handleSignupSubmit} 
                        isLoading={isLoading}
                    />
                </View>
            </ScreenWrapper>
        );
    }

    return (
        <View className="flex-1 bg-black">
            {/* Background Image Section */}
            <View className="flex-1">
                <ImageBackground 
                    source={BG_IMAGE} 
                    className="flex-1 justify-start"
                    resizeMode="cover"
                />
            </View>

            {/* Bottom Sheet Content */}
            <View 
                className="h-full absolute bottom-0 w-full justify-end"
                pointerEvents="box-none"
            >
                 <KeyboardAvoidingView 
                    behavior={Platform.OS === "ios" ? "padding" : "padding"} 
                    keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
                    className="w-full"
                >

                    <View className={`bg-[#FFFFF0] rounded-t-[32px] px-8 pt-10 ${mode === 'welcome' ? 'pb-8' : 'pb-12'} w-full h-auto min-h-[40%] justify-between`}>
                       
                        {/* Back Button */}
                        {(mode !== 'welcome') && (
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
                                
                                {mode === 'welcome' && (
                                     <>
                                        <Text className="text-text-primary text-2xl font-medium text-center">Welcome Back</Text>
                                        <Text className="text-text-secondary mt-2 text-base">Log in to your account</Text>
                                     </>
                                )}
                                
                                {mode === 'login' && loginStep === 'input' && (
                                    <>
                                        <Text className="text-text-primary text-2xl font-medium text-center">Welcome Back</Text>
                                        <Text className="text-text-secondary mt-2 text-base">Log in to your account</Text>
                                    </>
                                )}
                                
                                {mode === 'login' && loginStep === 'otp' && (
                                    <>
                                        <Text className="text-text-primary text-2xl font-medium text-center">Verification</Text>
                                        <Text className="text-text-secondary mt-2 text-base text-center px-4">
                                            Enter the code sent to your device
                                        </Text>
                                    </>
                                )}


                            </View>

                            {/* MODE: WELCOME */}
                            {mode === 'welcome' && (
                                <View className="gap-4">
                                    <TouchableOpacity 
                                        onPress={() => setMode('login')}
                                        className="h-14 bg-[#2CAEA6] rounded-xl items-center justify-center active:opacity-90 shadow-sm"
                                    >
                                        <Text className="text-white font-semibold text-lg">Log in</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity 
                                        onPress={() => setMode('signup')}
                                        className="h-14 bg-[#2CAEA6] rounded-xl items-center justify-center active:opacity-90 shadow-sm"
                                    >
                                        <Text className="text-white font-semibold text-lg">Sign Up</Text>
                                    </TouchableOpacity>
                                </View>
                            )}



                            {/* MODE: LOGIN */}
                            {mode === 'login' && (
                                loginStep === 'input' ? (
                                    <View className="gap-6">
                                        {/* ... Phone/Email Inputs ... */}
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
                                                    handleContinueLogin(cleaned);
                                                }
                                            }}
                                            keyboardType="number-pad"
                                            returnKeyType="done"
                                            onSubmitEditing={() => handleContinueLogin()}
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
                                )
                            )}

                            {/* Continue Button for Login Mode (Input & OTP) */}
                            {mode === 'login' && (
                                <TouchableOpacity 
                                    onPress={() => handleContinueLogin()}
                                    disabled={isLoading}
                                    className="h-14 bg-[#2CAEA6] rounded-xl items-center justify-center mt-8 active:opacity-90"
                                >
                                    {isLoading ? (
                                        <ActivityIndicator color="white" />
                                    ) : (
                                        <Text className="text-white font-semibold text-lg">Continue</Text>
                                    )}
                                </TouchableOpacity>
                            )}
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
