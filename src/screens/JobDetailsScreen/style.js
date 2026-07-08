import { Platform, StyleSheet } from "react-native";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";

const getStyles = (colors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors?.bg,
    // paddingVertical: verticalScale(40),
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: scale(15),
    backgroundColor: colors?.primary,
    paddingTop: verticalScale(40)
  },

  headerTitle: {
    fontSize: scale(18),
    fontWeight: "bold",
    color: colors?.white,
  },

  content: {
    padding: scale(15),
  },

  card: {
    backgroundColor: colors?.white,
    padding: scale(15),
    borderRadius: scale(10),
    marginVertical: verticalScale(12),
    borderWidth: 1,
    borderColor: colors?.gray200,
    shadowColor: "whit",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.00,
    shadowRadius: 2,

    elevation: 2,
  },
  card1: {
    backgroundColor: colors?.white,
    padding: scale(15),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: scale(10),
    marginVertical: verticalScale(12),
    borderWidth: 1,
    borderColor: colors?.gray200
  },
  card3: {
    backgroundColor: colors?.white,
    // padding: scale(15),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: scale(10),
    // marginVertical: verticalScale(12),
    // borderWidth: 1,
    // borderColor: colors?.gray200
  },

  sectionTitle: {
    fontSize: scale(14),
    fontWeight: "bold",
    marginBottom: verticalScale(8),
    color: colors?.black,
  },
  iconWrapper: {
    width: moderateScale(40),
    height: moderateScale(40),
    borderRadius: moderateScale(20),
    backgroundColor: colors?.gray600,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: scale(14),
    fontWeight: "bold",
    color: colors?.black,
  },

  value: {
    fontSize: scale(13),
    fontWeight: "400",
    // marginLeft: scale(10),
    color: colors?.black,
  },
  value1: {
    fontSize: scale(13),
    fontWeight: "400",
    // marginLeft: scale(10),
    color: colors?.gray200,
  },
  statusBox: {
    backgroundColor: colors?.gray100,
    paddingHorizontal: scale(5),
    paddingVertical: verticalScale(4),
    borderRadius: scale(6),
    height: verticalScale(45),
    width: Platform.OS === "ios" ? moderateScale(150) : moderateScale(170),
    alignItems: 'center',
    justifyContent: 'center',

  },
  phoneBtn: {
    marginTop: verticalScale(10),
    backgroundColor: colors?.bttonColor,
    paddingHorizontal: scale(10),
    paddingVertical: verticalScale(6),
    borderRadius: scale(8),
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  phoneText: {
    color: colors?.white,
    fontSize: scale(14),

  },
  copyText: {
    color: colors?.white,
    fontSize: scale(14),
  },
  copyBtn: {
    marginTop: verticalScale(10),
    backgroundColor: colors?.primary,
    paddingHorizontal: scale(10),
    paddingVertical: verticalScale(6),
    borderRadius: scale(8),
    // alignItems:'center',
    // justifyContent:'center',
  },

  status: {
    color: colors?.slateBlue,
    fontWeight: "600",
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: verticalScale(8),
    gap: moderateScale(12),
    flex:1,
  },

  phoneBox: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: verticalScale(10),
  },

  phoneOptions: {
    marginTop: verticalScale(10),
  },

  optionBtn: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: verticalScale(10),
  },

  optionText: {
    marginLeft: scale(10),
    fontSize: scale(14),
  },

  addressRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: verticalScale(8),
  },

  linkText: {
    marginLeft: scale(10),
    color: colors?.black,
    fontSize: scale(14),
  },

  fare: {
    fontSize: scale(20),
    fontWeight: "bold",
    color: "#16A34A",
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  noJobText: {
    fontSize: scale(18),
    fontWeight: "bold",
  },

  primaryBtn: {
    marginTop: verticalScale(20),
    backgroundColor: "#2F80ED",
    paddingHorizontal: scale(20),
    paddingVertical: verticalScale(10),
    borderRadius: scale(8),
  },

  btnText: {
    color: "#fff",
    fontSize: scale(14),
  },
  underBuutonrow: {
    width: "50%",
    flexDirection: "row",
    alignItems: "center",
  },
  flightRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    borderBottomWidth: 1,
    borderBottomColor: colors?.gray200,
    paddingBottom: verticalScale(12),
    marginBottom: verticalScale(12),
  },
  flightInnerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: verticalScale(4),
    backgroundColor: colors?.bttonColor,
    opacity: 0.7,
    padding: scale(10),
    borderRadius: scale(8),
  }
});

export default getStyles;