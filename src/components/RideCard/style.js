import { StyleSheet } from "react-native";
import { moderateScale } from "react-native-size-matters";

const getStyles = (colors) =>
  StyleSheet.create({
    container: {
      marginHorizontal: moderateScale(16),
      marginVertical: moderateScale(14),
      paddingBottom: moderateScale(10),
      backgroundColor: colors?.bg,
      borderRadius: moderateScale(20),
      borderWidth: 1,
      borderColor: colors?.gray100,
      overflow: "hidden",
      elevation: 3,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.06,
      shadowRadius: 6,
    },

    header: {
      paddingHorizontal: moderateScale(16),
      paddingVertical: moderateScale(14),
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },

    bookingIdBox: {
      backgroundColor: colors?.primary,
      paddingHorizontal: moderateScale(12),
      paddingVertical: moderateScale(6),
      borderRadius: moderateScale(10),
    },

    bookingIdText: {
      color: colors?.white,
      fontWeight: "700",
      fontSize: moderateScale(16),
    },

    statusBadge: {
      marginLeft: moderateScale(10),
      paddingHorizontal: moderateScale(12),
      paddingVertical: moderateScale(5),
      borderRadius: 999,
      borderWidth: 1,
      borderColor: colors?.gray200,
      backgroundColor: colors?.gray200
    },

    actionButton: {
      backgroundColor: colors?.primary,
      padding: moderateScale(8),
      borderRadius: moderateScale(10),
    },

    actionMenu: {
      position: "absolute",
      right: moderateScale(16),
      top: moderateScale(56),
      backgroundColor: colors?.bg,
      borderRadius: moderateScale(14),
      borderWidth: 1,
      borderColor: colors?.gray100,
      zIndex: 100,
      overflow: "hidden",
      elevation: 8,
    },

    actionItem: {
      paddingHorizontal: moderateScale(18),
      paddingVertical: moderateScale(14),
      flexDirection: "row",
      alignItems: "center",
    },

    actionText: {
      marginLeft: moderateScale(10),
      fontSize: moderateScale(14),
      fontWeight: "500",
      color: colors?.blackishText,
    },

    content: {
      paddingHorizontal: moderateScale(16),
    },

    passengerBox: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: moderateScale(6),
      backgroundColor: colors?.gray70,
      paddingHorizontal: moderateScale(12),
      paddingVertical: moderateScale(10),
      borderRadius: moderateScale(14),
    },

    passengerName: {
      flex: 1,
      marginLeft: moderateScale(10),
      fontSize: moderateScale(15),
      fontWeight: "600",
      color: colors?.blackishText,
    },

    phoneBox: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors?.white,
      paddingHorizontal: moderateScale(8),
      paddingVertical: moderateScale(5),
      borderRadius: moderateScale(10),
    },

    phoneText: {
      marginLeft: moderateScale(4),
      fontSize: moderateScale(11),
      fontWeight: "500",
      color: colors?.blackishText,
    },

    dateTimeRow: {
      flexDirection: "row",
      gap: moderateScale(8),
      marginBottom: moderateScale(12),
    },

    dateBox: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors?.gray100,
      paddingVertical: moderateScale(10),
      borderRadius: moderateScale(14),
    },

    timeBox: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors?.gray100,
      paddingVertical: moderateScale(10),
      borderRadius: moderateScale(14),
    },

    dateTimeText: {
      marginLeft: moderateScale(8),
      color: colors?.blackishText,
      fontSize: moderateScale(13),
      fontWeight: "500",
    },

    locationBox: {
      marginBottom: moderateScale(12),
      backgroundColor: colors?.gray70,
      borderWidth: 1,
      borderColor: colors?.gray50,
      borderRadius: moderateScale(16),
      padding: moderateScale(14),
      gap: moderateScale(20),
    },

    locationRow: {
      flexDirection: "row",
      alignItems: "flex-start",
    },

    locationLabel: {
      fontSize: moderateScale(13),
      color: colors?.black,
      fontWeight: "600",
      marginBottom: moderateScale(2),
    },

    locationText: {
      fontSize: moderateScale(12),
      color: colors?.black,
      fontWeight: "500",
    },

    dashedLine: {
      marginLeft: moderateScale(13),
      borderLeftWidth: 2,
      borderStyle: "dashed",
      borderColor: colors?.gray600,
      height: moderateScale(14),
      marginVertical: moderateScale(4),
    },

    bottomRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingTop: moderateScale(12),
      paddingBottom: moderateScale(12),
      borderTopWidth: 1,
      borderTopColor: colors?.gray200,
    },

    vehicleText: {
      fontSize: moderateScale(14),
      color: colors?.gray600,
      fontWeight: "600",
    },

    fareBox: {
      backgroundColor: colors?.gray100,
      paddingHorizontal: moderateScale(14),
      paddingVertical: moderateScale(10),
      borderRadius: moderateScale(14),
      borderWidth: 1,
      borderColor: colors?.gray200,
    },

    fareText: {
      color: colors?.black,
      fontWeight: "700",
      fontSize: moderateScale(17),
    },

    driverBox: {
      marginTop: moderateScale(12),
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors?.blueishBackGround,
      paddingHorizontal: moderateScale(12),
      paddingVertical: moderateScale(10),
      borderRadius: moderateScale(12),
    },

    driverAvatar: {
      width: moderateScale(32),
      height: moderateScale(32),
      borderRadius: 999,
      backgroundColor: colors?.primary,
      alignItems: "center",
      justifyContent: "center",
    },

    driverInitial: {
      color: colors?.white,
      fontWeight: "700",
      fontSize: moderateScale(12),
    },

    driverLabel: {
      fontSize: moderateScale(11),
      color: colors?.lightBlue,
      fontWeight: "600",
    },

    driverName: {
      fontSize: moderateScale(14),
      color: colors?.blackishText,
      fontWeight: "600",
    },
    returnBadge: {
      marginHorizontal: moderateScale(6),
      paddingHorizontal: moderateScale(6),
      paddingVertical: moderateScale(8),
      borderRadius: moderateScale(4),
      backgroundColor: colors?.primary + "20",
    },
  });

export default getStyles;