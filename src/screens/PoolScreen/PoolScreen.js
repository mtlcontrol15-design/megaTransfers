import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    RefreshControl,
    ActivityIndicator,
} from "react-native";
import { useFocusEffect, useNavigation, useTheme } from "@react-navigation/native";
import { useSelector } from "react-redux";

import getStyles from "./style";
import Icons from "../../assets/icons";
import toastUtils from "../../utils/Toast/toast";
import { getSocket } from "../../services/socket";
import { EndPoints } from "../../services/EndPoints";
import useQueryHandler from "../../services/queries/useQueryHandler";
import BidBottomSheet from "../../components/BidBottomSheet/BidBottomSheet";
import { mutationHandler } from "../../services/mutations/mutationHandler";

const PoolScreen = () => {
    const { colors } = useTheme();
    const styles = getStyles(colors);
    const navigation = useNavigation();

    const { user } = useSelector(state => state.userReducer);

    // console.log("PoolScreen user:", user);

    const [refreshing, setRefreshing] = useState(false);
    const [selectedPoolJob, setSelectedPoolJob] = useState(null);
    const [showBidSheet, setShowBidSheet] = useState(false);

    const {
        data,
        refetch,
        isLoading,
        isFetching,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useQueryHandler(EndPoints.getPoolJobs, {
        enabled: !!user?.companyId,
        queryParams: {
            companyId: user?.companyId,
            driverId: user?._id,
            page: 1,
            limit: 10,
        },
        useInfiniteQueryFlag: true,
    });

    // console.log("Pool Jobs Data:", data);


    const { mutate, isPending } = mutationHandler(
        `${EndPoints.postBid}/${selectedPoolJob?._id}`,
        null,
        async (res) => {
            console.log("bid response:", res);
            toastUtils.showSuccess(
                "Bid submitted",
                "Bid submitted successfully for the selected pool job."
            );
            setShowBidSheet(false);
            setSelectedPoolJob(null);
            await refetch();
        },
        (err) => {
            toastUtils.showError(
                "Bid Error",
                err?.message || "Failed to submit bid for the selected pool job."
            );
            console.log("bid error:", err);
        },
        "post"
    );

    const poolJobs = useMemo(() => {
        if (!data?.pages) return [];

        const allPoolJobs = data.pages.flatMap(page =>
            page?.jobs ||
            page?.poolJobs ||
            page?.data ||
            []
        );

        return allPoolJobs.filter(job => {
            const status = job?.status?.toLowerCase();

            return !["new", "accepted", "completed", "rejected"].includes(status);
        });
    }, [data]);

    const onRefresh = async () => {
        setRefreshing(true);
        await refetch?.();
        setRefreshing(false);
    };

    const handleBackPress = () => {
        navigation.navigate("HomeMain");
    };

    const handleSubmitBid = (payload, job) => {
        mutate(payload);
    };

    const handleBidPress = (job) => {
        setSelectedPoolJob(job);
        setShowBidSheet(true);
    };

    useEffect(() => {
        if (!user?.companyId) return;

        let socket = getSocket();
        let intervalId = null;

        const handlePoolJobsUpdated = (payload = {}) => {
            const eventCompanyId =
                payload?.companyId ||
                payload?.poolJob?.companyId ||
                payload?.job?.companyId;

            if (eventCompanyId && eventCompanyId !== user?.companyId) {
                return;
            }

            refetch?.();
        };

        const attachSocketListeners = (s) => {
            s.off("poolJob:updated", handlePoolJobsUpdated);
            s.off("poolJob:created", handlePoolJobsUpdated);
            s.off("poolJob:deleted", handlePoolJobsUpdated);
            s.off("bid:created", handlePoolJobsUpdated);
            s.off("bid:updated", handlePoolJobsUpdated);
            s.off("job:updated", handlePoolJobsUpdated);
            s.off("booking:updated", handlePoolJobsUpdated);

            s.on("poolJob:updated", handlePoolJobsUpdated);
            s.on("poolJob:created", handlePoolJobsUpdated);
            s.on("poolJob:deleted", handlePoolJobsUpdated);
            s.on("bid:created", handlePoolJobsUpdated);
            s.on("bid:updated", handlePoolJobsUpdated);
            s.on("job:updated", handlePoolJobsUpdated);
            s.on("booking:updated", handlePoolJobsUpdated);
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
                socket.off("poolJob:updated", handlePoolJobsUpdated);
                socket.off("poolJob:created", handlePoolJobsUpdated);
                socket.off("poolJob:deleted", handlePoolJobsUpdated);
                socket.off("bid:created", handlePoolJobsUpdated);
                socket.off("bid:updated", handlePoolJobsUpdated);
                socket.off("job:updated", handlePoolJobsUpdated);
                socket.off("booking:updated", handlePoolJobsUpdated);
            }
        };
    }, [user?.companyId, refetch]);

    useFocusEffect(
        useCallback(() => {
            isLoading && refetch();
        }, [])
    );

    const renderPoolJob = ({ item }) => {
        return (
            <PoolJobCard
                user={user}
                job={item}
                colors={colors}
                styles={styles}
                onBidPress={() => handleBidPress(item)}
            />
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.headerIcon}
                    onPress={handleBackPress}
                    hitSlop={{ top: 30, bottom: 30, left: 30, right: 30 }}
                >
                    <Icons.ArrowLeft size={26} color={colors.white} />
                </TouchableOpacity>

                <Text style={styles.headerTitle}>
                    Pool Jobs
                </Text>

                <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={refetch}
                    style={styles.headerIcon}
                >
                    <Icons.RefreshCcw size={24} color={colors.white} />
                </TouchableOpacity>
            </View>

            {isLoading ? (
                <View style={styles.loaderWrapper}>
                    <ActivityIndicator size="large" color={colors.bttonColor} />
                </View>
            ) : (
                <FlatList
                    data={poolJobs}
                    renderItem={renderPoolJob}
                    keyExtractor={(item, index) =>
                        item?._id?.toString() ||
                        item?.id?.toString() ||
                        index.toString()
                    }
                    contentContainerStyle={[
                        styles.listContent,
                        poolJobs.length === 0 && styles.emptyListContent,
                    ]}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing || isFetching}
                            onRefresh={onRefresh}
                        />
                    }
                    onEndReached={() => {
                        if (hasNextPage && !isFetchingNextPage) {
                            fetchNextPage();
                        }
                    }}
                    onEndReachedThreshold={0.5}
                    ListEmptyComponent={
                        <View style={styles.emptyWrapper}>
                            <Text style={styles.emptyTitle}>
                                No Pool Jobs Found
                            </Text>
                            <Text style={styles.emptyText}>
                                New pool jobs will appear here.
                            </Text>
                        </View>
                    }
                    ListFooterComponent={
                        isFetchingNextPage ? (
                            <View style={styles.footerLoader}>
                                <ActivityIndicator size="small" color={colors.bttonColor} />
                            </View>
                        ) : null
                    }
                    showsVerticalScrollIndicator={false}
                />
            )}

            <BidBottomSheet
                visible={showBidSheet}
                colors={colors}
                job={selectedPoolJob}
                user={user}
                isSubmitting={isPending}
                onClose={() => {
                    if (!isPending) {
                        setShowBidSheet(false);
                        setSelectedPoolJob(null);
                    }
                }}
                onSubmit={handleSubmitBid}
            />
        </View>
    );
};


const PoolJobCard = ({ job, colors, styles, onBidPress, user }) => {
    const myBid = job?.bids?.find(
        bid => bid?.bidder === user?._id
    );
    const isClosed = ["accepted", "completed", "cancelled"].includes(
        job?.status?.toLowerCase()
    );
    const formatPoolDateTime = (poolJob) => {
        if (!poolJob?.date) return { date: "-", time: "-" };

        const baseDate = new Date(poolJob.date);

        const hours = Number(poolJob.hour ?? 0)
            .toString()
            .padStart(2, "0");

        const minutes = Number(poolJob.minute ?? 0)
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

    const { date, time } = formatPoolDateTime(job);

    const vehicleDetails = job?.vehicleDetails || {};

    const hasValue = (value) => {
        return value !== undefined && value !== null && value !== "";
    };

    const getNumber = (value) => {
        return Number(value || 0);
    };

    const vehicleName = vehicleDetails?.vehicleName || job?.vehicle;

    const passenger = getNumber(vehicleDetails?.passenger);
    const checkinLuggage = getNumber(vehicleDetails?.checkinLuggage);
    const handLuggage = getNumber(vehicleDetails?.handLuggage);
    const babySeat = getNumber(vehicleDetails?.babySeat);
    const childSeat = getNumber(vehicleDetails?.childSeat || vehicleDetails?.carSeat);
    const boosterSeat = getNumber(vehicleDetails?.boosterSeat);

    const showVehicleInfo =
        hasValue(vehicleName) ||
        passenger > 0 ||
        checkinLuggage > 0 ||
        handLuggage > 0 ||
        babySeat > 0 ||
        childSeat > 0 ||
        boosterSeat > 0;

    return (
        <View
            style={[
                styles.card,
                {
                    backgroundColor: colors.white,
                    borderColor: colors.gray100,
                },
            ]}
        >
            <View style={[styles.cardTop, { backgroundColor: colors.gray100, flexDirection: "row", alignItems: "center", justifyContent: 'space-between' }]}>
                <Text style={[styles.bookingId, { color: colors.black, fontWeight: "700" }]}>
                    Pool Job ID: {job?.poolJobId || "N/A"}
                </Text>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
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
                </View>
            </View>

            <View style={styles.cardHeader}>
                <View style={{ flex: 1 }}>
                    <Text style={[styles.bookingId, { color: colors.black, fontWeight: "700" }]}>
                        Booking ID: {job?.bookingId || job?.poolJobId || "N/A"}
                    </Text>

                    <Text
                        numberOfLines={1}
                        ellipsizeMode="tail"
                        style={[styles.customerName, { color: colors.black }]}
                    >
                        {job?.passengerName || "Pool Job"}
                    </Text>
                </View>

                <TouchableOpacity
                    disabled={isClosed}
                    onPress={onBidPress}
                    style={[
                        styles.bidButton,
                        {
                            backgroundColor: colors.redBorder || colors.bttonColor,
                            opacity: isClosed ? 1 : 1,
                        },
                    ]}
                >
                    <Text style={styles.bidButtonText}>
                        {isClosed ? "Bidding Closed" : myBid ? "Update Bid" : "Bid For This Job"}
                    </Text>
                </TouchableOpacity>
            </View>

            <View style={styles.locationRow}>
                <Icons.MapPin size={18} color="#10B981" />
                <View style={styles.locationText}>
                    <Text style={[styles.label, { color: colors.gray400 }]}>
                        Pickup
                    </Text>
                    <Text style={[styles.value, { color: colors.text }]}>
                        {job?.pickup || "Pickup location"}
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
                        {job?.dropoff || "Dropoff location"}
                    </Text>
                </View>
            </View>

            {showVehicleInfo && (
                <View style={styles.vehicleInfoCard}>
                    <Text style={styles.vehicleSectionTitle}>
                        Vehicle & Passenger Info
                    </Text>

                    {hasValue(vehicleName) && (
                        <View style={styles.vehicleNameRow}>
                            <Icons.Car size={20} color={colors?.gray600} />
                            <Text
                                numberOfLines={1}
                                style={styles.vehicleNameText}
                            >
                                {vehicleName}
                            </Text>
                        </View>
                    )}

                    <View style={styles.vehicleStatsRow}>
                        <View style={styles.vehicleStatItem}>
                            <Icons.User size={16} color={colors?.gray100} />
                            <Text style={styles.vehicleStatLabel}>PAX</Text>
                            <Text style={styles.vehicleStatValue}>
                                {passenger}
                            </Text>
                        </View>

                        <View style={styles.vehicleStatItem}>
                            <Icons.Package size={16} color={colors?.gray100} />
                            <Text style={styles.vehicleStatLabel}>CHECK-IN</Text>
                            <Text style={styles.vehicleStatValue}>
                                {checkinLuggage}
                            </Text>
                        </View>

                        <View style={styles.vehicleStatItem}>
                            <Icons.Luggage size={16} color={colors?.gray100} />
                            <Text style={styles.vehicleStatLabel}>HAND</Text>
                            <Text style={styles.vehicleStatValue}>
                                {handLuggage}
                            </Text>
                        </View>

                        {babySeat > 0 && (
                            <View style={styles.vehicleStatItem}>
                                <Icons.Baby size={16} color={colors?.gray100} />
                                <Text style={styles.vehicleStatLabel}>BABY</Text>
                                <Text style={styles.vehicleStatValue}>
                                    {babySeat}
                                </Text>
                            </View>
                        )}

                        {childSeat > 0 && (
                            <View style={styles.vehicleStatItem}>
                                <Icons.Baby size={16} color={colors?.gray100} />
                                <Text style={styles.vehicleStatLabel}>CHILD</Text>
                                <Text style={styles.vehicleStatValue}>
                                    {childSeat}
                                </Text>
                            </View>
                        )}

                        {boosterSeat > 0 && (
                            <View style={styles.vehicleStatItem}>
                                <Icons.Baby size={16} color={colors?.gray100} />
                                <Text style={styles.vehicleStatLabel}>BOOSTER</Text>
                                <Text style={styles.vehicleStatValue}>
                                    {boosterSeat}
                                </Text>
                            </View>
                        )}
                    </View>
                </View>
            )}

            {job?.bids?.length > 0 && (
                <View style={styles.bidInfoBox}>
                    <Text style={styles.bidInfoText}>
                        {job.bids.length} bid{job.bids.length > 1 ? "s" : ""} placed
                    </Text>

                    {myBid?.editCount > 0 && (
                        <Text style={styles.editedText}>
                            Edited {myBid.editCount} time{myBid.editCount > 1 ? "s" : ""}
                        </Text>
                    )}
                </View>
            )}
        </View>
    );
};

export default PoolScreen;