import React, { useCallback, useMemo, useState } from "react";
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

        return data.pages.flatMap(page =>
            page?.jobs ||
            page?.poolJobs ||
            page?.data ||
            []
        );
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
            <View style={[styles.cardTop, { backgroundColor: colors.gray100 }]}>
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

                <View style={{ flex: 1 }} />

                {job?.vehicle && (
                    <View style={styles.footerBadge}>
                        <Text style={styles.footerBadgeText}>
                            {job.vehicle}
                        </Text>
                    </View>
                )}
            </View>

            <View style={styles.cardHeader}>
                <View style={{ flex: 1 }}>
                    <Text style={[styles.bookingId, { color: colors.black, fontWeight: "700" }]}>
                        Pool Job ID: {job?.poolJobId || "N/A"}
                    </Text>
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