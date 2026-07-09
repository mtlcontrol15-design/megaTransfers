import { StyleSheet } from 'react-native';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';

const getStyles = (colors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    paddingBottom: verticalScale(28),
    justifyContent: 'space-between',
  },

  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: verticalScale(0),
    paddingHorizontal: moderateScale(24),
  },

  image: {
    width: scale(110),
    height: verticalScale(110),
    marginBottom: verticalScale(22),
  },

  title: {
    fontSize: moderateScale(24),
    fontWeight: '700',
    color: colors.black,
    textAlign: 'center',
    marginBottom: verticalScale(12),
  },

  message: {
    fontSize: moderateScale(15),
    lineHeight: moderateScale(22),
    color: '#4B5563',
    textAlign: 'center',
  },

  button: {
    backgroundColor: colors.primary,
    borderRadius: moderateScale(12),
    minHeight: verticalScale(52),
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: moderateScale(24),
  },

  buttonText: {
    color: colors.white,
    fontSize: moderateScale(16),
    fontWeight: '700',
  },
  header: {
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: scale(16),
    paddingTop: verticalScale(45),
    paddingBottom: verticalScale(10),
    borderBottomWidth: 1,
    borderBottomColor: colors?.gray200,
    backgroundColor: colors?.primary
  },

  headerTitle: {
    fontSize: moderateScale(18),
    fontWeight: "700",
    marginLeft: scale(14),
    color: colors.white,
  },
});

export default getStyles;
