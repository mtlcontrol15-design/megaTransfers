
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Text, TouchableOpacity, View, FlatList, RefreshControl, AppState } from "react-native";

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
import { isBookingReviewed, isReviewWindowOpen } from "../../utils/reviewUtils";
import { requestUserPermission } from '../../utils/SaveFCM/NotificationServices';
import LocationDisclosureModal from "../../components/LocationDisclosureModal/LocationDisclosureModal";
import { requestLocationPermission, checkLocationPermissionOnly } from "../../utils/permissionsHelper";
import { dispatchAvailabilityStatus, dispatchDeviceToken, dispatchOnlineStatus } from "../../redux/slices/userSlice";

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
  const [isUpdatingAvailability, setIsUpdatingAvailability] =
    useState(false);
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
  const { user, token, isOnline, reviewedBookings = [], isAvailable } = useSelector(state => state.userReducer)
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
  const isCustomer = user?.role === "customer" || user?.role === "corporate";
  const dashBoardCustomer = user?.role === "customer";

  const userImage = user?.profileImage;
  const companyId = user?.companyId

  const {
    data: bookingsData,
    refetch: bookingsRefetch,
    fetchNextPage: bookingsFetchNextPage,
    hasNextPage: bookingsHasNextPage,
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
  } = useQueryHandler(`${EndPoints?.getNotifications}/${notificationId}`, {
    queryParams: {
      page: 1,
      limit: 50,
    },
    useInfiniteQueryFlag: true,
  });

  // console.log('======notification data is here', notificationsData);


  const { data: chatUsersData, error: chatUsersError, status: chatUsersStatus, isFetching: chatUsersIsFetching, refetch: chatUsersRefetch } = queryHandler(EndPoints.getChatUsersCount);
  const { data: scheduledJobsData, error: scheduledJobsError, status: scheduledJobsStatus, isFetching: scheduledJobsIsFetching, refetch: scheduledJobsRefetch, isLoading: scheduledJobsIsLoading } = queryHandler(EndPoints.getScheduledJobs);
  const { data: companyData, error: companyDataError, status: companyStatus, isFetching: companyDataFetching, refetch: companyDataRefetch } = queryHandler(EndPoints.getCompanyDetails);
  const { data: companyDataCustomer, error: companyDataerror, status: companyDataCustomerStatus, isFetching: companyDataCustomerIsFetching, refetch: companyDataCustomerRefetch } = queryHandler(EndPoints.getCompanyDetailsCustomer);
  const { data: reviewLinkData, error: reviewLinkError, status: reviewLinkStatus, isFetching: reviewLinkIsFetching, refetch: reviewLinkRefetch } = queryHandler(EndPoints.getReviewLink);
  const { data: settingData, error: settingDataError, status: settingDataStatus, isFetching: settingDataIsFetching, refetch: settingDataRefetch } = queryHandler(`${EndPoints.systemDetailsAPI}/${companyId}`);
  const { data: bidData, error: bidDataError, status: bidDataStatus, isFetching: bidDataIsFetching, refetch: bidDataRefetch } = queryHandler(EndPoints.newBid);
  const bidCount = bidData?.count ?? bidData?.data?.count ?? 0;

  // console.log('========reviewLinkData', reviewLinkData);
  // console.log('========companyDataCustomer', companyDataCustomer);
  // console.log('========system settings are here', settingData);
  // console.log('========bid data is here', bidData);
  // console.log('========scheduled jobs data is here', scheduledJobsData);
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
      console.log(' Location saved successfully:', res);
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

      await scheduledJobsRefetch();

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

      await scheduledJobsRefetch();

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
        { id: "4", icon: Icons.Spool, label: "Pool", route: "Pool" },
        { id: "3", icon: Icons.BadgeEuroIcon, label: "Earnings", route: "Earnings" },
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

  const scheduledJobs = useMemo(() => {
    const jobs = scheduledJobsData?.jobs ?? [];

    const getJobDateTime = job => {
      const journey =
        job?.returnJourney?.date
          ? job.returnJourney
          : job?.primaryJourney?.date
            ? job.primaryJourney
            : job?.booking?.returnJourney?.date
              ? job.booking.returnJourney
              : job?.booking?.primaryJourney;

      if (!journey?.date) {
        return 0;
      }

      const date = new Date(journey.date);

      if (Number.isNaN(date.getTime())) {
        return 0;
      }

      date.setHours(
        Number(journey?.hour || 0),
        Number(journey?.minute || 0),
        0,
        0,
      );

      return date.getTime();
    };

    return [...jobs].sort((a, b) => {
      const firstDate = getJobDateTime(a);
      const secondDate = getJobDateTime(b);

      return sortBy === "earliest"
        ? firstDate - secondDate
        : secondDate - firstDate;
    });
  }, [scheduledJobsData, sortBy]);

  // console.log('=======sorted upcoming jobs are here', sortedUpcomingJobs);

  const sortedBookings = useMemo(() => {
    const excludedStatuses = [
      "late cancel",
      "no show",
      "rejected",
      "cancelled",
    ];

    const filteredBookings =
      allBookings.filter(booking => {
        const status =
          booking?.status
            ?.trim()
            ?.toLowerCase() || "";

        if (
          excludedStatuses.includes(status)
        ) {
          return false;
        }

        if (status !== "completed") {
          return true;
        }

        const hasReview =
          isBookingReviewed(
            booking,
            reviewedBookings,
          );

        if (hasReview) {
          return false;
        }
        return isReviewWindowOpen(
          booking,
          reviewedBookings,
        );
      });

    const getDateTime = booking => {
      const journey =
        booking?.primaryJourney ||
        booking?.returnJourney;

      if (!journey?.date) {
        return 0;
      }

      const date =
        new Date(journey.date);

      if (Number.isNaN(date.getTime())) {
        return 0;
      }

      date.setHours(
        Number(journey?.hour || 0),
        Number(journey?.minute || 0),
        0,
        0,
      );

      return date.getTime();
    };

    return [...filteredBookings].sort(
      (a, b) =>
        sortBy === "earliest"
          ? getDateTime(a) - getDateTime(b)
          : getDateTime(b) - getDateTime(a),
    );
  }, [
    allBookings,
    sortBy,
    reviewedBookings,
  ]);

  const refreshAllData = useCallback(async () => {
    if (isDriver) {
      await scheduledJobsRefetch();
    } else {
      await bookingsRefetch();
    }
    await notificationsRefetch();
    await chatUsersRefetch();
    await bidDataRefetch();
  }, [isDriver, scheduledJobsRefetch, bookingsRefetch, notificationsRefetch, chatUsersRefetch, bidDataRefetch]);


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

  const handleSwipe = async (isOnlineStatus, showPermissionToast = true) => {
    try {
      const hasPermission = await requestLocationPermission(isOnlineStatus);

      if (!hasPermission && isOnlineStatus) {
        if (showPermissionToast) {
          toastUtils.showError(
            "Location Permission Required",
            "Please allow location permission to go online"
          );
        }

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

              isAvailable: isOnlineStatus
                ? isAvailable
                : false,
            };

            // console.log("======payload for online status is here", payload);

            mutateSaveLocation(payload);
            dispatch(dispatchOnlineStatus(isOnlineStatus));

            if (!isOnlineStatus) {
              dispatch(dispatchAvailabilityStatus(false));
            }

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

            if (showPermissionToast) {
              toastUtils.showError(
                "Location Error",
                "Unable to get your current location"
              );
            }

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

  const handleAvailabilityChange = async nextAvailability => {
    const availabilityValue = nextAvailability === true;

    if (isUpdatingAvailability) {
      return false;
    }

    if (!isOnline) {
      toastUtils.showError(
        "You Are Offline",
        "Please go online before changing availability."
      );

      return false;
    }

    if (availabilityValue && hasActiveJob) {
      toastUtils.showError(
        "Active Job",
        "You cannot become available while handling a job."
      );

      return false;
    }

    setIsUpdatingAvailability(true);

    try {
      const hasPermission =
        await requestLocationPermission(true);

      if (!hasPermission) {
        toastUtils.showError(
          "Location Permission Required",
          "Allow location access to update availability."
        );

        return false;
      }

      const position = await new Promise(
        (resolve, reject) => {
          Geolocation.getCurrentPosition(
            resolve,
            reject,
            {
              enableHighAccuracy: true,
              timeout: 15000,
              maximumAge: 10000,
            }
          );
        }
      );

      const {
        latitude,
        longitude,
        accuracy,
        heading,
        speed,
      } = position.coords;

      const payload = {
        latitude,
        longitude,
        accuracy,
        heading,
        speed,
        isOnline: true,
        isAvailable: availabilityValue,
        locationUpdatedAt: new Date().toISOString(),
      };

      const apiUpdated = await new Promise(resolve => {
        mutateSaveLocation(payload, {
          onSuccess: () => {
            resolve(true);
          },
          onError: error => {
            console.log(
              "Availability API error:",
              error
            );

            resolve(false);
          },
        });
      });

      if (!apiUpdated) {
        toastUtils.showError(
          "Availability Update Failed",
          "We could not update your availability. Please try again."
        );

        return false;
      }

      dispatch(
        dispatchAvailabilityStatus(
          availabilityValue
        )
      );

      const socket = getSocket();

      socket?.emit(
        "driver:availability:update",
        {
          ...payload,
          userId: user?._id,
          driverId: user?._id,
          companyId: user?.companyId,
          employeeNumber:
            user?.employeeNumber,
        }
      );

      toastUtils.showSuccess(
        availabilityValue
          ? "You Are Available"
          : "You Are Unavailable",
        availabilityValue
          ? "You can now receive ASAP jobs."
          : "Your availability has been turned off."
      );

      return true;
    } catch (error) {
      console.log(
        "Availability update error:",
        error
      );

      const isTimeout =
        error?.code === 3;

      toastUtils.showError(
        isTimeout
          ? "Location Timed Out"
          : "Availability Update Failed",
        isTimeout
          ? "Your location took too long. Please check GPS and try again."
          : "Unable to update availability. Please try again."
      );

      return false;
    } finally {
      setIsUpdatingAvailability(false);
    }
  };

  const continuePendingOnlineAfterPermission = useCallback(async () => {
    const hasPermission = await checkLocationPermissionOnly();

    if (!hasPermission) {
      return;
    }

    const onlineUpdated = await handleSwipe(true, false);

    if (!onlineUpdated) {
      return;
    }

    if (pendingStatusJob) {
      setSelectedJob(pendingStatusJob);
      setShowStatusModal(true);
    }

    setPendingOnlineStatus(null);
    setPendingStatusJob(null);
  }, [handleSwipe, pendingStatusJob]);

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


  const activeJobStatuses = [
    "accepted",
    "on route",
    "at location",
    "add waiting",
    "extra stop",
    "ride started",
  ];

  const hasActiveJob = useMemo(() => {
    return scheduledJobs.some(job => {
      const status = (
        job?.jobStatus ||
        job?.booking?.status ||
        ""
      ).toLowerCase();

      return activeJobStatuses.includes(status);
    });
  }, [scheduledJobs]);

  useEffect(() => {
    if (!hasActiveJob || !isAvailable) {
      return;
    }

    dispatch(dispatchAvailabilityStatus(false));

    const socket = getSocket();

    socket?.emit("driver:availability:update", {
      userId: user?._id,
      driverId: user?.driverId,
      companyId: user?.companyId,
      employeeNumber: user?.employeeNumber,
      isAvailable: false,
      reason: "active_job",
    });

    mutateSaveLocation({
      isOnline: true,
      isAvailable: false,
    });
  }, [
    hasActiveJob,
    isAvailable,
    user?._id,
    user?.driverId,
    user?.companyId,
    user?.employeeNumber,
  ]);

  useEffect(() => {
    const subscription = AppState.addEventListener("change", async (nextAppState) => {
      if (nextAppState !== "active") {
        return;
      }

      if (pendingOnlineStatus !== true) {
        return;
      }

      await continuePendingOnlineAfterPermission();
    });

    return () => {
      subscription.remove();
    };
  }, [pendingOnlineStatus, continuePendingOnlineAfterPermission]);


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
      if (isDriver) {
        scheduledJobsRefetch();
      }
    };

    const handleBookingUpdated = () => {
      if (isDriver) {
        scheduledJobsRefetch();
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

  }, [isDriver,
    scheduledJobsRefetch,
    bookingsRefetch,
  ]);


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
          onNotificationPress={() =>
            navigation.navigate("Notification")
          }
          onImagePress={() =>
            navigation.navigate("Support")
          }
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
          isAvailable={isAvailable}
          hasActiveJob={hasActiveJob}
          isUpdatingAvailability={isUpdatingAvailability}
          onToggleAvailability={handleAvailabilityChange}
          onToggleOnline={async value => {
            if (value) {
              await handleGoOnlineRequest();
              return;
            }

            if (isAvailable) {
              await handleAvailabilityChange(false);
            }

            await handleSwipe(false);
            dispatch(dispatchAvailabilityStatus(false));
          }}
        />
        <NavigationTabs
          navItems={navItems}
          selectedNav={selectedNav}
          onNavigate={handleNavigate}
          colors={colors}
          profileImage={userImage}
          bidCount={bidCount}
        />
        <FlatList
          data={isDriver ? scheduledJobs : sortedBookings}
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
            if (
              !isDriver &&
              bookingsHasNextPage
            ) {
              bookingsFetchNextPage();
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
            (isDriver ? scheduledJobsIsFetching : bookingsIsLoading)
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
              const onlineUpdated = await handleSwipe(true, false);

              if (!onlineUpdated) {
                return;
              }

              if (pendingStatusJob) {
                setSelectedJob(pendingStatusJob);
                setShowStatusModal(true);
              }

              setPendingOnlineStatus(null);
              setPendingStatusJob(null);
            }
          }}
        />
      </View>
    </View>

  );
};

export default HomeScreen;