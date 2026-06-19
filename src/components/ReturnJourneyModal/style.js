import { StyleSheet } from "react-native";
import { moderateScale, verticalScale } from "react-native-size-matters";

const getStyles = (colors) =>
  StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.5)",
      justifyContent: "flex-end",
    },

    modalContainer: {
      backgroundColor: colors.white,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      height: "95%",
      flexDirection: "column",
    },

    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      backgroundColor: colors.secondary,
      paddingHorizontal: 16,
      paddingVertical: 16,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
    },

    headerTitle: {
      fontSize: 18,
      fontWeight: "700",
      color: "#fff",
      flex: 1,
      textAlign: "center",
    },

    fare: {
      fontSize: 18,
      fontWeight: "700",
      color: "#fff",
    },

    closeButton: {
      padding: 8,
    },

    content: {
      flex: 1,
      paddingHorizontal: 16,
      paddingVertical: 12,
    },

    card: {
      backgroundColor: colors.bg,
      borderRadius: 12,
      paddingVertical: 12,
    },

    section: {
      paddingHorizontal: 16,
      marginVertical: 12,
    },

    label: {
      fontSize: 14,
      fontWeight: "600",
      marginBottom: 8,
      color: colors.text,
    },

    input: {
      flexDirection: "row",
      alignItems: "center",
      borderWidth: 1,
      borderColor: colors.gray200,
      borderRadius: 8,
      paddingHorizontal: 12,
      paddingVertical: 12,
      backgroundColor: colors.white,
      // marginBottom: 8,
    },

    inputText: {
      marginLeft: 8,
      fontSize: 14,
      color: colors.text,
      flex: 1,
    },

    dropoffItem: {
      marginBottom: 12,
    },

    inputWrapper: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },

    searchInput: {
      flex: 1,
    },

    fieldBelow: {
      marginTop: 8,
    },

    listWrapper: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },

    buttonMinus: {
      backgroundColor: colors.error,
      borderRadius: 8,
      padding: 8,
      justifyContent: "center",
      alignItems: "center",
      width: moderateScale(40),
      height: moderateScale(40),
    },

    buttonPlus: {
      backgroundColor: colors.secondary,
      borderRadius: 8,
      padding: 8,
      justifyContent: "center",
      alignItems: "center",
      width: moderateScale(40),
      height: moderateScale(40),
    },

    notes: {
      borderWidth: 1,
      borderColor: colors.gray200,
      borderRadius: 8,
      paddingHorizontal: 12,
      paddingVertical: 12,
      fontSize: 14,
      color: colors.text,
      textAlignVertical: "top",
    },

    buttonContainer: {
      flexDirection: "row",
      gap: 12,
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderTopWidth: 1,
      borderTopColor: colors.gray100,
    },

    button: {
      flex: 1,
      paddingVertical: 12,
      borderRadius: 8,
      justifyContent: "center",
      alignItems: "center",
    },

    cancelButton: {
      borderWidth: 2,
      borderColor: colors.primary,
    },

    cancelButtonText: {
      fontSize: 14,
      fontWeight: "600",
      color: colors.primary,
    },

    confirmButton: {
      backgroundColor: colors.primary,
    },

    confirmButtonText: {
      fontSize: 14,
      fontWeight: "600",
      color: colors.white,
    },
  });

export default getStyles;
