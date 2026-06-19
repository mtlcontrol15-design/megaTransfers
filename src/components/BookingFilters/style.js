import { StyleSheet } from "react-native";
import { moderateScale, verticalScale } from "react-native-size-matters";

const getStyles = (colors) =>
    StyleSheet.create({
        container: {
            backgroundColor: colors.bg,
            borderRadius: moderateScale(12),
            padding: moderateScale(12),
            marginBottom: verticalScale(0),
            marginTop: verticalScale(8),
            borderWidth: 1,
            borderColor: colors.gray200,
        },

        searchContainer: {
            marginBottom: verticalScale(12),
            flexDirection: "row",
            backgroundColor: colors.lightGrey,
            borderColor: colors.gray200,
            borderWidth: 1,
            borderRadius: moderateScale(8),
            paddingHorizontal: moderateScale(20),
            alignItems: 'center'
        },

        searchWrapper: {
            position: "relative",
        },

        searchInput: {
            width: "100%",
            paddingRight: moderateScale(12),
            paddingVertical: verticalScale(6),
            fontSize: moderateScale(14),
            fontWeight: "500",
            color: colors.text,
        },

        searchIcon: {
            position: "absolute",
            left: moderateScale(12),
            top: verticalScale(12),
            zIndex: 10,
        },

        clearIcon: {
            position: "absolute",
            right: moderateScale(12),
            top: verticalScale(12),
        },

        filterRow: {
            flexDirection: "row",
            gap: moderateScale(8),
            marginBottom: verticalScale(8),
        },

        filterButton: {
            flex: 1,
            flexDirection: "row",
            alignItems: "center",
            // justifyContent: "space-between",
            paddingHorizontal: moderateScale(10),
            paddingVertical: verticalScale(6),
            borderRadius: moderateScale(8),
            borderWidth: 1,
            borderColor: colors.border || colors.gray200,
            backgroundColor: colors.card || colors.white,
            gap: moderateScale(10)
        },
        filterButton1: {
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: moderateScale(10),
            paddingVertical: verticalScale(6),
            borderRadius: moderateScale(8),
            borderWidth: 1,
            borderColor: colors.border || colors.gray200,
            backgroundColor: colors.card || colors.white,
            // justifyContent: 'space-between',
            marginTop: moderateScale(8),
            gap: moderateScale(10)
        },

        filterLeft: {
            flexDirection: "row",
            alignItems: "center",
            flex: 1,
        },

        filterTextWrapper: {
            marginLeft: moderateScale(8),
            flex: 1,
        },

        filterLabel: {
            fontSize: moderateScale(11),
            color: colors.lightText,
        },

        filterValue: {
            fontSize: moderateScale(12),
            fontWeight: "600",
        },

        dateButton: {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingHorizontal: moderateScale(10),
            paddingVertical: verticalScale(10),
            borderRadius: moderateScale(8),
            borderWidth: 1,
            marginBottom: verticalScale(8),
        },

        clearFiltersBtn: {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            paddingVertical: verticalScale(10),
            borderRadius: moderateScale(8),
            backgroundColor: "#FEE2E2",
            borderWidth: 1,
            borderColor: "#FECACA",
        },

        clearFiltersText: {
            fontSize: moderateScale(13),
            fontWeight: "600",
            color: "#DC2626",
            marginLeft: moderateScale(6),
        },

        modalOverlay: {
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.5)",
            justifyContent: "flex-end",
        },

        modalContainer: {
            borderTopLeftRadius: moderateScale(20),
            borderTopRightRadius: moderateScale(20),
            padding: moderateScale(16),
        },

        modalHeader: {
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: verticalScale(16),
        },

        modalTitle: {
            fontSize: moderateScale(18),
            fontWeight: "700",
            color: colors.text,
        },

        optionItem: {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingVertical: verticalScale(12),
            paddingHorizontal: moderateScale(12),
            borderRadius: moderateScale(8),
            marginBottom: verticalScale(8),
            backgroundColor: colors.lightGrey,
        },

        optionText: {
            fontSize: moderateScale(14),
            fontWeight: "600",
            color: colors.text,
        },

        applyButton: {
            flex: 1,
            paddingVertical: verticalScale(12),
            borderRadius: moderateScale(8),
            backgroundColor: colors.primary,
        },

        clearButton: {
            flex: 1,
            paddingVertical: verticalScale(12),
            borderRadius: moderateScale(8),
            backgroundColor: colors.lightGrey,
        },

        centerText: {
            textAlign: "center",
            fontWeight: "600",
            fontSize: moderateScale(13),
        },
        buttonsRow: {
            flexDirection: "row",
            gap: moderateScale(8),
        },
        filterText: {
            fontSize: moderateScale(13),
            fontWeight: "600",
            color: colors.text,
            marginLeft: moderateScale(6),
        },
        clearBtn: {
            paddingVertical: verticalScale(6),
            borderRadius: moderateScale(8),
            backgroundColor: "#FEE2E2",
            borderWidth: 1,
            borderColor: "#FECACA",
            marginTop: verticalScale(8),
            alignItems: "center",
        },
        clearText: {
            fontSize: moderateScale(13),
            fontWeight: "600",
            color: "#DC2626",
        },
        activeFilterButton: {
            backgroundColor: colors.gray100,
            borderColor: colors.lightGreen,
            borderWidth: 0.5
        }
    });

export default getStyles;