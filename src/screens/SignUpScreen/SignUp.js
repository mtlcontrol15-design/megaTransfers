import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';

import { Formik } from 'formik';
import { useTheme } from '@react-navigation/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import getStyles from './styles';
import Icons from '../../assets/icons';
import { useDispatch } from 'react-redux';
import toastUtils from '../../utils/Toast/toast';
import LoaderModal from '../../utils/loaderModal';
import { EndPoints } from '../../services/EndPoints';
import { moderateScale } from 'react-native-size-matters';
import { validationSignUpSchema } from '../../utils/validationUtils';
import { mutationHandler } from '../../services/mutations/mutationHandler';
import CustomPhoneInput from '../../components/CustomerInfo/CustomPhoneInput';
import LocationSearchModal from "../../components/JourneyCard/components/LocationSearchModal";
import { dispatchIsSignedIn, dispatchToken, dispatchUser } from '../../redux/slices/userSlice';



const SignUp = ({ navigation, route }) => {
    const { colors } = useTheme();
    const styles = getStyles(colors);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [activeField, setActiveField] = useState('');
    const [showLocationModal, setShowLocationModal] = useState(false);
    const [searchText, setSearchText] = useState('');
    const selectedRole = route?.params?.role || '';
    const selectedCompany = route?.params?.company || '';
    const selectedCompanyId = route?.params?.companyId || '';
    const socialAuth = route?.params?.socialAuth || null;
    const isSocialSignUp = Boolean(
        socialAuth?.provider && socialAuth?.idToken,
    );

    // console.log('=======selected role is here', selectedRole);s
    // console.log('========sign up colors are here',colors);
    // console.log('=======socialAuth is here', socialAuth);
    const dispatch = useDispatch();


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
            console.log('Sign Up error:', err?.response?.data || err);

            reset();

            toastUtils.showError(
                'Sign Up Failed',
                err?.message || err || 'Failed to create account. Please try again.'
            );
        },
        'post'
    );

    const {
        mutate: mutateSocialSignUp,
        isPending: isPendingSocialSignUp,
        reset: resetSocialSignUp,
    } = mutationHandler(
        EndPoints.socialLogin,
        null,
        res => {
            console.log('Social Sign Up response:', res);
            resetSocialSignUp();

            const user = res?.user;
            const driver = res?.driver;
            const role = user?.role;
            const status =
                user?.status || driver?.DriverData?.status;

            if (role === 'driver') {
                navigation.replace('RegisterDriverScreen', {
                    driverId: driver?._id,
                    userId: user?._id,
                    driver,
                    user,
                });
                return;
            }

            dispatch(dispatchUser(user));
            dispatch(dispatchToken(res?.token));
            dispatch(dispatchIsSignedIn(true));

            toastUtils.showSuccess(
                'Registration Complete',
                'Your account has been created successfully.',
            );
        },
        err => {
            resetSocialSignUp();

            const data = err?.response?.data || err;

            toastUtils.showError(
                'Registration Failed',
                data?.message ||
                err?.message ||
                'Unable to complete registration.',
            );
        },
        'post',
    );


    const handleSignUp = async values => {
        const commonBody = {
            emailAddress: values.emailAddress?.trim().toLowerCase(),
            role: selectedRole,
            firstName: values.firstName?.trim(),
            lastName: values.lastName?.trim(),
            phoneNumber: values.phoneNumber,
            companyId: values.companyId || selectedCompanyId,
        };

        if (isSocialSignUp) {
            const socialBaseBody = {
                ...commonBody,
                provider: socialAuth.provider,
                idToken: socialAuth.idToken,
            };

            let socialBody = { ...socialBaseBody };

            if (selectedRole === 'corporate') {
                socialBody = {
                    ...socialBaseBody,
                    companyname: values.company?.trim(),
                    vatnumber: values.vatNumber?.trim(),
                    postcode: values.postCode?.trim(),
                    homeAddress: values.address?.trim(),
                };
            }

            if (selectedRole === 'driver') {
                socialBody = {
                    ...socialBaseBody,
                    homeAddress: values.address?.trim(),
                    status: 'pending',
                };
            }

            console.log('Social signup body:', socialBody);

            mutateSocialSignUp(socialBody);
            return;
        }

        const emailBaseBody = {
            ...commonBody,
            password: values.password,
            confirmPassword: values.confirmPassword,
        };

        let body = { ...emailBaseBody };

        if (selectedRole === 'corporate') {
            body = {
                ...emailBaseBody,
                companyname: values.company?.trim(),
                vatnumber: values.vatNumber?.trim(),
                phone: values.phoneNumber,
                homeAddress: values.address?.trim(),
                postcode: values.postCode?.trim(),
            };
        }

        if (selectedRole === 'driver') {
            body = {
                ...emailBaseBody,
                homeAddress: values.address?.trim(),
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
        firstName: socialAuth?.firstName || '',
        lastName: socialAuth?.lastName || '',
        vatNumber: '',
        postCode: '',
        emailAddress: socialAuth?.emailAddress || '',
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
            validationContext={{ isSocialSignUp }}

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
                                            style={[
                                                styles.input,
                                                isSocialSignUp && {
                                                    opacity: 0.7,
                                                },
                                            ]}
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
                                            editable={!isSocialSignUp}
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
                                            style={[
                                                styles.input,
                                                isSocialSignUp && {
                                                    opacity: 0.7,
                                                },
                                            ]}
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
                                            editable={!isSocialSignUp}
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
                                        style={[
                                            styles.input,
                                            isSocialSignUp && {
                                                opacity: 0.7,
                                            },
                                        ]}
                                        placeholder="Enter your email"
                                        placeholderTextColor="#9CA3AF"
                                        value={values.emailAddress}
                                        onChangeText={
                                            isSocialSignUp
                                                ? undefined
                                                : handleChange('emailAddress')
                                        }
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
                                        editable={!isSocialSignUp}
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
                            {!isSocialSignUp && (
                                <>
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
                                </>

                            )}

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
                    <LoaderModal visible={isPending || isPendingSocialSignUp} />
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