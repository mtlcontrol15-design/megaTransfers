import { StyleSheet } from "react-native";
import { moderateScale, verticalScale } from "react-native-size-matters";

const getSyles = (colors) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors?.white,
    },

    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: moderateScale(16),
        borderBottomWidth: 1,
        backgroundColor: colors?.primary,
        paddingTop: verticalScale(40),
        paddingBottom: moderateScale(10)
    },

    headerTitle: {
        fontSize: moderateScale(18),
        fontWeight: "700",
        color: colors?.white
    },

    scrollContainer: {
        paddingHorizontal: moderateScale(6),
        paddingBottom: moderateScale(80),

    },

    invoiceCard: {
        borderRadius: moderateScale(10),
        borderWidth: 1,
        width: "100%",
        alignSelf: "center",
        padding: moderateScale(26),

    },

    invoiceTop: {
        flexDirection: "row",
        justifyContent: "space-between",
    },

    invoiceTitle: {
        fontSize: moderateScale(24),
        fontWeight: "900",
    },

    statusText: {
        fontSize: moderateScale(16),
        fontWeight: "700",
    },

    companyName: {
        fontSize: moderateScale(16),
        fontWeight: "700",
        // marginBottom: moderateScale(6),
    },

    secondaryText: {
        fontSize: moderateScale(14),
        marginBottom: moderateScale(2),
        fontWeight: '600'
    },

    metaSection: {
        marginTop: moderateScale(20),
    },

    metaText: {
        fontSize: moderateScale(14),
        fontWeight: "600",
    },

    billSection: {
        marginTop: moderateScale(20),
    },

    sectionTitle: {
        fontSize: moderateScale(15),
        fontWeight: "700",
        marginBottom: moderateScale(6),
    },

    itemsSection: {
        marginTop: moderateScale(25),
    },

    itemRow: {
        paddingVertical: moderateScale(10),
        borderBottomWidth: 1,
    },

    bookingId: {
        fontSize: moderateScale(14),
        fontWeight: "600",
    },

    amount: {
        fontSize: moderateScale(14),
        fontWeight: "700",
        marginTop: moderateScale(4),
    },

    totalSection: {
        marginTop: moderateScale(20),
    },

    totalRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: moderateScale(8),
    },

    totalValue: {
        fontSize: moderateScale(14),
        fontWeight: "600",
    },

    grandTotalLabel: {
        fontSize: moderateScale(15),
        fontWeight: "700",
    },

    grandTotalValue: {
        fontSize: moderateScale(15),
        fontWeight: "700",
    },

    notesSection: {
        marginTop: moderateScale(25),
    },
    companyRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        width: "100%",
        marginTop: moderateScale(20),

    },

    companyInfo: {
        width: "52%",

    },

    invoiceMeta: {
        width: "42%",
        alignItems: "flex-end",

    },

    table: {
        borderWidth: 1,
        borderRadius: 6,
        overflow: 'hidden',
        marginBottom: 20
    },

    tableHeader: {
        flexDirection: 'row',
        paddingVertical: 10,
        paddingHorizontal: 8,
        backgroundColor: '#F3F4F6'
    },

    tableRow: {
        flexDirection: 'row',
        paddingVertical: 12,
        paddingHorizontal: 8,
        borderBottomWidth: 1
    },

    headerCell: {
        fontSize: 12,
        fontWeight: 'bold'
    },

    cell: {
        fontSize: 12
    },

    itemName: {
        fontSize: 13,
        fontWeight: 'bold'
    },

    itemDetails: {
        fontSize: 11
    },

    totalsContainer: {
        alignSelf: 'flex-end',
        width: '70%',
        marginBottom: 30
    },

    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 6,
        paddingHorizontal: 12
    },

    totalLabel: {
        fontSize: 13,
        fontWeight: '600'
    },

    totalValue: {
        fontSize: 13
    },

    grandTotalContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 10,
        paddingHorizontal: 12,
        marginTop: 5,
        borderRadius: 4
    },

    grandTotalLabel: {
        fontSize: 15,
        fontWeight: 'bold'
    },

    grandTotalValue: {
        fontSize: 15,
        fontWeight: 'bold'
    }
});
export default getSyles;