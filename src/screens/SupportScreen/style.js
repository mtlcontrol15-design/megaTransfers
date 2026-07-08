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

  roleBadge: {
    paddingHorizontal: scale(10),
    paddingVertical: verticalScale(4),
    borderRadius: moderateScale(20),
  },

  roleText: {
    fontSize: moderateScale(10),
    fontWeight: "700",
  },

  welcomeContainer: {
    paddingHorizontal: scale(20),
    paddingTop: verticalScale(5),
  },

  welcomeTitle: {
    fontSize: moderateScale(18),
    fontWeight: "700",
    color: colors?.black,
  },

  welcomeDesc: {
    fontSize: moderateScale(13),
    marginTop: verticalScale(4),
    color: colors?.lightText,
  },

  companyCard: {
    marginHorizontal: scale(16),
    marginTop: verticalScale(5),
    backgroundColor: colors?.white,
    borderRadius: moderateScale(10),
    borderWidth: 1,
    borderColor: colors?.gray200,
    // padding: scale(14),
  },

  companyContent: {
    flexDirection: "row",
  },

  companyHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: verticalScale(6),
  },

  companyName: {
    fontSize: moderateScale(16),
    fontWeight: "700",
    marginLeft: scale(8),
    color: colors?.black,
    textAlign: 'center'
  },

  tradingName: {
    fontSize: moderateScale(12),
    color: colors?.black,
    marginBottom: verticalScale(10),
  },

  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: verticalScale(6),
  },

  infoText: {
    fontSize: moderateScale(12),
    marginLeft: scale(8),
    color: "#374151",
    flex: 1,
  },

  logoContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginLeft: scale(10),
  },

  logo: {
    width: scale(80),
    height: scale(80),
    borderRadius: moderateScale(10),
    objectFit: "contain",
    backgroundColor: colors.primary,
    marginVertical: verticalScale(10)
  },

  logoPlaceholder: {
    width: scale(70),
    height: scale(70),
    borderRadius: moderateScale(10),
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
  },

  logoLetter: {
    fontSize: moderateScale(22),
    fontWeight: "700",
    color: "#6B7280",
  },

  helpContainer: {
    paddingHorizontal: scale(16),
    marginTop: verticalScale(10),
  },

  helpTitle: {
    fontSize: moderateScale(16),
    fontWeight: "700",
    marginBottom: verticalScale(6),
    color: "#1F2937",
  },

  supportItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: scale(14),
    marginBottom: verticalScale(8),
    borderRadius: moderateScale(10),
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderLeftWidth: 4,
  },

  iconBox: {
    width: scale(40),
    height: scale(40),
    borderRadius: moderateScale(8),
    justifyContent: "center",
    alignItems: "center",
    marginRight: scale(12),
  },

  itemTitle: {
    fontSize: moderateScale(14),
    fontWeight: "600",
    color: "#1F2937",
  },

  itemDesc: {
    fontSize: moderateScale(12),
    color: "#6B7280",
  },
  companyInner: {
    width: "95%",
    backgroundColor: colors.gray70,
    borderRadius: moderateScale(10),
    padding: 8,
    gap: 14,
    margin: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.20,
    shadowRadius: 1.41,

    elevation: 2,
  }
});

export default getStyles;
