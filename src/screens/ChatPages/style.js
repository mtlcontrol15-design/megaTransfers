import { StyleSheet } from "react-native";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";

const getStyles = (colors) =>
    StyleSheet.create({
        chatItem: {
            flex: 1,
            flexDirection: "row",
            alignItems: "center",
            paddingVertical: verticalScale(12),
            paddingHorizontal: scale(16),
            borderBottomWidth: 1,
            borderBottomColor: colors?.border,
        },

        avatar: {
            width: moderateScale(46),
            height: moderateScale(46),
            borderRadius: moderateScale(23),
            // objectFit: 'contain'
        },

        avatarPlaceholder: {
            width: moderateScale(46),
            height: moderateScale(46),
            borderRadius: moderateScale(23),
            backgroundColor: colors.primary,
            justifyContent: "center",
            alignItems: "center",
        },

        avatarText: {
            color: colors?.whiteText,
            fontSize: moderateScale(18),
            fontWeight: "600",
        },

        chatInfo: {
            flex: 1,
            marginLeft: scale(12),
        },

        topRow: {
            flexDirection: "row",
            // justifyContent: "space-between",
            gap: moderateScale(30),
            alignItems: "center",
        },

        bottomRow: {
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: verticalScale(4),
        },

        name: {
            fontSize: moderateScale(14),
            fontWeight: "600",
            color: colors.text,
            width: moderateScale(100)
        },

        message: {
            fontSize: moderateScale(12),
            color: colors?.lightText,
            flex: 1,
            marginRight: scale(10),
        },

        time: {
            fontSize: moderateScale(10),
            color: colors?.lightText,
        },

        unreadBadge: {
            minWidth: moderateScale(20),
            height: moderateScale(20),
            borderRadius: moderateScale(10),
            backgroundColor: colors.error,
            justifyContent: "center",
            alignItems: "center",
            paddingHorizontal: scale(5),
            marginLeft: moderateScale(3)
        },

        unreadText: {
            color: colors?.whiteText,
            fontSize: moderateScale(10),
            fontWeight: "600",
        },

        midContainer: {
            flex: 1,
            backgroundColor: colors?.bg,
            borderTopLeftRadius: moderateScale(20),
            borderTopRightRadius: moderateScale(20),
            marginTop: verticalScale(6),
        },
        header: {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            backgroundColor: colors.primary,
            paddingHorizontal: scale(16),
            paddingTop: verticalScale(40),
            paddingBottom: verticalScale(10)
        },

        headerTitle: {
            fontSize: moderateScale(16),
            fontWeight: "600",
            color: colors.white,
        },
        searchContainer: {
            flexDirection: "row",
            alignItems: "center",
            marginHorizontal: scale(16),
            marginVertical: verticalScale(10),
            paddingHorizontal: scale(12),
            height: verticalScale(40),
            borderRadius: moderateScale(10),
            backgroundColor: colors?.gray100,
        },

        searchInput: {
            flex: 1,
            marginLeft: scale(8),
            fontSize: moderateScale(13),
            color: colors.text,
        },
        emptyContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            paddingTop: verticalScale(70),
        },
        tabContainer: {
            flex: 1,
            flexDirection: "row",
            backgroundColor: colors.lightGray,
            marginHorizontal: moderateScale(6),
            borderRadius: moderateScale(12),
            padding: moderateScale(4),
            gap: moderateScale(4),
        },

        tabButton: {
            flex: 1,
            alignItems: "center",
            borderRadius: moderateScale(6),
            paddingVertical: moderateScale(6),
            backgroundColor: colors?.secondary,
        },

        activeTab: {
            backgroundColor: colors.primary,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 3,
            elevation: 2,
        },

        tabText: {
            fontSize: moderateScale(14),
            color: colors.white,
            fontWeight: "500",
        },

        activeTabText: {
            color: colors.white,
            fontWeight: "600",
        },
    });

export default getStyles;