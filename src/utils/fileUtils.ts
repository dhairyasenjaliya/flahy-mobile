import { Alert, Platform } from 'react-native';
import ReactNativeBlobUtil from 'react-native-blob-util';
import { useAuthStore } from '../store/authStore';

export const downloadAndOpenFile = async (url: string, fileName: string, mimeType: string = 'application/pdf') => {
    try {
        const token = useAuthStore.getState().token;
        if (!token) {
            Alert.alert("Error", "Authentication token not found");
            return;
        }

        const { dirs } = ReactNativeBlobUtil.fs;
        const extension = fileName.split('.').pop();
        // Use Cache Dir or Document Dir.
        // For opening widely, DocumentDir is safer on iOS.
        const path = Platform.select({
            ios: `${dirs.DocumentDir}/${fileName}`,
            android: `${dirs.DownloadDir}/${fileName}`
        }) || `${dirs.DocumentDir}/${fileName}`;

        const configOptions = Platform.select({
            ios: {
                fileCache: true,
                path: path,
                notification: true,
                useDownloadManager: true, // Not strictly iOS but good config
            },
            android: {
                fileCache: true,
                path: path,
                addAndroidDownloads: {
                    useDownloadManager: true,
                    notification: true,
                    title: `Downloading ${fileName}`,
                    description: 'Downloading file...',
                    mime: mimeType,
                    mediaScannable: true,
                },
            },
        });

        const res = await ReactNativeBlobUtil.config(configOptions || {})
            .fetch('GET', url, {
                Authorization: `Bearer ${token}`
            });

        const filePath = res.path();
        
        if (Platform.OS === 'ios') {
            ReactNativeBlobUtil.ios.openDocument(filePath);
        } else {
            ReactNativeBlobUtil.android.actionViewIntent(filePath, mimeType);
        }

        return filePath;

    } catch (error) {
        console.error("Download Error:", error);
        Alert.alert("Error", "Failed to download and open file.");
        throw error;
    }
};
