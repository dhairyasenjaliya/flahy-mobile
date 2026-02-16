import { AlertCircle, Check, X } from 'lucide-react-native';
import React from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors } from '../theme/colors';

interface CustomAlertProps {
    visible: boolean;
    title: string;
    message: string;
    type?: 'success' | 'error' | 'info';
    onClose: () => void;
}

export const CustomAlert = ({ visible, title, message, type = 'info', onClose }: CustomAlertProps) => {
    
    const getIcon = () => {
        switch (type) {
            case 'success':
                return <Check size={40} color="white" />;
            case 'error':
                return <X size={40} color="white" />;
            default:
                return <AlertCircle size={40} color="white" />;
        }
    };

    const getColor = () => {
        switch (type) {
            case 'success':
                return '#10B981'; // Green
            case 'error':
                return '#EF4444'; // Red
            default:
                return colors.primary; // Brand Color
        }
    };

    return (
        <Modal
            transparent
            visible={visible}
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={styles.alertContainer}>
                    {/* Icon Header */}
                    <View style={[styles.iconContainer, { backgroundColor: getColor() }]}>
                        {getIcon()}
                    </View>

                    {/* Content */}
                    <View style={styles.content}>
                        <Text style={styles.title}>{title}</Text>
                        <Text style={styles.message}>{message}</Text>
                    </View>

                    {/* Button */}
                    <TouchableOpacity 
                        style={[styles.button, { backgroundColor: getColor() }]} 
                        onPress={onClose}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.buttonText}>Okay</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    alertContainer: {
        backgroundColor: 'white',
        width: '85%',
        borderRadius: 24,
        padding: 24,
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.30,
        shadowRadius: 4.65,
        elevation: 8,
    },
    iconContainer: {
        width: 72,
        height: 72,
        borderRadius: 36,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
        marginTop: -50, // Pull up to overlap/break out of box
        borderWidth: 4,
        borderColor: 'white',
    },
    content: {
        alignItems: 'center',
        marginBottom: 24,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: colors['text-primary'],
        marginBottom: 8,
        textAlign: 'center',
    },
    message: {
        fontSize: 16,
        color: colors['text-secondary'],
        textAlign: 'center',
        lineHeight: 22,
    },
    button: {
        width: '100%',
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    }
});
