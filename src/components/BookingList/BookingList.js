import React from "react";
import RideCard from "../RideCard/RideCard";
import { Alert } from "react-native";

const BookingList = ({ item, navigation, onCancelBooking, reviewLink, showActionMenu, setShowActionMenu, settingData
}) => {
  const openViewDetails = (ride) => {
    navigation.navigate("JourneyDetails", {
      booking: ride,
      bookingId: ride?._id,
    });
  };

  const canEditByCancelWindow = (ride) => {
    const cancelWindow = settingData?.setting?.cancelBookingWindow;

    if (!cancelWindow?.value) {
      return true;
    }

    const journey = ride?.primaryJourney || ride?.returnJourney;

    if (!journey?.date) {
      return true;
    }

    const bookingDateTime = new Date(journey.date);

    bookingDateTime.setHours(Number(journey?.hour || 0));
    bookingDateTime.setMinutes(Number(journey?.minute || 0));
    bookingDateTime.setSeconds(0);

    const now = new Date();
    const diffMs = bookingDateTime.getTime() - now.getTime();

    let allowedMs = 0;

    if (cancelWindow.unit?.toLowerCase() === "hours") {
      allowedMs = Number(cancelWindow.value) * 60 * 60 * 1000;
    }

    if (cancelWindow.unit?.toLowerCase() === "minutes") {
      allowedMs = Number(cancelWindow.value) * 60 * 1000;
    }

    return diffMs > allowedMs;
  };

  const canEditByStatus = (ride) => {
    const status = ride?.status?.toLowerCase();

    const editableStatuses = [
      "new",
      "accepted",
      "on route",
      "at location",
      "add waiting",
      "extra stop",
      "ride started",
    ];

    return editableStatuses.includes(status);
  };

  const openEditBooking = (ride) => {
    if (!ride) {
      navigation.navigate("NewBooking", {
        mode: "create",
      });
      return;
    }

    if (!canEditByStatus(ride)) {
      alert(
        "This booking cannot be edited now. Please contact customer support."
      );
      return;
    }

    if (!canEditByCancelWindow(ride)) {
      alert(
        "This booking cannot be edited now. Please contact customer support."
      );
      return;
    }

    navigation.navigate("NewBooking", {
      mode: "edit",
      booking: ride,
    });
  };


  return (
    <RideCard
      ride={item}
      onViewDetails={openViewDetails}
      onEditBooking={openEditBooking}
      onCancelBooking={onCancelBooking}
      reviewLink={reviewLink}
      navigation={navigation}
      showActionMenu={showActionMenu}
      setShowActionMenu={setShowActionMenu}
    />
  );
};

export default BookingList;