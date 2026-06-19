import { StyleSheet } from "react-native";
import { moderateScale, verticalScale } from "react-native-size-matters";

const getStyles = (colors) => StyleSheet.create({

    container: {
        marginVertical: verticalScale(10),
    },

    title: {
        fontSize: moderateScale(14),
        fontWeight: "600",
        marginBottom: verticalScale(8),
        color: colors.text,
    },

    dateButton: {
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: colors.border,
        padding: moderateScale(12),
        borderRadius: moderateScale(10),
        backgroundColor: colors.bg,
    },

    dateText: {
        marginLeft: moderateScale(10),
        flex: 1,
        fontSize: moderateScale(14),
    },

    timeRow: {
        flexDirection: "row",
        marginTop: verticalScale(10),
    },

    timeCol: {
        flex: 1,
        marginHorizontal: moderateScale(4),
    },

    label: {
        fontSize: moderateScale(13),
        marginBottom: verticalScale(4),
        color: colors.text,
    },

    selector: {
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: moderateScale(8),
    },

    selectStyle: {
        padding: moderateScale(12),
        backgroundColor: colors.bg,
    },

    selectText: {
        fontSize: moderateScale(14),
    },

    selectorInner: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: moderateScale(8),
    },

    valueText: {
        fontSize: moderateScale(14),
    },

    optionText: {
        fontSize: moderateScale(14),
        color: colors.primary,
    },

    overlay: {
        backgroundColor: "rgba(0,0,0,0.6)",
    },

    optionContainer: {
        borderRadius: moderateScale(8),
        alignSelf: 'center',
        width: moderateScale(200),
        // left: 100,
        height: 300
    },
    cancelButton: {
        backgroundColor: colors?.primary,
        // paddingVertical: verticalScale(14),
        borderRadius: moderateScale(10),
        // marginTop: verticalScale(10),
        width: moderateScale(200),
        alignSelf: 'center'
    },

    cancelText: {
        color: colors?.white,
        fontSize: moderateScale(16),
        fontWeight: '600',
        textAlign: 'center',
    },

});

export default getStyles;