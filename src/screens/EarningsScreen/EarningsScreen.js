import React, { useState, useEffect, useMemo } from "react";
import { View, Text, TouchableOpacity, FlatList, Alert, Linking } from "react-native";

import { useSelector } from "react-redux";
import { useTheme } from "@react-navigation/native";
import ReactNativeBlobUtil from "react-native-blob-util";

import getStyles from "./style";
import Icons from "../../assets/icons";
import { EndPoints } from "../../services/EndPoints";
import useQueryHandler from "../../services/queries/useQueryHandler";
import EarningsScreenFilters from "../../components/EarningFilter/EarningsScreenFilters";
import StatusModal from "../../components/EarningFilter/StatusModal";
import DateFilterModal from "../../components/BookingFilters/DateFilterModal";

const EarningsScreen = ({ navigation }) => {
  const { colors } = useTheme();
  const styles = getStyles(colors);

  const { user, token } = useSelector(state => state.userReducer);

  // console.log('======user',user);

  const isDriver = user?.role === "driver";
  const isCustomer = user?.role === "customer" || user?.role === "corporate";

  const [activeTab, setActiveTab] = useState(isCustomer ? "invoices" : "earnings");
  const [showFilters, setShowFilters] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [statusFilter, setStatusFilter] = useState([]);
  const [statusModalVisible, setStatusModalVisible] = useState(false);
  const [dateModalVisible, setDateModalVisible] = useState(false);


  // console.log('=======status filter is here',statusFilter);

  const {
    data,
    refetch,
    status,
    isFetching,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useQueryHandler(EndPoints.getAllInvoices, {
    queryParams: {
      page: 1,
      limit: 5,
    },
    useInfiniteQueryFlag: true,
  });


  // console.log('======== invoices data is here', data);


  const invoicesData = useMemo(() => {
    const allInvoices =
      data?.pages?.flatMap(page => page.invoices) || [];

    if (isDriver) {
      return allInvoices.filter(inv => inv.invoiceType === "driver");
    }

    if (isCustomer) {
      return allInvoices.filter(inv => inv.invoiceType === "customer");
    }

    return allInvoices;
  }, [data, isDriver, isCustomer]);



  const earningsData = invoicesData.flatMap((invoice) =>
    invoice.items.map((item) => ({
      id: `${item.bookingId}-${invoice._id}`,
      bookingId: item.bookingId,
      date: item.date,
      status: item.status || "Completed",
      bookingType: item.mode || "Standard",
      amount: item.fare,
      distance: item.distance ?? 20,
    }))
  );

  // console.log('=======earningsData is here', earningsData);



  const headerTitle = isCustomer ? "Invoices" : "Earnings";
  const headerSubtitle = isCustomer
    ? "Track your invoices"
    : "Track your earnings";

  const clearAllFilters = () => {
    setStartDate(null);
    setEndDate(null);
    setStatusFilter([]);
  };

  const dataSource =
    activeTab === "earnings" ? earningsData : invoicesData;

  const filteredData = useMemo(() => {
    let filtered = [...dataSource];

    // ✅ Status filter
    if (statusFilter.length > 0) {
      filtered = filtered.filter((item) =>
        statusFilter.includes(item.status?.toLowerCase())
      );
    }

    // ✅ Date filter (IMPORTANT FIX)
    if (startDate && endDate) {
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);

      const end = new Date(endDate);
      end.setHours(0, 0, 0, 0);

      filtered = filtered.filter((item) => {
        // 🔥 KEY CHANGE HERE
        const rawDate =
          activeTab === "earnings"
            ? item.date
            : item.dueDate;   // ✅ use dueDate for invoices

        if (!rawDate) return false;

        const itemDate = new Date(rawDate);
        itemDate.setHours(0, 0, 0, 0);

        return itemDate >= start && itemDate <= end;
      });
    }

    return filtered;
  }, [dataSource, startDate, endDate, statusFilter, activeTab]);

  const kmStringToMiles = (distanceStr) => {
    if (!distanceStr) return 0;

    const km = parseFloat(distanceStr);
    if (isNaN(km)) return 0;

    return (km * 0.621371).toFixed(2);
  };


  const handleDownloadInvoice = async (invoice) => {
    console.log('==========invoice data is here', invoice);

    try {
      const fileUrl = invoice?.pdfUrl || invoice?.invoicePdf || invoice?.fileUrl;

      if (!fileUrl) {
        Alert.alert("Error", "Invoice file URL not found.");
        return;
      }

      const fileName = `invoice-${invoice?.invoiceNumber || invoice?._id}.pdf`;

      if (Platform.OS === "android") {
        const { config, fs } = ReactNativeBlobUtil;

        const downloads = fs.dirs.DownloadDir;

        const path = `/storage/emulated/0/Download/${fileName}`;

        await config({
          addAndroidDownloads: {
            useDownloadManager: true,
            notification: true,
            path: path,
            title: fileName,
            description: "Downloading invoice...",
            mime: "application/pdf",
            mediaScannable: true,
          },
        }).fetch("GET", fileUrl, {
          Authorization: `Bearer ${token}`,
        });

        return;
      }

      const iosPath = `${ReactNativeBlobUtil.fs.dirs.DocumentDir}/${fileName}`;

      const res = await ReactNativeBlobUtil.config({
        path,
        fileCache: true,
      }).fetch("GET", fileUrl, {
        Authorization: `Bearer token`,
      });

      ReactNativeBlobUtil.android.actionViewIntent(
        res.path(),
        "application/pdf"
      );
    } catch (error) {
      console.log("Invoice download error:", error);
      Alert.alert("Error", "Failed to download invoice.");
    }
  };


  const earningStatusOptions = [
    { id: 'completed', label: 'Completed' },
    { id: 'in process', label: 'In Process' },
  ];

  const invoiceStatusOptions = [
    { id: 'paid', label: 'Paid' },
    { id: 'unpaid', label: 'Unpaid' },
    { id: 'overdue', label: 'Overdue' },
  ];

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardTop}>
        <View>
          <Text style={styles.date}>
            {new Date(item.date).toLocaleDateString()}
          </Text>
          <Text style={styles.bookingId}>Booking ID : {item.bookingId}</Text>
          <Text style={styles.type}>{item.bookingType}</Text>
        </View>

        <View style={styles.statusContainer}>
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>

      <View style={styles.cardBottom}>
        <Text style={styles.distance}>
          {kmStringToMiles(item.distance)} mi
        </Text>
        <Text style={styles.amount}>
          {item?.amount != null
            ? `£${Number(item.amount).toFixed(2)}`
            : "£0.00"}
        </Text>
      </View>
    </View>
  );

  const renderInvoiceItem = ({ item }) => {
    // console.log('========invoice item is here',item);

    const totalAmount = item.items?.reduce(
      (sum, i) => sum + (i.totalAmount || 0),
      0
    );

    return (
      <TouchableOpacity
        activeOpacity={0.7}
        style={styles.card}
        onPress={() =>
          navigation.navigate("InvoiceDetail", {
            invoice: item,
          })
        }
      >
        <View style={styles.cardTop}>
          <View>
            <Text style={styles.date}>
              {new Date(item.invoiceDate).toLocaleDateString()}
            </Text>

            <Text style={styles.bookingId}>
              Invoice ID : {item.invoiceNumber}
            </Text>

            <Text style={styles.type}>
              {item.items?.length || 0} rides
            </Text>
          </View>

          <View style={styles.statusContainer}>
            <Text style={styles.statusText}>
              {item.status}
            </Text>
          </View>
        </View>

        <View style={styles.cardBottom}>
          <Text style={styles.distance}>
            Invoice Amount
          </Text>

          <Text style={styles.amount}>
            £{totalAmount.toFixed(2)}
          </Text>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => handleDownloadInvoice(item)}
            style={styles.downloadBtn}
          >
            <Icons.Download size={16} color={colors.white} />
            <Text style={styles.downloadText}>Download</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>

      <View style={[styles.header, { backgroundColor: colors.primary }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}
          hitSlop={{ top: 30, bottom: 30, left: 30, right: 30 }}
        >
          <Icons.ArrowLeft size={24} color={colors.white} />
        </TouchableOpacity>

        <View style={styles.headerTitleWrap}>
          <Text style={[styles.headerTitle, { color: colors.white }]}>
            {headerTitle}
          </Text>
          <Text style={[styles.headerSubtitle, { color: colors.white }]}>
            {headerSubtitle}
          </Text>
        </View>

        <View style={styles.headerIcons}>

          {(activeTab === "earnings" || activeTab === "invoices") && (
            <TouchableOpacity onPress={() => setShowFilters(!showFilters)}>
              <Icons.Filter size={24} color={colors.white} />
            </TouchableOpacity>
          )}

          <TouchableOpacity onPress={refetch}>
            <Icons.RefreshCcw size={24} color={colors.white} />
          </TouchableOpacity>

        </View>
      </View>
      <View style={{ flex: 1 }}>

        <View style={styles.tabsContainer}>

          {isDriver && (
            <TouchableOpacity
              activeOpacity={0.8}
              style={[
                styles.tab,
                activeTab === "earnings" && styles.activeTab,
              ]}
              onPress={() => setActiveTab("earnings")}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === "earnings" && styles.activeTabText,
                ]}
              >
                Earnings ({earningsData.length})
              </Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            activeOpacity={0.8}
            style={[
              styles.tab,
              activeTab === "invoices" && styles.activeTab,
            ]}
            onPress={() => setActiveTab("invoices")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "invoices" && styles.activeTabText,
              ]}
            >
              Invoices ({invoicesData.length})
            </Text>
          </TouchableOpacity>

        </View>

        {showFilters && (
          <EarningsScreenFilters
            startDate={startDate}
            endDate={endDate}
            statusFilter={statusFilter}

            onPressStatus={() => setStatusModalVisible(true)}
            onPressDate={() => setDateModalVisible(true)}

            clearFilters={clearAllFilters}

            statusModalVisible={statusModalVisible}
            setStatusModalVisible={setStatusModalVisible}
            dateModalVisible={dateModalVisible}
            setDateModalVisible={setDateModalVisible}

            setStartDate={setStartDate}
            setEndDate={setEndDate}
            setStatusFilter={setStatusFilter}
          />)}

        {activeTab === "earnings" ? (
          <FlatList
            data={filteredData}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ padding: 16 }}

            refreshing={isFetching}
            onRefresh={refetch}

            onEndReached={() => {
              if (hasNextPage && !isFetchingNextPage) {
                fetchNextPage();
              }
            }}
            onEndReachedThreshold={0.5}

            ListEmptyComponent={() => (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No Earnings Found</Text>
              </View>
            )}
          />
        ) : (
          <FlatList
            data={filteredData}
            keyExtractor={(item) => item.id}
            renderItem={renderInvoiceItem}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ padding: 16 }}

            refreshing={isFetching}
            onRefresh={refetch}

            onEndReached={() => {
              if (hasNextPage && !isFetchingNextPage) {
                fetchNextPage();
              }
            }}
            onEndReachedThreshold={0.5}

            ListEmptyComponent={() => (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No Invoices Found</Text>
              </View>
            )}
          />
        )}
      </View>
      <StatusModal
        visible={statusModalVisible}
        setVisible={setStatusModalVisible}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        statusOptions={
          activeTab === "earnings"
            ? earningStatusOptions
            : invoiceStatusOptions
        }
      />

      <DateFilterModal
        visible={dateModalVisible}
        setVisible={setDateModalVisible}
        startDate={startDate}
        endDate={endDate}
        setStartDate={setStartDate}
        setEndDate={setEndDate}
      />
    </View>
  );
};

export default EarningsScreen;