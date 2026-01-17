
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
        <ScreenWrapper style={{ flex: 1, backgroundColor: colors['green-light'] }} edges={['top', 'left', 'right']}>
            {/* Header */}
            <View style={{ paddingHorizontal: 24, paddingVertical: 16, flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <ArrowLeft size={24} color="#000" />
                </TouchableOpacity>
                <Text style={{ flex: 1, textAlign: 'center', fontSize: 18, fontWeight: 'bold', color: colors['text-primary'], marginRight: 24 }}>Account Settings</Text>
            </View>

            {/* Main Content Card (White with Top Radius) */}
            <View style={{
                flex: 1,
                backgroundColor: 'white',
                borderTopLeftRadius: 40,
                borderTopRightRadius: 40,
                paddingHorizontal: 24,
                paddingTop: 32,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.1,
                shadowRadius: 2,
                elevation: 2
            }}>
                <TabSwitcher 
                    tabs={['Profile', 'Change Password']}
                    activeTab={activeTab}
                    onTabChange={setActiveTab}
                />

                <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
                    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
                        
                        {activeTab === 'Profile' ? (
                            <>
                                <CustomInput label="First Name" value={firstName} onChangeText={setFirstName} />
                                {/* Middle Name omitted if not in API usually, can ask user */}
                                <CustomInput label="Last Name" value={lastName} onChangeText={setLastName} />
                                <CustomInput label="Email" value={email} onChangeText={setEmail} keyboardType="email-address" />
                                
                                <View style={{ marginBottom: 16 }}>
                                     <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                                        <Text style={{ color: colors['text-primary'], fontWeight: '500', fontSize: 16 }}>Phone No.</Text>
                                     </View>
                                     <View style={{ flexDirection: 'row', gap: 12 }}>
                                         <View style={{ flex: 1, backgroundColor: '#F3F4F6', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 12, height: 56, justifyContent: 'center', paddingHorizontal: 16 }}>
                                             <Text style={{ color: '#A0A0A0', fontSize: 16, fontWeight: '500' }}>{phone}</Text>
                                         </View>
                                     </View>
                                </View>

                                {/* Date of Birth */}
                                <View style={{ marginBottom: 16 }}>
                                    <Text style={{ color: colors['text-primary'], fontWeight: '500', marginBottom: 8, fontSize: 16 }}>Date of Birth</Text>
                                    <View style={{ backgroundColor: 'white', borderWidth: 1, borderColor: '#9CA3AF', borderRadius: 12, height: 56, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <Text style={{ color: colors['text-primary'], fontSize: 16, fontWeight: '500' }}>{dob || 'Not set'}</Text>
                                        <Calendar size={20} color={colors['text-primary']} />
                                    </View>
                                </View>

                                {/* Gender */}
                                <View style={{ marginBottom: 16 }}>
                                    <Text style={{ color: colors['text-primary'], fontWeight: '500', marginBottom: 8, fontSize: 16 }}>Gender</Text>
                                    <View style={{ backgroundColor: 'white', borderWidth: 1, borderColor: '#9CA3AF', borderRadius: 12, height: 56, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <Text style={{ color: '#A0A0A0', fontSize: 16, fontWeight: '500', textTransform: 'capitalize' }}>{gender || 'Not Select'}</Text>
                                        <Text style={{ fontSize: 10, color: colors['text-secondary'] }}>▼</Text>
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
                            style={{
                                backgroundColor: colors.primary, // Using primary color for consistency or stick to 'teal' hex if desired
                                height: 56,
                                borderRadius: 12,
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginTop: 24,
                                marginBottom: 40,
                                shadowColor: '#000',
                                shadowOffset: { width: 0, height: 1 },
                                shadowOpacity: 0.1,
                                shadowRadius: 2,
                                elevation: 2
                            }}
                            onPress={() => {
                                Alert.alert("Info", "Update API not yet implemented");
                            }}
                        >
                            <Text style={{ color: 'white', fontWeight: '600', fontSize: 18 }}>
                                {activeTab === 'Change Password' ? 'Update Password' : 'Save Changes'}
                            </Text>
                        </TouchableOpacity>
                        
                        <TouchableOpacity 
                            onPress={handleLogout}
                            style={{ marginTop: 16, backgroundColor: '#FEF2F2', padding: 16, borderRadius: 16, alignItems: 'center', borderWidth: 1, borderColor: '#FEE2E2', marginBottom: 80 }}
                        >
                            <Text style={{ color: '#EF4444', fontWeight: 'bold', fontSize: 16 }}>Log Out</Text>
                        </TouchableOpacity>

                    </ScrollView>
                </KeyboardAvoidingView>
            </View>
        </ScreenWrapper>
    );
};
