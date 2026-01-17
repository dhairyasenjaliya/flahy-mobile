import { pick, types } from '@react-native-documents/picker';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Camera, CloudUpload, FileText, Search, Sparkles, Sprout } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Image, PermissionsAndroid, Platform, RefreshControl, ScrollView, Share, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { DataList } from '../components/DataList';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { RootStackParamList } from '../navigation/types';
import { userService } from '../services/userService';
import { useAuthStore } from '../store/authStore';
import { colors } from '../theme/colors';

const USER_AVATAR = "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2.25&w=256&h=256&q=80";

export const DashboardScreen = () => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const [searchText, setSearchText] = useState("");
    const [uploadedFiles, setUploadedFiles] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const user = useAuthStore((state) => state.user);

    const fetchFiles = async () => {
        setIsLoading(true);
        try {
            const response = await userService.getFiles();
            console.log("🚀 ~ fetchFiles ~ response:", response)

            // Ensure we target the array in 'data'
            const list = Array.isArray(response.data) ? response.data : (response.data?.data || []);

            const mappedFiles = list.map((file: any) => ({
                id: file.id,
                name: file.file_name || file.clientName || 'Unknown',
                uri: file.report_url || file.filePath,
                type: file.extname || (file.file_name ? file.file_name.split('.').pop() : 'unknown'),
                size: file.size || 0,
                date: file.created_at || file.createdAt
            }));
            setUploadedFiles(mappedFiles);
        } catch (error) {
            console.error("Failed to fetch files", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchFiles();
    }, []);

    const handleDownloadReport = () => {
        navigation.navigate('Reports');
    };

    const handleFlahyAI = () => {
        navigation.navigate('FlahyAI');
    };

    const handleDeleteFile = (fileToDelete: any) => {
        Alert.alert(
            "Delete File",
            `Are you sure you want to delete ${fileToDelete.name}?`,
            [
                { text: "Cancel", style: "cancel" },
                { 
                    text: "Delete", 
                    style: "destructive",
                    onPress: async () => {
                        try {
                            setIsLoading(true);
                            await userService.deleteFile(fileToDelete.id);
                            // Optimistic update or refresh
                            const updatedList = uploadedFiles.filter(f => f.id !== fileToDelete.id);
                            setUploadedFiles(updatedList);
                            Alert.alert("Success", "File deleted successfully");
                            // fetchFiles(); // Optional: double check with server
                        } catch (error) {
                            console.error("Delete failed", error);
                            Alert.alert("Error", "Failed to delete file. Please try again.");
                        } finally {
                            setIsLoading(false);
                        }
                    }
                }
            ]
        );
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

    const uploadFileToServer = async (file: any) => {
        setIsUploading(true);
        try {
            const formData = new FormData();
            formData.append('file', {
                uri: file.uri,
                type: file.type,
                name: file.name,
            });

            await userService.uploadFile(formData);
            Alert.alert("Success", "File uploaded successfully");
            fetchFiles();
        } catch (error: any) {
            Alert.alert("Error", "Failed to upload file");
            console.error("Upload failed:", error);
            if (error.response) {
                console.error("Error response:", error.response.data);
                console.error("Error status:", error.response.status);
            }
        } finally {
            setIsUploading(false);
        }
    };

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
                allowMultiSelection: false,
            });
            if (results && results[0]) {
                const doc = results[0];

                console.log("Selected Doc:", doc);
                // Client-side validation to match API requirements
                const allowedExtensions = ['pdf', 'jpg', 'jpeg', 'png', 'dcm'];
                const extension = doc.name?.split('.').pop()?.toLowerCase();
                console.log("Detected Extension:", extension);

                if (!extension || !allowedExtensions.includes(extension)) {
                    // Alert.alert("Invalid File", `File type ${extension} not allowed. Only pdf, jpg, png, dcm.`);
                    // return;
                    console.log("Validation failed but proceeding for debugging...");
                }

                const file = {
                    uri: doc.uri,
                    name: doc.name || `document.${extension || 'pdf'}`,
                    type: doc.type || (extension === 'pdf' ? 'application/pdf' : 'application/octet-stream'),
                    size: doc.size
                };
                console.log("Picking Document:", file);
                uploadFileToServer(file);
            }
        } catch (err: any) {
            if (err.code === 'DOCUMENT_PICKER_CANCELED') return;
            console.error('Unknown Error: ', err);
        }
    };

    const pickImage = async () => {
        const result = await launchImageLibrary({
            mediaType: 'photo',
            selectionLimit: 1,
        });

        if (result.assets && result.assets[0]) {
            const asset = result.assets[0];
            const file = {
                uri: asset.uri,
                name: asset.fileName,
                type: asset.type,
                size: asset.fileSize,
            };
            uploadFileToServer(file);
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

        if (result.assets && result.assets[0]) {
            const asset = result.assets[0];
            const file = {
                uri: asset.uri,
                name: asset.fileName,
                type: asset.type,
                size: asset.fileSize,
            };
            uploadFileToServer(file);
        }
    };

    return (
        <ScreenWrapper className="flex-1 bg-background" edges={['top']}>
            <ScrollView
                className="flex-1"
                contentContainerStyle={{ paddingBottom: 100 }}
                refreshControl={<RefreshControl refreshing={isLoading} onRefresh={fetchFiles} />}
                showsVerticalScrollIndicator={false}
            >

                {/* Header Section */}
                <View className="px-6 pt-4 pb-2">
                    {/* Top Centered Logo */}
                    <View className="items-center flex-row justify-center mb-6">
                        <Sprout size={28} color={colors.primary} />
                        <Text className="text-text-primary text-xl font-bold tracking-widest font-modern ml-2">FLAHY</Text>
                    </View>
                    
                    {/* User Greeting and Avatar Row */}
                    <View className="flex-row justify-between items-center">
                        <View>
                             <Text className="text-text-primary font-bold text-lg">Hi {user?.first_name || 'User'}</Text>
                             <Text className="text-text-primary font-bold text-xl font-modern">Welcome to Dashboard</Text>
                        </View>
                        <TouchableOpacity 
                            onPress={() => navigation.navigate('Settings')}
                            className="rounded-full overflow-hidden"
                        >
                            <Image 
                                source={{ uri: USER_AVATAR }} 
                                className="w-12 h-12 rounded-full"
                                resizeMode="cover"
                            />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Search Bar */}
                <View className="px-6 mt-6 mb-8">
                    <View className="bg-white border border-gray-300 rounded-2xl h-12 flex-row items-center px-4 shadow-sm">
                        <Search size={20} color={colors['text-secondary']} />
                        <TextInput
                            className="flex-1 ml-3 text-base text-text-primary h-full"
                            placeholder="search..."
                            placeholderTextColor={colors['text-secondary']}
                            value={searchText}
                            onChangeText={setSearchText}
                        />
                    </View>
                </View>

                {/* Action Hero Section */}
                {/* Action Hero Section */}
                <View className="bg-[#E2F1E6] rounded-t-[40px] px-6 pt-8 pb-10 -mb-10 min-h-[500px]">

                    {/* Download Report Button */}
                    <TouchableOpacity
                        onPress={handleDownloadReport}
                        className="bg-teal w-full h-14 rounded-xl flex-row items-center justify-center mb-6 shadow-sm active:opacity-90"
                    >
                        <FileText size={20} color="white" />
                        <Text className="text-white font-semibold text-base ml-2">Download Your Flahy Report</Text>
                    </TouchableOpacity>

                    {/* Action Grid */}
                    <View className="flex-row justify-between gap-4 mb-8">
                        {/* FlahyAI */}
                        <TouchableOpacity
                            onPress={handleFlahyAI}
                            className="flex-1 aspect-square bg-teal rounded-xl items-center justify-center shadow-sm active:opacity-90"
                        >
                            <Sparkles size={28} color="white" />
                            <Text className="text-white font-medium text-sm mt-2">FlahyAI</Text>
                        </TouchableOpacity>

                        {/* Upload */}
                        <TouchableOpacity
                            onPress={handleUpload}
                            disabled={isUploading}
                            className="flex-1 aspect-square bg-teal rounded-xl items-center justify-center shadow-sm active:opacity-90"
                        >
                            {isUploading ? <ActivityIndicator color="white" /> : <CloudUpload size={28} color="white" />}
                            <Text className="text-white font-medium text-sm mt-2">Upload</Text>
                        </TouchableOpacity>

                        {/* Camera */}
                        <TouchableOpacity
                            onPress={handleCamera}
                            className="flex-1 aspect-square bg-teal rounded-xl items-center justify-center shadow-sm active:opacity-90"
                        >
                            <Camera size={28} color="white" />
                            <Text className="text-white font-medium text-sm mt-2">Camera</Text>
                        </TouchableOpacity>
                    </View>

                    {/* My Data Section Header in White Card Area */}
                    <View className="bg-white rounded-t-[40px] pt-8 min-h-[400px] shadow-sm -mx-6">
                        <DataList
                            data={uploadedFiles}
                            onDelete={handleDeleteFile}
                            onDownload={handleDownloadFile}
                            onPress={(file) => {
                                console.log('File clicked:', file.name);
                                navigation.navigate('FileViewer', { file });
                            }}
                            emptyMessage="No Data Found."
                        />
                    </View>

                </View>

            </ScrollView>
        </ScreenWrapper>
    );
};
