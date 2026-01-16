
import { ArrowLeft, Calendar } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { CustomInput } from '../components/CustomInput';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { TabSwitcher } from '../components/TabSwitcher';
import { userService } from '../services/userService';
import { useAuthStore } from '../store/authStore';
import { colors } from '../theme/colors';

import { useNavigation } from '@react-navigation/native';

export const SettingsScreen = () => {
    const navigation = useNavigation();
    const [activeTab, setActiveTab] = useState('Profile');
    const { logout, user, setUser } = useAuthStore();
    const [isLoading, setIsLoading] = useState(false);

    // Form State
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [dob, setDob] = useState("");
    const [gender, setGender] = useState("");

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        setIsLoading(true);
        try {
            const data = await userService.getProfile();
            // Assuming data.user matches the structure, or adjust as needed
            // The curl output showed: {"user": {"id":..., "first_name": "Dhairya", ...}} inside response.data
            // The userService returns response.data directly.
            
            const userData = data.user || data; 
            if (userData) {
                 setUser(userData); // Update store
                 setFirstName(userData.first_name || "");
                 setLastName(userData.last_name || "");
                 setEmail(userData.email || "");
                 setPhone(userData.contact || "");
                 // Format DOB if needed
                 setDob(userData.date_of_birth ? new Date(userData.date_of_birth).toDateString() : "");
                 setGender(userData.gender || "");
            }
        } catch (error) {
            console.error("Failed to fetch profile", error);
            Alert.alert("Error", "Failed to load profile data");
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogout = () => {
        logout();
        // Navigation reset is handled by RootNavigator now, but for safety:
        // navigation.dispatch(CommonActions.reset({ index: 0, routes: [{ name: 'Login' }] }));
    };

    return (
        <ScreenWrapper className="flex-1 bg-mint" edges={['top', 'left', 'right']}>
            {/* Header */}
            <View className="px-6 py-4 flex-row items-center mb-4">
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <ArrowLeft size={24} color="#000" />
                </TouchableOpacity>
                <Text className="flex-1 text-center text-lg font-bold text-text-primary mr-6">Account Settings</Text>
            </View>

            {/* Main Content Card (White with Top Radius) */}
            <View className="flex-1 bg-white rounded-t-[40px] px-6 pt-8 shadow-sm">
                <TabSwitcher 
                    tabs={['Profile', 'Change Password']}
                    activeTab={activeTab}
                    onTabChange={setActiveTab}
                />

                <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} className="flex-1">
                    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
                        
                        {activeTab === 'Profile' ? (
                            <>
                                <CustomInput label="First Name" value={firstName} onChangeText={setFirstName} />
                                {/* Middle Name omitted if not in API usually, can ask user */}
                                <CustomInput label="Last Name" value={lastName} onChangeText={setLastName} />
                                <CustomInput label="Email" value={email} onChangeText={setEmail} keyboardType="email-address" />
                                
                                <View className="mb-4">
                                     <View className="flex-row justify-between mb-2">
                                        <Text className="text-text-primary font-medium text-base">Phone No.</Text>
                                     </View>
                                     <View className="flex-row gap-3">
                                         <View className="flex-1 bg-gray-100 border border-gray-200 rounded-xl h-14 justify-center px-4">
                                             <Text className="text-text-primary text-base font-medium text-[#A0A0A0]">{phone}</Text>
                                         </View>
                                     </View>
                                </View>

                                {/* Date of Birth */}
                                <View className="mb-4">
                                    <Text className="text-text-primary font-medium mb-2 text-base">Date of Birth</Text>
                                    <View className="bg-white border border-gray-400 rounded-xl h-14 px-4 flex-row items-center justify-between">
                                        <Text className="text-text-primary text-base font-medium">{dob || 'Not set'}</Text>
                                        <Calendar size={20} color={colors['text-primary']} />
                                    </View>
                                </View>

                                {/* Gender */}
                                <View className="mb-4">
                                    <Text className="text-text-primary font-medium mb-2 text-base">Gender</Text>
                                    <View className="bg-white border border-gray-400 rounded-xl h-14 px-4 flex-row items-center justify-between">
                                        <Text className="text-[#A0A0A0] text-base font-medium capitalize">{gender || 'Not Select'}</Text>
                                        <Text className="text-[10px] text-text-secondary">▼</Text>
                                    </View>
                                </View>
                            </>
                        ) : (
                             <>
                                <CustomInput label="New Password" placeholder="New Password" value={password} onChangeText={setPassword} secureTextEntry />
                                <CustomInput label="Confirm Password" placeholder="Confirm Password" value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry />
                             </>
                        )}

                        <TouchableOpacity 
                            className="bg-teal h-14 rounded-xl items-center justify-center mt-6 shadow-sm mb-10"
                            onPress={() => {
                                Alert.alert("Info", "Update API not yet implemented");
                            }}
                        >
                            <Text className="text-white font-semibold text-lg">Save</Text>
                        </TouchableOpacity>
                        
                        <TouchableOpacity 
                            onPress={handleLogout}
                            className="mt-4 bg-red-50 p-4 rounded-2xl items-center border border-red-100 mb-20"
                        >
                            <Text className="text-red-500 font-bold text-base">Log Out</Text>
                        </TouchableOpacity>

                    </ScrollView>
                </KeyboardAvoidingView>
            </View>
        </ScreenWrapper>
    );
};
