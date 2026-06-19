import React, { useState, useMemo } from "react";
import { View, TextInput, TouchableOpacity, Text } from "react-native";
import { useTheme } from "@react-navigation/native";

import Icons from "../../assets/icons";
import getStyles from "./style";

import DateFilterModal from "./DateFilterModal";
import SortModal from "./SortModal";
import StatusModal from "./StatusModal";
import { parseJobDate } from '../../utils/dateUtils'

const EarningsFilters = ({ jobs, setFilteredJobs }) => {
    const { colors } = useTheme();
    const styles = getStyles(colors);

    const [searchTerm, setSearchTerm] = useState("");
    const [showDateModal, setShowDateModal] = useState(false);
    const [showSortModal, setShowSortModal] = useState(false);
    const [showStatusModal, setShowStatusModal] = useState(false);
    const [sortApplied, setSortApplied] = useState(false);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [statusFilter, setStatusFilter] = useState([]);
    const [sortBy, setSortBy] = useState("date-asc");


    console.log('=======job is here', jobs);


    const filtered = useMemo(() => {
        let data = [...jobs];

        if (searchTerm) {
            const term = searchTerm.toLowerCase().trim();

            const isNumberSearch = /^\d+$/.test(term);

            data = data.filter((job) => {
                const bookingId = job?.booking?.bookingId?.toLowerCase() || "";
                const status = job?.booking?.status?.toLowerCase() || "";

                if (isNumberSearch) {
                    return bookingId.includes(term);
                } else {
                    return status.includes(term);
                }
            });
        }

        if (statusFilter.length) {
            data = data.filter((job) =>
                statusFilter.includes(job?.booking?.status?.toLowerCase())
            );
        }

        if (startDate && endDate) {
            const start = new Date(startDate);
            start.setHours(0, 0, 0, 0);

            const end = new Date(endDate);
            end.setHours(0, 0, 0, 0);

            data = data.filter((job) => {
                const jobDate = parseJobDate(job);

                if (!jobDate) return false;

                return jobDate >= start && jobDate <= end;
            });
        }

        if (sortBy === "date-asc") {
            data.sort((a, b) => parseJobDate(b) - parseJobDate(a));
        }

        if (sortBy === "date-desc") {
            data.sort((a, b) => parseJobDate(a) - parseJobDate(b));
        }
        if (sortBy === "booking-asc") {
            data.sort((a, b) => a.bookingId.localeCompare(b.bookingId));
        }

        if (sortBy === "booking-desc") {
            data.sort((a, b) => b.bookingId.localeCompare(a.bookingId));
        }

        return data;
    }, [jobs, searchTerm, statusFilter, startDate, endDate, sortBy]);

    React.useEffect(() => {
        setFilteredJobs(filtered);
    }, [filtered, setFilteredJobs]);

    const hasActiveFilters =
        searchTerm ||
        startDate ||
        endDate ||
        statusFilter.length > 0 ||
        sortApplied;

    const isStatusActive = statusFilter.length > 0;
    const isDateActive = startDate || endDate;
    const isSortActive = sortApplied;

    const statusOptions = [
        { id: 'accepted', label: 'Accepted' },
        { id: 'on route', label: 'On Route' },
        { id: 'at location', label: 'At Location' },
        { id: 'add waiting', label: 'Add Waiting' },
        { id: 'extra stop', label: 'Extra Stop' },
        { id: 'ride started', label: 'Ride Started' },
        { id: 'late cancel', label: 'Late Cancel' },
        { id: 'no show', label: 'No Show' },
        { id: 'completed', label: 'Completed' },
    ];

    const selectedStatusLabel = statusOptions
        .filter((s) => statusFilter.includes(s.id))
        .map((s) => s.label)
        .join(", ");

    const sortOptions = [
        { id: "date-desc", label: "Newest First" },
        { id: "date-asc", label: "Oldest First" },
        { id: "booking-asc", label: "Booking ID (A-Z)" },
        { id: "booking-desc", label: "Booking ID (Z-A)" },
    ];

    const selectedSortLabel =
        sortOptions.find((s) => s.id === sortBy)?.label || "Sort";

    const formatDate = (date) => {
        if (!date) return "";
        const d = new Date(date);
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        return `${String(d.getDate()).padStart(2, "0")} ${months[d.getMonth()]}`;
    };

    const selectedDateLabel =
        startDate && endDate
            ? `${formatDate(startDate)} - ${formatDate(endDate)}`
            : "Date";

    return (
        <View style={styles.container}>

            <View style={styles.searchContainer}>
                <Icons.Search size={18} color={colors.gray300} />
                <TextInput
                    placeholder="Search Booking ID"
                    placeholderTextColor="#9CA3AF"
                    style={styles.searchInput}
                    value={searchTerm}
                    onChangeText={setSearchTerm}
                />
            </View>

            <View style={styles.buttonsRow}>

                <TouchableOpacity
                    style={[
                        styles.filterButton,
                        isStatusActive && styles.activeFilterButton
                    ]}
                    onPress={() => setShowStatusModal(true)}
                >
                    <Icons.Filter size={16} color={isStatusActive ? colors.lightGreen : colors.gray300} />
                    <Text
                        style={[
                            styles.filterText,
                            isStatusActive && { color: colors.lightGreen },
                        ]}
                    >
                        {selectedStatusLabel || "Status"}
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[
                        styles.filterButton,
                        isSortActive && styles.activeFilterButton
                    ]}
                    onPress={() => setShowSortModal(true)}
                >
                    <Icons.ArrowUpDown size={16} color={isSortActive ? colors.lightGreen : colors.gray300} />
                    <Text
                        style={[
                            styles.filterText,
                            isSortActive && { color: colors.lightGreen }
                        ]}
                    >
                        {selectedSortLabel}
                    </Text>
                </TouchableOpacity>

            </View>

            <TouchableOpacity
                style={[
                    styles.filterButton1,
                    isDateActive && styles.activeFilterButton
                ]}
                onPress={() => setShowDateModal(true)}
            >
                <Icons.Calendar size={16} color={isDateActive ? colors.lightGreen : colors.gray300} />
                <Text
                    style={[
                        styles.filterText,
                        isDateActive && { color: colors.lightGreen }
                    ]}
                >
                    {selectedDateLabel}
                </Text>
            </TouchableOpacity>

            {hasActiveFilters && (
                <TouchableOpacity
                    style={styles.clearBtn}
                    onPress={() => {
                        setSearchTerm("");
                        setStartDate(null);
                        setEndDate(null);
                        setStatusFilter([]);
                        setSortApplied(false);
                    }}
                >
                    <Text style={styles.clearText}>Clear Filters</Text>
                </TouchableOpacity>
            )}

            <DateFilterModal
                visible={showDateModal}
                setVisible={setShowDateModal}
                startDate={startDate}
                endDate={endDate}
                setStartDate={setStartDate}
                setEndDate={setEndDate}
            />

            <SortModal
                visible={showSortModal}
                setVisible={setShowSortModal}
                sortBy={sortBy}
                setSortBy={setSortBy}
                setSortApplied={setSortApplied}
            />

            <StatusModal
                visible={showStatusModal}
                setVisible={setShowStatusModal}
                statusFilter={statusFilter}
                setStatusFilter={setStatusFilter}
            />

        </View>
    );
};

export default EarningsFilters;