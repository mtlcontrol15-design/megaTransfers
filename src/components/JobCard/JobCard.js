import React from "react";
import { ActivityIndicator } from "react-native";
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
} from "react-native";
import { moderateScale, verticalScale } from "react-native-size-matters";
import Icons from "../../assets/icons";
import { Theme } from "../../libs";

const JobCard = ({ job, colors, onPress, onPressStatus, isUpdatingJob }) => {
    // console.log('=======job is here',job);
    // console.log('======isUpdating is here', isUpdatingJob);


    const formatJourneyDateTime = (journeyObj) => {
        if (!journeyObj?.date) return { date: "-", time: "-" };

        const baseDate = new Date(journeyObj.date);

        const hours = Number(journeyObj.hour ?? 0)
            .toString()
            .padStart(2, "0");

        const minutes = Number(journeyObj.minute ?? 0)
            .toString()
            .padStart(2, "0");

        const formattedDate = baseDate.toLocaleDateString("en-GB", {
            day: "numeric",
            month: "short",
            year: "numeric",
        });

        return {
            date: formattedDate,
            time: `${hours}:${minutes}`,
        };
    };

    const formatStatus = (status) => {
        const lowerStatus = status?.toLowerCase();

        if (
            lowerStatus === "no show request" ||
            lowerStatus === "late cancel request"
        ) {
            return "Pending";
        }

        return status
            ?.split(" ")
            .map(
                word =>
                    word.charAt(0).toUpperCase() +
                    word.slice(1)
            )
            .join(" ");
    };

    const journey =
        job?.returnJourney?.date
            ? job?.returnJourney
            : job?.primaryJourney ||
            job?.booking?.returnJourney ||
            job?.booking?.primaryJourney;
    const { date, time } = formatJourneyDateTime(journey);
    return (
        <TouchableOpacity activeOpacity={1} onPress={onPress}>
            <View
                style={[
                    styles.card,
                    {
                        backgroundColor: colors.white,
                        borderColor: colors.gray100,
                    },
                ]}
            >
                <View style={[styles.footer, { backgroundColor:colors?.gray100 }]}>
                    {/* Date */}
                    <View style={styles.footerItem}>
                        <Icons.Calendar size={14} color={colors.gray600} />
                        <Text style={[styles.footerText, { color: colors.text }]}>
                            {date}
                        </Text>
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.footerItem}>
                        <Icons.Clock size={14} color={colors.gray600} />
                        <Text style={[styles.footerText, { color: colors.text }]}>
                            {time}
                        </Text>
                    </View>

                    <View style={{ flex: 1 }} />

                    {job?.booking?.mode && (
                        <View style={styles.footerBadge}>
                            <Text style={styles.footerBadgeText}>
                                {job?.booking?.mode?.toUpperCase()}
                            </Text>
                        </View>
                    )}

                    {(job?.returnJourney?.date ||
                        job?.booking?.returnJourney?.date) && (
                            <View
                                style={[
                                    styles.footerBadge,
                                    { marginLeft: moderateScale(8) },
                                ]}
                            >
                                <Text style={styles.footerBadgeText}>
                                    RETURN
                                </Text>
                            </View>
                        )}
                </View>
                <View style={styles.header}>
                    <View>
                        <Text style={[styles.bookingId, { color: colors.gray400 }]}>
                            Booking ID: {job?.booking?.bookingId}
                        </Text>
                        {["new", "completed", "late cancel", "no show"].includes(
                            job?.booking?.status?.toLowerCase()
                        ) ? null : (
                            <Text
                                numberOfLines={1}
                                ellipsizeMode="tail"
                                style={[
                                    styles.customerName,
                                    { color: colors.black }
                                ]}
                            >
                                {job?.booking?.passenger?.name || "N/A"}
                            </Text>
                        )}
                    </View>
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            gap: moderateScale(6),
                        }}
                    >
                        <TouchableOpacity
                            disabled={[
                                "completed",
                                "cancelled",
                                "no show",
                                "late cancel",
                                "no show request",
                                "late cancel request",
                            ].includes(
                                (
                                    job?.jobStatus ||
                                    job?.booking?.status ||
                                    job?.status
                                )?.toLowerCase()
                            )}

                            onPress={onPressStatus}

                            style={[
                                styles.statusBadge,
                                {
                                    backgroundColor: colors.redBorder,
                                    paddingHorizontal: moderateScale(14),

                                    opacity: [
                                        "completed",
                                        "cancelled",
                                        "no show",
                                        "late cancel",
                                        "no show request",
                                        "late cancel request",
                                    ].includes(
                                        (
                                            job?.jobStatus ||
                                            job?.booking?.status ||
                                            job?.status
                                        )?.toLowerCase()
                                    )
                                        ? 0.5
                                        : 1,
                                },
                            ]}
                        >
                            {isUpdatingJob ? (
                                <ActivityIndicator color={colors.white} size="small" />
                            ) : (
                                <Text
                                    style={{
                                        color: colors.white,
                                        fontWeight: "600",
                                        fontSize: moderateScale(16),
                                    }}
                                >
                                    {formatStatus(
                                        job?.jobStatus ||
                                        job?.booking?.status
                                    )}
                                </Text>
                            )}
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.locationRow}>
                    <Icons.MapPin size={18} color="#10B981" />
                    <View style={styles.locationText}>
                        <Text style={[styles.label, { color: colors.gray400 }]}>
                            Pickup
                        </Text>
                        <Text style={[styles.value, { color: colors.text }]}>
                            {journey?.pickup || 'Pickup location'}
                        </Text>
                    </View>
                </View>
                <View style={styles.locationRow}>
                    <Icons.MapPin size={18} color="#EF4444" />
                    <View style={styles.locationText}>
                        <Text style={[styles.label, { color: colors.gray400 }]}>
                            Dropoff
                        </Text>
                        <Text style={[styles.value, { color: colors.text }]}>
                            {journey?.dropoff || 'Dropoff location'}
                        </Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
};

export default JobCard;

const styles = StyleSheet.create({
    card: {
        height: moderateScale(320),
        justifyContent: 'space-between',
        borderWidth: 1,
        borderRadius: moderateScale(14),
        marginBottom: verticalScale(14),
        marginHorizontal: moderateScale(16),
        overflow: "hidden",
        shadowColor: "whit",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.00,
        shadowRadius: 2,

        elevation: 2,

    },

    header: {
        padding: moderateScale(14),
        flexDirection: "row",
        justifyContent: "space-between",
    },

    bookingId: {
        fontSize: moderateScale(12),
    },

    customerName: {
        fontSize: moderateScale(16),
        fontWeight: "700",
        marginTop: 2,
        width: moderateScale(90),
        textAlign: 'center'
    },

    statusBadge: {
        paddingHorizontal: moderateScale(10),
        paddingVertical: moderateScale(6),
        borderRadius: moderateScale(10),
        height: moderateScale(45),
        width: moderateScale(170),
        alignItems: 'center',
        justifyContent: 'center'
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
        marginTop: 2,
    },

    footer: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: verticalScale(10),
        paddingHorizontal: moderateScale(16),
        // shadowColor: "#000",
        // shadowOffset: {
        //     width: 0,
        //     height: 2,
        // },
        // shadowOpacity: 0.25,
        // shadowRadius: 3.84,

        // elevation: 5,

    },

    footerItem: {
        flexDirection: "row",
        alignItems: "center",
    },

    footerText: {
        marginLeft: 6,
        fontSize: moderateScale(13),
        fontWeight: "500",
    },

    divider: {
        width: 1,
        height: 16,
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
});