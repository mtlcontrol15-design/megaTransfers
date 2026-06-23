import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Linking, Alert, Image, RefreshControl } from "react-native";

import { useSelector, useDispatch } from "react-redux";
import Clipboard from "@react-native-clipboard/clipboard";
import Geolocation from '@react-native-community/geolocation';
import { useRoute, useNavigation, useTheme } from "@react-navigation/native";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";

import getStyles from "./style";
import Icons from "../../assets/icons";
import toastUtils from "../../utils/Toast/toast";
import LoaderModal from "../../utils/loaderModal";
import { getSocket } from "../../services/socket";
import { EndPoints } from "../../services/EndPoints";
import queryHandler from "../../services/queries/queryHandler";
import ExtrasModal from "../../components/ExtrasModal/ExtrasModal";
import { dispatchOnlineStatus } from "../../redux/slices/userSlice";
import { requestLocationPermission } from "../../utils/permissionsHelper";
import { mutationHandler } from "../../services/mutations/mutationHandler";
import JobsStatusModal from "../../components/JobsStatusModal/JobsStatusModal";


const JobDetailsScreen = () => {
    const { colors } = useTheme();
    const styles = getStyles(colors);
    const route = useRoute();
    const navigation = useNavigation();

    const [showPhoneOptions, setShowPhoneOptions] = useState(false);
    const [showStatusModal, setShowStatusModal] = useState(false);
    const [statusFilter, setStatusFilter] = useState([]);
    const [selectedJob, setSelectedJob] = useState(null);
    const [showExtrasModal, setShowExtrasModal] = useState(false);
    const [showReceipt, setShowReceipt] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);



    const { user, isOnline } = useSelector(state => state?.userReducer)
    const { jobId } = route.params || {};

    // console.log('=======job Id is here',jobId);

    const isDriver = user?.role === "driver";



    const { data, isFetching, refetch } = queryHandler(
        `${EndPoints.getJobById}/${jobId}`
    );

    // console.log('======data from API is here', data);


    const dispatch = useDispatch();
    const { mutate: updateJobMutate } = mutationHandler(
        `${EndPoints.updateJob}/${selectedJob?._id}`,
        null,
        (res) => {
            console.log('Job updated:', res);
            setShowStatusModal(false);
            refetch();
        },
        (err) => {
            console.log('Job status error:', err);
        },
        "put"
    );

    const { mutate: updateBookingStatusMutate } = mutationHandler(
        `${EndPoints.updateBookingStatus}/${selectedJob?.bookingId}`,
        null,
        (res) => {
            console.log('Booking status updated:', res);
            setShowStatusModal(false);
            refetch();
        },
        (err) => {
            console.log('Booking status error:', err);
        },
        "patch"
    );

    const { mutate: sendLocationMutate, isPending: sendLocationIsPending } = mutationHandler(
        `${EndPoints.sendCurrentLocation}/${selectedJob?.booking?._id}`,
        null,
        (res) => {
            console.log('=======boooking location sent', res);

            refetch();

        },
        (err) => {
            console.log('Booking location sent:', err);
        },
        "patch"
    );

    const jobData = data?.job;
    const booking = jobData?.booking;
    const journey =
        booking?.returnJourney?.date
            ? booking?.returnJourney
            : booking?.primaryJourney;

    // console.log('====== data is here', data);
    // console.log('======booking data is here', booking);
    // console.log('======journey data is here', journey);

    useEffect(() => {
        let socket = getSocket();
        let intervalId = null;

        // Named listeners
        const handleJobUpdated = (data) => {
            refetch();
        };

        const handleBookingUpdated = (data) => {
            refetch();
        };

        const attachSocketListeners = (s) => {
            console.log("✅ SOCKET INSTANCE READY", s.id);

            // Remove previous listeners first
            s.off("job:updated", handleJobUpdated);
            s.off("booking:updated", handleBookingUpdated);

            // Add listeners
            s.on("job:updated", handleJobUpdated);
            s.on("booking:updated", handleBookingUpdated);
        };

        if (socket) {
            attachSocketListeners(socket);
        } else {
            intervalId = setInterval(() => {
                socket = getSocket();

                if (socket) {
                    clearInterval(intervalId);
                    attachSocketListeners(socket);
                }
            }, 500);
        }

        return () => {
            if (intervalId) {
                clearInterval(intervalId);
            }

            if (socket) {
                // Remove ONLY this screen listeners
                socket.off("job:updated", handleJobUpdated);
                socket.off("booking:updated", handleBookingUpdated);
            }
        };
    }, [user]);


    if (!jobData && isFetching) {
        return <Text>Loading...</Text>;
    }

    if (!jobData) {
        return <Text>No Job Found</Text>;
    }

    const openMaps = async (address, coordinates) => {
        if (!coordinates?.latitude || !coordinates?.longitude) return;

        const { latitude, longitude } = coordinates;

        const apps = [];

        // Google Maps
        const googleMapsUrl =
            Platform.OS === "ios"
                ? `comgooglemaps://?daddr=${latitude},${longitude}&directionsmode=driving`
                : `google.navigation:q=${latitude},${longitude}`;

        const googleMapsWeb = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;

        const canOpenGoogle = await Linking.canOpenURL(googleMapsUrl);

        if (canOpenGoogle) {
            apps.push({
                name: "Google Maps",
                url: googleMapsUrl,
            });
        }

        // Apple Maps (iOS only)
        if (Platform.OS === "ios") {
            const appleMapsUrl = `http://maps.apple.com/?daddr=${latitude},${longitude}`;

            const canOpenApple = await Linking.canOpenURL(appleMapsUrl);

            if (canOpenApple) {
                apps.push({
                    name: "Apple Maps",
                    url: appleMapsUrl,
                });
            }
        }

        // Waze
        const wazeUrl = `waze://?ll=${latitude},${longitude}&navigate=yes`;

        const canOpenWaze = await Linking.canOpenURL(wazeUrl);

        if (canOpenWaze) {
            apps.push({
                name: "Waze",
                url: wazeUrl,
            });
        }

        // Fallback browser option
        apps.push({
            name: "Browser",
            url: googleMapsWeb,
        });

        Alert.alert(
            "Open Location",
            "Choose app to open location",
            [
                ...apps.map((app) => ({
                    text: app.name,
                    onPress: () => Linking.openURL(app.url),
                })),
                {
                    text: "Cancel",
                    style: "cancel",
                },
            ]
        );
    };

    const callCustomer = (phone) => {
        if (!phone) return;
        Linking.openURL(`tel:${phone}`);
    };

    const copyText = (text) => {
        if (!text) return;
        Clipboard.setString(text);
        Alert.alert("Copied", `${text} copied to clipboard`);
    };

    const copyCoordinates = (coordinates) => {
        if (!coordinates?.latitude || !coordinates?.longitude) return;

        const text = `${coordinates.latitude},${coordinates.longitude}`;

        Clipboard.setString(text);
        Alert.alert("Copied", text);
    };

    const copyFullLocation = (address, coordinates) => {
        if (!address && !coordinates) return;

        const coordText = coordinates
            ? `${coordinates.latitude},${coordinates.longitude}`
            : "";

        const text = `${address}\n${coordText}`;

        Clipboard.setString(text);
        Alert.alert("Copied", text);
    };

    const hasValue = (value) => {
        return value !== null && value !== undefined && String(value).trim() !== "";
    };

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

    const formatFlightDateTime = (dateString) => {
        if (!dateString) return "—";

        const dateObj = new Date(dateString);

        const formattedDate = dateObj.toLocaleDateString("en-GB", {
            day: "numeric",
            month: "short",
            year: "numeric",
        });

        const formattedTime = dateObj.toLocaleTimeString("en-GB", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
        });

        return `${formattedDate} • ${formattedTime}`;
    };

    const { date, time } = formatJourneyDateTime(journey);

    const dropoffStops = [
        {
            label: "Dropoff Location",
            address: journey?.dropoff,
            doorNumber: journey?.dropoffDoorNumber0,
            terminal: journey?.dropoff_terminal_0,
            coordinates: journey?.dropoffCoordinates,

        },
        {
            label: "Additional Dropoff 1",
            address: journey?.additionalDropoff1,
            doorNumber: journey?.dropoffDoorNumber1,
            terminal: journey?.dropoff_terminal_1,
            copyValue: journey?.additionalDropoff1,
            coordinates: journey?.additionalDropoff1Coordinates,

        },
        {
            label: "Additional Dropoff 2",
            address: journey?.additionalDropoff2,
            doorNumber: journey?.dropoffDoorNumber2,
            terminal: journey?.dropoff_terminal_2,
            copyValue: journey?.additionalDropoff2,
            coordinates: journey?.additionalDropoff2Coordinates,
        },
        {
            label: "Additional Dropoff 3",
            address: journey?.additionalDropoff3,
            doorNumber: journey?.dropoffDoorNumber3,
            terminal: journey?.dropoff_terminal_3,
            copyValue: journey?.additionalDropoff3,
            coordinates: journey?.additionalDropoff3Coordinates,

        },
        {
            label: "Additional Dropoff 4",
            address: journey?.additionalDropoff4,
            doorNumber: journey?.dropoffDoorNumber4,
            terminal: journey?.dropoff_terminal_4,
            copyValue: journey?.additionalDropoff4,
            coordinates: journey?.additionalDropoff4Coordinates,
        },
    ].filter((item) => hasValue(item.address));

    const shouldShowFlightSection = Boolean(
        hasValue(journey?.flightNumber) ||
        hasValue(journey?.flightArrival?.scheduled) ||
        hasValue(journey?.flightArrival?.estimated) ||
        hasValue(journey?.flightOrigin) ||
        hasValue(journey?.flightDestination) ||
        hasValue(journey?.arrivefrom) ||
        hasValue(journey?.pickmeAfter)
    );

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
    const onRefresh = async () => {
        setRefreshing(true);
        await refetch();
        setRefreshing(false)
    }


    const updateJobStatus = async (statusId, extraData = {}) => {
        if (isUpdatingStatus) return;

        setIsUpdatingStatus(true);
        try {
            let formattedStatus = formatStatus(statusId);

            if (statusId === "no show") {
                formattedStatus = "No Show Request";
            }

            if (statusId === "late cancel") {
                formattedStatus = "Late Cancel Request";
            }

            if (!selectedJob?._id) return;

            const currentStatus =
                selectedJob?.booking?.status?.toLowerCase();

            const handleStatusUpdate = (locationData = {}) => {
                const payload = {
                    status: formattedStatus,
                    ...extraData,
                    ...locationData,
                };

                // console.log("======status payload is here", payload);

                if (currentStatus === "new") {
                    updateJobMutate({
                        jobStatus: formattedStatus,
                        ...extraData,
                        ...locationData,
                    });
                } else {
                    updateBookingStatusMutate(payload);
                }
                // Removed mutateSaveLocation API call as requested
            };

            try {
                Geolocation.getCurrentPosition(
                    (position) => {
                        const { latitude, longitude } = position.coords;

                        const locationPayload = {
                            latitude,
                            longitude,
                        };

                        handleStatusUpdate(locationPayload);
                    },
                    (error) => {
                        console.log("Location error:", error);
                        handleStatusUpdate();
                    },
                    {
                        // enableHighAccuracy: true,
                        timeout: 10000,
                    }
                );
            } catch (e) {
                console.log("Location fetch failed:", e);
                handleStatusUpdate();
            }
        } catch (error) {
            console.log("Update job status error:", error);
            toastUtils.showError("Error", "Failed to update job status");
        } finally {
            setIsUpdatingStatus(false);
        }
    };

    const handleOpenStatusModal = async () => {
        if (!isOnline) {
            const hasPermission = await requestLocationPermission();

            if (!hasPermission) {
                toastUtils.showError(
                    "Location Permission Required",
                    "Please allow location permission to go online"
                );
                return;
            }

            dispatch(dispatchOnlineStatus(true));
            toastUtils.showSuccess("You are now ONLINE");
        }

        setSelectedJob(jobData);
        setShowStatusModal(true);
    };
    const currentStatus = booking?.status?.toLowerCase();
    const showCustomerInfo =
        !["new", "completed", "late cancel", "not show"].includes(
            currentStatus?.toLowerCase()
        );

    const textCustomer = async () => {
        if (!formattedPhone) {
            toastUtils.showError(
                "Message Unavailable",
                "Customer phone number is missing"
            );
            return;
        }

        const phoneNumber = formattedPhone.replace(/\s+/g, "");

        try {
            await Linking.openURL(`sms:${phoneNumber}`);
        } catch (error) {
            toastUtils.showError(
                "Message Failed",
                "Could not open the messaging app"
            );
        }
    };

    const rawPhone = booking?.passenger?.phone;

    const isDisabledStatus = [
        "completed",
        "cancelled",
        "no show",
        "late cancel",
        "no show request",
        "late cancel request",
    ].includes(
        (
            jobData?.jobStatus ||
            jobData?.booking?.status ||
            jobData?.status
        )?.toLowerCase()
    );

    const formattedPhone =
        rawPhone
            ? rawPhone.startsWith("+")
                ? rawPhone
                : `+${rawPhone}`
            : null;
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    hitSlop={{ top: 30, bottom: 30, left: 30, right: 30 }}
                >
                    <Icons.ChevronLeft color={"#FFFFFF"} />
                </TouchableOpacity>

                <Text style={styles.headerTitle}>Job Details</Text>

                <TouchableOpacity activeOpacity={0.7} onPress={onRefresh}>
                    <Icons.RefreshCcw size={24} color={colors.white} />
                </TouchableOpacity>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                }
            >

                <View style={{ paddingHorizontal: scale(16) }}>
                    <View
                        style={[
                            styles.card1,
                            {
                                flexDirection: "column",
                                paddingBottom: verticalScale(0),
                                paddingTop: verticalScale(12),
                            },
                        ]}
                    >
                        <View style={[styles?.card3, { width: "100%" }]}>
                            <View>
                                <Text style={styles.label}>Booking ID : <Text style={styles?.value}>{booking?.bookingId || "—"}</Text></Text>
                                {/* <Text style={styles.value}></Text> */}
                                <View
                                    style={{
                                        flexDirection: "row",
                                        alignItems: "center",
                                        justifyContent: "flex-end",
                                        gap: moderateScale(6),
                                        marginTop: moderateScale(5)
                                    }}
                                >

                                    {(booking?.returnJourney?.date ||
                                        jobData?.returnJourney?.date) && (
                                            <View
                                                style={[
                                                    styles?.statusBox,
                                                    {
                                                        backgroundColor: colors?.gray100,
                                                        width: 'auto',
                                                        height: moderateScale(30),
                                                        borderRadius: moderateScale(6)
                                                    },
                                                ]}
                                            >
                                                <Text
                                                    style={styles?.status}
                                                >
                                                    RETURN
                                                </Text>
                                            </View>
                                        )}

                                    <View
                                        style={[
                                            styles.statusBox,
                                            {
                                                backgroundColor: colors?.gray100,
                                                width: 'auto',
                                                height: moderateScale(30),
                                                borderRadius: moderateScale(6)
                                            },
                                        ]}
                                    >
                                        <Text
                                            style={styles?.status}
                                        >
                                            {booking?.mode || "Transfer"}
                                        </Text>
                                    </View>
                                </View>
                            </View>

                            {/* <TouchableOpacity
                                onPress={() => {
                                    if (
                                        jobData?.status === "Completed" ||
                                        jobData?.booking?.status === "Completed"
                                    ) {
                                        Alert.alert(
                                            "Completed",
                                            "This job is already completed."
                                        );
                                        return;
                                    }

                                    setSelectedJob(jobData);
                                    setShowStatusModal(true);
                                }}
                                style={[
                                    styles.statusBox,
                                    {
                                        backgroundColor: colors.gray200,
                                    },
                                ]}
                            >
                                <Text
                                    style={[
                                        styles.status,
                                        {
                                            color: colors.black,
                                            fontWeight: "600",
                                            fontSize: moderateScale(16),
                                        },
                                    ]}
                                >
                                    {formatStatus(
                                        jobData?.jobStatus ||
                                        booking?.status
                                    ) || "—"}
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
                                        jobData?.jobStatus ||
                                        jobData?.booking?.status ||
                                        jobData?.status
                                    )?.toLowerCase()
                                )}

                                onPress={handleOpenStatusModal}

                                style={[
                                    styles.statusBox,
                                    {
                                        backgroundColor: colors.redBorder,

                                        opacity: [
                                            "completed",
                                            "cancelled",
                                            "no show",
                                            "late cancel",
                                            "no show request",
                                            "late cancel request",
                                        ].includes(
                                            (
                                                jobData?.jobStatus ||
                                                jobData?.booking?.status ||
                                                jobData?.status
                                            )?.toLowerCase()
                                        )
                                            ? 0.5
                                            : 1,
                                    },
                                ]}
                            >
                                <Text
                                    style={[
                                        styles.status,
                                        {
                                            color: isDisabledStatus
                                                ? colors.primary
                                                : colors.white,
                                            fontWeight: "600",
                                            fontSize: moderateScale(16),
                                        },
                                    ]}
                                >
                                    {formatStatus(
                                        jobData?.jobStatus ||
                                        booking?.status
                                    ) || "—"}
                                </Text>
                            </TouchableOpacity>
                        </View>

                        <View
                            style={[
                                styles.card,
                                {
                                    flexDirection: "row",
                                    alignItems: "center",
                                    justifyContent: "space-around",
                                    width: "100%",
                                },
                            ]}
                        >
                            <View
                                style={[
                                    styles.row,
                                    {
                                        marginTop: 0,
                                        gap: moderateScale(10),
                                        paddingBottom: verticalScale(0),
                                    },
                                ]}
                            >
                                <Icons.Calendar size={moderateScale(20)} color={colors?.gray600} />
                                <View>
                                    <Text style={[styles.label, { fontSize: moderateScale(12) }]}>BOOKING DATE</Text>
                                    <Text style={styles.value}>{date}</Text>
                                </View>
                            </View>

                            <View style={[styles.row, { marginTop: 0 }]}>
                                <Icons.Clock size={moderateScale(20)} color={colors?.gray600} />
                                <View>
                                    <Text style={[styles.label, { fontSize: moderateScale(12) }]}>BOOKING TIME</Text>
                                    <Text style={styles.value}>{time}</Text>
                                </View>
                            </View>
                        </View>
                    </View>

                    {showCustomerInfo && (<View style={styles.card}>
                        <Text style={styles.sectionTitle}>Customer Information</Text>

                        <View style={styles.row}>
                            <View style={styles.iconWrapper}>
                                <Icons.User size={moderateScale(24)} color={colors?.gray200} />
                            </View>

                            <Text style={styles.value}>{booking?.passenger?.name || "—"}</Text>
                        </View>

                        <TouchableOpacity
                            style={styles.phoneBtn}
                            onPress={() => setShowPhoneOptions(!showPhoneOptions)}
                        >
                            <View style={[styles.row, { marginTop: 0, gap: moderateScale(10) }]}>
                                <Icons.Phone size={moderateScale(20)} color={colors?.gray200} />
                                <Text style={styles.phoneText}>{formattedPhone || "—"}</Text>
                            </View>

                            {showPhoneOptions ? (
                                <Icons.ChevronUp size={moderateScale(20)} color={colors?.gray200} />
                            ) : (
                                <Icons.ChevronDown size={moderateScale(20)} color={colors?.gray200} />
                            )}
                        </TouchableOpacity>

                        {showPhoneOptions && (
                            <View style={styles?.copyBtn}>
                                <TouchableOpacity onPress={() => copyText(formattedPhone)}>
                                    <View
                                        style={[
                                            styles.row,
                                            {
                                                marginTop: 0,
                                                gap: moderateScale(10),
                                                borderBottomWidth: 1,
                                                borderBottomColor: colors?.white,
                                                paddingVertical: verticalScale(10),
                                            },
                                        ]}
                                    >
                                        <Icons.Copy size={moderateScale(20)} color={colors?.gray200} />
                                        <Text style={styles.copyText}>Copy Number</Text>
                                    </View>
                                </TouchableOpacity>

                                <TouchableOpacity onPress={() => callCustomer(formattedPhone)}>
                                    <View style={[
                                        styles.row,
                                        {
                                            marginTop: moderateScale(12),
                                            gap: moderateScale(10),
                                            borderBottomWidth: 1,
                                            borderBottomColor: colors?.white,
                                            paddingBottom: verticalScale(10),
                                        },
                                    ]}>
                                        <Icons.Phone size={moderateScale(20)} color={colors?.gray200} />
                                        <Text style={[styles.copyText, { color: colors?.gray200 }]}>
                                            Call Now
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    activeOpacity={0.7}
                                    style={[
                                        styles.row,
                                        {
                                            marginTop: moderateScale(12),
                                            justifyContent: "center",
                                            paddingHorizontal: scale(0),
                                        },
                                    ]}
                                    onPress={textCustomer}
                                >
                                    <View style={[
                                        styles.row,
                                        {
                                            marginTop: moderateScale(0),
                                            gap: moderateScale(10),
                                            borderBottomWidth: 1,
                                            borderBottomColor: colors?.white,
                                            paddingBottom: verticalScale(10),

                                        },
                                    ]}>
                                        <Icons.Mail size={moderateScale(20)} color={colors?.gray200} />
                                        <Text style={styles.copyText}>Text Customer</Text>
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[
                                        styles.row,
                                        {
                                            // marginTop: moderateScale(12),
                                            justifyContent: "center",
                                            paddingHorizontal: scale(0),
                                            paddingVertical: verticalScale(0),
                                            paddingBottom: verticalScale(6),
                                        },
                                    ]}
                                    onPress={() =>
                                        navigation.navigate("SignBoard", {
                                            passengerName: booking?.passenger?.name || "",
                                            bookingId: booking?.bookingId || "",
                                        })
                                    }
                                >
                                    <View style={[
                                        styles.row,
                                        {
                                            marginTop: moderateScale(0),
                                            gap: moderateScale(10),
                                        },
                                    ]}>
                                        <Icons.User size={20} color={colors.gray200} />
                                        <Text style={styles.copyText}>Show Airport Sign</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>)}

                    <View style={styles.card}>
                        <View style={[styles.row, { alignItems: "flex-start", gap: moderateScale(10) }]}>
                            <Icons.MapPin size={moderateScale(20)} color={colors?.lightGreen} />

                            <View style={{ flex: 1 }}>
                                <Text style={[styles.label, { marginBottom: verticalScale(6) }]}>
                                    Pickup Location
                                </Text>

                                <View style={[styles.row, { alignItems: "center" }]}>
                                    <TouchableOpacity
                                        style={{ flex: 1 }}
                                        onPress={() =>
                                            openMaps(journey?.pickup, journey?.pickupCoordinates)
                                        }
                                    >
                                        <Text style={styles.linkText}>{journey?.pickup || "—"}</Text>

                                        <Text
                                            style={{
                                                fontSize: moderateScale(12),
                                                color: colors?.lightGreen,
                                                marginTop: verticalScale(2),
                                            }}
                                        >
                                            Tap to open maps
                                        </Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        onPress={() => copyFullLocation(journey?.pickup, journey?.pickupCoordinates)}
                                        style={{ marginLeft: scale(8) }}
                                    >
                                        <Icons.Copy
                                            size={moderateScale(16)}
                                            color={colors?.lightGreen}
                                        />
                                    </TouchableOpacity>
                                </View>

                                {hasValue(journey?.pickupDoorNumber) && (
                                    <View style={{ marginTop: verticalScale(8) }}>
                                        <Text style={styles.label}>Door Number</Text>
                                        <Text style={styles.value}>{journey?.pickupDoorNumber}</Text>
                                    </View>
                                )}

                                {hasValue(journey?.terminal) && (
                                    <View style={{ marginTop: verticalScale(8) }}>
                                        <Text style={styles.label}>Terminal</Text>
                                        <Text style={styles.value}>{journey?.terminal}</Text>
                                    </View>
                                )}
                            </View>
                        </View>
                    </View>

                    {dropoffStops.map((stop, index) => (
                        <View style={styles.card} key={index}>
                            <View style={[styles.row, { alignItems: "flex-start", gap: moderateScale(10) }]}>
                                <Icons.MapPin
                                    size={moderateScale(20)}
                                    color={index === 0 ? colors?.error : colors?.lightBlue}
                                />

                                <View style={{ flex: 1 }}>
                                    <Text style={[styles.label, { marginBottom: verticalScale(6) }]}>
                                        {stop.label}
                                    </Text>

                                    <View style={[styles.row, { alignItems: "center" }]}>
                                        <TouchableOpacity
                                            style={{ flex: 1 }}
                                            onPress={() =>
                                                openMaps(stop.address, stop.coordinates)
                                            }
                                        >
                                            <Text style={styles.linkText}>{stop.address}</Text>

                                            <Text
                                                style={{
                                                    fontSize: moderateScale(12),
                                                    color: colors?.lightGreen,
                                                    marginTop: verticalScale(2),
                                                }}
                                            >
                                                Tap to open maps
                                            </Text>
                                        </TouchableOpacity>

                                        <TouchableOpacity
                                            onPress={() => copyCoordinates(stop.coordinates)}
                                            style={{ marginLeft: scale(8) }}
                                        >
                                            <Icons.Copy
                                                size={moderateScale(16)}
                                                color={colors?.lightGreen}
                                            />
                                        </TouchableOpacity>
                                    </View>

                                    {hasValue(stop.doorNumber) && (
                                        <View style={{ marginTop: verticalScale(8) }}>
                                            <Text style={styles.label}>Door Number</Text>
                                            <Text style={styles.value}>{stop.doorNumber}</Text>
                                        </View>
                                    )}

                                    {hasValue(stop.terminal) && (
                                        <View style={{ marginTop: verticalScale(8) }}>
                                            <Text style={styles.label}>Terminal</Text>
                                            <Text style={styles.value}>{stop.terminal}</Text>
                                        </View>
                                    )}
                                </View>
                            </View>
                        </View>
                    ))}

                    <View style={styles.card}>
                        <Text style={[styles.sectionTitle, { marginBottom: verticalScale(12) }]}>
                            Ride Information
                        </Text>

                        <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                            {booking?.mode?.toLowerCase() === "hourly" &&
                                journey?.hourlyOption?.value && (
                                    <>
                                        <View
                                            style={[
                                                styles.underBuutonrow,
                                                { marginBottom: verticalScale(16) },
                                            ]}
                                        >
                                            <Icons.Navigation
                                                size={moderateScale(18)}
                                                color={colors?.lightText}
                                            />

                                            <View style={{ marginLeft: scale(10) }}>
                                                <Text
                                                    style={[
                                                        styles.label,
                                                        { fontSize: moderateScale(12) },
                                                    ]}
                                                >
                                                    DISTANCE ALLOWED
                                                </Text>

                                                <Text style={styles.value}>
                                                    {journey?.hourlyOption?.value?.distance || 0} miles
                                                </Text>
                                            </View>
                                        </View>

                                        <View
                                            style={[
                                                styles.underBuutonrow,
                                                { marginBottom: verticalScale(16) },
                                            ]}
                                        >
                                            <Icons.Clock
                                                size={moderateScale(18)}
                                                color={colors?.lightText}
                                            />

                                            <View style={{ marginLeft: scale(10) }}>
                                                <Text
                                                    style={[
                                                        styles.label,
                                                        { fontSize: moderateScale(12) },
                                                    ]}
                                                >
                                                    HOURS ALLOWED
                                                </Text>

                                                <Text style={styles.value}>
                                                    {journey?.hourlyOption?.value?.hours || 0} hours
                                                </Text>
                                            </View>
                                        </View>
                                    </>
                                )}
                            {booking?.mode?.toLowerCase() !== "hourly" && (
                                <View
                                    style={[
                                        styles.underBuutonrow,
                                        { marginBottom: verticalScale(16) },
                                    ]}
                                >
                                    <Icons.Navigation
                                        size={moderateScale(18)}
                                        color={colors?.lightText}
                                    />

                                    <View style={{ marginLeft: scale(10) }}>
                                        <Text
                                            style={[
                                                styles.label,
                                                { fontSize: moderateScale(12) },
                                            ]}
                                        >
                                            DISTANCE
                                        </Text>

                                        <Text style={styles.value}>
                                            {journey?.distanceText
                                                ? journey.distanceText
                                                    .toLowerCase()
                                                    .includes("km")
                                                    ? `${(
                                                        parseFloat(journey.distanceText) * 0.621371
                                                    ).toFixed(1)} miles`
                                                    : journey.distanceText.replace("mi", "miles")
                                                : "—"}
                                        </Text>
                                    </View>
                                </View>
                            )}

                            {booking?.mode?.toLowerCase() !== "hourly" && (
                                <View
                                    style={[
                                        styles.underBuutonrow,
                                        { marginBottom: verticalScale(16) },
                                    ]}
                                >
                                    <Icons.Clock
                                        size={moderateScale(18)}
                                        color={colors?.lightText}
                                    />

                                    <View style={{ marginLeft: scale(10) }}>
                                        <Text
                                            style={[
                                                styles.label,
                                                { fontSize: moderateScale(12) },
                                            ]}
                                        >
                                            DURATION
                                        </Text>

                                        <Text style={styles.value}>
                                            {journey?.durationText
                                                ? `Approx. ${journey.durationText}`
                                                : "—"}
                                        </Text>
                                    </View>
                                </View>
                            )}

                            <View style={styles.underBuutonrow}>
                                <Icons.CreditCard size={moderateScale(18)} color={colors?.lightText} />

                                <View style={{ marginLeft: scale(10) }}>
                                    <Text style={[styles.label, { fontSize: moderateScale(12) }]}>PAYMENT</Text>
                                    <Text style={styles.value}>{booking?.paymentMethod}</Text>
                                </View>
                            </View>

                            {booking?.paymentMethod?.toLowerCase() === "cash" && (
                                <View style={styles.underBuutonrow}>
                                    <Icons.BadgeEuroIcon
                                        size={moderateScale(18)}
                                        color={colors?.lightText}
                                    />

                                    <View style={{ marginLeft: scale(10) }}>
                                        <Text
                                            style={[
                                                styles.label,
                                                { fontSize: moderateScale(12) }
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
                                                booking?.journeyFare != null
                                                    ? Number(booking?.journeyFare).toFixed(2)
                                                    : "—"
                                            }
                                        </Text>
                                    </View>
                                </View>
                            )}

                            <View style={styles.underBuutonrow}>
                                <Icons.BadgeEuroIcon
                                    size={moderateScale(18)}
                                    color={colors?.lightText}
                                />

                                <View
                                    style={{
                                        marginLeft: scale(10),
                                        marginTop:
                                            booking?.paymentMethod?.toLowerCase() === "cash"
                                                ? verticalScale(14)
                                                : 0,
                                    }}
                                >
                                    <Text
                                        style={[
                                            styles.label,
                                            { fontSize: moderateScale(12) }
                                        ]}
                                    >
                                        DRIVER FARE
                                    </Text>

                                    <Text
                                        style={[
                                            styles.value,
                                            { color: colors?.lightGreen }
                                        ]}
                                    >
                                        £ {
                                            booking?.driverFare != null
                                                ? Number(booking?.driverFare).toFixed(2)
                                                : "—"
                                        }
                                    </Text>
                                </View>
                            </View>
                        </View>
                        {(hasValue(journey?.notes) ||
                            hasValue(journey?.internalNotes) ||
                            hasValue(jobData?.driverNotes) ||
                            (hasValue(jobData?.tolls) && Number(jobData?.tolls) > 0)) && (
                                <View style={styles?.card}>
                                    {hasValue(journey?.notes) && (
                                        <View style={{ marginTop: verticalScale(14) }}>
                                            <Text style={styles.label}>Customer Notes</Text>
                                            <Text style={styles.value}>{journey?.notes}</Text>
                                        </View>
                                    )}

                                    {hasValue(journey?.internalNotes) && (
                                        <View style={{ marginTop: verticalScale(10) }}>
                                            <Text style={styles.label}>Internal Notes</Text>
                                            <Text style={styles.value}>{journey?.internalNotes}</Text>
                                        </View>
                                    )}
                                    {hasValue(jobData?.driverNotes) && (
                                        <View style={{ marginTop: verticalScale(5) }}>
                                            <Text style={styles.label}>Driver Notes</Text>
                                            <Text style={styles.value}>{jobData?.driverNotes}</Text>
                                        </View>
                                    )}
                                    {hasValue(jobData?.tolls) &&
                                        Number(jobData?.tolls) > 0 && (
                                            <View style={{ marginTop: verticalScale(5) }}>
                                                <Text style={styles.label}>Tolls</Text>
                                                <Text style={styles.value}>{jobData?.tolls}</Text>
                                            </View>
                                        )}
                                    {hasValue(jobData?.completionReceipt) && (
                                        <View style={{ marginTop: verticalScale(10) }}>
                                            <TouchableOpacity
                                                onPress={() => setShowReceipt(!showReceipt)}
                                            >
                                                <Text
                                                    style={[
                                                        styles.value,
                                                        {
                                                            color: colors?.primary,
                                                            textDecorationLine: "underline",
                                                        },
                                                    ]}
                                                >
                                                    {showReceipt ? "Hide Receipt" : "See Receipt"}
                                                </Text>
                                            </TouchableOpacity>

                                            {showReceipt && (
                                                <Image
                                                    source={{ uri: jobData?.completionReceipt }}
                                                    style={{
                                                        width: "100%",
                                                        height: verticalScale(220),
                                                        borderRadius: moderateScale(10),
                                                        marginTop: verticalScale(10),
                                                        resizeMode: "cover",
                                                    }}
                                                />
                                            )}
                                        </View>
                                    )}
                                    {/* {hasValue(journey?.fare) && (
                                <View style={{ marginTop: verticalScale(10) }}>
                                    <Text style={styles.label}>Journey Fare</Text>
                                    <Text style={styles.value}>{journey?.fare}</Text>
                                </View>
                            )}

                            {hasValue(journey?.voucherApplied) && (
                                <View style={{ marginTop: verticalScale(10) }}>
                                    <Text style={styles.label}>Voucher Applied</Text>
                                    <Text style={styles.value}>{journey?.voucherApplied ? "Yes" : "No"}</Text>
                                </View>
                            )} */}
                                </View>
                            )}
                    </View>

                    {shouldShowFlightSection && (
                        <View style={styles.card}>
                            <Text style={[styles.sectionTitle, { marginBottom: verticalScale(12) }]}>
                                Flight Information
                            </Text>

                            <View style={styles?.flightRow}>
                                <View
                                    style={[
                                        styles.iconWrapper,
                                        { backgroundColor: colors?.white, marginRight: scale(12) },
                                    ]}
                                >
                                    <Icons.Plane size={moderateScale(20)} color={colors?.lightBlue} />
                                </View>

                                <View style={{ flex: 1 }}>
                                    <Text style={styles?.label}>Flight No.</Text>

                                    {hasValue(journey?.flightNumber) ? (
                                        <TouchableOpacity
                                            style={styles.flightInnerRow}
                                            onPress={() =>
                                                Linking.openURL(
                                                    `https://www.google.com/search?q=${journey?.flightNumber}+flight`
                                                )
                                            }
                                        >
                                            <Text
                                                style={{
                                                    fontSize: moderateScale(16),
                                                    fontWeight: "bold",
                                                    color: colors?.white,
                                                    textDecorationLine: "underline",
                                                }}
                                            >
                                                {journey?.flightNumber}
                                            </Text>

                                            <Icons.Search
                                                size={moderateScale(16)}
                                                color={colors?.white}
                                                style={{ marginLeft: scale(6) }}
                                            />
                                        </TouchableOpacity>
                                    ) : (
                                        <Text style={styles.value}>—</Text>
                                    )}

                                    {/* {hasValue(journey?.flightOrigin) && (
                                        <Text
                                            style={{
                                                fontSize: moderateScale(11),
                                                color: colors?.gray500,
                                                marginTop: verticalScale(2),
                                            }}
                                        >
                                            {journey?.flightOrigin}
                                        </Text>
                                    )} */}
                                </View>

                                {hasValue(journey?.terminal) && (<View
                                    style={{
                                        flex: 1,
                                        marginLeft: scale(16),
                                        borderLeftWidth: 1,
                                        borderLeftColor: colors?.gray200,
                                        paddingLeft: scale(12),
                                    }}
                                >
                                    <Text style={styles.label}>Airport</Text>
                                    <Text style={styles.value}>{journey?.dropoff_terminal_0 || journey?.terminal || "N/A"}</Text>
                                </View>)}
                            </View>

                            <View style={styles.flightRow}>
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.label}>Arrival (Scheduled)</Text>
                                    <Text style={styles.value}>
                                        {formatFlightDateTime(journey?.flightArrival?.scheduled)}
                                    </Text>
                                </View>

                                <View
                                    style={{
                                        flex: 1,
                                        marginLeft: scale(16),
                                        borderLeftWidth: 1,
                                        borderLeftColor: colors?.gray200,
                                        paddingLeft: scale(12),
                                    }}
                                >
                                    <Text style={styles.label}>Arrival (Estimated)</Text>
                                    <Text style={styles.value}>
                                        {formatFlightDateTime(journey?.flightArrival?.estimated)}
                                    </Text>
                                </View>
                            </View>

                            <View style={[styles.flightRow, { marginTop: verticalScale(12) }]}>
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.label}>Flight Origin</Text>
                                    <Text style={styles.value}>{journey?.flightOrigin || "—"}</Text>
                                </View>

                                <View
                                    style={{
                                        flex: 1,
                                        marginLeft: scale(16),
                                        borderLeftWidth: 1,
                                        borderLeftColor: colors?.gray200,
                                        paddingLeft: scale(12),
                                    }}
                                >
                                    <Text style={styles.label}>Flight Destination</Text>
                                    <Text style={styles.value}>{journey?.flightDestination || "—"}</Text>
                                </View>
                            </View>

                            <View style={{ flexDirection: "row", marginTop: verticalScale(12) }}>
                                {hasValue(journey?.arrivefrom) && (
                                    <View style={{ flex: 1 }}>
                                        <Text style={styles.label}>Arrive From</Text>
                                        <Text style={styles.value}>{journey?.arrivefrom}</Text>
                                    </View>
                                )}

                                {hasValue(journey?.pickmeAfter) && (
                                    <View
                                        style={{
                                            flex: 1,
                                            marginLeft: hasValue(journey?.arrivefrom) ? scale(16) : 0,
                                            borderLeftWidth: hasValue(journey?.arrivefrom) ? 1 : 0,
                                            borderLeftColor: colors?.gray200,
                                            paddingLeft: hasValue(journey?.arrivefrom) ? scale(12) : 0,
                                        }}
                                    >
                                        <Text style={{ fontSize: moderateScale(11), color: colors?.gray500 }}>
                                            Pick Me After
                                        </Text>

                                        <Text style={styles.value}>{journey?.pickmeAfter}</Text>
                                    </View>
                                )}
                            </View>
                        </View>
                    )}

                    <View style={styles.card}>
                        <Text style={[styles.sectionTitle, { marginBottom: verticalScale(5) }]}>
                            Vehicle & Passenger Info
                        </Text>

                        {/* <View style={styles.row}>
                            <Icons.Car size={moderateScale(20)} color={colors?.lightText} />

                            <Text
                                style={[
                                    styles.value,
                                    { marginLeft: scale(10), fontWeight: "600" },
                                ]}
                            >
                                {booking?.vehicle?.passenger > 1
                                    ? "Multiple Passengers"
                                    : "Single Passenger"}
                            </Text>
                        </View> */}

                        {hasValue(booking?.vehicle?.vehicleName) && (
                            <View style={[styles.row, { marginTop: verticalScale(12) }]}>
                                <Icons.Car size={moderateScale(20)} color={colors?.lightText} />
                                <Text style={[styles.value, { marginLeft: scale(10) }]}>
                                    {booking?.vehicle?.vehicleName}
                                </Text>
                            </View>
                        )}

                        <View
                            style={[
                                styles.row,
                                {
                                    // marginTop: verticalScale(12),
                                    justifyContent: "space-around",
                                    backgroundColor: colors?.bttonColor,
                                    paddingVertical: verticalScale(12),
                                    borderRadius: scale(8),
                                    paddingHorizontal: moderateScale(6)
                                },
                            ]}
                        >
                            <View style={{ flex: 0, alignItems: "center" }}>
                                <Icons.User size={moderateScale(16)} color={colors?.gray100} />
                                <Text style={[styles.label, { color: colors?.white, fontSize: moderateScale(10) }]}>PAX</Text>
                                <Text style={styles.value1}>{booking?.vehicle?.passenger || 0}</Text>
                            </View>

                            <View style={{ flex: 0, alignItems: "center" }}>
                                <Icons.Package size={moderateScale(16)} color={colors?.gray100} />
                                <Text style={[styles.label, { color: colors?.white, fontSize: moderateScale(10) }]}>CHECK-IN</Text>
                                <Text style={styles.value1}>{booking?.vehicle?.checkinLuggage || 0}</Text>
                            </View>

                            <View style={{ flex: 0, alignItems: "center" }}>
                                <Icons.Luggage size={moderateScale(16)} color={colors?.gray100} />
                                <Text style={[styles.label, { color: colors?.white, fontSize: moderateScale(10) }]}>HAND</Text>
                                <Text style={styles.value1}>{booking?.vehicle?.handLuggage || 0}</Text>
                            </View>

                            {/* {booking?.vehicle?.childSeat > 0 && (
                                <View style={{ flex: 1, alignItems: "center" }}>
                                    <Icons.Car size={moderateScale(16)} color={colors?.lightText} />
                                    <Text style={styles.label}>CHILD</Text>
                                    <Text style={styles.value}>{booking?.vehicle?.childSeat}</Text>
                                </View>
                            )} */}

                            {booking?.vehicle?.babySeat > 0 && (
                                <View style={{ flex: 0, alignItems: "center" }}>
                                    <Icons.Baby size={moderateScale(16)} color={colors?.gray100} />
                                    <Text style={[styles.label, { color: colors?.white, fontSize: moderateScale(10) }]}>BABY</Text>
                                    <Text style={styles.value1}>{booking?.vehicle?.babySeat}</Text>
                                </View>
                            )}

                            {booking?.vehicle?.carSeat > 0 && (
                                <View style={{ flex: 0, alignItems: "center" }}>
                                    <Icons.Baby size={moderateScale(16)} color={colors?.gray100} />
                                    <Text style={[styles.label, { color: colors?.white, fontSize: moderateScale(10) }]}>CAR SEAT</Text>
                                    <Text style={styles.value1}>{booking?.vehicle?.carSeat}</Text>
                                </View>
                            )}

                            {booking?.vehicle?.boosterSeat > 0 && (
                                <View style={{ flex: 0, alignItems: "center" }}>
                                    <Icons.Baby size={moderateScale(16)} color={colors?.gray100} />
                                    <Text style={[styles.label, { color: colors?.white, fontSize: moderateScale(10) }]}>BOOSTER</Text>
                                    <Text style={styles.value1}>{booking?.vehicle?.boosterSeat}</Text>
                                </View>
                            )}
                        </View>
                    </View>
                </View>
            </ScrollView>
            <JobsStatusModal
                visible={showStatusModal}
                setVisible={setShowStatusModal}
                statusFilter={statusFilter}
                setStatusFilter={setStatusFilter}
                updateJobStatus={updateJobStatus}
                selectedJob={selectedJob}
                openExtrasModal={() => setShowExtrasModal(true)}

            />
            <ExtrasModal
                visible={showExtrasModal}
                setVisible={setShowExtrasModal}
                paymentMethod={
                    selectedJob?.booking?.paymentMethod
                }
                onComplete={(extraData) => {
                    updateJobStatus("completed", extraData);
                }}
            />
        </View>
    );
};

export default JobDetailsScreen;