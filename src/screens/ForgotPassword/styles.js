import { StyleSheet } from 'react-native';
import { moderateScale, verticalScale } from 'react-native-size-matters';
import { Theme } from '../../libs';

const getStyles = (colors) => StyleSheet.create({
    scrollContainer: {
        flexGrow: 1,
        backgroundColor: Theme.colors?.white,
    },

    container: {
        flex: 1,
        paddingHorizontal: moderateScale(20),
        paddingVertical: moderateScale(0),
    },

    backButton: {
        marginBottom: moderateScale(0),
        // alignSelf: 'flex-start',
    },

    iconContainer: {
        width: moderateScale(80),
        height: moderateScale(80),
        borderRadius: moderateScale(40),
        backgroundColor: Theme.colors?.blue,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: moderateScale(20),
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
    form: {
        flex: 1,
        marginTop: moderateScale(20),
    },
    inputGroup: {
        marginBottom: moderateScale(25),
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
        backgroundColor: Theme.colors?.lightGrey,
        borderRadius: moderateScale(10),
        paddingHorizontal: moderateScale(12),
        borderWidth: 1,
        borderColor: Theme.colors?.lightGrey,
    },

    inputError: {
        borderColor: Theme.colors?.red,
    },

    input: {
        flex: 1,
        paddingVertical: moderateScale(14),
        marginLeft: moderateScale(10),
        fontSize: moderateScale(14),
        color: Theme.colors?.black,
    },

    errorText: {
        color: Theme.colors?.red,
        fontSize: moderateScale(12),
        marginTop: moderateScale(6),
    },

    button: {
        backgroundColor: Theme.colors?.red,
        paddingVertical: moderateScale(15),
        borderRadius: moderateScale(10),
        alignItems: 'center',
        marginVertical: moderateScale(2),
    },

    buttonDisabled: {
        backgroundColor: colors?.red
    },

    buttonText: {
        color: Theme.colors?.white,
        fontSize: moderateScale(16),
        fontWeight: '600',
    },
    buttonContainer: {
        // marginTop: 'auto',
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
    centerWrapper: {
        flex: 1,
        justifyContent: 'center',
    },

    formCard: {
        // backgroundColor: Theme.colors.white,
        padding: moderateScale(20),
        borderRadius: moderateScale(16),
        height: moderateScale(400),
        // justifyContent: 'space-between',
        // shadowColor: '#000',
        // shadowOpacity: 0.08,
        // shadowRadius: 10,
        // shadowOffset: { width: 0, height: 4 },
        marginVertical:verticalScale(20),

        // elevation (Android)
        // elevation: 4,
    },
}); export default getStyles;
