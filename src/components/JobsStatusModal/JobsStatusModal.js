import React, { useEffect } from "react";
import { View, Text, TouchableOpacity, Modal, ScrollView, Alert } from "react-native";
import { useTheme } from "@react-navigation/native";
import { moderateScale, verticalScale } from "react-native-size-matters";
import Icons from "../../assets/icons";
import getStyles from "./style";

const statusOptions = [
    { id: 'accepted', label: 'Accepted' },
    { id: 'on route', label: 'On Route', },
    { id: 'at location', label: 'At Location', },
    { id: 'ride started', label: 'Ride Started' },
    { id: 'add waiting', label: 'Add Waiting', },
    { id: 'extra stop', label: 'Extra Stop', },
    { id: 'no show', label: 'No Show', },
    { id: 'late cancel', label: 'Late Cancel' },
    { id: 'completed', label: 'Completed' },
    { id: 'rejected', label: 'Rejected' },
];

const JobsStatusModal = ({ visible, setVisible, statusFilter, setStatusFilter, updateJobStatus, selectedJob, openExtrasModal }) => {
    // console.log('=======selected job is here',selectedJob);

    const { colors } = useTheme();
    const styles = getStyles(colors);

    const toggleStatus = (statusId) => {
        setStatusFilter([statusId]);
    };


    const currentStatus =
        selectedJob?.booking?.status?.toLowerCase();

    const statusVisibilityMap = {

        new: [
            "accepted",
            "rejected",
        ],

        accepted: [
            "on route",
        ],

        "on route": [
            "at location",
        ],

        "at location": [
            "ride started",
            "add waiting",
            "extra stop",
            "no show",
            "late cancel",
        ],

        "ride started": [
            // "ride started",
            "add waiting",
            "extra stop",
            "completed",
        ],

        // ADD WAITING
        "add waiting": [
            "ride started",
            // "add waiting",
            "extra stop",
            "no show",
            "late cancel",
        ],

        "extra stop": [
            "ride started",
            "add waiting",
            "extra stop",
            "no show",
            "late cancel",
        ],
    };

    const allowedStatuses =
        statusVisibilityMap[currentStatus] || [];

    const filteredOptions =
        statusOptions.filter((status) =>
            allowedStatuses.includes(status.id)
        );

    const warningStatuses = [
        "no show",
        "late cancel",
        "completed",
        "rejected",
    ];

    useEffect(() => {
        if (visible) {
            setStatusFilter([]);
        }
    }, [visible]);

    return (
        <Modal visible={visible} transparent animationType="slide" onRequestClose={() => setVisible(false)}>
            <View style={styles.overlay}>
                <View style={[styles.modalContainer]}>
                    <View style={[styles.header, { backgroundColor: colors.primary }]}>
                        <Text style={styles.title}>Select Status</Text>
                        <TouchableOpacity onPress={() => setVisible(false)}>
                            <Icons.X size={moderateScale(24)} color={colors.white} />
                        </TouchableOpacity>
                    </View>
                    <ScrollView style={styles.content}>
                        {filteredOptions.map((status) => {
                            const isSelected = statusFilter.includes(status.id);
                            return (
                                <TouchableOpacity
                                    key={status.id}
                                    style={[
                                        styles.option,
                                        {
                                            backgroundColor: isSelected ? colors?.primary : colors.lightGrey,
                                        },
                                    ]}
                                    onPress={() => toggleStatus(status.id)}
                                >
                                    <Text
                                        style={[
                                            styles.optionText,
                                            {
                                                color: isSelected ? colors.white : colors.text,
                                                fontWeight: isSelected ? '600' : '500',
                                            },
                                        ]}
                                    >
                                        {selectedJob?.status === "New" && status.id === "accepted"
                                            ? "Accept"
                                            : selectedJob?.booking?.status === "New" && status.id === "rejected"
                                                ? "Reject"
                                                : status.id === "accepted"
                                                    ? "Accepted"
                                                    : status.id === "rejected"
                                                        ? "Rejected"
                                                        : status.label}
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
                            style={[
                                styles.button,
                                {
                                    backgroundColor:
                                        statusFilter.length === 0 ? colors.gray300 : colors.primary,
                                },
                            ]}
                            onPress={() => {
                                const selectedStatus = statusFilter[0];

                                if (!selectedStatus) return;

                                if (warningStatuses.includes(selectedStatus)) {

                                    const formattedStatus =
                                        selectedStatus.charAt(0).toUpperCase() +
                                        selectedStatus.slice(1);

                                    Alert.alert(
                                        "Confirm Status Update",
                                        `Are you sure you want to mark this booking as "${formattedStatus}"?`,
                                        [
                                            {
                                                text: "Cancel",
                                                style: "cancel",
                                            },
                                            {
                                                text: "OK",
                                                onPress: () => {

                                                    if (selectedStatus === "completed") {

                                                        setVisible(false);

                                                        setTimeout(() => {
                                                            openExtrasModal();
                                                        }, 300);

                                                    } else {

                                                        updateJobStatus(selectedStatus);
                                                        setVisible(false);

                                                    }

                                                    setStatusFilter([]);
                                                },
                                            },
                                        ]
                                    );
                                } else {
                                    updateJobStatus(selectedStatus);
                                    setVisible(false);
                                }

                                setStatusFilter([]);
                            }}
                            disabled={statusFilter.length === 0}
                        >
                            <Text style={[styles.buttonText, { color: colors.white }]}>Apply</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

export default JobsStatusModal;