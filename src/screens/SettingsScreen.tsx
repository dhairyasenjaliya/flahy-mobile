import { ArrowLeft, Calendar, ChevronDown } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { Alert, KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { CustomInput } from '../components/CustomInput';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { TabSwitcher } from '../components/TabSwitcher';
import { userService } from '../services/userService';
import { useAuthStore } from '../store/authStore';
import { colors } from '../theme/colors';

import { useNavigation } from '@react-navigation/native';

const GENDER_OPTIONS = ['Male', 'Female', 'Other'];

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

function getDaysInMonth(month: number, year: number) {
    return new Date(year, month + 1, 0).getDate();
}

function formatDate(date: Date): string {
    const d = date.getDate().toString().padStart(2, '0');
    const m = MONTHS[date.getMonth()];
    const y = date.getFullYear();
    return `${d} ${m} ${y}`;
}

function toISODate(date: Date): string {
    return date.toISOString().split('T')[0];
}

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

    const [dobDate, setDobDate] = useState<Date | null>(null);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showGenderPicker, setShowGenderPicker] = useState(false);

    // Temp date picker state
    const [tempDay, setTempDay] = useState(1);
    const [tempMonth, setTempMonth] = useState(0);
    const [tempYear, setTempYear] = useState(2000);

    const [currentPassword, setCurrentPassword] = useState("");
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
                 if (userData.date_of_birth) {
                     const d = new Date(userData.date_of_birth);
                     setDobDate(d);
                     setDob(formatDate(d));
                 }
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
        <ScreenWrapper style={{ flex: 1, backgroundColor: colors['background'] }} edges={['top', 'left', 'right']}>
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
                                    <TouchableOpacity
                                        onPress={() => {
                                            const d = dobDate ?? new Date(2000, 0, 1);
                                            setTempDay(d.getDate());
                                            setTempMonth(d.getMonth());
                                            setTempYear(d.getFullYear());
                                            setShowDatePicker(true);
                                        }}
                                        activeOpacity={0.7}
                                        style={{ backgroundColor: 'white', borderWidth: 1, borderColor: '#9CA3AF', borderRadius: 12, height: 56, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}
                                    >
                                        <Text style={{ color: dob ? colors['text-primary'] : '#A0A0A0', fontSize: 16, fontWeight: '500' }}>{dob || 'Select date'}</Text>
                                        <Calendar size={20} color={colors['text-primary']} />
                                    </TouchableOpacity>
                                </View>

                                {/* Gender */}
                                <View style={{ marginBottom: 16 }}>
                                    <Text style={{ color: colors['text-primary'], fontWeight: '500', marginBottom: 8, fontSize: 16 }}>Gender</Text>
                                    <TouchableOpacity
                                        onPress={() => setShowGenderPicker(true)}
                                        activeOpacity={0.7}
                                        style={{ backgroundColor: 'white', borderWidth: 1, borderColor: '#9CA3AF', borderRadius: 12, height: 56, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}
                                    >
                                        <Text style={{ color: gender ? colors['text-primary'] : '#A0A0A0', fontSize: 16, fontWeight: '500', textTransform: 'capitalize' }}>{gender || 'Select gender'}</Text>
                                        <ChevronDown size={20} color={colors['text-secondary']} />
                                    </TouchableOpacity>
                                </View>
                            </>
                        ) : (
                             <>
                                {user?.password_created && (
                                    <CustomInput label="Current Password" placeholder="Current Password" value={currentPassword} onChangeText={setCurrentPassword} secureTextEntry />
                                )}
                                <CustomInput label="New Password" placeholder="New Password" value={password} onChangeText={setPassword} secureTextEntry />
                                <CustomInput label="Confirm Password" placeholder="Confirm Password" value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry />
                             </>
                        )}

                        <TouchableOpacity 
                            style={{
                                backgroundColor: colors.primary,
                                height: 56,
                                borderRadius: 12,
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginTop: 24,
                                marginBottom: 40,
                                opacity: isLoading ? 0.7 : 1,
                                shadowColor: '#000',
                                shadowOffset: { width: 0, height: 1 },
                                shadowOpacity: 0.1,
                                shadowRadius: 2,
                                elevation: 2
                            }}
                            onPress={async () => {
                                if (isLoading) return;
                                setIsLoading(true);
                                try {
                                    if (activeTab === 'Profile') {
                                        await userService.updateProfile(user?.id, {
                                            first_name: firstName,
                                            last_name: lastName,
                                            email: email,
                                            ...(dobDate ? { date_of_birth: toISODate(dobDate) } : {}),
                                            ...(gender ? { gender: gender.toLowerCase() } : {}),
                                        });
                                        Alert.alert("Success", "Profile updated successfully");
                                        await fetchProfile(); // Refresh
                                    } else {
                                        if (!password || !confirmPassword) {
                                            Alert.alert("Error", "Please fill all fields");
                                            return;
                                        }
                                        if (password !== confirmPassword) {
                                            Alert.alert("Error", "Passwords do not match");
                                            return;
                                        }
                                        if (user?.password_created) {
                                            if (!currentPassword) {
                                                Alert.alert("Error", "Please enter your current password");
                                                return;
                                            }
                                            await userService.resetPassword(currentPassword, password, confirmPassword);
                                        } else {
                                            await userService.createPassword(password, confirmPassword);
                                        }
                                        Alert.alert("Success", "Password updated successfully");
                                        setCurrentPassword("");
                                        setPassword("");
                                        setConfirmPassword("");
                                    }
                                } catch (error: any) {
                                    console.error("Update failed", error);
                                    Alert.alert("Error", error.response?.data?.message || "Failed to update settings");
                                } finally {
                                    setIsLoading(false);
                                }
                            }}
                            disabled={isLoading}
                        >
                            <Text style={{ color: 'white', fontWeight: '600', fontSize: 18 }}>
                                {isLoading ? "Saving..." : (activeTab === 'Change Password' ? 'Update Password' : 'Save Changes')}
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

            {/* Gender Picker Modal */}
            <Modal visible={showGenderPicker} transparent animationType="slide">
                <Pressable style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' }} onPress={() => setShowGenderPicker(false)}>
                    <Pressable style={{ backgroundColor: 'white', borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingBottom: 40 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' }}>
                            <Text style={{ fontSize: 18, fontWeight: '600', color: colors['text-primary'] }}>Select Gender</Text>
                            <TouchableOpacity onPress={() => setShowGenderPicker(false)}>
                                <Text style={{ fontSize: 16, color: colors['text-secondary'] }}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                        {GENDER_OPTIONS.map(option => (
                            <TouchableOpacity
                                key={option}
                                onPress={() => {
                                    setGender(option.toLowerCase());
                                    setShowGenderPicker(false);
                                }}
                                style={{
                                    paddingHorizontal: 24,
                                    paddingVertical: 16,
                                    borderBottomWidth: 1,
                                    borderBottomColor: '#F3F4F6',
                                    backgroundColor: gender === option.toLowerCase() ? colors['green-light'] : 'white',
                                }}
                            >
                                <Text style={{
                                    fontSize: 16,
                                    fontWeight: gender === option.toLowerCase() ? '600' : '400',
                                    color: gender === option.toLowerCase() ? colors.primary : colors['text-primary'],
                                }}>{option}</Text>
                            </TouchableOpacity>
                        ))}
                    </Pressable>
                </Pressable>
            </Modal>

            {/* Date Picker Modal */}
            <Modal visible={showDatePicker} transparent animationType="slide">
                <Pressable style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' }} onPress={() => setShowDatePicker(false)}>
                    <Pressable style={{ backgroundColor: 'white', borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingBottom: 40 }}>
                        {/* Header */}
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' }}>
                            <TouchableOpacity onPress={() => setShowDatePicker(false)}>
                                <Text style={{ fontSize: 16, color: colors['text-secondary'] }}>Cancel</Text>
                            </TouchableOpacity>
                            <Text style={{ fontSize: 18, fontWeight: '600', color: colors['text-primary'] }}>Date of Birth</Text>
                            <TouchableOpacity onPress={() => {
                                const maxDay = getDaysInMonth(tempMonth, tempYear);
                                const clampedDay = Math.min(tempDay, maxDay);
                                const selected = new Date(tempYear, tempMonth, clampedDay);
                                setDobDate(selected);
                                setDob(formatDate(selected));
                                setShowDatePicker(false);
                            }}>
                                <Text style={{ fontSize: 16, fontWeight: '600', color: colors.primary }}>Done</Text>
                            </TouchableOpacity>
                        </View>

                        {/* Picker Columns */}
                        <View style={{ flexDirection: 'row', paddingHorizontal: 16, paddingTop: 8 }}>
                            {/* Day */}
                            <View style={{ flex: 1 }}>
                                <Text style={{ textAlign: 'center', fontSize: 13, color: colors['text-secondary'], marginBottom: 8, fontWeight: '500' }}>Day</Text>
                                <ScrollView style={{ height: 180 }} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingVertical: 70 }}>
                                    {Array.from({ length: getDaysInMonth(tempMonth, tempYear) }, (_, i) => i + 1).map(d => (
                                        <TouchableOpacity
                                            key={d}
                                            onPress={() => setTempDay(d)}
                                            style={{ paddingVertical: 10, alignItems: 'center', backgroundColor: tempDay === d ? colors['green-light'] : 'transparent', borderRadius: 8, marginHorizontal: 4 }}
                                        >
                                            <Text style={{ fontSize: 18, fontWeight: tempDay === d ? '700' : '400', color: tempDay === d ? colors.primary : colors['text-primary'] }}>{d}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </ScrollView>
                            </View>

                            {/* Month */}
                            <View style={{ flex: 1.2 }}>
                                <Text style={{ textAlign: 'center', fontSize: 13, color: colors['text-secondary'], marginBottom: 8, fontWeight: '500' }}>Month</Text>
                                <ScrollView style={{ height: 180 }} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingVertical: 70 }}>
                                    {MONTHS.map((m, i) => (
                                        <TouchableOpacity
                                            key={m}
                                            onPress={() => setTempMonth(i)}
                                            style={{ paddingVertical: 10, alignItems: 'center', backgroundColor: tempMonth === i ? colors['green-light'] : 'transparent', borderRadius: 8, marginHorizontal: 4 }}
                                        >
                                            <Text style={{ fontSize: 18, fontWeight: tempMonth === i ? '700' : '400', color: tempMonth === i ? colors.primary : colors['text-primary'] }}>{m}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </ScrollView>
                            </View>

                            {/* Year */}
                            <View style={{ flex: 1 }}>
                                <Text style={{ textAlign: 'center', fontSize: 13, color: colors['text-secondary'], marginBottom: 8, fontWeight: '500' }}>Year</Text>
                                <ScrollView style={{ height: 180 }} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingVertical: 70 }}>
                                    {Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i).map(y => (
                                        <TouchableOpacity
                                            key={y}
                                            onPress={() => setTempYear(y)}
                                            style={{ paddingVertical: 10, alignItems: 'center', backgroundColor: tempYear === y ? colors['green-light'] : 'transparent', borderRadius: 8, marginHorizontal: 4 }}
                                        >
                                            <Text style={{ fontSize: 18, fontWeight: tempYear === y ? '700' : '400', color: tempYear === y ? colors.primary : colors['text-primary'] }}>{y}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </ScrollView>
                            </View>
                        </View>
                    </Pressable>
                </Pressable>
            </Modal>
        </ScreenWrapper>
    );
};
