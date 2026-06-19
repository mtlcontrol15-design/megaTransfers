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
    },
    title: {
        fontSize: moderateScale(18),
        fontWeight: '700',
        color: colors.white,
    },
    content: {
        paddingHorizontal: moderateScale(16),
        paddingVertical: verticalScale(16),
    },
    sectionTitle: {
        fontSize: moderateScale(14),
        fontWeight: '600',
        marginBottom: verticalScale(12),
    },
    datePickerRow: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        gap: moderateScale(8),
    },
    dateField: {
        flex: 1,
    },
    label: {
        fontSize: moderateScale(12),
        marginBottom: verticalScale(6),
        fontWeight: '500',
    },
    dateButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: moderateScale(10),
        paddingVertical: verticalScale(10),
        borderRadius: moderateScale(8),
        borderWidth: 1,
        backgroundColor: colors.lightGrey,
    },
    dateText: {
        fontSize: moderateScale(12),
        fontWeight: '500',
    },
    arrowContainer: {
        marginBottom: verticalScale(10),
    },
    presetsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: moderateScale(8),
    },
    presetButton: {
        flex: 0.5,
        paddingVertical: verticalScale(10),
        borderRadius: moderateScale(8),
        alignItems: 'center',
    },
    presetText: {
        fontSize: moderateScale(12),
        fontWeight: '500',
    },
    footer: {
        flexDirection: 'row',
        gap: moderateScale(12),
        paddingHorizontal: moderateScale(16),
        paddingVertical: verticalScale(12),
    },
    pickerModalOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.4)',
    },
    pickerModalContainer: {
        width: '90%',
        borderRadius: moderateScale(12),
        padding: moderateScale(12),
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
        elevation: 10,
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
