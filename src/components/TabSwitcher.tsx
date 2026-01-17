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
    <View style={{ backgroundColor: '#E5E7EB', borderRadius: 12, padding: 4, flexDirection: 'row', height: 48, marginBottom: 24 }}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab;
        return (
          <TouchableOpacity
            key={tab}
            onPress={() => onTabChange(tab)}
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 8,
              backgroundColor: isActive ? '#2CAEA6' : 'transparent', // Using teal hex from previous files
              shadowColor: isActive ? '#000' : undefined,
              shadowOffset: isActive ? { width: 0, height: 1 } : undefined,
              shadowOpacity: isActive ? 0.1 : undefined,
              shadowRadius: isActive ? 2 : undefined,
              elevation: isActive ? 1 : undefined
            }}
          >
            <Text 
              style={{
                fontWeight: '500',
                fontSize: 14,
                color: isActive ? 'white' : '#6C7074' // text-secondary
              }}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};
