import { StyleSheet } from "react-native";
import { scale, verticalScale, moderateScale } from "react-native-size-matters";

const getStyles = (colors) =>
    StyleSheet.create({
        container: {
            padding: scale(16),
            backgroundColor: colors.bg,
            borderBottomWidth: scale(1),
            borderColor: colors.border,
        },

        row: {
            flexDirection: "row",
            gap: scale(10),
        },

        filterBtn: {
            flex: 1,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingHorizontal: scale(12),
            paddingVertical: verticalScale(4),
            borderRadius: moderateScale(12),
            borderWidth: scale(1),
            borderColor: colors.border,
            backgroundColor: colors.background,
        },

        activeFilter: {
            borderColor: colors.primary,
            backgroundColor: "#EFF6FF",
        },

        filterContent: {
            flexDirection: "row",
            alignItems: "center",
            flex: 1,
        },

        iconBox: {
            width: scale(30),
            height: scale(30),
            borderRadius: moderateScale(8),
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: colors.card,
            marginRight: scale(8),
        },

        textWrap: {
            flex: 1,
        },

        label: {
            fontSize: moderateScale(11),
            color: colors.textSecondary,
            fontWeight: "500",
        },

        value: {
            fontSize: moderateScale(13),
            fontWeight: "600",
            color: colors.text,
        },

        clearBtn: {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            marginTop: verticalScale(14),
            paddingVertical: verticalScale(10),
            borderRadius: moderateScale(10),
            backgroundColor: "#FEF2F2",
        },

        clearText: {
            marginLeft: scale(6),
            fontSize: moderateScale(13),
            fontWeight: "700",
            color: "#DC2626",
        },
    });

export default getStyles;