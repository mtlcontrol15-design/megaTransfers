import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';

import { Formik } from 'formik';
import { useDispatch } from 'react-redux';
import { useTheme } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';


import getStyles from './styles';
import { Theme } from '../../libs';
import Icons from "../../assets/icons";
import toastUtils from '../../utils/Toast/toast';
import LoaderModal from '../../utils/loaderModal';
import { EndPoints } from '../../services/EndPoints';
import { validationLoginSchema } from '../../utils/validationUtils';
import { mutationHandler } from '../../services/mutations/mutationHandler';
import { dispatchIsSignedIn, dispatchToken, dispatchUser } from '../../redux/slices/userSlice';

const Login = ({ navigation }) => {
    const { colors } = useTheme();
    const styles = getStyles(colors);
    const [remember, setRemember] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [initialValues, setInitialValues] = useState({
        email: '',
        password: '',
    });

    const dispatch = useDispatch();

    const { mutate, isPending, reset } = mutationHandler(
        EndPoints.login,
        null,
        (res) => {
            console.log('========res is here login', res);

            reset();

            const user = res?.user;
            const driver = res?.driver;
            const userRole = user?.role;
            const status = user?.status || driver?.DriverData?.status;

            if (
                userRole !== "customer" &&
                userRole !== "driver" &&
                userRole !== "corporate"
            ) {
                toastUtils.showError(
                    "Access Denied",
                    "Only customers, drivers, and corporate users can login"
                );
                return;
            }

            if (userRole === "driver") {
                if (user?.hasUploadedDocuments === false) {
                    navigation.navigate("RegisterDriverScreen", {
                        driver,
                        user,
                    });
                    return;
                }

                if (status?.toLowerCase() === "pending") {
                    toastUtils.showInfo(
                        "Account Pending",
                        "Your account is pending. Contact administrator."
                    );
                    return;
                }
            }

            dispatch(dispatchUser(user));
            dispatch(dispatchToken(res.token));
            dispatch(dispatchIsSignedIn(true));

            toastUtils.showSuccess(
                "Login Success",
                `Welcome ${userRole}!`
            );
        },
        (err) => {
            console.error("Login error:", err);
            reset();

            const data = err?.response?.data || err;
            const user = data?.user;
            const driver = data?.driver;
            const status = user?.status || driver?.DriverData?.status;
            const message = data?.message || err?.message || "User does not exist";

            if (user?.role === "driver") {
                if (user?.hasUploadedDocuments === false) {
                    navigation.navigate("RegisterDriverScreen", {
                        driver,
                        user,
                    });
                    return;
                }

                if (status?.toLowerCase() === "pending") {
                    toastUtils.showInfo(
                        "Account Pending",
                        "Your account is pending. Contact administrator."
                    );
                    return;
                }
            }

            toastUtils.showError("Login Failed", message);
        }
    );



    const handleLogin = async (values) => {
        const body = {
            email: values?.email,
            password: values?.password,
        };

        if (remember) {
            await AsyncStorage.setItem(
                'rememberUser',
                JSON.stringify({
                    email: values.email,
                    password: values.password,
                    remember: true,
                })
            );
        } else {
            await AsyncStorage.removeItem('rememberUser');
        }

        mutate(body);
    };

    useEffect(() => {
        const loadCredentials = async () => {
            const saved = await AsyncStorage.getItem('rememberUser');

            if (saved) {
                const data = JSON.parse(saved);

                setRemember(true);
                setInitialValues({
                    email: data.email,
                    password: data.password,
                });
            }
        };

        loadCredentials();
    }, []);

    return (
        <Formik
            initialValues={initialValues}
            enableReinitialize
            validationSchema={validationLoginSchema}
            validateOnBlur
            validateOnChange
            onSubmit={(values) => {
                console.log('Form Values:', values);

                handleLogin(values);
            }}
        >
            {({
                values,
                errors,
                touched,
                handleChange,
                handleBlur,
                handleSubmit,
                setFieldTouched,
            }) => (
                <View style={{ flex: 1 }}>
                    <View style={styles.header1}>
                        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={styles.headerTitle}>
                                Sign In
                            </Text>
                        </View>
                    </View>
                    <KeyboardAwareScrollView
                        contentContainerStyle={styles.scrollContainer}
                        enableOnAndroid
                        extraScrollHeight={70}
                        keyboardShouldPersistTaps="handled"
                    >
                        <View style={styles.container}>
                            <View style={styles.header}>
                                <View style={styles.logoContainer}>
                                    <Icons.LogIn size={40} color="#FFFFFF" />
                                </View>

                                <Text style={styles.title}>Welcome Back</Text>
                                <Text style={styles.subtitle}>
                                    Sign in to continue to your account
                                </Text>
                            </View>
                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Email Address</Text>

                                <View style={styles.inputWrapper}>
                                    <Icons.Mail size={20} color={Theme.colors.primary} />
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Enter your email"
                                        placeholderTextColor="#9CA3AF"
                                        value={values.email}
                                        onChangeText={handleChange('email')}
                                        onBlur={() => {
                                            handleBlur('email');
                                            setFieldTouched('email');
                                        }}
                                        keyboardType="email-address"
                                        autoComplete="email"
                                        textContentType="username"
                                        importantForAutofill="yes"
                                        autoCapitalize='none'


                                    />
                                </View>

                                {touched.email && errors.email && (
                                    <Text style={styles.errorText}>{errors.email}</Text>
                                )}
                            </View>
                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Password</Text>

                                <View style={styles.inputWrapper}>
                                    <Icons.Lock size={20} color={Theme.colors.primary} />
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Enter your password"
                                        placeholderTextColor="#9CA3AF"
                                        value={values.password}
                                        onChangeText={handleChange('password')}
                                        onBlur={() => {
                                            handleBlur('password');
                                            setFieldTouched('password');
                                        }}
                                        secureTextEntry={!showPassword}
                                        autoComplete="password"
                                        textContentType="password"
                                        importantForAutofill="yes"

                                    />

                                    <TouchableOpacity
                                        onPress={() => setShowPassword(!showPassword)}
                                    >
                                        {/* <Eye size={20} color="#6B7280" /> */}
                                        {showPassword ? (
                                            <Icons.EyeOff size={20} color={Theme.colors.primary} />
                                        ) : (
                                            <Icons.Eye size={20} color={Theme.colors.primary} />
                                        )}
                                    </TouchableOpacity>
                                </View>

                                {touched.password && errors.password && (
                                    <Text style={styles.errorText}>{errors.password}</Text>
                                )}
                            </View>

                            <View style={styles.optionsRow}>
                                <TouchableOpacity
                                    style={styles.rememberMe}
                                    onPress={() => setRemember(prev => !prev)}
                                    activeOpacity={0.7}
                                >
                                    {remember ? (
                                        <Icons.CheckSquare size={24} color={Theme.colors.red} />
                                    ) : (
                                        <Icons.Square size={24} color={Theme.colors.red} />
                                    )}
                                    <Text style={styles.rememberText}>Remember Me</Text>
                                </TouchableOpacity>

                                <TouchableOpacity activeOpacity={0.7} onPress={() => navigation.navigate('ForgotPassword')}>
                                    <Text style={styles.forgotText}>Forgot Password?</Text>
                                </TouchableOpacity>
                            </View>

                            <TouchableOpacity
                                style={styles.loginButton}
                                activeOpacity={0.8}
                                onPress={handleSubmit}
                            >
                                <View style={styles.buttonContent}>
                                    <Icons.LogIn size={24} color="#FFFFFF" />
                                    <Text style={styles.buttonText}>Sign In</Text>
                                </View>
                            </TouchableOpacity>

                            <View style={styles.signupContainer}>
                                <Text style={styles.signupText}>Don't have an account? </Text>
                                <TouchableOpacity
                                    activeOpacity={0.7}
                                    onPress={() => navigation.navigate('RoleSelectionScreen')}
                                >
                                    <Text style={styles.signupLink}>Sign Up</Text>
                                </TouchableOpacity>
                            </View>

                        </View>
                        <LoaderModal visible={isPending} />
                    </KeyboardAwareScrollView>
                </View>
            )}
        </Formik>
    );
};

export default Login;