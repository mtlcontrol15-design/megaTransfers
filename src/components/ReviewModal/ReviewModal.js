import React, { useEffect, useState } from "react";
import {
  Alert,
  Linking,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

import {
  moderateScale,
  scale,
  verticalScale,
} from "react-native-size-matters";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Theme } from "../../libs";

const ReviewModal = ({
  visible,
  onClose,
  onSubmit,
  bookingId,
  colors,
  reviewLink
}) => {

  const [bookingStars, setBookingStars] = useState(0);
  const [driverStars, setDriverStars] = useState(0);

  const [driverFeedback, setDriverFeedback] = useState("");
  const [generalFeedback, setGeneralFeedback] = useState("");
  const [googleReviewOpened, setGoogleReviewOpened] = useState(false);

  const resetForm = () => {

    setBookingStars(0);
    setDriverStars(0);

    setDriverFeedback("");
    setGeneralFeedback("");
  };

  useEffect(() => {

    if (!visible) {
      resetForm();
      setGoogleReviewOpened(false);
    }

  }, [visible]);

  const handleStarPress = (
    currentRating,
    setRating,
    starIndex
  ) => {

    if (currentRating === starIndex) {
      setRating(0);
    } else {
      setRating(starIndex);
    }
  };

  const renderStars = (
    rating,
    setRating
  ) => {

    return (
      <View style={styles.starsRow}>

        {[1, 2, 3, 4, 5].map((star) => (

          <TouchableOpacity
            key={star}
            activeOpacity={0.7}
            onPress={() =>
              handleStarPress(
                rating,
                setRating,
                star
              )
            }
          >

            <Text
              style={{
                fontSize: moderateScale(34),
                marginHorizontal: scale(4),
                color:
                  star <= rating
                    ? "#F29100"
                    : "#D1D5DB",
              }}
            >
              ★
            </Text>

          </TouchableOpacity>

        ))}

      </View>
    );
  };

  const handleSubmit = () => {

    if (!bookingStars || !driverStars) {

      Alert.alert(
        "Ratings Required",
        "Please rate booking and driver."
      );

      return;
    }

    const payload = {

      bookingId,

      bookingStars,

      driverStars,

      driverFeedback:
        driverFeedback?.trim(),

      generalFeedback:
        generalFeedback?.trim(),
    };

    onSubmit(payload);

    resetForm();

    onClose();
  };

  return (

    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onClose}
    >

      <TouchableWithoutFeedback
        onPress={onClose}
      >

        <View style={styles.overlay}>

          <TouchableWithoutFeedback>

            <View style={styles.container}>

              <View style={styles.header}>

                <Text style={styles.title}>
                  Leave Review
                </Text>

                <TouchableOpacity
                  onPress={onClose}
                >
                  <Text style={styles.closeText}>
                    ✕
                  </Text>
                </TouchableOpacity>

              </View>

              <KeyboardAwareScrollView
                enableOnAndroid
                extraScrollHeight={70}
                keyboardShouldPersistTaps="handled"
              >

                {/* BOOKING REVIEW */}

                <View style={styles.section}>

                  <Text style={styles.heading}>
                    Booking Experience
                  </Text>

                  <Text style={styles.subHeading}>
                    How was your overall ride?
                  </Text>

                  {renderStars(
                    bookingStars,
                    setBookingStars
                  )}

                  <Text style={styles.ratingText}>
                    {
                      bookingStars > 0
                        ? `${bookingStars} Star${bookingStars > 1 ? "s" : ""}`
                        : "Tap to rate"
                    }
                  </Text>

                  <TextInput
                    multiline
                    maxLength={500}
                    value={generalFeedback}
                    onChangeText={setGeneralFeedback}
                    placeholder="What did you think about the service?"
                    placeholderTextColor="#999"
                    style={styles.input}
                    textAlignVertical="top"
                  />

                  <Text style={styles.count}>
                    {generalFeedback.length}/500
                  </Text>

                </View>

                <View style={styles.divider} />

                {/* DRIVER REVIEW */}

                <View style={styles.section}>

                  <Text style={styles.heading}>
                    Driver Experience
                  </Text>

                  <Text style={styles.subHeading}>
                    How was your driver?
                  </Text>

                  {renderStars(
                    driverStars,
                    setDriverStars
                  )}

                  <Text style={styles.ratingText}>
                    {
                      driverStars > 0
                        ? `${driverStars} Star${driverStars > 1 ? "s" : ""}`
                        : "Tap to rate"
                    }
                  </Text>

                  <TextInput
                    // multiline
                    maxLength={500}
                    value={driverFeedback}
                    onChangeText={setDriverFeedback}
                    placeholder="Share your feedback with us..."
                    placeholderTextColor="#999"
                    style={styles.input}
                    textAlignVertical="top"
                  />

                  <Text style={styles.count}>
                    {driverFeedback.length}/500
                  </Text>

                </View>

                {
                  !!reviewLink && (
                    <TouchableOpacity
                      activeOpacity={0.8}
                      disabled={googleReviewOpened}
                      style={[
                        styles.googleReviewBtn,
                        googleReviewOpened && styles.googleReviewBtnDisabled
                      ]}
                      onPress={() => {
                        Linking.openURL(reviewLink);
                        setGoogleReviewOpened(true);
                      }}
                    >

                      <Text style={[
                        styles.googleReviewText,
                        googleReviewOpened && styles.googleReviewTextDisabled
                      ]}>
                        {googleReviewOpened ? "Google Review Left" : "Leave Google Review"}
                      </Text>

                    </TouchableOpacity>
                  )
                }

                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={handleSubmit}
                  disabled={
                    bookingStars === 0 ||
                    driverStars === 0
                  }
                  style={[
                    styles.submitBtn,
                    {
                      backgroundColor:
                        bookingStars === 0 ||
                          driverStars === 0
                          ? "#ccc"
                          : colors?.primary || "#F29100"
                    }
                  ]}
                >

                  <Text style={styles.submitText}>
                    Submit Review
                  </Text>

                </TouchableOpacity>

              </KeyboardAwareScrollView>

            </View>

          </TouchableWithoutFeedback>

        </View>

      </TouchableWithoutFeedback>

    </Modal>
  );
};

export default ReviewModal;

const styles = StyleSheet.create({

  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    paddingHorizontal: moderateScale(18),
  },

  container: {
    backgroundColor: "#fff",
    borderRadius: moderateScale(18),
    paddingVertical: verticalScale(18),
    paddingHorizontal: moderateScale(16),
    maxHeight: "90%",
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: verticalScale(5),
  },

  title: {
    fontSize: moderateScale(18),
    fontWeight: "700",
    color: "#111",
  },

  closeText: {
    fontSize: moderateScale(22),
    color: "#666",
  },

  section: {
    marginTop: verticalScale(5),
  },

  heading: {
    fontSize: moderateScale(16),
    fontWeight: "700",
    color: "#111",
    marginBottom: verticalScale(4),
  },

  subHeading: {
    fontSize: moderateScale(13),
    color: "#666",
    marginBottom: verticalScale(8),
  },

  starsRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: verticalScale(4),
  },

  ratingText: {
    textAlign: "center",
    fontSize: moderateScale(13),
    color: "#F29100",
    fontWeight: "600",
    marginBottom: verticalScale(5),
  },

  input: {
    borderWidth: 1,
    borderColor: "#E5E5E5",
    borderRadius: moderateScale(12),
    padding: moderateScale(12),
    minHeight: verticalScale(70),
    fontSize: moderateScale(14),
    color: "#111",
    backgroundColor: "#FAFAFA",
  },

  count: {
    textAlign: "right",
    marginTop: verticalScale(3),
    color: "#999",
    fontSize: moderateScale(11),
  },

  divider: {
    height: 1,
    backgroundColor: "#EEE",
    marginVertical: verticalScale(6),
  },

  submitBtn: {
    marginTop: verticalScale(10),
    paddingVertical: verticalScale(15),
    borderRadius: moderateScale(12),
    justifyContent: "center",
    alignItems: "center",
  },

  submitText: {
    color: "#fff",
    fontSize: moderateScale(15),
    fontWeight: "700",
  },

  cancelBtn: {
    marginTop: verticalScale(12),
    paddingVertical: verticalScale(14),
    borderRadius: moderateScale(12),
    borderWidth: 1,
    borderColor: "#DDD",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: verticalScale(5),
  },

  cancelText: {
    color: "#555",
    fontSize: moderateScale(15),
    fontWeight: "600",
  },
  googleReviewBtn: {
    marginTop: verticalScale(10),
    backgroundColor: Theme?.colors?.primary,
    paddingVertical: verticalScale(15),
    borderRadius: moderateScale(12),
    justifyContent: "center",
    alignItems: "center",
  },

  googleReviewText: {
    color: "#fff",
    fontSize: moderateScale(15),
    fontWeight: "700",
  },

  googleReviewBtnDisabled: {
    backgroundColor: "#ccc",
    opacity: 0.6,
  },

  googleReviewTextDisabled: {
    color: "#666",
  },
});