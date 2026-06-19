import { StyleSheet } from "react-native";
import {
    moderateScale,
    verticalScale,
    scale,
} from "react-native-size-matters";

const getStyles = (colors) =>
    StyleSheet.create({
        overlay: {
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.4)",
            justifyContent: "center",
            alignItems: "center",
            paddingHorizontal: moderateScale(16),
        },

        modalContainer: {
            width: "100%",
            backgroundColor: colors.white,
            borderRadius: moderateScale(16),
            padding: moderateScale(18),
        },

        title: {
            fontSize: moderateScale(18),
            fontWeight: "700",
            color: colors.text,
            marginBottom: verticalScale(8),
        },

        description: {
            fontSize: moderateScale(14),
            color: colors.lightText,
            marginBottom: verticalScale(20),
            lineHeight: moderateScale(20),
        },

        buttonRow: {
            flexDirection: "row",
            justifyContent: "flex-end",
        },

        button: {
            paddingVertical: verticalScale(8),
            paddingHorizontal: moderateScale(16),
            borderRadius: moderateScale(8),
            marginLeft: moderateScale(10),
            minWidth: moderateScale(80),
            alignItems: "center",
        },

        cancelButton: {
            backgroundColor: colors.border || "#eee",
        },

        confirmButton: {
            backgroundColor: colors.error || "#ff3b30",
        },

        cancelText: {
            color: colors.text,
            fontSize: moderateScale(14),
            fontWeight: "500",
        },

        confirmText: {
            color: colors.white,
            fontSize: moderateScale(14),
            fontWeight: "600",
        },
    });

export default getStyles;