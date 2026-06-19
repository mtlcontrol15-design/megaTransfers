import { useState } from "react";
import { View, Text, FlatList, TouchableOpacity, Alert } from "react-native";

import { useSelector } from "react-redux";
import { useTheme } from "@react-navigation/native";

import getStyles from "./style";
import Icons from "../../assets/icons";
import { EndPoints } from "../../services/EndPoints";
import useQueryHandler from "../../services/queries/useQueryHandler";
import { mutationHandler } from "../../services/mutations/mutationHandler";

const NotificationScreen = ({ navigation }) => {
  const { colors } = useTheme();
  const styles = getStyles(colors);

  const [selectedNotification, setSelectedNotification] = useState(null);

  const { user, token } = useSelector(state => state.userReducer)

  const notificationId =
    user?.role === "driver"
      ? user?.employeeNumber
      : user?._id;
  const {
    data,
    refetch,
    status,
    isFetching,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useQueryHandler(`${EndPoints?.getNotifications}/${notificationId}`, {
    queryParams: {
      page: 1,
      limit: 50,
    },
    useInfiniteQueryFlag: true,
  });

  // console.log('======notification data is here', data);
  // console.log("hasNextPage:", hasNextPage);

  const notificationsData =
    data?.pages?.flatMap(page => page) ?? [];

  const notificationList = notificationsData;

  const { mutate: readNotificationMutate } = mutationHandler(
    `${EndPoints.readSingleNotification}/${selectedNotification?._id}`,
    null,
    (res) => {
      refetch();
    },
    (err) => {
      console.log('Notification read error:', err);
    },
    "patch"
  );

  const { mutate: deleteNotificationMutate } = mutationHandler(
    `${EndPoints.deleteSingleNotification}/${selectedNotification?._id}`,
    null,
    (res) => {
      refetch();
    },
    (err) => {
      console.log('Notification delete error:', err);
    },
    "delete"
  );

  const { mutate: readAllNotificationsMutate } = mutationHandler(
    `${EndPoints.readAllNotification}/${notificationId}`,
    null,
    (res) => {
      refetch();
    },
    (err) => {
      console.log('All notifications read error:', err);
    },
    "patch"
  );

  const { mutate: clearNotificationsMutate } = mutationHandler(
    `${EndPoints.clearNotifications}/${notificationId}`,
    null,
    (res) => {
      console.log('All notifications cleared:', res);
      refetch();
    },
    (err) => {
      console.log('All notifications clear error:', err);
    },
    "delete"
  );

  const markAllRead = () => {
    Alert.alert(
      "Mark All as Read",
      "Are you sure you want to mark all notifications as read?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Yes",
          onPress: () => {
            readAllNotificationsMutate();
          },
        },
      ]
    );
  };

  const deleteNotification = (item) => {
    Alert.alert(
      "Delete Notification",
      "Are you sure you want to delete this notification?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Yes",
          onPress: () => {
            setSelectedNotification(item);

            setTimeout(() => {
              deleteNotificationMutate();
            }, 0);
          },
        },
      ]
    );
  };

  const clearAll = () => {
    Alert.alert(
      "Clear Notification History",
      "Are you sure you want to clear all notifications?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear",
          onPress: () => {
            clearNotificationsMutate();
          },
        },
      ]
    );
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => {
        setSelectedNotification(item);
        setTimeout(() => {
          readNotificationMutate();
        }, 0);
      }}
      activeOpacity={0.8}
      style={[
        styles.card,
        {
          backgroundColor: item.isRead
            ? colors.white
            : colors.gray100,
        },
      ]}
    >
      <View style={styles.iconContainer}>
        <Icons.Bell size={20} color={colors.white} />
      </View>

      <View style={styles.textContainer}>
        <Text style={styles.title}>
          Booking #{item.bookingId}
        </Text>

        <Text style={styles.message}>
          {item.status}
        </Text>

        <Text style={styles.message}>
          {item.primaryJourney?.pickup} → {item.primaryJourney?.dropoff}
        </Text>

        <Text style={styles.time}>
          {new Date(item.bookingSentAt).toLocaleString()}
        </Text>
      </View>
      <TouchableOpacity onPress={() => deleteNotification(item)}>
        <Icons.Trash2 size={20} color="#EF4444" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1, backgroundColor: colors.white }}>

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icons.X size={28} color={colors.white} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>
          Notification ({notificationList.length})
        </Text>

        <TouchableOpacity onPress={markAllRead}>
          <Text style={styles.readAll}>Read All</Text>
        </TouchableOpacity>
      </View>

      {notificationList.length > 0 && (
        <View style={styles.actionBar}>
          <TouchableOpacity onPress={clearAll}>
            <Text style={styles.clearText}>Clear History</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.midContainer}>
        <FlatList
          data={notificationList}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ padding: 16, }}

          refreshing={isFetching}
          onRefresh={refetch}

          onEndReached={() => {
            if (hasNextPage) {
              fetchNextPage();
            }
          }}
          onEndReachedThreshold={0.5}

          ListFooterComponent={() =>
            isFetchingNextPage ? <Text>Loading more...</Text> : null
          }

          ListEmptyComponent={() => (
            <View style={styles.emptyContainer}>
              <Icons.Bell size={40} color={colors.gray300} />
              <Text style={styles.emptyText}>No Notifications</Text>
            </View>
          )}
        />
      </View>
    </View>
  );
};

export default NotificationScreen;