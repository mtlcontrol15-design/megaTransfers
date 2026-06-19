import { Platform, StyleSheet } from "react-native";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";
import { Theme } from '../../libs';
const getStyles = (colors) => StyleSheet.create({
    container: {
        flex: 1,
        // backgroundColor: Theme.colors.white,
        paddingTop: Platform.OS === 'ios' ? verticalScale(30) : verticalScale(20)
    },
    chatContainer: {
        flex: 1,
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    profileImage: {
        width: scale(40),
        height: scale(40),
        borderRadius: scale(20),
    },
    userInfo: {
        marginLeft: moderateScale(10),
        // fontWeight: '600'
    },
    // userName: {
    //     fontSize: moderateScale(12),
    //     fontWeight: '500',
    //     color: Theme.colors.text,
    //     textTransform: 'capitalize',
    // },
    userStatus: {
        fontSize: scale(10),
        color: Theme.colors.lightestBrown,
        fontWeight: '600'
    },
    currentTime: {
        textAlign: 'center',
        color: Theme.colors.grey,
        fontSize: scale(12),
        marginVertical: verticalScale(8),
    },
    chatArea: {
        flex: 1,
        paddingHorizontal: scale(16),
        paddingBottom: verticalScale(80),
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: scale(12),
        backgroundColor: Theme.colors.white,
        // borderTopWidth: 1,
        // borderTopColor: Theme.colors.lightGrey,
        paddingBottom: verticalScale(20)
    },
    iconButton: {
        padding: scale(8),
    },
    inputBox: {
        flex: 1,
        backgroundColor: Theme.colors.lightGrey,
        marginHorizontal: scale(8),
        paddingHorizontal: scale(0),
        paddingVertical: Platform.OS === 'ios' ? verticalScale(12) : moderateScale(12),
        textAlignVertical: 'center',
        borderRadius: moderateScale(4),
    },
    sendIcon: {
        height: scale(40),
        width: scale(40),
        objectFit: 'contain',
    },
    bottomVu: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Theme.colors.lightGrey,
        flex: 1,
        borderRadius: moderateScale(4),
        // height: moderateScale(50),
        paddingHorizontal: scale(10),
        marginRight: scale(10),
    },
    sendButton: {
        width: scale(39),
        height: scale(38),
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors?.primary,
        borderRadius: moderateScale(10)
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: colors.primary,
        paddingHorizontal: scale(16),
        paddingTop: verticalScale(40),
        paddingBottom: verticalScale(10),
    },

    headerCenter: {
        flexDirection: "row",
        alignItems: "center",
    },

    avatarPlaceholder: {
        width: scale(36),
        height: scale(36),
        borderRadius: scale(18),
        backgroundColor: colors.white,
        justifyContent: "center",
        alignItems: "center",
        marginRight: scale(8),
    },

    avatarText: {
        fontSize: moderateScale(14),
        fontWeight: "600",
        color: colors.primary,
    },

    profileImage: {
        width: scale(36),
        height: scale(36),
        borderRadius: scale(18),
        marginRight: scale(8),
    },

    userName: {
        fontSize: moderateScale(14),
        fontWeight: "600",
        color: colors.white,
    },
});

export default getStyles;
