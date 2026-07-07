import React from "react";
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
} from "react-native";
import {
  scale,
  verticalScale,
  moderateScale,
} from "react-native-size-matters";

const NavigationTabs = ({ navItems, selectedNav, onNavigate, colors, bidCount = 0 }) => {
  return (
    <View style={[styles.wrapper, { backgroundColor: colors.bg }]}>
      <View
        style={[
          styles.container,
          {
            backgroundColor: colors.gray100,
            borderColor: colors.gray200,
          },
        ]}
      >
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = selectedNav === item.label;

          return (
            <TouchableOpacity
              key={item.id}
              activeOpacity={0.8}
              onPress={() => onNavigate(item)}
              style={[
                styles.tabButton,
                active && [
                  styles.activeTab,
                  {
                    backgroundColor: colors.white,
                    shadowColor: colors.black,
                  },
                ],
              ]}
            >
              <View style={styles.iconWrapper}>
                <Icon
                  size={moderateScale(18)}
                  color={active ? colors.primary : colors.gray600}
                  strokeWidth={active ? 2.4 : 1.8}
                />

                {item.label === "Pool" && bidCount > 0 && (
                  <View style={[styles.badge, { backgroundColor: colors.red || "#E53935" }]}>
                    <Text style={styles.badgeText} numberOfLines={1}>
                      {bidCount > 99 ? "99+" : bidCount}
                    </Text>
                  </View>
                )}
              </View>

              <Text
                style={[
                  styles.label,
                  {
                    color: active ? colors.primary : colors.gray600,
                    fontWeight: active ? "600" : "500",
                  },
                ]}
                numberOfLines={1}
              >
                {item.label}
              </Text>

              {active && (
                <View
                  style={[
                    styles.activeDot,
                    { backgroundColor: colors.primary },
                  ]}
                />
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

export default NavigationTabs;

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: scale(16),
    paddingTop: verticalScale(6),
  },

  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: moderateScale(14),
    padding: moderateScale(4),
    borderWidth: 1,
  },

  tabButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: verticalScale(4),
    marginHorizontal: scale(3),
    borderRadius: moderateScale(10),
  },

  iconWrapper: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },

  activeTab: {
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },

  label: {
    fontSize: moderateScale(11),
    marginTop: verticalScale(2),
  },

  activeDot: {
    width: moderateScale(5),
    height: moderateScale(5),
    borderRadius: moderateScale(3),
    marginTop: verticalScale(4),
  },

  badge: {
    position: "absolute",
    top: -6,
    right: -10,
    minWidth: moderateScale(16),
    height: moderateScale(16),
    borderRadius: moderateScale(8),
    paddingHorizontal: moderateScale(4),
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#fff",
  },

  badgeText: {
    color: "#fff",
    fontSize: moderateScale(9),
    fontWeight: "700",
    includeFontPadding: false,
    textAlign: "center",
  },
});