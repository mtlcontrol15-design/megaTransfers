import { StyleSheet } from "react-native";
import {
    moderateScale,
    scale,
    verticalScale,
} from "react-native-size-matters";

const getStyles = (colors) => StyleSheet.create({
    backdrop: {
        flex: 1,
        justifyContent: "flex-end",
        backgroundColor: "rgba(0,0,0,0.45)",
    },

    sheet: {
        backgroundColor: colors.white,
        borderTopLeftRadius: moderateScale(22),
        borderTopRightRadius: moderateScale(22),
        paddingHorizontal: scale(18),
        paddingTop: verticalScale(10),
        paddingBottom: verticalScale(28),
    },

    handle: {
        width: scale(45),
        height: verticalScale(5),
        borderRadius: moderateScale(20),
        backgroundColor: colors.gray300 || "#D1D5DB",
        alignSelf: "center",
        marginBottom: verticalScale(16),
    },

    headerRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: verticalScale(14),
    },

    title: {
        fontSize: moderateScale(18),
        fontWeight: "700",
        color: colors.black,
    },

    subtitle: {
        fontSize: moderateScale(12),
        color: colors.gray500 || "#6B7280",
        marginTop: verticalScale(3),
    },

    closeButton: {
        width: moderateScale(36),
        height: moderateScale(36),
        borderRadius: moderateScale(18),
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: colors.gray100,
    },

    jobInfoBox: {
        backgroundColor: colors.gray100,
        borderRadius: moderateScale(12),
        paddingHorizontal: scale(12),
        paddingVertical: verticalScale(10),
        marginBottom: verticalScale(16),
    },

    jobInfoText: {
        fontSize: moderateScale(13),
        color: colors.text,
        fontWeight: "500",
        marginBottom: verticalScale(4),
    },

    inputLabel: {
        fontSize: moderateScale(13),
        fontWeight: "700",
        color: colors.black,
        marginBottom: verticalScale(8),
    },

    inputWrapper: {
        height: verticalScale(50),
        borderWidth: 1,
        borderColor: colors.gray200,
        borderRadius: moderateScale(12),
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: scale(14),
        marginBottom: verticalScale(18),
        backgroundColor: colors.white,
    },

    currencyText: {
        fontSize: moderateScale(18),
        fontWeight: "700",
        color: colors.black,
        marginRight: scale(8),
    },

    input: {
        flex: 1,
        fontSize: moderateScale(16),
        fontWeight: "600",
        color: colors.black,
        paddingVertical: 0,
    },

    submitButton: {
        height: verticalScale(48),
        borderRadius: moderateScale(12),
        alignItems: "center",
        justifyContent: "center",
    },

    submitButtonText: {
        color: "#FFFFFF",
        fontSize: moderateScale(15),
        fontWeight: "700",
    },
});

export default getStyles;