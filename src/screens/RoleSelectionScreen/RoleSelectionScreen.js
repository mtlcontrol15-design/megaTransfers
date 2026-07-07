import React, { useEffect, useState } from 'react';
import { FlatList, Text, TouchableOpacity, View, ActivityIndicator, TextInput } from 'react-native';
import { useTheme } from '@react-navigation/native';

import Icons from '../../assets/icons';
import getStyles from './roleSelectionStyles';

import { API_CONFIG } from '../../config/config';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { EndPoints } from '../../services/EndPoints';
import queryHandler from '../../services/queries/queryHandler';

const roleOptions = [
    {
        label: 'Driver',
        value: 'driver',
        description: 'Accept jobs, navigate trips and track your earnings.',
        Icon: Icons.Car,
    },
    {
        label: 'Customer',
        value: 'customer',
        description: 'Book rides quickly for yourself with saved details.',
        Icon: Icons.User,
    },
    {
        label: 'Corporate Customer',
        value: 'corporate',
        description: 'Manage company bookings, drivers and invoices in one place.',
        Icon: Icons.UserStar,
    },
];

const CURRENT_COMPANY_NAME = 'Mega Transfers Limited';

const RoleSelectionScreen = ({ navigation }) => {
    const { colors } = useTheme();
    const styles = getStyles(colors);
    const [selectedRole, setSelectedRole] = useState('driver');
    const [companySearch, setCompanySearch] = useState('');
    const [companySuggestions, setCompanySuggestions] = useState([]);
    const [selectedCompany, setSelectedCompany] = useState(null);
    const [showCompanyDropdown, setShowCompanyDropdown] = useState(false);
    const [loadingCompanies, setLoadingCompanies] = useState(false);
    const [companyError, setCompanyError] = useState('');
    const [companyNotFound, setCompanyNotFound] = useState(false);

    const { data, error, status, isFetching, refetch } = queryHandler(EndPoints.getCompaniesForRoleSelection);

    // console.log('Suggested companies data:', data);

    useEffect(() => {
        const companies = data?.allCompanies || [];

        const megaTransfersCompany = companies.find(
            item =>
                item.companyName?.toLowerCase() === CURRENT_COMPANY_NAME.toLowerCase() ||
                item.tradingName?.toLowerCase() === CURRENT_COMPANY_NAME.toLowerCase()
        );

        if (megaTransfersCompany) {
            setSelectedCompany(megaTransfersCompany);
            setCompanySearch(megaTransfersCompany.companyName);
            setCompanyError('');
            setCompanyNotFound(false);
            setShowCompanyDropdown(false);
        }
    }, [data]);

    const handleContinue = () => {
        if (selectedRole === 'corporate' && !selectedCompany) {
            setCompanyError('Please select your company to continue.');
            return;
        }

        navigation.navigate('SignUp', {
            role: selectedRole,
            company: selectedCompany?.companyName || '',
            companyId: selectedCompany?._id || '',
        });
    };

    const isContinueDisabled = !selectedCompany;

    return (
        <KeyboardAwareScrollView
            contentContainerStyle={styles.scrollContainer}
            enableOnAndroid
            extraScrollHeight={70}
            keyboardShouldPersistTaps="handled"
        >
            <View style={styles.header1}>
                <TouchableOpacity
                    style={styles.headerIcon}
                    onPress={() => navigation.goBack()}
                >
                    <Icons.ArrowLeft size={26} color={colors.white} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Select Role</Text>
                <View style={styles.headerRight} />
            </View>

            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.title}>Join Mega Transfers</Text>
                    <Text style={styles.subtitle}>
                        Choose how you'll use the app to get started.
                    </Text>
                </View>

                <Text style={styles.sectionLabel}>SELECT YOUR ROLE</Text>

                <FlatList
                    data={roleOptions}
                    keyExtractor={(item) => item.value}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.listContent}
                    renderItem={({ item }) => {
                        const selected = selectedRole === item.value;
                        const RoleIcon = item.Icon;

                        return (
                            <TouchableOpacity
                                activeOpacity={0.85}
                                style={[
                                    styles.roleCard,
                                    selected && styles.roleCardSelected,
                                ]}
                                onPress={() => {
                                    setSelectedRole(item.value);

                                    if (item.value !== 'corporate') {
                                        setCompanySuggestions([]);
                                        setShowCompanyDropdown(false);
                                        setCompanyError('');
                                        setCompanyNotFound(false);
                                    }
                                }}
                            >
                                <View
                                    style={[
                                        styles.roleIconBox,
                                        selected && styles.roleIconBoxSelected,
                                    ]}
                                >
                                    <RoleIcon
                                        size={26}
                                        color={selected ? colors.white : colors.black}
                                    />
                                </View>

                                <View style={styles.roleTextBox}>
                                    <Text style={styles.roleTitle}>{item.label}</Text>
                                    <Text style={styles.roleDescription}>
                                        {item.description}
                                    </Text>
                                </View>

                                <View
                                    style={[
                                        styles.radioOuter,
                                        selected && styles.radioOuterSelected,
                                    ]}
                                >
                                    {selected ? (
                                        <Icons.Check size={18} color={colors.white} />
                                    ) : null}
                                </View>
                            </TouchableOpacity>
                        );
                    }}
                />
                <View style={{ marginTop: 0 }}>
                    <Text style={styles.sectionLabel}>COMPANY NAME</Text>

                    <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            height: 48,
                            borderWidth: 1,
                            borderColor: companyError ? colors.error : colors.gray200,
                            borderRadius: 8,
                            paddingHorizontal: 14,
                            backgroundColor: colors.white,
                        }}
                    >
                        <TextInput
                            style={{
                                flex: 1,
                                color: colors.black,
                                fontSize: 15,
                            }}
                            placeholder="Company name"
                            placeholderTextColor={colors.lightText}
                            value={companySearch}
                            editable={false}
                            selectTextOnFocus={false}
                        />

                        {isFetching ? (
                            <ActivityIndicator size="small" color={colors.primary} />
                        ) : (
                            <Icons.Check size={18} color={colors.primary} />
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
                                        setSelectedCompany(item);
                                        setCompanySearch(item.companyName);
                                        setShowCompanyDropdown(false);
                                        setCompanyError('');
                                        setCompanyNotFound(false);
                                    }}
                                >
                                    <Text
                                        style={{
                                            color: colors.text,
                                            fontSize: 14,
                                            fontWeight: '600',
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

                    {companyNotFound && !loadingCompanies && (
                        <Text
                            style={{
                                color: colors.error,
                                fontSize: 12,
                                marginTop: 6,
                            }}
                        >
                            Company not found
                        </Text>
                    )}

                    {!!companyError && (
                        <Text
                            style={{
                                color: colors.error,
                                fontSize: 12,
                                marginTop: 6,
                            }}
                        >
                            {companyError}
                        </Text>
                    )}

                    {!!companyError && (
                        <Text
                            style={{
                                color: colors.error,
                                fontSize: 12,
                                marginTop: 6,
                            }}
                        >
                            {companyError}
                        </Text>
                    )}
                </View>
            </View>

            <View style={styles.footer}>
                <TouchableOpacity
                    activeOpacity={0.85}
                    disabled={isContinueDisabled}
                    style={[
                        styles.continueButton,
                        isContinueDisabled && {
                            backgroundColor: colors.gray300,
                            opacity: 0.6,
                        },
                    ]}
                    onPress={handleContinue}
                >
                    <Text style={styles.continueText}>Continue</Text>
                    <Icons.ArrowRight size={24} color={colors.white} />
                </TouchableOpacity>

                <View style={styles.signInRow}>
                    <Text style={styles.signInText}>Already have an account?</Text>
                    <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                        <Text style={styles.signInLink}>Sign In</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </KeyboardAwareScrollView>
    );
};

export default RoleSelectionScreen;