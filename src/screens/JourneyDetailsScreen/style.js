import { StyleSheet } from "react-native";
import {
  moderateScale,
  scale,
  verticalScale,
} from "react-native-size-matters";

const getStyles = (colors) =>
  StyleSheet.create({
    container: {
      padding: moderateScale(16),
      paddingBottom: verticalScale(40),
    },

    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: moderateScale(16),
      paddingTop: moderateScale(50),
      paddingBottom: moderateScale(10),
      backgroundColor: colors.primary,
    },

    headerIcon: {
      width: moderateScale(40),
      height: moderateScale(40),
      justifyContent: "center",
      alignItems: "center",
    },

    headerTitle: {
      fontSize: moderateScale(18),
      fontWeight: "700",
      color: colors.white,
    },

    headerRight: {
      width: moderateScale(40),
    },

    card: {
      backgroundColor: colors.white,
      borderRadius: moderateScale(12),
      padding: moderateScale(16),
      marginBottom: verticalScale(14),
      borderWidth: 1,
      borderColor: colors.border,
    },

    cardTitle: {
      fontSize: moderateScale(16),
      fontWeight: "600",
      color: colors.text,
      marginBottom: verticalScale(12),
    },

    bookingCard: {
      backgroundColor: colors.bg,
      borderRadius: moderateScale(12),
      padding: moderateScale(16),
      marginBottom: verticalScale(14),
    },

    rowBetween: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },

    bookingId: {
      fontSize: moderateScale(16),
      fontWeight: "700",
      color: colors.text,
    },

    smallText: {
      fontSize: moderateScale(12),
      color: colors.gray600,
    },

    statusBadge: {
      paddingHorizontal: moderateScale(20),
      paddingVertical: verticalScale(6),
      borderRadius: moderateScale(20),
      backgroundColor: colors.primary + "20",
    },

    statusText: {
      fontSize: moderateScale(12),
      color: colors.primary,
      fontWeight: "600",
    },

    bookingTimeRow: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: verticalScale(10),
    },

    iconTextRow: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: verticalScale(10),
    },

    divider: {
      width: 1,
      height: verticalScale(24),
      backgroundColor: colors.border,
      marginHorizontal: moderateScale(10),
    },

    labelText: {
      fontSize: moderateScale(10),
      color: colors.gray600,
    },

    valueText: {
      fontSize: moderateScale(13),
      color: colors.text,
      fontWeight: "600",
    },

    locationRow: {
      flexDirection: "row",
      alignItems: "center",
    },

    locationTitle: {
      fontSize: moderateScale(14),
      fontWeight: "600",
      color: colors.text,
      marginLeft: moderateScale(8),
    },

    locationContent: {
      marginLeft: moderateScale(32),
      marginTop: verticalScale(6),
    },

    locationText: {
      fontSize: moderateScale(13),
      color: colors.text,
    },

    locationSub: {
      fontSize: moderateScale(12),
      color: colors.gray600,
      marginTop: verticalScale(2),
    },

    pointA: {
      width: scale(24),
      height: scale(24),
      borderRadius: scale(12),
      backgroundColor: colors?.bg,
      alignItems: "center",
      justifyContent: "center",
    },

    pointB: {
      width: scale(24),
      height: scale(24),
      borderRadius: scale(12),
      backgroundColor: colors?.bg,
      alignItems: "center",
      justifyContent: "center",
    },

    pointText: {
      fontSize: moderateScale(12),
      fontWeight: "700",
      color: colors?.text,
    },

    passengerText: {
      marginLeft: moderateScale(10),
      color: colors.text,
    },

    linkText: {
      marginLeft: moderateScale(10),
      color: colors.primary,
    },

    fareLabel: {
      color: colors.gray600,
      fontSize: moderateScale(13),
    },

    fareValue: {
      color: colors.text,
      fontWeight: "600",
    },

    totalRow: {
      marginTop: verticalScale(12),
      borderTopWidth: 1,
      borderColor: colors.border,
      paddingTop: verticalScale(8),
      flexDirection: "row",
      justifyContent: "space-between",
    },

    totalLabel: {
      fontWeight: "700",
      color: colors.text,
    },

    totalValue: {
      fontWeight: "700",
      color: colors.primary,
      fontSize: moderateScale(16),
    },

    paymentText: {
      textAlign: "center",
      marginTop: verticalScale(10),
      color: colors.gray600,
    },

    closeButton: {
      backgroundColor: colors.bttonColor,
      paddingVertical: verticalScale(12),
      borderRadius: moderateScale(10),
      alignItems: "center",
      marginTop: verticalScale(10),
    },

    closeText: {
      color: colors.white,
      fontSize: moderateScale(15),
      fontWeight: "700",
    },

    vehicleWrapper: {
      marginTop: verticalScale(6),
    },

    vehicleRow: {
      flexDirection: "row",
      alignItems: "center",
      borderBottomWidth: 1,
      borderBottomColor: colors?.gray200,
      paddingBottom: verticalScale(10),
    },

    vehicleName: {
      marginLeft: moderateScale(8),
      fontSize: moderateScale(13),
      color: colors?.text,
      flex: 1,
    },

    vehicleStatsRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: verticalScale(12),
    },

    vehicleStat: {
      alignItems: "center",
      flex: 1,
    },

    vehicleStatValue: {
      fontSize: moderateScale(12),
      fontWeight: "500",
      color: colors?.white,
    },

    vehicleStatLabel: {
      fontSize: moderateScale(11),
      color: colors?.black,
      textAlign: "center",
      marginTop: verticalScale(4),
    },

    vehicleDivider: {
      width: 1,
      height: verticalScale(28),
      backgroundColor: "#e5e7eb",
    },
    returnBadge: {
      marginHorizontal: moderateScale(6),
      paddingHorizontal: moderateScale(6),
      paddingVertical: moderateScale(6),
      borderRadius: moderateScale(4),
      backgroundColor: colors?.primary + "20",
    },
  });

export default getStyles;