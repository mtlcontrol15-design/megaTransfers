import React, { useEffect, useRef, useState } from "react";
import { Modal, View, Text, TouchableOpacity, TextInput, ScrollView, ActivityIndicator } from "react-native";
import Icons from "../../../assets/icons";
import { EndPoints } from "../../../services/EndPoints";
import { API_CONFIG } from '../../../config/config';


const LocationSearchModal = ({ visible, onClose, searchText, setSearchText, onSelect, field, colors, apiKey, oldAddresses = [], oldAddressesOnly = false, selectedCompanyId }) => {

    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const timer = useRef(null);

    const oldAddressItems = (oldAddresses || [])
        .map((address, idx) => {
            const description =
                typeof address === "string"
                    ? address
                    : address?.label ||
                    address?.value ||
                    address?.formatted_address ||
                    address?.description ||
                    address?.name ||
                    address?.address ||
                    address?.suggestion ||
                    address?.text ||
                    address?.pickup ||
                    address?.dropoff ||
                    "";

            return {
                id: `old-${idx}-${description}`,
                description,
                coordinates:
                    address?.location ||
                    address?.coordinates ||
                    address?.pickupCoordinates ||
                    address?.dropoffCoordinates ||
                    null,
                isAirport:
                    address?.source?.toLowerCase?.().includes("airport") ||
                    description.toLowerCase().includes("airport"),
                city: address?.city || "",
                state: address?.state || "",
                postcode: address?.postcode || "",
            };
        })
        .filter((addr) => {
            if (!searchText || !searchText.trim()) return true;
            return addr.description
                .toLowerCase()
                .includes(searchText.toLowerCase());
        });

    const debounce = (func, delay) => {
        let timerId;
        return (...args) => {
            clearTimeout(timerId);
            timerId = setTimeout(() => func(...args), delay);
        };
    };

    const fetchPlaces = async (query) => {
        if (oldAddressesOnly) {
            setSuggestions([]);
            return;
        }

        if (!query || query.length < 3) {
            setSuggestions([]);
            return;
        }

        try {
            setLoading(true);

            const url = `${API_CONFIG.BASE_URL}${EndPoints.suggetionsAPI}input=${encodeURIComponent(query)}&&companyId=${selectedCompanyId}`;

            // console.log("FETCHING PLACES URL:", url);

            const res = await fetch(url);

            const data = await res.json();

            // console.log(
            //     "AUTOCOMPLETE RESPONSE:",
            //     JSON.stringify(data, null, 2)
            // );


            const responseItems = [
                data?.suggestions,
                data?.predictions,
                data?.data?.suggestions,
                data?.data?.predictions,
                data,
            ].find(Array.isArray) || [];

            const formatted = responseItems.map(item => ({
                id:
                    item.place_id ||
                    item.id ||
                    item.label ||
                    item.value,
                placeId: item.place_id || item.id,
                description:
                    item.label ||
                    item.value ||
                    item.formatted_address ||
                    item.description ||
                    item.name,
                coordinates: item.location || null,
                city: item.city || "",
                state: item.state || "",
                postcode: item.postcode || "",
                isAirport: item.source?.includes("airport"),
            }));

            setSuggestions(formatted);

        } catch (error) {
            console.log("Autocomplete error", error);
        } finally {
            setLoading(false);
        }
    };

    const debouncedSearch = useRef(
        debounce((text) => {
            fetchPlaces(text);
        }, 1000)
    ).current;

    useEffect(() => {
        debouncedSearch(searchText);
    }, [debouncedSearch, searchText]);

    const handleClose = () => {
        setSearchText("");
        setSuggestions([]);
        setLoading(false);
        onClose?.();
    };

    const handleSelect = (item) => {
        onSelect({
            description: item.description,
            coordinates: item.coordinates,
            isAirport: item.isAirport,
            city: item.city || "",
            state: item.state || "",
            postcode: item.postcode || "",
        });
        setSearchText("");
        setSuggestions([]);
    };

    return (
        <Modal visible={visible} animationType="slide" transparent onRequestClose={handleClose}>
            <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "flex-end" }}>

                <View style={{
                    height: "85%",
                    backgroundColor: colors.bg,
                    borderTopLeftRadius: 24,
                    borderTopRightRadius: 24,
                }}>
                    <View style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        padding: 16,
                        borderBottomWidth: 1,
                        borderColor: colors.border,
                        backgroundColor: colors?.primary,
                        borderTopLeftRadius: 24,
                        borderTopRightRadius: 24,
                    }}>
                        <Text style={{ fontSize: 18, fontWeight: "700", color: 'white' }}>
                            {field?.field === "pickup" ? "Pickup Location" : field?.field === "dropoff" ? "Dropoff Location" : "Search Address"}
                        </Text>

                        <TouchableOpacity onPress={handleClose}>
                            <Icons.X size={24} color={'white'} />
                        </TouchableOpacity>
                    </View>
                    <View style={{ padding: 16 }}>
                        <View style={{
                            flexDirection: "row",
                            alignItems: 'center',
                            borderWidth: 1,
                            borderColor: colors.border,
                            borderRadius: 10,
                            padding: 10
                        }}>
                            <Icons.Search size={18} color={colors.placeholder} />

                            <TextInput
                                value={searchText}
                                onChangeText={text => {
                                    setSearchText(text);
                                    if (!text.trim()) {
                                        setSuggestions([]);
                                    }
                                }}
                                placeholder="Search address"
                                placeholderTextColor={colors.gray300}
                                style={{ flex: 1, marginLeft: 8, color: colors.text }}
                            />

                            {loading ? (
                                <ActivityIndicator
                                    size="small"
                                    color={colors?.primary}
                                />
                            ) : searchText?.trim() ? (
                                <TouchableOpacity
                                    activeOpacity={0.7}
                                    onPress={() => {
                                        setSearchText("");
                                        setSuggestions([]);
                                        setLoading(false);
                                    }}
                                >
                                    <Icons.X
                                        size={18}
                                        color={colors?.placeholder}
                                    />
                                </TouchableOpacity>
                            ) : null}
                        </View>
                    </View>
                    <ScrollView style={{ paddingHorizontal: 16 }}>
                        {oldAddressItems.length > 0 && (
                            <View style={{ marginBottom: 12 }}>
                                <Text style={{ fontSize: 14, fontWeight: '600', color: colors.text, marginBottom: 8 }}>
                                    Suggested Addresses
                                </Text>
                                {oldAddressItems.map((item) => (
                                    <TouchableOpacity
                                        key={item.id}
                                        onPress={() => handleSelect(item)}
                                        style={{
                                            paddingVertical: 16,
                                            borderBottomWidth: 1,
                                            borderColor: colors.border
                                        }}
                                    >
                                        <Text style={{ fontSize: 15, color: colors.text }}>
                                            {item.description}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        )}

                        {!oldAddressesOnly && suggestions.map((item) => (
                            <TouchableOpacity
                                key={item.id}
                                onPress={() => handleSelect(item)}
                                style={{
                                    paddingVertical: 16,
                                    borderBottomWidth: 1,
                                    borderColor: colors.border
                                }}
                            >
                                <Text style={{ fontSize: 15, color: colors.text }}>
                                    {item.description}
                                </Text>
                            </TouchableOpacity>
                        ))}

                        {!loading && oldAddressesOnly && !oldAddressItems.length && (
                            <View style={{ paddingVertical: 24 }}>
                                <Text style={{ color: colors.text, textAlign: 'center' }}>
                                    No saved addresses match your search.
                                </Text>
                            </View>
                        )}

                        {!loading && !oldAddressesOnly && !suggestions.length && (
                            <View style={{ paddingVertical: 24 }}>
                                <Text style={{ color: colors.text, textAlign: 'center' }}>
                                    Start typing to search for a location.
                                </Text>
                            </View>
                        )}
                    </ScrollView>

                </View>
            </View>
        </Modal>
    );
};

export default LocationSearchModal;