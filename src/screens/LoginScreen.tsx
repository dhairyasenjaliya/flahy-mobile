import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ArrowLeft, ArrowRight, Mail, Phone } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { RootStackParamList } from '../navigation/types';
import { colors } from '../theme/colors';

export const LoginScreen = () => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const [step, setStep] = useState<'input' | 'otp'>('input');
    const [loginMethod, setLoginMethod] = useState<'phone' | 'email'>('phone');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [timer, setTimer] = useState(30);

    // Timer logic
    useEffect(() => {
        let interval: any;
        if (step === 'otp' && timer > 0) {
            interval = setInterval(() => setTimer((t) => t - 1), 1000);
        }
        return () => clearInterval(interval);
    }, [step, timer]);

    const handleContinue = () => {
        if (step === 'input') {
            // Basic validation
            if (loginMethod === 'phone' && !phoneNumber) return;
            if (loginMethod === 'email' && !email) return;
            
            setStep('otp');
            setTimer(24); // Reset timer
        } else {
            // Verify OTP
            navigation.navigate('Main');
        }
    };

    const handleBack = () => {
        setStep('input');
        setOtp('');
    };

    const handleResend = () => {
        setTimer(24);
        // Resend logic here
    };

    return (
        <ScreenWrapper className="flex-1 bg-background" edges={['top', 'left', 'right', 'bottom']}>
            <KeyboardAvoidingView 
                behavior={Platform.OS === "ios" ? "padding" : "height"} 
                className="flex-1 justify-center px-8"
            >
                {/* Back Button (OTP Mode) */}
                {step === 'otp' && (
                    <TouchableOpacity 
                        onPress={handleBack}
                        className="absolute top-12 left-8 z-10 p-2 -ml-2"
                    >
                        <ArrowLeft size={24} color={colors['text-primary']} />
                    </TouchableOpacity>
                )}

                {/* Logo / Header Section */}
                <View className="items-center mb-10">
                    <View className="mb-6 w-20 h-20 bg-primary/10 rounded-3xl items-center justify-center rotate-3">
                         <Text className="text-4xl">⚡</Text>
                    </View>
                    <Text className="text-primary font-bold text-4xl tracking-[0.3em] font-modern">FLAHY</Text>
                    {step === 'input' ? (
                        <Text className="text-text-secondary mt-3 text-base font-medium">Welcome to Dashboard</Text>
                    ) : (
                        <Text className="text-text-secondary mt-3 text-sm font-medium text-center px-4">
                            Please enter the verification code sent to your {loginMethod === 'phone' ? 'Phone Number' : 'Email Address'}
                        </Text>
                    )}
                </View>

                {step === 'input' ? (
                    <>
                        {/* Login Method Tabs */}
                        <View className="bg-gray-100 p-1 rounded-2xl flex-row mb-8">
                            <TouchableOpacity 
                                onPress={() => setLoginMethod('phone')}
                                className="flex-1 flex-row items-center justify-center py-3 rounded-xl gap-2"
                                style={loginMethod === 'phone' ? { backgroundColor: 'white', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2, elevation: 2 } : {}}
                            >
                                <Phone size={18} color={loginMethod === 'phone' ? colors.primary : colors['text-secondary']} />
                                <Text className={`font-semibold ${loginMethod === 'phone' ? 'text-primary' : 'text-text-secondary'}`}>Phone</Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                onPress={() => setLoginMethod('email')}
                                className="flex-1 flex-row items-center justify-center py-3 rounded-xl gap-2"
                                style={loginMethod === 'email' ? { backgroundColor: 'white', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2, elevation: 2 } : {}}
                            >
                                <Mail size={18} color={loginMethod === 'email' ? colors.primary : colors['text-secondary']} />
                                <Text className={`font-semibold ${loginMethod === 'email' ? 'text-primary' : 'text-text-secondary'}`}>Email</Text>
                            </TouchableOpacity>
                        </View>

                        {/* Input Fields */}
                        <View className="mb-10 min-h-[100px]">
                            {loginMethod === 'phone' ? (
                                <View className="flex-row gap-4">
                                    <View className="w-24">
                                        <Text className="text-text-secondary text-xs font-semibold mb-1.5 ml-1">CODE</Text>
                                        <View className="bg-white border border-gray-200 rounded-2xl h-14 justify-center items-center">
                                            <Text className="text-lg font-bold text-text-primary">+91</Text>
                                        </View>
                                    </View>
                                    <View className="flex-1">
                                        <Text className="text-text-secondary text-xs font-semibold mb-1.5 ml-1">PHONE NUMBER</Text>
                                        <View className="bg-white border border-gray-200 rounded-2xl h-14 justify-center px-4">
                                            <TextInput 
                                                value={phoneNumber}
                                                onChangeText={setPhoneNumber}
                                                placeholder="Enter number"
                                                placeholderTextColor={colors['text-secondary']}
                                                keyboardType="phone-pad"
                                                className="text-lg font-medium text-text-primary h-full p-0"
                                            />
                                        </View>
                                    </View>
                                </View>
                            ) : (
                                <View>
                                    <Text className="text-text-secondary text-xs font-semibold mb-1.5 ml-1">EMAIL ADDRESS</Text>
                                    <View className="bg-white border border-gray-200 rounded-2xl h-14 justify-center px-4">
                                        <TextInput 
                                            value={email}
                                            onChangeText={setEmail}
                                            placeholder="name@example.com"
                                            placeholderTextColor={colors['text-secondary']}
                                            keyboardType="email-address"
                                            autoCapitalize="none"
                                            className="text-lg font-medium text-text-primary h-full p-0"
                                        />
                                    </View>
                                </View>
                            )}
                        </View>
                    </>
                ) : (
                    /* OTP Input Section */
                    <View className="mb-10">
                        <View className="mb-8">
                            <Text className="text-text-secondary text-xs font-semibold mb-1.5 ml-1 text-center">OTP</Text>
                            <View className="bg-white border border-gray-200 rounded-2xl h-14 justify-center px-4 shadow-sm">
                                <TextInput 
                                    value={otp}
                                    onChangeText={setOtp}
                                    placeholder="Enter OTP"
                                    placeholderTextColor={colors['text-secondary']}
                                    keyboardType="number-pad"
                                    className="text-lg font-bold text-text-primary h-full p-0 text-center tracking-widest"
                                    maxLength={6}
                                    autoFocus
                                />
                            </View>
                        </View>

                        <TouchableOpacity 
                            onPress={handleResend}
                            disabled={timer > 0}
                            className="items-center"
                        >
                            <Text className={`font-semibold ${timer > 0 ? 'text-text-secondary' : 'text-primary'}`}>
                                {timer > 0 ? `Resend OTP (${timer}s)` : 'Resend OTP'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                )}

                {/* Action Button */}
                <TouchableOpacity 
                    onPress={handleContinue}
                    className="bg-primary h-16 rounded-2xl flex-row items-center justify-center shadow-lg shadow-primary/30 active:scale-95 transition-transform"
                >
                    <Text className="text-white font-bold text-lg mr-2">
                        {step === 'input' ? 'Get OTP' : 'Login'}
                    </Text>
                    {step === 'input' && <ArrowRight size={20} color="white" />}
                </TouchableOpacity>

            </KeyboardAvoidingView>
        </ScreenWrapper>
    );
};
