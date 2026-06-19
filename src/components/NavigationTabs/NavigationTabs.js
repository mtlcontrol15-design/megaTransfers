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

const NavigationTabs = ({ navItems, selectedNav, onNavigate, colors }) => {
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
              <Icon
                size={moderateScale(18)}
                color={active ? colors.primary : colors.gray600}
                strokeWidth={active ? 2.4 : 1.8}
              />

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
});