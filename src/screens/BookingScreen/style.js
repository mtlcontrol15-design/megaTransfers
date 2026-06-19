import { StyleSheet } from "react-native";
import { moderateScale, verticalScale } from "react-native-size-matters";

const getStyles = (colors) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colors?.primary,
            paddingTop: verticalScale(20),
        },

        headerContainer: {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingHorizontal: moderateScale(15),
            paddingVertical: verticalScale(20),
        },

        headerTitle: {
            fontSize: moderateScale(18),
            fontWeight: "700",
        },

        headerSubtitle: {
            fontSize: moderateScale(14),
            color: colors?.lightGrey,
            textAlign: "center",
        },

        headerTitleContainer: {
            flexDirection: "column",
            gap: verticalScale(4),
        },

        iconWrapper: {
            flexDirection: "row",
            gap: moderateScale(15),
        },
        contentContainer: {
            flex: 1,
            backgroundColor: colors?.white,
        },

        tabsContainer: {
            flexDirection: "row",
            borderBottomWidth: 1,
            borderBottomColor: colors.gray200,
            backgroundColor: colors.white,
        },

        tabButton: {
            flex: 1,
            paddingVertical: verticalScale(6),
            alignItems: "center",
            backgroundColor: colors.white,
        },

        activeTab: {
            backgroundColor: colors?.gray200,
        },

        tabText: {
            fontSize: moderateScale(14),
            fontWeight: "600",
            color: colors?.buttonBackground,
        },

        activeTabText: {
            color: colors?.black,
            fontSize: moderateScale(14),
            fontWeight: "600",
        },
        emptyContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            paddingTop: verticalScale(70),
        }
    });

export default getStyles;