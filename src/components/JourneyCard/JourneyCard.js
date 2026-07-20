import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, TextInput, Alert } from "react-native";

import Config from "react-native-config";
import { moderateScale } from "react-native-size-matters";

import getStyles from "./style";
import Icons from "../../assets/icons";
import LocationSearchModal from "./components/LocationSearchModal";
import DateTimeSection from "./components/VehicleSelection/DateTimeSection/DateTimeSection";
import { Switch } from "react-native-switch";

const JourneyCard = ({
    journeyData,
    setJourneyData,
    fare,
    mode,
    screenMode = "create",
    booking = null,
    selectedHourly,
    colors,
    symbol,
    errors,
    touched,
    values,
    setFieldValue,
    setFieldTouched,
    validateForm,
    setSelectedHourly,
    hourlyData,
    hourlyWarning,
    isReturnJourney = false,
    setIsReturnJourney = () => { },
    onOpenReturnModal = () => { },
    oldAddresses = []
}) => {
    const styles = getStyles(colors);
    const googleApiKey = Config.GOOGLE_MAPS_API_KEY;
    const MAX_DROPOFFS = 5;
    const [showSearchModal, setShowSearchModal] = useState(false);
    const [activeField, setActiveField] = useState(null);
    const [searchText, setSearchText] = useState("");
    const [showPackages, setShowPackages] = useState(false);

    // Validate if primary journey information is complete
    const isPrimaryJourneyComplete = () => {
        const hasPickup = values.pickup && values.pickup.trim() !== "";
        const hasDropoff = values.dropoff && values.dropoff.trim() !== "";
        const hasDate = journeyData.date && journeyData.date.trim() !== "";
        const hasTime = journeyData.hour && journeyData.minute;

        return hasPickup && hasDropoff && hasDate && hasTime;
    };

    const handleSwitchToggle = (val) => {
        // Check if editing a return journey booking - prevent toggle
        if (screenMode === "edit" && booking?.returnJourneyToggle === true) {
            Alert.alert(
                "Cannot Modify Journey Type",
                "This is a return journey booking. You cannot change its mode.",
                [{ text: "OK", style: "default" }]
            );
            return;
        }

        if (val && !isPrimaryJourneyComplete()) {
            Alert.alert(
                "Complete Primary Journey First",
                "Please provide all primary journey information (pickup, dropoff, date, and time) before enabling return journey.",
                [{ text: "OK", style: "default" }]
            );
            return;
        }
        setIsReturnJourney(val);
        if (val) {
            onOpenReturnModal();
        }
    };

    const openSearch = (field, index = null) => {
        setActiveField({ field, index });
        const initialText =
            field === "dropoff"
                ? journeyData.dropoffs[index]
                : field === "dropoffOldAddress"
                    ? journeyData.dropoffOldAddresses?.[index] || ""
                    : journeyData[field] || "";
        setSearchText(initialText);
        setShowSearchModal(true);
    };

    const handleSelectLocation = (item) => {

        // console.log('========item is here', item);

        if (activeField.field === "dropoff") {
            const updatedDropoffs = [...journeyData.dropoffs];
            const updatedCoords = [...(journeyData.dropoffCoords || [])];
            const updatedIsAirport = [...(journeyData.dropoffIsAirportList || [])];

            updatedDropoffs[activeField.index] = item.description;
            updatedCoords[activeField.index] = item.coordinates;
            updatedIsAirport[activeField.index] = item.isAirport;

            setJourneyData(prev => ({
                ...prev,
                dropoffs: updatedDropoffs,
                dropoffCoords: updatedCoords,
                dropoffIsAirportList: updatedIsAirport,
                dropoffIsAirport: updatedIsAirport.some(Boolean),
            }));
        } else {
            const newValue = item.description;

            if (activeField.field === 'dropoffOldAddress') {
                const updatedDropoffs = [...journeyData.dropoffs];
                const updatedCoords = [...(journeyData.dropoffCoords || [])];
                const updatedOldAddresses = [...(journeyData.dropoffOldAddresses || [])];

                updatedDropoffs[activeField.index] = newValue;
                updatedCoords[activeField.index] = item.coordinates;
                updatedOldAddresses[activeField.index] = newValue;

                setJourneyData(prev => ({
                    ...prev,
                    dropoffs: updatedDropoffs,
                    dropoffCoords: updatedCoords,
                    dropoffOldAddresses: updatedOldAddresses
                }));
                if (activeField.index === 0) {
                    setFieldValue('dropoff', updatedDropoffs[0] || '');
                    setFieldTouched('dropoff', true);
                }
            } else {
                if (activeField.field === 'oldAddress') {
                    // When selecting a saved address, sync both the address text AND coordinates to pickup
                    setJourneyData(prev => ({
                        ...prev,
                        [activeField.field]: newValue,
                        [`${activeField.field}Coords`]: item.coordinates,
                        [`${activeField.field}IsAirport`]: item.isAirport,
                        // Also sync to pickup for calculations
                        pickup: newValue,
                        pickupCoords: item.coordinates,
                        pickupIsAirport: item.isAirport
                    }));
                    setFieldValue('pickup', newValue);
                    setFieldTouched('pickup', true);
                } else {
                    setJourneyData(prev => ({
                        ...prev,
                        [activeField.field]: newValue,
                        [`${activeField.field}Coords`]: item.coordinates,
                        [`${activeField.field}IsAirport`]: item.isAirport
                    }));

                    setFieldValue(activeField.field, newValue);
                    setFieldTouched(activeField.field, true);

                    if (validateForm) {
                        setTimeout(() => {
                            validateForm();
                            setTimeout(() => {
                                validateForm();
                            }, 50);
                        }, 10);
                    }
                }
            }
        }
        setShowSearchModal(false);
    };
    useEffect(() => {
        if (journeyData.pickup && journeyData.pickup !== values.pickup) {
            setFieldValue('pickup', journeyData.pickup);
            setFieldTouched('pickup', false);
            if (validateForm) {
                validateForm();
            }
        }
        const currentDropoff = journeyData.dropoffs?.[0] || "";
        if (currentDropoff && currentDropoff !== values.dropoff) {
            setFieldValue('dropoff', currentDropoff);
            setFieldTouched('dropoff', true);
            if (validateForm) {
                validateForm();
            }
        }
        if (journeyData.date && journeyData.date !== values.date) {
            setFieldValue('date', journeyData.date);
            setFieldTouched('date', false);
        }
        if (journeyData.hour && journeyData.hour !== values.hour) {
            setFieldValue('hour', journeyData.hour);
            setFieldTouched('hour', false);
        }
        if (journeyData.minute && journeyData.minute !== values.minute) {
            setFieldValue('minute', journeyData.minute);
            setFieldTouched('minute', false);
        }
    }, [journeyData.pickup, journeyData.dropoffs, journeyData.date, journeyData.hour, journeyData.minute]);

    const addDropoff = () => {
        if (!canAddDropoff) return;
        setJourneyData(prev => ({
            ...prev,
            dropoffs: [...prev.dropoffs, ""],
            dropoffCoords: [...(prev.dropoffCoords || []), null],
            dropoffDoorNumbers: [...(prev.dropoffDoorNumbers || []), ""],
            dropoffTerminals: [...(prev.dropoffTerminals || []), ""],
            dropoffIsAirportList: [...(prev.dropoffIsAirportList || []), false],
        }));
    };

    const isAirportSelected = journeyData.pickupIsAirport || journeyData.dropoffIsAirport;
    const lastDropoffFilled = journeyData.dropoffs[journeyData.dropoffs.length - 1]?.trim() !== "";
    const canAddDropoff = lastDropoffFilled && journeyData.dropoffs.length < MAX_DROPOFFS;
    const pickupSelected = values.pickup && values.pickup.trim() !== "";

    const removeDropoff = (index) => {
        Alert.alert(
            "Remove Location",
            "Are you sure you want to remove this dropoff location?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "OK", onPress: () => {
                        const updatedDropoffs = [...journeyData.dropoffs];
                        const updatedCoords = [...(journeyData.dropoffCoords || [])];
                        const updatedDoorNumbers = [...(journeyData.dropoffDoorNumbers || [])];
                        const updatedTerminals = [...(journeyData.dropoffTerminals || [])];
                        const updatedIsAirport = [...(journeyData.dropoffIsAirportList || [])];

                        updatedDropoffs.splice(index, 1);
                        updatedCoords.splice(index, 1);
                        updatedDoorNumbers.splice(index, 1);
                        updatedTerminals.splice(index, 1);
                        updatedIsAirport.splice(index, 1);

                        const newDropoffs = updatedDropoffs.length ? updatedDropoffs : [""];
                        setJourneyData(prev => ({
                            ...prev,
                            dropoffs: newDropoffs,
                            dropoffCoords: updatedCoords.length ? updatedCoords : [null],
                            dropoffDoorNumbers: updatedDoorNumbers.length ? updatedDoorNumbers : [""],
                            dropoffTerminals: updatedTerminals.length ? updatedTerminals : [""],
                            dropoffIsAirportList: updatedIsAirport.length ? updatedIsAirport : [false],
                            dropoffIsAirport: updatedIsAirport.some(Boolean),
                        }));
                        const mainDropoff = newDropoffs[0] || "";
                        setFieldValue("dropoff", mainDropoff);
                        setFieldTouched("dropoff", true);
                        if (validateForm) {
                            setTimeout(() => validateForm(), 10);
                        }
                    }
                }
            ]
        );
    };
    const handleFlightNumberChange = (text) => {
        const limitedText = text.slice(0, 20);

        setJourneyData(prev => ({
            ...prev,
            flightNumber: limitedText,
        }));
    };


    const handleArrivefromChange = (text) => {
        const limitedText = text.slice(0, 20);

        setJourneyData(prev => ({
            ...prev,
            arrivefrom: limitedText,
        }));
    };

    const handlePickMeAfterChange = (text) => {
        setJourneyData(prev => ({ ...prev, pickmeAfter: text }));
    };

    const handleDoorNumberChange = (text) => {
        setJourneyData(prev => ({ ...prev, pickupDoorNumber: text }));
    };

    const handleNotesChange = (text) => {
        setJourneyData(prev => ({ ...prev, notes: text }));
    };

    const handleDropoffDoorNumberChange = (text, index) => {
        const updated = [...(journeyData.dropoffDoorNumbers || [])];
        updated[index] = text;

        setJourneyData(prev => ({
            ...prev,
            dropoffDoorNumbers: updated
        }));
    };

    const handleTerminalChange = (text, index) => {
        const updated = [...(journeyData.dropoffTerminals || [])];
        updated[index] = text;

        setJourneyData(prev => ({
            ...prev,
            dropoffTerminals: updated
        }));
    };

    const handlePickupClear = () => {
        setJourneyData(prev => ({
            ...prev,
            pickup: "",
            pickupCoords: null,
            pickupDoorNumber: ""
        }));
        setFieldValue('pickup', '');
        setFieldTouched('pickup', false);
    };

    const handleDropoffClear = (index) => {
        const updatedDropoffs = [...journeyData.dropoffs];
        const updatedCoords = [...(journeyData.dropoffCoords || [])];
        const updatedOldAddresses = [...(journeyData.dropoffOldAddresses || [])];
        const updatedDoorNumbers = [...(journeyData.dropoffDoorNumbers || [])];
        const updatedTerminals = [...(journeyData.dropoffTerminals || [])];
        const updatedIsAirport = [...(journeyData.dropoffIsAirportList || [])];

        updatedDropoffs[index] = "";
        updatedCoords[index] = null;
        updatedOldAddresses[index] = "";
        updatedDoorNumbers[index] = "";
        updatedTerminals[index] = "";
        updatedIsAirport[index] = false;

        setJourneyData(prev => ({
            ...prev,
            dropoffs: updatedDropoffs,
            dropoffCoords: updatedCoords,
            dropoffOldAddresses: updatedOldAddresses,
            dropoffDoorNumbers: updatedDoorNumbers,
            dropoffTerminals: updatedTerminals,
            dropoffIsAirportList: updatedIsAirport,
            dropoffIsAirport: updatedIsAirport.some(Boolean),
        }));

        if (index === 0) {
            setFieldValue('dropoff', '');
            setFieldTouched('dropoff', false);
        }
    };

    const handlePickupSavedClear = () => {
        setJourneyData(prev => ({
            ...prev,
            oldAddress: "",
            oldAddressCoords: null
        }));
    };

    return (
        <View style={styles.card}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Journey Details</Text>
                <Text style={styles.fare}>
                    {symbol}{(fare ?? 0).toFixed(2)}
                </Text>
            </View>

            {hourlyWarning ? (
                <View style={styles.hourlyWarningContainer}>
                    <Text style={{ color: colors?.error, marginTop: 0, textAlign: "center" }}>
                        {hourlyWarning}
                    </Text>
                </View>
            ) : null}

            {mode === "Hourly" && (
                <View style={{ marginBottom: 10, backgroundColor: colors?.gray100, padding: moderateScale(16) }}>

                    <TouchableOpacity
                        onPress={() => setShowPackages(prev => !prev)}
                        activeOpacity={0.7}
                        style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginBottom: 10
                        }}
                    >
                        <Text style={{ fontWeight: "bold" }}>
                            Hourly Packages
                        </Text>

                        {showPackages ? (
                            <Icons.ChevronUp size={18} color={colors.black} />
                        ) : (
                            <Icons.ChevronDown size={18} color={colors.black} />
                        )}
                    </TouchableOpacity>

                    {showPackages && hourlyData?.map((item) => {
                        const isSelected = selectedHourly?._id === item._id;

                        return (
                            <TouchableOpacity
                                key={item._id}
                                onPress={() => {
                                    setSelectedHourly(item);
                                    setShowPackages(false);
                                }}
                                activeOpacity={0.7}
                                style={{
                                    padding: 12,
                                    borderColor: isSelected ? colors.primary : colors?.gray200,
                                    borderRadius: moderateScale(8),
                                    marginBottom: 8,
                                    backgroundColor: isSelected ? colors?.black : "#fff"
                                }}
                            >
                                <Text style={{ fontWeight: "bold", color: isSelected ? colors?.white : colors?.black }}>
                                    {item.distance} miles - {item.hours} hours
                                </Text>
                            </TouchableOpacity>
                        );
                    })}

                </View>
            )}

            <View style={{ paddingHorizontal: 16 }}>
                <DateTimeSection
                    journeyData={journeyData}
                    setJourneyData={setJourneyData}
                    colors={colors}
                    errors={errors}
                    touched={touched}
                    setFieldValue={setFieldValue}
                    setFieldTouched={setFieldTouched}
                    validateForm={validateForm}
                    values={values}
                />
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                    <Text style={styles.label}>Pickup Location <Text style={{ color: colors.error, fontSize: moderateScale(16) }}>*</Text></Text>
                    {mode !== "Hourly" && (
                        <View style={styles.switchContainer}>
                            <Switch
                                value={isReturnJourney}
                                onValueChange={handleSwitchToggle}
                                circleSize={24}
                                barHeight={30}
                                backgroundActive={colors?.secondary}
                                backgroundInactive={"#ccc"}
                                circleActiveColor={colors?.lightBlue}
                                circleInActiveColor={colors?.error}
                                renderActiveText={true}
                                renderInActiveText={true}
                                activeText={"Single"}
                                activeTextStyle={{ color: 'white' }}
                                inActiveText={"Return"}
                                inactiveTextStyle={{ color: colors?.primary }}
                                switchWidthMultiplier={3.7}
                            />
                        </View>)}
                </View>
                <TouchableOpacity style={[styles.input, { flex: 1, flexDirection: "row", alignItems: "center", overflow: "hidden" }]} onPress={() => openSearch("pickup")}>
                    <Icons.MapPin size={18} color={colors.placeholder} flexShrink={0} />
                    <Text numberOfLines={1} ellipsizeMode="tail" style={[styles.inputText, { flex: 1, marginLeft: 6 }]}>
                        {values.pickup || "Enter pickup address"}
                    </Text>
                    {values.pickup && (
                        <TouchableOpacity
                            onPress={handlePickupClear}
                            style={{ padding: 4, flexShrink: 0 }}
                            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                        >
                            <Icons.X size={18} color={colors.placeholder} />
                        </TouchableOpacity>
                    )}
                </TouchableOpacity>
                {touched?.pickup && errors?.pickup && (
                    <Text style={{ color: colors.error || "red", marginTop: 4 }}>
                        {errors.pickup}
                    </Text>
                )}

                {!pickupSelected && (
                    <>
                        <Text style={[styles.label, { marginTop: 12 }]}>Saved Address</Text>
                        <TouchableOpacity style={[styles.input, { flex: 1, flexDirection: "row", alignItems: "center", overflow: "hidden" }]} onPress={() => openSearch("oldAddress")}>
                            <Icons.MapPin size={18} color={colors.placeholder} flexShrink={0} />
                            <Text numberOfLines={1} ellipsizeMode="tail" style={[styles.inputText, { flex: 1, marginLeft: 6 }]}>
                                {journeyData.oldAddress || "Select old address"}
                            </Text>
                            {journeyData.oldAddress && (
                                <TouchableOpacity
                                    onPress={handlePickupSavedClear}
                                    style={{ padding: 4, flexShrink: 0 }}
                                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                                >
                                    <Icons.X size={18} color={colors.placeholder} />
                                </TouchableOpacity>
                            )}
                        </TouchableOpacity>
                    </>
                )}

                {pickupSelected && (
                    isAirportSelected ? (
                        <View>
                            {/* First Row */}
                            <View style={{ flexDirection: "row", gap: 10 }}>
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.label}>Flight Number</Text>
                                    <TextInput
                                        value={journeyData.flightNumber}
                                        onChangeText={handleFlightNumberChange}
                                        placeholder="Enter Flight No."
                                        placeholderTextColor={colors.gray300}
                                        style={styles.input}
                                        maxLength={15}
                                    />
                                </View>

                                <View style={{ flex: 1 }}>
                                    <Text style={styles.label}>Arriving From</Text>
                                    <TextInput
                                        value={journeyData.arrivefrom}
                                        onChangeText={handleArrivefromChange}
                                        placeholder="Enter Arrival City"
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
                                        value={journeyData.pickmeAfter}
                                        onChangeText={handlePickMeAfterChange}
                                        placeholder="Enter Minutes"
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
                                value={journeyData.pickupDoorNumber}
                                onChangeText={handleDoorNumberChange}
                                placeholder="Door / House No."
                                placeholderTextColor={colors.gray300}
                                style={styles.input}
                            />
                        </View>
                    )
                )}

                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                    <Text style={styles.label}>Dropoff Location <Text style={{ color: colors.error, fontSize: moderateScale(16) }}>*</Text> </Text>
                </View>

                {journeyData.dropoffs.map((drop, index) => {
                    const isLast = index === journeyData.dropoffs.length - 1;
                    const isFilled = drop?.trim() !== "";

                    return (
                        <View key={index} style={{ marginBottom: 14 }}>

                            {/* MAIN DROPOFF INPUT */}
                            <View style={[styles.inputWrapper, { alignItems: "center", gap: 8 }]}>
                                <TouchableOpacity
                                    style={[styles.input, { flex: 1, flexDirection: "row", alignItems: "center", overflow: "hidden" }]}
                                    onPress={() => openSearch("dropoff", index)}
                                >
                                    <Icons.MapPin size={18} color={colors.placeholder} flexShrink={0} />
                                    <Text
                                        numberOfLines={2}
                                        ellipsizeMode="tail"
                                        style={[styles.inputText, { marginLeft: 6, flex: 1 }]}
                                    >
                                        {index === 0 && values.dropoff
                                            ? values.dropoff
                                            : drop || `Enter dropoff ${index + 1}`}
                                    </Text>
                                    {drop && (
                                        <TouchableOpacity
                                            onPress={() => handleDropoffClear(index)}
                                            style={{ padding: 4, flexShrink: 0 }}
                                            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                                        >
                                            <Icons.X size={18} color={colors.placeholder} />
                                        </TouchableOpacity>
                                    )}
                                </TouchableOpacity>

                                {/* PLUS / MINUS */}
                                <View style={styles.listWrapper}>
                                    {journeyData.dropoffs.length > 1 && (
                                        <TouchableOpacity
                                            onPress={() => removeDropoff(index)}
                                            style={styles.buttonMinus}
                                        >
                                            <Icons.Minus size={18} color={colors.white} />
                                        </TouchableOpacity>
                                    )}

                                    {isLast &&
                                        isFilled &&
                                        journeyData.dropoffs.length < MAX_DROPOFFS && (
                                            <TouchableOpacity
                                                onPress={addDropoff}
                                                style={styles.buttonPlus}
                                            >
                                                <Icons.Plus size={18} color={colors.white} />
                                            </TouchableOpacity>
                                        )}
                                </View>
                            </View>

                            <View
                                style={{
                                    padding: 10,
                                    borderRadius: 10,
                                }}
                            >
                                {!isFilled && (
                                    <>
                                        <Text style={styles.label}>Saved Address</Text>
                                        <TouchableOpacity
                                            style={[styles.input, { marginBottom: 10, flexDirection: "row", alignItems: "center", overflow: "hidden" }]}
                                            onPress={() => openSearch("dropoffOldAddress", index)}
                                        >
                                            <Icons.MapPin size={18} color={colors.placeholder} flexShrink={0} />
                                            <Text numberOfLines={1} ellipsizeMode="tail" style={[styles.inputText, { marginLeft: 6, flex: 1 }]}>
                                                {journeyData.dropoffOldAddresses?.[index] || `Select saved address ${index + 1}`}
                                            </Text>
                                            {journeyData.dropoffOldAddresses?.[index] && (
                                                <TouchableOpacity
                                                    onPress={() => {
                                                        const updated = [...(journeyData.dropoffOldAddresses || [])];
                                                        updated[index] = "";
                                                        setJourneyData(prev => ({
                                                            ...prev,
                                                            dropoffOldAddresses: updated
                                                        }));
                                                    }}
                                                    style={{ padding: 4, flexShrink: 0 }}
                                                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                                                >
                                                    <Icons.X size={18} color={colors.placeholder} />
                                                </TouchableOpacity>
                                            )}
                                        </TouchableOpacity>
                                    </>
                                )}
                                {journeyData.dropoffIsAirportList?.[index] ? (
                                    <View>
                                        <Text style={styles.label}>Terminal (Optional)</Text>
                                        <TextInput
                                            value={journeyData.dropoffTerminals?.[index] || ""}
                                            onChangeText={(text) => handleTerminalChange(text, index)}
                                            placeholder="Terminal Number"
                                            placeholderTextColor={colors.gray300}
                                            style={styles.input}
                                            maxLength={10}
                                        />
                                    </View>
                                ) : (
                                    <View>
                                        <Text style={styles.label}>Door Number (Optional)</Text>
                                        <TextInput
                                            value={journeyData.dropoffDoorNumbers?.[index] || ""}
                                            onChangeText={(text) =>
                                                handleDropoffDoorNumberChange(text, index)
                                            }
                                            placeholder="Door / House Number"
                                            placeholderTextColor={colors.gray300}
                                            style={styles.input}
                                        />
                                    </View>
                                )}
                            </View>
                        </View>
                    );
                })}

                <LocationSearchModal
                    visible={showSearchModal}
                    onClose={() => setShowSearchModal(false)}
                    searchText={searchText}
                    setSearchText={setSearchText}
                    onSelect={handleSelectLocation}
                    field={activeField}
                    colors={colors}
                    apiKey={googleApiKey}
                    oldAddresses={oldAddresses}
                    oldAddressesOnly={activeField?.field === 'oldAddress' || activeField?.field === 'dropoffOldAddress'}
                />

                <Text style={[styles.label, { marginTop: 0 }]}>Notes (Optional)</Text>
                <TextInput
                    multiline
                    numberOfLines={3}
                    value={journeyData.notes}
                    onChangeText={handleNotesChange}
                    placeholder="Driver instructions optional ..."
                    placeholderTextColor={colors.gray300}
                    style={styles.notes}
                />
            </View>
        </View>
    );
};

export default JourneyCard;