// components/VehicleSelection/components/VehicleExtras.js

import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Alert, StyleSheet } from "react-native";
import Icons from "../../../../../assets/icons";
import { moderateScale, verticalScale } from "react-native-size-matters";

const Counter = ({ label, value, onIncrease, onDecrease, colors, styles
}) => {

    return (
        <View style={styles?.row}>

            <Text style={styles?.label}>
                {label}
            </Text>

            <View style={styles?.row1}>

                <TouchableOpacity
                    onPress={onDecrease}
                    style={styles?.decrease}
                >
                    <Icons.Minus size={14} color={colors?.white} />
                </TouchableOpacity>

                <Text style={{ marginHorizontal: 10, color: '#333333' }}>
                    {value}
                </Text>

                <TouchableOpacity
                    onPress={onIncrease}
                    style={styles?.increase}
                >
                    <Icons.Plus size={14} color={colors?.white} />
                </TouchableOpacity>

            </View>

        </View>
    );
};

const SeatCard = ({ title, desc1, desc2, value, onPlus, onMinus, colors, styles
}) => {

    return (
        <View
            style={styles?.innerContainer}
        >

            <Text style={{ fontWeight: "600", marginBottom: 4 }}>
                {title}
            </Text>

            <Text style={{ fontSize: 12, color: "#777" }}>
                {desc1}
            </Text>

            <Text style={{ fontSize: 12, color: "#777", marginBottom: 12 }}>
                {desc2}
            </Text>

            <View
                style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center"
                }}
            >

                <TouchableOpacity
                    onPress={onMinus}
                    style={styles?.decrease}
                >
                    <Icons.Minus size={14} color={colors?.white} />
                </TouchableOpacity>

                <Text style={{ marginHorizontal: 12, fontSize: 16 }}>
                    {value}
                </Text>

                <TouchableOpacity
                    onPress={onPlus}
                    style={styles?.increase}
                >
                    <Icons.Plus size={14} color={colors?.white} />
                </TouchableOpacity>

            </View>

        </View>
    );
};

const VehicleExtras = ({ vehicleExtras, setVehicleExtras, colors, vehicle, vehicleId, errors, touched, setFieldValue }) => {

    // console.log('=======vehicle data is here',vehicle);


    const styles = getStyles(colors)

    const [showSeatSelector, setShowSeatSelector] = useState(false);

    const currentVehicleExtras = vehicleExtras[vehicleId] || {
        passenger: 0,
        childSeat: 0,
        babySeat: 0,
        childSeatType: 0,
        boosterSeat: 0,
        handLuggage: 0,
        checkinLuggage: 0
    };

    // console.log('=======currentVehicleExtras are here', currentVehicleExtras);


    const [seatCounts, setSeatCounts] = useState({
        baby: currentVehicleExtras?.babySeat || 0,
        child: currentVehicleExtras?.childSeatType || 0,
        booster: currentVehicleExtras?.boosterSeat || 0,
    });

    useEffect(() => {
        if (!vehicleExtras[vehicleId]) {
            setVehicleExtras(prev => ({
                ...prev,
                [vehicleId]: {
                    passenger: 0,
                    childSeat: 0,
                    babySeat: 0,
                    childSeatType: 0,
                    boosterSeat: 0,
                    handLuggage: 0,
                    checkinLuggage: 0
                }
            }));
        }
    }, [vehicleId, setVehicleExtras]);

    useEffect(() => {
        setSeatCounts({
            baby: currentVehicleExtras?.babySeat || 0,
            child: currentVehicleExtras?.childSeatType || 0,
            booster: currentVehicleExtras?.boosterSeat || 0,
        });
    }, [vehicleId, currentVehicleExtras]);

    const totalSeats =
        seatCounts.baby +
        seatCounts.child +
        seatCounts.booster;

    const updateSeat = (type, delta) => {
        const passengers = currentVehicleExtras?.passenger || 0;
        const newTotal = totalSeats + delta;

        if (passengers <= 1 && newTotal > 0) {
            Alert.alert(
                "Invalid Selection",
                "At least 2 passengers required to select a child seat"
            );
            return;
        }

        const maxAllowedByPassengers = passengers > 0 ? passengers - 1 : 0;

        if (newTotal > maxAllowedByPassengers) {
            Alert.alert(
                "Child Seat Limit",
                `You can select maximum ${maxAllowedByPassengers} child seat(s) for ${passengers} passenger(s)`
            );
            return;
        }

        if (newTotal > vehicle.childSeat) {
            Alert.alert(
                "Vehicle Limit",
                `Maximum ${vehicle.childSeat} child seats allowed for this vehicle`
            );
            return;
        }

        const newSeatCounts = {
            ...seatCounts,
            [type]: Math.max(0, seatCounts[type] + delta),
        };

        setSeatCounts(newSeatCounts);

        setVehicleExtras(prev => ({
            ...prev,
            [vehicleId]: {
                ...currentVehicleExtras,
                babySeat: newSeatCounts.baby,
                childSeatType: newSeatCounts.child,
                boosterSeat: newSeatCounts.booster,
                childSeat: newTotal
            }
        }));

        setFieldValue("vehicleExtras", {
            ...currentVehicleExtras,
            babySeat: newSeatCounts.baby,
            childSeatType: newSeatCounts.child,
            boosterSeat: newSeatCounts.booster,
            childSeat: newTotal
        });
    };

    const update = (field, delta) => {
        setVehicleExtras(prev => {

            const currentVehicleExtrasTemp = prev[vehicleId] || {
                passenger: 0,
                childSeat: 0,
                babySeat: 0,
                childSeatType: 0,
                boosterSeat: 0,
                handLuggage: 0,
                checkinLuggage: 0
            };

            const newValue = currentVehicleExtrasTemp[field] + delta;

            if (newValue < 0) return prev;

            let updatedExtras = {
                ...currentVehicleExtrasTemp,
                [field]: newValue
            };

            if (field === "passenger") {
                const maxAllowedSeats = Math.max(0, newValue - 1);

                if (currentVehicleExtrasTemp.childSeat > maxAllowedSeats) {
                    Alert.alert(
                        "Adjusting Child Seats",
                        `Child seats reduced to ${maxAllowedSeats} based on passengers`
                    );

                    updatedExtras.childSeat = maxAllowedSeats;
                    updatedExtras.babySeat = 0;
                    updatedExtras.childSeatType = 0;
                    updatedExtras.boosterSeat = 0;
                }
            }

            if (field === "passenger" && newValue > vehicle.passengers) {
                Alert.alert(
                    "Capacity Exceeded",
                    `Max ${vehicle.passengers} passengers allowed`
                );
                return prev;
            }

            if (field === "handLuggage" && newValue > vehicle.handLuggage) {
                Alert.alert(
                    "Hand Luggage Limit",
                    `Maximum ${vehicle.handLuggage} allowed`
                );
                return prev;
            }

            if (field === "checkinLuggage" && newValue > vehicle.checkinLuggage) {
                Alert.alert(
                    "Luggage Limit",
                    `Maximum ${vehicle.checkinLuggage} allowed`
                );
                return prev;
            }

            setFieldValue("vehicleExtras", updatedExtras);

            return {
                ...prev,
                [vehicleId]: updatedExtras
            };
        });
    };

    return (
        <View style={{ marginTop: 20 }}>

            <Text style={{ fontSize: 15, fontWeight: "600", marginBottom: 10, marginLeft: 4 }}>
                Extras
            </Text>

            <Counter
                label="Passengers"
                value={currentVehicleExtras.passenger}
                onIncrease={() => update("passenger", 1)}
                onDecrease={() => update("passenger", -1)}
                colors={colors}
                styles={styles}
            />

            <Counter
                label="Hand Luggage"
                value={currentVehicleExtras.handLuggage}
                onIncrease={() => update("handLuggage", 1)}
                onDecrease={() => update("handLuggage", -1)}
                colors={colors}
                styles={styles}

            />

            <Counter
                label="Check-in Luggage"
                value={currentVehicleExtras.checkinLuggage}
                onIncrease={() => update("checkinLuggage", 1)}
                onDecrease={() => update("checkinLuggage", -1)}
                colors={colors}
                styles={styles}

            />
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: moderateScale(12) }}>
                <Text style={{ color: colors?.lightBlue }}>Choose Child Seats</Text>
                <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => setShowSeatSelector(!showSeatSelector)}
                    style={[styles?.selectChild, { backgroundColor: showSeatSelector ? colors?.error : colors?.lightBlue }]}
                >
                    {showSeatSelector ? (
                        <Icons.X color={colors?.white} />
                    ) : (
                        <Icons.Plus color={colors?.white} />
                    )}
                </TouchableOpacity>
            </View>

            {showSeatSelector && (

                <View style={styles?.seatContainer}>

                    <Text style={{ fontWeight: "600", marginBottom: 10 }}>
                        Choose Child Seats ({totalSeats}/{vehicle.childSeat})
                    </Text>

                    <View>
                        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>

                            <SeatCard
                                title="Baby Seat"
                                desc1="0 to 10 kg"
                                desc2="01 to 09 Months"
                                value={seatCounts.baby}
                                onPlus={() => updateSeat("baby", 1)}
                                onMinus={() => updateSeat("baby", -1)}
                                colors={colors}
                                styles={styles}

                            />

                            <SeatCard
                                title="Child Seat"
                                desc1="9 to 18 kg"
                                desc2="9 Months to 4 yrs"
                                value={seatCounts.child}
                                onPlus={() => updateSeat("child", 1)}
                                onMinus={() => updateSeat("child", -1)}
                                colors={colors}
                                styles={styles}

                            />

                        </View>
                        <View
                            style={{
                                flexDirection: "row",
                                justifyContent: "center",
                                marginTop: 10
                            }}
                        >

                            <View style={{ width: "50%" }}>

                                <SeatCard
                                    title="Booster Seats"
                                    desc1="18 KG or More"
                                    desc2="04 Years to 10 Years"
                                    value={seatCounts.booster}
                                    onPlus={() => updateSeat("booster", 1)}
                                    onMinus={() => updateSeat("booster", -1)}
                                    colors={colors}
                                    styles={styles}
                                />

                            </View>

                        </View>

                    </View>

                </View>

            )}
            {errors?.vehicleExtras && (
                <Text style={{ color: "red", marginTop: 4 }}>
                    {errors.vehicleExtras}
                </Text>
            )}

        </View>
    );
};

export default VehicleExtras;


const getStyles = (colors) => StyleSheet.create({
    midContainer: {
        flex: 1,
        backgroundColor: '#fafafa',
        borderTopLeftRadius: moderateScale(20),
        borderTopRightRadius: moderateScale(20),
        marginTop: verticalScale(6),
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: moderateScale(10),
        paddingLeft: moderateScale(4),
    },
    label: {
        fontSize: moderateScale(14),
        color: colors?.primary
    },
    decrease: {
        padding: moderateScale(6),
        borderRadius: moderateScale(6),
        backgroundColor: colors?.secondary
    },
    row1: {
        flexDirection: "row",
        alignItems: "center",
    },
    increase: {
        padding: moderateScale(6),
        borderRadius: moderateScale(6),
        backgroundColor: colors?.primary
    },
    selectChild: {
        paddingVertical: moderateScale(2),
        paddingHorizontal: moderateScale(16),
        borderWidth: 1,
        borderColor: "#E0E0E0",
        borderRadius: moderateScale(6),
    },
    seatContainer: {
        padding: moderateScale(12),
        backgroundColor: colors?.gray70,
        borderRadius: moderateScale(8),
        marginBottom: moderateScale(12)
    },
    innerContainer: {
        flex: 1,
        borderWidth: moderateScale(1),
        borderColor: "#E0E0E0",
        borderRadius: moderateScale(12),
        padding: moderateScale(12),
        marginHorizontal: moderateScale(4)
    }
});
