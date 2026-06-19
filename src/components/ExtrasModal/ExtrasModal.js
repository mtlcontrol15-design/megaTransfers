import React, { useState } from "react";
import {
    View,
    Text,
    Modal,
    TextInput,
    TouchableOpacity,
    ScrollView,
    Alert,
    Image,
    ActivityIndicator,
} from "react-native";
import { useTheme } from "@react-navigation/native";
import { moderateScale, verticalScale } from "react-native-size-matters";
import getStyles from "./style";
import Icons from "../../assets/icons";
import { uploadImageToBackend } from "../../utils/imageUpload.utils";
import { requestCameraPermission } from "../../utils/cameraPermissions";
import {
    launchCamera,
    launchImageLibrary,
} from "react-native-image-picker";

const ExtrasModal = ({ visible, setVisible, onComplete, paymentMethod,
}) => {
    const { colors } = useTheme();
    const styles = getStyles(colors);

    const [tolls, setTolls] = useState("");
    const [notes, setNotes] = useState("");
    const [extras, setExtras] = useState("");
    const [file, setFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [previewVisible, setPreviewVisible] = useState(false);
    const [cashToCollect, setCashToCollect] = useState("");

    const resetForm = () => {
        setTolls("");
        setNotes("");
        setExtras("");
        setFile(null);
        setCashToCollect("");

    };

    const handleSubmit = () => {

        const isCashPayment =
            paymentMethod?.toLowerCase() === "cash";

        if (
            isCashPayment &&
            !cashToCollect?.trim()
        ) {
            Alert.alert(
                "Cash Required",
                "Please enter cash to collect."
            );

            return;
        }

        onComplete({
            tolls: tolls || "",
            driverNotes: notes || "",
            extras: extras || "",
            cash: cashToCollect || 0,
            completionReceipt: file || null,
        });

        resetForm();

        setVisible(false);
    };

    const validateImageSize = (image) => {

        const sizeInMB =
            image?.fileSize / (1024 * 1024);

        return sizeInMB <= 5;
    };

    const handleUploadReceipt = () => {

        Alert.alert(
            "Upload Receipt",
            "Choose an option",
            [
                {
                    text: "Camera",
                    onPress: async () => {

                        try {

                            const hasPermission =
                                await requestCameraPermission();

                            if (!hasPermission) {

                                Alert.alert(
                                    "Permission Required",
                                    "Camera permission is required"
                                );

                                return;
                            }

                            const result = await launchCamera({
                                mediaType: "photo",
                                quality: 0.5,
                                maxWidth: 1200,
                                maxHeight: 1200,
                            });

                            const image = result?.assets?.[0];

                            if (!image?.uri) return;

                            if (!validateImageSize(image)) {

                                Alert.alert(
                                    "Large Image",
                                    "Please select image smaller than 5MB"
                                );

                                return;
                            }

                            setIsUploading(true);

                            const imageUrl =
                                await uploadImageToBackend(image);

                            setFile(imageUrl);

                        } catch (error) {

                            console.log(
                                "Camera Upload Error:",
                                error
                            );

                        } finally {

                            setIsUploading(false);
                        }
                    },
                },

                {
                    text: "Gallery",
                    onPress: async () => {

                        try {

                            const result =
                                await launchImageLibrary({
                                    mediaType: "photo",
                                    quality: 0.8,
                                });

                            const image =
                                result?.assets?.[0];

                            if (!image?.uri) return;

                            setIsUploading(true);

                            const imageUrl =
                                await uploadImageToBackend(image);

                            setFile(imageUrl);

                        } catch (error) {

                            console.log(
                                "Gallery Upload Error:",
                                error
                            );

                        } finally {

                            setIsUploading(false);
                        }
                    },
                },

                {
                    text: "Cancel",
                    style: "cancel",
                },
            ]
        );
    };


    return (
        <Modal
            visible={visible}
            transparent
            animationType="slide"
            onRequestClose={() => setVisible(false)}
        >
            <View style={styles.overlay}>
                <View style={styles.modalContainer}>

                    <View style={[styles.header, { backgroundColor: colors.primary }]}>
                        <Text style={styles.title}>Add Extras</Text>

                        <TouchableOpacity
                            onPress={() => {
                                resetForm();
                                setVisible(false);
                            }}
                        >
                            <Icons.X size={moderateScale(22)} color={colors.white} />
                        </TouchableOpacity>
                    </View>

                    {/* ✅ Content */}
                    <ScrollView style={styles.content}>

                        {/* Tolls */}
                        <Text style={styles.label}>Tolls (Optional)</Text>
                        <TextInput
                            value={tolls}
                            onChangeText={setTolls}
                            placeholder="Enter toll charges (e.g. 500)"
                            placeholderTextColor={colors.lightText}
                            keyboardType="numeric"
                            style={styles.input}
                        />

                        {paymentMethod?.toLowerCase() === "cash" && (
                            <>
                                <Text style={styles.label}>
                                    Cash To Collect *
                                </Text>

                                <TextInput
                                    value={cashToCollect}
                                    onChangeText={setCashToCollect}
                                    placeholder="Enter cash amount"
                                    placeholderTextColor={colors.lightText}
                                    keyboardType="numeric"
                                    style={styles.input}
                                    maxLength={6}
                                />
                            </>
                        )}

                        {/* Extras */}
                        {/* <Text style={styles.label}>Extras (Optional)</Text>
                        <TextInput
                            value={extras}
                            onChangeText={setExtras}
                            placeholder="Extra charges (waiting, parking, etc.)"
                            placeholderTextColor={colors.lightText}
                            style={styles.input}
                        /> */}

                        {/* Notes */}
                        <Text style={styles.label}>Notes (Optional)</Text>
                        <TextInput
                            value={notes}
                            onChangeText={setNotes}
                            placeholder="Add any notes for this booking..."
                            placeholderTextColor={colors.lightText}
                            multiline
                            style={[styles.input, { height: verticalScale(80) }]}
                        />

                        {/* File Upload */}
                        <Text style={styles.label}>Upload Receipt (Optional)</Text>
                        <TouchableOpacity
                            style={styles.uploadBox}
                            onPress={() => {

                                if (file) {

                                    setPreviewVisible(true);

                                } else {

                                    handleUploadReceipt();
                                }
                            }}
                        >

                            {isUploading ? (

                                <ActivityIndicator
                                    size="small"
                                    color={colors.primary}
                                />

                            ) : file ? (

                                <Image
                                    source={{ uri: file }}
                                    style={{
                                        width: moderateScale(70),
                                        height: moderateScale(70),
                                        borderRadius: moderateScale(10),
                                    }}
                                />

                            ) : (

                                <Icons.Navigation
                                    size={18}
                                    color={colors.primary}
                                />
                            )}

                            <Text style={styles.uploadText}>

                                {isUploading
                                    ? "Uploading..."
                                    : file
                                        ? "Tap to view receipt"
                                        : "Tap to upload receipt"}

                            </Text>

                        </TouchableOpacity>

                    </ScrollView>

                    <View style={styles.footer}>
                        <TouchableOpacity
                            style={[styles.button, { backgroundColor: colors.lightGrey }]}
                            onPress={() => {
                                resetForm();
                                setVisible(false);
                            }}
                        >
                            <Text style={[styles.buttonText, { color: colors.text }]}>
                                Cancel
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.button, { backgroundColor: colors.primary }]}
                            onPress={handleSubmit}
                        >
                            <Text style={[styles.buttonText, { color: colors.white }]}>
                                Submit
                            </Text>
                        </TouchableOpacity>
                    </View>

                </View>
            </View>
            <Modal
                visible={previewVisible}
                transparent
                animationType="fade"
            >

                <View
                    style={{
                        flex: 1,
                        backgroundColor: "rgba(0,0,0,0.9)",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >

                    <TouchableOpacity
                        style={{
                            position: "absolute",
                            top: 60,
                            right: 20,
                            zIndex: 10,
                        }}
                        onPress={() => setPreviewVisible(false)}
                    >
                        <Icons.X
                            size={28}
                            color={colors.white}
                        />
                    </TouchableOpacity>

                    <Image
                        source={{ uri: file }}
                        resizeMode="contain"
                        style={{
                            width: "90%",
                            height: "80%",
                        }}
                    />

                </View>

            </Modal>
        </Modal>
    );
};

export default ExtrasModal;