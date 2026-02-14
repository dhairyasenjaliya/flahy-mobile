import { ArrowLeft, Download, FileText, Share2 } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, Platform, Share, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import ReactNativeBlobUtil from 'react-native-blob-util';
import FastImage from 'react-native-fast-image';
import { SafeAreaView } from 'react-native-safe-area-context';
import WebView from 'react-native-webview';
import { API_BASE_URL } from '../config';
import { useAuthStore } from '../store/authStore';
import { colors } from '../theme/colors';

const { width, height } = Dimensions.get('window');

const getFullUrl = (uri: string) => {
    if (!uri) return '';
    if (uri.startsWith('http://') || uri.startsWith('https://')) return uri;
    // Relative path — prepend base URL
    return `${API_BASE_URL}${uri.startsWith('/') ? '' : '/'}${uri}`;
};

export const FileViewerScreen = ({ route, navigation }: any) => {
    const { file } = route.params;
    const token = useAuthStore((s) => s.token);

    const fileExt = file.name?.split('.').pop()?.toLowerCase();
    const isPdf = file.type?.toLowerCase().includes('pdf') || fileExt === 'pdf';
    const isImage = !isPdf && (file.type?.toLowerCase().includes('image') || ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(fileExt));

    const fullUri = getFullUrl(file.uri);

    // For images: FastImage handles auth headers directly, no download needed
    // For PDFs: download first, then display
    const [localPath, setLocalPath] = useState<string | null>(null);
    const [isDownloading, setIsDownloading] = useState(false);
    const [imageLoading, setImageLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!isImage) {
            downloadFile();
        }
    }, []);

    const downloadFile = async () => {
        setIsDownloading(true);
        setError(null);
        try {
            const { dirs } = ReactNativeBlobUtil.fs;
            const fileName = file.name || `file_${Date.now()}.${fileExt || 'pdf'}`;
            const cachePath = `${dirs.CacheDir}/${fileName}`;

            console.log('Downloading file from:', fullUri);

            const res = await ReactNativeBlobUtil.config({
                fileCache: true,
                path: cachePath,
            }).fetch('GET', fullUri, {
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            });

            const status = res.info().status;
            console.log('Download status:', status);

            if (status >= 200 && status < 300) {
                const path = res.path();
                setLocalPath(Platform.OS === 'ios' ? path : `file://${path}`);
            } else {
                setError(`Server returned status ${status}`);
            }
        } catch (err: any) {
            console.error('File download error:', err);
            setError('Failed to load file. Please try again.');
        } finally {
            setIsDownloading(false);
        }
    };

    const handleShare = async () => {
        try {
            await Share.share({
                url: localPath || fullUri,
                title: file.name,
                message: `Check out this file: ${file.name}`,
            });
        } catch (err) {
            console.error(err);
        }
    };

    const handleOpenNative = async () => {
        // For images, download first if we haven't already
        let pathToOpen = localPath;
        if (!pathToOpen && isImage) {
            try {
                const { dirs } = ReactNativeBlobUtil.fs;
                const fileName = file.name || `file_${Date.now()}.${fileExt || 'jpg'}`;
                const cachePath = `${dirs.CacheDir}/${fileName}`;
                const res = await ReactNativeBlobUtil.config({
                    fileCache: true,
                    path: cachePath,
                }).fetch('GET', fullUri, {
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                });
                pathToOpen = res.path();
            } catch (err) {
                console.error('Download for native open error:', err);
                return;
            }
        }
        if (!pathToOpen) return;

        try {
            const cleanPath = pathToOpen.replace('file://', '');
            const mime = isPdf ? 'application/pdf' : 'image/jpeg';
            if (Platform.OS === 'ios') {
                ReactNativeBlobUtil.ios.openDocument(cleanPath);
            } else {
                ReactNativeBlobUtil.android.actionViewIntent(cleanPath, mime);
            }
        } catch (err) {
            console.error('Open native error:', err);
        }
    };

    const renderContent = () => {
        // Image: use FastImage directly with auth headers
        if (isImage) {
            return (
                <View style={{ flex: 1, width }}>
                    {imageLoading && (
                        <View style={[s.centered, StyleSheet.absoluteFill, { zIndex: 1 }]}>
                            <ActivityIndicator size="large" color={colors.primary} />
                            <Text style={s.loadingText}>Loading image...</Text>
                        </View>
                    )}
                    {error ? (
                        <View style={s.centered}>
                            <View style={s.errorIcon}>
                                <FileText size={40} color={colors['text-secondary']} />
                            </View>
                            <Text style={s.errorTitle}>Unable to load image</Text>
                            <Text style={s.errorSub}>{error}</Text>
                            <TouchableOpacity style={s.retryBtn} onPress={() => { setError(null); setImageLoading(true); }}>
                                <Text style={s.retryText}>Retry</Text>
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <FastImage
                            source={{
                                uri: fullUri,
                                headers: token ? { Authorization: `Bearer ${token}` } : {},
                                priority: FastImage.priority.high,
                            }}
                            style={{ width, height: height * 0.8 }}
                            resizeMode={FastImage.resizeMode.contain}
                            onLoadEnd={() => setImageLoading(false)}
                            onError={() => {
                                setImageLoading(false);
                                setError('Failed to load image.');
                            }}
                        />
                    )}
                </View>
            );
        }

        // PDF / other files: need download first
        if (isDownloading) {
            return (
                <View style={s.centered}>
                    <ActivityIndicator size="large" color={colors.primary} />
                    <Text style={s.loadingText}>Loading file...</Text>
                </View>
            );
        }

        if (error || !localPath) {
            return (
                <View style={s.centered}>
                    <View style={s.errorIcon}>
                        <FileText size={40} color={colors['text-secondary']} />
                    </View>
                    <Text style={s.errorTitle}>Unable to load file</Text>
                    <Text style={s.errorSub}>{error || 'Something went wrong.'}</Text>
                    <TouchableOpacity style={s.retryBtn} onPress={downloadFile}>
                        <Text style={s.retryText}>Retry</Text>
                    </TouchableOpacity>
                </View>
            );
        }

        if (isPdf) {
            if (Platform.OS === 'ios') {
                return (
                    <WebView
                        source={{ uri: localPath }}
                        style={{ flex: 1, width }}
                        startInLoadingState
                        renderLoading={() => (
                            <View style={[s.centered, StyleSheet.absoluteFill]}>
                                <ActivityIndicator size="large" color={colors.primary} />
                            </View>
                        )}
                        onError={(e) => {
                            console.error('WebView error:', e.nativeEvent);
                            setError('Failed to render PDF.');
                        }}
                    />
                );
            }

            // Android: open natively (most reliable for PDFs)
            return (
                <View style={s.centered}>
                    <View style={s.pdfPreview}>
                        <Text style={s.pdfLabel}>PDF</Text>
                        <FileText size={36} color="#EF4444" />
                    </View>
                    <Text style={s.pdfName} numberOfLines={2}>{file.name}</Text>
                    <Text style={s.pdfHint}>Tap below to open in your PDF viewer</Text>
                    <TouchableOpacity style={s.openBtn} onPress={handleOpenNative}>
                        <Download size={18} color="white" />
                        <Text style={s.openBtnText}>Open PDF</Text>
                    </TouchableOpacity>
                </View>
            );
        }

        // Fallback: try WebView
        return (
            <WebView
                source={{ uri: localPath }}
                style={{ flex: 1, width }}
                startInLoadingState
                renderLoading={() => (
                    <View style={[s.centered, StyleSheet.absoluteFill]}>
                        <ActivityIndicator size="large" color={colors.primary} />
                    </View>
                )}
            />
        );
    };

    return (
        <SafeAreaView style={s.container} edges={['top', 'bottom']}>
            {/* Header */}
            <View style={s.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={s.headerBtn}>
                    <ArrowLeft size={22} color="white" />
                </TouchableOpacity>

                <Text style={s.headerTitle} numberOfLines={1}>{file.name}</Text>

                <View style={s.headerActions}>
                    <TouchableOpacity onPress={handleOpenNative} style={[s.headerBtn, { backgroundColor: colors.teal }]}>
                        <Download size={18} color="white" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleShare} style={s.headerBtn}>
                        <Share2 size={18} color="white" />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Content */}
            <View style={s.content}>
                {renderContent()}
            </View>
        </SafeAreaView>
    );
};

const s = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#111',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: 'rgba(0,0,0,0.6)',
    },
    headerBtn: {
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.15)',
    },
    headerTitle: {
        flex: 1,
        color: 'white',
        fontWeight: '500',
        fontSize: 15,
        textAlign: 'center',
        marginHorizontal: 12,
    },
    headerActions: {
        flexDirection: 'row',
        gap: 8,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#111',
    },
    centered: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 32,
    },
    loadingText: {
        color: '#999',
        fontSize: 14,
        marginTop: 16,
    },
    errorIcon: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: 'rgba(255,255,255,0.08)',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
    },
    errorTitle: {
        color: 'white',
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 8,
    },
    errorSub: {
        color: '#999',
        fontSize: 14,
        textAlign: 'center',
        marginBottom: 24,
    },
    retryBtn: {
        backgroundColor: colors.teal,
        paddingHorizontal: 32,
        paddingVertical: 12,
        borderRadius: 12,
    },
    retryText: {
        color: 'white',
        fontWeight: '600',
        fontSize: 15,
    },
    pdfPreview: {
        width: 100,
        height: 130,
        backgroundColor: 'rgba(255,255,255,0.08)',
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.12)',
        marginBottom: 20,
    },
    pdfLabel: {
        color: '#EF4444',
        fontWeight: '800',
        fontSize: 13,
        marginBottom: 8,
    },
    pdfName: {
        color: 'white',
        fontSize: 17,
        fontWeight: '600',
        textAlign: 'center',
        marginBottom: 8,
        paddingHorizontal: 24,
    },
    pdfHint: {
        color: '#888',
        fontSize: 13,
        marginBottom: 28,
    },
    openBtn: {
        backgroundColor: colors.teal,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 28,
        paddingVertical: 14,
        borderRadius: 30,
        gap: 10,
    },
    openBtnText: {
        color: 'white',
        fontWeight: '700',
        fontSize: 15,
    },
});
