import { StyleSheet } from 'react-native';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';

const getStyles = (colors) =>
    StyleSheet.create({
        safeArea: {
            flex: 1,
            backgroundColor: colors.white,
        },
        header1: {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingHorizontal: moderateScale(16),
            paddingTop: moderateScale(50),
            paddingBottom: moderateScale(30),
            backgroundColor: colors.primary,
        },
        headerRight: {
            width: moderateScale(40),
        },
        headerTitle: {
            fontSize: moderateScale(18),
            fontWeight: '700',
            color: colors.white,
        },
        container: {
            flex: 1,
            paddingHorizontal: scale(24),
            paddingTop: verticalScale(15),
        },
        header: {
            alignItems: 'center',
            marginBottom: verticalScale(20),
        },
        title: {
            fontSize: moderateScale(28),
            fontWeight: '700',
            color: colors.primary,
            marginBottom: scale(8),
            textAlign: 'center',
        },
        subtitle: {
            fontSize: moderateScale(15),
            color: colors.grey,
            textAlign: 'center',
            lineHeight: moderateScale(22),
        },
        sectionLabel: {
            fontSize: moderateScale(12),
            fontWeight: '800',
            color: colors.grey,
            letterSpacing: 4,
            marginBottom: verticalScale(12),
        },
        listContent: {
            paddingBottom: verticalScale(12),
        },
        roleCard: {
            minHeight: verticalScale(70),
            borderRadius: scale(12),
            borderWidth: 1,
            borderColor: colors.gray200 || colors?.error,
            backgroundColor: colors.white,
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: scale(16),
            paddingVertical: verticalScale(14),
            marginBottom: verticalScale(14),
        },
        roleCardSelected: {
            borderWidth: 2,
            borderColor: colors.error,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 6 },
            shadowOpacity: 0.08,
            shadowRadius: 12,
            elevation: 3,
        },
        roleIconBox: {
            width: scale(58),
            height: scale(58),
            borderRadius: scale(12),
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: colors.gray50 || '#F5F5F5',
        },
        roleIconBoxSelected: {
            backgroundColor: colors.primary,
        },
        roleTextBox: {
            flex: 1,
            marginLeft: scale(14),
            paddingRight: scale(10),
        },
        roleTitle: {
            fontSize: moderateScale(18),
            fontWeight: '700',
            color: colors.black,
            marginBottom: verticalScale(4),
        },
        roleDescription: {
            fontSize: moderateScale(13),
            color: colors.grey,
            lineHeight: moderateScale(19),
            fontWeight: '500',
        },
        radioOuter: {
            width: scale(30),
            height: scale(30),
            borderRadius: scale(15),
            borderWidth: 2,
            borderColor: colors.gray200 || '#D1D5DB',
            alignItems: 'center',
            justifyContent: 'center',
        },
        radioOuterSelected: {
            borderColor: colors.primary,
            backgroundColor: colors.primary,
        },
        footer: {
            paddingHorizontal: scale(24),
            paddingBottom: verticalScale(20),
            paddingTop: verticalScale(12),
            backgroundColor: colors.white,
        },
        continueButton: {
            height: scale(48),
            borderRadius: scale(8),
            backgroundColor: colors.error,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.18,
            shadowRadius: 18,
            elevation: 6,
        },
        continueText: {
            fontSize: moderateScale(16),
            fontWeight: '700',
            color: colors.white,
            marginRight: scale(10),
        },
        signInRow: {
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: scale(18),
        },
        signInText: {
            fontSize: moderateScale(14),
            color: colors.grey,
        },
        signInLink: {
            fontSize: moderateScale(14),
            color: colors.error,
            fontWeight: '600',
            marginLeft: scale(4),
        },
        scrollContainer: {
            flexGrow: 1,
            backgroundColor: colors.white,
        },
    });

export default getStyles;