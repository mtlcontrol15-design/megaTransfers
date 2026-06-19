import { StyleSheet } from 'react-native';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';

const getStyles = (colors) => StyleSheet.create({
    midContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: moderateScale(24),
        paddingVertical: verticalScale(60),
    },
    iconWrapper: {
        width: moderateScale(100),
        height: moderateScale(100),
        borderRadius: moderateScale(50),
        backgroundColor: colors?.gray100,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: moderateScale(20),
    },
    titleText: {
        fontSize: moderateScale(24),
        fontWeight: "700",
        color: colors?.blackishText,
        marginBottom: moderateScale(8),
    },
    descText: {
        fontSize: moderateScale(14),
        color: colors?.gray300,
        textAlign: "center",
        marginBottom: moderateScale(22),
    },
    buttonWrapper: {
        backgroundColor: colors?.primary,
        paddingHorizontal: moderateScale(22),
        paddingVertical: verticalScale(11),
        borderRadius: moderateScale(12),
        flexDirection: "row",
        justifyContent:'center'
        // alignItems: "center",
    }
});

export default getStyles;
