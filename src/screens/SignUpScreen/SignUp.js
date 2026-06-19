import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';

import { Formik } from 'formik';
import { useTheme } from '@react-navigation/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import getStyles from './styles';
import Icons from '../../assets/icons';
import { API_CONFIG } from '../../config/config';
import { validationSignUpSchema } from '../../utils/validationUtils';
import CustomPhoneInput from '../../components/CustomerInfo/CustomPhoneInput';
import LocationSearchModal from "../../components/JourneyCard/components/LocationSearchModal";
import { moderateScale } from 'react-native-size-matters';
import { mutationHandler } from '../../services/mutations/mutationHandler';
import { EndPoints } from '../../services/EndPoints';
import toastUtils from '../../utils/Toast/toast';



const SignUp = ({ navigation, route }) => {
    const { colors } = useTheme();
    const styles = getStyles(colors);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [activeField, setActiveField] = useState('');
    const [showLocationModal, setShowLocationModal] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [companySearch, setCompanySearch] = useState('');
    const [companySuggestions, setCompanySuggestions] = useState([]);
    const [showCompanyDropdown, setShowCompanyDropdown] = useState(false);
    const [loadingCompanies, setLoadingCompanies] = useState(false);
    const selectedRole = route?.params?.role || '';
    const selectedCompany = route?.params?.company || '';
    const selectedCompanyId = route?.params?.companyId || '';

    // console.log('=======selected role is here', selectedRole);
    // console.log('========sign up colors are here',colors);


    const { mutate, isPending, reset } = mutationHandler(
        EndPoints.signUp,
        null,
        (res) => {
            // console.log('========res is here sign up', res);

            reset();

            const role = res?.user?.role;
            const status = res?.user?.status || res?.driver?.DriverData?.status;

            if (role === 'driver' && status?.toLowerCase() === 'pending') {
                toastUtils.showSuccess(
                    'Sign Up Success',
                    'Driver account created successfully!'
                );

                navigation.navigate('RegisterDriverScreen', {
                    driverId: res?.driver?._id,
                    userId: res?.user?._id,
                    driver: res?.driver,
                    user: res?.user,
                });
                return;
            }

            toastUtils.showSuccess(
                'Sign Up Success',
                'Account created successfully!'
            );

            navigation.navigate('Login');
        },
        (err) => {
            console.log('Sign Up error:', err);

            reset();

            toastUtils.showError(
                'Sign Up Failed',
                err?.message || err || 'Failed to create account. Please try again.'
            );
        },
        'post'
    );


    const handleSignUp = async (values) => {
        const baseBody = {
            role: selectedRole,
            firstName: values.firstName?.trim(),
            lastName: values.lastName?.trim(),
            profileImage: '',
            emailAddress: values.emailAddress,
            phoneNumber: values.phoneNumber,
            password: values.password,
            companyName: values.company,
            companyId: values.companyId,
        };

        let body = {};

        if (selectedRole === 'customer') {
            body = {
                ...baseBody,
            };
        }

        if (selectedRole === 'corporate') {
            body = {
                ...baseBody,
                companyname: values.company,
                vatnumber: values.vatNumber,
                phone: values.phoneNumber,
                homeAddress: values.address,
                postcode: values.postCode,
            };
        }

        if (selectedRole === 'driver') {
            body = {
                ...baseBody,
                homeAddress: values.address,
                status: 'pending',
            };
        }

        console.log('Sign Up payload:', body);
        mutate(body);
    };


    const getPostCodeFromAddress = (address = '') => {
        const match = address.match(/[A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2}/i);
        return match ? match[0].toUpperCase() : '';
    };


    const initialValues = {
        firstName: '',
        lastName: '',
        vatNumber: '',
        postCode: '',
        emailAddress: '',
        phoneNumber: '',
        password: '',
        confirmPassword: '',
        address: '',
        role: selectedRole,
        company: selectedCompany,
        companyId: selectedCompanyId,
    };

    return (
        <Formik
            enableReinitialize
            initialValues={initialValues}
            validationSchema={validationSignUpSchema}
            validateOnBlur
            validateOnChange
            onSubmit={handleSignUp}
        >
            {({
                values,
                errors,
                touched,
                handleChange,
                handleBlur,
                handleSubmit,
                setFieldTouched,
                setFieldValue,
            }) => (
                <View style={{ flex: 1 }}>
                    <View style={styles.header1}>
                        <TouchableOpacity
                            style={styles.headerIcon}
                            onPress={() => navigation.goBack()}
                        >
                            <Icons.ArrowLeft size={26} color={colors.white} />
                        </TouchableOpacity>
                        <Text style={styles.headerTitle}>Sign Up</Text>
                        <View style={styles.headerRight} />
                    </View>

                    <KeyboardAwareScrollView
                        contentContainerStyle={styles.scrollContainer}
                        enableOnAndroid
                        extraScrollHeight={70}
                        keyboardShouldPersistTaps="handled"
                    >
                        <View style={styles.container}>
                            <View style={styles.header}>
                                {/* <View style={styles.logoContainer}>
                                    <Icons.LogIn size={36} color="#FFFFFF" />
                                </View> */}

                                <Text style={styles.title}>Welcome</Text>
                                <Text style={styles.subtitle}>Register to manage your account.</Text>
                            </View>

                            <View style={styles.rowGroup}>
                                <View style={[styles.halfInputGroup, { marginRight: 12 }]}>
                                    <Text style={styles.label}>First Name</Text>
                                    <View
                                        style={[
                                            styles.inputWrapper,
                                            activeField === 'firstName' && styles.inputWrapperActive,
                                        ]}
                                    >
                                        <TextInput
                                            style={styles.input}
                                            placeholder="First name"
                                            placeholderTextColor="#9CA3AF"
                                            value={values.firstName}
                                            onChangeText={handleChange('firstName')}
                                            onBlur={() => {
                                                handleBlur('firstName');
                                                setFieldTouched('firstName');
                                                setActiveField('');
                                            }}
                                            onFocus={() => setActiveField('firstName')}
                                            autoCapitalize="words"
                                        />
                                    </View>
                                    {touched.firstName && errors.firstName && (
                                        <Text style={styles.errorText}>{errors.firstName}</Text>
                                    )}
                                </View>

                                <View style={styles.halfInputGroup}>
                                    <Text style={styles.label}>Last Name</Text>
                                    <View
                                        style={[
                                            styles.inputWrapper,
                                            activeField === 'lastName' && styles.inputWrapperActive,
                                        ]}
                                    >
                                        <TextInput
                                            style={styles.input}
                                            placeholder="Last name"
                                            placeholderTextColor="#9CA3AF"
                                            value={values.lastName}
                                            onChangeText={handleChange('lastName')}
                                            onBlur={() => {
                                                handleBlur('lastName');
                                                setFieldTouched('lastName');
                                                setActiveField('');
                                            }}
                                            onFocus={() => setActiveField('lastName')}
                                            autoCapitalize="words"
                                        />
                                    </View>
                                    {touched.lastName && errors.lastName && (
                                        <Text style={styles.errorText}>{errors.lastName}</Text>
                                    )}
                                </View>
                            </View>

                            {selectedRole === 'corporate' && (
                                <View style={styles.rowGroup}>
                                    <View style={[styles.halfInputGroup, { marginRight: 12 }]}>
                                        <Text style={styles.label}>VAT Number</Text>
                                        <View
                                            style={[
                                                styles.inputWrapper,
                                                activeField === 'vatNumber' && styles.inputWrapperActive,
                                            ]}
                                        >
                                            <TextInput
                                                style={styles.input}
                                                placeholder="Enter VAT .."
                                                maxLength={10}
                                                placeholderTextColor={colors.lightText}
                                                value={values.vatNumber}
                                                onChangeText={handleChange('vatNumber')}
                                                onBlur={() => {
                                                    handleBlur('vatNumber');
                                                    setFieldTouched('vatNumber');
                                                    setActiveField('');
                                                }}
                                                onFocus={() => setActiveField('vatNumber')}
                                                autoCapitalize="characters"
                                            />
                                        </View>
                                        {touched.vatNumber && errors.vatNumber && (
                                            <Text style={styles.errorText}>{errors.vatNumber}</Text>
                                        )}
                                    </View>

                                    <View style={styles.halfInputGroup}>
                                        <Text style={styles.label}>Post Code</Text>
                                        <View style={styles.inputWrapper}>
                                            <TextInput
                                                style={[
                                                    styles.input,
                                                    { color: values.postCode ? colors.black : colors.lightText, fontSize: moderateScale(12) },
                                                ]}
                                                placeholder="Auto will appear..."
                                                placeholderTextColor={colors.lightText}
                                                value={values.postCode}
                                                editable={false}
                                            />
                                        </View>
                                        {touched.postCode && errors.postCode && (
                                            <Text style={styles.errorText}>{errors.postCode}</Text>
                                        )}
                                    </View>
                                </View>
                            )}

                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Email Address</Text>
                                <View
                                    style={[
                                        styles.inputWrapper,
                                        activeField === 'emailAddress' && styles.inputWrapperActive,
                                    ]}
                                >
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Enter your email"
                                        placeholderTextColor="#9CA3AF"
                                        value={values.emailAddress}
                                        onChangeText={handleChange('emailAddress')}
                                        onBlur={() => {
                                            handleBlur('emailAddress');
                                            setFieldTouched('emailAddress');
                                            setActiveField('');
                                        }}
                                        onFocus={() => setActiveField('emailAddress')}
                                        keyboardType="email-address"
                                        autoComplete="email"
                                        textContentType="username"
                                        importantForAutofill="yes"
                                        autoCapitalize="none"
                                    />
                                </View>
                                {touched.emailAddress && errors.emailAddress && (
                                    <Text style={styles.errorText}>{errors.emailAddress}</Text>
                                )}
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Mobile Phone</Text>
                                <CustomPhoneInput
                                    value={values.phoneNumber}
                                    defaultCode="GB"
                                    onChangeFormattedText={(formatted) => setFieldValue('phoneNumber', formatted)}
                                    colors={colors}
                                    containerStyle={styles.phoneInputContainer}
                                    textContainerStyle={styles.phoneTextContainer}
                                    flagButtonStyle={styles.phoneFlagButton}
                                    textInputStyle={styles.phoneTextInput}
                                />
                                {touched.phoneNumber && errors.phoneNumber && (
                                    <Text style={styles.errorText}>{errors.phoneNumber}</Text>
                                )}
                            </View>

                            {(selectedRole === 'driver' || selectedRole === 'corporate') && (
                                <View style={styles.inputGroup}>
                                    <Text style={styles.label}>Address</Text>

                                    <View
                                        style={[
                                            styles.inputWrapper,
                                            activeField === 'address' && styles.inputWrapperActive,
                                        ]}
                                    >
                                        {/* Address text area */}
                                        <TouchableOpacity
                                            style={{ flex: 1 }}
                                            activeOpacity={0.8}
                                            onPress={() => {
                                                // only open modal if no address selected
                                                if (!values.address) {
                                                    setSearchText('');
                                                    setShowLocationModal(true);
                                                }
                                            }}
                                        >
                                            <Text
                                                elipsizeMode="tail"
                                                numberOfLines={2}
                                                style={{
                                                    color: values.address ? colors.text : '#9CA3AF', width: '95%',
                                                }}
                                            >
                                                {values.address || 'Select address'}
                                            </Text>
                                        </TouchableOpacity>

                                        {values.address ? (
                                            <TouchableOpacity
                                                onPress={() => {
                                                    setFieldValue('address', '');
                                                    setSearchText('');
                                                }}
                                            >
                                                <Icons.X size={18} color={colors.placeholder} />
                                            </TouchableOpacity>
                                        ) : (
                                            <TouchableOpacity
                                                onPress={() => {
                                                    setSearchText('');
                                                    setShowLocationModal(true);
                                                }}
                                            >
                                                <Icons.Search size={18} color={colors.primary} />
                                            </TouchableOpacity>
                                        )}
                                    </View>

                                    {touched.address && errors.address && (
                                        <Text style={styles.errorText}>{errors.address}</Text>
                                    )}
                                </View>
                            )}

                            {/* {selectedRole === 'corporate' && (
                                <View style={styles.inputGroup}>
                                    <Text style={styles.label}>Company</Text>

                                    <View
                                        style={[
                                            styles.inputWrapper,
                                            activeField === 'company' && styles.inputWrapperActive,
                                        ]}
                                    >
                                        <TextInput
                                            style={styles.input}
                                            placeholder="Search company"
                                            placeholderTextColor="#9CA3AF"
                                            value={companySearch}
                                            onChangeText={(text) => {
                                                setFieldValue('company', '');
                                                fetchCompanies(text);
                                            }}
                                            onFocus={() => {
                                                setActiveField('company');
                                                if (companySuggestions.length > 0) {
                                                    setShowCompanyDropdown(true);
                                                }
                                            }}
                                        />

                                        {loadingCompanies ? (
                                            <ActivityIndicator size="small" color={colors.primary} />
                                        ) : companySearch ? (
                                            <TouchableOpacity
                                                onPress={() => {
                                                    setFieldValue('company', '');
                                                    setCompanySearch('');
                                                    setCompanySuggestions([]);
                                                    setShowCompanyDropdown(false);
                                                }}
                                            >
                                                <Icons.X size={18} color={colors.placeholder} />
                                            </TouchableOpacity>
                                        ) : (
                                            <Icons.Search size={18} color={colors.primary} />
                                        )}
                                    </View>

                                    {showCompanyDropdown && companySuggestions.length > 0 && (
                                        <View
                                            style={{
                                                marginTop: 6,
                                                borderWidth: 1,
                                                borderColor: colors.border,
                                                borderRadius: 10,
                                                backgroundColor: colors.bg,
                                                overflow: 'hidden',
                                                height: companySuggestions.length * 62,
                                            }}
                                        >
                                            {companySuggestions.map((item) => (
                                                <TouchableOpacity
                                                    key={item._id}
                                                    activeOpacity={0.7}
                                                    style={{
                                                        height: 62,
                                                        paddingHorizontal: 14,
                                                        justifyContent: 'center',
                                                        borderBottomWidth: 1,
                                                        borderBottomColor: colors.gray50,
                                                    }}
                                                    onPress={() => {
                                                        setFieldValue('company', item.companyName);
                                                        setCompanySearch(item.companyName);
                                                        setShowCompanyDropdown(false);
                                                    }}
                                                >
                                                    <Text
                                                        style={{
                                                            color: colors.text,
                                                            fontSize: 14,
                                                            fontWeight: '500',
                                                        }}
                                                        numberOfLines={1}
                                                    >
                                                        {item.companyName}
                                                    </Text>

                                                    {!!item.tradingName && item.tradingName !== item.companyName && (
                                                        <Text
                                                            style={{
                                                                color: colors.gray300,
                                                                fontSize: 12,
                                                                marginTop: 3,
                                                            }}
                                                            numberOfLines={1}
                                                        >
                                                            {item.tradingName}
                                                        </Text>
                                                    )}
                                                </TouchableOpacity>
                                            ))}
                                        </View>
                                    )}

                                    {touched.company && errors.company && (
                                        <Text style={styles.errorText}>{errors.company}</Text>
                                    )}
                                </View>
                            )} */}

                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Password</Text>
                                <View
                                    style={[
                                        styles.inputWrapper,
                                        activeField === 'password' && styles.inputWrapperActive,
                                    ]}
                                >
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Create password"
                                        placeholderTextColor="#9CA3AF"
                                        value={values.password}
                                        onChangeText={handleChange('password')}
                                        onBlur={() => {
                                            handleBlur('password');
                                            setFieldTouched('password');
                                            setActiveField('');
                                        }}
                                        onFocus={() => setActiveField('password')}
                                        secureTextEntry={!showPassword}
                                        autoComplete="password"
                                        textContentType="newPassword"
                                    />
                                    <TouchableOpacity onPress={() => setShowPassword((prev) => !prev)}>
                                        {showPassword ? (
                                            <Icons.EyeOff size={20} color={colors.primary} />
                                        ) : (
                                            <Icons.Eye size={20} color={colors.primary} />
                                        )}
                                    </TouchableOpacity>
                                </View>
                                {touched.password && errors.password && (
                                    <Text style={styles.errorText}>{errors.password}</Text>
                                )}
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Confirm Password</Text>
                                <View
                                    style={[
                                        styles.inputWrapper,
                                        activeField === 'confirmPassword' && styles.inputWrapperActive,
                                    ]}
                                >
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Confirm password"
                                        placeholderTextColor="#9CA3AF"
                                        value={values.confirmPassword}
                                        onChangeText={handleChange('confirmPassword')}
                                        onBlur={() => {
                                            handleBlur('confirmPassword');
                                            setFieldTouched('confirmPassword');
                                            setActiveField('');
                                        }}
                                        onFocus={() => setActiveField('confirmPassword')}
                                        secureTextEntry={!showConfirmPassword}
                                        autoComplete="password"
                                        textContentType="password"
                                    />
                                    <TouchableOpacity onPress={() => setShowConfirmPassword((prev) => !prev)}>
                                        {showConfirmPassword ? (
                                            <Icons.EyeOff size={20} color={colors.primary} />
                                        ) : (
                                            <Icons.Eye size={20} color={colors.primary} />
                                        )}
                                    </TouchableOpacity>
                                </View>
                                {touched.confirmPassword && errors.confirmPassword && (
                                    <Text style={styles.errorText}>{errors.confirmPassword}</Text>
                                )}
                            </View>

                            <TouchableOpacity
                                style={styles.signUpButton}
                                activeOpacity={0.8}
                                onPress={handleSubmit}
                            >
                                <Text style={styles.buttonText}>Sign Up</Text>
                            </TouchableOpacity>

                            <View style={styles.bottomRow}>
                                <Text style={styles.bottomText}>Already have an account?</Text>
                                <TouchableOpacity activeOpacity={0.7} onPress={() => navigation.navigate('Login')}>
                                    <Text style={styles.bottomLink}>Sign In</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </KeyboardAwareScrollView>
                    <LocationSearchModal
                        visible={showLocationModal}
                        onClose={() => setShowLocationModal(false)}
                        searchText={searchText}
                        setSearchText={setSearchText}
                        colors={colors}
                        onSelect={(location) => {
                            const selectedAddress = location.description;
                            const postCode = getPostCodeFromAddress(selectedAddress);

                            setFieldValue('address', selectedAddress);
                            setFieldValue('postCode', postCode);
                            setSearchText(selectedAddress);
                            setShowLocationModal(false);
                        }}
                    />
                </View>
            )}
        </Formik>
    );
};

export default SignUp;