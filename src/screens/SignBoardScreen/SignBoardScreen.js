import React, { useEffect, useMemo, useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    StatusBar,
    useWindowDimensions,
} from "react-native";
import { moderateScale } from "react-native-size-matters";

import COLORS_THEME from "../../libs/Theme.json";
import { Theme } from "../../libs";

const COLORS = [
    COLORS_THEME.colors.white,
    COLORS_THEME.colors.black,
    COLORS_THEME.colors.purple,
    COLORS_THEME.colors.red,
    COLORS_THEME.colors.lightGreen,
    COLORS_THEME.colors.lightBlue,
];

const SignBoardScreen = ({ navigation, route }) => {
    const { width, height } = useWindowDimensions();

    const [signText, setSignText] = useState(
        route?.params?.passengerName || ""
    );

    const [textColor, setTextColor] = useState("#000000");
    const [backgroundColor, setBackgroundColor] = useState("#FFFFFF");
    const [isShowing, setIsShowing] = useState(false);

    const fontSize = useMemo(() => {
        const length = signText.trim().length;

        if (length <= 10) return Math.min(width * 0.22, 190);
        if (length <= 18) return Math.min(width * 0.16, 145);
        if (length <= 28) return Math.min(width * 0.12, 110);

        return Math.min(width * 0.09, 85);
    }, [signText, width]);

    if (isShowing) {
        return (
            <TouchableOpacity
                activeOpacity={1}
                style={[
                    styles.signContainer,
                    { backgroundColor },
                ]}
                onPress={() => setIsShowing(false)}
            >
                <StatusBar hidden />

                <Text
                    adjustsFontSizeToFit
                    minimumFontScale={0.35}
                    numberOfLines={2}
                    style={[
                        styles.signText,
                        {
                            color: textColor,
                            fontSize,
                            maxWidth: width * 0.94,
                            maxHeight: height * 0.8,
                        },
                    ]}
                >
                    {signText.trim() || "PASSENGER NAME"}
                </Text>

                <Text
                    style={[
                        styles.editHint,
                        {
                            color:
                                Theme.colors.black,
                        },
                    ]}
                >
                    Tap anywhere to edit
                </Text>
            </TouchableOpacity>
        );
    }

    return (
        <View style={styles.settingsContainer}>
            <StatusBar hidden />

            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Text style={styles.headerButton}>Back</Text>
                </TouchableOpacity>

                <Text style={styles.headerTitle}>Airport Sign Board</Text>

                <TouchableOpacity onPress={() => setIsShowing(true)}>
                    <Text style={styles.headerButton}>Show</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.form}>
                <Text style={styles.label}>Passenger name</Text>

                <TextInput
                    value={signText}
                    onChangeText={setSignText}
                    placeholder="Enter passenger name"
                    maxLength={60}
                    autoCapitalize="characters"
                    style={styles.input}
                />

                <Text style={styles.label}>Text colour</Text>

                <View style={styles.colorRow}>
                    {COLORS.map(color => (
                        <TouchableOpacity
                            key={color}
                            onPress={() => setTextColor(color)}
                            style={[
                                styles.colorButton,
                                { backgroundColor: color },
                                textColor === color && styles.selectedColor,
                            ]}
                        />
                    ))}
                </View>

                <Text style={styles.label}>Background colour</Text>

                <View style={styles.colorRow}>
                    {COLORS.map(color => (
                        <TouchableOpacity
                            key={color}
                            onPress={() => setBackgroundColor(color)}
                            style={[
                                styles.colorButton,
                                { backgroundColor: color },
                                backgroundColor === color &&
                                styles.selectedColor,
                            ]}
                        />
                    ))}
                </View>

                <View
                    style={[
                        styles.preview,
                        { backgroundColor },
                    ]}
                >
                    <Text
                        numberOfLines={1}
                        adjustsFontSizeToFit
                        style={[
                            styles.previewText,
                            { color: textColor },
                        ]}
                    >
                        {signText || "Passenger Name"}
                    </Text>
                </View>

                <TouchableOpacity
                    style={styles.showButton}
                    onPress={() => setIsShowing(true)}
                >
                    <Text style={styles.showButtonText}>
                        SHOW SIGN BOARD
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    settingsContainer: {
        flex: 1,
        backgroundColor: COLORS_THEME.colors.gray70,
    },
    header: {
        height: moderateScale(60),
        backgroundColor: COLORS_THEME.colors.primary1,
        paddingHorizontal: moderateScale(70),
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        ...COLORS_THEME.shadows.medium,
    },
    headerTitle: {
        color: COLORS_THEME.colors.white,
        fontSize: moderateScale(20),
        fontWeight: "700",
        fontFamily: COLORS_THEME.typography.heading.fontFamily,
    },
    headerButton: {
        color: COLORS_THEME.colors.white,
        fontSize: moderateScale(16),
        fontWeight: "600",
        fontFamily: COLORS_THEME.typography.body.fontFamily,
    },
    form: {
        flex: 1,
        paddingVertical: moderateScale(24),
        paddingHorizontal: moderateScale(60),
    },
    label: {
        color: COLORS_THEME.colors.blackishText,
        fontSize: moderateScale(15),
        fontWeight: "600",
        fontFamily: COLORS_THEME.typography.caption.fontFamily,
        marginBottom: moderateScale(8),
        marginTop: moderateScale(14),
    },
    input: {
        height: moderateScale(55),
        paddingHorizontal: moderateScale(16),
        backgroundColor: COLORS_THEME.colors.white,
        borderRadius: COLORS_THEME.borders.regularRadius,
        borderWidth: COLORS_THEME.borders.width,
        borderColor: COLORS_THEME.colors.gray200,
        color: COLORS_THEME.colors.text,
        fontSize: moderateScale(18),
        fontFamily: COLORS_THEME.typography.body.fontFamily,
        ...COLORS_THEME.shadows.small,
    },
    colorRow: {
        flexDirection: "row",
        gap: moderateScale(14),
        marginTop: moderateScale(8),
    },
    colorButton: {
        width: moderateScale(42),
        height: moderateScale(42),
        borderRadius: moderateScale(21),
        borderWidth: COLORS_THEME.borders.width,
        borderColor: COLORS_THEME.colors.gray300,
    },
    selectedColor: {
        borderWidth: moderateScale(4),
        borderColor: COLORS_THEME.colors.primary1,
    },
    preview: {
        height: moderateScale(100),
        marginTop: moderateScale(25),
        borderRadius: COLORS_THEME.borders.regularRadius,
        borderWidth: COLORS_THEME.borders.width,
        borderColor: COLORS_THEME.colors.gray200,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: moderateScale(20),
        ...COLORS_THEME.shadows.small,
    },
    previewText: {
        width: "100%",
        textAlign: "center",
        fontSize: moderateScale(40),
        fontWeight: "900",
        fontFamily: COLORS_THEME.typography.heading.fontFamily,
    },
    showButton: {
        height: moderateScale(55),
        marginTop: moderateScale(24),
        borderRadius: COLORS_THEME.borders.regularRadius,
        backgroundColor: COLORS_THEME.colors.primary1,
        alignItems: "center",
        justifyContent: "center",
        ...COLORS_THEME.shadows.medium,
    },
    showButtonText: {
        color: COLORS_THEME.colors.white,
        fontSize: moderateScale(17),
        fontWeight: "700",
        fontFamily: COLORS_THEME.typography.heading.fontFamily,
    },
    signContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: moderateScale(20),
    },
    signText: {
        textAlign: "center",
        fontWeight: "900",
        textTransform: "uppercase",
        fontFamily: COLORS_THEME.typography.heading.fontFamily,
    },
    editHint: {
        position: "absolute",
        bottom: moderateScale(12),
        right: moderateScale(48),
        fontSize: moderateScale(14),
        fontFamily: COLORS_THEME.typography.body.fontFamily,
    },
});

export default SignBoardScreen;