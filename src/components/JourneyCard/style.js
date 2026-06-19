import { StyleSheet } from "react-native";
import { moderateScale, verticalScale } from "react-native-size-matters";

const getStyles = (colors) =>
    StyleSheet.create({

        card: {
            backgroundColor: colors.bg,
            marginHorizontal: 16,
            marginVertical: 20,
            borderRadius: 16,
            paddingBottom: 16,
            elevation: 3
        },

        header: {
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 14,
            backgroundColor: colors?.primary,
            borderTopEndRadius: 16,
            borderTopLeftRadius: 16,
            padding: 16
        },

        switchContainer: {
            marginVertical: verticalScale(10),
            alignItems: "center",
            justifyContent: "center",
            width: moderateScale(70),
            alignSelf: 'center'
        },

        headerTitle: {
            fontSize: 18,
            fontWeight: "700",
            color: "#fff"
        },

        hourlyText: {
            fontSize: 12,
            color: colors?.white
        },

        fare: {
            fontSize: 18,
            fontWeight: "700",
            color: "#fff"
        },

        label: {
            fontSize: 13,
            fontWeight: "600",
            marginTop: 12,
            marginBottom: 6,
            color: "#374151"
        },

        input: {
            flexDirection: "row",
            alignItems: "center",
            borderWidth: 1,
            borderColor: "#e5e7eb",
            padding: 12,
            borderRadius: 10,
        },

        inputText: {
            marginLeft: 8,
            color: "#111827"
        },

        notes: {
            borderWidth: 1,
            borderColor: "#e5e7eb",
            borderRadius: 10,
            padding: 12,
            marginTop: 6
        },
        hourlyButton: {
            height: moderateScale(30),
            width: '90%',
            borderRadius: moderateScale(6),
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: colors?.secondary,
            alignSelf: 'center'
        },
        inputWrapper: {
            flexDirection: "row",
            alignItems: "center",
            marginVertical: moderateScale(6),
        },
        listWrapper: {
            flexDirection: "row",
            marginLeft: moderateScale(8)
        },
        buttonPlus: {
            height: moderateScale(36),
            width: moderateScale(36),
            borderRadius: moderateScale(8),
            backgroundColor: colors?.primary,
            alignItems: "center",
            justifyContent: "center",
            marginRight: 6,
        },
        buttonMinus: {
            height: moderateScale(36),
            width: moderateScale(36),
            borderRadius: moderateScale(8),
            backgroundColor: colors?.gray300,
            alignItems: "center",
            justifyContent: "center",
            marginRight: 6,
        },
        hourlyWarningContainer: {
            padding: moderateScale(10),
            backgroundColor: colors?.gray100,
            borderRadius: moderateScale(10),
            alignItems: "center",
            justifyContent: "center",
            alignSelf: 'center',
            width: '90%',
            marginBottom: moderateScale(10)
        }

    });

export default getStyles;