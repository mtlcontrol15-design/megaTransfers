import { StyleSheet } from 'react-native';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';

const getStyles = (colors) => StyleSheet.create({
  midContainer: {
    flex: 1,
    backgroundColor: 'white',
    borderTopLeftRadius: moderateScale(20),
    borderTopRightRadius: moderateScale(20),
    marginTop: verticalScale(6),
  },
  seeAllButton: {
    // width: moderateScale(160),
    height: moderateScale(32),
    // alignItems: "center",
    // justifyContent: "center",
    paddingVertical: moderateScale(6),
    paddingHorizontal: moderateScale(12),
    // backgroundColor: colors.lightBlue,
    borderRadius: 8,
  },
  seeAllText: {
    color: colors.lightBlue,
    fontWeight: "600"
  }
});

export default getStyles;
