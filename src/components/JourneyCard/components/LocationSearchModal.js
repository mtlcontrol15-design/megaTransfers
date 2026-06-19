import React, { useEffect, useRef, useState } from "react";
import { Modal, View, Text, TouchableOpacity, TextInput, ScrollView, ActivityIndicator } from "react-native";
import Icons from "../../../assets/icons";
import { EndPoints } from "../../../services/EndPoints";
import { API_CONFIG } from '../../../config/config';


const LocationSearchModal = ({ visible, onClose, searchText, setSearchText, onSelect, field, colors, apiKey, oldAddresses = [], oldAddressesOnly = false }) => {

    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const timer = useRef(null);

    const oldAddressItems = (oldAddresses || [])
        .filter((addr) => {
            if (!searchText || !searchText.trim()) return true;
            return addr.toLowerCase().includes(searchText.toLowerCase());
        })
        .map((addr, idx) => ({
            id: `old-${idx}-${addr}`,
            description: addr,
            coordinates: null,
            isAirport: addr.toLowerCase().includes("airport"),
        }));

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

            const url = `${API_CONFIG.BASE_URL}${EndPoints.suggetionsAPI}input=${encodeURIComponent(query)}`;

            const res = await fetch(url);

            const data = await res.json();

            // console.log('=======data is here', data);


            const formatted = (data?.predictions || []).map(item => ({
                id: item.place_id || item.name,
                description: item.formatted_address || item.name,
                coordinates: item.location || null,
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
    }, [searchText]);

    const handleSelect = (item) => {
        onSelect({
            description: item.description,
            coordinates: item.coordinates,
            isAirport: item.isAirport
        });
    };

    return (
        <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
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

                        <TouchableOpacity onPress={onClose}>
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
                                onChangeText={setSearchText}
                                placeholder="Search address"
                                placeholderTextColor={colors.gray300}
                                style={{ flex: 1, marginLeft: 8, color: colors.text }}
                            />

                            {loading && (
                                <ActivityIndicator size="small" />
                            )}
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