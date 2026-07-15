import React, { useState, useRef, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, Platform } from "react-native";
import CountryPicker from "react-native-country-picker-modal";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import Icons from "../../assets/icons";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";

const CustomPhoneInput = ({
    value = "",
    defaultCode = "GB",
    onChangeFormattedText,
    containerStyle,
    textContainerStyle,
    textInputStyle,
    codeTextStyle,
    flagButtonStyle,
    countryButtonStyle,
    colors,
    maxLength = 15,
}) => {
    const [countryCode, setCountryCode] = useState(defaultCode);
    const [showCountryPicker, setShowCountryPicker] = useState(false);
    const [phoneNumber, setPhoneNumber] = useState("");
    const [country, setCountry] = useState(null);
    const [isInitialized, setIsInitialized] = useState(false);
    const [shouldAutoDetect, setShouldAutoDetect] = useState(true);
    const textInputRef = useRef(null);

    // Get country emoji
    const getCountryEmoji = (code) => {
        if (!code || code.length !== 2) return "🌍";
        const codePoints = code
            .toUpperCase()
            .split("")
            .map((char) => 127397 + char.charCodeAt());
        return String.fromCodePoint(...codePoints);
    };

    // Get calling code mapping for all countries
    const getDefaultCallingCode = (code) => {
        const callingCodes = {
            US: "1", GB: "44", CA: "1", AU: "61", FR: "33", DE: "49", IT: "39",
            ES: "34", NL: "31", BE: "32", SE: "46", NO: "47", DK: "45", FI: "358",
            PL: "48", CZ: "420", RO: "40", GR: "30", PT: "351", HU: "36", CH: "41",
            AT: "43", IE: "353", JP: "81", CN: "86", IN: "91", BR: "55", MX: "52",
            AR: "54", ZA: "27", SG: "65", HK: "852", AE: "971", SA: "966", KR: "82",
            TH: "66", VN: "84", PH: "63", MS: "1264", NZ: "64", SG: "65", HK: "852",
            MY: "60", ID: "62", TW: "886", MO: "853", BT: "975", BD: "880", LK: "94",
            PK: "92", AF: "93", TR: "90", EG: "20", NG: "234", KE: "254", GH: "233",
            CM: "237", UG: "256", TZ: "255", ZW: "263", BW: "267", NA: "264", AO: "244",
            MZ: "258", MW: "265", ZM: "260", LS: "266", ST: "239", CV: "238", MU: "230",
            SC: "248", MG: "261", RE: "262", YT: "262", KM: "269", YE: "967", OM: "968",
            AQ: "672",
        };
        return callingCodes[code] || "1";
    };

    const getCountryCodeFromCallingCode = (callingCode) => {
        const reverseMap = {
            "1264": "MS",  // Anguilla
            "1": "US",     // USA (fallback for +1)
            "44": "GB",
            "1268": "BD",  // Bermuda
            "1242": "BS",  // Bahamas
            "1246": "BB",  // Barbados
            "1340": "VI",  // US Virgin Islands
            "1664": "TC",  // Turks and Caicos
            "1671": "GU",  // Guam
            "1684": "AS",  // American Samoa
            "1441": "BM",  // Bermuda (alternate)
            "61": "AU",
            "33": "FR",
            "49": "DE",
            "39": "IT",
            "34": "ES",
            "31": "NL",
            "32": "BE",
            "46": "SE",
            "47": "NO",
            "45": "DK",
            "358": "FI",
            "48": "PL",
            "420": "CZ",
            "40": "RO",
            "30": "GR",
            "351": "PT",
            "36": "HU",
            "41": "CH",
            "43": "AT",
            "353": "IE",
            "81": "JP",
            "86": "CN",
            "91": "IN",
            "55": "BR",
            "52": "MX",
            "54": "AR",
            "27": "ZA",
            "65": "SG",
            "852": "HK",
            "971": "AE",
            "966": "SA",
            "82": "KR",
            "66": "TH",
            "84": "VN",
            "63": "PH",
            "64": "NZ",
            "60": "MY",
            "62": "ID",
            "886": "TW",
            "853": "MO",
            "975": "BT",
            "880": "BD",
            "94": "LK",
            "92": "PK",
            "93": "AF",
            "90": "TR",
            "20": "EG",
            "234": "NG",
            "254": "KE",
            "233": "GH",
            "237": "CM",
            "256": "UG",
            "255": "TZ",
            "263": "ZW",
            "267": "BW",
            "264": "NA",
            "244": "AO",
            "258": "MZ",
            "265": "MW",
            "260": "ZM",
            "266": "LS",
            "239": "ST",
            "238": "CV",
            "230": "MU",
            "248": "SC",
            "261": "MG",
            "262": "RE",
            "269": "KM",
            "967": "YE",
            "968": "OM",
            "672": "AQ",
        };
        return reverseMap[callingCode] || "US";
    };

    const formatPhoneNumber = (phone) => {
        if (!phone) return "";
        const callingCode = country?.callingCode?.[0] || getDefaultCallingCode(countryCode);
        return `+${callingCode}${phone}`;
    };

    const handlePhoneChange = (text) => {
        const cleanedText = text.replace(/\D/g, "");

        if (cleanedText.length > maxLength) {
            return;
        }

        setPhoneNumber(cleanedText);
        setShouldAutoDetect(false);
        const formattedPhone = formatPhoneNumber(cleanedText);
        onChangeFormattedText(formattedPhone);
    };

    const handleSelectCountry = (selectedCountry) => {
        setCountryCode(selectedCountry.cca2);
        setCountry(selectedCountry);
        setShowCountryPicker(false);
        setShouldAutoDetect(false);

        if (phoneNumber) {
            const callingCode = selectedCountry.callingCode?.[0];
            onChangeFormattedText(`+${callingCode}${phoneNumber}`);
        }
    };

    // Initialize country state on mount (only once)
    useEffect(() => {
        if (!isInitialized) {
            const callingCode = getDefaultCallingCode(defaultCode);
            setCountry({
                cca2: defaultCode,
                callingCode: [callingCode],
            });
            setCountryCode(defaultCode);
            setIsInitialized(true);
        }
    }, []);

    // Load phone number from value prop (on mount and when value changes)
    // Also auto-detects country code from the phone number only when allowed
    useEffect(() => {
        if (!shouldAutoDetect) {
            return;
        }

        if (value && value.startsWith("+")) {
            try {
                // Extract all digits from the phone number
                const digitsOnly = value.replace(/\D/g, "");

                if (!digitsOnly) return;

                // Try to detect calling code by matching from longest codes first
                // This ensures +1264 is detected before +1
                const callingCodesList = [
                    "672", "358", "420", "234", "256", "255", "263", "267", "264", "244",
                    "258", "265", "260", "266", "239", "238", "230", "248", "261", "262",
                    "269", "967", "968", "971", "966", "852", "880", "886", "853", "975",
                    "1264", "351", "353", "420", "349", "354", "355", "356", "357", "358",
                    "212", "213", "216", "218", "220", "221", "222", "223", "224", "225",
                    "226", "227", "228", "229", "230", "231", "232", "233", "234", "235",
                    "237", "238", "239", "240", "241", "242", "243", "244", "245", "246",
                    "248", "249", "250", "251", "252", "253", "254", "255", "256", "257",
                    "258", "260", "261", "262", "263", "264", "265", "266", "267", "268",
                    "269", "290", "291", "297", "298", "299", "350", "351", "352", "353",
                    "354", "355", "356", "357", "358", "359", "370", "371", "372", "373",
                    "374", "375", "376", "377", "378", "380", "381", "382", "383", "385",
                    "386", "387", "389", "420", "421", "423", "500", "501", "502", "503",
                    "504", "505", "506", "507", "508", "509", "590", "591", "592", "593",
                    "594", "595", "596", "597", "598", "599", "670", "672", "673", "674",
                    "675", "676", "677", "678", "679", "680", "681", "682", "683", "684",
                    "685", "686", "687", "688", "689", "690", "691", "692", "850", "852",
                    "853", "855", "856", "880", "886", "960", "961", "962", "963", "964",
                    "965", "966", "967", "968", "970", "971", "972", "973", "974", "975",
                    "976", "977", "992", "993", "994", "995", "998", "212", "213", "216",
                    "34", "33", "39", "41", "43", "49", "44", "45", "46", "47", "48", "81",
                    "82", "84", "86", "90", "92", "93", "20", "27", "61", "64", "65", "66",
                    "1268", "1242", "1246", "1340", "1664", "1671", "1684", "1441"
                ].sort((a, b) => b.length - a.length); // Sort by length descending

                let detectedCallingCode = null;
                for (let code of callingCodesList) {
                    if (digitsOnly.startsWith(code)) {
                        detectedCallingCode = code;
                        break;
                    }
                }

                if (detectedCallingCode) {
                    const localNumber = digitsOnly.substring(detectedCallingCode.length);
                    const detectedCountryCode = getCountryCodeFromCallingCode(detectedCallingCode);

                    setCountryCode(detectedCountryCode);
                    setCountry({
                        cca2: detectedCountryCode,
                        callingCode: [detectedCallingCode],
                    });
                    setPhoneNumber(localNumber);
                } else {
                    const parsed = parsePhoneNumberFromString(value);

                    if (parsed && parsed.country) {
                        const detectedCountryCode = parsed.country;
                        const localNumber = parsed.nationalNumber;
                        const callingCode = parsed.countryCallingCode;

                        setCountryCode(detectedCountryCode);
                        setCountry({
                            cca2: detectedCountryCode,
                            callingCode: [callingCode],
                        });
                        setPhoneNumber(String(localNumber));
                    }
                }
            } catch (error) {
                const digitsOnly = value.replace(/\D/g, "");
                setPhoneNumber(digitsOnly);
            }
        } else if (value) {
            const digitsOnly = value.replace(/\D/g, "");
            setPhoneNumber(digitsOnly);
        }
    }, [value, shouldAutoDetect]);

    return (
        <View style={containerStyle}>
            <View
                style={[
                    {
                        flexDirection: "row",
                        alignItems: "center",
                        backgroundColor: "#fff",
                    },
                    textContainerStyle,
                ]}
            >
                {/* Country Picker Button */}
                <TouchableOpacity
                    onPress={() => setShowCountryPicker(true)}
                    style={[
                        {
                            flexDirection: "row",
                            alignItems: "center",
                            paddingHorizontal: scale(10),
                            borderRightWidth: 1,
                            borderRightColor: "#d1d5db",
                            paddingVertical: verticalScale(1),
                        },
                        flagButtonStyle,
                    ]}
                >
                    <Text
                        style={{
                            fontSize: moderateScale(24),
                            marginRight: scale(6),
                        }}
                    >
                        {getCountryEmoji(countryCode)}
                    </Text>

                    <Text
                        style={[
                            {
                                fontSize: moderateScale(14),
                                color: "#111827",
                                fontWeight: "600",
                            },
                            codeTextStyle,
                        ]}
                    >
                        {country?.callingCode?.[0] ? `+${country?.callingCode?.[0]}` : `+${getDefaultCallingCode(countryCode)}`}
                    </Text>

                    <Icons.ChevronDown
                        size={16}
                        color="#666"
                        style={{ marginLeft: scale(4) }}
                    />
                </TouchableOpacity>

                {/* Phone Number Input */}
                <TextInput
                    ref={textInputRef}
                    style={[
                        {
                            flex: 1,
                            marginLeft: scale(10),
                            fontSize: moderateScale(15),
                            color: "#111827",
                            paddingVertical: verticalScale(8),
                        },
                        textInputStyle,
                    ]}
                    value={phoneNumber}
                    onChangeText={handlePhoneChange}
                    placeholder="Enter phone number"
                    placeholderTextColor="#d1d5db"
                    keyboardType="phone-pad"
                    maxLength={maxLength}
                    editable={true}
                />
            </View>

            {/* Country Picker Modal */}
            <CountryPicker
                visible={showCountryPicker}
                withFilter
                withCallingCode
                withAlphaFilter
                countryCode={countryCode}
                onClose={() => setShowCountryPicker(false)}
                renderFlagButton={() => null}
                onSelect={handleSelectCountry}
                theme={{
                    primaryColor: colors?.primary || "#6366f1",
                    backgroundColor: "#fff",
                    fontSize: moderateScale(16),
                }}
            />
        </View>
    );
};

export default CustomPhoneInput;
