import React, { useState, useMemo, useCallback } from "react";
import { Text, TouchableOpacity, View, ScrollView, FlatList, RefreshControl, TouchableWithoutFeedback } from "react-native";

import { useSelector } from "react-redux";
import { useFocusEffect, useTheme } from "@react-navigation/native";

import getStyles from "./style";
import Icons from "../../assets/icons";
import { STATUS_TABS } from "../../utils/export";
import { EndPoints } from "../../services/EndPoints";
import BookingList from "../../components/BookingList/BookingList";
import useQueryHandler from "../../services/queries/useQueryHandler";
import { mutationHandler } from "../../services/mutations/mutationHandler";
import toastUtils from "../../utils/Toast/toast";
import LoaderModal from "../../utils/loaderModal";
import { moderateScale, verticalScale } from "react-native-size-matters";
import queryHandler from "../../services/queries/queryHandler";

const MyRidesScreen = ({ navigation }) => {
  const { colors } = useTheme();
  const styles = getStyles(colors);

  const [selectedStatus, setSelectedStatus] = useState("All");
  const [refreshing, setRefreshing] = useState(false);
  const [sortBy, setSortBy] = useState("earliest");
  const [openedMenuId, setOpenedMenuId] = useState(null);



  const { user } = useSelector(state => state.userReducer)

  const companyId = user?.companyId

  const {
    data,
    refetch,
    status,
    isFetching,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useQueryHandler(EndPoints.getBookings, {
    enabled: !!user?.companyId,
    queryParams: {
      companyId: user?.companyId,
      page: 1,
      limit: 5,
    },
    useInfiniteQueryFlag: true,
  });

  // console.log('=======bookings data is here',data);

  const { data: settingData, error: settingDataError, status: settingDataStatus, isFetching: settingDataIsFetching, refetch: settingDataRefetch } = queryHandler(`${EndPoints.systemDetailsAPI}/${companyId}`);
  const { data: reviewLinkData, error: reviewLinkError, status: reviewLinkStatus, isFetching: reviewLinkIsFetching, refetch: reviewLinkRefetch } = queryHandler(EndPoints.getReviewLink);



  const { mutate: cancelBookingMutate, isPending: isCancelBookingPending } = mutationHandler(
    EndPoints.cancelBooking,
    null,
    (res) => {
      // console.log('======cancel booking log is here', res);

      toastUtils.showSuccess(
        "Booking Cancelled",
        "Booking cancelled successfully"
      );

      refetch();

    },
    (err) => {
      console.log('Booking cancel error:', err);

      toastUtils.showError(
        "Cancel Failed",
        err?.message || "Something went wrong"
      );
    },
    "patch"
  );


  const allBookings = useMemo(() => {
    if (!data?.pages) return [];

    return data.pages.flatMap(page => page?.bookings || []);
  }, [data]);


  const filteredBookings = useMemo(() => {

    let bookings;

    if (selectedStatus === "All") {

      bookings = allBookings;

    } else if (selectedStatus === "Scheduled") {

      bookings = allBookings.filter((ride) => {

        const status = ride?.status?.toLowerCase();

        return ![
          "completed",
          "late cancel",
          "no show",
        ].includes(status);

      });

    } else {

      bookings = allBookings.filter(
        (ride) =>
          ride?.status?.toLowerCase() ===
          selectedStatus.toLowerCase()
      );

    }

    return [...bookings].sort((a, b) => {

      const getDateTime = (booking) => {

        const journey =
          booking?.primaryJourney ||
          booking?.returnJourney;

        const baseDate = new Date(journey?.date);

        return new Date(
          baseDate.getFullYear(),
          baseDate.getMonth(),
          baseDate.getDate(),
          journey?.hour || 0,
          journey?.minute || 0
        ).getTime();
      };

      return sortBy === "earliest"
        ? getDateTime(a) - getDateTime(b)
        : getDateTime(b) - getDateTime(a);

    });

  }, [selectedStatus, allBookings, sortBy]);

  const totalBookings = filteredBookings.length;

  const onPullRefresh = async () => {
    setOpenedMenuId(null);
    setRefreshing(true);
    await Promise.all([
      refetch(),
    ]);
    setRefreshing(false);
  };

  const isBookingNew = (booking) => {
    return booking?.status?.toLowerCase() === "new";
  };

  const showBookingLockedAlert = () => {
    alert(
      "This booking cannot be edited or cancelled now. Please contact customer support."
    );
  };

  const handleCancelBooking = (ride) => {
    try {
      if (!isBookingNew(ride)) {
        showBookingLockedAlert();
        return;
      }

      const cancelWindow =
        settingData?.setting?.cancelBookingWindow;

      if (!cancelWindow?.value) {
        onCancelBooking?.(ride);
        return;
      }

      const journey =
        ride?.primaryJourney ||
        ride?.returnJourney;

      if (!journey?.date) {
        onCancelBooking?.(ride);
        return;
      }

      // Journey DateTime
      const bookingDateTime = new Date(journey.date);

      bookingDateTime.setHours(
        Number(journey?.hour || 0)
      );

      bookingDateTime.setMinutes(
        Number(journey?.minute || 0)
      );

      bookingDateTime.setSeconds(0);

      // Current Time
      const now = new Date();

      // Difference in milliseconds
      const diffMs =
        bookingDateTime.getTime() - now.getTime();

      // Convert to hours/minutes
      let allowedMs = 0;

      if (
        cancelWindow.unit?.toLowerCase() === "hours"
      ) {
        allowedMs =
          cancelWindow.value * 60 * 60 * 1000;
      }

      if (
        cancelWindow.unit?.toLowerCase() === "minutes"
      ) {
        allowedMs =
          cancelWindow.value * 60 * 1000;
      }

      // If remaining time is less than cancel window
      if (diffMs < allowedMs) {
        alert(
          "This booking cannot be cancelled now. Please contact customer support."
        );

        return;
      }

      // Continue cancellation
      cancelBookingMutate({
        __endpoint__:
          `${EndPoints.cancelBooking}/${ride?._id}`,

        status: "Cancelled",
      });

    } catch (error) {
      console.log(
        "Cancel booking validation error:",
        error
      );
    }
  };

  useFocusEffect(
    useCallback(() => {
      setOpenedMenuId(null);
    }, [])
  );

  return (
    <View style={{ flex: 1, backgroundColor: colors.white }}>

      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerIcon}
          onPress={() => navigation.goBack()}
        >
          <Icons.ArrowLeft size={26} color={colors.white} />
        </TouchableOpacity>

        <View style={{ justifyContent: "center", alignItems: "center" }}>
          <Text style={styles.headerTitle}>Bookings</Text>
          <Text style={styles.subTitle}>
            {totalBookings} bookings found
          </Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.7}
          style={[styles.headerIcon, { backgroundColor: colors.bg }]}
          onPress={() => navigation.navigate('NewBooking')}
        >
          <Icons.Plus size={24} style={{ color: colors.primary }} />
        </TouchableOpacity>
      </View>

      <View style={{ paddingVertical: verticalScale(10) }}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 12 }}
        >
          {STATUS_TABS.map((status) => {
            const isSelected = selectedStatus === status;

            return (
              <TouchableOpacity
                key={status}
                onPress={() => setSelectedStatus(status)}
                style={[styles?.tabContainer, {
                  backgroundColor: isSelected
                    ? colors.primary
                    : colors?.gray100,
                }]}
              >
                <Text
                  style={{
                    color: isSelected ? colors?.white : colors?.blackishText,
                    fontWeight: "600",
                    fontSize: 13,
                  }}
                >
                  {status}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingHorizontal: moderateScale(16),
          marginTop: verticalScale(10),
        }}
      >
        <Text
          style={{
            fontSize: moderateScale(15),
            fontWeight: "600",
          }}
        >
          {"My Bookings:"}
        </Text>
        <View
          style={styles?.filterVu}
        >
          <TouchableOpacity
            onPress={() => setSortBy("earliest")}
            style={{
              paddingVertical: moderateScale(5),
              paddingHorizontal: moderateScale(12),
              backgroundColor:
                sortBy === "earliest"
                  ? colors.primary
                  : colors.gray100,
              borderRadius: moderateScale(6),
            }}
          >
            <Text
              style={{
                color:
                  sortBy === "earliest"
                    ? colors.white
                    : colors.blackishText,
                fontWeight: "600",
                fontSize: moderateScale(11),
              }}
            >
              EARLIEST
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setSortBy("latest")}
            style={{
              paddingVertical: moderateScale(5),
              paddingHorizontal: moderateScale(12),
              backgroundColor:
                sortBy === "latest"
                  ? colors.primary
                  : colors.gray100,
              borderRadius: moderateScale(6),
            }}
          >
            <Text
              style={{
                color:
                  sortBy === "latest"
                    ? colors.white
                    : colors.blackishText,
                fontWeight: "600",
                fontSize: moderateScale(11),
              }}
            >
              LATEST
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.midContainer}>
        <FlatList
          data={filteredBookings}
          keyExtractor={(item, index) =>
            item?._id?.toString() ||
            item?.id?.toString() ||
            index.toString()
          }
          renderItem={({ item }) => (
            <BookingList
              item={item}
              reviewLink={reviewLinkData?.reviewLink}
              navigation={navigation}
              onCancelBooking={handleCancelBooking}
              showActionMenu={openedMenuId}
              setShowActionMenu={setOpenedMenuId}
              settingData={settingData}
            />
          )}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onPullRefresh}
            />
          }
          onEndReached={() => {
            if (hasNextPage) fetchNextPage();
          }}
          onEndReachedThreshold={0.5}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={{ alignItems: "center", marginTop: 50 }}>
              <Text>No Bookings Found</Text>
            </View>
          }
        />
      </View>
      <LoaderModal visible={isCancelBookingPending} />
    </View>
  );
};

export default MyRidesScreen;