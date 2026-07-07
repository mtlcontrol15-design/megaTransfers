import React from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { useSelector } from "react-redux";

import HomeScreen from "../screens/HomeScreen/HomeScreen";
import BookingScreen from "../screens/BookingScreen/BookingScreen";
import EarningsScreen from "../screens/EarningsScreen/EarningsScreen";
import PoolScreen from "../screens/PoolScreen/PoolScreen";
import ProfileScreen from "../screens/ProfileScreen/ProfileScreen";


import MyRidesScreen from "../screens/MyRidesScreen/MyRidesScreen";

const Tab = createMaterialTopTabNavigator();

const HomeTabs = () => {
    const { user } = useSelector((state) => state.userReducer);

    const isDriver = user?.role === "driver";
    const isCustomer = user?.role === "customer" || user?.role === "corporate";

    return (
        <Tab.Navigator
            screenOptions={{
                swipeEnabled: true,
                tabBarStyle: { display: "none" },
                animationEnabled: true,
            }}
        >
            <Tab.Screen name="HomeMain" component={HomeScreen} />

            {isDriver && (
                <>
                    <Tab.Screen name="BookingsTab" component={BookingScreen} />
                    <Tab.Screen name="PoolTab" component={PoolScreen} />
                    <Tab.Screen name="EarningsTab" component={EarningsScreen} />
                </>
            )}

            {isCustomer && (
                <>
                    <Tab.Screen name="MyRidesTab" component={MyRidesScreen} />
                    <Tab.Screen name="EarningsTab" component={EarningsScreen} />
                    <Tab.Screen name="ProfileTab" component={ProfileScreen} />
                </>
            )}
        </Tab.Navigator>
    );
};

export default HomeTabs;