import { StyleSheet } from "react-native";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";

const getStyles = (colors) =>
    StyleSheet.create({

        card: {
            backgroundColor: "#fff",
            marginHorizontal: scale(16),
            marginVertical: verticalScale(12),
            borderRadius: moderateScale(12),
            elevation: 3,
            shadowColor: "#000",
            shadowOpacity: 0.1,
            shadowRadius: 6,
        },

        header: {
            backgroundColor: colors?.primary,
            paddingVertical: verticalScale(12),
            borderTopLeftRadius: moderateScale(12),
            borderTopRightRadius: moderateScale(12),
            alignItems: "center",
        },

        headerTitle: {
            color: "#fff",
            fontSize: moderateScale(17),
            fontWeight: "700",
        },

        body: {
            padding: scale(16),
        },

        field: {
            marginBottom: verticalScale(14),
        },

        label: {
            fontSize: moderateScale(13),
            fontWeight: "600",
            color: "#1f2937",
            marginBottom: verticalScale(6),
        },

        inputRow: {
            flexDirection: "row",
            alignItems: "center",
            borderWidth: 1,
            borderColor: "#d1d5db",
            borderRadius: moderateScale(8),
            paddingHorizontal: scale(10),
            backgroundColor: "#fff",
        },

        input: {
            flex: 1,
            marginLeft: scale(8),
            fontSize: moderateScale(15),
            color: "#111827",
            paddingVertical: verticalScale(8),
        },

        lockedInput: {
            backgroundColor: "#f3f4f6",
        },

        lockedText: {
            color: "#6b7280",
        },

        emailLabelRow: {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: verticalScale(6),
        },

        lockNote: {
            fontSize: moderateScale(11),
            color: "#6b7280",
            marginTop: verticalScale(4),
        },

        phoneWrapper: {
            borderWidth: 1,
            borderColor: "#d1d5db",
            borderRadius: moderateScale(8),
            paddingVertical: verticalScale(1),
        },

        phoneContainer: {
            width: "100%",
            backgroundColor: "transparent",
        },

        phoneTextContainer: {
            backgroundColor: "transparent",
            paddingVertical: 0,
        },

        phoneText: {
            fontSize: moderateScale(15),
            color: "#111827",
        },

        codeText: {
            fontSize: moderateScale(15),
            color: "#111827",
        },

        flagButton: {
            paddingHorizontal: scale(6),
        },

        countryButton: {
            backgroundColor: "transparent",
        },

        vatBox: {
            marginTop: verticalScale(10),
            backgroundColor: "#ecfdf5",
            borderWidth: 1,
            borderColor: "#bbf7d0",
            borderRadius: moderateScale(8),
            padding: scale(12),
        },

        vatTitle: {
            fontSize: moderateScale(13),
            fontWeight: "600",
            color: "#065f46",
            marginBottom: verticalScale(4),
        },

        vatText: {
            fontSize: moderateScale(12),
            color: "#047857",
        },

    });

export default getStyles;