import React from "react";
import {
    Modal,
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
} from "react-native";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";

const LocationDisclosureModal = ({
    visible,
    onAgree,
    onCancel,
    colors,
}) => {
    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onCancel}
        >
            <View style={styles.overlay}>
                <View style={[styles.modalBox, { backgroundColor: colors?.white || "#fff" }]}>
                    <Text style={[styles.title, { color: colors?.primary || "#000" }]}>
                        Location Access Disclosure
                    </Text>

                    <Text style={styles.description}>
                        Mega-Transfers collects and uses your location data to show your live
                        driver position to dispatchers and assigned customers during active
                        bookings, even when the app is closed or running in the background.
                    </Text>

                    <Text style={styles.description}>
                        This helps track trips, manage dispatch jobs, and provide accurate
                        driver updates. Your location is used only for dispatch and booking
                        tracking features.
                    </Text>

                    <View style={styles.buttonRow}>
                        <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={onCancel}
                            style={[styles.cancelButton, { borderColor: colors?.border || "#ccc" }]}
                        >
                            <Text style={[styles.cancelText, { color: colors?.primary || "#000" }]}>
                                Cancel
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={onAgree}
                            style={[styles.agreeButton, { backgroundColor: colors?.primary || "#000" }]}
                        >
                            <Text style={styles.agreeText}>I Agree</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

export default LocationDisclosureModal;

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.45)",
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: scale(20),
    },
    modalBox: {
        width: "100%",
        borderRadius: moderateScale(16),
        padding: moderateScale(20),
    },
    title: {
        fontSize: moderateScale(18),
        fontWeight: "700",
        marginBottom: verticalScale(12),
    },
    description: {
        fontSize: moderateScale(13),
        lineHeight: moderateScale(20),
        color: "#555",
        marginBottom: verticalScale(10),
    },
    buttonRow: {
        flexDirection: "row",
        justifyContent: "flex-end",
        marginTop: verticalScale(12),
        gap: scale(10),
    },
    cancelButton: {
        paddingVertical: verticalScale(10),
        paddingHorizontal: scale(18),
        borderRadius: moderateScale(8),
        borderWidth: 1,
    },
    agreeButton: {
        paddingVertical: verticalScale(10),
        paddingHorizontal: scale(18),
        borderRadius: moderateScale(8),
    },
    cancelText: {
        fontSize: moderateScale(13),
        fontWeight: "600",
    },
    agreeText: {
        fontSize: moderateScale(13),
        fontWeight: "700",
        color: "#fff",
    },
});