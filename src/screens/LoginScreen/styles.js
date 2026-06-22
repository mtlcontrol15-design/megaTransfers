import { StyleSheet } from 'react-native';
import { scale, moderateScale } from 'react-native-size-matters';
import { Theme } from '../../libs';

const getStyles = (colors) => StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: Theme.colors?.white,
  },

  container: {
    flex: 1,
    paddingHorizontal: scale(24),
    justifyContent: 'center',
  },

  header: {
    alignItems: 'center',
    marginBottom: scale(50),
  },

  logoContainer: {
    width: scale(80),
    height: scale(80),
    borderRadius: scale(40),
    backgroundColor: Theme.colors?.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: scale(24),
  },

  title: {
    fontSize: moderateScale(28),
    fontWeight: 'bold',
    color: Theme.colors?.primary,
    marginBottom: scale(8),
    textAlign: 'center',
  },

  subtitle: {
    fontSize: moderateScale(16),
    color: Theme.colors?.grey,
    textAlign: 'center',
  },

  inputGroup: {
    marginBottom: scale(20),
  },

  label: {
    fontSize: moderateScale(14),
    fontWeight: '600',
    color: Theme.colors?.primary,
    marginBottom: scale(8),
  },

  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Theme.colors?.lightGrey,
    borderRadius: scale(12),
    paddingHorizontal: scale(16),
    height: scale(56),
    borderWidth: 1,
    borderColor: Theme.colors?.lightGrey,
  },

  input: {
    flex: 1,
    marginLeft: scale(12),
    fontSize: moderateScale(16),
    color: Theme.colors?.black,
  },

  optionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: scale(32),
  },

  rememberMe: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  rememberText: {
    marginLeft: scale(8),
    fontSize: moderateScale(14),
    fontWeight: '500',
    color: Theme.colors?.black,
  },

  forgotText: {
    fontSize: moderateScale(14),
    fontWeight: '600',
    color: Theme.colors?.red,
  },

  loginButton: {
    height: scale(56),
    borderRadius: scale(12),
    backgroundColor: Theme.colors?.red,
    justifyContent: 'center',
    alignItems: 'center',
  },

  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  buttonText: {
    marginLeft: scale(8),
    fontSize: moderateScale(16),
    fontWeight: '600',
    color: Theme.colors?.white,
  },
  errorText: {
    color: Theme.colors?.red || 'red',
    fontSize: moderateScale(12),
    marginTop: moderateScale(6),
  },
  header1: {
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: moderateScale(16),
    paddingTop: moderateScale(50),
    paddingBottom: moderateScale(15),
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
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: scale(24),
  },
  signupText: {
    fontSize: moderateScale(14),
    fontWeight: '500',
    color: Theme.colors?.grey,
  },
  signupLink: {
    fontSize: moderateScale(14),
    fontWeight: '600',
    color: Theme.colors?.red,
    textDecorationLine: 'underline',
  },
});

export default getStyles;