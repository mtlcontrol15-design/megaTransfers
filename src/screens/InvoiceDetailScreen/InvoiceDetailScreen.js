import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Image } from "react-native";

import Pdf from "react-native-pdf";
import { useTheme } from "@react-navigation/native";


import Icons from "../../assets/icons";
import getSyles from "./style";
import queryHandler from "../../services/queries/queryHandler";
import { EndPoints } from "../../services/EndPoints";

const InvoiceDetailScreen = ({ route, navigation }) => {
    const { invoice } = route.params;

    // console.log('========invoice info is here', invoice);


    const { colors } = useTheme();
    const styles = getSyles(colors);


    const { data: companyData, error: companyDataError, status: companyStatus, isFetching: companyDataFetching, refetch: companyDataRefetch } = queryHandler(EndPoints.getCompanyDetails);

    // console.log('========companyData', companyData);

    return (
        <View
            style={{
                flex: 1,
                backgroundColor: colors.white,
            }}
        >

            <View
                style={[
                    styles.header,
                    {
                        borderBottomColor: colors.border,
                    },
                ]}
            >

                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                >
                    <Icons.ArrowLeft
                        size={24}
                        color={colors.white}
                    />
                </TouchableOpacity>

                <Text style={styles.headerTitle}>
                    Invoice PDF
                </Text>

                <View style={{ width: 24 }} />

            </View>

            <Pdf
                source={{
                    uri: invoice?.pdfUrl?.replace(
                        "http://",
                        "https://"
                    ),
                    cache: true,
                }}
                trustAllCerts={false}
                style={{
                    flex: 1,
                    width: "100%",
                    height: "100%",
                }}
                onError={(error) => {
                    console.log("PDF Error:", error);
                }}
            />

        </View>
    );
};

export default InvoiceDetailScreen;