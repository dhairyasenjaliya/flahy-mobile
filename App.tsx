import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import './global.css';
import { RootNavigator } from './src/navigation/RootNavigator';

const App = () => {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
        <RootNavigator />
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default App;
