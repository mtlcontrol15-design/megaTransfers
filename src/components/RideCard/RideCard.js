import React, { useMemo, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Icons from "../../assets/icons";
import getStyles from "./style";
import { useTheme } from "@react-navigation/native";
import { mutationHandler } from "../../services/mutations/mutationHandler";
import { EndPoints } from "../../services/EndPoints";
import toastUtils from "../../utils/Toast/toast";
import ReviewModal from '../../components/ReviewModal/ReviewModal'
import queryHandler from "../../services/queries/queryHandler";
import { Theme } from "../../libs";
import { useDispatch, useSelector } from "react-redux";
import { dispatchReviewedBooking } from "../../redux/slices/userSlice";

const RideCard = ({ ride, onViewDetails, onEditBooking, onCancelBooking, reviewLink, navigation, showActionMenu, setShowActionMenu }) => {
  const isReviewWindowOpen = useMemo(() => {
    if (!ride?.status || ride?.status.toLowerCase() !== "completed" || hasReview) return false;
    let completedAt = null;
    if (Array.isArray(ride?.statusAudit)) {
      const completedAudit = [...ride.statusAudit].reverse().find(audit => audit.status?.toLowerCase() === "completed");
      completedAt = completedAudit?.date;
    }
    if (!completedAt) completedAt = ride?.completedAt || journey?.date;
    if (!completedAt) return false;
    const completedTime = new Date(completedAt).getTime();
    const now = Date.now();
    const FORTY_EIGHT_HOURS = 48 * 60 * 60 * 1000;
    return now - completedTime < FORTY_EIGHT_HOURS;
  }, [ride, hasReview, journey]);
  const { colors } = useTheme();
  const styles = getStyles(colors);
  const [showReviewModal, setShowReviewModal] = useState(false);

  // console.log('========ride data is here',ride)
  const { reviewedBookings } = useSelector(state => state?.userReducer)

  const dispatch = useDispatch();

  const { mutate: postReviewMutate, isPending: isPostingReview } = mutationHandler(
    EndPoints.postReview,
    null,
    (res) => {
      toastUtils.showSuccess(
        "Review Submitted",
        "Thank you for your feedback"
      );

      dispatch(dispatchReviewedBooking(ride?._id));

      setShowReviewModal(false);
    },
    (err) => {
      toastUtils.showError("Review Failed", err?.message || "Something went wrong");
    },
    "post"
  );

  const handlePostReview = (payload) => {
    // console.log('======review payload is here', payload);

    postReviewMutate(payload);
  };



  const journey = useMemo(() => {
    return ride?.returnJourneyToggle
      ? ride?.returnJourney
      : ride?.primaryJourney;
  }, [ride]);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  const formatTime = (hour, minute) => {
    if (hour === undefined || minute === undefined) return "N/A";

    const h = parseInt(hour, 10);
    const m = parseInt(minute, 10);

    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
  };

  const formatPhone = (phone) => {
    if (!phone) return "N/A";
    if (phone.startsWith("+")) return phone;
    return `+${phone}`;
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

  const hasReview = ride?.reviewed || reviewedBookings?.includes(ride?._id);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
          <View style={styles.bookingIdBox}>
            <Text style={styles.bookingIdText}>#{ride?.bookingId}</Text>
          </View>

          <View
            style={[
              styles.statusBadge,
              {
                backgroundColor: colors?.gray100,
              },
            ]}
          >
            <Text style={{ fontSize: 12, fontWeight: "600", color: colors?.black }}>
              {formatStatus(ride?.status || "New")}
            </Text>
          </View>
        </View>
        {(ride?.mode === "Hourly" || ride?.returnJourneyToggle) && (
          <View style={styles.returnBadge}>
            <Text
              style={{
                fontSize: 10,
                fontWeight: "600",
                color: colors?.primary,
              }}
            >
              {ride?.mode === "Hourly" ? "HOURLY" : "RETURN"}
            </Text>
          </View>
        )}

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() =>
            setShowActionMenu(
              showActionMenu === ride?._id
                ? null
                : ride?._id
            )
          }
        >
          <Icons.MoreVertical size={18} color={colors?.white} />
        </TouchableOpacity>
      </View>

      {showActionMenu === ride?._id && (
        <View style={styles.actionMenu}>
          <TouchableOpacity
            style={[styles.actionItem, { borderBottomWidth: 1, borderBottomColor: colors?.gray200 }]}
            onPress={() => {
              setShowActionMenu(false);
              onEditBooking?.(ride);
            }}
          >
            <Icons.Edit size={18} color={colors?.blue} />
            <Text style={styles.actionText}>Edit Booking</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionItem, { borderBottomWidth: 1, borderBottomColor: colors?.gray200 }]}
            onPress={() => {
              setShowActionMenu(false);
              onViewDetails?.(ride);
            }}
          >
            <Icons.Eye size={18} color={colors?.lightGreen} />
            <Text style={styles.actionText}>View Details</Text>
          </TouchableOpacity>
          {ride?.status?.toLowerCase() !== "cancelled" &&
            ride?.status?.toLowerCase() !== "completed" && (
              <TouchableOpacity
                style={styles.actionItem}
                onPress={() => {
                  setShowActionMenu(false);
                  onCancelBooking?.(ride);
                }}
              >
                <Icons.AlertCircle size={18} color={colors?.error} />
                <Text style={styles.actionText}>Cancel Booking</Text>
              </TouchableOpacity>
            )}
        </View>
      )}

      <TouchableOpacity activeOpacity={0.95} onPress={() => onViewDetails?.(ride)}>
        <View style={styles.content}>

          <View style={styles.passengerBox}>
            <Icons.User size={16} color={colors?.gray600} />

            <Text style={styles.passengerName}>
              {ride?.passenger?.name || "No Name"}
            </Text>

            <View style={styles.phoneBox}>
              <Icons.Phone size={12} color={colors?.gray600} />
              <Text style={styles.phoneText}>
                {formatPhone(ride?.passenger?.phone)}
              </Text>
            </View>
          </View>

          <View style={styles.dateTimeRow}>
            <View style={styles.dateBox}>
              <Icons.Calendar size={14} color={colors?.gray600} />
              <Text style={styles.dateTimeText}>
                {formatDate(journey?.date)}
              </Text>
            </View>

            <View style={styles.timeBox}>
              <Icons.Clock size={14} color={colors?.gray600} />
              <Text style={styles.dateTimeText}>
                {formatTime(journey?.hour, journey?.minute)}
              </Text>
            </View>
          </View>

          <View style={styles.locationBox}>
            <View style={styles.locationRow}>
              <Icons.MapPin size={16} color={colors?.error} />
              <View style={{ marginLeft: 10, flex: 1 }}>
                <Text style={styles.locationLabel}>PICK-UP</Text>
                <Text style={styles.locationText}>
                  {journey?.pickup || "Pickup location"}
                </Text>
              </View>
            </View>

            {/* <View style={styles.dashedLine} /> */}

            <View style={styles.locationRow}>
              <Icons.MapPin size={16} color={colors?.lightGreen} />
              <View style={{ marginLeft: 10, flex: 1 }}>
                <Text style={styles.locationLabel}>DROP-OFF</Text>
                <Text style={styles.locationText}>
                  {journey?.dropoff || "Dropoff location"}
                </Text>
              </View>
            </View>
          </View>

          {
            ride?.status?.toLowerCase() === "completed" ? (
              hasReview ? (
                <View
                  style={{
                    backgroundColor: Theme?.colors?.gray200,
                    paddingVertical: 12,
                    borderRadius: 10,
                    marginTop: 14,
                    alignItems: "center",
                    justifyContent: "center",
                    borderWidth: 0.5,
                    borderColor: Theme?.colors?.black,
                  }}
                >
                  <Text
                    style={{
                      color: Theme?.colors?.black,
                      fontSize: 14,
                      fontWeight: "700",
                    }}
                  >
                    Review Submitted
                  </Text>
                </View>
              ) : (
                isReviewWindowOpen ? (
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => setShowReviewModal(true)}
                    style={{
                      backgroundColor: colors.bttonColor,
                      paddingVertical: 12,
                      borderRadius: 10,
                      marginTop: 14,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Text
                      style={{
                        color: colors.white,
                        fontSize: 14,
                        fontWeight: "700",
                      }}
                    >
                      Leave Review
                    </Text>
                  </TouchableOpacity>
                ) : null
              )
            ) : (
              <View style={styles.bottomRow}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Icons.Car size={16} color={colors?.gray600} />
                  <View style={{ marginLeft: 8 }}>
                    <Text style={{ fontSize: 11, color: colors?.gray600 }}>
                      Vehicle
                    </Text>
                    <Text style={styles.vehicleText}>
                      {ride?.vehicle?.vehicleName || "Standard"}
                    </Text>
                  </View>
                </View>
                <View style={styles.fareBox}>
                  <Text style={styles.fareText}>
                    {ride?.currency?.symbol || "£"}
                    {Number(
                      ride?.primaryJourney?.fare ||
                      ride?.returnJourney?.fare ||
                      0
                    ).toFixed(2)}
                  </Text>
                </View>
              </View>
            )}

          {/* {ride?.driver?.name && (
            <View style={styles.driverBox}>
              <View style={styles.driverAvatar}>
                <Text style={styles.driverInitial}>
                  {ride?.driver?.name?.charAt(0).toUpperCase()}
                </Text>
              </View>

              <View style={{ marginLeft: 10 }}>
                <Text style={styles.driverLabel}>Driver</Text>
                <Text style={styles.driverName}>{ride?.driver?.name}</Text>
              </View>
            </View>
          )} */}
        </View>
      </TouchableOpacity>
      <ReviewModal
        visible={showReviewModal}
        onClose={() => setShowReviewModal(false)}
        bookingId={ride?._id}
        onSubmit={handlePostReview}
        reviewLink={reviewLink}
        navigation={navigation}
      />
    </View>
  );
};

export default RideCard;