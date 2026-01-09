import { ChevronLeft } from 'lucide-react-native';
import React, { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { NotificationModal } from './NotificationModal';

interface HeaderProps {
    showBack?: boolean;
    onBack?: () => void;
}

export const Header = ({ showBack, onBack }: HeaderProps) => {
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  return (
    <>
      <View className="flex-row justify-center items-center px-5 py-3 bg-white border-b border-gray-100 relative">
        {showBack && (
            <TouchableOpacity 
                onPress={onBack}
                className="absolute left-5 p-1 rounded-full bg-gray-50"
            >
                <ChevronLeft size={24} color="#1f2937" />
            </TouchableOpacity>
        )}

        <Text className="text-primary font-bold text-2xl tracking-[0.2em] font-modern">FLAHY</Text>

      </View>

      <NotificationModal
        visible={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
      />
    </>
  );
};
