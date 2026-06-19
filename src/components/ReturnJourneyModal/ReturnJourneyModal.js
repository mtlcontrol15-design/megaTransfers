import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, TextInput, Modal, ScrollView, Alert } from "react-native";
import { moderateScale } from "react-native-size-matters";

import getStyles from "./style";
import Icons from "../../assets/icons";
import LocationSearchModal from "../JourneyCard/components/LocationSearchModal";
import DateTimeSection from "../JourneyCard/components/VehicleSelection/DateTimeSection/DateTimeSection";
import Config from "react-native-config";

const ReturnJourneyModal = ({
    visible,
    onClose,
    returnJourneyData,
    setReturnJourneyData,
    colors,
    symbol,
    returnFare,
    primaryJourneyData = {}
}) => {
    // console.log('=======return fare is here', returnFare);
    // console.log('=======primary journey data is here', primaryJourneyData);

    const styles = getStyles(colors);
    const googleApiKey = Config.GOOGLE_MAPS_API_KEY;
    const MAX_DROPOFFS = 5;
    const [showSearchModal, setShowSearchModal] = useState(false);
    const [activeField, setActiveField] = useState(null);
    const [searchText, setSearchText] = useState("");

    const isAirportLocation = (address = "", terminal = "") => {
        return !!terminal || /airport|terminal/i.test(address || "");
    };

    useEffect(() => {
        if (visible) {

            const primaryPickup = primaryJourneyData.pickup || "";
            const primaryPickupCoords = primaryJourneyData.pickupCoords || null;
            const primaryPickupDoorNumber = primaryJourneyData.pickupDoorNumber || "";
            const primaryPickupTerminal = primaryJourneyData.terminal || "";

            const primaryDropoffs = primaryJourneyData.dropoffs || [];
            const primaryDropoffCoords = primaryJourneyData.dropoffCoords || [];
            const primaryDropoffDoorNumbers = primaryJourneyData.dropoffDoorNumbers || [];
            const primaryDropoffTerminals = primaryJourneyData.dropoffTerminals || [];
            const primaryDropoffIsAirportList = primaryJourneyData.dropoffIsAirportList || [];

            const fullLocations = [
                {
                    address: primaryPickup,
                    coords: primaryPickupCoords,
                    doorNumber: primaryPickupDoorNumber,
                    terminal: primaryPickupTerminal,
                    isAirport: primaryJourneyData.pickupIsAirport || isAirportLocation(primaryPickup, primaryPickupTerminal),
                },
                ...primaryDropoffs.map((drop, index) => ({
                    address: drop,
                    coords: primaryDropoffCoords[index] || null,
                    doorNumber: primaryDropoffDoorNumbers[index] || "",
                    terminal: primaryDropoffTerminals[index] || "",
                    isAirport: primaryDropoffIsAirportList[index] || isAirportLocation(drop, primaryDropoffTerminals[index]),
                })),
            ];

            const reversed = [...fullLocations].reverse();

            const returnPickup = reversed[0];

            const returnDropoffs = reversed.slice(1);

            setReturnJourneyData(prev => ({
                ...prev,

                pickup: returnPickup?.address || "",
                pickupCoords: returnPickup?.coords || null,
                pickupDoorNumber: returnPickup?.isAirport ? "" : returnPickup?.doorNumber || "",
                terminal: returnPickup?.isAirport ? returnPickup?.terminal || "" : "",

                dropoffs: returnDropoffs.map(item => item.address || ""),
                dropoffCoords: returnDropoffs.map(item => item.coords || null),
                dropoffDoorNumbers: returnDropoffs.map(item => item.isAirport ? "" : item.doorNumber || ""),
                dropoffTerminals: returnDropoffs.map(item => item.isAirport ? item.terminal || "" : ""),
                dropoffIsAirportList: returnDropoffs.map(item => !!item.isAirport),

                pickupIsAirport: !!returnPickup?.isAirport,
                dropoffIsAirport: returnDropoffs.some(item => !!item.isAirport),

                // Inherit date and time from primary journey
                date: primaryJourneyData.date || "",
                hour: primaryJourneyData.hour || "",
                minute: primaryJourneyData.minute || "",
            }));
        }
    }, [visible, primaryJourneyData]);

    const openSearch = (field, index = null) => {
        setActiveField({ field, index });
        setSearchText(
            field === "dropoff" ? returnJourneyData.dropoffs[index] : returnJourneyData[field] || ""
        );
        setShowSearchModal(true);
    };

    const handleSelectLocation = (item) => {
        if (activeField.field === "dropoff") {
            const updatedDropoffs = [...returnJourneyData.dropoffs];
            const updatedCoords = [...(returnJourneyData.dropoffCoords || [])];
            const updatedDoorNumbers = [...(returnJourneyData.dropoffDoorNumbers || [])];
            const updatedTerminals = [...(returnJourneyData.dropoffTerminals || [])];
            const updatedIsAirport = [...(returnJourneyData.dropoffIsAirportList || [])];

            updatedDropoffs[activeField.index] = item.description;
            updatedCoords[activeField.index] = item.coordinates;
            updatedDoorNumbers[activeField.index] = "";
            updatedTerminals[activeField.index] = "";
            updatedIsAirport[activeField.index] = !!item.isAirport;

            setReturnJourneyData(prev => ({
                ...prev,
                dropoffs: updatedDropoffs,
                dropoffCoords: updatedCoords,
                dropoffDoorNumbers: updatedDoorNumbers,
                dropoffTerminals: updatedTerminals,
                dropoffIsAirportList: updatedIsAirport,
                dropoffIsAirport: updatedIsAirport.some(Boolean),
            }));
        } else {
            setReturnJourneyData(prev => ({
                ...prev,
                [activeField.field]: item.description,
                [`${activeField.field}Coords`]: item.coordinates,
                [`${activeField.field}IsAirport`]: item.isAirport,
                ...(activeField.field === "pickup"
                    ? {
                        pickupDoorNumber: "",
                        terminal: "",
                        flightNumber: "",
                        arrivefrom: "",
                        pickmeAfter: "",
                    }
                    : {}),
            }));
        }
        setShowSearchModal(false);
    };

    const addDropoff = () => {
        if (!canAddDropoff) return;
        setReturnJourneyData(prev => ({
            ...prev,
            dropoffs: [...prev.dropoffs, ""],
            dropoffCoords: [...(prev.dropoffCoords || []), null],
            dropoffDoorNumbers: [...(prev.dropoffDoorNumbers || []), ""],
            dropoffTerminals: [...(prev.dropoffTerminals || []), ""],
            dropoffIsAirportList: [...(prev.dropoffIsAirportList || []), false],
        }));
    };

    const lastDropoffFilled = returnJourneyData.dropoffs[returnJourneyData.dropoffs.length - 1]?.trim() !== "";
    const canAddDropoff = lastDropoffFilled && returnJourneyData.dropoffs.length < MAX_DROPOFFS;
    const pickupSelected = returnJourneyData.pickup && returnJourneyData.pickup.trim() !== "";
    const pickupIsAirport = !!returnJourneyData.pickupIsAirport;

    const removeDropoff = (index) => {
        Alert.alert(
            "Remove Location",
            "Are you sure you want to remove this dropoff location?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "OK", onPress: () => {
                        const updatedDropoffs = [...returnJourneyData.dropoffs];
                        const updatedCoords = [...(returnJourneyData.dropoffCoords || [])];
                        const updatedDoorNumbers = [...(returnJourneyData.dropoffDoorNumbers || [])];
                        const updatedTerminals = [...(returnJourneyData.dropoffTerminals || [])];
                        const updatedIsAirport = [...(returnJourneyData.dropoffIsAirportList || [])];

                        updatedDropoffs.splice(index, 1);
                        updatedCoords.splice(index, 1);
                        updatedDoorNumbers.splice(index, 1);
                        updatedTerminals.splice(index, 1);
                        updatedIsAirport.splice(index, 1);

                        const newDropoffs = updatedDropoffs.length ? updatedDropoffs : [""];

                        setReturnJourneyData(prev => ({
                            ...prev,
                            dropoffs: newDropoffs,
                            dropoffCoords: updatedCoords.length ? updatedCoords : [null],
                            dropoffDoorNumbers: updatedDoorNumbers.length ? updatedDoorNumbers : [""],
                            dropoffTerminals: updatedTerminals.length ? updatedTerminals : [""],
                            dropoffIsAirportList: updatedIsAirport.length ? updatedIsAirport : [false],
                            dropoffIsAirport: updatedIsAirport.some(Boolean),
                        }));
                    }
                }
            ]
        );
    };

    const handleFlightNumberChange = (text) => {
        setReturnJourneyData(prev => ({ ...prev, flightNumber: text }));
    };

    const handleArrivefromChange = (text) => {
        setReturnJourneyData(prev => ({ ...prev, arrivefrom: text }));
    };

    const handlePickMeAfterChange = (text) => {
        setReturnJourneyData(prev => ({ ...prev, pickmeAfter: text }));
    };

    const handleDoorNumberChange = (text) => {
        setReturnJourneyData(prev => ({ ...prev, pickupDoorNumber: text }));
    };

    const handleDropoffDoorNumberChange = (text, index) => {
        const updated = [...(returnJourneyData.dropoffDoorNumbers || [])];
        updated[index] = text;

        setReturnJourneyData(prev => ({
            ...prev,
            dropoffDoorNumbers: updated,
        }));
    };

    const handleTerminalChange = (text, index) => {
        const updated = [...(returnJourneyData.dropoffTerminals || [])];
        updated[index] = text;

        setReturnJourneyData(prev => ({
            ...prev,
            dropoffTerminals: updated,
        }));
    };

    const handleNotesChange = (text) => {
        setReturnJourneyData(prev => ({ ...prev, notes: text }));
    };

    return (
        <Modal transparent visible={visible} animationType="slide">
            <View style={styles.overlay}>
                <View style={styles.modalContainer}>
                    {/* Header */}
                    <View style={styles.header}>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <Icons.X size={24} color={colors.white} />
                        </TouchableOpacity>
                        <Text style={styles.headerTitle}>Return Journey Details</Text>
                        <Text style={styles.fare}>{symbol}{returnFare || 0}</Text>
                    </View>

                    {/* Content */}
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ paddingBottom: 30 }}
                        style={styles.content}
                    >
                        <View style={styles.card}>
                            {/* Pickup Section */}
                            <View style={styles.section}>
                                <Text style={styles.label}>Return Pickup Location *</Text>
                                <TouchableOpacity style={styles.input} onPress={() => openSearch("pickup")}>
                                    <Icons.MapPin size={18} color={colors.placeholder} />
                                    <Text style={styles.inputText}>
                                        {returnJourneyData.pickup || "Enter pickup address"}
                                    </Text>
                                </TouchableOpacity>

                                {pickupSelected && (
                                    pickupIsAirport ? (
                                        <View>
                                            <View style={{ flexDirection: "row", gap: 10 }}>
                                                <View style={{ flex: 1 }}>
                                                    <Text style={styles.label}>Flight Number</Text>
                                                    <TextInput
                                                        value={returnJourneyData.flightNumber || ""}
                                                        onChangeText={handleFlightNumberChange}
                                                        placeholder="BA2490"
                                                        placeholderTextColor={colors.gray300}
                                                        style={styles.input}
                                                        maxLength={15}
                                                    />
                                                </View>
                                                <View style={{ flex: 1 }}>
                                                    <Text style={styles.label}>Arriving From</Text>
                                                    <TextInput
                                                        value={returnJourneyData.arrivefrom || ""}
                                                        onChangeText={handleArrivefromChange}
                                                        placeholder="Dubai"
                                                        placeholderTextColor={colors.gray300}
                                                        style={styles.input}
                                                        maxLength={20}
                                                    />
                                                </View>
                                            </View>

                                            <View style={{ alignItems: "center", marginTop: 0 }}>
                                                <View style={{ width: "60%" }}>
                                                    <Text style={[styles.label, { textAlign: "center" }]}>
                                                        Pick Me After (mins)
                                                    </Text>
                                                    <TextInput
                                                        value={returnJourneyData.pickmeAfter || ""}
                                                        onChangeText={handlePickMeAfterChange}
                                                        placeholder="30"
                                                        placeholderTextColor={colors.gray300}
                                                        style={[styles.input, { textAlign: "center" }]}
                                                        keyboardType="number-pad"
                                                        maxLength={3}
                                                    />
                                                </View>
                                            </View>
                                        </View>
                                    ) : (
                                        <View>
                                            <Text style={styles.label}>Door Number (Optional)</Text>
                                            <TextInput
                                                value={returnJourneyData.pickupDoorNumber || ""}
                                                onChangeText={handleDoorNumberChange}
                                                placeholder="Door / House No."
                                                placeholderTextColor={colors.gray300}
                                                style={styles.input}
                                            />
                                        </View>
                                    )
                                )}
                            </View>

                            {/* Dropoff Section */}
                            <View style={styles.section}>
                                <Text style={styles.label}>Dropoff Location *</Text>

                                {returnJourneyData.dropoffs.map((drop, index) => {
                                    const isLast = index === returnJourneyData.dropoffs.length - 1;
                                    const isFilled = drop?.trim() !== "";
                                    const dropoffIsAirport = !!returnJourneyData.dropoffIsAirportList?.[index];

                                    return (
                                        <View key={index} style={styles.dropoffItem}>
                                            <View style={styles.inputWrapper}>
                                                <TouchableOpacity
                                                    style={[styles.input, styles.searchInput]}
                                                    onPress={() => openSearch("dropoff", index)}
                                                >
                                                    <Icons.MapPin size={18} color={colors.placeholder} />
                                                    <Text numberOfLines={2} ellipsizeMode="tail" style={styles.inputText}>
                                                        {drop || `Enter dropoff ${index + 1}`}
                                                    </Text>
                                                </TouchableOpacity>

                                                <View style={styles.listWrapper}>
                                                    {returnJourneyData.dropoffs.length > 1 && (
                                                        <TouchableOpacity
                                                            onPress={() => removeDropoff(index)}
                                                            style={styles.buttonMinus}
                                                        >
                                                            <Icons.Minus size={18} color={colors?.white} />
                                                        </TouchableOpacity>
                                                    )}
                                                    {isLast && isFilled && returnJourneyData.dropoffs.length < MAX_DROPOFFS && (
                                                        <TouchableOpacity
                                                            onPress={addDropoff}
                                                            style={styles.buttonPlus}
                                                        >
                                                            <Icons.Plus size={18} color={colors?.white} />
                                                        </TouchableOpacity>
                                                    )}
                                                </View>
                                            </View>

                                            {dropoffIsAirport ? (
                                                <View style={styles.fieldBelow}>
                                                    <Text style={styles.label}>Terminal (Optional)</Text>
                                                    <TextInput
                                                        value={returnJourneyData.dropoffTerminals?.[index] || ""}
                                                        onChangeText={(text) => handleTerminalChange(text, index)}
                                                        placeholder="Terminal Number"
                                                        placeholderTextColor={colors.gray300}
                                                        style={styles.input}
                                                        maxLength={10}
                                                    />
                                                </View>
                                            ) : (
                                                <View style={styles.fieldBelow}>
                                                    <Text style={styles.label}>Door Number (Optional)</Text>
                                                    <TextInput
                                                        value={returnJourneyData.dropoffDoorNumbers?.[index] || ""}
                                                        onChangeText={(text) => handleDropoffDoorNumberChange(text, index)}
                                                        placeholder="Door / House Number"
                                                        placeholderTextColor={colors.gray300}
                                                        style={styles.input}
                                                    />
                                                </View>
                                            )}
                                        </View>
                                    );
                                })}
                            </View>

                            {/* Date & Time Section */}
                            <View style={[styles.section, { marginVertical: 0 }]}>
                                <DateTimeSection
                                    journeyData={returnJourneyData}
                                    setJourneyData={setReturnJourneyData}
                                    colors={colors}
                                    errors={{}}
                                    touched={{}}
                                    setFieldValue={() => { }}
                                    setFieldTouched={() => { }}
                                    values={returnJourneyData}
                                    validateForm={() => { }}
                                />
                            </View>

                            {/* Notes Section */}
                            <View style={styles.section}>
                                <Text style={[styles.label, { marginTop: 0 }]}>Notes (Optional)</Text>
                                <TextInput
                                    multiline
                                    numberOfLines={3}
                                    value={returnJourneyData.notes || ""}
                                    onChangeText={handleNotesChange}
                                    placeholder="Driver instructions optional ..."
                                    placeholderTextColor={colors.gray300}
                                    style={styles.notes}
                                />
                            </View>
                        </View>
                    </ScrollView>

                    {/* Footer Buttons */}
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            style={[styles.button, styles.cancelButton]}
                            onPress={onClose}
                        >
                            <Text style={styles.cancelButtonText}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.button, styles.confirmButton]}
                            onPress={onClose}
                        >
                            <Text style={styles.confirmButtonText}>Save Return Journey</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Location Search Modal */}
                    <LocationSearchModal
                        visible={showSearchModal}
                        onClose={() => setShowSearchModal(false)}
                        searchText={searchText}
                        setSearchText={setSearchText}
                        onSelect={handleSelectLocation}
                        field={activeField}
                        colors={colors}
                        apiKey={googleApiKey}
                    />
                </View>
            </View>
        </Modal>
    );
};

export default ReturnJourneyModal;