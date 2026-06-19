import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Linking, Image, RefreshControl } from "react-native";

import { useSelector } from "react-redux";
import { useTheme } from "@react-navigation/native";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";

import getStyles from "./style";
import Icons from "../../assets/icons";
import { getSocket } from "../../services/socket";
import { EndPoints } from "../../services/EndPoints";
import queryHandler from "../../services/queries/queryHandler";
import { formatPhoneWithPlus, getDialableNumber } from "../../utils/phoneUtils";

const JourneyDetailsScreen = ({ route, navigation }) => {
  const { colors } = useTheme();
  const styles = getStyles(colors);

  const [refreshing, setRefreshing] = useState(false);

  const { user } = useSelector((state) => state.userReducer);

  const bookingId = route?.params?.bookingId;
  const isCustomer = user?.role === "customer";


  // console.log('=======route data is here', routeData);
  // console.log('=======booking id is here', bookingId);

  const { data, isFetching, refetch } = queryHandler(
    `${EndPoints.getBookingById}/${bookingId}`
  );

  // console.log('=====booking Id data is here', data);


  const finalData = data?.booking || {};

  // console.log('=====final  data is here', data);


  const journey = finalData?.returnJourneyToggle
    ? finalData?.returnJourney || {}
    : finalData?.primaryJourney || {};

  // console.log('=====journey  data is here', journey);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    } catch (e) {
      return dateString;
    }
  };

  const formatTime = (hour, minute) => {

    if (
      hour === undefined ||
      minute === undefined
    ) {
      return "N/A";
    }

    const h = parseInt(hour);
    const m = parseInt(minute);

    if (
      isNaN(h) ||
      isNaN(m)
    ) {
      return "N/A";
    }

    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
  };

  const isAirport = (location = "") => {
    return location.toLowerCase().includes("airport");
  };

  const getAdditionalDropoffLabel = (index) => {
    const letters = ["C", "D", "E", "F"];
    return letters[index] || "";
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

  const handleCall = (phoneNumber) => {

    if (!phoneNumber) return;

    const formattedNumber =
      formatPhoneWithPlus(phoneNumber);

    const dialableNumber =
      getDialableNumber(formattedNumber);

    Linking.openURL(
      `tel:${dialableNumber}`
    );
  };

  const handleEmail = (email) => {
    if (email) {
      Linking.openURL(`mailto:${email}`);
    }
  };

  const assignedDriver =
    finalData?.drivers?.[0] ||
    finalData?.journeyDetails?.drivers?.[0] ||
    null;

  // console.log('=======assigned driver is here',assignedDriver);


  const isNewBooking =
    finalData?.status?.toLowerCase() === "new";

  const bookingStatus =
    finalData?.status?.toLowerCase();

  const hideDriverCard = [
    "completed",
    "rejected",
    "late cancel",
    "no show",
    "cancelled"
  ].includes(bookingStatus);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }

  useEffect(() => {
    let socket = getSocket();
    let intervalId = null;

    // Named listeners
    const handleJobUpdated = (data) => {
      refetch();
    };

    const handleBookingUpdated = (data) => {
      if (isCustomer) {
        refetch();
      }
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

  return (
    <View style={{ flex: 1, backgroundColor: colors.white }}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerIcon}
          onPress={() => navigation.goBack()}
        >
          <Icons.ArrowLeft size={26} color={colors.white} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Journey Details</Text>

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
        <View style={styles.container}>
          <View style={styles.bookingCard}>

            <View style={styles.rowBetween}>
              <View>
                <Text style={styles.bookingId}>
                  #{finalData?.bookingId || "N/A"}
                </Text>

                <Text style={styles.smallText}>
                  Booking ID
                </Text>
              </View>

              <View style={{ flexDirection: "row", alignItems: "center" }}>

                <View style={styles.statusBadge}>
                  <Text style={styles.statusText}>
                    {formatStatus(finalData?.status || "New")}
                  </Text>
                </View>

                {finalData?.returnJourneyToggle && (
                  <View
                    style={styles.returnBadge}
                  >
                    <Text
                      style={{
                        fontSize: 10,
                        fontWeight: "600",
                        color: colors?.primary,
                      }}
                    >
                      RETURN
                    </Text>
                  </View>
                )}

              </View>
            </View>

            <View style={styles.bookingTimeRow}>
              <View style={styles.iconTextRow}>
                <Icons.Calendar size={14} color={colors.primary} />

                <View style={{ marginLeft: moderateScale(6) }}>
                  <Text style={styles.labelText}>
                    Booking Date
                  </Text>

                  <Text style={styles.valueText}>
                    {formatDate(journey?.date)}
                  </Text>
                </View>
              </View>

              <View style={styles.divider} />

              <View style={styles.iconTextRow}>
                <Icons.Clock size={14} color={colors.primary} />

                <View style={{ marginLeft: moderateScale(6) }}>
                  <Text style={styles.labelText}>
                    Booking Time
                  </Text>

                  <Text style={styles.valueText}>
                    {formatTime(journey?.hour, journey?.minute)}
                  </Text>
                </View>
              </View>
            </View>
          </View>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Journey Details</Text>
            <View style={styles.locationRow}>
              <View style={styles.pointA}>
                <Text style={styles.pointText}>A</Text>
              </View>

              <Text style={styles.locationTitle}>Pickup</Text>
            </View>

            <View style={styles.locationContent}>
              <Text style={styles.locationText}>
                {journey?.pickup || "Not specified"}
              </Text>

              {journey?.pickupDoorNumber && (
                <Text style={styles.locationSub}>
                  Door No: {journey.pickupDoorNumber}
                </Text>
              )}

              {isAirport(journey?.pickup) && (
                <>
                  {journey?.flightNumber && (
                    <Text style={styles.locationSub}>
                      <Text style={[styles.locationSub, { color: colors.primary, fontWeight: '600' }]}>Flight : </Text>{journey.flightNumber}
                    </Text>
                  )}

                  {journey?.arrivefrom && (
                    <Text style={styles.locationSub}>
                      <Text style={[styles.locationSub, { color: colors.primary, fontWeight: '600' }]}>Arriving from : </Text>{journey.arrivefrom}
                    </Text>
                  )}
                  {journey?.pickmeAfter && (
                    <Text style={styles.locationSub}>
                      <Text style={[styles.locationSub, { color: colors.primary, fontWeight: '600' }]}>Pick me after : </Text>{journey.pickmeAfter}
                    </Text>
                  )}
                </>
              )}
            </View>
            <View style={[styles.locationRow, { marginTop: 20 }]}>
              <View style={styles.pointB}>
                <Text style={styles.pointText}>B</Text>
              </View>

              <Text style={styles.locationTitle}>Dropoff</Text>
            </View>

            <View style={styles.locationContent}>
              <Text style={styles.locationText}>
                {journey?.dropoff || "Not specified"}
              </Text>

              {journey?.dropoffDoorNumber && (
                <Text style={styles.locationSub}>
                  Door No: {journey.dropoffDoorNumber}
                </Text>
              )}

              {isAirport(journey?.dropoff) && journey?.terminal && (
                <Text style={styles.locationSub}>
                  Terminal: {journey.terminal}
                </Text>
              )}
            </View>

            {[journey?.additionalDropoff1, journey?.additionalDropoff2, journey?.additionalDropoff3, journey?.additionalDropoff4].map(
              (additionalDropoff, index) =>
                additionalDropoff ? (
                  <View key={`additional-dropoff-${index}`}>
                    <View style={[styles.locationRow, { marginTop: 20 }]}>
                      <View style={styles.pointB}>
                        <Text style={styles.pointText}>{getAdditionalDropoffLabel(index)}</Text>
                      </View>

                      <Text style={styles.locationTitle}>
                        {index === 0 ? "Additional Dropoff" : `Additional Dropoff ${index + 1}`}
                      </Text>
                    </View>

                    <View style={styles.locationContent}>
                      <Text style={styles.locationText}>
                        {additionalDropoff}
                      </Text>
                    </View>
                  </View>
                ) : null
            )}
          </View>
          {!hideDriverCard && (
            <View style={styles.card}>

              <Text style={styles.cardTitle}>
                Driver Details
              </Text>

              {isNewBooking || !assignedDriver ? (

                <View
                  style={{
                    paddingVertical: verticalScale(10),
                  }}
                >

                  <Text
                    style={{
                      color: colors.primary,
                      fontSize: moderateScale(13),
                      lineHeight: moderateScale(20),
                    }}
                  >
                    Driver details will appear once the driver is On Route.
                  </Text>

                </View>

              ) : (

                <>
                  {/* DRIVER IMAGE */}

                  <View
                    style={{
                      alignItems: "center",
                      marginBottom: verticalScale(14),
                    }}
                  >

                    {assignedDriver?.image ? (

                      <TouchableOpacity
                        activeOpacity={1}
                      >

                        <Image
                          source={{
                            uri: assignedDriver?.image,
                          }}
                          style={{
                            width: moderateScale(120),
                            height: moderateScale(120),
                            borderRadius: moderateScale(40),
                            // objectFit: 'contain',
                            borderRadius: moderateScale(60),
                          }}
                        />

                      </TouchableOpacity>

                    ) : (

                      <View
                        style={{
                          width: moderateScale(80),
                          height: moderateScale(80),
                          borderRadius: moderateScale(40),
                          backgroundColor: colors.primary,
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >

                        <Icons.User
                          size={32}
                          color={colors.white}
                        />

                      </View>
                    )}
                  </View>

                  {/* DRIVER NAME */}

                  <View style={styles.iconTextRow}>
                    <Icons.User
                      size={20}
                      color={colors.text}
                    />

                    <Text style={styles.passengerText}>
                      {assignedDriver?.firstName}{" "}
                      {assignedDriver?.lastName}
                    </Text>
                  </View>

                  {/* DRIVER PHONE */}

                  <TouchableOpacity
                    style={styles.iconTextRow}
                    onPress={() =>
                      handleCall(assignedDriver?.contact)
                    }
                  >

                    <Icons.Phone
                      size={20}
                      color={colors.text}
                    />

                    <Text style={styles.linkText}>
                      {formatPhoneWithPlus(
                        assignedDriver?.contact
                      )}
                    </Text>

                  </TouchableOpacity>

                  {/* VEHICLE */}

                  <View style={styles.iconTextRow}>

                    <Icons.Car
                      size={20}
                      color={colors.text}
                    />

                    <Text style={styles.passengerText}>

                      {assignedDriver?.vehicle?.make}{" "}
                      {assignedDriver?.vehicle?.model}

                    </Text>

                  </View>

                  {/* REGISTRATION */}

                  <View style={styles.iconTextRow}>

                    <Icons.CreditCard
                      size={20}
                      color={colors.text}
                    />

                    <Text style={styles.passengerText}>
                      {
                        assignedDriver?.vehicle
                          ?.registration
                      }
                    </Text>

                  </View>

                  {/* COLOR */}

                  <View style={styles.iconTextRow}>

                    <Icons.Circle
                      size={18}
                      color={colors.text}
                    />

                    <Text style={styles.passengerText}>
                      {assignedDriver?.vehicle?.color}
                    </Text>

                  </View>
                </>

              )}
            </View>
          )}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Passenger Details</Text>

            <View style={styles.iconTextRow}>
              <Icons.User size={20} color={colors.text} />
              <Text style={styles.passengerText}>
                {finalData?.passenger?.name || "N/A"}
              </Text>
            </View>

            <TouchableOpacity
              style={styles.iconTextRow}
              onPress={() => handleEmail(finalData?.passenger?.email)}
            >
              <Icons.Mail size={20} color={colors.text} />
              <Text style={styles.linkText}>
                {finalData?.passenger?.email || "No Email"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.iconTextRow}
              onPress={() => handleCall(finalData?.passenger?.phone)}
            >
              <Icons.Phone size={20} color={colors.text} />
              <Text style={styles.linkText}>
                {formatPhoneWithPlus(finalData?.passenger?.phone) || "No Phone"}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Vehicle Details</Text>

            <View style={styles.vehicleWrapper}>
              <View style={styles.vehicleRow}>
                <Icons.Car size={18} color={colors.text} />

                <Text style={styles.vehicleName}>
                  {finalData?.vehicle?.vehicleName || "Standard Vehicle"}
                </Text>
              </View>

              <View
                style={[
                  styles.vehicleStatsRow,
                  {
                    justifyContent: "space-around",
                    alignItems: "center",
                    paddingVertical: verticalScale(12),
                    borderRadius: scale(8),
                    paddingHorizontal: moderateScale(6),
                    backgroundColor: colors?.primary,
                  },
                ]}
              >
                <View style={{ alignItems: "center" }}>
                  <Icons.User size={moderateScale(16)} color={colors?.gray100} />
                  <Text style={[styles.vehicleStatLabel, { color: colors?.white, fontSize: moderateScale(10) }]}>
                    PAX
                  </Text>
                  <Text style={styles.vehicleStatValue}>
                    {finalData?.vehicle?.passenger || 0}
                  </Text>
                </View>
                <View style={{ alignItems: "center" }}>
                  <Icons.Package size={moderateScale(16)} color={colors?.gray100} />
                  <Text style={[styles.vehicleStatLabel, { color: colors?.white, fontSize: moderateScale(10) }]}>
                    CHECK-IN
                  </Text>
                  <Text style={styles.vehicleStatValue}>
                    {finalData?.vehicle?.checkinLuggage || 0}
                  </Text>
                </View>
                <View style={{ alignItems: "center" }}>
                  <Icons.Luggage size={moderateScale(16)} color={colors?.gray100} />
                  <Text style={[styles.vehicleStatLabel, { color: colors?.white, fontSize: moderateScale(10) }]}>
                    HAND
                  </Text>
                  <Text style={styles.vehicleStatValue}>
                    {finalData?.vehicle?.handLuggage || 0}
                  </Text>
                </View>
                {finalData?.vehicle?.babySeat > 0 && (
                  <View style={{ alignItems: "center" }}>
                    <Icons.Baby size={moderateScale(16)} color={colors?.gray100} />
                    <Text style={[styles.vehicleStatLabel, { color: colors?.white, fontSize: moderateScale(10) }]}>
                      BABY
                    </Text>
                    <Text style={styles.vehicleStatValue}>
                      {finalData?.vehicle?.babySeat}
                    </Text>
                  </View>
                )}
                {finalData?.vehicle?.carSeat > 0 && (
                  <View style={{ alignItems: "center" }}>
                    <Icons.Baby size={moderateScale(16)} color={colors?.gray100} />
                    <Text style={[styles.vehicleStatLabel, { color: colors?.white, fontSize: moderateScale(10) }]}>
                      CAR SEAT
                    </Text>
                    <Text style={styles.vehicleStatValue}>
                      {finalData?.vehicle?.carSeat}
                    </Text>
                  </View>
                )}
                {finalData?.vehicle?.boosterSeat > 0 && (
                  <View style={{ alignItems: "center" }}>
                    <Icons.Baby size={moderateScale(16)} color={colors?.gray100} />
                    <Text style={[styles.vehicleStatLabel, { color: colors?.white, fontSize: moderateScale(10) }]}>
                      BOOSTER
                    </Text>
                    <Text style={styles.vehicleStatValue}>
                      {finalData?.vehicle?.boosterSeat}
                    </Text>
                  </View>
                )}
              </View>
            </View>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Fare Summary</Text>

            <View style={styles.rowBetween}>
              <Text style={styles.fareLabel}>Base Fare</Text>

              <Text style={styles.fareValue}>
                {finalData?.currency?.symbol || "£"}
                {Number(finalData?.primaryJourney?.fare || finalData?.returnJourney?.fare || 0).toFixed(2)}
              </Text>
            </View>

            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total</Text>

              <Text style={styles.fareValue}>
                {finalData?.currency?.symbol || "£"}
                {Number(finalData?.primaryJourney?.fare || finalData?.returnJourney?.fare || 0).toFixed(2)}
              </Text>
            </View>

            <Text style={styles.paymentText}>
              Payment Method: {finalData?.paymentMethod || "Cash"}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.closeButton}
          >
            <Text style={styles.closeText}>Close</Text>
          </TouchableOpacity>

        </View>
      </ScrollView>
    </View>
  );
};

export default JourneyDetailsScreen;