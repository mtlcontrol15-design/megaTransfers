
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Text, TouchableOpacity, View, FlatList, RefreshControl, TouchableWithoutFeedback } from "react-native";

import DeviceInfo from 'react-native-device-info';
import { useRoute } from "@react-navigation/native";
import { moderateScale } from "react-native-size-matters";
import Geolocation from '@react-native-community/geolocation';
import { useFocusEffect, useNavigation, useTheme } from "@react-navigation/native";


import getStyles from "./style";
import Icons from "../../assets/icons";
import toastUtils from "../../utils/Toast/toast";
import LoaderModal from "../../utils/loaderModal";
import { getSocket } from "../../services/socket";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer"
import { EndPoints } from "../../services/EndPoints";
import { useDispatch, useSelector } from "react-redux";
import JobItem from "../../components/JobList/JobList";
import queryHandler from "../../services/queries/queryHandler";
import ExtrasModal from "../../components/ExtrasModal/ExtrasModal";
import BookingList from "../../components/BookingList/BookingList";
import useQueryHandler from '../../services/queries/useQueryHandler';
import { mutationHandler } from "../../services/mutations/mutationHandler";
import NavigationTabs from "../../components/NavigationTabs/NavigationTabs";
import JobsStatusModal from "../../components/JobsStatusModal/JobsStatusModal";
import { requestUserPermission } from '../../utils/SaveFCM/NotificationServices';
import { dispatchDeviceToken, dispatchOnlineStatus } from "../../redux/slices/userSlice";
import LocationDisclosureModal from "../../components/LocationDisclosureModal/LocationDisclosureModal";
import { requestLocationPermission, checkLocationPermissionOnly } from "../../utils/permissionsHelper";

const HomeScreen = () => {
  const { colors } = useTheme();
  const styles = getStyles(colors);
  const navigation = useNavigation();
  const [sortBy, setSortBy] = useState("earliest");
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [statusFilter, setStatusFilter] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [showExtrasModal, setShowExtrasModal] = useState(false);
  const [openedMenuId, setOpenedMenuId] = useState(null);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [shouldShowFetchLoader, setShouldShowFetchLoader] = useState(true);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [pendingOnlineStatus, setPendingOnlineStatus] = useState(null);
  const [pendingStatusJob, setPendingStatusJob] = useState(null);
  const isFirstFocus = useRef(true);

  const route = useRoute();
  const selectedNav =
    route.name === "HomeMain"
      ? "Home"
      : route.name === "BookingsTab"
        ? "Bookings"
        : route.name === "EarningsTab"
          ? "Earnings"
          : route.name === "ProfileTab"
            ? "Profile"
            : route.name;
  const { user, token, isOnline, reviewedBookings = [] } = useSelector(state => state.userReducer)
  const notificationId =
    user?.role === "driver"
      ? user?.employeeNumber
      : user?._id;

  // console.log('=======user',user);
  // console.log('=======user token is here',token);
  // console.log('========selected job is here', selectedJob);
  // console.log('home colors are here',colors);


  const dispatch = useDispatch();

  const isDriver = user?.role === "driver";
  const driverId = user?.driverId;
  const isCustomer = user?.role === "customer" || user?.role === "corporate";
  const dashBoardCustomer = user?.role === "customer";

  const userImage = user?.profileImage;
  const userName = user?.fullName;
  const companyId = user?.companyId


  const {
    data,
    refetch,
    status,
    isFetching,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useQueryHandler(EndPoints.getJobs, {
    enabled: isDriver && !!user?.companyId,
    queryParams: {
      companyId: user?.companyId,
      driverId: user?._id,
      page: 1,
      limit: 5,
    },
    useInfiniteQueryFlag: true,
  });


  // console.log('======== jobs data is here', data);

  const {
    data: bookingsData,
    refetch: bookingsRefetch,
    status: bookingsStatus,
    isFetching: bookingsIsFetching,
    fetchNextPage: bookingsFetchNextPage,
    hasNextPage: bookingsHasNextPage,
    isFetchingNextPage: bookingsIsFetchingNextPage,
    isLoading: bookingsIsLoading,
  } = useQueryHandler(EndPoints.getBookings, {
    enabled: isCustomer && !!user?.companyId,
    queryParams: {
      companyId: user?.companyId,
      page: 1,
      limit: 5,
    },
    useInfiniteQueryFlag: true,
  });


  // console.log('=======bookings data is here', bookingsData);


  const {
    data: notificationsData,
    refetch: notificationsRefetch,
    status: notificationsStatus,
    isFetching: notificationsIsFetching,
    fetchNextPage: notificationsFetchNextPage,
    hasNextPage: notificationsHasNextPage,
    isFetchingNextPage: notificationsIsFetchingNextPage,
  } = useQueryHandler(`${EndPoints?.getNotifications}/${notificationId}`, {
    queryParams: {
      page: 1,
      limit: 50,
    },
    useInfiniteQueryFlag: true,
  });

  // console.log('======notification data is here', notificationsData);


  const { data: chatUsersData, error: chatUsersError, status: chatUsersStatus, isFetching: chatUsersIsFetching, refetch: chatUsersRefetch } = queryHandler(EndPoints.getChatUsersCount);
  const { data: companyData, error: companyDataError, status: companyStatus, isFetching: companyDataFetching, refetch: companyDataRefetch } = queryHandler(EndPoints.getCompanyDetails);
  const { data: companyDataCustomer, error: companyDataerror, status: companyDataCustomerStatus, isFetching: companyDataCustomerIsFetching, refetch: companyDataCustomerRefetch } = queryHandler(EndPoints.getCompanyDetailsCustomer);
  const { data: reviewLinkData, error: reviewLinkError, status: reviewLinkStatus, isFetching: reviewLinkIsFetching, refetch: reviewLinkRefetch } = queryHandler(EndPoints.getReviewLink);
  const { data: settingData, error: settingDataError, status: settingDataStatus, isFetching: settingDataIsFetching, refetch: settingDataRefetch } = queryHandler(`${EndPoints.systemDetailsAPI}/${companyId}`);

  // console.log('========reviewLinkData', reviewLinkData);
  // console.log('========companyDataCustomer', companyDataCustomer);
  // console.log('========system settings are here', settingData);

  const { mutate: mutateFcmToken } = mutationHandler(
    EndPoints?.registerFcm,
    null,
    (res) => {
      // console.log('FCM token registered successfully:', res);
    },
    (err) => {
      console.log('FCM token registration error:', err);
    },
    "post"
  );

  const { mutate: mutateSaveLocation } = mutationHandler(
    EndPoints?.saveLocation,
    null,
    (res) => {
      // console.log(' Location saved successfully:', res);
    },
    (err) => {
      console.log('Location saving error:', err);
    },
    "post"
  );


  const { mutate: updateJobMutate, isPending: isUpdatingJob } = mutationHandler(
    `${EndPoints.updateJob}/${selectedJob?._id}`,
    null,
    async (res) => {

      setShowExtrasModal(false);
      setShowStatusModal(false);

      await refetch();

    },
    (err) => {
      console.log('Job status error:', err);
    },
    "put"
  );

  const { mutate: updateBookingStatusMutate, isPending: isUpdatingBookingStatus } = mutationHandler(
    `${EndPoints.updateBookingStatus}/${selectedJob?.booking?._id}`,
    null,
    async (res) => {

      setShowExtrasModal(false);
      setShowStatusModal(false);

      await refetch();

    },
    (err) => {
      console.log('Booking status error:', err);
    },
    "patch"
  );

  const { mutate: cancelBookingMutate, isPending: isCancelBookingPending } = mutationHandler(
    EndPoints.cancelBooking,
    null,
    (res) => {
      // console.log('======cancel booking log is here', res);

      toastUtils.showSuccess(
        "Booking Cancelled",
        "Booking cancelled successfully"
      );

      bookingsRefetch();

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


  const formatStatus = (status) => {
    return status
      ?.split(" ")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };



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

  const allNotifications =
    notificationsData?.pages?.flatMap(page => page) ?? [];

  const unreadCount = allNotifications.filter(n => !n.isRead).length;

  // console.log('======= uread notifications are here', unreadCount);

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


  const handleFcmToken = (deviceToken) => {
    // console.log('deviceToken', deviceToken)
    mutateFcmToken({ fcmToken: deviceToken });
    dispatch(dispatchDeviceToken(deviceToken));
  }

  const getToken = async () => {
    const devicToken = await requestUserPermission();
    // console.log('devicToken>>>>>>>', devicToken)
    handleFcmToken(devicToken);
  };

  const chatCount = chatUsersData?.count || 0;


  const allBookings = useMemo(() => {
    if (!bookingsData?.pages) return [];

    return bookingsData.pages.flatMap(page => page?.bookings || []);
  }, [bookingsData]);

  const getNavItems = () => {
    if (isDriver) {
      return [
        { id: "1", icon: Icons.Home, label: "Home", route: "Home" },
        { id: "2", icon: Icons.Car, label: "Bookings", route: "Bookings" },
        { id: "3", icon: Icons.BadgeEuroIcon, label: "Earnings", route: "Earnings" },
        { id: "4", icon: Icons.User, label: "Profile", route: "Profile" },
      ];
    }

    if (isCustomer) {
      return [
        { id: "1", icon: Icons.Home, label: "Home", route: "Home" },
        { id: "2", icon: Icons.Car, label: "My Rides", route: "MyRides" },
        { id: "3", icon: Icons.FileText, label: "Invoices", route: "Earnings" },
        { id: "4", icon: Icons.User, label: "Profile", route: "Profile" },
      ];
    }

    return [
      { id: "1", icon: Icons.Home, label: "Home", route: "Home" },
      { id: "2", icon: Icons.User, label: "Profile", route: "Profile" },
    ];
  };

  const navItems = getNavItems();

  const handleNavigate = (item) => {
    if (item.route === "Home") {
      navigation.navigate("HomeMain");
    } else {
      navigation.navigate(item.route + "Tab");
    }
  };



  const sortedUpcomingJobs = useMemo(() => {
    if (!data?.pages) return [];

    const jobs = data.pages.flatMap(page => page?.jobs || []);
    const now = new Date();

    return jobs
      .filter(job => {
        const journey =
          job?.returnJourney?.date
            ? job?.returnJourney
            : job?.primaryJourney?.date
              ? job?.primaryJourney
              : job?.booking?.returnJourney?.date
                ? job?.booking?.returnJourney
                : job?.booking?.primaryJourney;
        const status = job?.booking?.status?.toLowerCase();

        if (!journey?.date) return false;

        const baseDate = new Date(journey.date);

        const jobDateTime = new Date(
          baseDate.getFullYear(),
          baseDate.getMonth(),
          baseDate.getDate(),
          journey?.hour || 0,
          journey?.minute || 0
        );

        const isFuture = jobDateTime > now;

        const inProgressStatuses = [
          "new",
          "accepted",
          "on route",
          "at location",
          "add waiting",
          "extra stop",
          "ride started",
          "no show request",
          "late cancel request",
        ];

        const isInProgress = inProgressStatuses.includes(status);

        return isFuture || isInProgress;
      })
      .sort((a, b) => {
        const getDateTime = (job) => {
          const journey =
            job?.returnJourney?.date
              ? job?.returnJourney
              : job?.primaryJourney?.date
                ? job?.primaryJourney
                : job?.booking?.returnJourney?.date
                  ? job?.booking?.returnJourney
                  : job?.booking?.primaryJourney;
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

  }, [data, sortBy]);

  // console.log('=======sorted upcoming jobs are here', sortedUpcomingJobs);

  const sortedBookings = useMemo(() => {

    const filteredBookings = allBookings.filter(booking => {

      const status =
        booking?.status?.toLowerCase();

      const isReviewedCompleted =
        status === "completed" && booking?.reviewed ||
        reviewedBookings.includes(booking?._id);

      return ![
        "late cancel",
        "no show",
        "rejected",
        "cancelled"
      ].includes(status) && !isReviewedCompleted;

    });

    return [...filteredBookings].sort((a, b) => {

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

  }, [allBookings, sortBy]);

  const refreshAllData = useCallback(async () => {
    if (isDriver) {
      await refetch();
    } else {
      await bookingsRefetch();
    }
    await notificationsRefetch();
    await chatUsersRefetch();
  }, [isDriver, refetch, bookingsRefetch, notificationsRefetch, chatUsersRefetch]);


  const handleRefreshAll = async () => {

    setOpenedMenuId(null);
    setShowStatusModal(false);

    await new Promise(resolve =>
      setTimeout(resolve, 150)
    );

    setRefreshing(true);

    await refreshAllData();

    setRefreshing(false);
  };

  const handleSwipe = async (isOnlineStatus) => {
    try {
      const hasPermission = await requestLocationPermission(isOnlineStatus);

      if (!hasPermission && isOnlineStatus) {
        toastUtils.showError(
          "Location Permission Required",
          "Please allow location permission to go online"
        );
        return false;
      }

      return await new Promise((resolve) => {
        Geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;

            const payload = {
              latitude,
              longitude,
              isOnline: isOnlineStatus,
            };

            mutateSaveLocation(payload);
            dispatch(dispatchOnlineStatus(isOnlineStatus));

            const socket = getSocket();

            socket?.emit("map:location:updated", {
              ...payload,
              userId: user?._id,
              companyId: user?.companyId,
              employeeNumber: user?.employeeNumber,
            });

            if (isOnlineStatus) {
              toastUtils.showSuccess("You are now ONLINE");
            } else {
              toastUtils.showInfo("You are now OFFLINE");
            }

            resolve(true);
          },
          (error) => {
            console.log("Location error:", error);
            toastUtils.showError(
              "Location Error",
              "Unable to get your current location"
            );
            resolve(false);
          },
          {
            timeout: 15000,
          }
        );
      });
    } catch (err) {
      console.log("Swipe error:", err);
      return false;
    }
  };

  const handleGoOnlineRequest = async (job = null) => {
    const hasLocationPermission = await checkLocationPermissionOnly();

    if (!hasLocationPermission) {
      setPendingStatusJob(job);
      setPendingOnlineStatus(true);
      setShowLocationModal(true);
      return;
    }

    const onlineUpdated = await handleSwipe(true);

    if (!onlineUpdated) {
      setShowStatusModal(false);
      return;
    }

    if (job) {
      setSelectedJob(job);
      setShowStatusModal(true);
    }
  };

  const handleStatusPress = async (job) => {
    if (isOnline) {
      setSelectedJob(job);
      setShowStatusModal(true);
      return;
    }

    const hasLocationPermission = await checkLocationPermissionOnly();

    if (!hasLocationPermission) {
      setPendingStatusJob(job);
      setPendingOnlineStatus(true);
      setShowLocationModal(true);
      return;
    }

    const onlineUpdated = await handleSwipe(true);

    if (!onlineUpdated) {
      setShowStatusModal(false);
      return;
    }

    setSelectedJob(job);
    setShowStatusModal(true);
  };
  const filteredJobs = useMemo(() => {
    return sortedUpcomingJobs.filter(job => {
      const status = job?.booking?.status?.toLowerCase();

      return !["late cancel", "no show", "completed", "cancelled"].includes(status);
    });
  }, [sortedUpcomingJobs]);

  // console.log('=======filtered job is here', filteredJobs);


  useEffect(() => {
    const timer = setTimeout(() => {
      getToken();
    }, 300);

    return () => clearTimeout(timer);
  }, [])

  useFocusEffect(
    useCallback(() => {
      setOpenedMenuId(null);
      setShowStatusModal(false);

      if (isFirstFocus.current) {
        isFirstFocus.current = false;
      } else {
        setShouldShowFetchLoader(false);
        refreshAllData();
      }

      return () => {
        setOpenedMenuId(null);
        setShowStatusModal(false);
      };
    }, [refreshAllData])
  );

  useEffect(() => {

    if (!isDriver) return;

    if (!isOnline) return;

    const interval = setInterval(async () => {

      const isLocationEnabled =
        await DeviceInfo.isLocationEnabled();

      if (!isLocationEnabled) {

        dispatch(dispatchOnlineStatus(false));

        const socket = getSocket();

        socket?.emit("map:driver:offline", {
          userId: user?._id,
          companyId: user?.companyId,
          employeeNumber: user?.employeeNumber,
        });

        toastUtils.showError(
          "Location Disabled",
          "You are now OFFLINE because device location is disabled"
        );

        clearInterval(interval);
      }

    }, 3000);

    return () => clearInterval(interval);

  }, [isDriver, isOnline]);

  useEffect(() => {

    let socket = getSocket();
    let intervalId = null;

    const handleJobUpdated = () => {
      refetch();
    };

    const handleBookingUpdated = () => {

      if (isDriver) {
        refetch();
      } else {
        bookingsRefetch();
      }
    };

    const attachSocketListeners = (s) => {

      s.off("job:updated", handleJobUpdated);
      s.off("booking:updated", handleBookingUpdated);

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

        socket.off(
          "job:updated",
          handleJobUpdated
        );

        socket.off(
          "booking:updated",
          handleBookingUpdated
        );
      }
    };

  }, [user]);


  const onPullRefresh = async () => {

    // Close all menus/modals first
    setOpenedMenuId(null);
    setShowStatusModal(false);

    // Small delay helps UI update immediately
    await new Promise(resolve => setTimeout(resolve, 50));

    setRefreshing(true);

    await refreshAllData();

    setRefreshing(false);
  };

  const renderHeader = () => (
    <View
      style={{
        paddingHorizontal: moderateScale(16),
        paddingTop: isCustomer
          ? moderateScale(13)
          : moderateScale(13),

        paddingBottom: isDriver
          ? moderateScale(13)
          : 0,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <Text
          style={{
            fontSize: moderateScale(15),
            fontWeight: "600",
          }}
        >
          {isDriver ? "Upcoming Jobs:" : "My Bookings:"}
        </Text>

        <View
          style={{
            flexDirection: "row",
            gap: 8,
            alignSelf: "flex-end",
          }}
        >
          <TouchableOpacity
            onPress={() => setSortBy("earliest")}
            style={{
              paddingVertical: moderateScale(4),
              paddingHorizontal: moderateScale(12),
              backgroundColor:
                sortBy === "earliest"
                  ? colors.buttonBackground
                  : colors.border,
              borderRadius: 6,
            }}
          >
            <Text
              style={{
                color: colors.white,
                fontWeight: "600",
                fontSize: moderateScale(10),
              }}
            >
              EARLIEST
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setSortBy("latest")}
            style={{
              paddingVertical: moderateScale(4),
              paddingHorizontal: moderateScale(12),
              backgroundColor:
                sortBy === "latest"
                  ? colors.buttonBackground
                  : colors.border,
              borderRadius: 6,
            }}
          >
            <Text
              style={{
                color: colors.white,
                fontWeight: "600",
                fontSize: moderateScale(10),
              }}
            >
              LATEST
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
  const companyInfo = companyData?.data || {};
  const companyInfoCustomer = companyDataCustomer?.data || {};

  // console.log('=======companyInfo is here',companyInfo);

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1, backgroundColor: colors.white }}>
        <Header
          colors={colors}
          onNotificationPress={() => navigation.navigate('Notification')}
          onImagePress={() => navigation.navigate('Support')}
          companyName={
            isCustomer
              ? companyInfoCustomer?.name || "Company"
              : companyInfo?.name || "Company"
          }
          companyLogo={
            isCustomer
              ? companyInfoCustomer?.logo
              : companyInfo?.logo
          }
          isCustomer={isCustomer}
          isDriver={isDriver}
          unreadCount={unreadCount}
          onRefreshPress={handleRefreshAll}
          onToggleOnline={(value) => {
            if (value) {
              handleGoOnlineRequest();
            } else {
              handleSwipe(false);
            }
          }}
        />
        <NavigationTabs
          navItems={navItems}
          selectedNav={selectedNav}
          onNavigate={handleNavigate}
          colors={colors}
          profileImage={userImage}
        />
        <FlatList
          data={isDriver ? filteredJobs : sortedBookings}
          contentContainerStyle={{ flexGrow: 1 }}
          alwaysBounceVertical={true}
          overScrollMode="always"
          keyExtractor={(item, index) =>
            item?._id?.toString() ||
            item?.id?.toString() ||
            index.toString()
          }
          ListHeaderComponent={renderHeader}
          renderItem={({ item }) =>
            isDriver ? (
              <JobItem
                item={item}
                colors={colors}
                navigation={navigation}
                isUpdatingJob={
                  (isUpdatingJob || isUpdatingBookingStatus) &&
                  selectedJob?._id === item?._id
                }
                onPressStatus={handleStatusPress}
              />
            ) : (
              <BookingList
                item={item}
                navigation={navigation}
                reviewLink={reviewLinkData?.reviewLink}
                onCancelBooking={handleCancelBooking}
                showActionMenu={openedMenuId}
                setShowActionMenu={setOpenedMenuId}
                settingData={settingData}
              />
            )
          }
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={async () => {

                setShowStatusModal(false);

                await onPullRefresh();
              }}
            />
          }

          onEndReached={() => {
            if (isDriver) {
              if (hasNextPage) fetchNextPage();
            } else {
              if (bookingsHasNextPage) bookingsFetchNextPage();
            }
          }}
          onEndReachedThreshold={0.5}
          ListEmptyComponent={
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text>
                {isDriver
                  ? "No Jobs Found"
                  : "No Bookings Found"}
              </Text>
            </View>
          }
        />
        <Footer
          colors={colors}
          navigation={navigation}
          chatCount={chatCount}
          dashBoardCustomer={dashBoardCustomer}
        />

        <JobsStatusModal
          visible={showStatusModal}
          setVisible={setShowStatusModal}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          updateJobStatus={updateJobStatus}
          selectedJob={selectedJob}
          openExtrasModal={() => setShowExtrasModal(true)}
        />
        <LoaderModal
          visible={
            shouldShowFetchLoader &&
            !refreshing &&
            (isDriver ? isLoading : bookingsIsLoading)
          }
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
      <LocationDisclosureModal
        visible={showLocationModal}
        colors={colors}
        onCancel={() => {
          setShowLocationModal(false);
          setPendingOnlineStatus(null);
          setPendingStatusJob(null);
          setShowStatusModal(false);
        }}
        onAgree={async () => {
          setShowLocationModal(false);

          if (pendingOnlineStatus === true) {
            const onlineUpdated = await handleSwipe(true);

            if (!onlineUpdated) {
              setPendingOnlineStatus(null);
              setPendingStatusJob(null);
              setShowStatusModal(false);
              return;
            }

            if (pendingStatusJob) {
              setSelectedJob(pendingStatusJob);
              setShowStatusModal(true);
            }
          }

          setPendingOnlineStatus(null);
          setPendingStatusJob(null);
        }}
      />
    </View>

  );
};

export default HomeScreen;