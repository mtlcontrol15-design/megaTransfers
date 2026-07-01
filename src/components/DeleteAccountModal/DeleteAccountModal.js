import React from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { moderateScale } from "react-native-size-matters";
import Icons from "../../assets/icons";

const DeleteAccountModal = ({
  visible,
  password,
  setPassword,
  showPassword,
  setShowPassword,
  onCancel,
  onDelete,
  colors,
  isLoading = false,
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.55)",
          justifyContent: "center",
          alignItems: "center",
          paddingHorizontal: moderateScale(20),
        }}
      >
        <View
          style={{
            width: "100%",
            backgroundColor: colors.white,
            borderRadius: moderateScale(18),
            padding: moderateScale(18),
          }}
        >
          <View style={{ alignItems: "center", marginBottom: moderateScale(14) }}>
            <View
              style={{
                width: moderateScale(56),
                height: moderateScale(56),
                borderRadius: moderateScale(28),
                backgroundColor: "#FEE2E2",
                justifyContent: "center",
                alignItems: "center",
                marginBottom: moderateScale(10),
              }}
            >
              <Icons.Trash2 size={28} color={colors.error} />
            </View>

            <Text
              style={{
                fontSize: moderateScale(18),
                fontWeight: "700",
                color: colors.text,
                textAlign: "center",
              }}
            >
              Delete Account
            </Text>

            <Text
              style={{
                fontSize: moderateScale(13),
                color: colors.gray600,
                textAlign: "center",
                marginTop: moderateScale(8),
                lineHeight: moderateScale(20),
              }}
            >
              Your account will be permanently deleted. Please enter your
              password to confirm this action.
            </Text>
          </View>

          <Text
            style={{
              fontSize: moderateScale(13),
              fontWeight: "600",
              color: colors.text,
              marginBottom: moderateScale(8),
            }}
          >
            Password
          </Text>

          <View
            style={{
              height: moderateScale(48),
              borderWidth: 1,
              borderColor: colors.gray200,
              borderRadius: moderateScale(12),
              paddingHorizontal: moderateScale(12),
              flexDirection: "row",
              alignItems: "center",
              marginBottom: moderateScale(16),
            }}
          >
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="Enter your password"
              placeholderTextColor={colors.gray600}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              autoCorrect={false}
              style={{
                flex: 1,
                color: colors.text,
                fontSize: moderateScale(14),
              }}
            />

            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              {showPassword ? (
                <Icons.EyeOff size={20} color={colors.primary} />
              ) : (
                <Icons.Eye size={20} color={colors.primary} />
              )}
            </TouchableOpacity>
          </View>

          <View style={{ flexDirection: "row", gap: moderateScale(10) }}>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={onCancel}
              disabled={isLoading}
              style={{
                flex: 1,
                height: moderateScale(46),
                borderRadius: moderateScale(12),
                borderWidth: 1,
                borderColor: colors.gray200,
                justifyContent: "center",
                alignItems: "center",
                opacity: isLoading ? 0.6 : 1,
              }}
            >
              <Text
                style={{
                  color: colors.text,
                  fontSize: moderateScale(14),
                  fontWeight: "600",
                }}
              >
                Cancel
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={onDelete}
              disabled={isLoading}
              style={{
                flex: 1,
                height: moderateScale(46),
                borderRadius: moderateScale(12),
                backgroundColor: colors.error,
                justifyContent: "center",
                alignItems: "center",
                opacity: isLoading ? 0.6 : 1,
              }}
            >
              <Text
                style={{
                  color: colors.white,
                  fontSize: moderateScale(14),
                  fontWeight: "700",
                }}
              >
                {isLoading ? "Deleting..." : "Delete"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default DeleteAccountModal;