import { Calendar as CalendarIcon, X } from 'lucide-react-native';
import React, { useState } from 'react';
import { Modal, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Calendar, DateData } from 'react-native-calendars';

interface SupplementIntakeModalProps {
    visible: boolean;
    onClose: () => void;
    onSubmit: (data: { name: string; dob: string; phone: string }) => void;
}

export const SupplementIntakeModal: React.FC<SupplementIntakeModalProps> = ({ visible, onClose, onSubmit }) => {
    const [name, setName] = useState('');
    const [dob, setDob] = useState('');
    const [phone, setPhone] = useState('');
    const [showCalendar, setShowCalendar] = useState(false);

    const handleSave = () => {
        onSubmit({ name, dob, phone });
        // Reset form
        setName('');
        setDob('');
        setPhone('');
        onClose();
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
            <View className="flex-1 bg-black/50 justify-center items-center px-4">
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
                        <Text className="text-gray-800 text-base font-medium mb-2">Name</Text>
                        <TextInput
                            value={name}
                            onChangeText={setName}
                            placeholder="John"
                            className="bg-white border border-gray-300 rounded-xl px-4 py-3 text-gray-800 text-base"
                            placeholderTextColor="#9CA3AF"
                        />
                    </View>

                    {/* Date of Birth */}
                    <View className="mb-4 z-20">
                        <Text className="text-gray-800 text-base font-medium mb-2">Date of Birth</Text>
                        <TouchableOpacity 
                            onPress={() => setShowCalendar(!showCalendar)}
                            className="flex-row items-center border border-gray-300 rounded-xl px-4 py-3 bg-white"
                        >
                            <Text className={`flex-1 text-base ${dob ? 'text-gray-800' : 'text-gray-400'}`}>
                                {dob || 'Select Date'}
                            </Text>
                            <CalendarIcon size={20} color="#000" />
                        </TouchableOpacity>
                        
                        {/* Inline Calendar Popover */}
                        {showCalendar && (
                            <View className="absolute top-20 left-0 right-0 bg-white border border-gray-200 rounded-xl shadow-lg z-50 p-2">
                                <Calendar
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
                        <Text className="text-gray-800 text-base font-medium mb-2">Phone Number</Text>
                        <TextInput
                            value={phone}
                            onChangeText={setPhone}
                            placeholder="12 3456 789"
                            keyboardType="phone-pad"
                            className="bg-white border border-gray-300 rounded-xl px-4 py-3 text-gray-800 text-base"
                            placeholderTextColor="#9CA3AF"
                        />
                    </View>

                    {/* Save Button */}
                    <TouchableOpacity
                        onPress={handleSave}
                        className="bg-[#4FB5B0] w-full py-4 rounded-xl items-center shadow-sm active:opacity-90"
                    >
                        <Text className="text-white text-lg font-bold">Save</Text>
                    </TouchableOpacity>

                </View>
            </View>
        </Modal>
    );
};
