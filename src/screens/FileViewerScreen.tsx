import { ArrowLeft, Download, Share2 } from 'lucide-react-native';
import React, { useState } from 'react';
import { ActivityIndicator, Dimensions, Image, Platform, Share, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import WebView from 'react-native-webview';
import { colors } from '../theme/colors';
import { downloadAndOpenFile } from '../utils/fileUtils';

const { width, height } = Dimensions.get('window');

export const FileViewerScreen = ({ route, navigation }: any) => {
    const { file } = route.params;
    const [isLoading, setIsLoading] = useState(true);

    const fileExt = file.name?.split('.').pop()?.toLowerCase();
    const isPdf = file.type?.toLowerCase().includes('pdf') || fileExt === 'pdf';
    const isImage = !isPdf && (file.type?.toLowerCase().includes('image') ||  ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(fileExt));

    const handleShare = async () => {
        try {
            await Share.share({
                url: file.uri,
                title: file.name,
                message: `Check out this file: ${file.name}`
            });
        } catch (error) {
            console.error(error);
        }
    };

    const handleDownload = async () => {
        try {
            // Use the secure download helper
            setIsLoading(true); // Reuse isLoading or add a specific one? Reusing is fine if it covers the UI.
            await downloadAndOpenFile(file.uri, file.name, isPdf ? 'application/pdf' : 'image/jpeg'); // guessing mime if not PDF
        } catch (error) {
            // Alert handled in helper
        } finally {
            setIsLoading(false);
        }
    };

    const getViewUrl = () => {
        if (isImage) return file.uri;
        // Basic fallback for unknown types or specific docs
        if (isPdf) {
             // For Android, Google Docs is good for viewing.
             // For iOS, WebView handles PDF natively nicely.
             if(Platform.OS === 'android') {
                 return `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(file.uri)}`;
             }
             return file.uri;
        }
        return `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(file.uri)}`;
    };

    return (
        <SafeAreaView className="flex-1 bg-black" edges={['top', 'bottom']}>
            {/* Header */}
            <View className="flex-row items-center justify-between px-4 py-3 bg-black/50 absolute top-10 left-0 right-0 z-50">
                <TouchableOpacity 
                    onPress={() => navigation.goBack()}
                    className="w-10 h-10 items-center justify-center rounded-full bg-white/20"
                >
                    <ArrowLeft size={24} color="white" />
                </TouchableOpacity>

                <Text className="text-white font-medium text-base flex-1 mx-4 text-center" numberOfLines={1}>
                    {file.name}
                </Text>

                <View className="flex-row gap-2">
                    {/* Explicit Download for PDFs */}
                    {isPdf && (
                         <TouchableOpacity 
                            onPress={handleDownload}
                            className="w-10 h-10 items-center justify-center rounded-full bg-teal"
                        >
                            <Download size={20} color="white" />
                        </TouchableOpacity>
                    )}
                    <TouchableOpacity 
                        onPress={handleShare}
                        className="w-10 h-10 items-center justify-center rounded-full bg-white/20"
                    >
                        <Share2 size={20} color="white" />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Content */}
            <View className="flex-1 justify-center bg-black items-center">
                {isImage ? (
                    <Image
                        source={{ uri: file.uri }}
                        style={{ width, height: height * 0.8 }}
                        resizeMode="contain"
                    />
                ) : isPdf ? (
                    <View className="items-center justify-center px-6">
                        <View className="w-24 h-32 bg-white/10 rounded-xl items-center justify-center mb-6 border border-white/20">
                             <Text className="text-red-500 font-bold text-xl mb-2">PDF</Text>
                        </View>
                        <Text className="text-white text-lg font-medium text-center mb-2">{file.name}</Text>
                        <Text className="text-gray-400 text-sm mb-8 text-center px-8">
                            This document is a PDF. Open it in your default viewer for the best experience.
                        </Text>
                        
                        <TouchableOpacity 
                            onPress={handleDownload}
                            className="bg-teal px-8 py-4 rounded-full flex-row items-center active:opacity-90"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <ActivityIndicator color="white" className="mr-2" />
                            ) : (
                                <Download size={20} color="white" className="mr-2" />
                            )}
                            <Text className="text-white font-bold text-base ml-2">
                                {isLoading ? "Downloading..." : "Open PDF"}
                            </Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <WebView
                        source={{ uri: getViewUrl() }}
                        className="flex-1 w-full"
                        startInLoadingState={true}
                        renderLoading={() => (
                            <View className="absolute inset-0 items-center justify-center bg-black">
                                <ActivityIndicator size="large" color={colors.primary} />
                            </View>
                        )}
                        onError={(err) => console.error("WebView Error:", err.nativeEvent)}
                    />
                )}
            </View>
        </SafeAreaView>
    );
};
