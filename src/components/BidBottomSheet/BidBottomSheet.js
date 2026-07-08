import React, { useEffect, useState } from "react";
import {
    Modal,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
    TouchableWithoutFeedback,
    KeyboardAvoidingView,
    Platform,
} from "react-native";
import { moderateScale } from "react-native-size-matters";

import getStyles from "./style";
import Icons from "../../assets/icons";

const BidBottomSheet = ({
    visible,
    colors,
    job,
    user,
    isSubmitting,
    onClose,
    onSubmit,
}) => {
    const styles = getStyles(colors);
    const [amount, setAmount] = useState("");

    const myBid = job?.bids?.find(
        bid => bid?.bidder === user?._id
    );

    // console.log('======myBid is here',myBid);s


    useEffect(() => {
        if (visible) {
            setAmount(myBid?.amount ? String(myBid.amount) : "");
        }
    }, [visible, myBid]);

    const handleSubmit = () => {
        const bidAmount = Number(amount);

        if (!amount || Number.isNaN(bidAmount) || bidAmount <= 0) {
            return;
        }

        const payload = {
            bidder: user?._id,
            bidderName: user?.fullName,
            amount: bidAmount,
        };

        // console.log("Submitting bid:", payload, "for job:", job);

        onSubmit?.(payload, job);
    };

    const handleSubmitCurrentFare = () => {
        const currentFare = Number(job?.fare);

        if (Number.isNaN(currentFare) || currentFare <= 0) {
            return;
        }

        const payload = {
            bidder: user?._id,
            bidderName: user?.fullName,
            amount: currentFare,
        };

        onSubmit?.(payload, job);
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="slide"
            onRequestClose={onClose}
        >
            <TouchableWithoutFeedback onPress={onClose}>
                <View style={styles.backdrop}>
                    <TouchableWithoutFeedback>
                        <KeyboardAvoidingView
                            behavior={Platform.OS === "ios" ? "padding" : undefined}
                            style={styles.sheet}
                        >
                            <TouchableOpacity activeOpacity={0.7} onPress={onClose}>

                                <View style={styles.handle} />
                            </TouchableOpacity>

                            <View style={styles.headerRow}>
                                <View>
                                    <Text style={styles.title}>
                                        Bid For This Job
                                    </Text>

                                    <Text style={styles.subtitle}>
                                        Booking ID: {job?.bookingId || job?.poolJobId || "N/A"}
                                    </Text>
                                </View>

                                <TouchableOpacity
                                    activeOpacity={0.7}
                                    onPress={onClose}
                                    style={styles.closeButton}
                                >
                                    <Icons.X size={moderateScale(20)} color={colors.black} />
                                </TouchableOpacity>
                            </View>

                            <View style={styles.jobInfoBox}>

                                <Text numberOfLines={1} style={styles.jobInfoText}>
                                    Vehicle: {job?.vehicle || "N/A"}
                                </Text>

                                {job?.fare !== undefined && (
                                    <Text numberOfLines={1} style={styles.jobInfoText}>
                                        Current Fare: £{job?.fare}
                                    </Text>
                                )}
                            </View>

                            <Text style={styles.inputLabel}>
                                Enter Bid Amount
                            </Text>

                            <View style={styles.inputWrapper}>
                                <Text style={styles.currencyText}>£</Text>

                                <TextInput
                                    value={amount}
                                    onChangeText={setAmount}
                                    placeholder="0.00"
                                    placeholderTextColor={colors.gray600}
                                    keyboardType="decimal-pad"
                                    style={styles.input}
                                />
                            </View>

                            {job?.fare !== undefined && (
                                <TouchableOpacity
                                    activeOpacity={0.8}
                                    disabled={isSubmitting}
                                    onPress={handleSubmitCurrentFare}
                                    style={[
                                        styles.currentFareButton,
                                        {
                                            borderColor: colors.redBorder || colors.bttonColor,
                                            opacity: isSubmitting ? 0.6 : 1,
                                        },
                                    ]}
                                >
                                    <Text
                                        style={[
                                            styles.currentFareButtonText,
                                            { color: colors.redBorder || colors.bttonColor },
                                        ]}
                                    >
                                        Bid With Current Fare £{job?.fare}
                                    </Text>
                                </TouchableOpacity>
                            )}

                            <TouchableOpacity
                                activeOpacity={0.8}
                                disabled={isSubmitting || !amount}
                                onPress={handleSubmit}
                                style={[
                                    styles.submitButton,
                                    {
                                        backgroundColor: colors.redBorder || colors.bttonColor,
                                        opacity: isSubmitting || !amount ? 0.6 : 1,
                                    },
                                ]}
                            >
                                {isSubmitting ? (
                                    <ActivityIndicator color={colors.white} size="small" />
                                ) : (
                                    <Text style={styles.submitButtonText}>
                                        Submit Bid
                                    </Text>
                                )}
                            </TouchableOpacity>
                        </KeyboardAvoidingView>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
};

export default BidBottomSheet;