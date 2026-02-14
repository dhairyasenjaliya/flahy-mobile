import { FileText, Filter, LayoutGrid, MoreHorizontal, Star } from 'lucide-react-native';
import React, { useState } from 'react';
import { Alert, Dimensions, FlatList, Image, Text, TouchableOpacity, View } from 'react-native';
import { colors } from '../theme/colors';

type ViewMode = 'list' | 'grid';
type FilterType = 'all' | 'pdf' | 'image';

interface DataListProps {
    data: any[];
    onDownload?: (item: any) => void;
    onDelete?: (item: any) => void;
    onPress?: (item: any) => void;
    emptyMessage?: string;
}

const { width } = Dimensions.get('window');
const GAP = 16;
const PADDING = 24 * 2;
const ITEM_WIDTH = (width - PADDING - GAP) / 2;

export const DataList = ({ data, onDownload, onDelete, onPress, emptyMessage }: DataListProps) => {
    const [viewMode, setViewMode] = useState<ViewMode>('grid'); // Defaulting to grid as per Screenshot 2/4 prevalence? Screenshot 4 is Grid.
    const [filter, setFilter] = useState<FilterType>('all');
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    const filteredData = data.filter(item => {
        if (filter === 'all') return true;
        const lowerType = item.type?.toLowerCase() || '';
        if (filter === 'pdf') return lowerType.includes('pdf');
        if (filter === 'image') return ['jpg', 'jpeg', 'png', 'gif', 'webp'].some(ext => lowerType.includes(ext));
        return true;
    });

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

    const renderGridItem = ({ item }: { item: any }) => (
        <TouchableOpacity 
            style={{ width: ITEM_WIDTH }} 
            className="mb-4"
            onPress={() => onPress?.(item)}
            activeOpacity={0.7}
        >
             {/* Card Image/Preview */}
             <View className="w-full aspect-square bg-[#E5E7EB] rounded-xl mb-2 relative overflow-hidden items-center justify-center border border-gray-200">
                 {(item.type?.includes('image') || ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(item.type?.toLowerCase())) ? (
                      <Image 
                        source={{ uri: item.uri }}
                        className="w-full h-full"
                        resizeMode="cover"
                      />
                 ) : item.type?.includes('pdf') ? (
                     // PDF Stylized Thumbnail
                     <View className="w-16 h-20 bg-white shadow-sm items-center justify-center relative rounded-sm">
                         <View className="absolute top-0 right-0 w-4 h-4 bg-red-500 rounded-bl-lg z-10" />
                         <View className="absolute top-0 left-0 right-0 h-4 bg-red-50 rounded-t-sm items-center justify-center">
                              <Text className="text-[6px] font-bold text-red-500">PDF</Text>
                         </View>
                         <FileText size={24} color="#EF4444" className="mt-2" />
                         <View className="absolute bottom-2 w-10 h-0.5 bg-gray-100 rounded-full" />
                         <View className="absolute bottom-3 w-8 h-0.5 bg-gray-100 rounded-full" />
                     </View>
                 ) : (
                      // Generic File
                      <FileText size={32} color="#9CA3AF" />
                 )}
                 {/* Star Icon Bottom Right */}
                 <View className="absolute bottom-2 right-2 p-1.5 bg-black/40 rounded-full">
                     <Star size={10} color="white" fill="white" />
                 </View>
             </View>
             
             {/* Meta */}
             <View className="flex-row items-center justify-between">
                 <View className="flex-row items-center flex-1 mr-2">
                     {/* Small Icon based on type */}
                     {item.type?.includes('pdf') ? (
                         <View className="w-4 h-4 bg-red-100 rounded items-center justify-center mr-1.5">
                             <Text className="text-[8px] font-bold text-red-500">PDF</Text>
                         </View>
                     ) : (
                         <View className="w-4 h-4 bg-orange-100 rounded items-center justify-center mr-1.5">
                             {/* <Image source={require('../assets/image_icon_placeholder.png')} className="w-3 h-3" />  */}
                             {/* Fallback if no asset */}
                             <View className="w-2 h-2 bg-orange-400 rounded-sm" />
                         </View>
                     )}
                     <Text className="text-text-primary text-sm font-medium" numberOfLines={1}>{item.name}</Text>
                 </View>
                 <TouchableOpacity onPress={() => handleOptions(item)}>
                      <MoreHorizontal size={18} color="#9CA3AF" />
                 </TouchableOpacity>
             </View>
             {/* Date/Size - Screenshot shows "Modified 29 sep 2022" with star? */}
             {/* Actually Screenshot 4 shows: 
                 [Icon] [Name] ...
                 [Star] Modified 29 sep 2022
             */}
             <View className="flex-row items-center mt-0.5">
                 <Star size={10} color="#9CA3AF" fill="#9CA3AF" className="mr-1" />
                 <Text className="text-[#9CA3AF] text-xs ml-1">Modified {item.date ? new Date(item.date).toLocaleDateString() : '29 sep 2022'}</Text>
             </View>
        </TouchableOpacity>
    );

    const renderListItem = ({ item }: { item: any }) => (
         <TouchableOpacity 
            className="flex-row items-center py-4 border-b border-gray-100"
            onPress={() => onPress?.(item)}
            activeOpacity={0.7}
         >
             {/* Icon */}
             <View className="mr-4">
                 {item.type?.includes('pdf') ? (
                     <View className="w-10 h-10 bg-red-50 rounded-lg items-center justify-center">
                         <Text className="text-red-500 text-[10px] font-bold">PDF</Text>
                     </View>
                 ) : (item.type?.includes('image') || ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(item.type?.toLowerCase())) ? (
                      <View className="w-10 h-10 bg-gray-200 rounded-lg overflow-hidden border border-gray-200">
                          <Image 
                              source={{ uri: item.uri }}
                              className="w-full h-full"
                              resizeMode="cover"
                          />
                      </View>
                 ) : (
                     <View className="w-10 h-10 bg-orange-50 rounded-lg items-center justify-center">
                          {/* Generic Icon placeholder */}
                          <View className="w-5 h-5 bg-orange-200 rounded-sm" />
                     </View>
                 )}
             </View>
             
             {/* Content */}
             <View className="flex-1">
                 <Text className="text-text-primary font-medium text-base mb-1">{item.name}</Text>
                 <View className="flex-row items-center">
                     <Star size={12} color="#9CA3AF" fill="#9CA3AF" />
                     <Text className="text-[#9CA3AF] text-sm ml-1.5">Modified {item.date ? new Date(item.date).toLocaleDateString() : '29 sep 2022'}</Text>
                 </View>
             </View>

             <TouchableOpacity onPress={() => handleOptions(item)} className="p-2">
                 <MoreHorizontal size={20} color="#CBD5E1" />
             </TouchableOpacity>
         </TouchableOpacity>
    );

    const FilterOption = ({ type, label }: { type: FilterType, label: string }) => (
        <TouchableOpacity
            onPress={() => {
                setFilter(type);
                setIsFilterOpen(false);
            }}
            className={`px-4 py-3 border-b border-gray-50 last:border-0 ${filter === type ? 'bg-teal-50' : ''}`}
        >
            <Text className={`${filter === type ? 'text-teal font-bold' : 'text-text-primary'} text-sm`}>{label}</Text>
        </TouchableOpacity>
    );

    return (
        <View className="px-6 mb-10">
            {/* Header: Title and Select File Type Button */}
            <View className="flex-row justify-between items-center mb-6 z-50">
                <View className="flex-row items-center">
                     <Text className="text-[17px] font-medium text-text-primary mr-1">My Data</Text>
                     {/* Show arrow only if sortable/expandable? Screenshot 4 has arrow up */}
                </View>

                {/* Right Side: Toggle or Filter Pill */}
                <View className="flex-row items-center gap-3">
                     {/* If Grid Mode -> Show "Select file type" Pill? 
                         Screenshot 2 (Grid view context) shows "Select file type" pill. 
                         Screenshot 5 (List view context) shows Grid Icon.
                     */}
                     
                     <View className="relative z-50">
                        <TouchableOpacity
                            onPress={() => setIsFilterOpen(!isFilterOpen)}
                            className="bg-teal px-4 py-2 rounded-lg flex-row items-center"
                            activeOpacity={0.8}
                        >
                            {/* <Filter size={14} color="white" className="mr-2" /> */}
                            <Filter size={16} color="white" />
                            <Text className="text-white text-xs font-medium ml-2">Select file type</Text>
                        </TouchableOpacity>

                         {isFilterOpen && (
                            <View className="absolute top-12 right-0 w-48 bg-white rounded-2xl border border-gray-100 shadow-xl z-50 overflow-hidden">
                                <FilterOption type="all" label="All Files" />
                                <FilterOption type="pdf" label="PDF Documents" />
                                <FilterOption type="image" label="Images" />
                            </View>
                        )}
                     </View>

                     {/* View Switcher (Optional, screenshot 5 suggests specific icon) */}
                     {/* <TouchableOpacity onPress={() => setViewMode(prev => prev === 'list' ? 'grid' : 'list')}>
                         {viewMode === 'list' ? <LayoutGrid size={20} color={colors.textSecondary} /> : <ListIcon size={20} color={colors.textSecondary} />}
                     </TouchableOpacity> */}
                     <TouchableOpacity onPress={() => setViewMode(viewMode === 'list' ? 'grid' : 'list')}>
                          <LayoutGrid size={20} color={colors['text-secondary']} />
                     </TouchableOpacity>

                </View>
            </View>

            {/* Content Area */}
            {filteredData.length === 0 ? (
                <View className="items-center justify-center h-[200px]">
                     <Text className="text-text-secondary text-base">No Data Found.</Text>
                </View>
            ) : (
                <View>
                    {viewMode === 'list' ? (
                        <FlatList
                            data={filteredData}
                            renderItem={renderListItem}
                            keyExtractor={(item: any, index) => index.toString()}
                            contentContainerStyle={{ paddingBottom: 20 }}
                            scrollEnabled={false}
                        />
                    ) : (
                        <View className="flex-row flex-wrap justify-between">
                            {filteredData.map((item, index) => (
                                <View key={index}>
                                    {renderGridItem({ item })}
                                </View>
                            ))}
                        </View>
                    )}
                </View>
            )}
        </View>
    );
}
