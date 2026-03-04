import { Calendar as CalendarIcon, X } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Keyboard, KeyboardAvoidingView, Modal, Platform, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { Calendar, DateData } from 'react-native-calendars';
import { userService } from '../services/userService';
import { useAuthStore } from '../store/authStore';
import { CustomInput } from './CustomInput';

interface SupplementIntakeModalProps {
    visible: boolean;
    onClose: () => void;
    onSubmit: (data: { name: string; dob: string; phone: string; message: string }) => void;
}

const formatDOB = (dateStr: any): string => {
    if (!dateStr) return '';

    // Coerce non-string values (Date objects, Timestamps, etc.) to ISO string
    if (typeof dateStr !== 'string') {
        try {
            const d = dateStr instanceof Date ? dateStr : new Date(dateStr);
            if (!isNaN(d.getTime())) return d.toISOString().split('T')[0];
        } catch {}
        return '';
    }

    // 1. Already YYYY-MM-DD?
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;

    // 2. YYYY-MM-DD followed by time (T or space separator)
    const ymdMatch = dateStr.match(/^(\d{4}-\d{2}-\d{2})[T\s]/);
    if (ymdMatch) return ymdMatch[1];

    // 3. DD-MM-YYYY or DD/MM/YYYY
    const dmyMatch = dateStr.match(/^(\d{1,2})[-\/](\d{1,2})[-\/](\d{4})/);
    if (dmyMatch) {
         return `${dmyMatch[3]}-${dmyMatch[2].padStart(2, '0')}-${dmyMatch[1].padStart(2, '0')}`;
    }

    try {
        const d = new Date(dateStr);
        if (!isNaN(d.getTime())) {
            if (dateStr.includes('GMT') || dateStr.includes('UTC') || dateStr.endsWith('Z')) {
                return d.toISOString().split('T')[0];
            } else {
                const year = d.getFullYear();
                const month = String(d.getMonth() + 1).padStart(2, '0');
                const day = String(d.getDate()).padStart(2, '0');
                return `${year}-${month}-${day}`;
            }
        }
    } catch {}

    return '';
};

const displayDate = (ymd: string): string => {
    if (!ymd || !/^\d{4}-\d{2}-\d{2}$/.test(ymd)) return ymd || '';
    const [year, month, day] = ymd.split('-');
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    return `${parseInt(day, 10)} ${months[parseInt(month, 10) - 1]} ${year}`;
};

export const SupplementIntakeModal: React.FC<SupplementIntakeModalProps> = ({ visible, onClose, onSubmit }) => {
    const [name, setName] = useState('');
    const [dob, setDob] = useState('');
    const [phone, setPhone] = useState('');
    const [showCalendar, setShowCalendar] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const user = useAuthStore((state) => state.user);

    useEffect(() => {
        if (visible && user) {
            if (!name && user.first_name) {
                setName(`${user.first_name} ${user.last_name || ''}`.trim());
            }
            if (!dob && user.date_of_birth) {
                setDob(formatDOB(user.date_of_birth));
            }
            if (!phone && user.contact) {
                setPhone(user.contact);
            }
        }
    }, [visible, user, name, dob, phone]);

    const handleSave = async () => {
        if (!name || !dob || !phone) {
            Alert.alert('Required', 'Please fill out all fields.');
            return;
        }

        setIsLoading(true);
        try {
            const response = await userService.requestSupplement({ name, dob, phone });
            console.log("Supplement request API success:", response);
            // Close modal first
            onClose();
            // Call success handler logic back to parent screen for avoiding stacked modals lag
            setTimeout(() => {
                onSubmit({ 
                    name, 
                    dob, 
                    phone,
                    message: response?.msg || response?.message || "Your request has been submitted successfully."
                });
            }, 300); // give the modal 300ms to visually dismiss
            
            // Reset form
            setName('');
            setDob('');
            setPhone('');
        } catch (error) {
            console.error("Supplement request failed:", error);
            Alert.alert("Error", "Failed to submit request. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const onDayPress = (day: DateData) => {
        setDob(day.dateString);
        setShowCalendar(false);
    };

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className="flex-1"
            >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View className="flex-1 bg-black/50 justify-center items-center px-4">
                    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                        <View className="bg-white rounded-3xl w-full max-w-sm p-6 relative">
                    {/* Close Button */}
                    <TouchableOpacity 
                        onPress={onClose}
                        className="absolute top-4 right-4 z-10"
                    >
                        <X size={24} color="#000" />
                    </TouchableOpacity>

                    {/* Header Text */}
                    <Text className="text-base text-gray-800 mb-6 pr-6 leading-6">
                        Please fill out the form below, and someone from our team will call you regarding ordering supplements based on your report.
                    </Text>

                    {/* Form Fields */}
                    
                    {/* Name */}
                    <View className="mb-4">
                        <CustomInput
                            label="Name"
                            value={name}
                            onChangeText={setName}
                            placeholder="John"
                            returnKeyType="done"
                        />
                    </View>

                    {/* Date of Birth */}
                    <View className="mb-4 z-20">
                        <Text style={{ color: '#1B2C3F', fontWeight: '500', fontSize: 16, marginBottom: 8 }}>Date of Birth</Text>
                        <TouchableOpacity
                            onPress={() => setShowCalendar(!showCalendar)}
                            className="flex-row items-center rounded-xl px-4 bg-white"
                            style={{ height: 56, borderWidth: 1, borderColor: '#9CA3AF', borderRadius: 12 }}
                        >
                            <Text className={`flex-1 text-base ${dob ? 'text-gray-800' : 'text-gray-400'}`}>
                                {dob ? displayDate(dob) : 'Select Date'}
                            </Text>
                            <CalendarIcon size={20} color="#000" />
                        </TouchableOpacity>
                        
                        {/* Inline Calendar Popover */}
                        {showCalendar && (
                            <View className="absolute top-20 left-0 right-0 bg-white border border-gray-200 rounded-xl shadow-lg z-50 p-2">
                                <Calendar
                                    current={dob && /^\d{4}-\d{2}-\d{2}$/.test(dob) ? dob : undefined}
                                    markedDates={
                                        dob && /^\d{4}-\d{2}-\d{2}$/.test(dob) ? {
                                            [dob]: { selected: true, selectedColor: '#4FB5B0' }
                                        } : undefined
                                    }
                                    onDayPress={onDayPress}
                                    maxDate={new Date().toISOString().split('T')[0]} // Past dates only for DOB
                                    theme={{
                                        selectedDayBackgroundColor: '#4FB5B0',
                                        todayTextColor: '#4FB5B0',
                                        arrowColor: '#4FB5B0',
                                    }}
                                />
                            </View>
                        )}
                    </View>

                    {/* Phone Number */}
                    <View className="mb-8">
                        <CustomInput
                            label="Phone Number"
                            value={phone}
                            onChangeText={setPhone}
                            placeholder="12 3456 789"
                            keyboardType="phone-pad"
                            returnKeyType="done"
                        />
                    </View>

                    {/* Save Button */}
                    <TouchableOpacity
                        onPress={handleSave}
                        disabled={isLoading}
                        className={`w-full py-4 rounded-xl items-center shadow-sm active:opacity-90 ${isLoading ? 'bg-gray-400' : 'bg-[#4FB5B0]'}`}
                    >
                        {isLoading ? (
                            <ActivityIndicator color="white" />
                        ) : (
                            <Text className="text-white text-lg font-bold">Save</Text>
                        )}
                    </TouchableOpacity>

                    </View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </Modal>
    );
};
