import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ArrowDownToLine, FileText, X } from 'lucide-react-native';
import React from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { RootStackParamList } from '../navigation/types';
import { colors } from '../theme/colors';

type ReportsScreenProps = NativeStackScreenProps<RootStackParamList, 'Reports'>;

interface ReportFile {
    id: string;
    name: string;
    date: string;
    size: string;
    type: 'pdf' | 'doc';
}

const DUMMY_REPORTS: ReportFile[] = [
    { id: '1', name: 'Annual Health Checkup 2024.pdf', date: 'Jan 15, 2024', size: '2.4 MB', type: 'pdf' },
    { id: '2', name: 'Blood Test Results - Dec.pdf', date: 'Dec 20, 2023', size: '1.1 MB', type: 'pdf' },
    { id: '3', name: 'Prescription - Dr. Smith.pdf', date: 'Nov 05, 2023', size: '850 KB', type: 'pdf' },
    { id: '4', name: 'X-Ray Report - Knee.pdf', date: 'Oct 12, 2023', size: '5.6 MB', type: 'pdf' },
    { id: '5', name: 'Dental Checkup Summary.pdf', date: 'Sep 30, 2023', size: '1.2 MB', type: 'pdf' },
];

export const ReportsScreen = ({ navigation }: ReportsScreenProps) => {

    const handleDownload = (file: ReportFile) => {
        console.log(`Downloading ${file.name}...`);
        // Placeholder for actual download logic
    };

    const renderItem = ({ item }: { item: ReportFile }) => (
        <View className="flex-row items-center bg-white p-4 mb-3 rounded-2xl border border-gray-100 shadow-sm">
            <View className="w-12 h-12 rounded-xl bg-primary/10 items-center justify-center mr-4">
                <FileText size={24} color={colors.primary} />
            </View>
            <View className="flex-1">
                <Text className="text-text-primary font-semibold text-base mb-1" numberOfLines={1}>{item.name}</Text>
                <Text className="text-text-secondary text-xs">{item.date} • {item.size}</Text>
            </View>
            <TouchableOpacity 
                onPress={() => handleDownload(item)}
                className="w-10 h-10 rounded-full bg-gray-50 items-center justify-center border border-gray-100 active:bg-gray-100"
            >
                <ArrowDownToLine size={20} color={colors.primary} />
            </TouchableOpacity>
        </View>
    );

    return (
        <ScreenWrapper className="flex-1 bg-background" edges={['bottom']}>
            {/* Header with Close Button */}
            <View className="px-6 pt-6 pb-4 flex-row items-center justify-between bg-white border-b border-gray-100">
                <View>
                    <Text className="text-2xl font-bold text-text-primary font-modern">My Reports</Text>
                    <Text className="text-text-secondary text-sm">Access and download your files</Text>
                </View>
                <TouchableOpacity 
                    onPress={() => navigation.goBack()}
                    className="w-10 h-10 rounded-full bg-gray-100 items-center justify-center"
                >
                    <X size={20} color={colors["text-primary"]} />
                </TouchableOpacity>
            </View>

            {/* List */}
            <FlatList
                data={DUMMY_REPORTS}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                contentContainerStyle={{ padding: 24, paddingBottom: 100 }}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                    <View className="items-center justify-center py-20">
                        <Text className="text-text-secondary">No reports found.</Text>
                    </View>
                }
            />
        </ScreenWrapper>
    );
};
