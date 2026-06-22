import React, { useState } from "react";
import { View, Text, TouchableOpacity, Linking, Alert } from "react-native";
import { useTheme } from "@react-navigation/native";

import Icons from "../../assets/icons";
import getStyles from "./style";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";

const BookingJobCard = ({ job, onPress, onPressStatus }) => {
    const { colors } = useTheme();
    const styles = getStyles(colors);


    const openFlightDetails = (flightNo) => {
        const url = `https://www.google.com/search?q=${flightNo}+flight+status`;
        Linking.openURL(url);
    };

    // console.log('======job data is here to see', job);


    const [expanded, setExpanded] = useState(false);

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
            time: `${hours}:${minutes}`, // ✅ 24-hour format
        };
    };

    const journey = job?.primaryJourney;
    const { date, time } = formatJourneyDateTime(journey);

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";

        const date = new Date(dateString);

        return date.toLocaleDateString("en-GB", {
            day: "numeric",
            month: "short",
            year: "numeric",
        });
    };

    const primaryJourney = job?.primaryJourney;
    const returnJourney = job?.returnJourney;

    const flightData =
        primaryJourney?.flightNumber
            ? primaryJourney
            : returnJourney;

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

    const rawPhone = job?.booking?.passenger?.phone;

    const formattedPhone =
        rawPhone
            ? rawPhone.startsWith("+")
                ? rawPhone
                : `+${rawPhone}`
            : null;

    const isDisabledStatus = [
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
    );

    const hidePassengerDetailsStatuses = [
        "completed",
        "cancelled",
        "no show",
        "late cancel",
        "no show request",
        "late cancel request",
        "new",
    ];

    const shouldHidePassengerDetails =
        hidePassengerDetailsStatuses.includes(
            (
                job?.jobStatus ||
                job?.booking?.status ||
                job?.status
            )?.toLowerCase()
        );

    return (
        <TouchableOpacity activeOpacity={0.8} onPress={onPress} style={styles.card}>
            <View style={styles.cardHeader}>
                <View>
                    <Text style={styles.bookingId}>{job?.booking?.bookingId}</Text>
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "flex-end",
                            gap: moderateScale(6),
                            marginTop: moderateScale(5)
                        }}
                    >

                        {(job?.returnJourney?.date ||
                            job?.booking?.returnJourney?.date) && (
                                <View
                                    style={[
                                        styles.statusBadge,
                                        {
                                            backgroundColor: colors?.gray100,
                                            width: "auto",
                                            paddingHorizontal: moderateScale(14),
                                            borderRadius: moderateScale(6),
                                            height: moderateScale(30)
                                        },
                                    ]}
                                >
                                    <Text
                                        style={{
                                            color: colors.black,
                                            fontWeight: "700",
                                            fontSize: moderateScale(10),
                                            letterSpacing: 0.5,
                                        }}
                                    >
                                        RETURN
                                    </Text>
                                </View>
                            )}

                        <View
                            style={[
                                styles.statusBadge,
                                {
                                    backgroundColor: colors?.gray100,
                                    width: "auto",
                                    paddingHorizontal: moderateScale(14),
                                    borderRadius: moderateScale(6),
                                    height: moderateScale(30)
                                },
                            ]}
                        >
                            <Text
                                style={{
                                    color: colors.black,
                                    fontWeight: "700",
                                    fontSize: moderateScale(10),
                                    letterSpacing: 0.5,
                                }}
                            >
                                {job?.booking?.mode || "Transfer"}
                            </Text>
                        </View>
                    </View>
                </View>


                {/* <TouchableOpacity
                    onPress={() => {

                        const currentStatus = (
                            job?.jobStatus ||
                            job?.booking?.status ||
                            job?.status
                        )?.toLowerCase();

                        if (currentStatus === "completed") {

                            Alert.alert(
                                "Completed",
                                "This job is already completed."
                            );

                            return;
                        }

                        if (currentStatus === "cancelled") {

                            Alert.alert(
                                "Cancelled",
                                "This booking has been cancelled."
                            );

                            return;
                        }

                        if (currentStatus === "no show") {

                            Alert.alert(
                                "No Show",
                                "This booking is marked as No Show."
                            );

                            return;
                        }

                        if (currentStatus === "late cancel") {

                            Alert.alert(
                                "Late Cancel",
                                "This booking is marked as Late Cancel."
                            );

                            return;
                        }

                        if (currentStatus === "no show request") {

                            Alert.alert(
                                "Pending Request",
                                "No Show request is pending approval."
                            );

                            return;
                        }

                        if (currentStatus === "late cancel request") {

                            Alert.alert(
                                "Pending Request",
                                "Late Cancel request is pending approval."
                            );

                            return;
                        }

                        onPressStatus();
                    }}
                >
                    <Text
                        style={{
                            color: colors.black,
                            fontWeight: "600",
                            fontSize: moderateScale(16),
                        }}
                    >
                        {formatStatus(
                            job?.jobStatus ||
                            job?.booking?.status
                        )}
                    </Text>
                </TouchableOpacity> */}

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
                    <Text
                        style={{
                            color: isDisabledStatus
                                ? colors.primary
                                : colors.white,
                            fontWeight: "600",
                            fontSize: moderateScale(16),
                        }}
                    >
                        {formatStatus(
                            job?.jobStatus ||
                            job?.booking?.status ||
                            job?.status
                        )}
                    </Text>
                </TouchableOpacity>
            </View>

            <View style={styles.dateRow}>
                <View style={styles.dateItem}>
                    <Icons.Calendar size={16} color={colors.black} />
                    <View>
                        <Text style={styles.dateText}>BOOKING DATE</Text>
                        <Text style={styles.dateText}>{date}</Text>
                    </View>
                </View>

                <View style={styles.dateItem}>
                    <Icons.Clock size={16} color={colors.black} />
                    <View>
                        <Text style={styles.dateText}>BOOKING TIME</Text>
                        <Text style={styles.dateText}>{time}</Text>
                    </View>
                </View>
            </View>

            <View style={styles.locationBlock}>
                <View style={styles.locationHeader}>
                    <Icons.MapPin size={18} color="#10B981" />
                    <Text style={styles.locationTitle}>Pickup</Text>
                </View>

                <Text style={styles.locationText}>
                    {job?.primaryJourney?.pickup || "N/A"}
                </Text>
            </View>

            {flightData?.flightNumber && (
                <View style={styles.flightRow}>

                    <Text style={styles.flightLabel}>Flight No:</Text>

                    <TouchableOpacity
                        style={styles.flightButton}
                        onPress={() => openFlightDetails(flightData?.flightNumber)}
                        activeOpacity={0.7}
                    >
                        <Text style={styles.flightNumber}>
                            {flightData?.flightNumber}
                        </Text>

                        <Icons.Search size={16} color={colors?.gray600} />
                    </TouchableOpacity>

                    <Text style={styles.flightRoute}>
                        {flightData?.flightOrigin}
                    </Text>

                </View>
            )}
            <View style={styles.locationBlock}>
                <View style={styles.locationHeader}>
                    <Icons.MapPin size={18} color="#EF4444" />
                    <Text style={styles.locationTitle}>Dropoff</Text>
                </View>

                <Text style={styles.locationText}>
                    {job?.primaryJourney?.dropoff || "N/A"}
                </Text>
            </View>

            {expanded && (
                <View style={styles.expandedContainer}>
                    <View style={styles.gridContainer}>

                        <View style={styles.gridItem}>
                            <Icons.Navigation size={16} color={colors.lightText} />
                            <View style={styles.gridText}>
                                <Text style={styles.gridLabel}>Distance</Text>
                                <Text style={styles.gridValue}>
                                    {job?.primaryJourney?.distanceText
                                        ? job.primaryJourney.distanceText
                                            .toLowerCase()
                                            .includes("km")
                                            ? `${(
                                                parseFloat(
                                                    job.primaryJourney.distanceText
                                                ) * 0.621371
                                            ).toFixed(1)} miles`
                                            : job.primaryJourney.distanceText.replace(
                                                "mi",
                                                "miles"
                                            )
                                        : "—"}
                                </Text>
                            </View>
                        </View>

                        <View style={styles.gridItem}>
                            <Icons.Clock size={16} color={colors.lightText} />
                            <View style={styles.gridText}>
                                <Text style={styles.gridLabel}>Duration</Text>
                                <Text style={styles.gridValue}>
                                    Approx. {job?.primaryJourney?.durationText || "—"}
                                </Text>
                            </View>
                        </View>

                        <View style={styles.gridItem}>
                            <Icons.CreditCard size={moderateScale(18)} color={colors?.lightText} />

                            <View style={{ marginLeft: scale(10) }}>
                                <Text style={[styles.gridLabel, { fontSize: moderateScale(10) }]}>PAYMENT</Text>
                                <Text style={styles.gridValue}>{job?.booking?.paymentMethod}</Text>
                            </View>
                        </View>

                        {job?.booking?.paymentMethod?.toLowerCase() === "cash" && (
                            <View style={styles.gridItem}>
                                <Icons.BadgeEuroIcon
                                    size={moderateScale(18)}
                                    color={colors?.lightText}
                                />

                                <View style={{ marginLeft: scale(10) }}>
                                    <Text
                                        style={[
                                            styles.gridLabel,
                                            { fontSize: moderateScale(10) }
                                        ]}
                                    >
                                        CASH TO COLLECT
                                    </Text>

                                    <Text
                                        style={[
                                            styles.value,
                                            { color: colors?.lightGreen }
                                        ]}
                                    >
                                        £ {
                                            job?.booking?.journeyFare != null
                                                ? Number(job?.booking?.journeyFare).toFixed(2)
                                                : "—"
                                        }
                                    </Text>
                                </View>
                            </View>
                        )}

                        <View style={styles.gridItem}>
                            <Icons.BadgeEuroIcon size={16} color={colors.lightText} />
                            <View style={styles.gridText}>
                                <Text style={styles.gridLabel}>Driver Fare</Text>
                                <Text style={styles.fareValue}>
                                    {job?.booking?.driverFare != null
                                        ? Number(job.booking.driverFare).toFixed(2)
                                        : "—"}
                                </Text>
                            </View>
                        </View>
                    </View>

                    <View style={styles.separator} />
                    {!shouldHidePassengerDetails && (
                        <View style={styles.section}>
                            <View style={styles.sectionHeader}>
                                <Icons.User size={18} color="#DC2626" />
                                <Text style={styles.sectionTitle}>Passenger Details</Text>
                            </View>

                            <View style={styles.passengerCard}>
                                <Text style={styles.passengerName}>
                                    {job?.booking?.passenger?.name || "Not specified"}
                                </Text>

                                {(job?.passenger?.phone || job?.booking?.passenger?.phone) && (
                                    <View style={styles.passengerRow}>
                                        <Icons.Phone size={14} color={colors.lightText} />
                                        <Text style={styles.passengerText}>
                                            {job?.passenger?.phone || formattedPhone}
                                        </Text>
                                    </View>
                                )}

                                {(job?.passenger?.email || job?.booking?.passenger?.email) && (
                                    <View style={styles.passengerRow}>
                                        <Icons.Mail size={14} color={colors.lightText} />
                                        <Text style={styles.passengerText}>
                                            {job?.passenger?.email || job?.booking?.passenger?.email}
                                        </Text>
                                    </View>
                                )}
                            </View>
                        </View>
                    )}
                    <View style={styles.section}>
                        <View style={[styles.sectionHeader, { justifyContent: 'space-between' }]}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: moderateScale(6) }}>
                                <Icons.Car size={18} color="#3B82F6" />
                                <Text style={styles.sectionTitle}>Vehicle Name:</Text>
                            </View>
                            <Text style={styles.sectionTitle}>{job?.vehicle?.vehicleName || job?.booking?.vehicle?.vehicleName || "Not specified"}</Text>
                        </View>
                        <Text style={[styles.sectionTitle, { marginBottom: verticalScale(5), marginLeft: moderateScale(24) }]}>Requirements</Text>
                        <View style={styles.vehicleGrid}>

                            <View style={styles.vehicleItem}>
                                <Icons.User size={14} color={colors.lightText} />
                                <Text style={styles.vehicleText}>
                                    {job?.vehicle?.passengers || job?.booking?.vehicle?.passenger || 0} Passengers
                                </Text>
                            </View>

                            <View style={styles.vehicleItem}>
                                <Icons.Package size={14} color={colors.lightText} />
                                <Text style={styles.vehicleText}>
                                    {job?.vehicle?.checkinLuggage || job?.booking?.vehicle?.checkinLuggage || 0} Check-in
                                </Text>
                            </View>

                            <View style={styles.vehicleItem}>
                                <Icons.Luggage size={14} color={colors.lightText} />
                                <Text style={styles.vehicleText}>
                                    {job?.vehicle?.handLuggage || job?.booking?.vehicle?.handLuggage || 0} Hand Luggage
                                </Text>
                            </View>

                            <View style={styles.vehicleItem}>
                                <Icons.Baby size={14} color={colors.lightText} />
                                <Text style={styles.vehicleText}>
                                    {job?.vehicle?.childSeat || job?.booking?.vehicle?.childSeat || 0} Child Seats
                                </Text>
                            </View>
                            <View style={styles.vehicleItem}>
                                <Icons.Baby size={14} color={colors.lightText} />
                                <Text style={styles.vehicleText}>
                                    {job?.vehicle?.babySeat || job?.booking?.vehicle?.babySeat || 0} babySeat Seats
                                </Text>
                            </View>
                            <View style={styles.vehicleItem}>
                                <Icons.Baby size={14} color={colors.lightText} />
                                <Text style={styles.vehicleText}>
                                    {job?.vehicle?.boosterSeat || job?.booking?.vehicle?.boosterSeat || 0} Booster Seats
                                </Text>
                            </View>

                        </View>
                    </View>
                    <View style={styles.statusContainer}>

                        {job?.status?.toLowerCase() === "cancelled" && (
                            <View style={styles.cancelBox}>
                                <Text style={styles.cancelText}>
                                    This booking has been cancelled.
                                </Text>
                            </View>
                        )}

                        {job?.status?.toLowerCase() === "completed" && (
                            <View style={styles.completedBox}>
                                <Icons.CheckCircle size={20} color="#10B981" />
                                <Text style={styles.completedText}>
                                    This booking is already marked as Completed
                                </Text>
                            </View>
                        )}

                    </View>
                    <View style={styles.bookingDateContainer}>
                        <Text style={styles.bookingDateLabel}>Booking Date:</Text>
                        <Text style={styles.bookingDateValue}>{formatDate(job?.createdAt) || "N/A"}</Text>
                    </View>

                </View>

            )}

            <TouchableOpacity
                style={styles.showMoreBtn}
                onPress={() => setExpanded(!expanded)}
            >
                <Text style={styles.showMoreText}>
                    {expanded ? "Show Less Details" : "Show More Details"}
                </Text>

                {expanded ? (
                    <Icons.ChevronUp size={16} color={colors?.white} />
                ) : (
                    <Icons.ChevronDown size={16} color={colors?.white} />
                )}
            </TouchableOpacity>
        </TouchableOpacity>
    );
};

export default BookingJobCard;