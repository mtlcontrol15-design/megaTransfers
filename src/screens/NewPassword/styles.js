import { StyleSheet } from 'react-native';
import { moderateScale } from 'react-native-size-matters';
import { Theme } from '../../libs';

const getStyles = (colors) => StyleSheet.create({
    scrollContainer: {
        flexGrow: 1,
        backgroundColor: Theme.colors?.white,
    },

    container: {
        flex: 1,
        paddingHorizontal: moderateScale(20),
        paddingVertical: moderateScale(30),
    },

    backButton: {
        marginBottom: moderateScale(20),
        alignSelf: 'flex-start',
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

    iconContainer: {
        width: moderateScale(75),
        height: moderateScale(75),
        borderRadius: moderateScale(40),
        backgroundColor: Theme.colors?.blue,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: moderateScale(18),
    },

    title: {
        fontSize: moderateScale(22),
        fontWeight: '700',
        color: Theme.colors?.black,
        marginBottom: moderateScale(8),
    },

    subtitle: {
        fontSize: moderateScale(14),
        color: Theme.colors?.white,
        textAlign: 'center',
    },

    emailBadge: {
        marginTop: moderateScale(12),
        backgroundColor: Theme.colors?.lightGray,
        paddingHorizontal: moderateScale(14),
        paddingVertical: moderateScale(6),
        borderRadius: moderateScale(20),
    },

    emailText: {
        fontSize: moderateScale(12),
        color: Theme.colors?.darkGray,
    },

    form: {
        flex: 1,
        marginTop: moderateScale(10),
    },

    inputGroup: {
        marginBottom: moderateScale(20),
    },

    label: {
        fontSize: moderateScale(14),
        fontWeight: '600',
        color: Theme.colors?.primary,
        marginBottom: moderateScale(8),
    },

    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors?.gray70,
        borderRadius: moderateScale(10),
        paddingHorizontal: moderateScale(12),
        borderWidth: 1,
        borderColor: colors?.border,
    },

    otpInput: {
        backgroundColor: colors?.gray70,
        borderRadius: moderateScale(10),
        borderWidth: 1,
        borderColor: colors?.border,
        textAlign: 'center',
        fontSize: moderateScale(18),
        paddingVertical: moderateScale(14),
        letterSpacing: 6,
    },

    input: {
        flex: 1,
        paddingVertical: moderateScale(14),
        marginLeft: moderateScale(10),
        fontSize: moderateScale(14),
        color: Theme.colors?.black,
    },

    inputError: {
        borderColor: Theme.colors?.red,
    },

    errorText: {
        color: Theme.colors?.red,
        fontSize: moderateScale(12),
        marginTop: moderateScale(6),
    },

    buttonWrapper: {
        marginTop: 'auto',
    },

    button: {
        backgroundColor: colors?.bttonColor,
        paddingVertical: moderateScale(15),
        borderRadius: moderateScale(10),
        alignItems: 'center',
    },

    buttonDisabled: {
        backgroundColor: colors?.secondary
    },

    buttonText: {
        color: Theme.colors?.white,
        fontSize: moderateScale(16),
        fontWeight: '600',
    },
});

export default getStyles;