// MessageOptionsModal.js
import React from "react";
import { Modal, View, Text, TouchableOpacity, Pressable, Dimensions } from "react-native";
import { moderateScale } from "react-native-size-matters";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

const MessageOptionsModal = ({
    visible,
    onClose,
    onCopy,
    onEdit,
    onDelete,
    position
}) => {
    const left = position?.x != null ? Math.min(Math.max(position.x, 10), SCREEN_WIDTH - 170) : 20;
    const top = position?.y != null ? Math.min(Math.max(position.y, 10), SCREEN_HEIGHT - 180) : 100;

    return (
        <Modal
            transparent
            visible={visible}
            animationType="fade"
            onRequestClose={onClose}
        >
            <Pressable
                style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.2)" }}
                onPress={onClose}
            >
                <View
                    style={{
                        position: "absolute",
                        top,
                        left,
                        width: 150,
                        backgroundColor: "#fff",
                        borderRadius: 8,
                        paddingVertical: 10,
                        elevation: 5,
                        shadowColor: "#000",
                        shadowOpacity: 0.2,
                        shadowRadius: 6,
                    }}
                >
                    <TouchableOpacity onPress={onCopy}>
                        <Text style={{ fontSize: moderateScale(16), padding: 10 }}>Copy</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={onEdit}>
                        <Text style={{ fontSize: moderateScale(16), padding: 10 }}>Edit</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={onDelete}>
                        <Text style={{ fontSize: moderateScale(16), padding: 10, color: "red" }}>
                            Delete
                        </Text>
                    </TouchableOpacity>
                </View>
            </Pressable>
        </Modal>
    );
};

export default MessageOptionsModal;