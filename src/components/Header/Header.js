import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
} from "react-native";

import { Switch } from "react-native-switch";
import {
  moderateScale,
  scale,
  verticalScale,
} from "react-native-size-matters";
import { useSelector } from "react-redux";

import Icons from "../../assets/icons";
import { Theme } from "../../libs";

const Header = ({
  companyName,
  companyLogo,
  unreadCount = 0,
  onNotificationPress,
  onImagePress,
  colors,
  isCustomer = false,
  isDriver = false,
  onRefreshPress,
  onToggleOnline,
  onToggleAvailability,
  isAvailable,
  hasActiveJob,
}) => {
  const { isOnline } = useSelector(
    state => state.userReducer
  );

  const [showAvailabilitySwitch, setShowAvailabilitySwitch] =
    useState(false);

  const getInitials = (name = "") => {
    if (!name) return "?";

    const words = name.trim().split(/\s+/);

    if (words.length === 1) {
      return words[0][0]?.toUpperCase();
    }

    return (
      (words[0][0] || "") +
      (words[1][0] || "")
    ).toUpperCase();
  };

  const isValidImage = image => {
    return (
      image &&
      image !== "null" &&
      image !== "undefined"
    );
  };

  const handleAvailabilityChange = value => {
    onToggleAvailability?.(value);

    // Hide availability switch after enabling or disabling.
    setShowAvailabilitySwitch(false);
  };

  const showImage = isValidImage(companyLogo);
  const initials = getInitials(companyName);

  // const availabilityDisabled =
  //   !isOnline || hasActiveJob;

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors?.primary,
        },
      ]}
    >
      <View style={styles.leftSection}>
        {showImage ? (
          <TouchableOpacity
            onPress={onImagePress}
            activeOpacity={0.7}
          >
            <Image
              resizeMode="contain"
              source={{ uri: companyLogo }}
              style={[
                styles.logo,
                isCustomer && styles.customerLogo,
              ]}
            />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={onImagePress}
            activeOpacity={0.7}
            style={[
              styles.logoPlaceholder,
              {
                backgroundColor:
                  colors?.lightBlue,
              },
            ]}
          >
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={styles.logoText}
            >
              {initials}
            </Text>
          </TouchableOpacity>
        )}

        <View style={styles.infoContainer}>
          <Text
            ellipsizeMode="tail"
            numberOfLines={1}
            style={styles.companyName}
          >
            {companyName}
          </Text>
        </View>
      </View>

      <View style={styles.rightSection}>
        <View style={styles.topRow}>
          {isDriver && (
            <View style={styles.availabilityArea}>
              {showAvailabilitySwitch ? (
                <View
                  style={[
                    styles.availabilitySwitchContainer,
                    // availabilityDisabled &&
                    //   styles.disabledAvailability,
                  ]}
                >
                  <Switch
                    value={isAvailable}
                    onValueChange={
                      handleAvailabilityChange
                    }
                    // disabled={availabilityDisabled}
                    circleSize={moderateScale(20)}
                    barHeight={moderateScale(27)}
                    backgroundActive="#22C55E"
                    backgroundInactive="#CCCCCC"
                    circleActiveColor={
                      colors?.lightBlue
                    }
                    circleInActiveColor={
                      colors?.error
                    }
                    renderActiveText
                    renderInActiveText
                    activeText="Available"
                    inActiveText="Unavailable"
                    activeTextStyle={
                      styles.availabilityActiveText
                    }
                    inactiveTextStyle={
                      styles.availabilityInactiveText
                    }
                    switchWidthMultiplier={5}
                  />
                </View>
              ) : (
                <TouchableOpacity
                  activeOpacity={0.7}
                  // disabled={availabilityDisabled}
                  onPress={() =>
                    setShowAvailabilitySwitch(true)
                  }
                  style={[
                    styles.asapButton,
                    {
                      borderColor: colors?.white,
                    },
                    isAvailable &&
                    styles.asapButtonAvailable,
                    // availabilityDisabled &&
                    //   styles.asapButtonDisabled,
                  ]}
                >
                  <Text
                    style={[
                      styles.asapText,
                      {
                        color: colors?.white,
                      },
                    ]}
                  >
                    ASAP
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          )}

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={onRefreshPress}
            style={styles.iconButton}
          >
            <Icons.RefreshCcw
              size={moderateScale(24)}
              color={colors?.white}
            />
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={onNotificationPress}
            style={[
              styles.iconButton,
              styles.notificationWrapper,
            ]}
          >
            <Icons.Bell
              size={moderateScale(24)}
              color={colors?.white}
            />

            {unreadCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>
                  {unreadCount > 99
                    ? "99+"
                    : unreadCount}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {isDriver && (
          <View style={styles.onlineSwitchContainer}>
            <Switch
              value={isOnline}
              onValueChange={value => {
                onToggleOnline?.(value);
              }}
              circleSize={moderateScale(24)}
              barHeight={moderateScale(30)}
              backgroundActive={
                colors?.secondary
              }
              backgroundInactive="#CCCCCC"
              circleActiveColor={
                colors?.lightBlue
              }
              circleInActiveColor={
                colors?.error
              }
              renderActiveText
              renderInActiveText
              activeText="Online"
              inActiveText="Offline"
              activeTextStyle={[
                styles.onlineActiveText,
                {
                  color: colors?.white,
                },
              ]}
              inactiveTextStyle={[
                styles.onlineInactiveText,
                {
                  color: colors?.primary,
                },
              ]}
              switchWidthMultiplier={4.2}
            />
          </View>
        )}
      </View>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: scale(16),
    paddingTop: verticalScale(40),
    paddingBottom: verticalScale(15),
  },

  leftSection: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    minWidth: 0,
  },

  logo: {
    width: moderateScale(70),
    height: moderateScale(70),
    marginRight: scale(12),
  },

  customerLogo: {
    borderRadius: moderateScale(50),
  },

  logoPlaceholder: {
    width: moderateScale(42),
    height: moderateScale(42),
    borderRadius: moderateScale(10),
    alignItems: "center",
    justifyContent: "center",
    marginRight: scale(12),
  },

  logoText: {
    color: "#FFFFFF",
    fontSize: moderateScale(18),
    fontWeight: "700",
  },

  infoContainer: {
    flex: 1,
    minWidth: 0,
  },

  companyName: {
    maxWidth: moderateScale(100),
    color: Theme.colors.white,
    fontSize: moderateScale(16),
    fontWeight: "700",
  },

  rightSection: {
    alignItems: "flex-end",
    justifyContent: "center",
  },

  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: scale(10),
  },

  availabilityArea: {
    minWidth: moderateScale(48),
    alignItems: "flex-end",
    justifyContent: "center",
  },

  asapButton: {
    minWidth: moderateScale(48),
    height: moderateScale(28),
    paddingHorizontal: scale(10),
    borderWidth: 1,
    borderRadius: moderateScale(14),
    alignItems: "center",
    justifyContent: "center",
  },

  asapButtonAvailable: {
    backgroundColor: "rgba(34, 197, 94, 0.35)",
  },

  asapButtonDisabled: {
    opacity: 0.5,
  },

  asapText: {
    fontSize: moderateScale(11),
    fontWeight: "700",
    includeFontPadding: false,
    lineHeight: moderateScale(13),
    textAlign: "center",
  },

  availabilitySwitchContainer: {
    alignItems: "center",
    justifyContent: "center",
  },

  disabledAvailability: {
    opacity: 0.55,
  },

  availabilityActiveText: {
    width: moderateScale(60),
    color: "#FFFFFF",
    textAlign: "center",
    fontSize: moderateScale(9),
    fontWeight: "600",
    includeFontPadding: false,
  },

  availabilityInactiveText: {
    width: moderateScale(60),
    color: "#FFFFFF",
    textAlign: "center",
    fontSize: moderateScale(8),
    lineHeight: moderateScale(10),
    fontWeight: "600",
    includeFontPadding: false,
  },

  iconButton: {
    width: moderateScale(28),
    height: moderateScale(30),
    alignItems: "center",
    justifyContent: "center",
  },

  notificationWrapper: {
    position: "relative",
  },

  badge: {
    position: "absolute",
    top: -verticalScale(5),
    right: -scale(4),
    minWidth: moderateScale(18),
    height: moderateScale(18),
    borderRadius: moderateScale(9),
    backgroundColor: "#FF3B30",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: scale(4),
  },

  badgeText: {
    color: "#FFFFFF",
    fontSize: moderateScale(8),
    fontWeight: "700",
  },

  onlineSwitchContainer: {
    marginTop: verticalScale(7),
    alignItems: "center",
    justifyContent: "center",
  },

  onlineActiveText: {
    width: moderateScale(60),
    textAlign: "center",
    fontSize: moderateScale(11),
    fontWeight: "600",
    includeFontPadding: false,
  },

  onlineInactiveText: {
    width: moderateScale(60),
    textAlign: "center",
    fontSize: moderateScale(10),
    lineHeight: moderateScale(12),
    fontWeight: "600",
    includeFontPadding: false,
  },
});