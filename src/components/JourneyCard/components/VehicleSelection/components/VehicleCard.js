// components/VehicleSelection/components/VehicleCard.js

import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import Icons from "../../../../../assets/icons";
import images from '../../../../../assets/images';
import { moderateScale } from "react-native-size-matters";
import { Dimensions } from "react-native";

const VehicleCard = ({ vehicle, selected, onSelect, colors, extras }) => {

    // console.log('========vehicle data is here', vehicle);

    const SCREEN_WIDTH = Dimensions.get("window").width;
    const CARD_WIDTH = SCREEN_WIDTH * 0.82;


    return (
        <TouchableOpacity
            onPress={onSelect}
            style={{
                // flex:1,
                width: CARD_WIDTH,
                minHeight: moderateScale(210),
                marginHorizontal: 6,
                borderRadius: 14,
                borderWidth: selected ? 2 : 1,
                borderColor: selected ? colors.lightBlue : "#e5e7eb",
                padding: 12,
                backgroundColor: "#fff",
                justifyContent: 'space-between'
            }}
        >

            {vehicle?.image ? (
                <Image
                    source={{ uri: vehicle.image }}
                    style={{
                        width: "100%",
                        height: moderateScale(120),
                        resizeMode: "contain",
                        alignSelf: "center",
                    }}
                />
            ) : (
                <View
                    style={{
                        width: "100%",
                        height: moderateScale(120),
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: "#f3f4f6",
                        borderRadius: 10,
                    }}
                >
                    <Icons.ImageOff size={40} color="#9ca3af" />
                </View>
            )}
            <View>
                <Text
                    style={{
                        fontSize: 15,
                        fontWeight: "600",
                        marginTop: 6,
                        color: "#111827"
                    }}
                >
                    {vehicle.vehicleName}
                </Text>
                <View style={{ flexDirection: "row", marginTop: 6, justifyContent: 'space-between' }}>

                    <View style={{ flexDirection: "row", alignItems: "center", marginRight: 8 }}>
                        <Icons.User size={14} color="#6b7280" />
                        <Text style={{ marginLeft: 4 }}>
                            {extras?.passenger || 0}/{vehicle.passengers}
                        </Text>
                    </View>

                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <Icons.Baby size={14} color="#6b7280" />
                        <Text style={{ marginLeft: 4 }}>
                            {extras?.childSeat || 0}/{vehicle.childSeat}
                        </Text>
                    </View>
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <Icons.Briefcase size={14} color="#6b7280" />
                        <Text style={{ marginLeft: 4 }}>
                            {extras?.handLuggage || 0}/{vehicle.handLuggage}
                        </Text>
                    </View>
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <Icons.Luggage size={14} color="#6b7280" />
                        <Text style={{ marginLeft: 4 }}>
                            {extras?.checkinLuggage || 0}/{vehicle.checkinLuggage}
                        </Text>
                    </View>

                </View>
            </View>

        </TouchableOpacity>
    );
};

export default VehicleCard;