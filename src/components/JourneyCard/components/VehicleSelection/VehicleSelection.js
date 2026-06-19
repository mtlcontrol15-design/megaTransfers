// components/VehicleSelection/VehicleSelection.js

import React, { useRef, useState, useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import VehicleCard from "./components/VehicleCard";
import VehicleExtras from "./components/VehicleExtras";
import getStyles from "./style";
import Icons from "../../../../assets/icons";
import { moderateScale } from "react-native-size-matters";
import { Dimensions } from "react-native";

const VehicleSelection = ({
    vehicles = [],
    selectedVehicle,
    setSelectedVehicle,
    vehicleExtras,
    setVehicleExtras,
    colors,
    errors,
    touched,
    setFieldValue,
    setFieldTouched
}) => {

    const styles = getStyles(colors);

    const flatListRef = useRef(null);
    const [currentIndex, setCurrentIndex] = useState(0);

    const ITEM_WIDTH = Dimensions.get("window").width * 0.82;

    const viewConfigRef = useRef({ viewAreaCoveragePercentThreshold: 50 });

    useEffect(() => {
        if (vehicles.length > 0 && !selectedVehicle) {
            const firstVehicle = vehicles[0];
            setSelectedVehicle(firstVehicle);
            setFieldValue("vehicle", firstVehicle);
            // setFieldTouched("vehicle", true);
        }
    }, [vehicles, selectedVehicle, setSelectedVehicle, setFieldValue, setFieldTouched]);

    useEffect(() => {
        if (vehicles.length > 0 && currentIndex < vehicles.length) {
            const vehicle = vehicles[currentIndex];
            if (vehicle && vehicle._id !== selectedVehicle?._id) {
                setSelectedVehicle(vehicle);
                setFieldValue("vehicle", vehicle);
                // setFieldTouched("vehicle", true);
            }
        }
    }, [currentIndex, vehicles, selectedVehicle, setSelectedVehicle, setFieldValue, setFieldTouched]);

    const onViewRef = useRef(({ viewableItems }) => {
        if (viewableItems.length > 0) {
            const index = viewableItems[0].index ?? 0;
            setCurrentIndex(index);
        }
    });

    const currentExtras =
        selectedVehicle && vehicleExtras[selectedVehicle._id]
            ? vehicleExtras[selectedVehicle._id]
            : {
                passenger: 0,
                childSeat: 0,
                babySeat: 0,
                childSeatType: 0,
                boosterSeat: 0,
                handLuggage: 0,
                checkinLuggage: 0,
            };

    const scrollLeft = () => {
        if (currentIndex > 0) {
            flatListRef.current?.scrollToIndex({
                index: currentIndex - 1,
                animated: true,
            });
        }
    };

    const scrollRight = () => {
        if (currentIndex < vehicles.length - 1) {
            flatListRef.current?.scrollToIndex({
                index: currentIndex + 1,
                animated: true,
            });
        }
    };



    return (
        <View style={styles.container}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={styles.title}>Select Vehicle</Text>
                <View style={{ flexDirection: 'row', gap: moderateScale(10) }}>

                    <TouchableOpacity
                        onPress={scrollLeft}
                        disabled={currentIndex === 0}
                        style={{ opacity: currentIndex === 0 ? 0.3 : 1 }}
                    >
                        <Icons.ChevronLeft />
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={scrollRight}
                        disabled={currentIndex === vehicles.length - 1}
                        style={{ opacity: currentIndex === vehicles.length - 1 ? 0.3 : 1 }}
                    >
                        <Icons.ChevronRight />
                    </TouchableOpacity>

                </View>
            </View>
            {touched?.vehicle && errors?.vehicle && (
                <Text style={{ color: "red", marginBottom: 6 }}>
                    {errors.vehicle}
                </Text>
            )}
            <FlatList
                ref={flatListRef}
                horizontal
                showsHorizontalScrollIndicator={false}
                data={vehicles}
                keyExtractor={(item) => item._id}
                snapToInterval={ITEM_WIDTH + 12}
                snapToAlignment="start"
                decelerationRate="fast"
                getItemLayout={(data, index) => ({
                    length: ITEM_WIDTH + 12,
                    offset: (ITEM_WIDTH + 12) * index,
                    index,
                })}
                onViewableItemsChanged={onViewRef.current}
                viewabilityConfig={viewConfigRef.current}
                renderItem={({ item }) => (
                    <VehicleCard
                        vehicle={item}
                        selected={selectedVehicle?._id === item._id}
                        extras={vehicleExtras[item._id] || {}}
                        onSelect={() => {
                            setSelectedVehicle(item);

                            setFieldValue("vehicle", item);
                            setFieldTouched("vehicle", true);
                        }}
                        colors={colors}
                    />
                )}
            />

            {selectedVehicle && (
                <View style={{ paddingTop: 12 }}>
                    <VehicleExtras
                        vehicle={selectedVehicle}
                        vehicleId={selectedVehicle._id}
                        vehicleExtras={vehicleExtras}
                        setVehicleExtras={setVehicleExtras}
                        colors={colors}
                        errors={errors}
                        touched={touched}
                        setFieldValue={setFieldValue}
                    />
                </View>
            )}

        </View>
    );
};

export default VehicleSelection;