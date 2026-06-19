import React from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';

import { Formik } from 'formik';
import { Mail, ArrowLeft } from 'lucide-react-native';
import { useNavigation, useTheme } from '@react-navigation/native';
import { moderateScale } from 'react-native-size-matters';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import getStyles from "./styles";
import toastUtils from '../../utils/Toast/toast';
import LoaderModal from '../../utils/loaderModal';
import { EndPoints } from '../../services/EndPoints';
import { mutationHandler } from '../../services/mutations/mutationHandler';
import { validationForgotPasswordSchema } from '../../utils/validationUtils';
import Icons from '../../assets/icons';

const ForgotPassword = () => {
    const { colors } = useTheme();
    const styles = getStyles(colors);
    const navigation = useNavigation();

    const { mutate, isPending, reset } = mutationHandler(
        EndPoints.forgotPassword,
        null,
        (res) => {
            reset();
            toastUtils.showSuccess('Success', 'Otp sent to your email');
        },
        (err) => {
            console.error("error:", err);
            reset();

            toastUtils.showError(
                'Forgot Password Failed',
                err.message || 'Email does not exist'
            );
        }
    );



    const handSend = (values) => {
        const body = {
            email: values?.email,
        };

        mutate(body);

        navigation.navigate('NewPassword', { email: values?.email });
    };

    return (
        <View style={{ flex: 1 }}>
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.headerIcon}
                    onPress={() => navigation.goBack()}
                >
                    <Icons.ArrowLeft size={26} color={colors.white} />
                </TouchableOpacity>
                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={styles.headerTitle}>
                        Forgot Password
                    </Text>
                    <Text style={styles.subtitle}>
                        Enter your email to receive OTP
                    </Text>
                </View>
                <View style={styles.headerRight} />
            </View>
            <Formik
                initialValues={{ email: '' }}
                validationSchema={validationForgotPasswordSchema}
                validateOnBlur
                validateOnChange
                onSubmit={(values) => {
                    handSend(values);
                }}
            >
                {({
                    values, errors, touched, handleChange, handleBlur, handleSubmit, setFieldTouched, isValid
                }) => (
                    <View style={styles?.scrollContainer}
                    >
                        <View style={styles.container}>
                            <View style={styles.centerWrapper}>
                                <View style={styles.formCard}>

                                    <View style={styles.inputGroup}>
                                        <Text style={styles.label}>Email Address</Text>

                                        <View style={[
                                            styles.inputWrapper,
                                            touched.email && errors.email && styles.inputError
                                        ]}>
                                            <Mail size={20} color={colors?.primary} />

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
                                                autoCapitalize="none"
                                            />
                                        </View>

                                        {touched.email && errors.email && (
                                            <Text style={styles.errorText}>{errors.email}</Text>
                                        )}
                                    </View>
                                    <View style={styles.buttonContainer}>
                                        <TouchableOpacity
                                            style={[
                                                styles.button,
                                                !isValid && styles.buttonDisabled
                                            ]}
                                            onPress={handleSubmit}
                                            activeOpacity={0.8}
                                            disabled={!isValid}
                                        >
                                            <Text style={styles.buttonText}>
                                                Send OTP
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>
                )}
            </Formik>
            <LoaderModal visible={isPending} />
        </View>
    );
};

export default ForgotPassword;