
import { useState } from "react";
import { View } from "react-native";

import { useTheme } from "@react-navigation/native";

import getStyles from "./style";
import Icons from "../../assets/icons";

const AdminUsersScreen = () => {
  const { colors } = useTheme();
  const styles = getStyles(colors);

  const onSuccess = (res) => {
    console.log('======res', res);
    reset();
    setTimeout(() => {
      setShowSuccessModal(true);
    }, 500);
  };

  const onError = (err) => {
    console.log("err----->", err);

    reset();
  }

  const { mutate, isPending, reset } = mutationHandler(
    EndPoints.uploadVehicleDetails,
    user?.token,
    onSuccess,
    onError,
  );


  return (
    <View style={{ flex: 1, backgroundColor: colors.white }}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerIcon}
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 30, bottom: 30, left: 30, right: 30 }}
        >
          <Icons.ArrowLeft size={26} color={colors.white} />
        </TouchableOpacity>

        <Text style={styles.headerTitle} numberOfLines={1}>
          {"Admin Users"}
        </Text>

        <View style={styles.headerRight} />
      </View>
    </View>
  );
};

export default AdminUsersScreen;