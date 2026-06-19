import { StyleSheet } from 'react-native';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';

const getStyles = (colors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafafa',
  },
  mapview: {
    flex: 1
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
  iconWrepper: {
    position: 'absolute',
    bottom: moderateScale(100),
    right: moderateScale(15),
    height: moderateScale(50),
    width: moderateScale(50),
    borderRadius: moderateScale(50),
    backgroundColor: colors.lightBlue,
    alignItems: 'center',
    justifyContent: 'center',
  },
  markerOuter: {
    width: moderateScale(36),
    height: moderateScale(36),
    borderRadius: moderateScale(18),
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.white,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  markerInner: {
    width: moderateScale(30),
    height: moderateScale(30),
    borderRadius: moderateScale(15),
    backgroundColor: colors.parrot,
    alignItems: 'center',
    justifyContent: 'center',
  },
  offlineMarker: {
    position: 'absolute',
    bottom: moderateScale(100),
    alignSelf: 'center',
    backgroundColor: 'white',
    padding: moderateScale(10),
    borderRadius: moderateScale(10),
  }
});

export default getStyles;
