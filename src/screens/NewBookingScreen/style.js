import { StyleSheet } from 'react-native';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';

const getStyles = (colors) =>
  StyleSheet.create({
    midContainer: {
      flex: 1,
      backgroundColor: "#fafafa",
      borderTopLeftRadius: moderateScale(20),
      borderTopRightRadius: moderateScale(20),
      marginTop: verticalScale(6),
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

    tabsContainer: {
      flexDirection: "row",
      alignSelf: "center",
      marginTop: verticalScale(20),
      borderRadius: moderateScale(10),
      overflow: "hidden",
      borderWidth: 1,
      borderColor: "#d1d5db",
    },

    tabButton: {
      paddingHorizontal: moderateScale(28),
      paddingVertical: verticalScale(10),
      backgroundColor: "#f3f4f6",
    },

    activeTab: {
      backgroundColor: colors?.primary,
    },

    tabText: {
      fontSize: moderateScale(14),
      fontWeight: "600",
      color: "#374151",
    },

    activeTabText: {
      color: "#fff",
      fontWeight: '500',
      fontSize: moderateScale(14),
    },
    buttonContainer: {
      padding: moderateScale(16)
    },
    button: {
      backgroundColor: colors?.bttonColor,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: moderateScale(8),
      paddingVertical: moderateScale(12)
    },
    paymentContainer: {
      paddingHorizontal: moderateScale(16),
      // paddingTop: moderateScale(10),
      // paddingBottom: moderateScale(10),
    },

    paymentTitle: {
      fontSize: moderateScale(16),
      fontWeight: "700",
      color: colors.black,
      // marginBottom: verticalScale(14),
    },

    paymentCard: {
      backgroundColor: colors.white,
      borderRadius: moderateScale(14),
      borderWidth: 1,
      borderColor: colors.gray200,
      overflow: "hidden",
    },

    paymentItem: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",

      paddingVertical: verticalScale(16),
      paddingHorizontal: moderateScale(16),

      borderBottomWidth: 1,
      borderBottomColor: colors.gray100,
    },

    paymentItemSelected: {
      backgroundColor: colors.primary + "10",
    },

    paymentItemLast: {
      borderBottomWidth: 0,
    },

    paymentText: {
      fontSize: moderateScale(15),
      fontWeight: "500",
      color: colors.black,
    },

    paymentTextSelected: {
      color: colors.primary,
      fontWeight: "700",
    },
    paymentHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginVertical: verticalScale(8),
    }
  });

export default getStyles;
