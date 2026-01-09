import { Search } from 'lucide-react-native';
import React from 'react';
import { TextInput, View } from 'react-native';
import { colors } from '../theme/colors';

interface SearchInputProps {
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  containerClassName?: string;
}

export const SearchInput = ({ placeholder = "Search", value, onChangeText, containerClassName }: SearchInputProps) => {
  return (
    <View className={`flex-row items-center bg-input rounded-2xl px-4 py-2 shadow-sm border border-transparent focus:border-primary ${containerClassName}`}>
      <Search size={18} color={colors["text-secondary"]} />
      <TextInput 
        className="flex-1 ml-2 text-text-primary text-sm font-medium p-0 leading-5"
        placeholder={placeholder}
        placeholderTextColor={colors["text-secondary"]}
        value={value}
        onChangeText={onChangeText}
      />
    </View>
  );
};
