import { StyleSheet } from "react-native";
import { scale, verticalScale, moderateScale } from "react-native-size-matters";

const getStyles = (colors) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colors?.white,
            // paddingTop: verticalScale(40),
        },

        header: {
            height: moderateScale(110),
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingHorizontal: scale(16),
            paddingTop: verticalScale(40),
            paddingBottom: moderateScale(10)
        },

        headerTitleWrap: {
            alignItems: "center",
        },

        headerTitle: {
            fontSize: moderateScale(18),
            fontWeight: "700",
        },

        headerSubtitle: {
            fontSize: moderateScale(12),
            opacity: 0.9,
            marginTop: verticalScale(2),
        },

        headerIcons: {
            flexDirection: "row",
            gap: scale(14),
        },

        tabsContainer: {
            flexDirection: "row",
            backgroundColor: colors.card,
            borderBottomWidth: scale(1),
            borderColor: colors.gray200,
        },

        tab: {
            flex: 1,
            paddingVertical: verticalScale(12),
            alignItems: "center",
            // backgroundColor: "#F3F4F6",
        },

        activeTab: {
            backgroundColor: colors.bttonColor,
            opacity: 0.8,
        },

        tabText: {
            fontSize: moderateScale(14),
            fontWeight: "600",
            color: "#374151",
        },

        activeTabText: {
            color: colors?.white,
        },

        card: {
            backgroundColor: colors.bg,
            borderRadius: moderateScale(12),
            padding: scale(16),
            marginBottom: verticalScale(12),
            borderWidth: scale(1),
            borderColor: colors.gray200,
        },

        cardTop: {
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: verticalScale(12),
        },

        date: {
            fontSize: moderateScale(15),
            fontWeight: "600",
            color: colors.text,
        },

        bookingId: {
            fontSize: moderateScale(12),
            color: colors.text,
            opacity: 0.7,
            marginTop: verticalScale(2),
        },

        type: {
            fontSize: moderateScale(12),
            color: colors.text,
            opacity: 0.6,
            marginTop: verticalScale(2),
        },

        statusContainer: {
            backgroundColor: colors?.bttonColor,
            paddingHorizontal: scale(16),
            paddingVertical: verticalScale(4),
            borderRadius: moderateScale(20),
            alignSelf: "flex-start",
            opacity: 0.8,
        },

        statusText: {
            fontSize: moderateScale(11),
            fontWeight: "600",
            color: colors?.white,
        },

        cardBottom: {
            flexDirection: "row",
            justifyContent: "space-between",
            borderTopWidth: scale(1),
            borderColor: colors.gray200,
            paddingTop: verticalScale(10),
        },

        distance: {
            fontSize: moderateScale(12),
            color: colors.text,
            opacity: 0.7,
        },

        amount: {
            fontSize: moderateScale(18),
            fontWeight: "700",
            color: colors.text,
        },
        emptyContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            paddingTop: verticalScale(70),
        },
        downloadBtn: {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: colors.bttonColor,
            opacity: 0.8,
            paddingHorizontal: 12,
            paddingVertical: 8,
            borderRadius: 8,
            gap: 6,
        },

        downloadText: {
            color: colors.white,
            fontWeight: "600",
            fontSize: 12,
        },
    });

export default getStyles;