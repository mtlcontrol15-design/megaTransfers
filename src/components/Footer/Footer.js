import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";

import { moderateScale, verticalScale, scale } from "react-native-size-matters";

import Icons from "../../assets/icons";
import { useSelector } from "react-redux";
import { Theme } from "../../libs";

const Footer = ({ colors, navigation, chatCount, dashBoardCustomer }) => {

    const { user } = useSelector(state => state.userReducer);

    // console.log('======user',user);

    const isDriver = user?.role === "driver";
    const isCustomer = user?.role === "customer" || user?.role === "corporate";
    const isCorporate = user?.role === "corporate";
    const driverId = user?.employeeNumber;
    const customerId = user?.vatnumber;


    const [showDetails, setShowDetails] = useState(false);


    const userImage = user?.profileImage;
    // const companyLogo = user?.superadminCompanyLogo;
    const companyLogo = user?.profileImage;
    const userName = user?.fullName;
    const companyName = user?.fullName;

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

    const actions = isCustomer
        ? ["New Booking", "Chat", "Map", "Support"]
        : ["Chat", "Map", "Support", "Profile"];

    const displayName = isCustomer ? userName : companyName;
    const displayImage = isCustomer ? userImage : companyLogo;

    const initials = getInitials(displayName);
    const showImage = isValidImage(displayImage);
    const userId = user?.id || (isDriver ? driverId : customerId);

    const roleLabel = isDriver
        ? "Driver"
        : isCorporate
            ? "Corporate"
            : "Customer";

    const roleEmoji = isDriver
        ? "🚚"
        : isCorporate
            ? "🏢"
            : "👤";
    const showVat = isCustomer && !!customerId;
    return (
        <View
            style={[
                styles.container,
                {
                    backgroundColor: colors?.white,
                    borderTopColor: colors.gray200,
                },
            ]}
        >
            {/* Toggle Button */}
            <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => setShowDetails(!showDetails)}
                style={styles.toggleBtn}
            >
                <Text style={styles.toggleText}>
                    {isDriver
                        ? showDetails
                            ? "Hide Driver Details"
                            : "See Driver Details"
                        : isCorporate
                            ? showDetails
                                ? "Hide Corporate Details"
                                : "See Corporate Details"
                            : showDetails
                                ? "Hide Customer Details"
                                : "See Customer Details"
                    }
                </Text>

                {showDetails ? (
                    <Icons.ChevronUp size={16} color={colors.bttonColor} />
                ) : (
                    <Icons.ChevronDown size={16} color={colors.bttonColor} />
                )}
            </TouchableOpacity>

            {showDetails && (
                <View style={styles.profileOverlay}>
                    <View style={styles.profileRow}>
                        <View style={styles.profileLeft}>
                            <View style={{ flexDirection: "row", alignItems: "center", gap: scale(14) }}>
                                {showImage ? (
                                    <TouchableOpacity activeOpacity={0.7} onPress={() => navigation.navigate('ProfileTab')}>
                                        <Image
                                            source={{ uri: displayImage }}
                                            style={[
                                                styles.avatar,
                                                isCustomer && { borderRadius: moderateScale(50) }
                                            ]}
                                        />
                                    </TouchableOpacity>
                                ) : (
                                    <TouchableOpacity activeOpacity={0.7} onPress={() => navigation.navigate('ProfileTab')}
                                        style={[
                                            styles.avatar,
                                            { backgroundColor: colors.secondary },
                                            isCustomer && { borderRadius: moderateScale(50) }
                                        ]}
                                    >
                                        <Text
                                            style={{
                                                fontSize: moderateScale(16),
                                                fontWeight: "bold",
                                                color: colors.bttonColor,
                                            }}
                                        >
                                            {initials}
                                        </Text>
                                    </TouchableOpacity>
                                )}

                                <View>
                                    <Text
                                        numberOfLines={1}
                                        style={{
                                            fontSize: moderateScale(14),
                                            fontWeight: "600",
                                            color: colors.black,
                                            maxWidth: scale(110),
                                        }}
                                    >
                                        {displayName}
                                    </Text>

                                    {/* <View style={styles.roleBadge}>
                                        <Text
                                            style={{
                                                fontSize: moderateScale(10),
                                                color: colors.gray600,
                                            }}
                                        >
                                            {roleEmoji} {roleLabel}
                                        </Text>
                                    </View> */}
                                </View>
                            </View>

                            {!dashBoardCustomer && (
                                <View style={[styles.idBadge, { backgroundColor: colors.gray600 }]}>
                                    <Text style={{ fontSize: moderateScale(11), color: colors.white }}>
                                        {showVat ? `VAT No : ${customerId}` : `${roleLabel} ID : ${userId}`}
                                    </Text>
                                </View>
                            )}
                        </View>
                    </View>
                </View>
            )}
            <View style={styles.actionsRow}>

                {actions.map((label, index) => {

                    let IconComponent;

                    if (label === "New Booking") {
                        IconComponent = Icons.Plus;
                    } else if (label === "Chat") {
                        IconComponent = Icons.MessageSquare;
                    } else if (label === "Map") {
                        IconComponent = Icons.Map;
                    } else if (label === "Support") {
                        IconComponent = Icons.Phone;
                    } else if (label === "Profile") {
                        IconComponent = Icons.User;
                    }

                    return (
                        <View
                            key={index}
                            style={styles.actionItem}
                        >
                            <TouchableOpacity
                                activeOpacity={0.7}
                                onPress={() => {
                                    if (label === "New Booking") {
                                        navigation.navigate("NewBooking");
                                    } else if (label === "Chat") {
                                        navigation.navigate("ChatPages");
                                    } else if (label === "Map") {
                                        navigation.navigate("MapScreen");
                                    } else if (label === "Support") {
                                        navigation.navigate("Support");
                                    } else if (label === "Profile") {
                                        navigation.navigate("Profile");
                                    }
                                }}
                                style={[
                                    styles.iconContainer,
                                    { backgroundColor: colors.white },
                                ]}
                            >
                                <IconComponent size={24} color={colors.bttonColor} />
                            </TouchableOpacity>

                            <Text
                                style={{
                                    fontSize: moderateScale(11),
                                    color: colors.bttonColor,
                                    width: scale(80),
                                    textAlign: "center",
                                }}
                            >
                                {label}
                            </Text>

                            {label === "Chat" && chatCount > 0 && (
                                <View
                                    style={[
                                        styles.badge,
                                        isCustomer
                                            ? {
                                                top: -verticalScale(6),
                                                right: scale(18),
                                            }
                                            : {
                                                top: -verticalScale(7),
                                                right: scale(25),
                                            },
                                    ]}
                                >
                                    <Text style={styles.badgeText}>{chatCount}</Text>
                                </View>
                            )}
                        </View>
                    );
                })}
            </View>
        </View>
    );
};

export default Footer;

const styles = StyleSheet.create({
    container: {
        borderTopWidth: 1,
        paddingHorizontal: scale(16),
        paddingVertical: verticalScale(2),
    },

    profileRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: verticalScale(8),
    },

    profileLeft: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: 'space-between'
    },

    avatar: {
        width: scale(46),
        height: scale(46),
        borderRadius: scale(23),
        // borderWidth: 2,
        alignItems: "center",
        justifyContent: "center",
    },

    roleBadge: {
        marginTop: verticalScale(4),
        paddingHorizontal: scale(10),
        paddingVertical: verticalScale(3),
        borderRadius: scale(20),
        backgroundColor: "#F3F4F6",
        alignSelf: "flex-start",
    },

    idBadge: {
        paddingHorizontal: scale(10),
        paddingVertical: verticalScale(6),
        borderRadius: scale(20),
        // borderWidth: 1,
    },

    actionsRow: {
        flexDirection: "row",
        justifyContent: "space-between",
    },

    actionItem: {
        alignItems: "center",
        flex: 1,
    },

    iconContainer: {
        width: scale(38),
        height: scale(38),
        borderRadius: scale(8),
        alignItems: "center",
        justifyContent: "center",
        marginBottom: verticalScale(6),
        borderWidth: 1,
        borderColor: Theme?.colors.red
    },

    badge: {
        position: "absolute",
        top: -verticalScale(7),
        right: scale(25),
        backgroundColor: "#EF4444",
        minWidth: scale(16),
        height: scale(16),
        borderRadius: scale(8),
        alignItems: "center",
        justifyContent: "center",
    },

    badgeText: {
        fontSize: moderateScale(9),
        color: "#FFFFFF",
        fontWeight: "bold",
    },
    toggleBtn: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: scale(6),
        marginBottom: verticalScale(6),
    },

    toggleText: {
        color: Theme?.colors?.red,
        fontSize: moderateScale(12),
        fontWeight: "600",
    },

    profileOverlay: {
        position: "absolute",
        bottom: verticalScale(75),
        left: 0,
        right: 0,
        backgroundColor: Theme?.colors.gray200,
        paddingHorizontal: scale(16),
        paddingVertical: verticalScale(10),
        borderTopWidth: 1,
        borderColor: "#ffffff20",
        zIndex: 10,
    },
});