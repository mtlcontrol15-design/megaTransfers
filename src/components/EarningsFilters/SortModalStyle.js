import { StyleSheet } from "react-native";
import { moderateScale, verticalScale } from "react-native-size-matters";

const getStyles = (colors) => StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        borderRadius: moderateScale(10),
        backgroundColor: colors?.bg,
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
        borderBottomColor: colors?.gray200,
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
});

export default getStyles;
