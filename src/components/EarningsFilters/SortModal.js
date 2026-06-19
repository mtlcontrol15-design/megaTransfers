import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Modal, ScrollView } from "react-native";
import { useTheme } from "@react-navigation/native";
import { moderateScale, verticalScale } from "react-native-size-matters";
import Icons from "../../assets/icons";
import getStyles from "./SortModalStyle";

const SortModal = ({ visible, setVisible, sortBy, setSortBy, setSortApplied }) => {
    const { colors } = useTheme();
    const styles = getStyles(colors);

    const [tempSort, setTempSort] = useState(sortBy);

    const sortOptions = [
        { id: 'date-asc', label: 'Oldest First' },
        { id: 'date-desc', label: 'Newest First' },
        { id: 'booking-asc', label: 'Booking ID (A-Z)' },
        { id: 'booking-desc', label: 'Booking ID (Z-A)' },
    ];

    useEffect(() => {
        if (visible) {
            setTempSort(null);
        }
    }, [visible]);

    return (
        <Modal visible={visible} transparent animationType="slide" onRequestClose={() => setVisible(false)}>
            <View style={styles.overlay}>
                <View style={[styles.modalContainer]}>
                    <View style={[styles.header, { backgroundColor: colors.primary }]}>
                        <Text style={styles.title}>Sort Jobs</Text>
                        <TouchableOpacity onPress={() => setVisible(false)}>
                            <Icons.X size={moderateScale(24)} color={colors.white} />
                        </TouchableOpacity>
                    </View>

                    <ScrollView style={styles.content}>
                        {sortOptions.map((option) => (
                            <TouchableOpacity
                                key={option.id}
                                style={[
                                    styles.option,
                                    {
                                        backgroundColor: tempSort === option.id ? colors.primary : colors.lightGrey
                                    },
                                ]}
                                onPress={() => {
                                    setTempSort(option.id);
                                    // setVisible(false);
                                }}
                            >
                                <Text
                                    style={[
                                        styles.optionText,
                                        {
                                            color: tempSort === option.id ? colors.white : colors.text,
                                            fontWeight: tempSort === option.id ? '600' : '500',
                                        },
                                    ]}
                                >
                                    {option.label}
                                </Text>
                                {tempSort === option.id && (
                                    <Icons.Check size={moderateScale(18)} color={colors.white} />
                                )}
                            </TouchableOpacity>
                        ))}
                    </ScrollView>

                    <View style={styles.footer}>
                        <TouchableOpacity
                            style={[styles.button, { backgroundColor: colors.lightGrey }]}
                            onPress={() => {
                                setTempSort(null);
                                setSortBy(null);
                                // setVisible(false);
                            }}
                        >
                            <Text style={[styles.buttonText, { color: colors.text }]}>Clear</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.button, { backgroundColor: colors.primary }]}
                            onPress={() => {
                                setSortBy(tempSort);
                                setSortApplied(true);
                                setVisible(false);
                            }}
                        >
                            <Text style={[styles.buttonText, { color: colors.white }]}>Apply</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

export default SortModal;