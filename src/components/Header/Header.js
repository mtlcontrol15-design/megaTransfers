import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
} from "react-native";
import { Switch } from 'react-native-switch';
import { moderateScale, scale, verticalScale } from "react-native-size-matters";
import Icons from "../../assets/icons";
import { Theme } from "../../libs";
import { useSelector } from "react-redux";

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
}) => {

  const [localOnline, setLocalOnline] = useState(false);

  const { isOnline } = useSelector(state => state.userReducer)


  const getInitials = (name = "") => {
    if (!name) return "?";

    const words = name.trim().split(" ");

    if (words.length === 1) {
      return words[0][0]?.toUpperCase();
    }

    return (
      (words[0][0] || "") + (words[1][0] || "")
    ).toUpperCase();
  };

  const isValidImage = (img) => {
    return img && img !== "null" && img !== "undefined";
  };

  const showImage = isValidImage(companyLogo);
  const initials = getInitials(companyName);


  useEffect(() => {
    setLocalOnline(isOnline);
  }, [isOnline]);

  return (
    <View style={[styles.container, { backgroundColor: colors?.primary }]}>
      <View style={styles.leftSection} onPress={onImagePress}>
        {showImage ? (
          <TouchableOpacity onPress={onImagePress} activeOpacity={0.7}>
            <Image
              resizeMode="contain"
              source={{ uri: companyLogo }}
              style={[
                styles.logo,
                isCustomer && { borderRadius: moderateScale(50) }
              ]}
            />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={onImagePress} activeOpacity={0.7}
            style={[
              styles.logoPlaceholder,
              { backgroundColor: colors?.lightBlue },
              // isCustomer && { borderRadius: moderateScale(50) }
            ]}
          >
            <Text ellipsizeMode="tail" style={styles.logoText}>
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
        {/* Top Row (icons) */}
        <View style={styles.iconRow}>
          <TouchableOpacity activeOpacity={0.7} onPress={onRefreshPress}>
            <Icons.RefreshCcw size={24} color={colors.white} />
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={onNotificationPress}
            style={styles.notificationWrapper}
          >
            <Icons.Bell size={moderateScale(24)} color={colors?.white} />

            {unreadCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>
                  {unreadCount > 99 ? "99+" : unreadCount}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {isDriver && <View style={styles.switchContainer}>
          <Switch
            value={isOnline}
            onValueChange={(val) => {
              onToggleOnline?.(val);
            }}
            circleSize={24}
            barHeight={30}
            backgroundActive={colors?.secondary}
            backgroundInactive={"#ccc"}
            circleActiveColor={colors?.lightBlue}
            circleInActiveColor={colors?.error}
            renderActiveText={true}
            renderInActiveText={true}
            activeText={"Online"}
            activeTextStyle={{ color: 'white' }}
            inActiveText={"Offline"}
            inactiveTextStyle={{ color: colors?.primary }}
            switchWidthMultiplier={3.7}
          />
        </View>}
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
    paddingTop: verticalScale(30),
    paddingBottom: verticalScale(5),
  },

  leftSection: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },

  logo: {
    width: moderateScale(70),
    height: moderateScale(70),
    // borderRadius: moderateScale(10),
    marginRight: scale(12),
  },

  logoPlaceholder: {
    width: moderateScale(42),
    height: moderateScale(42),
    borderRadius: moderateScale(10),
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
    marginRight: scale(12),
  },

  logoText: {
    color: "#FFF",
    fontSize: moderateScale(18),
    fontWeight: "700",
    width: moderateScale(100)
  },

  infoContainer: {
    flex: 1,
  },

  companyName: {
    fontSize: moderateScale(16),
    fontWeight: "700",
    color: Theme?.colors.white,
    maxWidth: moderateScale(100)
  },

  website: {
    fontSize: moderateScale(12),
    marginTop: verticalScale(2),
  },

  notificationWrapper: {
    marginLeft: scale(10),
  },

  badge: {
    position: "absolute",
    top: -verticalScale(6),
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
    color: "#FFF",
    fontSize: moderateScale(8),
    fontWeight: "700",
  },
  rightSection: {
    alignItems: "center",
    justifyContent: "center",
  },

  iconRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: moderateScale(70), // 👈 controls width of both icons
  },

  switchContainer: {
    marginTop: verticalScale(4),
    alignItems: "center",
    justifyContent: "center",
    width: moderateScale(70),
  },

  switchText: {
    color: "#FFF",
    fontSize: moderateScale(10),
    fontWeight: "600",
  },
});