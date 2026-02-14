import { Calendar as CalendarIcon, ChevronDown } from 'lucide-react-native';
import React, { useState } from 'react';
import { ActivityIndicator, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Calendar, DateData } from 'react-native-calendars';
import { colors } from '../theme/colors';

interface SignupData {
    firstName: string;
    middleName?: string;
    lastName: string;
    email: string;
    countryCode: string;
    phone: string;
    dob: string;
    gender: string;
    termsAccepted: boolean;
}

interface SignupFormProps {
    onSubmit: (data: SignupData) => void;
    onBack?: () => void;
    isLoading?: boolean;
}

export const SignupForm: React.FC<SignupFormProps> = ({ onSubmit, onBack, isLoading = false }) => {
    const [firstName, setFirstName] = useState('');
    const [middleName, setMiddleName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [countryCode, setCountryCode] = useState('+91');
    const [phone, setPhone] = useState('');
    const [dob, setDob] = useState('');
    const [gender, setGender] = useState('');
    const [termsAccepted, setTermsAccepted] = useState(false);
    
    const [showCalendar, setShowCalendar] = useState(false);
    const [showGenderPicker, setShowGenderPicker] = useState(false);

    const onDayPress = (day: DateData) => {
        setDob(day.dateString);
        setShowCalendar(false);
    };

    const handleContinue = () => {
        onSubmit({
            firstName,
            middleName,
            lastName,
            email,
            countryCode,
            phone,
            dob,
            gender,
            termsAccepted
        });
    };

    return (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
            {/* Header */}
            <View className="items-center mb-6">
                 {/* Logo is handled by parent or we can add it here if needed, but design shows it at top of sheet */}
            </View>

            <View className="gap-4">
                {/* First Name */}
                <View>
                    <Text className="text-text-primary font-medium mb-1.5 ml-1">First Name</Text>
                    <TextInput
                        value={firstName}
                        onChangeText={setFirstName}
                        placeholder="John"
                        className="bg-white border border-gray-300 rounded-xl px-4 h-12 text-text-primary"
                        placeholderTextColor="#9CA3AF"
                    />
                </View>

                {/* Middle Name */}
                <View>
                    <Text className="text-text-primary font-medium mb-1.5 ml-1">Middle Name (Optional)</Text>
                    <TextInput
                        value={middleName}
                        onChangeText={setMiddleName}
                        placeholder="Enter Middle Name"
                        className="bg-white border border-gray-300 rounded-xl px-4 h-12 text-text-primary"
                        placeholderTextColor="#9CA3AF"
                    />
                </View>

                 {/* Last Name */}
                 <View>
                    <Text className="text-text-primary font-medium mb-1.5 ml-1">Last Name</Text>
                    <TextInput
                        value={lastName}
                        onChangeText={setLastName}
                        placeholder="Carter"
                        className="bg-white border border-gray-300 rounded-xl px-4 h-12 text-text-primary"
                        placeholderTextColor="#9CA3AF"
                    />
                </View>

                {/* Email */}
                <View>
                    <Text className="text-text-primary font-medium mb-1.5 ml-1">Email</Text>
                    <TextInput
                        value={email}
                        onChangeText={setEmail}
                        placeholder="john.carter@gmail.com"
                        keyboardType="email-address"
                        className="bg-white border border-gray-300 rounded-xl px-4 h-12 text-text-primary"
                        placeholderTextColor="#9CA3AF"
                        autoCapitalize="none"
                    />
                </View>

                {/* Phone & Country Code */}
                <View className="flex-row gap-3">
                    <View className="w-1/3">
                        <Text className="text-text-primary font-medium mb-1.5 ml-1">Country Code</Text>
                        <View className="bg-white border border-gray-300 rounded-xl px-3 h-12 flex-row items-center justify-between">
                             <Text className="text-text-primary">{countryCode}</Text>
                             <ChevronDown size={16} color="gray" />
                        </View>
                    </View>
                    <View className="flex-1">
                        <Text className="text-text-primary font-medium mb-1.5 ml-1">Phone No.</Text>
                        <TextInput
                            value={phone}
                            onChangeText={setPhone}
                            placeholder="123456789"
                            keyboardType="phone-pad"
                            className="bg-white border border-gray-300 rounded-xl px-4 h-12 text-text-primary"
                            placeholderTextColor="#9CA3AF"
                        />
                    </View>
                </View>

                {/* Date of Birth */}
                <View className="z-20">
                    <Text className="text-text-primary font-medium mb-1.5 ml-1">Date of Birth</Text>
                    <TouchableOpacity 
                        onPress={() => setShowCalendar(!showCalendar)}
                        className="bg-white border border-gray-300 rounded-xl px-4 h-12 flex-row items-center justify-between"
                    >
                        <Text className={dob ? "text-text-primary" : "text-[#9CA3AF]"}>{dob || "Select Date"}</Text>
                        <CalendarIcon size={20} color="#6B7280" />
                    </TouchableOpacity>
                     
                     {showCalendar && (
                        <View className="absolute top-14 left-0 right-0 bg-white border border-gray-200 rounded-xl shadow-lg z-50 p-2">
                            <Calendar
                                onDayPress={onDayPress}
                                maxDate={new Date().toISOString().split('T')[0]}
                                theme={{
                                    selectedDayBackgroundColor: colors.teal,
                                    todayTextColor: colors.teal,
                                    arrowColor: colors.teal,
                                }}
                            />
                        </View>
                    )}
                </View>

                {/* Gender */}
                <View className="z-10">
                    <Text className="text-text-primary font-medium mb-1.5 ml-1">Gender</Text>
                    <TouchableOpacity 
                        onPress={() => setShowGenderPicker(!showGenderPicker)}
                        className="bg-white border border-gray-300 rounded-xl px-4 h-12 flex-row items-center justify-between"
                    >
                        <Text className={gender ? "text-text-primary" : "text-[#9CA3AF]"}>{gender || "Select a Gender"}</Text>
                        <ChevronDown size={20} color="#6B7280" />
                    </TouchableOpacity>
                    
                    {showGenderPicker && (
                         <View className="absolute top-14 left-0 right-0 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden">
                            {['Male', 'Female', 'Other'].map((opt) => (
                                <TouchableOpacity 
                                    key={opt}
                                    className="px-4 py-3 border-b border-gray-100 last:border-0 active:bg-gray-50"
                                    onPress={() => {
                                        setGender(opt);
                                        setShowGenderPicker(false);
                                    }}
                                >
                                    <Text className="text-text-primary">{opt}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    )}
                </View>

                {/* Terms */}
                <TouchableOpacity 
                    className="flex-row items-center mt-2"
                    onPress={() => setTermsAccepted(!termsAccepted)}
                >
                    <View className={`w-5 h-5 rounded border mr-2 items-center justify-center ${termsAccepted ? 'bg-teal border-teal' : 'bg-white border-gray-400'}`}>
                        {termsAccepted && <Text className="text-white text-xs">✓</Text>}
                    </View>
                    <Text className="text-text-secondary text-xs flex-1">
                        I accept all the <Text className="font-bold text-text-primary">Term & Conditions</Text> and <Text className="font-bold text-text-primary">Privacy Policy</Text>.
                    </Text>
                </TouchableOpacity>

                {/* Continue Button */}
                <TouchableOpacity 
                    onPress={handleContinue}
                    disabled={isLoading}
                    className="h-14 bg-[#2CAEA6] rounded-xl items-center justify-center mt-6 active:opacity-90 shadow-sm"
                >
                    {isLoading ? (
                        <ActivityIndicator color="white" />
                    ) : (
                        <Text className="text-white font-semibold text-lg">Continue</Text>
                    )}
                </TouchableOpacity>

                 {/* Back to Login link if needed here, or handle in parent */}
                 {/* <TouchableOpacity onPress={onBack} className="items-center mt-4 mb-2">
                     <Text className="text-text-secondary">Already have an account? <Text className="text-teal font-medium">Log in</Text></Text>
                 </TouchableOpacity> */}
            </View>
        </ScrollView>
    );
};
