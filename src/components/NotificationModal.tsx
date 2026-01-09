import { X } from 'lucide-react-native';
import React from 'react';
import { Modal, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { colors } from '../theme/colors';

interface NotificationModalProps {
    visible: boolean;
    onClose: () => void;
}

const NOTIFICATIONS = [
    {
        id: '1',
        title: 'Report generated',
        message: 'Your Report has been generated.',
        date: 'Dec 24, 2025, 01:38 PM',
        read: false,
    },
    {
        id: '2',
        title: 'Order received',
        message: 'This is to confirm that Flahy has received your order.',
        date: 'Dec 24, 2025, 01:31 PM',
        read: false,
    }
];

export const NotificationModal = ({ visible, onClose }: NotificationModalProps) => {
    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View className="flex-1 bg-black/30 flex-row justify-end">
                <TouchableOpacity className="absolute inset-0" onPress={onClose} activeOpacity={1} />
                
                {/* Sidebar Content */}
                <View className="w-[85%] sm:w-[400px] bg-white h-full pt-12 shadow-xl">
                    <View className="flex-row justify-between items-center px-5 pb-4 border-b border-gray-100 bg-gray-50">
                        <Text className="text-lg font-bold text-text-primary">Notification</Text>
                        <TouchableOpacity onPress={onClose} className="p-1">
                            <X size={24} color={colors['text-secondary']} />
                        </TouchableOpacity>
                    </View>

                    <ScrollView className="flex-1 px-4 pt-4">
                        {NOTIFICATIONS.map((item) => (
                            <View key={item.id} className="bg-card p-4 rounded-lg mb-3 border border-gray-100 shadow-sm flex-row items-start">
                                <View className="w-2 h-2 rounded-full bg-teal mt-2 mr-3" />
                                <View className="flex-1">
                                    <Text className="font-semibold text-text-primary mb-1">{item.title}</Text>
                                    <Text className="text-text-secondary text-sm leading-5 mb-2">{item.message}</Text>
                                    <Text className="text-xs text-gray-400">{item.date}</Text>
                                </View>
                            </View>
                        ))}
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
};
