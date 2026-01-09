import { Camera, Sparkles } from 'lucide-react-native';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { colors } from '../theme/colors';

import { CommonActions, useNavigation } from '@react-navigation/native';

export const SettingsScreen = () => {
    const navigation = useNavigation();
    const [activeTab, setActiveTab] = useState<'profile' | 'password'>('profile');

    const handleLogout = () => {
        navigation.dispatch(
            CommonActions.reset({
                index: 0,
                routes: [{ name: 'Login' }],
            })
        );
    };

    // Form State
    const [firstName, setFirstName] = useState("Dhairya");
    const [lastName, setLastName] = useState("Senjaliya");
    const [phone, setPhone] = useState("8866663381");
    const [email, setEmail] = useState("dhairya@flahy.com");

    const ProfileHeader = () => (
        <View className="items-center mt-6 mb-8">
            <View className="relative">
                <View className="w-24 h-24 rounded-full bg-teal-light items-center justify-center border-4 border-white shadow-lg">
                    <Text className="text-3xl font-bold text-white">DS</Text>
                </View>
                <TouchableOpacity className="absolute bottom-0 right-0 bg-primary p-2 rounded-full border border-white shadow-sm">
                    <Camera size={14} color="white" />
                </TouchableOpacity>
            </View>
            <Text className="text-2xl font-bold text-text-primary mt-3 tracking-tight">Dhairya Senjaliya</Text>
            <View className="flex-row items-center gap-1 mt-1 bg-primary/10 px-3 py-1 rounded-full">
                <Sparkles size={12} color={colors.primary} />
                <Text className="text-primary text-xs font-semibold">Premium Member</Text>
            </View>
        </View>
    );

    const FormSection = ({ title, children }: { title?: string, children: React.ReactNode }) => (
        <View className="mb-6">
            {title && <Text className="text-text-secondary text-sm font-semibold ml-4 mb-2 uppercase tracking-wide">{title}</Text>}
            <View className="bg-white rounded-3xl border-[0.5px] border-gray-100 overflow-hidden shadow-sm">
                {children}
            </View>
        </View>
    );

    const FormRow = ({ label, value, onChangeText, placeholder, isLast, keyboardType = 'default' }: any) => (
        <View className={`flex-row items-center px-5 py-4 ${!isLast ? 'border-b border-gray-50' : ''}`}>
            <Text className="w-28 text-text-secondary font-medium text-base">{label}</Text>
            <TextInput
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                placeholderTextColor={colors['text-secondary']}
                className="flex-1 text-text-primary text-base font-medium p-0"
                keyboardType={keyboardType}
            />
        </View>
    );

    return (
        <ScreenWrapper className="flex-1" edges={['top', 'left', 'right']}>
            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} className="flex-1">
                <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
                    
                    <ProfileHeader />

                    <View className="px-6">
                        {/* Segmented Control */}
                        <View className="flex-row bg-gray-100 p-1 rounded-2xl mb-8">
                            <TouchableOpacity 
                                onPress={() => setActiveTab('profile')}
                                className="flex-1 py-2.5 items-center rounded-xl"
                                style={activeTab === 'profile' ? { backgroundColor: 'white', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2, elevation: 2 } : {}}
                            >
                                <Text className={`font-semibold ${activeTab === 'profile' ? 'text-text-primary' : 'text-text-secondary'}`}>Profile</Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                onPress={() => setActiveTab('password')}
                                className="flex-1 py-2.5 items-center rounded-xl"
                                style={activeTab === 'password' ? { backgroundColor: 'white', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2, elevation: 2 } : {}}
                            >
                                <Text className={`font-semibold ${activeTab === 'password' ? 'text-text-primary' : 'text-text-secondary'}`}>Password</Text>
                            </TouchableOpacity>
                        </View>

                        {activeTab === 'profile' ? (
                            <>
                                <FormSection title="Personal Information">
                                    <FormRow label="First Name" value={firstName} onChangeText={setFirstName} />
                                    <FormRow label="Last Name" value={lastName} onChangeText={setLastName} isLast />
                                </FormSection>

                                <FormSection title="Contact">
                                    <FormRow label="Email" value={email} onChangeText={setEmail} keyboardType="email-address" />
                                    <FormRow label="Phone" value={phone} onChangeText={setPhone} keyboardType="phone-pad" isLast />
                                </FormSection>
                            </>
                        ) : (
                             <FormSection title="Security">
                                <FormRow label="Current" placeholder="••••••••" isLast={false} />
                                <FormRow label="New" placeholder="••••••••" isLast={false} />
                                <FormRow label="Confirm" placeholder="••••••••" isLast />
                            </FormSection>
                        )}

                        <TouchableOpacity 
                            onPress={handleLogout}
                            className="mt-4 bg-red-50 p-4 rounded-2xl items-center border border-red-100 mb-20"
                        >
                            <Text className="text-red-500 font-bold text-base">Log Out</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>

             {/* Floating Save Button */}
            <View className="absolute bottom-10 left-6 right-6">
                <TouchableOpacity className="bg-primary h-14 rounded-full items-center justify-center shadow-lg shadow-primary/30 active:scale-95 transition-transform">
                    <Text className="text-white font-bold text-lg">Save Changes</Text>
                </TouchableOpacity>
            </View>

        </ScreenWrapper>
    );
};
