import { useRef, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';

import { Formik } from 'formik';
import { Mail } from 'lucide-react-native';
import { useNavigation, useTheme } from '@react-navigation/native';

import getStyles from "./styles";
import Icons from '../../assets/icons';
import toastUtils from '../../utils/Toast/toast';
import LoaderModal from '../../utils/loaderModal';
import { EndPoints } from '../../services/EndPoints';
import { mutationHandler } from '../../services/mutations/mutationHandler';
import { validationForgotPasswordSchema } from '../../utils/validationUtils';

const ForgotPassword = () => {
    const { colors } = useTheme();
    const styles = getStyles(colors);
    const navigation = useNavigation();
    const submittedEmailRef = useRef("");

    const [accounts, setAccounts] = useState([]);
    const [selectedAccount, setSelectedAccount] = useState(null);

    const { mutate, isPending, reset } = mutationHandler(
        EndPoints.forgotPassword,
        null,
        res => {
            console.log("Forgot Password Response:", res);

            reset();
            setAccounts([]);
            setSelectedAccount(null);

            toastUtils.showSuccess(
                "Success",
                res?.data?.message ||
                res?.message ||
                "OTP sent to your email"
            );

            navigation.navigate("NewPassword", {
                email: submittedEmailRef.current,
                companyId: selectedAccount?.companyId,
                userId: selectedAccount?.userId,
            });
        },
        err => {
            console.log(
                "Forgot Password Error:",
                err?.response?.data || err
            );

            reset();

            const status = err?.response?.status;
            const responseData = err?.response?.data;

            if (
                status === 409 &&
                responseData?.code === "COMPANY_REQUIRED" &&
                Array.isArray(responseData?.accounts)
            ) {
                setAccounts(responseData.accounts);
                setSelectedAccount(null);
                return;
            }

            const errorMessage =
                responseData?.message ||
                responseData?.error ||
                (status === 404
                    ? "This email address is not registered."
                    : "Unable to send OTP. Please try again.");

            toastUtils.showError(
                "Forgot Password Failed",
                errorMessage
            );
        }
    );

    const handleSelectCompany = account => {
        setSelectedAccount(account);
    };

    const handleSend = values => {
        const email = values.email.trim().toLowerCase();

        submittedEmailRef.current = email;

        if (accounts.length > 0) {
            if (!selectedAccount) {
                toastUtils.showError(
                    "Company Required",
                    "Please select a company"
                );

                return;
            }

            mutate({
                email,
                companyId: selectedAccount.companyId,
                userId: selectedAccount.userId,
            });

            return;
        }

        mutate({ email });
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
                    handleSend(values);
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

                                    {accounts.length > 0 && (
                                        <View style={styles.companySection}>
                                            <Text style={styles.companyTitle}>
                                                Select Company
                                            </Text>

                                            <Text style={styles.companyDescription}>
                                                This email belongs to multiple accounts. Select the
                                                company where you want to reset your password.
                                            </Text>

                                            {accounts.map(account => {
                                                const isSelected =
                                                    selectedAccount?.userId === account.userId;

                                                return (
                                                    <TouchableOpacity
                                                        key={`${account.companyId}-${account.userId}`}
                                                        activeOpacity={0.8}
                                                        onPress={() => handleSelectCompany(account)}
                                                        style={[
                                                            styles.companyCard,
                                                            isSelected && styles.selectedCompanyCard,
                                                        ]}
                                                    >
                                                        <View style={styles.companyInfo}>
                                                            <Text style={styles.companyName}>
                                                                {account.companyName ||
                                                                    account.label ||
                                                                    "Company"}
                                                            </Text>

                                                            <Text style={styles.accountName}>
                                                                {account.fullName}
                                                            </Text>

                                                            <Text style={styles.accountRole}>
                                                                {account.role}
                                                            </Text>
                                                        </View>

                                                        <View
                                                            style={[
                                                                styles.radioOuter,
                                                                isSelected && styles.radioOuterSelected,
                                                            ]}
                                                        >
                                                            {isSelected && (
                                                                <View style={styles.radioInner} />
                                                            )}
                                                        </View>
                                                    </TouchableOpacity>
                                                );
                                            })}
                                        </View>
                                    )}
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