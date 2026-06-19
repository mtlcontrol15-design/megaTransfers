import { View, Text, TouchableOpacity, ScrollView, Image, Linking } from "react-native";
import { useTheme } from "@react-navigation/native";

import getStyles from "./style";
import Icons from "../../assets/icons";
import { useSelector } from "react-redux";
import { EndPoints } from "../../services/EndPoints";
import { formatPhoneWithPlus } from "../../utils/phoneUtils";
import queryHandler from "../../services/queries/queryHandler";


const SupportScreen = ({ navigation }) => {
  const { colors } = useTheme();
  const styles = getStyles(colors);

  const { user } = useSelector(state => state.userReducer);
  const isCustomer = user?.role === "customer" || user?.role === "corporate";

  const { data: companyData, error: companyDataError, status: companyStatus, isFetching: companyDataFetching, refetch: companyDataRefetch } = queryHandler(EndPoints.getCompanyDetailsCustomer);
  const { data, error, status, isFetching, refetch } = queryHandler(EndPoints.getCompanyDetails);

  // console.log('========companyData', companyData);

  const companyInfo = isCustomer
    ? companyData?.data || {}
    : data?.data || data || {};

  const handleCall = () => {
    if (companyInfo?.contact) {
      const phone = formatPhoneWithPlus(companyInfo.contact);
      Linking.openURL(`tel:${phone}`);
    }
  };

  const handleEmail = () => {
    if (companyInfo?.email) {
      Linking.openURL(`mailto:${companyInfo.email}`);
    }
  };

  const handleWhatsApp = () => {
    if (companyInfo?.contact) {
      const phone = formatPhoneWithPlus(companyInfo.contact);
      Linking.openURL(`https://wa.me/${phone}`);
    }
  };

  const handleLiveChat = () => {
    navigation.navigate("ChatPages");
  };

  const supportItems = [
    {
      title: "Call Support",
      description: "Speak directly with our support team",
      icon: Icons.Phone,
      color: colors.lightGreen,
      action: handleCall,
    },
    {
      title: "Email Support",
      description: "Send us an email for help",
      icon: Icons.Mail,
      color: colors?.lightBlue,
      action: handleEmail,
    },
    {
      title: "Live Chat",
      description: "Start a conversation with support",
      icon: Icons.MessageCircle,
      color: colors?.lightBlue,
      action: handleLiveChat,
    },
    {
      title: "Terms & Conditions",
      description: "Review our policies and rules",
      icon: Icons.MessageCircle,
      color: colors?.error,
      action: () => navigation.navigate("TermAndConditions"),
    },
    {
      title: "24/7 Chat Support",
      description: "Instant WhatsApp messaging",
      icon: Icons.MessageCircle,
      color: colors?.lightGreen,
      action: handleWhatsApp,
    },
  ];


  return (
    <View style={{ flex: 1, backgroundColor: colors.white }}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}
          hitSlop={{ top: 30, bottom: 30, left: 30, right: 30 }}
        >
          <Icons.ArrowLeft size={24} color={colors.white} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Support</Text>

        <View
          style={[
            styles.roleBadge,
            {
              backgroundColor: isCustomer ? "#DCFCE7" : "#DBEAFE",
            },
          ]}
        >
          <Text
            style={[
              styles.roleText,
              { color: isCustomer ? "#15803D" : "#1D4ED8" },
            ]}
          >
            {isCustomer ? "CUSTOMER" : "DRIVER"}
          </Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.welcomeContainer}>
          <Text style={styles.welcomeTitle}>
            Welcome to {isCustomer ? "Customer" : "Driver"} Support
          </Text>
          {/* <Text style={styles.welcomeDesc}>
            {isCustomer
              ? "We're here to help with your booking needs"
              : "Get assistance with your driving assignments"}
          </Text> */}
        </View>
        {companyInfo?.contact && (
          <View style={styles.companyCard}>
            <View style={{ paddingVertical: 0 }}>
              <View style={styles.logoContainer}>
                {companyInfo.logo ? (
                  <Image
                    source={{ uri: companyInfo.logo }}
                    style={styles.logo}
                  />
                ) : (
                  <View style={styles.logoPlaceholder}>
                    <Text style={styles.logoLetter}>{firstLetter}</Text>
                  </View>
                )}
              </View>

              <Text
                style={styles?.companyName}
              >
                {companyInfo?.name || "Company"}
              </Text>
              <View
                style={styles?.companyInner}
              >

                {companyInfo.contact && (
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                    <Icons.Phone size={18} color={colors.gray600} />
                    <Text style={{ color: colors.text }}>
                      {formatPhoneWithPlus(companyInfo.contact)}
                    </Text>
                  </View>
                )}

                {companyInfo.email && (
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                    <Icons.Mail size={18} color={colors.gray600} />
                    <Text ellipsizeMode="tail" numberOfLines={2} style={{ color: colors.text ,width:'75%'}}>
                      {companyInfo.email}
                    </Text>
                  </View>
                )}

                {companyInfo.address && (
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                    <Icons.MapPin size={18} color={colors.gray600} />
                    <Text style={{ color: colors.text }}>
                      {companyInfo.address}
                    </Text>
                  </View>
                )}

              </View>
            </View>
          </View>
        )}

        <View style={styles.helpContainer}>
          <Text style={styles.helpTitle}>Quick Help Options</Text>

          {supportItems.map((item, index) => {
            const Icon = item.icon;

            return (
              <TouchableOpacity
                key={index}
                style={[
                  styles.supportItem,
                  { borderLeftColor: item.color },
                ]}
                activeOpacity={0.7}
                onPress={item.action}
              >
                <View
                  style={[
                    styles.iconBox,
                    { backgroundColor: `${item.color}15` },
                  ]}
                >
                  <Icon size={20} color={item.color} />
                </View>

                <View style={{ flex: 1 }}>
                  <Text style={styles.itemTitle}>{item.title}</Text>
                  <Text style={styles.itemDesc}>{item.description}</Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
};

export default SupportScreen;