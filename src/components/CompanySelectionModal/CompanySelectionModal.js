import React, { useEffect, useState } from 'react';
import {
    Modal,
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Pressable,
} from 'react-native';

import { FlashList } from '@shopify/flash-list';
import { useTheme } from '@react-navigation/native';

import Icons from '../../assets/icons';
import { Theme } from '../../libs';
import { moderateScale } from 'react-native-size-matters';

const CompanySelectionModal = ({
    visible,
    companies = [],
    loading = false,
    onClose,
    onContinue,
}) => {
    const { colors } = useTheme();

    const [selectedCompanyId, setSelectedCompanyId] = useState(null);

    useEffect(() => {
        if (!visible) {
            setSelectedCompanyId(null);
        }
    }, [visible]);

    const selectedCompany = companies.find(
        company => company.companyId === selectedCompanyId,
    );

    const handleContinue = () => {
        if (!selectedCompany || loading) {
            return;
        }

        onContinue?.(selectedCompany);
    };

    const renderCompany = ({ item }) => {
        const isSelected = selectedCompanyId === item.companyId;

        const companyInitial =
            item?.tradingName?.charAt(0)?.toUpperCase() ||
            item?.name?.charAt(0)?.toUpperCase() ||
            'C';

        return (
            <TouchableOpacity
                activeOpacity={0.8}
                disabled={loading}
                onPress={() => setSelectedCompanyId(item.companyId)}
                style={[
                    styles.companyCard,
                    {
                        borderColor: isSelected
                            ? Theme.colors.primary
                            : '#E5E7EB',
                        backgroundColor: isSelected
                            ? '#F0F7FF'
                            : '#FFFFFF',
                    },
                ]}
            >
                <View
                    style={[
                        styles.companyInitialContainer,
                        {
                            backgroundColor: isSelected
                                ? Theme.colors.primary
                                : '#EEF2F7',
                        },
                    ]}
                >
                    <Text
                        style={[
                            styles.companyInitial,
                            {
                                color: isSelected
                                    ? '#FFFFFF'
                                    : Theme.colors.primary,
                            },
                        ]}
                    >
                        {companyInitial}
                    </Text>
                </View>

                <View style={styles.companyInfo}>
                    <Text
                        numberOfLines={1}
                        style={[
                            styles.companyName,
                            {
                                color: colors.text || '#111827',
                            },
                        ]}
                    >
                        {item.tradingName || item.name}
                    </Text>

                    {item.name &&
                        item.tradingName &&
                        item.name !== item.tradingName && (
                            <Text
                                numberOfLines={1}
                                style={styles.legalName}
                            >
                                {item.name}
                            </Text>
                        )}
                </View>

                <View
                    style={[
                        styles.radioOuter,
                        {
                            borderColor: isSelected
                                ? Theme.colors.primary
                                : '#CBD5E1',
                        },
                    ]}
                >
                    {isSelected && (
                        <View
                            style={[
                                styles.radioInner,
                                {
                                    backgroundColor: Theme.colors.primary,
                                },
                            ]}
                        />
                    )}
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            statusBarTranslucent
            onRequestClose={() => {
                if (!loading) {
                    onClose?.();
                }
            }}
        >
            <View style={styles.overlay}>
                <Pressable
                    style={StyleSheet.absoluteFill}
                    onPress={() => {
                        if (!loading) {
                            onClose?.();
                        }
                    }}
                />

                <View
                    style={[
                        styles.modalContainer,
                        {
                            backgroundColor: colors.card || '#FFFFFF',
                        },
                    ]}
                >
                    <View style={styles.header}>
                        <View style={styles.headerTextContainer}>
                            <Text
                                style={[
                                    styles.title,
                                    {
                                        color: colors.text || '#111827',
                                    },
                                ]}
                            >
                                Select a Company
                            </Text>

                            <Text style={styles.subtitle}>
                                Your account is linked with multiple companies.
                                Choose one to continue.
                            </Text>
                        </View>

                        <TouchableOpacity
                            activeOpacity={0.7}
                            disabled={loading}
                            onPress={onClose}
                            style={styles.closeButton}
                        >
                            <Icons.X
                                size={22}
                                color="#64748B"
                            />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.listContainer}>
                        <FlashList
                            data={companies}
                            renderItem={renderCompany}
                            keyExtractor={item => item.companyId}
                            estimatedItemSize={82}
                            showsVerticalScrollIndicator={false}
                            ItemSeparatorComponent={() => (
                                <View style={styles.separator} />
                            )}
                            ListEmptyComponent={
                                <View style={styles.emptyContainer}>
                                    <Text style={styles.emptyText}>
                                        No companies are available.
                                    </Text>
                                </View>
                            }
                        />

                        <TouchableOpacity
                            activeOpacity={0.8}
                            disabled={!selectedCompanyId || loading}
                            onPress={handleContinue}
                            style={[
                                styles.continueButton,
                                {
                                    backgroundColor: Theme.colors.primary,
                                    opacity:
                                        !selectedCompanyId || loading
                                            ? 0.5
                                            : 1,
                                },
                            ]}
                        >
                            <Text style={styles.continueButtonText}>
                                {loading ? 'Continuing...' : 'Continue'}
                            </Text>

                            {!loading && (
                                <Icons.ArrowRight
                                    size={20}
                                    color="#FFFFFF"
                                />
                            )}
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

export default CompanySelectionModal;

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: moderateScale(20),
        backgroundColor: 'rgba(15, 23, 42, 0.65)',
    },

    modalContainer: {
        width: '100%',
        maxHeight: '75%',
        minHeight: moderateScale(500),
        borderRadius: 20,
        padding: 20,
        shadowColor: '#000000',
        shadowOffset: {
            width: 0,
            height: 12,
        },
        shadowOpacity: 0.2,
        shadowRadius: 24,
        elevation: 10,
    },

    header: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        marginBottom: 20,
    },

    headerTextContainer: {
        flex: 1,
        paddingRight: moderateScale(12),
    },

    title: {
        fontSize: 22,
        fontWeight: '700',
    },

    subtitle: {
        marginTop: moderateScale(6),
        color: '#64748B',
        fontSize: 14,
        lineHeight: 20,
    },

    closeButton: {
        width: moderateScale(38),
        height: moderateScale(38),
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: moderateScale(19),
        backgroundColor: '#F1F5F9',
    },

    listContainer: {
        flex: 1,
        minHeight: moderateScale(360),
    },

    separator: {
        height: moderateScale(12),
    },

    companyCard: {
        minHeight: moderateScale(78),
        flexDirection: 'row',
        alignItems: 'center',
        padding: moderateScale(14),
        borderWidth: 1.5,
        borderRadius: moderateScale(14),
    },

    companyInitialContainer: {
        width: moderateScale(48),
        height: moderateScale(48),
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: moderateScale(12),
    },

    companyInitial: {
        fontSize: moderateScale(20),
        fontWeight: '700',
    },

    companyInfo: {
        flex: 1,
        marginHorizontal: moderateScale(12),
    },

    companyName: {
        fontSize: moderateScale(16),
        fontWeight: '700',
    },

    legalName: {
        marginTop: moderateScale(4),
        color: '#64748B',
        fontSize: moderateScale(13),
    },

    radioOuter: {
        width: moderateScale(24),
        height: moderateScale(24),
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderRadius: moderateScale(12),
    },

    radioInner: {
        width: moderateScale(12),
        height: moderateScale(12),
        borderRadius: moderateScale(6),
    },

    continueButton: {
        height: moderateScale(52),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: moderateScale(8),
        marginTop: moderateScale(20),
        borderRadius: moderateScale(12),
    },

    continueButtonText: {
        color: '#FFFFFF',
        fontSize: moderateScale(16),
        fontWeight: '700',
    },

    emptyContainer: {
        minHeight: moderateScale(360),
        alignItems: 'center',
        justifyContent: 'center',
    },

    emptyText: {
        color: '#64748B',
        fontSize: moderateScale(15),
    },
});