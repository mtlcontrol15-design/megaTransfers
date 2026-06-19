import { useMemo } from "react";
import { Text, TouchableOpacity, View, ScrollView } from "react-native";
import { useTheme, useNavigation } from "@react-navigation/native";

import getStyles from "./style";
import Icons from "../../assets/icons";
import { EndPoints } from "../../services/EndPoints";
import queryHandler from "../../services/queries/queryHandler";
import LoaderModal from "../../utils/loaderModal";

const TermAndConditionsScreen = () => {
  const { colors } = useTheme();
  const styles = getStyles(colors);
  const navigation = useNavigation();

  const { data, isFetching } = queryHandler(EndPoints.getTerms);

  const displayTerms = data?.data || [];

  // 👇 you can adjust role logic if needed
  const isCustomer = false;

  const formatDate = (date) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString();
  };

  const roleColors = {
    lightBg: "#EEF2FF",
    border: "#C7D2FE",
    text: "#3730A3",
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.white }}>

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerIcon}
          onPress={() => navigation.goBack()}
        >
          <Icons.ArrowLeft size={26} color={colors.white} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>
          Term & Conditions
        </Text>

        <View style={styles.headerRight} />
      </View>

      <ScrollView contentContainerStyle={{ padding: 16 }}>

        {/* Important Info Box */}
        <View
          style={{
            marginBottom: 16,
            padding: 16,
            borderRadius: 10,
            borderWidth: 1,
            backgroundColor: roleColors.lightBg,
            borderColor: roleColors.border,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Icons.Info size={20} color={roleColors.text} />
            <Text style={{ marginLeft: 8, fontWeight: "bold", color: roleColors.text }}>
              Important Information
            </Text>
          </View>

          <Text style={{ fontSize: 14, color: "#6B7280", marginTop: 8 }}>
            {isCustomer
              ? "Please review the following terms and conditions for using our booking services."
              : "Please review the following terms and conditions for accepting driving assignments."}
          </Text>
        </View>

        {/* Terms Content */}
        <View
          style={{
            backgroundColor: "#F9FAFB",
            padding: 20,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: "#E5E7EB",
            marginBottom: 16,
          }}
        >
          <Text style={{ color: "#374151", fontSize: 16, lineHeight: 22 }}>
            {displayTerms[0]?.content || "No terms available."}
          </Text>

          {/* Details */}
          <View style={{ marginTop: 16, paddingTop: 16, borderTopWidth: 1, borderTopColor: "#E5E7EB" }}>

            {/* Created Date */}
            <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 12 }}>
              <Icons.Calendar size={16} color="#6B7280" />
              <Text style={{ fontSize: 13, color: "#6B7280", marginLeft: 8 }}>
                Created: {formatDate(displayTerms[0]?.createdAt)}
              </Text>
            </View>

            {/* Target Audience */}
            {displayTerms[0]?.targetAudience?.length > 0 && (
              <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 12 }}>
                <Icons.Users size={16} color="#6B7280" />
                <Text style={{ fontSize: 13, color: "#6B7280", marginLeft: 8 }}>
                  For: {displayTerms[0].targetAudience
                    .map(r => r.charAt(0).toUpperCase() + r.slice(1))
                    .join(", ")}
                </Text>
              </View>
            )}
          </View>
        </View>

      </ScrollView>
      <LoaderModal visible={(isFetching)} />
    </View>
  );
};

export default TermAndConditionsScreen;