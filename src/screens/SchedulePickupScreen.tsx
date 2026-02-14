import { useNavigation } from '@react-navigation/native';
import { ArrowLeft } from 'lucide-react-native';
import React, { useState } from 'react';
import { Alert, Text, TouchableOpacity, View } from 'react-native';
import { Calendar, DateData, LocaleConfig } from 'react-native-calendars';
import { ScreenWrapper } from '../components/ScreenWrapper';

// Configure locale if needed (optional, keeping default for now)
LocaleConfig.locales['en'] = {
  monthNames: [
    'January', 'February', 'March', 'April', 'May', 'June', 
    'July', 'August', 'September', 'October', 'November', 'December'
  ],
  monthNamesShort: ['Jan.', 'Feb.', 'Mar.', 'Apr.', 'May', 'Jun.', 'Jul.', 'Aug.', 'Sep.', 'Oct.', 'Nov.', 'Dec.'],
  dayNames: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  dayNamesShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  today: "Today"
};
LocaleConfig.defaultLocale = 'en';

export const SchedulePickupScreen = () => {
    const navigation = useNavigation();
    const [selectedDate, setSelectedDate] = useState('');

    const onDayPress = (day: DateData) => {
        setSelectedDate(day.dateString);
    };

    const handleConfirm = () => {
        if (!selectedDate) {
            Alert.alert("Select Date", "Please select a date for pickup.");
            return;
        }
        Alert.alert("Pickup Scheduled", `Pickup scheduled for ${selectedDate}. Our team will contact you shortly.`);
        navigation.goBack();
    };

    const today = new Date().toISOString().split('T')[0];

    return (
        <ScreenWrapper className="flex-1 bg-[#FFFBE6]">
                {/* Header */}
                <View className="flex-row items-center px-6 py-4">
                    <TouchableOpacity 
                        onPress={() => navigation.goBack()}
                        className="p-2 -ml-2 rounded-full active:bg-gray-100"
                    >
                        <ArrowLeft size={24} color="#2F2F2F" />
                    </TouchableOpacity>
                    <Text className="text-xl font-bold text-[#2F2F2F] ml-2">Schedule Pick-up</Text>
                </View>

                {/* Content */}
                <View className="flex-1 px-6 pt-4">
                    <Text className="text-base text-gray-600 mb-6 text-center">
                        Please select a preferred date for your sample pickup.
                    </Text>

                    <View className="bg-white rounded-2xl shadow-sm overflow-hidden p-4">
                        <Calendar
                            // Initially visible month. Default = Date()
                            current={today}
                            // Minimum date that can be selected, dates before minDate will be grayed out. Default = undefined
                            minDate={today}
                            // Handler which gets executed on day press. Default = undefined
                            onDayPress={onDayPress}
                            // Month format in calendar title. Formatting values: http://arshaw.com/xdate/#Formatting
                            monthFormat={'MMMM yyyy'}
                            // Hide month navigation arrows. Default = false
                            hideArrows={false}
                            // Do not show days of other months in month page. Default = false
                            hideExtraDays={true}
                            // If hideArrows = false and hideExtraDays = false do not switch month when tapping on greyed out
                            // day from another month that is visible in calendar page. Default = false
                            disableMonthChange={true}
                            // If firstDay=1 week starts from Monday. Note that dayNames and dayNamesShort should still start from Sunday
                            firstDay={1}
                            // Enable the option to swipe between months. Default = false
                            enableSwipeMonths={true}
                            
                            // Styling
                            theme={{
                                backgroundColor: '#ffffff',
                                calendarBackground: '#ffffff',
                                textSectionTitleColor: '#b6c1cd',
                                selectedDayBackgroundColor: '#4FB5B0',
                                selectedDayTextColor: '#ffffff',
                                todayTextColor: '#4FB5B0',
                                dayTextColor: '#2d4150',
                                textDisabledColor: '#d9e1e8',
                                dotColor: '#00adf5',
                                selectedDotColor: '#ffffff',
                                arrowColor: '#4FB5B0',
                                disabledArrowColor: '#d9e1e8',
                                monthTextColor: '#2F2F2F',
                                indicatorColor: '#4FB5B0',
                                textDayFontFamily: 'System', // Use default system fonts
                                textMonthFontFamily: 'System',
                                textDayHeaderFontFamily: 'System',
                                textDayFontWeight: '400',
                                textMonthFontWeight: 'bold',
                                textDayHeaderFontWeight: '500',
                                textDayFontSize: 16,
                                textMonthFontSize: 18,
                                textDayHeaderFontSize: 14
                            }}
                            markedDates={{
                                [selectedDate]: { selected: true, disableTouchEvent: true }
                            }}
                        />
                    </View>

                    {/* Action Button */}
                    <View className="mt-8">
                         <TouchableOpacity
                            onPress={handleConfirm}
                            className={`w-full py-4 rounded-xl items-center shadow-sm ${selectedDate ? 'bg-[#4FB5B0]' : 'bg-gray-300'}`}
                            disabled={!selectedDate}
                        >
                            <Text className="text-white text-lg font-bold">Confirm Pickup Date</Text>
                        </TouchableOpacity>
                    </View>

                </View>
        </ScreenWrapper>
    );
};
