import React from "react";
import {
    View,
    ActivityIndicator,
} from "react-native";

import { useSelector } from "react-redux";

import {
    StripeProvider,
} from "@stripe/stripe-react-native";

import { EndPoints } from "../../services/EndPoints";
import queryHandler from "../../services/queries/queryHandler";

import NewBookingScreen from "../NewBookingScreen/NewBookingScreen";

const BookingWrapperScreen = ({ route }) => {

    const { user } = useSelector(
        state => state?.userReducer
    );

    const companyId = user?.companyId;

    const {
        data: paymentMethodsData,
        isFetching,
    } = queryHandler(
        companyId
            ? `${EndPoints.getPaymentMthods}/${companyId}`
            : null
    );

    const stripeMethod =
        paymentMethodsData?.data?.paymentOptions?.find(
            item =>
                item.paymentMethod === "stripe" &&
                item.isEnabled
        );

    // console.log('======stripe method is here', stripeMethod);


    const publishableKey =
        stripeMethod?.settings?.publishableKey;

    //   console.log(
    //     "PUBLISHABLE KEY:",
    //     publishableKey
    //   );

    if (!companyId) {
        return (
            <View
                style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <ActivityIndicator size="large" />
            </View>
        );
    }

    if (publishableKey) {
        return (
            <StripeProvider
                publishableKey={publishableKey}
            >
                <NewBookingScreen route={route} />
            </StripeProvider>
        );
    }

    return (
        <NewBookingScreen route={route} />
    );
};

export default BookingWrapperScreen;