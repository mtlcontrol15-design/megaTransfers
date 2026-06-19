import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Image, TextInput, Platform, KeyboardAvoidingView, Alert, ActivityIndicator } from "react-native";

import { useSelector } from "react-redux";
import { useTheme } from "@react-navigation/native";
import Clipboard from '@react-native-clipboard/clipboard'
import { GiftedChat, Bubble } from "react-native-gifted-chat";
import { moderateScale, scale } from "react-native-size-matters";

import getStyles from "./style";
import Icons from "../../assets/icons";
import { getSocket } from "../../services/socket";
import { EndPoints } from "../../services/EndPoints";
import { pickDocument } from '../../utils/documentPicker'
import { viewDocumentInApp } from '../../utils/document.utils'
import useQueryHandler from "../../services/queries/useQueryHandler";
import { mutationHandler } from "../../services/mutations/mutationHandler";
import { uploadDocumentToCloudinary } from '../../utils/documentUpload.utils'
import MessageOptionsModal from '../../components/MessageOptionsModal/MessageOptionsModal'

const ChatScreen = ({ navigation, route }) => {
    const { colors } = useTheme();
    const styles = getStyles(colors);

    const [inputHeight, setInputHeight] = useState(40);
    const [messages, setMessages] = useState([]);
    const [text, setText] = useState("");
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [editingMessageId, setEditingMessageId] = useState(null);
    const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
    const [isUploadingDocument, setIsUploadingDocument] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);

    const { user } = useSelector(state => state.userReducer)

    // console.log('======user is here', user);

    const { userId, name, role, partnerImage } = route?.params || {};

    // console.log('======partnerImage is here', partnerImage);


    const myId = user?._id;
    const receiverId = userId;
    const receiverImage = partnerImage;
    const receiverRole1 = role;

    const isFileUrl = (text) => {
        return text && (
            text.includes('cloudinary.com') ||
            text.includes('http') ||
            text.includes('.pdf') ||
            text.includes('.jpg') ||
            text.includes('.png') ||
            text.includes('.gif')
        );
    };

    const {
        data,
        refetch,
        status,
        isFetching,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useQueryHandler(`${EndPoints.getChatData}/${myId}/${receiverId}`, {
        queryParams: {
            page: 1,
            limit: 500,
        },
        useInfiniteQueryFlag: true,
    });

    // console.log('=======data is here conversations', data);

    const chatPartner =
        data?.pages?.[0]?.data?.chatPartner;

    const receiverName =
        chatPartner?.fullName || name || "User";

    const receiverPhoto =
        chatPartner?.profileImage || receiverImage || null;

    const receiverRole =
        chatPartner?.role || receiverRole1 || "";


    const apiMessages =
        data?.pages?.flatMap(page => page.data?.messages || []) || [];

    const formattedMessages = apiMessages.map(item => {
        let createdAt = new Date();
        if (item.timestamp) {
            const timestamp = new Date(item.timestamp);
            if (!isNaN(timestamp.getTime())) {
                createdAt = timestamp;
            }
        }

        const attachment = item?.attachments?.[0];
        let messageObj = {
            _id: item._id,
            text: item.text || "",
            createdAt,
            user: { _id: item.senderId },
            isDeleted: item.isDeleted,
        };

        if (attachment) {
            if (attachment.type?.includes("image")) {
                messageObj.image = attachment.url;
            } else if (attachment.type?.includes("pdf") || attachment.type?.includes("document")) {
                messageObj.file = attachment.url;
                messageObj.fileName = attachment.name || "Document";
            } else if (attachment.type?.includes("application")) {
                messageObj.file = attachment.url;
                messageObj.fileName = attachment.name || "File";
            }
        }

        return messageObj;
    });

    const sortedMessages = formattedMessages.sort(
        (a, b) => b.createdAt - a.createdAt
    );


    const firstLetter = receiverName?.charAt(0)?.toUpperCase();

    const { mutate, isPending, reset } = mutationHandler(
        EndPoints?.sendChatdata,
        null,
        (res) => {
            const msg = res?.data;
            const attachment = msg?.attachments?.[0];

            if (!msg.text && !attachment) return;

            const newMessage = {
                _id: msg._id,
                text: msg.text || "",
                createdAt: new Date(msg.timestamp),
                user: {
                    _id: msg.senderId,
                },
            };

            if (attachment) {
                if (attachment.type?.includes("image")) {
                    newMessage.image = attachment.url;
                } else if (attachment.type?.includes("pdf") || attachment.type?.includes("document") || attachment.type?.includes("application")) {
                    newMessage.file = attachment.url;
                    newMessage.fileName = attachment.name || "Document";
                }
            }
        }
    );

    const { mutate: deleteMutate } = mutationHandler(
        EndPoints?.deleteSingleMessage,
        null,
        (res) => {
            console.log('Message deleted:', res);
            applyDeletedMessage(res?.data);
        },
        (err) => {
            console.log('Delete error:', err);
        },
        "delete"
    );

    const { mutate: updateMutate } = mutationHandler(
        EndPoints?.updateMessage,
        null,
        (res) => {
            console.log('Message updated:', res);
        },
        (err) => {
            console.log('Update error:', err);
        },
        "put"
    );

    const handleOptionsPress = (message) => {
        setSelectedMessage(message);
        setModalVisible(true);
    };


    const handleImagePress = (message) => {
        const url = message?.image || message?.file || message?.text;
        if (url && isFileUrl(url)) {
            viewDocumentInApp(navigation, {
                url: url,
                title: "Document",
            });
        }
    };
    const socket = getSocket();

    const applyDeletedMessage = (deletedMessage) => {
        if (!deletedMessage?._id) return;

        const deletedSenderId =
            typeof deletedMessage.senderId === "object"
                ? deletedMessage.senderId?._id
                : deletedMessage.senderId;

        setMessages((prev) => {
            const exists = prev.some(
                (message) => String(message._id) === String(deletedMessage._id)
            );

            if (!exists) {
                return GiftedChat.append(prev, [{
                    _id: deletedMessage._id,
                    text: deletedMessage.text || "This message was deleted",
                    createdAt: new Date(deletedMessage.timestamp || Date.now()),
                    user: { _id: deletedSenderId },
                    isDeleted: true,
                }]);
            }

            return prev.map((message) => {
                if (String(message._id) !== String(deletedMessage._id)) {
                    return message;
                }

                return {
                    ...message,
                    text: deletedMessage.text || "This message was deleted",
                    isDeleted: true,
                    image: undefined,
                    file: undefined,
                    fileName: undefined,
                };
            });
        });
    };

    const handleSendMessage = (file = null) => {
        if (!text.trim() && !file) return;

        if (editingMessageId) {
            const payload = {
                messageId: editingMessageId,
                text: text.trim(),
            };

            socket.emit("chat:update", payload);

            updateMutate({
                __endpoint__: `${EndPoints.updateMessage}/${editingMessageId}`,
                text: text.trim(),
            });

            setMessages(prev =>
                prev.map(msg =>
                    msg._id === editingMessageId
                        ? { ...msg, text: text.trim(), isEdited: true }
                        : msg
                )
            );

            setEditingMessageId(null);
            setText("");
            return;
        };

        const tempId = "temp_" + Date.now();

        const messagePayload = {
            _id: tempId,
            senderId: myId,
            receiverId: receiverId,
            text: text.trim(), // ✅ caption
            timestamp: new Date(),
        };

        if (file) {
            messagePayload.file = file.url;
            messagePayload.fileName = file.name;
            messagePayload.attachmentType = file.type;
        }

        socket.emit("send_message", messagePayload);

        mutate({
            receiver: receiverId,
            text: messagePayload.text,
            ...(file && {
                attachmentUrl: file.url,
                attachmentType: file.type,
                attachmentName: file.name,
                attachmentSize: file.size,
            }),
        });

        // ✅ clear both
        setText("");
        setSelectedFile(null);
        setInputHeight(40);
    };


    const handlePickDocument = async () => {
        try {
            await pickDocument({
                type: "all",
                onSuccess: async (file) => {
                    try {
                        setIsUploadingDocument(true);

                        const fileUrl = await uploadDocumentToCloudinary(file);

                        // ✅ store file instead of sending
                        setSelectedFile({
                            url: fileUrl,
                            name: file.name,
                            type: file.type,
                            size: file.size,
                        });

                    } catch (err) {
                        Alert.alert("Upload Failed");
                    } finally {
                        setIsUploadingDocument(false);
                    }
                },
            });
        } catch (err) {
            console.log(err);
        }
    };
    const onSend = (newMessages = []) => {
        setMessages((previousMessages) =>
            GiftedChat.append(previousMessages, newMessages)
        );
    };


    const renderInputToolbar = (props) => {
        return (
            <View style={styles.inputContainer}>
                <View style={styles.bottomVu}>
                    <TextInput
                        style={[
                            styles.inputBox,
                            { height: Math.min(inputHeight, 100), color: colors.text },
                        ]}
                        placeholder={
                            selectedFile
                                ? "Add a caption (optional)..."
                                : editingMessageId
                                    ? "Edit message..."
                                    : "Message..."
                        }
                        placeholderTextColor={colors.primary}
                        multiline
                        onChangeText={setText}
                        value={text}
                        onContentSizeChange={(e) =>
                            setInputHeight(e.nativeEvent.contentSize.height)
                        }
                    />
                    <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={handlePickDocument}
                        disabled={isUploadingDocument}
                    >
                        <Icons.Paperclip
                            size={24}
                            color={isUploadingDocument ? colors.gray : colors.primary}
                        />
                    </TouchableOpacity>
                </View>

                <TouchableOpacity
                    style={styles.sendButton}
                    activeOpacity={0.7}
                    onPress={() => handleSendMessage(selectedFile)}
                    disabled={isUploadingDocument || isPending}
                >
                    <Icons.Send size={24} color={colors.white} />
                </TouchableOpacity>
            </View>
        );
    };

    useEffect(() => {
        if (sortedMessages.length > 0) {
            setMessages(sortedMessages);
        }
    }, [data]);

    useEffect(() => {
        const socket = getSocket();
        if (!socket || !myId || !receiverId) return;

        const handleIncomingMessage = (msg) => {
            const senderId =
                typeof msg.senderId === "object" ? msg.senderId?._id : msg.senderId;
            const recipientId =
                typeof msg.recipientId === "object" ? msg.recipientId?._id : msg.recipientId;

            const isCurrentChat =
                (String(senderId) === String(receiverId) && String(recipientId) === String(myId)) ||
                (String(senderId) === String(myId) && String(recipientId) === String(receiverId));

            if (!isCurrentChat) return;

            const attachment = msg?.attachments?.[0];

            const newMessage = {
                _id: msg._id,
                text: msg.text || "",
                createdAt: new Date(msg.timestamp || Date.now()),
                user: { _id: senderId },
            };

            if (attachment) {
                if (attachment.type?.includes("image")) {
                    newMessage.image = attachment.url;
                } else {
                    newMessage.file = attachment.url;
                    newMessage.fileName = attachment.name || "Document";
                }
            }

            setMessages((prev) => {
                // 🔥 remove temp message
                const filtered = prev.filter(
                    (m) => m._id !== msg.tempId // if you send tempId from frontend
                );

                const exists = prev.some(
                    (m) =>
                        String(m._id) === String(newMessage._id) ||
                        (m.text === newMessage.text &&
                            m.user._id === newMessage.user._id &&
                            Math.abs(new Date(m.createdAt) - new Date(newMessage.createdAt)) < 2000)
                );

                if (exists) return filtered;

                return GiftedChat.append(filtered, [newMessage]);
            });
        };

        const handleSentMessage = handleIncomingMessage;
        const handleDeletedMessage = (msg) => {
            const senderId =
                typeof msg.senderId === "object" ? msg.senderId?._id : msg.senderId;
            const recipientId =
                typeof msg.recipientId === "object" ? msg.recipientId?._id : msg.recipientId;

            const isCurrentChat =
                (String(senderId) === String(receiverId) && String(recipientId) === String(myId)) ||
                (String(senderId) === String(myId) && String(recipientId) === String(receiverId));

            if (!isCurrentChat) return;

            applyDeletedMessage(msg);
        };

        const handleUpdatedMessage = (updatedMsg) => {
            const senderId =
                typeof updatedMsg.senderId === "object"
                    ? updatedMsg.senderId?._id
                    : updatedMsg.senderId;

            const recipientId =
                typeof updatedMsg.recipientId === "object"
                    ? updatedMsg.recipientId?._id
                    : updatedMsg.recipientId;

            const isCurrentChat =
                (String(senderId) === String(receiverId) &&
                    String(recipientId) === String(myId)) ||
                (String(senderId) === String(myId) &&
                    String(recipientId) === String(receiverId));

            if (!isCurrentChat) return;

            setMessages(prev =>
                prev.map(msg =>
                    String(msg._id) === String(updatedMsg._id)
                        ? {
                            ...msg,
                            text: updatedMsg.text,
                            isEdited: true,
                        }
                        : msg
                )
            );
        };

        socket.emit("chat:viewing", receiverId);
        socket.emit("chat:history", receiverId);

        socket.on("chat:message", handleIncomingMessage);
        socket.on("chat:sent", handleSentMessage);
        socket.on("chat:delete", handleDeletedMessage);
        socket.on("chat:update", handleUpdatedMessage);
        socket.on("chat:error", console.log);

        return () => {
            socket.off("chat:message", handleIncomingMessage);
            socket.off("chat:sent", handleSentMessage);
            socket.off("chat:delete", handleDeletedMessage);
            socket.off("chat:update", handleUpdatedMessage);
            socket.off("chat:error", console.log);
        };
    }, [myId, receiverId]);

    const isMyMessage = (message) => {
        const senderId =
            typeof message?.user?._id === "object"
                ? message.user._id?._id
                : message?.user?._id;

        return String(senderId) === String(myId);
    };

    const previewMessage = selectedFile
        ? [{
            _id: "preview",
            text: text || "",
            createdAt: new Date(),
            user: { _id: myId },
            isPreview: true,
            ...(selectedFile.type?.includes("image")
                ? { image: selectedFile.url }
                : {
                    file: selectedFile.url,
                    fileName: selectedFile.name,
                }),
        }]
        : [];


    return (
        <>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
                style={{ flex: 1 }}
            >
                <View style={{ flex: 1, backgroundColor: colors.white }}>
                    <View style={styles.header}>
                        {/* <View style={{ width: scale(22) }} /> */}
                        {receiverPhoto ? (
                            <Image
                                source={{ uri: receiverPhoto }}
                                style={styles.profileImage}
                            />
                        ) : (
                            <View style={styles.avatarPlaceholder}>
                                <Text style={styles.avatarText}>{firstLetter}</Text>
                            </View>
                        )}
                        <View style={styles.headerCenter}>
                            <View style={styles.userInfo}>
                                <Text ellipsizeMode="tail" numberOfLines={1} style={[styles.userName, { width: scale(140) }]}>{receiverName}</Text>
                            </View>
                            <View style={styles.userInfo}>
                                <Text ellipsizeMode="tail" numberOfLines={1} style={[styles.userName, { width: scale(90) }]}>({receiverRole})</Text>
                            </View>
                        </View>
                        <TouchableOpacity onPress={() => navigation.goBack()}>
                            <Icons.X size={22} color={colors.white} />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.chatContainer}>
                        <GiftedChat
                            messages={[...previewMessage, ...messages]} // ✅ important
                            onSend={onSend}
                            user={{ _id: myId }}
                            alwaysShowSend={true}
                            renderInputToolbar={renderInputToolbar}
                            inverted={true}
                            keyboardShouldPersistTaps="handled"
                            listViewProps={{
                                keyboardDismissMode: "on-drag",
                                keyboardShouldPersistTaps: "handled",
                                contentContainerStyle: { flexGrow: 1 },
                            }}
                            bottomOffset={Platform.OS === "ios" ? 4 : 0}
                            renderBubble={(props) => {
                                const message = props.currentMessage;
                                const isDeleted = message?.isDeleted;
                                const isMineMessage = isMyMessage(message);
                                const rowStyle = {
                                    flexDirection: "row",
                                    alignItems: "center",
                                    marginVertical: 4,
                                    justifyContent: isMineMessage ? "flex-end" : "flex-start",
                                };

                                const renderOptionsButton = () => {
                                    if (!isMineMessage || isDeleted || message?.isPreview) return null;
                                    return (
                                        <TouchableOpacity
                                            style={{ paddingHorizontal: moderateScale(6), marginLeft: 6 }}
                                            onPress={(event) => {
                                                const { pageX, pageY } = event.nativeEvent;
                                                setMenuPosition({ x: pageX - 150, y: pageY - 20 });
                                                handleOptionsPress(message);
                                            }}
                                        >
                                            <Text style={{ fontSize: moderateScale(20), color: colors.black }}>⋮</Text>
                                        </TouchableOpacity>
                                    );
                                };

                                if (message?.isLoading) {
                                    return (
                                        <View style={rowStyle}>
                                            <View style={{
                                                backgroundColor: colors.primary,
                                                borderRadius: 16,
                                                paddingHorizontal: 15,
                                                paddingVertical: 10,
                                                marginRight: 10,
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                minHeight: 44,
                                            }}>
                                                <ActivityIndicator size="small" color={colors.white} />
                                            </View>
                                            {renderOptionsButton()}
                                        </View>
                                    );
                                }

                                if (message?.image && !message?.isDeleted) {
                                    const isPreview = message?.isPreview;

                                    return (
                                        <View style={rowStyle}>
                                            <View>
                                                <View style={{ position: "relative" }}>
                                                    {isPreview && (
                                                        <TouchableOpacity
                                                            onPress={() => setSelectedFile(null)}
                                                            style={{
                                                                position: "absolute",
                                                                top: -6,
                                                                right: -6,
                                                                zIndex: 10,
                                                                backgroundColor: "red",
                                                                borderRadius: 12,
                                                                padding: 4,
                                                            }}
                                                        >
                                                            <Icons.X size={12} color="#fff" />
                                                        </TouchableOpacity>
                                                    )}

                                                    <TouchableOpacity onPress={() => handleImagePress(message)}>
                                                        <Image
                                                            source={{ uri: message.image }}
                                                            style={{
                                                                width: 150,
                                                                height: 150,
                                                                borderRadius: 12,
                                                                marginRight: 10,
                                                            }}
                                                        />
                                                    </TouchableOpacity>
                                                </View>

                                                {!!message.text && (
                                                    <View style={{ marginTop: 4, backgroundColor: isDeleted ? colors.gray200 : colors.primary, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 }}>
                                                        <Text
                                                            style={{
                                                                color: colors.white,
                                                                fontSize: moderateScale(13),
                                                            }}
                                                        >
                                                            {message.text}
                                                        </Text>
                                                    </View>
                                                )}
                                            </View>
                                            {renderOptionsButton()}
                                        </View>
                                    );
                                }

                                if (message?.file && !message?.isDeleted) {
                                    const isPreview = message?.isPreview;

                                    return (
                                        <View style={rowStyle}>
                                            <View>
                                                <View style={{ position: "relative" }}>
                                                    {isPreview && (
                                                        <TouchableOpacity
                                                            onPress={() => setSelectedFile(null)}
                                                            style={{
                                                                position: "absolute",
                                                                top: -6,
                                                                right: -6,
                                                                zIndex: 10,
                                                                backgroundColor: "red",
                                                                borderRadius: 12,
                                                                padding: 4,
                                                            }}
                                                        >
                                                            <Icons.X size={12} color="#fff" />
                                                        </TouchableOpacity>
                                                    )}

                                                    <TouchableOpacity
                                                        onPress={() => handleImagePress(message)}
                                                        style={{
                                                            width: 140,
                                                            height: 120,
                                                            backgroundColor: colors.primary,
                                                            borderRadius: 12,
                                                            justifyContent: 'center',
                                                            alignItems: 'center',
                                                            marginRight: 10,
                                                            padding: 10,
                                                        }}
                                                    >
                                                        <Text style={{ fontSize: 40 }}>📄</Text>

                                                        <Text
                                                            style={{
                                                                color: colors.white,
                                                                fontSize: 12,
                                                                marginTop: 5,
                                                                textAlign: 'center',
                                                            }}
                                                            numberOfLines={2}
                                                        >
                                                            {message.fileName || "View File"}
                                                        </Text>
                                                    </TouchableOpacity>
                                                </View>

                                                {!!message.text && (
                                                    <View style={{ marginTop: 4, backgroundColor: isDeleted ? colors.gray200 : colors.primary, padding: 6, borderRadius: 8 }}>
                                                        <Text
                                                            style={{
                                                                color: colors.text,
                                                                fontSize: moderateScale(13),
                                                            }}
                                                        >
                                                            {message.text}
                                                        </Text>
                                                    </View>
                                                )}
                                            </View>
                                            {renderOptionsButton()}
                                        </View>
                                    );
                                }

                                return (
                                    <View style={rowStyle}>
                                        <Bubble
                                            {...props}
                                            wrapperStyle={{
                                                right: {
                                                    backgroundColor: isDeleted
                                                        ? colors.gray200
                                                        : colors.primary,
                                                    borderRadius: 16,
                                                    paddingHorizontal: 10,
                                                    paddingVertical: 6,
                                                    marginRight: 10,
                                                },
                                                left: {
                                                    backgroundColor: isDeleted
                                                        ? colors.gray100
                                                        : colors.secondary,
                                                    borderRadius: 16,
                                                    paddingHorizontal: 10,
                                                    paddingVertical: 6,
                                                    marginRight: 10,
                                                },
                                            }}
                                            textStyle={{
                                                right: {
                                                    color: isDeleted ? colors.gray : colors.white,
                                                    fontStyle: isDeleted ? "italic" : "normal",
                                                },
                                                left: {
                                                    color: isDeleted ? colors.gray : colors.white,
                                                    fontStyle: isDeleted ? "italic" : "normal",
                                                },
                                            }}
                                            timeTextStyle={{
                                                right: { color: colors.white },
                                                left: { color: colors.black },
                                            }}
                                        />
                                        {renderOptionsButton()}
                                    </View>
                                );
                            }}
                        />
                    </View>

                </View>
            </KeyboardAvoidingView>
            <MessageOptionsModal
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                position={menuPosition}
                onCopy={() => {
                    if (selectedMessage?.text) Clipboard.setString(selectedMessage.text);
                    setModalVisible(false);
                }}
                onEdit={() => {
                    setText(selectedMessage?.text || "");
                    setEditingMessageId(selectedMessage?._id);
                    setModalVisible(false);
                }}
                onDelete={() => {
                    Alert.alert(
                        "Delete Message",
                        "Are you sure you want to delete this message?",
                        [
                            { text: "Cancel", style: "cancel" },
                            {
                                text: "Delete",
                                style: "destructive",
                                onPress: () => {
                                    deleteMutate({
                                        __endpoint__: `${EndPoints?.deleteSingleMessage}/${selectedMessage?._id}`,
                                    });
                                    setModalVisible(false);
                                },
                            },
                        ],
                        { cancelable: true }
                    );
                }}
            />
        </>
    );
};

export default ChatScreen;
