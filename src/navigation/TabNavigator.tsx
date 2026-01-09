import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home, Settings } from 'lucide-react-native';
import React from 'react';
import { DashboardScreen } from '../screens/DashboardScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { colors } from '../theme/colors';
import { MainTabParamList } from './types';

const Tab = createBottomTabNavigator<MainTabParamList>();

export const TabNavigator = () => {
  return (
    <Tab.Navigator
        screenOptions={{
            headerShown: false,
            tabBarActiveTintColor: colors.primary,
            tabBarInactiveTintColor: colors['text-secondary'],
            tabBarStyle: {
                borderTopColor: '#E0E7ED',
                paddingTop: 5,
            }
        }}
    >
      <Tab.Screen 
        name="Dashboard" 
        component={DashboardScreen}
        options={{
            tabBarIcon: ({ color, size }) => <Home color={color} size={size} />
        }} 
      />
      {/* <Tab.Screen 
        name="Reports" 
        component={ReportsScreen}
        options={{
            tabBarIcon: ({ color, size }) => <FileText color={color} size={size} />
        }} 
      /> */}
      <Tab.Screen 
        name="Settings" 
        component={SettingsScreen} 
        options={{
            tabBarIcon: ({ color, size }) => <Settings color={color} size={size} />
        }} 
      />
    </Tab.Navigator>
  );
};
