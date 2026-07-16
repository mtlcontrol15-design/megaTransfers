import React, { useRef, useEffect, useState, useCallback } from "react";
import { View, Text, TextInput } from "react-native";

import CustomPhoneInput from "./CustomPhoneInput";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import getStyles from "./styles";
import Icons from "../../assets/icons";
import { moderateScale } from "react-native-size-matters";

const CustomerInfo = ({ passengerDetails, setPassengerDetails, colors, role, vatnumber, isEmailLocked, errors, touched, setFieldValue, setFieldTouched, isCorporate,
}) => {

    const styles = getStyles(colors);
    const nameInputRef = useRef(null);
    const emailInputRef = useRef(null);
    const [isInitialLoad, setIsInitialLoad] = useState(true);
    const [isPhoneInitialized, setIsPhoneInitialized] =
        useState(false);
    const [countryCode, setCountryCode] = useState("GB");
    const handleNameChange = (text) => {
        setPassengerDetails({
            ...passengerDetails,
            name: text
        });
        setFieldValue("name", text);
        setFieldTouched("name", true);
    };

    const handleEmailChange = (text) => {
        setPassengerDetails({
            ...passengerDetails,
            email: text
        });
        setFieldValue("email", text);
        setFieldTouched("email", true);

    };

    const handlePhoneChange = useCallback((formattedText) => {
        setPassengerDetails(prev => ({
            ...prev,
            phone: formattedText,
            fullPhone: formattedText
        }));
    }, []);

    const handleNameEndEditing = (event) => {
        const text = event.nativeEvent.text;
        if (text !== passengerDetails.name) {
            handleNameChange(text);
        }
    };

    const handleEmailEndEditing = (event) => {
        const text = event.nativeEvent.text;
        if (text !== passengerDetails.email) {
            handleEmailChange(text);
        }
    };

    useEffect(() => {
        if (passengerDetails?.phone && !isPhoneInitialized) {
            try {
                const parsed = parsePhoneNumberFromString(
                    passengerDetails.phone
                );

                if (parsed?.country) {
                    setCountryCode(parsed.country);
                }
            } catch (error) {
                console.log(error);
            }
            setIsPhoneInitialized(true);
        }
    }, [passengerDetails?.phone, isPhoneInitialized]);

    return (
        <KeyboardAwareScrollView
            enableOnAndroid
            keyboardShouldPersistTaps="handled"
            extraScrollHeight={110}
            contentContainerStyle={{ flexGrow: 1 }}
        >
            <View style={styles.card}>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>
                        Passenger Information
                    </Text>
                </View>

                <View style={styles.body}>
                    <View style={styles.field}>
                        <Text style={styles.label}>
                            Full Name <Text style={{ color: colors.error, fontSize: moderateScale(16) }}>*</Text>
                        </Text>

                        <View style={styles.inputRow}>
                            <Icons.User size={18} color="#666" />

                            <TextInput
                                ref={nameInputRef}
                                style={styles.input}
                                value={passengerDetails.name}
                                onChangeText={handleNameChange}
                                onEndEditing={handleNameEndEditing}
                                placeholder="Enter passenger full name"
                                placeholderTextColor={colors.gray300}
                                autoComplete="name"
                                textContentType="name"
                                autoCapitalize="words"
                            />
                        </View>
                        {touched?.name && errors?.name && (
                            <Text style={{ color: colors.error, marginTop: 4 }}>
                                {errors.name}
                            </Text>
                        )}
                    </View>

                    <View style={styles.field}>
                        <View style={styles.emailLabelRow}>
                            <Text style={styles.label}>
                                Email Address <Text style={{ color: colors.error, fontSize: moderateScale(16) }}>*</Text>
                            </Text>
                        </View>

                        <View style={styles.inputRow}>
                            <Icons.Mail size={18} color="#666" />

                            <TextInput
                                ref={emailInputRef}
                                style={styles.input}
                                value={
                                    passengerDetails.email ||
                                    (isCorporate ? "" : "")
                                }
                                onChangeText={handleEmailChange}
                                onEndEditing={handleEmailEndEditing}
                                placeholder="name@example.com"
                                keyboardType="email-address"
                                autoCapitalize="none"
                                editable={!isEmailLocked}
                                placeholderTextColor={colors.gray300}
                                autoComplete="email"
                                textContentType="emailAddress"
                            />
                        </View>

                        {touched?.email && errors?.email && (
                            <Text style={{ color: colors.error, marginTop: 4 }}>
                                {errors.email}
                            </Text>
                        )}

                        {isEmailLocked && (
                            <Text style={styles.lockNote}>
                                Email can change only by Admin.
                            </Text>
                        )}
                    </View>

                    <View style={styles.field}>
                        <Text style={styles.label}>
                            Contact Number <Text style={{ color: colors.error, fontSize: moderateScale(16) }}>*</Text>
                        </Text>

                        <View style={styles.phoneWrapper}>
                            <CustomPhoneInput
                                value={passengerDetails.phone || ""}
                                defaultCode={countryCode}
                                onChangeFormattedText={handlePhoneChange}
                                containerStyle={styles.phoneContainer}
                                textContainerStyle={styles.phoneTextContainer}
                                textInputStyle={styles.phoneText}
                                codeTextStyle={styles.codeText}
                                flagButtonStyle={styles.flagButton}
                                countryButtonStyle={styles.countryButton}
                                colors={colors}
                                maxLength={13}
                            />
                        </View>
                        {touched?.phone && errors?.phone && (
                            <Text style={{ color: colors.error, marginTop: 4 }}>
                                {errors.phone}
                            </Text>
                        )}
                    </View>

                    {role === "customer" && vatnumber && (
                        <View style={styles.vatBox}>
                            <Text style={styles.vatTitle}>
                                VAT Registered Customer
                            </Text>
                            <Text style={styles.vatText}>
                                • VAT Number: {vatnumber}
                            </Text>
                            <Text style={styles.vatText}>
                                • Payment will be processed via invoice
                            </Text>
                        </View>
                    )}
                </View>
            </View>
        </KeyboardAwareScrollView>
    );
};

export default CustomerInfo;