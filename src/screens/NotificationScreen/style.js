import { StyleSheet } from "react-native";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";

const getStyles = (colors) =>
  StyleSheet.create({
    midContainer: {
      flex: 1,
      backgroundColor: "#fafafa",
      borderTopLeftRadius: moderateScale(20),
      borderTopRightRadius: moderateScale(20),
      marginTop: verticalScale(6),
      
    },

    card: {
      flexDirection: "row",
      backgroundColor: colors.white,
      padding: moderateScale(14),
      borderRadius: moderateScale(12),
      marginBottom: verticalScale(12),
      elevation: 2,
      shadowColor: "#000",
      shadowOpacity: 0.05,
      shadowOffset: { width: 0, height: 2 },
      shadowRadius: 4,
    },

    iconContainer: {
      height: moderateScale(40),
      width: moderateScale(40),
      borderRadius: moderateScale(20),
      backgroundColor: colors.primary,
      justifyContent: "center",
      alignItems: "center",
      marginRight: moderateScale(12),
    },

    textContainer: {
      flex: 1,
    },

    title: {
      fontSize: moderateScale(14),
      fontWeight: "700",
      color: colors.text,
      marginBottom: 2,
    },

    message: {
      fontSize: moderateScale(12),
      color: colors.gray400,
      marginBottom: 4,
    },

    time: {
      fontSize: moderateScale(11),
      color: colors.gray300,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      backgroundColor: colors.primary,
      paddingHorizontal: scale(16),
      paddingTop: verticalScale(40),
      paddingBottom: verticalScale(10)
    },

    headerTitle: {
      fontSize: moderateScale(16),
      fontWeight: "600",
      color: colors.white,
    },
    actionBar: {
      flexDirection: "row",
      justifyContent: "flex-end",
      paddingHorizontal: moderateScale(16),
      paddingVertical: verticalScale(8),
    },

    clearText: {
      color: "#EF4444",
      fontWeight: "600",
      fontSize: moderateScale(12),
    },

    readAll: {
      color: "#fff",
      fontSize: moderateScale(12),
      fontWeight: "600",
    },

    emptyContainer: {
      alignItems: "center",
      marginTop: verticalScale(80),
      flex: 1,
    },

    emptyText: {
      marginTop: verticalScale(10),
      fontSize: moderateScale(14),
      color: "#9CA3AF",
      textAlign: "center",
      width: "100%",
    },
  });

export default getStyles;