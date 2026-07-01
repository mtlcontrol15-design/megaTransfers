import React, { useCallback, useState } from "react";
import { View, Text, TouchableOpacity, FlatList } from "react-native";

import { useSelector, useDispatch } from "react-redux";
import { useFocusEffect, useTheme } from "@react-navigation/native";
import Geolocation from '@react-native-community/geolocation';


import getStyles from "./style";
import Icons from "../../assets/icons";
import toastUtils from "../../utils/Toast/toast";
import { getSocket } from "../../services/socket";
import { EndPoints } from "../../services/EndPoints";
import { moderateScale } from "react-native-size-matters";
import ExtrasModal from "../../components/ExtrasModal/ExtrasModal";
import { dispatchOnlineStatus } from "../../redux/slices/userSlice";
import useQueryHandler from "../../services/queries/useQueryHandler";
import { mutationHandler } from "../../services/mutations/mutationHandler";
import BookingFilters from "../../components/BookingFilters/BookingFilters";
import BookingJobCard from "../../components/BookingJobCard/BookingJobCard";
import JobsStatusModal from "../../components/JobsStatusModal/JobsStatusModal";
import LocationDisclosureModal from "../../components/LocationDisclosureModal/LocationDisclosureModal";
import { requestLocationPermission, checkLocationPermissionOnly } from "../../utils/permissionsHelper";



const BookingScreen = ({ navigation }) => {
  const { colors, dark } = useTheme();
  const styles = getStyles(colors);

  const [selectedFilter, setSelectedFilter] = useState("all");
  const [filteredJobs, setFilteredJobs] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [statusFilter, setStatusFilter] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [showExtrasModal, setShowExtrasModal] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [pendingOnlineStatus, setPendingOnlineStatus] = useState(null);
  const [pendingStatusJob, setPendingStatusJob] = useState(null);


  // console.log('========selected job in booking screen is here', selectedJob?._id);


  const { user, isOnline } = useSelector(state => state.userReducer)

  const dispatch = useDispatch();


  const {
    data,
    refetch,
    status,
    isFetching,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useQueryHandler(EndPoints.getJobs, {
    enabled: !!user?.companyId,
    queryParams: {
      companyId: user?.companyId,
      driverId: user?._id,
      page: 1,
      limit: 5,
    },
    useInfiniteQueryFlag: true,
  });
  // console.log('=======job data is here',data);


  const { mutate: updateJobMutate } = mutationHandler(
    `${EndPoints.updateJob}/${selectedJob?._id}`,
    null,
    (res) => {
      console.log('Job updated:', res);
      refetch();
    },
    (err) => {
      console.log('Job status error:', err);
    },
    "put"
  );

  const { mutate: updateBookingStatusMutate } = mutationHandler(
    `${EndPoints.updateBookingStatus}/${selectedJob?.booking?._id}`,
    null,
    (res) => {
      console.log('Booking status updated:', res);
      refetch();
    },
    (err) => {
      console.log('Booking status error:', err);
    },
    "patch"
  );


  const formatStatus = (status) => {
    return status
      ?.split(" ")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };


  const makeDriverOnline = async () => {
    try {
      const hasPermission = await requestLocationPermission(true);

      if (!hasPermission) {
        toastUtils.showError(
          "Location Permission Required",
          "Please allow location permission to go online"
        );
        return false;
      }

      dispatch(dispatchOnlineStatus(true));

      const socket = getSocket();

      socket?.emit("map:location:updated", {
        isOnline: true,
        userId: user?._id,
        companyId: user?.companyId,
        employeeNumber: user?.employeeNumber,
      });

      toastUtils.showSuccess("You are now ONLINE");

      return true;
    } catch (error) {
      console.log("Make driver online error:", error);
      return false;
    }
  };
  const handleOpenStatusModal = async (job) => {
    if (!job?._id) {
      toastUtils.showError("Job Error", "Job data is not available");
      return;
    }

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

    const onlineUpdated = await makeDriverOnline();

    if (!onlineUpdated) {
      setShowStatusModal(false);
      return;
    }

    setSelectedJob(job);
    setShowStatusModal(true);
  };

  const updateJobStatus = async (statusId, extraData = {}) => {
    if (isUpdatingStatus) return;

    setIsUpdatingStatus(true);
    try {
      const canContinue = await makeDriverOnline();

      if (!canContinue) return;
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
  const jobs = React.useMemo(
    () => data?.pages?.flatMap(page => page.jobs) || [],
    [data]
  );

  const finalJobs = filteredJobs !== null ? filteredJobs : jobs;

  // console.log('====== final jobs are here', finalJobs);

  const getFilteredByTab = () => {
    if (selectedFilter === "accepted") {
      return finalJobs.filter(job => {
        const status = job?.booking?.status?.toLowerCase();

        return ["accepted", "on route", "ride started", "at location", "add waiting", "extra stop"].includes(status);
      });
    }

    if (selectedFilter === "new") {
      return finalJobs.filter(job => job?.booking?.status?.toLowerCase() === "new");
    }

    return finalJobs;
  };

  const displayJobs = getFilteredByTab();

  const dynamicCounts = {
    accepted: jobs.filter(j => {
      const status = j?.booking?.status?.toLowerCase();
      return ["accepted", "on route", "ride started", "at location", "add waiting", "extra stop"].includes(status);
    }).length,

    new: jobs.filter(j => j?.booking?.status?.toLowerCase() === "new").length,

    all: jobs.length,
  };

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.headerContainer,
          { backgroundColor: colors.primary },
        ]}
      >
        <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.7}
          hitSlop={{ top: 30, bottom: 30, left: 30, right: 30 }}
        >
          <Icons.ArrowLeft size={24} color={colors.white} />
        </TouchableOpacity>

        <View style={styles.headerTitleContainer}>
          <Text style={[styles.headerTitle, { color: colors.white }]}>
            Your Jobs
          </Text>

          {/* <Text style={[styles.headerSubtitle, { color: colors.white }]}>
            12 Jobs
          </Text> */}
        </View>

        <View style={styles.iconWrapper}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setShowFilters(!showFilters)}
          >
            <Icons.Filter size={24} color={colors.white} />
          </TouchableOpacity>

          <TouchableOpacity activeOpacity={0.7} onPress={refetch}>
            <Icons.RefreshCcw size={24} color={colors.white} />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.contentContainer}>
        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[
              styles.tabButton,
              selectedFilter === "accepted" && styles.activeTab,
            ]}
            onPress={() => setSelectedFilter("accepted")}
          >
            <Text
              style={[
                styles.tabText,
                selectedFilter === "accepted" && styles.activeTabText,
              ]}
            >
              In Progress ({dynamicCounts.accepted})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.tabButton,
              selectedFilter === "new" && styles.activeTab,
            ]}
            onPress={() => setSelectedFilter("new")}
          >
            <Text
              style={[
                styles.tabText,
                selectedFilter === "new" && styles.activeTabText,
              ]}
            >
              New ({dynamicCounts.new})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.tabButton,
              selectedFilter === "all" && styles.activeTab,
            ]}
            onPress={() => setSelectedFilter("all")}
          >
            <Text
              style={[
                styles.tabText,
                selectedFilter === "all" && styles.activeTabText,
              ]}
            >
              All ({dynamicCounts.all})
            </Text>
          </TouchableOpacity>
        </View>
        <View style={{ paddingHorizontal: moderateScale(16) }}>
          {showFilters && (
            <BookingFilters
              jobs={jobs}
              setFilteredJobs={setFilteredJobs}
            />
          )}
        </View>
        <FlatList
          data={displayJobs}
          keyExtractor={(item) => item._id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ padding: 16 }}
          renderItem={({ item }) => (
            <BookingJobCard
              job={item}
              onPress={() => navigation.navigate("JobDetails", { job: item, jobId: item?._id })}
              onPressStatus={() => handleOpenStatusModal(item)}
            />
          )}
          ListEmptyComponent={() => (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No Jobs Found</Text>
            </View>
          )}
          refreshing={isFetching}
          onRefresh={refetch}

          onEndReached={() => {
            if (hasNextPage && !isFetchingNextPage) {
              fetchNextPage();
            }
          }}
          onEndReachedThreshold={0.5}
        />
      </View>
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
            const onlineUpdated = await makeDriverOnline();

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

export default BookingScreen;