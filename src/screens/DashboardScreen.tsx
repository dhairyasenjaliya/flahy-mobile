import { pick, types } from '@react-native-documents/picker';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Bot, Camera, FileText, Upload } from 'lucide-react-native';
import React, { useState } from 'react';
import { Alert, PermissionsAndroid, Platform, ScrollView, Share, Text, TouchableOpacity, View } from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { DataList } from '../components/DataList';
import { Header } from '../components/Header';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { SearchInput } from '../components/SearchInput';
import { RootStackParamList } from '../navigation/types';

export const DashboardScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [searchText, setSearchText] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([]);

  const handleDownloadReport = () => {
    navigation.navigate('Reports');
  };

  const handleFlahyAI = () => {
    navigation.navigate('FlahyAI');
  };

  const handleDeleteFile = (fileToDelete: any) => {
      setUploadedFiles(prev => prev.filter(f => f.uri !== fileToDelete.uri));
  };

  const handleDownloadFile = async (file: any) => {
      try {
          await Share.share({
              url: file.uri,
              title: file.name,
          });
      } catch (error) {
          Alert.alert("Error", "Could not download file.");
      }
  };

  // Direct File Manager Upload
  const handleUpload = () => {
      Alert.alert(
          "Upload",
          "Choose source",
          [
              { text: "Files", onPress: pickDocument },
              { text: "Photos", onPress: pickImage },
              { text: "Cancel", style: "cancel" }
          ]
      );
  };

  const pickDocument = async () => {
    try {
      const results = await pick({
        type: [types.allFiles],
        allowMultiSelection: true,
      });
      if (results) {
        setUploadedFiles(prev => [...prev, ...results]);
      }
    } catch (err: any) {
       if (err.code === 'DOCUMENT_PICKER_CANCELED') {
           // ignore
           return;
       }
       console.error('Unknown Error: ', err);
    }
  };

  const pickImage = async () => {
      const result = await launchImageLibrary({
          mediaType: 'photo',
          selectionLimit: 0, // 0 = unlimited
      });

      if (result.assets) {
          const formattedFiles = result.assets.map(asset => ({
              uri: asset.uri,
              name: asset.fileName,
              type: asset.type,
              size: asset.fileSize,
          }));
          setUploadedFiles(prev => [...prev, ...formattedFiles]);
      }
  };

  const handleCamera = async () => {
    if (Platform.OS === 'android') {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.CAMERA,
                {
                    title: "Camera Permission",
                    message: "Flahy needs access to your camera to take photos.",
                    buttonNeutral: "Ask Me Later",
                    buttonNegative: "Cancel",
                    buttonPositive: "OK"
                }
            );
            if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
                Alert.alert("Permission Denied", "Camera permission is required to take photos.");
                return;
            }
        } catch (err) {
            console.warn(err);
            return;
        }
    }

    const result = await launchCamera({
        mediaType: 'photo',
        saveToPhotos: true,
    });

    if (result.assets) {
        const formattedFiles = result.assets.map(asset => ({
            uri: asset.uri,
            name: asset.fileName,
            type: asset.type,
            size: asset.fileSize,
        }));
        setUploadedFiles(prev => [...prev, ...formattedFiles]);
    }
  };

  return (
    <ScreenWrapper className="flex-1" edges={['top', 'left', 'right']}>
      {/* Scrollable Container */}
      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 100 }}>
        
        <Header />

        {/* Greeting & Search (Aligned) */}
        <View className="px-6 mt-4 mb-6 flex-row items-center justify-between gap-4">
            <View>
                <Text className="text-text-secondary font-medium text-sm">Good Morning,</Text>
                <Text className="text-text-primary font-bold text-2xl font-modern">Dhairya</Text>
            </View>
            <View className="flex-1 max-w-[200px]">
                 <SearchInput 
                    value={searchText} 
                    onChangeText={setSearchText} 
                    containerClassName="h-11 bg-white"
                    placeholder="Search files..."
                 />
            </View>
        </View>

        {/* Slick Action Row (Small Buttons) */}
        <View className="px-6">
            <View className="flex-row justify-between">
               {/* FlahyAI */}
               <TouchableOpacity 
                    onPress={handleFlahyAI}
                    className="w-[23%] aspect-[0.9] bg-white rounded-2xl p-2 items-center justify-center shadow-sm border border-gray-100 gap-1.5"
               >
                   <View className="w-10 h-10 rounded-full bg-indigo-50 items-center justify-center">
                       <Bot size={20} color="#6366f1" />
                   </View>
                   <Text className="text-text-primary font-bold text-xs text-center">AI Chat</Text>
               </TouchableOpacity>

               {/* Upload */}
               <TouchableOpacity 
                    onPress={handleUpload}
                    className="w-[23%] aspect-[0.9] bg-white rounded-2xl p-2 items-center justify-center shadow-sm border border-gray-100 gap-1.5"
               >
                   <View className="w-10 h-10 rounded-full bg-blue-50 items-center justify-center">
                       <Upload size={20} color="#3b82f6" />
                   </View>
                   <Text className="text-text-primary font-bold text-xs text-center">Upload</Text>
               </TouchableOpacity>

               {/* Reports */}
               <TouchableOpacity 
                    onPress={handleDownloadReport}
                    className="w-[23%] aspect-[0.9] bg-white rounded-2xl p-2 items-center justify-center shadow-sm border border-gray-100 gap-1.5"
               >
                   <View className="w-10 h-10 rounded-full bg-orange-50 items-center justify-center">
                       <FileText size={20} color="#f97316" />
                   </View>
                   <Text className="text-text-primary font-bold text-xs text-center">Reports</Text>
               </TouchableOpacity>

               {/* Camera */}
               <TouchableOpacity 
                    onPress={handleCamera}
                    className="w-[23%] aspect-[0.9] bg-white rounded-2xl p-2 items-center justify-center shadow-sm border border-gray-100 gap-1.5"
               >
                   <View className="w-10 h-10 rounded-full bg-emerald-50 items-center justify-center">
                       <Camera size={20} color="#10b981" />
                   </View>
                   <Text className="text-text-primary font-bold text-xs text-center">Scan</Text>
               </TouchableOpacity>
            </View>
        </View>

        {/* My Data Section */}
        <View className="mt-8">
            <DataList 
                data={uploadedFiles} 
                onDelete={handleDeleteFile}
                onDownload={handleDownloadFile}
            />
        </View>

      </ScrollView>
    </ScreenWrapper>
  );
};
