import { StyleSheet } from "react-native";
import { moderateScale, verticalScale } from "react-native-size-matters";

const getStyles = (colors) => StyleSheet.create({
    overlay: {
        flex: 1,
        // backgroundColor: 'red',
        justifyContent: 'center',
    },
    modalContainer: {
        borderRadius: moderateScale(10),
        backgroundColor: colors?.gray200,
        maxHeight: '70%',
        width: '80%',
        alignSelf: 'center'
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: moderateScale(16),
        paddingVertical: verticalScale(16),
        borderTopLeftRadius: moderateScale(10),
        borderTopRightRadius: moderateScale(10),

    },
    title: {
        fontSize: moderateScale(18),
        fontWeight: '700',
        color: colors.white,
    },
    content: {
        paddingHorizontal: moderateScale(16),
        paddingVertical: verticalScale(12),
    },
    option: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: moderateScale(12),
        paddingVertical: verticalScale(12),
        borderRadius: moderateScale(8),
        marginBottom: verticalScale(8),
        borderBottomColor: colors?.white,
        borderBottomWidth: 1
    },
    optionText: {
        fontSize: moderateScale(12),
    },
    footer: {
        flexDirection: 'row',
        gap: moderateScale(12),
        paddingHorizontal: moderateScale(16),
        paddingVertical: verticalScale(12),
    },
    button: {
        flex: 1,
        paddingVertical: verticalScale(12),
        borderRadius: moderateScale(8),
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors?.primary
    },
    buttonText: {
        fontSize: moderateScale(14),
        fontWeight: '600',
    },
    label: {
        fontSize: moderateScale(12),
        marginBottom: verticalScale(6),
        color: colors.text,
        fontWeight: "500",
    },

    input: {
        borderWidth: 1,
        borderColor: colors.gray300,
        borderRadius: moderateScale(8),
        paddingHorizontal: moderateScale(10),
        paddingVertical: verticalScale(10),
        marginBottom: verticalScale(12),
        backgroundColor: colors.white,
        fontSize: moderateScale(13),
    },

    uploadBox: {
        flexDirection: "row",
        alignItems: "center",
        gap: moderateScale(8),
        borderWidth: 1,
        borderStyle: "dashed",
        borderColor: colors.primary,
        borderRadius: moderateScale(8),
        padding: moderateScale(12),
        marginBottom: verticalScale(10),
    },

    uploadText: {
        fontSize: moderateScale(12),
        color: colors.primary,
    },
});

export default getStyles;
