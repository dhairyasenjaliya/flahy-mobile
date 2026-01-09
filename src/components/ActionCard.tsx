import { LucideIcon } from 'lucide-react-native';
import React from 'react';
import { Image, ImageSourcePropType, Text, TouchableOpacity, View } from 'react-native';
import { colors } from '../theme/colors';

interface ActionCardProps {
  title: string;
  onPress: () => void;
  icon?: LucideIcon;
  image?: ImageSourcePropType; // Fallback for custom asset images
  bgColor?: string; // Optional custom bg (like the green one)
}

export const ActionCard = ({ title, onPress, icon: Icon, image, bgColor }: ActionCardProps) => {
  return (
    <TouchableOpacity 
      onPress={onPress}
      className={`flex-1 p-5 rounded-3xl justify-between items-center shadow-md border-[0.5px] border-gray-100 ${bgColor ? '' : 'bg-card'}`}
      style={bgColor ? { backgroundColor: bgColor } : {}}
      activeOpacity={0.7}
    >
      <View className="flex-1 justify-center items-center">
        <View className="w-14 h-14 rounded-full bg-primary/5 items-center justify-center mb-2">
            {Icon ? (
            <Icon size={28} color={colors.primary} />
            ) : image ? (
            <Image source={image} className="w-10 h-10" resizeMode="contain" />
            ) : null}
        </View>
      </View>
      <Text className="text-text-primary text-center font-semibold text-sm leading-5 mb-1">
        {title}
      </Text>
    </TouchableOpacity>
  );
};
