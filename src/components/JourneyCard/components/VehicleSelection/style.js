// components/VehicleSelection/style.js

import { StyleSheet } from "react-native";
import { moderateScale } from "react-native-size-matters";

const getStyles = (colors) =>
    StyleSheet.create({

        container: {
            backgroundColor: "#fff",
            marginHorizontal: 16,
            marginBottom: 20,
            borderRadius: 16,
            padding: 16,
            elevation: 3,
        },

        title: {
            fontSize: 16,
            fontWeight: "700",
            marginBottom: 12,
            color: "#111827"
        }

    });

export default getStyles;