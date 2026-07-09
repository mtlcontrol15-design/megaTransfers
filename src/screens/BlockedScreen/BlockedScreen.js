
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

import { useTheme } from "@react-navigation/native";
import { useDispatch } from "react-redux";

import getStyles from "./style";
import { dispatchIsSignedIn, dispatchToken, dispatchUser } from "../../redux/slices/userSlice";

const TITLE_BY_CODE = {
  ACCOUNT_REJECTED: "Account Rejected",
  ACCOUNT_SUSPENDED: "Account Suspended",
  ACCOUNT_PENDING: "Account Pending",
};

const BlockedScreen = ({ navigation, route }) => {
  const { colors } = useTheme();
  const styles = getStyles(colors);
  const dispatch = useDispatch();

  const code = route?.params?.code;
  const title = route?.params?.title || TITLE_BY_CODE[code] || "Account Blocked";
  const message =
    route?.params?.message ||
    "Your account access is currently restricted. Please contact support.";

  const handleGoToLogin = () => {
    dispatch(dispatchIsSignedIn(false));
    dispatch(dispatchToken(null));
    dispatch(dispatchUser(null));
    navigation.reset({
      index: 0,
      routes: [{ name: "Login" }],
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>

        <Text style={styles.headerTitle}>Blocked Account</Text>
      </View>
      <View style={styles.content}>
        <Image
          source={require("../../assets/images/blocked.png")}
          style={styles.image}
          resizeMode="contain"
        />
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.message}>{message}</Text>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleGoToLogin} activeOpacity={0.8}>
        <Text style={styles.buttonText}>Go To Login</Text>
      </TouchableOpacity>
    </View>
  );
};

export default BlockedScreen;