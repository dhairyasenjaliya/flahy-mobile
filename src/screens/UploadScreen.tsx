import { useNavigation } from '@react-navigation/native';
import { ArrowLeft } from 'lucide-react-native';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Header } from '../components/Header';

export const UploadScreen = () => {
    const navigation = useNavigation();

    return (
        <View className="flex-1 bg-background">
            <Header />
            <View className="p-5">
                <TouchableOpacity onPress={() => navigation.goBack()} className="flex-row items-center mb-4">
                    <ArrowLeft size={24} color="#1B2C3F" />
                    <Text className="ml-2 text-lg font-medium text-text-primary">Back</Text>
                </TouchableOpacity>

                <View className="bg-white p-6 rounded-xl shadow-sm items-center justify-center min-h-[300px]">
                    <Text className="text-xl font-medium text-text-primary mb-2">Upload Files</Text>
                    <Text className="text-text-secondary text-center">
                        Drop your files here or click to browse. Represents the drag-and-drop zone.
                    </Text>
                </View>
            </View>
        </View>
    )
}
