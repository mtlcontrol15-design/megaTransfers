import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Modal, ScrollView, Platform } from "react-native";
import { useTheme } from "@react-navigation/native";
import { moderateScale, verticalScale } from "react-native-size-matters";
import DateTimePicker from "@react-native-community/datetimepicker";
import Icons from "../../assets/icons";
import getStyles from "./DateFilterModalStyle";

const DateFilterModal = ({ visible, setVisible, startDate, endDate, setStartDate, setEndDate }) => {
    const { colors } = useTheme();
    const styles = getStyles(colors);

    const [tempStartDate, setTempStartDate] = useState(startDate ? new Date(startDate) : null);
    const [tempEndDate, setTempEndDate] = useState(endDate ? new Date(endDate) : null);
    const [showStartPicker, setShowStartPicker] = useState(false);
    const [showEndPicker, setShowEndPicker] = useState(false);
    const [selectedPreset, setSelectedPreset] = useState(null);

    const formatDate = (date) => {
        if (!date) return 'Select date';
        const d = new Date(date);
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return `${String(d.getDate()).padStart(2, '0')} ${months[d.getMonth()]} ${d.getFullYear()}`;
    };

    useEffect(() => {
        if (visible) {
            setTempStartDate(startDate ? new Date(startDate) : null);
            setTempEndDate(endDate ? new Date(endDate) : null);
            setSelectedPreset(null);
            setShowStartPicker(false);
            setShowEndPicker(false);
        }
    }, [visible, startDate, endDate]);

    const handleStartDateChange = (event, selectedDate) => {
        if (selectedDate) {
            setTempStartDate(selectedDate);
            if (Platform.OS === 'ios') {
                setShowStartPicker(false);
            }
        }
        if (Platform.OS === 'android') {
            setShowStartPicker(false);
        }
    };

    const handleEndDateChange = (event, selectedDate) => {
        if (selectedDate) {
            setTempEndDate(selectedDate);
            if (Platform.OS === 'ios') {
                setShowEndPicker(false);
            }
        }
        if (Platform.OS === 'android') {
            setShowEndPicker(false);
        }
    };

    const applyDates = () => {
        setStartDate(tempStartDate);
        setEndDate(tempEndDate);
        setVisible(false);
    };

    const presets = [
        { label: 'Today', id: 'today' },
        { label: 'Last 7 Days', id: 'last7' },
        { label: 'Last 30 Days', id: 'last30' },
    ];

    const handlePreset = (id) => {
        const today = new Date();

        setSelectedPreset(id);

        if (id === "today") {
            setTempStartDate(today);
            setTempEndDate(today);
        }

        if (id === "last7") {
            const d = new Date();
            d.setDate(today.getDate() - 6);
            setTempStartDate(d);
            setTempEndDate(today);
        }

        if (id === "last30") {
            const d = new Date();
            d.setDate(today.getDate() - 29);
            setTempStartDate(d);
            setTempEndDate(today);
        }
    };

    return (
        <Modal visible={visible} transparent animationType="slide" onRequestClose={() => setVisible(false)}>
            <View style={styles.overlay}>
                <View style={[styles.modalContainer]}>
                    <View style={[styles.header, { backgroundColor: colors.primary }]}>
                        <Text style={styles.title}>Select Date Range</Text>
                        <TouchableOpacity onPress={() => setVisible(false)}>
                            <Icons.X size={moderateScale(24)} color={colors.white} />
                        </TouchableOpacity>
                    </View>

                    <ScrollView style={styles.content}>
                        <Text style={[styles.sectionTitle, { color: colors.text }]}>Custom Dates</Text>

                        <View style={styles.datePickerRow}>
                            <View style={styles.dateField}>
                                <Text style={[styles.label, { color: colors.lightText }]}>Start Date</Text>
                                <TouchableOpacity
                                    style={[styles.dateButton, { borderColor: colors.primary }]}
                                    onPress={() => setShowStartPicker(true)}
                                >
                                    <Text style={[styles.dateText, { color: colors.text }]}>{formatDate(tempStartDate)}</Text>
                                    <Icons.Calendar size={moderateScale(16)} color={colors.text} />
                                </TouchableOpacity>
                            </View>
                            <View style={styles.arrowContainer}>
                                <Icons.ArrowRight size={moderateScale(16)} color={colors.text} />
                            </View>
                            <View style={styles.dateField}>
                                <Text style={[styles.label, { color: colors.lightText }]}>End Date</Text>
                                <TouchableOpacity
                                    style={[styles.dateButton, { borderColor: colors.primary }]}
                                    onPress={() => setShowEndPicker(true)}
                                >
                                    <Text style={[styles.dateText, { color: colors.text }]}>{formatDate(tempEndDate)}</Text>
                                    <Icons.Calendar size={moderateScale(16)} color={colors.text} />
                                </TouchableOpacity>
                            </View>
                        </View>

                        <Text style={[styles.sectionTitle, { color: colors.text, marginTop: verticalScale(20) }]}>Quick Presets</Text>
                        <View style={styles.presetsGrid}>
                            {presets.map((preset) => (
                                <TouchableOpacity
                                    key={preset.id}
                                    style={[styles.presetButton, {
                                        backgroundColor:
                                            selectedPreset === preset.id
                                                ? colors.primary
                                                : colors.lightBlue
                                    }]}
                                    onPress={() => handlePreset(preset.id)}
                                >
                                    <Text style={[styles.presetText, { color: colors.white }]}>{preset.label}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </ScrollView>

                    <View style={styles.footer}>
                        <TouchableOpacity
                            style={[styles.button, { backgroundColor: colors.lightGrey }]}
                            onPress={() => setVisible(false)}
                        >
                            <Text style={[styles.buttonText, { color: colors.text }]}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.button, { backgroundColor: colors.primary }]}
                            onPress={applyDates}
                        >
                            <Text style={[styles.buttonText, { color: colors.white }]}>Apply</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            {showStartPicker && Platform.OS === 'ios' && (
                <View style={styles.pickerModalOverlay}>
                    <View style={[styles.pickerModalContainer, { backgroundColor: colors.white }]}>                        
                        <DateTimePicker
                            value={tempStartDate || new Date()}
                            mode="date"
                            display="spinner"
                            onChange={handleStartDateChange}
                        />
                    </View>
                </View>
            )}
            {showEndPicker && Platform.OS === 'ios' && (
                <View style={styles.pickerModalOverlay}>
                    <View style={[styles.pickerModalContainer, { backgroundColor: colors.white }]}>                        
                        <DateTimePicker
                            value={tempEndDate || new Date()}
                            mode="date"
                            display="spinner"
                            onChange={handleEndDateChange}
                        />
                    </View>
                </View>
            )}
            {showStartPicker && Platform.OS !== 'ios' && (
                <DateTimePicker
                    value={tempStartDate || new Date()}
                    mode="date"
                    display="default"
                    onChange={handleStartDateChange}
                />
            )}
            {showEndPicker && Platform.OS !== 'ios' && (
                <DateTimePicker
                    value={tempEndDate || new Date()}
                    mode="date"
                    display="default"
                    onChange={handleEndDateChange}
                />
            )}
        </Modal>
    );
};

export default DateFilterModal;