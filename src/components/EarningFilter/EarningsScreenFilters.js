import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Icons from "../../assets/icons";
import getStyles from "./style";
import { useTheme } from "@react-navigation/native";

const EarningsScreenFilters = ({
    startDate,
    endDate,
    statusFilter = [],

    onPressStatus = () => { },
    onPressDate = () => { },

    clearFilters = () => { },

    statusModalVisible = false,
    setStatusModalVisible = () => { },
    dateModalVisible = false,
    setDateModalVisible = () => { },

    setStartDate = () => { },
    setEndDate = () => { },
    setStatusFilter = () => { },
}) => {
    const { colors } = useTheme();
    const styles = getStyles(colors);

    const hasActiveFilters =
        startDate || endDate || statusFilter.length > 0;

    const getDateDisplay = () => {
        if (startDate && endDate) {
            return `${startDate} - ${endDate}`;
        }
        return "Any Date";
    };

    return (
        <View style={styles.container}>

            <View style={styles.row}>

                <TouchableOpacity
                    style={[
                        styles.filterBtn,
                        statusFilter.length > 0 && styles.activeFilter,
                    ]}
                    onPress={onPressStatus}
                >
                    <View style={styles.filterContent}>
                        <View style={styles.iconBox}>
                            <Icons.Filter size={16} color={colors.textSecondary} />
                        </View>

                        <View style={styles.textWrap}>
                            <Text style={styles.label}>Status</Text>

                            <Text style={styles.value}>
                                {statusFilter.length > 0
                                    ? `${statusFilter.length} selected`
                                    : "All Status"}
                            </Text>
                        </View>
                    </View>

                    <Icons.ChevronDown size={16} color={colors.textSecondary} />
                </TouchableOpacity>

                <TouchableOpacity
                    style={[
                        styles.filterBtn,
                        startDate && endDate && styles.activeFilter,
                    ]}
                    onPress={onPressDate}
                >
                    <View style={styles.filterContent}>
                        <View style={styles.iconBox}>
                            <Icons.Calendar size={16} color={colors.textSecondary} />
                        </View>

                        <View style={styles.textWrap}>
                            <Text style={styles.label}>Date</Text>

                            <Text style={styles.value} numberOfLines={1}>
                                {getDateDisplay()}
                            </Text>
                        </View>
                    </View>

                    <Icons.ChevronDown size={16} color={colors.textSecondary} />
                </TouchableOpacity>
            </View>

            {hasActiveFilters && (
                <TouchableOpacity
                    style={styles.clearBtn}
                    onPress={clearFilters}
                >
                    <Icons.XCircle size={16} color="#DC2626" />

                    <Text style={styles.clearText}>
                        Clear All Filters
                    </Text>
                </TouchableOpacity>
            )}

        </View>
    );
};

export default EarningsScreenFilters;