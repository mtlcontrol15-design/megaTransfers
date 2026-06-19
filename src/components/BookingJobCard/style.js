import { StyleSheet } from "react-native";
import { moderateScale, verticalScale } from "react-native-size-matters";

const getStyles = (colors) =>
    StyleSheet.create({
        card: {
            backgroundColor: colors.card || "#fff",
            borderRadius: moderateScale(12),
            padding: moderateScale(14),
            marginBottom: verticalScale(12),
            borderWidth: 1,
            borderColor: "#E5E7EB",
        },

        cardHeader: {
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: verticalScale(10),
        },

        bookingId: {
            fontSize: moderateScale(16),
            fontWeight: "700",
            color: colors.black,
        },

        journeyType: {
            fontSize: moderateScale(12),
            color: colors?.lightText,
            marginTop: moderateScale(2),
        },

        statusBadge: {
            paddingHorizontal: moderateScale(10),
            paddingVertical: moderateScale(6),
            borderRadius: moderateScale(10),
            height: moderateScale(45),
            width: moderateScale(150),
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: colors?.gray100,
        },

        statusText: {
            fontSize: moderateScale(16),
            fontWeight: "500",
            color: colors?.primary,
        },

        dateRow: {
            flexDirection: "row",
            gap: moderateScale(20),
            marginBottom: verticalScale(10),
        },

        dateItem: {
            flexDirection: "row",
            alignItems: "center",
            gap: moderateScale(6),
        },

        dateText: {
            fontSize: moderateScale(13),
            color: colors.black,
            fontWeight: "600",
        },

        locationBlock: {
            marginBottom: verticalScale(8),
        },

        locationHeader: {
            flexDirection: "row",
            alignItems: "center",
            gap: moderateScale(6),
            marginBottom: verticalScale(2),
        },

        locationTitle: {
            fontSize: moderateScale(13),
            fontWeight: "600",
            color: colors.black,
        },

        locationText: {
            marginLeft: moderateScale(24),
            fontSize: moderateScale(13),
            color: colors?.lightText,
        },
        extraSection: {
            marginTop: verticalScale(8),
            borderTopWidth: 1,
            borderTopColor: "red",
            paddingTop: verticalScale(10),
        },

        infoRow: {
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: verticalScale(6),
        },

        label: {
            fontSize: moderateScale(13),
            color: colors?.lightText,
        },

        value: {
            fontSize: moderateScale(13),
            fontWeight: "600",
            color: colors.black,
        },

        showMoreBtn: {
            marginTop: verticalScale(6),
            alignSelf: "center",
            paddingHorizontal: moderateScale(12),
            paddingVertical: verticalScale(6),
            backgroundColor: colors?.gray200,
            borderRadius: moderateScale(6),
            flexDirection: "row",
            alignItems: "center",
            justifyContent: 'center',
            gap: moderateScale(6),
            width: '100%',
        },

        showMoreText: {
            fontSize: moderateScale(13),
            fontWeight: "600",
            color: colors?.gray600,
        },
        flightContainer: {
            marginTop: verticalScale(6),
            marginLeft: moderateScale(24),
        },

        flightRow: {
            flexDirection: "row",
            alignItems: "center",
            flexWrap: "wrap",
            marginBottom: verticalScale(4),
        },

        flightLabel: {
            fontSize: moderateScale(13),
            color: colors?.black,
            marginRight: moderateScale(6),
        },

        flightButton: {
            flexDirection: "row",
            alignItems: "center",
            gap: moderateScale(4),
            marginRight: moderateScale(10),
            backgroundColor: colors?.gray200,
            paddingHorizontal: moderateScale(8),
            paddingVertical: verticalScale(4),
            borderRadius: moderateScale(6),
        },

        flightNumber: {
            fontSize: moderateScale(13),
            fontWeight: "700",
            color: colors?.black,
        },

        flightRoute: {
            fontSize: moderateScale(13),
            color: colors?.lightText,
        },

        flightInfo: {
            fontSize: moderateScale(13),
            color: colors?.lightText,
            marginTop: verticalScale(2),
        },
        expandedContainer: {
            marginTop: verticalScale(10),
        },

        gridContainer: {
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "space-between",
        },

        gridItem: {
            flexDirection: "row",
            alignItems: "center",
            width: "48%",
            marginBottom: verticalScale(10),
            gap: moderateScale(8),
        },

        gridText: {
            flex: 1,
        },

        gridLabel: {
            fontSize: moderateScale(11),
            color: colors?.black,
            fontWeight: "600",
        },

        gridValue: {
            fontSize: moderateScale(13),
            color: colors?.lightText,
        },

        fareValue: {
            fontSize: moderateScale(13),
            fontWeight: "700",
            color: colors?.lightGreen,
        },

        separator: {
            height: 0.7,
            backgroundColor: colors?.lightText,
            marginVertical: verticalScale(10),
        },

        section: {
            marginBottom: verticalScale(10),
        },

        sectionHeader: {
            flexDirection: "row",
            alignItems: "center",
            gap: moderateScale(6),
            marginBottom: verticalScale(6),
        },

        sectionTitle: {
            fontSize: moderateScale(14),
            fontWeight: "600",
            color: colors?.black,
        },

        passengerCard: {
            backgroundColor: colors?.gray100,
            borderRadius: moderateScale(8),
            padding: moderateScale(10),
            marginLeft: moderateScale(24),
        },

        passengerName: {
            fontSize: moderateScale(14),
            fontWeight: "600",
            marginBottom: verticalScale(4),
        },

        passengerRow: {
            flexDirection: "row",
            alignItems: "center",
            gap: moderateScale(6),
            marginTop: verticalScale(2),
        },

        passengerText: {
            fontSize: moderateScale(13),
            color: colors?.lightText,
        },

        vehicleGrid: {
            flexDirection: "row",
            flexWrap: "wrap",
            marginLeft: moderateScale(24),
            gap: moderateScale(10),
        },

        vehicleItem: {
            flexDirection: "row",
            alignItems: "center",
            gap: moderateScale(6),
            width: "45%",
        },

        vehicleText: {
            fontSize: moderateScale(12),
            color: colors?.black,
        },
        statusContainer: {
            marginTop: verticalScale(12),
        },

        cancelBox: {
            borderWidth: 1,
            borderColor: "#FCA5A5",
            backgroundColor: "#FEE2E2",
            padding: moderateScale(10),
            borderRadius: moderateScale(8),
        },

        cancelText: {
            fontSize: moderateScale(13),
            color: "#B91C1C",
            textAlign: "center",
            fontWeight: "600",
        },

        completedBox: {
            flexDirection: "row",
            alignItems: "center",
            gap: moderateScale(8),
            borderWidth: 1,
            borderColor: "#10B981",
            backgroundColor: "#F0FDF4",
            padding: moderateScale(10),
            borderRadius: moderateScale(8),
        },

        completedText: {
            fontSize: moderateScale(13),
            color: "#166534",
            fontWeight: "600",
            flex: 1,
        },
        bookingDateContainer: {
            flexDirection: "row",
            justifyContent: "flex-end",
            marginVertical: moderateScale(5),
        },

        bookingDateLabel: {
            color: colors?.black,
            fontSize: moderateScale(13),
            fontWeight: "600",
        },

        bookingDateValue: {
            color: colors?.lightText,
            fontSize: moderateScale(13),
        },
    });

export default getStyles;