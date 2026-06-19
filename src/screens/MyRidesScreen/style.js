import { StyleSheet } from 'react-native';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';

const getStyles = (colors) => StyleSheet.create({
  midContainer: {
    flex: 1,
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
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors?.primary
  },

  headerIcon: {
    padding: moderateScale(6),
    width: moderateScale(40),
    height: moderateScale(40),
    borderRadius: moderateScale(10),
    justifyContent: 'center',
    alignItems: 'center',

  },

  headerTitle: {
    fontSize: moderateScale(18),
    fontWeight: "700",
    color: colors.white,
  },
  subTitle: {
    fontSize: moderateScale(13),
    fontWeight: "400",
    color: colors.white,
  },
  tabContainer: {
    paddingHorizontal: moderateScale(14),
    paddingVertical: moderateScale(8),
    borderRadius: moderateScale(20),
    marginRight: 8
  },
  filterVu: {
    flexDirection: "row",
    justifyContent: "flex-end",
    // paddingHorizontal: moderateScale(16),
    // marginTop: verticalScale(10),
    gap: moderateScale(8),
  }
});

export default getStyles;
