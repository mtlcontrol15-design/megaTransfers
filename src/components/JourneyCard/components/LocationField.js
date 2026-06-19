// components/JourneyCard/components/LocationField.js

import React from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import Icons from "../../../assets/icons";

const LocationField = ({
  type,
  journeyData,
  setJourneyData,
  openSearchModal,
  locationType,
  colors
}) => {

  const label =
    type === "pickup" ? "Pickup Location" : "Dropoff Location";

  const value =
    type === "pickup"
      ? journeyData.pickup
      : journeyData.dropoff;

  const handleInputChange = (field, value) => {
    setJourneyData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <View style={{ marginBottom: 16 }}>

      {/* LABEL */}
      <Text
        style={{
          fontSize: 14,
          fontWeight: "600",
          marginBottom: 6,
          color: colors.text
        }}
      >
        {label}
      </Text>

      {/* LOCATION BUTTON */}
      <TouchableOpacity
        onPress={() => openSearchModal(type)}
        style={{
          flexDirection: "row",
          alignItems: "center",
          borderWidth: 1,
          borderColor: colors.border,
          padding: 12,
          borderRadius: 10,
          backgroundColor: colors.bg
        }}
      >
        <Icons.MapPin size={18} color={colors.placeholder} />

        <Text
          numberOfLines={1}
          style={{
            marginLeft: 10,
            flex: 1,
            color: value ? colors.text : colors.placeholder
          }}
        >
          {value || `Enter ${type} address`}
        </Text>
      </TouchableOpacity>

      {/* PICKUP LOCATION EXTRA */}
      {type === "pickup" && locationType === "location" && (
        <TextInput
          style={{
            borderWidth: 1,
            borderColor: colors.border,
            borderRadius: 10,
            padding: 12,
            marginTop: 8,
            backgroundColor: colors.bg,
            color: colors.text
          }}
          placeholder="Pickup Door Number (Optional)"
          placeholderTextColor={colors.placeholder}
          value={journeyData.pickupDoorNumber || ""}
          onChangeText={(text) =>
            handleInputChange("pickupDoorNumber", text)
          }
        />
      )}

      {/* PICKUP AIRPORT */}
      {type === "pickup" && locationType === "airport" && (
        <View style={{ flexDirection: "row", marginTop: 8 }}>

          <TextInput
            style={{
              flex: 1,
              borderWidth: 1,
              borderColor: colors.border,
              borderRadius: 10,
              padding: 12,
              backgroundColor: colors.bg,
              color: colors.text
            }}
            placeholder="Flight Number"
            placeholderTextColor={colors.placeholder}
            value={journeyData.flightNumber || ""}
            onChangeText={(text) =>
              handleInputChange("flightNumber", text)
            }
          />

          <View style={{ width: 8 }} />

          <TextInput
            style={{
              flex: 1,
              borderWidth: 1,
              borderColor: colors.border,
              borderRadius: 10,
              padding: 12,
              backgroundColor: colors.bg,
              color: colors.text
            }}
            placeholder="Arriving From"
            placeholderTextColor={colors.placeholder}
            value={journeyData.arrivefrom || ""}
            onChangeText={(text) =>
              handleInputChange("arrivefrom", text)
            }
          />

        </View>
      )}

      {/* DROPOFF AIRPORT */}
      {type === "dropoff" && locationType === "airport" && (
        <TextInput
          style={{
            borderWidth: 1,
            borderColor: colors.border,
            borderRadius: 10,
            padding: 12,
            marginTop: 8,
            backgroundColor: colors.bg,
            color: colors.text
          }}
          placeholder="Terminal Number (Optional)"
          placeholderTextColor={colors.placeholder}
          value={journeyData.terminal || ""}
          onChangeText={(text) =>
            handleInputChange("terminal", text)
          }
        />
      )}

    </View>
  );
};

export default LocationField;