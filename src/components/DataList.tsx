import { ChevronDown, FileText, FolderOpen, LayoutGrid, List as ListIcon, MoreVertical } from 'lucide-react-native';
import React, { useState } from 'react';
import { Alert, Dimensions, FlatList, Image, Text, TouchableOpacity, View } from 'react-native';
import { colors } from '../theme/colors';

type ViewMode = 'list' | 'grid';
type FilterType = 'all' | 'pdf' | 'png' | 'jpeg' | 'jpg' | 'dcm';

interface DataListProps {
    data: any[];
    onDownload?: (item: any) => void;
    onDelete?: (item: any) => void;
}

const { width } = Dimensions.get('window');
const GAP = 8;
const PADDING = 24 * 2;
const ITEM_WIDTH = (width - PADDING - (GAP * 2)) / 3;

export const DataList = ({ data, onDownload, onDelete }: DataListProps) => {
    const [viewMode, setViewMode] = useState<ViewMode>('list');
    const [filter, setFilter] = useState<FilterType>('all');
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    const filteredData = data.filter(item => {
        if (filter === 'all') return true;
        if (filter === 'pdf') return item.type?.includes('pdf');
        if (filter === 'png') return item.type?.includes('png');
        if (filter === 'jpeg') return item.type?.includes('jpeg');
        if (filter === 'jpg') return item.type?.includes('jpg');
        if (filter === 'dcm') return item.type?.includes('dcm');
        return true;
    });

    const renderIcon = (item: any) => {
        if (item.type?.includes('image')) {
            return (
                <Image
                    source={{ uri: item.uri }}
                    className="w-10 h-10 rounded-lg bg-teal-light/20"
                    resizeMode="cover"
                />
            );
        }
        return (
            <View className="w-10 h-10 rounded-lg bg-orange-50 items-center justify-center">
                <FileText size={20} color="#f97316" />
            </View>
        );
    };

    const handleOptions = (item: any) => {
        Alert.alert(
            item.name,
            "Choose an action",
            [
                { text: "Download", onPress: () => onDownload?.(item) },
                { text: "Delete", onPress: () => onDelete?.(item), style: 'destructive' },
                { text: "Cancel", style: "cancel" }
            ]
        );
    };

    const renderItem = ({ item }: { item: any }) => {
        if (viewMode === 'list') {
            return (
                <View className="flex-row items-center p-3 border-b border-gray-50 last:border-0">
                    {renderIcon(item)}
                    <View className="flex-1 ml-3">
                        <Text className="text-text-primary font-medium text-sm" numberOfLines={1}>{item.name}</Text>
                        <Text className="text-text-secondary text-xs mt-0.5">
                            {(item.size / 1024).toFixed(1)} KB • {new Date().toLocaleDateString()}
                        </Text>
                    </View>
                    <TouchableOpacity onPress={() => handleOptions(item)} className="p-2">
                        <MoreVertical size={16} color={colors['text-secondary']} />
                    </TouchableOpacity>
                </View>
            );
        }

        // Grid View
        return (
            <View
                style={{ width: ITEM_WIDTH }}
                className="aspect-[0.8] mb-1"
            >
                <View className="flex-1 bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden relative justify-between">
                    {/* 3-Dot Menu */}
                    <TouchableOpacity
                        onPress={() => handleOptions(item)}
                        className="absolute top-1 right-1 z-10 p-1 bg-white/60 rounded-full"
                    >
                        <MoreVertical size={14} color={colors['text-secondary']} />
                    </TouchableOpacity>

                    {/* Preview Section */}
                    <View className="flex-1 bg-gray-50 items-center justify-center overflow-hidden">
                        {item.type?.includes('image') ? (
                            <Image
                                source={{ uri: item.uri }}
                                className="w-full h-full"
                                resizeMode="cover"
                            />
                        ) : (
                            <FileText size={28} color="#f97316" />
                        )}
                    </View>

                    {/* Info Section */}
                    <View className="px-2 py-2 bg-white w-full border-t border-gray-50">
                        <Text className="text-text-primary font-medium text-[10px] text-center" numberOfLines={1}>{item.name}</Text>
                        <Text className="text-text-secondary text-[9px] text-center mt-0.5">{(item.size / 1024).toFixed(0)} KB</Text>
                    </View>
                </View>
            </View>
        );
    };

    const FilterOption = ({ type, label }: { type: FilterType, label: string }) => (
        <TouchableOpacity
            onPress={() => {
                setFilter(type);
                setIsFilterOpen(false);
            }}
            className={`px-4 py-2 border-b border-gray-50 last:border-0 ${filter === type ? 'bg-primary/5' : ''}`}
        >
            <Text className={`${filter === type ? 'text-primary font-bold' : 'text-text-primary'} text-sm`}>{label}</Text>
        </TouchableOpacity>
    );

    return (
        <View className="px-6 mb-10 z-50">
            {/* Header: Title and Controls */}
            <View className="flex-row justify-between items-center mb-5 z-50">
                <Text className="text-xl font-bold text-text-primary tracking-tight">My Data</Text>

                <View className="flex-row gap-3 z-50">
                    {/* Filter Dropdown */}
                    <View className="relative z-50">
                        <TouchableOpacity
                            onPress={() => setIsFilterOpen(!isFilterOpen)}
                            className="flex-row bg-white border border-gray-200 rounded-2xl px-3 h-12 items-center justify-between gap-1.5 w-40"
                            activeOpacity={0.7}
                        >
                            <Text className="text-text-primary text-xs font-semibold capitalize" numberOfLines={1}>
                                {filter}
                            </Text>
                            <ChevronDown size={14} color={colors['text-secondary']} />
                        </TouchableOpacity>

                        {/* Dropdown Menu */}
                        {isFilterOpen && (
                            <View className="absolute top-14 right-0 w-40 bg-white rounded-2xl border border-gray-100 shadow-lg z-50 overflow-hidden">
                                <FilterOption type="all" label="All Files" />
                                <FilterOption type="pdf" label="pdf" />
                                <FilterOption type="png" label="png" />
                                <FilterOption type="jpeg" label="jpeg" />
                                <FilterOption type="jpg" label="jpg" />
                                <FilterOption type="dcm" label="dcm" />
                            </View>
                        )}
                    </View>

                    {/* View Toggle */}
                    <View className="flex-row bg-gray-100 rounded-2xl p-1 items-center">
                        <TouchableOpacity
                            onPress={() => setViewMode('list')}
                            className="p-2 rounded-xl w-10 h-10 items-center justify-center"
                            style={viewMode === 'list' ? { backgroundColor: 'white', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2, elevation: 2 } : {}}
                        >
                            <ListIcon size={18} color={viewMode === 'list' ? colors.primary : colors['text-secondary']} />
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => setViewMode('grid')}
                            className="p-2 rounded-xl w-10 h-10 items-center justify-center"
                            style={viewMode === 'grid' ? { backgroundColor: 'white', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2, elevation: 2 } : {}}
                        >
                            <LayoutGrid size={22} color={viewMode === 'grid' ? colors.primary : colors['text-secondary']} />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            {/* Content Area */}
            {filteredData.length === 0 ? (
                <View className="bg-white rounded-3xl p-10 items-center justify-center shadow-sm border-[0.5px] border-gray-100 h-[250px] -z-10">
                    <View className="w-16 h-16 rounded-full bg-gray-50 items-center justify-center mb-4">
                        <FolderOpen size={30} color={colors['text-secondary']} />
                    </View>
                    <Text className="text-text-primary font-semibold text-lg mb-2">No files found</Text>
                    <Text className="text-text-secondary text-center leading-5 px-4 mb-6">
                        Try changing the filter or upload new files.
                    </Text>
                </View>
            ) : (
                <View className={`${viewMode === 'list' ? "bg-white rounded-3xl shadow-sm border-[0.5px] border-gray-100 overflow-hidden" : ""} -z-10`}>
                    {viewMode === 'list' ? (
                        <FlatList
                            data={filteredData}
                            renderItem={renderItem}
                            keyExtractor={(item: any, index) => index.toString()}
                            contentContainerStyle={{ padding: 0 }}
                            scrollEnabled={false}
                        />
                    ) : (
                        <View className="flex-row flex-wrap gap-2">
                            {filteredData.map((item, index) => (
                                <View key={index}>
                                    {renderItem({ item })}
                                </View>
                            ))}
                        </View>
                    )}
                </View>
            )}
        </View>
    );
}
