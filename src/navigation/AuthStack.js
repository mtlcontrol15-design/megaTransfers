import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import JobDetailsScreen from "../screens/JobDetailsScreen/JobDetailsScreen";
import InvoiceDetailScreen from "../screens/InvoiceDetailScreen/InvoiceDetailScreen";
import ChatPagesScreen from "../screens/ChatPages/ChatPages";
import ChatScreen from "../screens/ChatScreen/ChatScreen";
import SupportScreen from "../screens/SupportScreen/SupportScreen";
import NotificationScreen from "../screens/NotificationScreen/NotificationScreen";
import MyRidesScreen from "../screens/MyRidesScreen/MyRidesScreen";
import NewBookingScreen from "../screens/NewBookingScreen/NewBookingScreen";
import BookingWrapperScreen from "../screens/BookingWrapperScreen/BookingWrapperScreen";
import JourneyDetailsScreen from "../screens/JourneyDetailsScreen/JourneyDetailsScreen";
import MapScreen from "../screens/MapScreen/MapScreen";
import PdfViewScreen from "../screens/PdfViewScreen/PdfViewScreen";
import TermAndConditionsScreen from "../screens/TermAndConditionsScreen/TermAndConditionsScreen";
import SignBoardScreen from "../screens/SignBoardScreen/SignBoardScreen";
import HomeTabs from "./HomeTabs";


const Stack = createNativeStackNavigator();

const AuthStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Home" component={HomeTabs} />
      <Stack.Screen name="JobDetails" component={JobDetailsScreen} />
      <Stack.Screen name="InvoiceDetail" component={InvoiceDetailScreen} />
      <Stack.Screen name="ChatPages" component={ChatPagesScreen} />
      <Stack.Screen name="Chat" component={ChatScreen} />
      <Stack.Screen name="Support" component={SupportScreen} />
      <Stack.Screen name="Notification" component={NotificationScreen} />
      <Stack.Screen name="MyRides" component={MyRidesScreen} />
      <Stack.Screen name="NewBooking" component={BookingWrapperScreen} />
      <Stack.Screen name="JourneyDetails" component={JourneyDetailsScreen} />
      <Stack.Screen name="MapScreen" component={MapScreen} />
      <Stack.Screen name="PdfView" component={PdfViewScreen} />
      <Stack.Screen name="TermAndConditions" component={TermAndConditionsScreen} />
      <Stack.Screen name="SignBoard" component={SignBoardScreen}
      />
    </Stack.Navigator>
  );
};

export default AuthStack;