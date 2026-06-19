import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Platform } from "react-native";

import ModalSelector from "react-native-modal-selector";
import DateTimePicker from "@react-native-community/datetimepicker";

import getStyles from "./styles";
import Icons from "../../../../../assets/icons";
import { moderateScale } from "react-native-size-matters";

const DateTimeSection = ({ journeyData, setJourneyData, colors, errors, touched, setFieldValue, setFieldTouched, values, validateForm }) => {
    const styles = getStyles(colors);
    const [showDatePicker, setShowDatePicker] = useState(false);

    const handleInputChange = (field, value) => {
        setJourneyData(prev => ({ ...prev, [field]: value }));

        setFieldValue(field, value);
        setFieldTouched(field, true);

        if (validateForm) {
            setTimeout(() => {
                validateForm();
            }, 10);
        }
    };

    const handleDateChange = (event, selectedDate) => {
        setShowDatePicker(false);
        if (!selectedDate) return;

        const year = selectedDate.getFullYear();
        const month = String(selectedDate.getMonth() + 1).padStart(2, "0");
        const day = String(selectedDate.getDate()).padStart(2, "0");
        const formattedDate = `${year}-${month}-${day}`;

        setJourneyData(prev => ({ ...prev, date: formattedDate }));
        setFieldValue("date", formattedDate);
        setFieldTouched("date", true);

        if (validateForm) {
            setTimeout(() => {
                validateForm();
            }, 10);
        }
    };

    useEffect(() => {
        if (journeyData.date && journeyData.date !== values?.date) {
            setFieldValue('date', journeyData.date);
            setFieldTouched('date', true);
            if (validateForm) {
                validateForm();
            }
        }

        if (journeyData.hour && journeyData.hour !== values?.hour) {
            setFieldValue('hour', journeyData.hour);
            setFieldTouched('hour', true);
            if (validateForm) {
                validateForm();
            }
        }

        if (journeyData.minute && journeyData.minute !== values?.minute) {
            setFieldValue('minute', journeyData.minute);
            setFieldTouched('minute', true);
            if (validateForm) {
                validateForm();
            }
        }
    }, [journeyData.date, journeyData.hour, journeyData.minute]);

    const hourOptions = [
        { key: "HH", label: "HH" },
        ...Array.from({ length: 24 }, (_, i) => ({ key: i, label: i.toString().padStart(2, "0") }))
    ];

    const minuteOptions = [
        { key: "MM", label: "MM" },
        ...Array.from({ length: 12 }, (_, i) => {
            const m = i * 5;
            return { key: m, label: m.toString().padStart(2, "0") };
        })
    ];

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Pick Up Date & Time</Text>

            <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.dateButton}>
                <Icons.Calendar size={20} color={colors.placeholder} />
                <Text style={[styles.dateText, { color: journeyData.date ? colors.text : colors.placeholder }]}>
                    {journeyData.date || "Select Date"}
                </Text>
                <Icons.ChevronDown size={20} color={colors.placeholder} />
            </TouchableOpacity>

            {touched?.date && errors?.date && (
                <Text style={{ color: colors.error || "red", marginTop: 4 }}>
                    {errors.date}
                </Text>
            )}

            {showDatePicker && (
                <DateTimePicker
                    value={journeyData.date ? new Date(journeyData.date) : new Date()}
                    mode="date"
                    display={Platform.OS === "ios" ? "spinner" : "default"}
                    onChange={handleDateChange}
                />
            )}

            <View style={styles.timeRow}>
                <View style={styles.timeCol}>
                    <Text style={styles.label}>Hour</Text>
                    <ModalSelector
                        data={hourOptions}
                        initValue="HH"
                        cancelStyle={styles.cancelButton}
                        cancelTextStyle={styles.cancelText}
                        onChange={(option) => handleInputChange("hour", option.label === "HH" ? "" : option.label)}
                        overlayStyle={styles.overlay}
                        optionContainerStyle={[styles.optionContainer, { backgroundColor: colors.white }]}
                        style={styles.selector}
                        selectStyle={styles.selectStyle}
                        selectTextStyle={[styles.selectText, { color: journeyData.hour ? colors.text : colors.placeholder }]}
                        optionTextStyle={styles.optionText}
                    >
                        <View style={styles.selectorInner}>
                            <Text style={[styles.valueText, { color: journeyData.hour ? colors.text : colors.placeholder,textAlign: "center", width: moderateScale(40) }]}>
                                {journeyData.hour || "HH"}
                            </Text>
                            <Icons.ChevronDown size={16} color={colors.placeholder} />
                        </View>
                    </ModalSelector>

                    {touched?.hour && errors?.hour && (
                        <Text style={{ color: colors.error || "red", marginTop: 4 }}>
                            {errors.hour}
                        </Text>
                    )}
                </View>

                <View style={styles.timeCol}>
                    <Text style={styles.label}>Minute</Text>
                    <ModalSelector
                        data={minuteOptions}
                        initValue="MM"
                        cancelStyle={styles.cancelButton}
                        cancelTextStyle={styles.cancelText}
                        onChange={(option) => handleInputChange("minute", option.label === "MM" ? "" : option.label)}
                        overlayStyle={styles.overlay}
                        optionContainerStyle={[styles.optionContainer, { backgroundColor: colors.white }]}
                        style={styles.selector}
                        selectStyle={styles.selectStyle}
                        selectTextStyle={[styles.selectText, { color: journeyData.minute ? colors.text : colors.placeholder }]}
                        optionTextStyle={styles.optionText}
                    >
                        <View style={styles.selectorInner}>
                            <Text style={[styles.valueText, { color: journeyData.minute ? colors.text : colors.placeholder, width: moderateScale(40), textAlign: "center" }]}>
                                {journeyData.minute || "MM"}
                            </Text>
                            <Icons.ChevronDown size={16} color={colors.placeholder} />
                        </View>
                    </ModalSelector>

                    {touched?.minute && errors?.minute && (
                        <Text style={{ color: colors.error || "red", marginTop: 4 }}>
                            {errors.minute}
                        </Text>
                    )}
                </View>
            </View>
        </View>
    );
};

export default DateTimeSection;