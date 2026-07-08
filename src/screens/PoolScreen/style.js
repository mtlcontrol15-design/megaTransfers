import { StyleSheet } from "react-native";
import {
    moderateScale,
    scale,
    verticalScale,
} from "react-native-size-matters";
import { Theme } from "../../libs";

const getStyles = (colors) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fafafa",
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
        color: colors.white,
        fontSize: moderateScale(18),
        fontWeight: "700",
    },

    listContent: {
        paddingTop: verticalScale(14),
        paddingBottom: verticalScale(24),
    },

    emptyListContent: {
        flexGrow: 1,
    },

    loaderWrapper: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },

    emptyWrapper: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: scale(20),
    },

    emptyTitle: {
        fontSize: moderateScale(16),
        fontWeight: "700",
        color: "#111827",
        marginBottom: verticalScale(6),
    },

    emptyText: {
        fontSize: moderateScale(13),
        color: "#6B7280",
        textAlign: "center",
    },

    footerLoader: {
        paddingVertical: verticalScale(18),
        alignItems: "center",
        justifyContent: "center",
    },

    card: {
        minHeight: moderateScale(300),
        justifyContent: "space-between",
        borderWidth: 1,
        borderRadius: moderateScale(14),
        marginBottom: verticalScale(14),
        marginHorizontal: moderateScale(16),
        overflow: "hidden",
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.04,
        shadowRadius: 3,
    },

    cardTop: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: verticalScale(10),
        paddingHorizontal: moderateScale(16),
    },

    footerItem: {
        flexDirection: "row",
        alignItems: "center",
    },

    footerText: {
        marginLeft: scale(6),
        fontSize: moderateScale(13),
        fontWeight: "500",
    },

    divider: {
        width: 1,
        height: verticalScale(16),
        backgroundColor: "#D1D5DB",
        marginHorizontal: moderateScale(10),
    },

    footerBadge: {
        borderWidth: 1,
        borderColor: Theme?.colors?.gray300,
        borderRadius: moderateScale(8),
        paddingHorizontal: moderateScale(10),
        paddingVertical: verticalScale(6),
        alignItems: "center",
        justifyContent: "center",
    },

    footerBadgeText: {
        fontSize: moderateScale(10),
        fontWeight: "700",
        color: "#000",
        letterSpacing: 0.5,
    },

    returnBadge: {
        marginLeft: moderateScale(8),
    },

    cardHeader: {
        padding: moderateScale(14),
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },

    bookingId: {
        fontSize: moderateScale(12),
    },

    customerName: {
        fontSize: moderateScale(16),
        fontWeight: "700",
        marginTop: verticalScale(2),
        maxWidth: scale(130),
    },

    bidButton: {
        height: moderateScale(45),
        minWidth: moderateScale(150),
        paddingHorizontal: moderateScale(14),
        borderRadius: moderateScale(10),
        alignItems: "center",
        justifyContent: "center",
    },

    bidButtonText: {
        color: "#FFFFFF",
        fontWeight: "700",
        fontSize: moderateScale(13),
    },

    locationRow: {
        flexDirection: "row",
        paddingHorizontal: moderateScale(14),
        paddingVertical: verticalScale(8),
    },

    locationText: {
        marginLeft: moderateScale(10),
        flex: 1,
    },

    label: {
        fontSize: moderateScale(11),
    },

    value: {
        fontSize: moderateScale(14),
        fontWeight: "500",
        marginTop: verticalScale(2),
    },
    fareText: {
        fontSize: moderateScale(12),
        fontWeight: "700",
        marginTop: verticalScale(4),
    },

    bidInfoBox: {
        marginHorizontal: moderateScale(14),
        marginTop: verticalScale(4),
        marginBottom: verticalScale(10),
        paddingVertical: verticalScale(8),
        paddingHorizontal: moderateScale(12),
        borderRadius: moderateScale(8),
        backgroundColor: "#F3F4F6",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    editedText: {
        fontSize: moderateScale(12),
        fontWeight: "700",
        color: "#EF4444",
    },

    bidInfoText: {
        fontSize: moderateScale(12),
        fontWeight: "600",
        color: "#374151",
    },
    footerBadgeText: {
        fontSize: moderateScale(10),
        fontWeight: "700",
        color: "#000",
        letterSpacing: 0.3,
        maxWidth: scale(105),
    },
    bidButtonText: {
        color: colors?.white || "#FFFFFF",
        fontWeight: "700",
        fontSize: moderateScale(13),
        maxWidth: scale(120),
    },
    vehicleInfoCard: {
        marginHorizontal: moderateScale(14),
        marginTop: verticalScale(8),
        marginBottom: verticalScale(8),
        padding: moderateScale(12),
        borderRadius: moderateScale(12),
        backgroundColor: colors?.white,
        borderWidth: 1,
        borderColor: colors?.gray100 || "#E5E7EB",
    },

    vehicleSectionTitle: {
        fontSize: moderateScale(14),
        fontWeight: "700",
        color: colors?.black || "#111827",
        marginBottom: verticalScale(8),
    },

    vehicleNameRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: verticalScale(10),
    },

    vehicleNameText: {
        marginLeft: scale(10),
        fontSize: moderateScale(14),
        fontWeight: "600",
        color: colors?.text || "#111827",
        flex: 1,
    },

    vehicleStatsRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-around",
        backgroundColor: colors?.primary,
        paddingVertical: verticalScale(12),
        paddingHorizontal: moderateScale(6),
        borderRadius: scale(8),
        flexWrap: "wrap",
        rowGap: verticalScale(10),
    },

    vehicleStatItem: {
        minWidth: scale(54),
        alignItems: "center",
        justifyContent: "center",
    },

    vehicleStatLabel: {
        color: colors?.white,
        fontSize: moderateScale(9),
        fontWeight: "600",
        marginTop: verticalScale(3),
        textAlign: "center",
    },

    vehicleStatValue: {
        color: colors?.white,
        fontSize: moderateScale(13),
        fontWeight: "800",
        marginTop: verticalScale(2),
    },
});

export default getStyles;