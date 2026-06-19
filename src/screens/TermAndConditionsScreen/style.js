import { StyleSheet } from 'react-native';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';

const getStyles = (colors) => StyleSheet.create({
  midContainer: {
    flex: 1,
    backgroundColor: '#fafafa',
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
});

export default getStyles;
