import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';

import { Formik } from 'formik';
import { Lock, Eye, EyeOff } from 'lucide-react-native';
import { useNavigation, useTheme } from '@react-navigation/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import getStyles from './styles';
import Icons from '../../assets/icons';
import toastUtils from '../../utils/Toast/toast';
import LoaderModal from '../../utils/loaderModal';
import { EndPoints } from '../../services/EndPoints';
import { validationNewPasswordSchema } from '../../utils/validationUtils';
import { mutationHandler } from '../../services/mutations/mutationHandler';

const NewPassword = ({ route }) => {
    const { colors } = useTheme();
    const styles = getStyles(colors);
    const navigation = useNavigation();
    const { email = '', companyId } = route.params || {};
    const [showPassword, setShowPassword] = useState(false);

    // console.log('========email', email);
    // console.log('========companyId', companyId);


    const { mutate, isPending, reset } = mutationHandler(
        EndPoints.resetPassword,
        null,
        (res) => {
            reset();
            console.log('========res', res);

            toastUtils.showSuccess('Success', 'Password successfully updated');

            navigation.navigate('Login');
        },
        (err) => {
            console.error("error:", err.response?.data?.message || err.message);
            reset();

            toastUtils.showError(
                'Reset Password Failed',
                err.message
            );
        }
    );

    const handSend = (values) => {
        const body = {
            email: email,
            otp: values?.otp,
            newPassword: values?.newPassword,
            companyId: companyId,
        };

        mutate(body);
        console.log('========body', body);
    };

    return (
        <Formik
            initialValues={{ otp: '', newPassword: '', confirmPassword: '' }}
            validationSchema={validationNewPasswordSchema}
            onSubmit={(values) => {
                handSend(values);
            }}
        >
            {({ values, errors, touched, handleChange, handleBlur, handleSubmit, setFieldTouched, isValid,
            }) => (
                <KeyboardAwareScrollView
                    contentContainerStyle={styles.scrollContainer}
                    enableOnAndroid
                    extraScrollHeight={70}
                    keyboardShouldPersistTaps="handled"
                >
                    <View style={styles.header}>
                        <TouchableOpacity
                            style={styles.headerIcon}
                            onPress={() => navigation.goBack()}
                        >
                            <Icons.ArrowLeft size={26} color={colors.white} />
                        </TouchableOpacity>
                        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={styles.headerTitle}>
                                Create New Password
                            </Text>
                            <Text style={styles.subtitle}>
                                Enter OTP and set your new password
                            </Text>
                        </View>
                        <View style={styles.headerRight} />
                    </View>
                    <View style={styles.container}>
                        <View style={styles.form}>
                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>OTP Code</Text>

                                <TextInput
                                    style={[
                                        styles.otpInput,
                                        touched.otp && errors.otp && styles.inputError
                                    ]}
                                    value={values.otp}
                                    onChangeText={text =>
                                        handleChange('otp')(text.replace(/\D/g, '').slice(0, 6))
                                    }
                                    onBlur={() => {
                                        handleBlur('otp');
                                        setFieldTouched('otp');
                                    }}
                                    keyboardType="number-pad"
                                    maxLength={6}
                                    placeholder="Enter OTP"
                                    placeholderTextColor="#9CA3AF"
                                />

                                {touched.otp && errors.otp && (
                                    <Text style={styles.errorText}>{errors.otp}</Text>
                                )}
                            </View>
                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>New Password</Text>

                                <View style={[
                                    styles.inputWrapper,
                                    touched.newPassword && errors.newPassword
                                ]}>
                                    <Lock size={20} color={colors?.primary} />

                                    <TextInput
                                        style={styles.input}
                                        value={values.newPassword}
                                        onChangeText={handleChange('newPassword')}
                                        onBlur={() => {
                                            handleBlur('newPassword');
                                            setFieldTouched('newPassword');
                                        }}
                                        placeholder="Enter new password"
                                        placeholderTextColor="#9CA3AF"
                                        secureTextEntry={!showPassword}
                                    />

                                    <TouchableOpacity
                                        onPress={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? (
                                            <EyeOff size={20} color={colors?.primary} />
                                        ) : (
                                            <Eye size={20} color={colors?.primary} />
                                        )}
                                    </TouchableOpacity>
                                </View>

                                {touched.newPassword && errors.newPassword && (
                                    <Text style={styles.errorText}>{errors.newPassword}</Text>
                                )}
                            </View>
                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Confirm Password</Text>

                                <View style={[
                                    styles.inputWrapper,
                                    touched.confirmPassword && errors.confirmPassword
                                ]}>
                                    <Lock size={20} color="#6B7280" />

                                    <TextInput
                                        style={styles.input}
                                        value={values.confirmPassword}
                                        onChangeText={handleChange('confirmPassword')}
                                        onBlur={() => {
                                            handleBlur('confirmPassword');
                                            setFieldTouched('confirmPassword');
                                        }}
                                        placeholder="Confirm password"
                                        placeholderTextColor="#9CA3AF"
                                        secureTextEntry={!showPassword}
                                    />
                                </View>

                                {touched.confirmPassword && errors.confirmPassword && (
                                    <Text style={styles.errorText}>{errors.confirmPassword}</Text>
                                )}
                            </View>
                            <View style={styles.buttonWrapper}>
                                <TouchableOpacity
                                    activeOpacity={0.7}
                                    style={[
                                        styles.button,
                                        // !isValid && styles.buttonDisabled
                                    ]}
                                    onPress={handleSubmit}
                                // disabled={!isValid}
                                >
                                    <Text style={styles.buttonText}>
                                        Reset Password
                                    </Text>
                                </TouchableOpacity>
                            </View>

                        </View>
                        <LoaderModal visible={isPending} />
                    </View>
                </KeyboardAwareScrollView>
            )}
        </Formik>
    );
};

export default NewPassword;