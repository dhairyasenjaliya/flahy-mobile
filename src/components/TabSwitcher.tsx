import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface TabSwitcherProps {
  tabs: string[];
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const TabSwitcher: React.FC<TabSwitcherProps> = ({ 
  tabs, 
  activeTab, 
  onTabChange 
}) => {
  return (
    <View className="bg-gray-200 rounded-xl p-1 flex-row h-12 mb-6">
      {tabs.map((tab) => {
        const isActive = activeTab === tab;
        return (
          <TouchableOpacity
            key={tab}
            onPress={() => onTabChange(tab)}
            className={`flex-1 items-center justify-center rounded-lg ${
              isActive ? 'bg-teal shadow-sm' : 'bg-transparent'
            }`}
          >
            <Text 
              className={`font-medium text-sm ${
                isActive ? 'text-white' : 'text-text-secondary'
              }`}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};
