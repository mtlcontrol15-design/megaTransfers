import React from "react";
import { View, Text, TouchableOpacity, Modal, ScrollView } from "react-native";

import { useTheme } from "@react-navigation/native";
import { moderateScale } from "react-native-size-matters";

import Icons from "../../assets/icons";
import getStyles from "./StatusModalStyle";

const StatusModal = ({ visible, setVisible, statusFilter, setStatusFilter }) => {
    const { colors } = useTheme();
    const styles = getStyles(colors);

    const statusOptions = [
        { id: 'accepted', label: 'Accepted' },
        { id: 'on route', label: 'On Route' },
        { id: 'at location', label: 'At Location' },
        { id: 'add waiting', label: 'Add Waiting' },
        { id: 'extra stop', label: 'Extra Stop' },
        { id: 'ride started', label: 'Ride Started' },
        { id: 'late cancel', label: 'Late Cancel' },
        { id: 'no show', label: 'No Show' },
        { id: 'completed', label: 'Completed' },
    ];

    const toggleStatus = (statusId) => {
        if (statusFilter.includes(statusId)) {
            setStatusFilter(statusFilter.filter((s) => s !== statusId));
        } else {
            setStatusFilter([...statusFilter, statusId]);
        }
    };

    return (
        <Modal visible={visible} transparent animationType="slide" onRequestClose={() => setVisible(false)}>
            <View style={styles.overlay}>
                <View style={[styles.modalContainer]}>
                    <View style={[styles.header, { backgroundColor: colors.primary }]}>
                        <Text style={styles.title}>Filter by Status</Text>
                        <TouchableOpacity onPress={() => setVisible(false)}>
                            <Icons.X size={moderateScale(24)} color={colors.white} />
                        </TouchableOpacity>
                    </View>

                    <ScrollView style={styles.content}>
                        {statusOptions.map((status) => {
                            const isSelected = statusFilter.includes(status.id);
                            return (
                                <TouchableOpacity
                                    key={status.id}
                                    style={[
                                        styles.option,
                                        {
                                            backgroundColor: isSelected ? colors.primary : colors.lightGrey,
                                        },
                                    ]}
                                    onPress={() => toggleStatus(status.id)}
                                >
                                    <Text
                                        style={[
                                            styles.optionText,
                                            {
                                                color: isSelected ? colors.white : colors.text,
                                                fontWeight: isSelected ? '500' : '500',
                                            },
                                        ]}
                                    >
                                        {status.label}
                                    </Text>
                                    {isSelected && <Icons.Check size={moderateScale(18)} color={colors.white} />}
                                </TouchableOpacity>
                            );
                        })}
                    </ScrollView>

                    <View style={styles.footer}>
                        <TouchableOpacity
                            style={[styles.button, { backgroundColor: colors.lightGrey }]}
                            onPress={() => setStatusFilter([])}
                        >
                            <Text style={[styles.buttonText, { color: colors.text }]}>Clear</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.button, { backgroundColor: colors.primary }]}
                            onPress={() => setVisible(false)}
                        >
                            <Text style={[styles.buttonText, { color: colors.white }]}>Apply</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

export default StatusModal;