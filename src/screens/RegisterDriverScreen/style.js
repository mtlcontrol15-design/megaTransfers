import { StyleSheet } from "react-native";
import { moderateScale } from "react-native-size-matters";

const getStyles = (colors) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colors.bg,
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
        },

        headerTitle: {
            fontSize: moderateScale(18),
            fontWeight: "700",
            color: colors.white,
            left: moderateScale(20)
        },

        scrollContent: {
            padding: moderateScale(16),
            backgroundColor: colors?.gray200
        },
        contentContainer: {
            backgroundColor: colors?.gray100,
            padding: moderateScale(16),
            borderRadius: moderateScale(12)
        },
        profileCard: {
            alignItems: "center",
            borderBottomColor: colors?.gray200,
            borderBottomWidth: 1,
            marginBottom: moderateScale(0),
            padding: moderateScale(16)
        },

        avatarContainer: {
            marginBottom: moderateScale(12),
        },

        avatar: {
            width: moderateScale(90),
            height: moderateScale(90),
            borderRadius: moderateScale(45),
            backgroundColor: colors.primary,
            justifyContent: "center",
            alignItems: "center",
        },

        name: {
            fontSize: moderateScale(20),
            fontWeight: "700",
            color: colors.text,
        },

        roleBadge: {
            marginTop: moderateScale(6),
            backgroundColor: colors.primary + "20",
            paddingHorizontal: moderateScale(10),
            paddingVertical: moderateScale(4),
            borderRadius: moderateScale(20),
        },

        roleText: {
            color: colors.primary,
            fontSize: moderateScale(12),
            fontWeight: "600",
        },

        section: {
            borderBottomColor: colors?.gray200,
            borderBottomWidth: 1,
            marginBottom: moderateScale(0),
            padding: moderateScale(16)
        },

        sectionTitle: {
            fontSize: moderateScale(16),
            fontWeight: "700",
            marginBottom: moderateScale(12),
            color: colors.text,
        },

        fieldContainer: {
            marginBottom: moderateScale(10),
        },

        fieldLabel: {
            fontSize: moderateScale(12),
            color: colors.text + "80",
            marginBottom: moderateScale(2),
        },

        fieldValue: {
            fontSize: moderateScale(14),
            fontWeight: "500",
            color: colors.text,
        },

        row: {
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: 'center',
            gap: moderateScale(5)
        },

        fieldHalf: {
            width: "48%",
            marginBottom: moderateScale(10),
        },

        logoutBtn: {
            backgroundColor: colors?.error,
            borderWidth: 1,
            borderColor: colors?.error,
            borderRadius: moderateScale(12),
            paddingVertical: moderateScale(16),
            alignItems: "center",
            margin: moderateScale(10),
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: moderateScale(20)

        },

        logoutText: {
            color: colors?.white,
            fontSize: moderateScale(16),
            fontWeight: "700",
        },
        cardButtons: {
            padding: moderateScale(14),
            borderRadius: moderateScale(10),
            borderWidth: 1,
            borderColor: colors.gray200,
            marginBottom: moderateScale(10),
            flexDirection: 'row',
            justifyContent: 'space-between'
        },
        cancelBtn: {
            borderColor: colors?.primary,
            borderWidth: 1,
            padding: moderateScale(10),
            borderRadius: moderateScale(8),
            width: '48%',
            justifyContent: 'center',
            alignItems: 'center'
        },
        saveBtn: {
            backgroundColor: colors?.bttonColor,
            padding: moderateScale(10),
            borderRadius: moderateScale(8),
            width: '48%',
            justifyContent: 'center',
            alignItems: 'center'
        },
        uploadBtn: {
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: colors?.primary,
            paddingHorizontal: moderateScale(8),
            paddingVertical: moderateScale(6),
            borderRadius: moderateScale(6),
        },

        uploadText: {
            color: colors?.white,
            marginLeft: moderateScale(5),
            fontSize: moderateScale(12),
            fontWeight: "500",
        },
        iconWrepper: {
            width: moderateScale(30),
            height: moderateScale(30),
            borderRadius: moderateScale(15),
            backgroundColor: colors?.primary,
            bottom: moderateScale(30),
            left: moderateScale(30),
            alignItems: 'center',
            justifyContent: 'center',
            borderWidth: 1,
            borderColor: colors?.bttonColor
        },
        input: {
            flex: 1, // 🔥 THIS IS THE MAIN FIX
            color: colors?.black,
            padding: moderateScale(10),
        },
        adminText: {
            // backgroundColor:colors?.error,
            // opacity:0.5,
            // borderRadius:moderateScale(4),
            // padding:moderateScale(2),
            textAlign: 'center',
            marginVertical: moderateScale(10),
            color: colors?.error
        },
        inputWrapper: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: colors?.gray100,
            borderRadius: moderateScale(6),
            paddingRight: moderateScale(15)
        },
        indicator: {
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            borderRadius: moderateScale(40),
            backgroundColor: "rgba(0,0,0,0.35)",
            justifyContent: "center",
            alignItems: "center",
        },
        pdfIcon: {
            height: moderateScale(26),
            width: moderateScale(20),
            resizeMode: 'contain'
        }
    });

export default getStyles;