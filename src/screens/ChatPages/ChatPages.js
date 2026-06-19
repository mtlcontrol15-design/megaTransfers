import { useCallback, useState } from "react";
import { View, FlatList, Text, Image, TouchableOpacity, TextInput, Alert } from "react-native";

import { useSelector } from "react-redux";
import { moderateScale } from "react-native-size-matters";
import { useTheme, useNavigation, useFocusEffect } from "@react-navigation/native";

import getStyles from "./style";
import Icons from "../../assets/icons";
import { EndPoints } from "../../services/EndPoints";
import queryHandler from "../../services/queries/queryHandler";
import useQueryHandler from "../../services/queries/useQueryHandler";
import { markMessagesAsRead } from "../../services/chats/markRead.service";
import CommonConfirmModal from "../../components/CommonConfirmModal/CommonConfirmModal";
import { mutationHandler } from "../../services/mutations/mutationHandler";

const ChatPagesScreen = () => {
    const { colors } = useTheme();
    const styles = getStyles(colors);
    const navigation = useNavigation();

    const [search, setSearch] = useState("");
    const [showAdmins, setShowAdmins] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedChat, setSelectedChat] = useState(null);

    const { user } = useSelector(state => state.userReducer)


    const {
        data,
        refetch,
        status,
        isFetching,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useQueryHandler(EndPoints.getChatLists, {
        queryParams: {
            page: 1,
            limit: 5,
        },
        useInfiniteQueryFlag: true,
    });

    // console.log('======data is here conversations', data);

    const {
        data: usersListData,
        refetch: usersListRefetch,
        status: usersListStatus,
        isFetching: usersListIsFetching,
        fetchNextPage: usersListFetchNextPage,
        hasNextPage: usersListHasNextPage,
        isFetchingNextPage: usersListIsFetchingNextPage,
    } = useQueryHandler(EndPoints.getChatUsers, {
        queryParams: {
            page: 1,
            limit: 5,
        },
        useInfiniteQueryFlag: true,
    });

    // console.log('========users list data is here', usersListData);

    const { data: unReadData, error: unReadDataError, status: unReadDataStatus, isFetching: unReadDataIsFetching, refetch: unReadDataRefetch } = queryHandler(EndPoints.getUnReadChatData);

    // console.log('========un read data is here', unReadData);

    const { mutate: deleteHistory } = mutationHandler(
        EndPoints?.clearHistory,
        null,
        (res) => {
            console.log('History cleared:', res);
            refetch();
            usersListRefetch();
            unReadDataRefetch();
        },
        (err) => {
            console.log('Delete error:', err);
        },
        "delete"
    );

    const handleMarkRead = async (userId) => {
        try {
            await markMessagesAsRead(userId);
        } catch (error) {
            console.log("Error marking messages as read:", error);
        }
    };

    const formatChatTime = (timestamp) => {
        if (!timestamp) return "";

        const date = new Date(timestamp);
        const now = new Date();

        const isToday =
            date.getDate() === now.getDate() &&
            date.getMonth() === now.getMonth() &&
            date.getFullYear() === now.getFullYear();

        const time = date.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
        });

        if (isToday) {
            return `Today, ${time}`;
        }

        const formattedDate = date.toLocaleDateString([], {
            day: "2-digit",
            month: "short",
        });

        return `${formattedDate}, ${time}`;
    };

    const conversationUsers = data?.pages?.flatMap(page => page.data || []) || [];

    const myId = user?._id;

    const filteredMessages = conversationUsers.filter(item =>
        item.recipientId &&
        (item.senderId === myId || item.recipientId === myId)
    );

    const groupedChats = {};

    filteredMessages.forEach(item => {
        const otherUserId =
            item.senderId === myId ? item.recipientId : item.senderId;

        if (!groupedChats[otherUserId]) {
            groupedChats[otherUserId] = item;
        } else {
            if (new Date(item.timestamp) > new Date(groupedChats[otherUserId].timestamp)) {
                groupedChats[otherUserId] = item;
            }
        }
    });

    const unreadMap = unReadData?.data || {};

    const chats = Object.values(groupedChats)
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        .map(item => {
            const otherUserId =
                item.senderId === myId ? item.recipientId : item.senderId;

            const attachment = item?.attachments?.[0];

            return {
                id: otherUserId,
                name: item.senderUsername || "Unknown",
                recipientName: item.chatPartnerName || "Unknown",

                message: attachment
                    ? attachment.name || "File"
                    : item.text || "",

                originalText: item.text || "",

                time: formatChatTime(item.timestamp),

                unread: unreadMap[otherUserId] || 0,

                role: item?.chatPartnerRole,
                image: item?.chatPartnerProfileImage,
            };
        });

    const adminUsersRaw = usersListData?.pages?.flatMap(page => page.users || []) || [];

    // console.log('=======admin users are here', adminUsersRaw);
    // console.log('=======chats are here', chats);


    const adminUsers = adminUsersRaw.map(item => ({
        id: item._id,
        name: item.fullName && item.fullName !== "undefined undefined"
            ? item.fullName
            : item.email,

        recipientName: item.fullName && item.fullName !== "undefined undefined"
            ? item.fullName
            : item.email,

        message: item.email,
        time: "",
        unread: 0,
        role: item.role,
        image: item.profileImage || null,
    }));

    const activeData = showAdmins ? adminUsers : chats;

    const filteredChats = activeData.filter(chat =>
        chat.recipientName?.toLowerCase().includes(search.toLowerCase())
    );

    // console.log('=======filtered chats are here', filteredChats);

    filteredMessages.forEach(item => {
        const otherUserId =
            item.senderId === myId ? item.recipientId : item.senderId;

        if (!groupedChats[otherUserId]) {
            groupedChats[otherUserId] = item;
        } else {

            if (new Date(item.timestamp) > new Date(groupedChats[otherUserId].timestamp)) {
                groupedChats[otherUserId] = item;
            }
        }
    });


    const handlePress = (item) => {
        // console.log('=========chatPartner is here',item);

        const text = item.originalText?.toLowerCase() || "";

        const isClosedBooking =
            text.includes("status: completed") ||
            text.includes("status: late cancel") ||
            text.includes("status: no show") ||
            text.includes("status: rejected");

        const currentRole = user?.role;
        const partnerRole = item?.role;

        const restrictedRoles = ["driver", "customer", "corporate"];

        const shouldRestrict =
            isClosedBooking &&
            restrictedRoles.includes(currentRole) &&
            restrictedRoles.includes(partnerRole);

        if (shouldRestrict) {
            Alert.alert(
                "Chat Closed",
                "This booking is closed and messaging is no longer available."
            );
            return;
        }

        handleMarkRead(item.id);

        navigation.navigate("Chat", {
            userId: item.id,
            name: item?.recipientName,
            role: item.role,
            partnerImage: item?.image,
        });
    };

    const renderItem = ({ item }) => {

        // console.log('======== item is here',item);


        const firstLetter = item.recipientName?.charAt(0)?.toUpperCase();

        return (
            <TouchableOpacity
                style={styles.chatItem}
                onPress={() => handlePress(item)}
            >
                {item.image ? (
                    <Image source={{ uri: item.image }} style={styles.avatar} />
                ) : (
                    <View style={styles.avatarPlaceholder}>
                        <Text style={styles.avatarText}>{firstLetter}</Text>
                    </View>
                )}

                <View style={styles.chatInfo}>
                    <View style={styles.topRow}>
                        <Text numberOfLines={1} ellipsizeMode="tail" style={styles.name}>{item.recipientName}</Text>
                        <Text>({item?.role})</Text>
                    </View>

                    <View style={styles.bottomRow}>
                        <Text style={styles.message} numberOfLines={1}>
                            {item.message}
                        </Text>
                        <Text style={styles.time}>{item.time}</Text>

                        {item.unread > 0 && (
                            <View style={styles.unreadBadge}>
                                <Text style={styles.unreadText}>
                                    {item.unread > 99 ? "99+" : item.unread}
                                </Text>
                            </View>
                        )}
                    </View>
                </View>
                <TouchableOpacity
                    onPress={() => {
                        setSelectedChat(item);
                        setModalVisible(true);
                    }}
                    style={{
                        width: 30,
                        height: 30,
                        marginLeft: 0,
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <Text
                        style={{
                            fontSize: moderateScale(18),
                            color: colors.black,
                        }}
                    >
                        ⋮
                    </Text>
                </TouchableOpacity>
            </TouchableOpacity>
        );
    };

    useFocusEffect(
        useCallback(() => {

            refetch();
            usersListRefetch();
            unReadDataRefetch();
        }, [])
    );

    return (
        <View style={{ flex: 1, backgroundColor: colors.white }}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Icons.X size={28} color={colors.white} />
                </TouchableOpacity>

                <Text style={styles.headerTitle}>
                    Participants ({filteredChats.length})
                </Text>
                <View style={{ width: 22 }} />
            </View>

            <View style={styles.searchContainer}>
                <Icons.Search size={16} color={colors.lightText} />

                <TextInput
                    placeholder="Search chats..."
                    placeholderTextColor={colors.lightText}
                    value={search}
                    onChangeText={setSearch}
                    style={styles.searchInput}
                />
            </View>


            <View style={{ flexDirection: "row", paddingHorizontal: 10, marginBottom: 10 }}>

                <View style={styles.tabContainer}>

                    <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => setShowAdmins(false)}
                        style={[
                            styles.tabButton,
                            !showAdmins && styles.activeTab
                        ]}
                    >
                        <Text style={[
                            styles.tabText,
                            !showAdmins && styles.activeTabText
                        ]}>
                            Chats
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => setShowAdmins(true)}
                        style={[
                            styles.tabButton,
                            showAdmins && styles.activeTab
                        ]}
                    >
                        <Text style={[
                            styles.tabText,
                            showAdmins && styles.activeTabText
                        ]}>
                            New Users
                        </Text>
                    </TouchableOpacity>

                </View>

            </View>

            <FlatList
                data={filteredChats}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                showsVerticalScrollIndicator={false}

                ListEmptyComponent={() => (
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>
                            {showAdmins ? "No New Users Found" : "No Chats Found"}
                        </Text>
                    </View>
                )}

                onEndReached={() => {
                    if (showAdmins) {
                        if (usersListHasNextPage && !usersListIsFetchingNextPage) {
                            usersListFetchNextPage();
                        }
                    } else {
                        if (hasNextPage && !isFetchingNextPage) {
                            fetchNextPage();
                        }
                    }
                }}

                onEndReachedThreshold={0.5}
            />
            <CommonConfirmModal
                visible={modalVisible}
                title="Clear Chat"
                description="Are you sure you want to clear this chat history?"
                confirmText="Clear"
                onCancel={() => setModalVisible(false)}
                onConfirm={() => {
                    deleteHistory({
                        __endpoint__: `${EndPoints?.clearHistory}/${selectedChat?.id}`,
                    });

                    setModalVisible(false);
                }}
            />
        </View>
    );
};

export default ChatPagesScreen;