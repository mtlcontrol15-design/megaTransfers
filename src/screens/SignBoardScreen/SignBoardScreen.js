import React, { useMemo, useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    StatusBar,
    useWindowDimensions,
    ScrollView,
} from "react-native";
import { moderateScale, verticalScale } from "react-native-size-matters";

import COLORS_THEME from "../../libs/Theme.json";
import Icons from "../../assets/icons";

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
                {/* <StatusBar barStyle="light-content" /> */}

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
                            color: textColor === COLORS_THEME.colors.white
                                ? COLORS_THEME.colors.black
                                : COLORS_THEME.colors.white,
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
            <StatusBar barStyle="light-content" backgroundColor={COLORS_THEME.colors.primary} />

            <View style={[styles.headerContainer, { backgroundColor: COLORS_THEME.colors.primary }]}>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    activeOpacity={0.7}
                    hitSlop={{ top: 30, bottom: 30, left: 30, right: 30 }}
                >
                    <Icons.ArrowLeft size={24} color={COLORS_THEME.colors.white} />
                </TouchableOpacity>

                <View style={styles.headerTitleContainer}>
                    <Text style={[styles.headerTitle, { color: COLORS_THEME.colors.white }]}>
                        Name Board
                    </Text>
                </View>

                <TouchableOpacity
                    onPress={() => setIsShowing(true)}
                    activeOpacity={0.7}
                    hitSlop={{ top: 30, bottom: 30, left: 30, right: 30 }}
                    style={{ paddingHorizontal: moderateScale(10), paddingVertical: verticalScale(5),backgroundColor: COLORS_THEME.colors.primary1, borderRadius: moderateScale(6) }}
                >
                    <Text style={[styles.showButtonText,{fontSize: moderateScale(12),textAlign: "center",fontWeight: "400",}]}>
                        ShowName Board
                    </Text>
                </TouchableOpacity>
            </View>

            <View style={styles.contentContainer}>
                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.form}>
                        <Text style={styles.label}>PASSENGER NAME</Text>

                        <TextInput
                            value={signText}
                            onChangeText={setSignText}
                            placeholder="Enter passenger name"
                            placeholderTextColor={COLORS_THEME.colors.gray300}
                            maxLength={60}
                            autoCapitalize="characters"
                            style={styles.input}
                        />

                        <Text style={styles.label}>TEXT COLOUR</Text>

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
                                    activeOpacity={0.7}
                                />
                            ))}
                        </View>

                        <Text style={styles.label}>BACKGROUND COLOUR</Text>

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
                                    activeOpacity={0.7}
                                />
                            ))}
                        </View>

                        <Text style={styles.tipText}>
                            Tip: High contrast colors work best for airport visibility.
                        </Text>

                        <View
                            style={[
                                styles.preview,
                                { backgroundColor },
                            ]}
                        >
                            <Text
                                numberOfLines={2}
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
                            activeOpacity={0.8}
                        >
                            <Text style={styles.showButtonText}>
                                SHOW FULLSCREEN
                            </Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    settingsContainer: {
        flex: 1,
        backgroundColor: COLORS_THEME.colors.primary,
        paddingTop: verticalScale(0),
    },
    headerContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: moderateScale(15),
        paddingTop: verticalScale(50),
        paddingBottom: verticalScale(20),
    },
    headerTitle: {
        fontSize: moderateScale(18),
        fontWeight: "700",
        fontFamily: COLORS_THEME.typography.heading.fontFamily,
    },
    headerTitleContainer: {
        flexDirection: "column",
        gap: verticalScale(4),
        flex: 1,
        alignItems: "center",
    },
    contentContainer: {
        flex: 1,
        backgroundColor: COLORS_THEME.colors.white,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        paddingBottom: moderateScale(20),
    },
    form: {
        paddingVertical: moderateScale(20),
        paddingHorizontal: moderateScale(16),
    },
    label: {
        color: COLORS_THEME.colors.blackishText,
        fontSize: moderateScale(14),
        fontWeight: "600",
        marginBottom: moderateScale(10),
        marginTop: moderateScale(18),
        letterSpacing: 0.5,
    },
    input: {
        height: moderateScale(56),
        paddingHorizontal: moderateScale(14),
        backgroundColor: COLORS_THEME.colors.white,
        borderRadius: moderateScale(8),
        borderWidth: 1,
        borderColor: COLORS_THEME.colors.gray200,
        color: COLORS_THEME.colors.blackishText,
        fontSize: moderateScale(16),
        fontFamily: COLORS_THEME.typography.body.fontFamily,
        ...COLORS_THEME.shadows.small,
    },
    colorRow: {
        flexDirection: "row",
        gap: moderateScale(16),
        marginTop: moderateScale(12),
        flexWrap: "wrap",
        justifyContent:'center',
    },
    colorButton: {
        width: moderateScale(44),
        height: moderateScale(44),
        borderRadius: moderateScale(24),
        borderWidth: 2,
        borderColor: COLORS_THEME.colors.gray300,
    },
    selectedColor: {
        borderWidth: 3,
        borderColor: COLORS_THEME.colors.primary1,
        shadowColor: COLORS_THEME.colors.primary1,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.4,
        shadowRadius: 4,
        elevation: 5,
    },
    tipText: {
        color: COLORS_THEME.colors.gray600,
        fontSize: moderateScale(12),
        fontFamily: COLORS_THEME.typography.body.fontFamily,
        fontStyle: "italic",
        marginTop: moderateScale(12),
        marginBottom: moderateScale(16),
    },
    preview: {
        height: moderateScale(120),
        marginTop: moderateScale(24),
        marginBottom: moderateScale(20),
        borderRadius: moderateScale(10),
        borderWidth: 1,
        borderColor: COLORS_THEME.colors.gray200,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: moderateScale(16),
        paddingVertical: moderateScale(16),
        ...COLORS_THEME.shadows.small,
    },
    previewText: {
        width: "100%",
        textAlign: "center",
        fontSize: moderateScale(36),
        fontWeight: "900",
        fontFamily: COLORS_THEME.typography.heading.fontFamily,
        textTransform: "uppercase",
    },
    showButton: {
        height: moderateScale(54),
        marginTop: moderateScale(46),
        borderRadius: moderateScale(8),
        backgroundColor: COLORS_THEME.colors.primary1,
        alignItems: "center",
        justifyContent: "center",
        ...COLORS_THEME.shadows.medium,
    },
    showButtonText: {
        color: COLORS_THEME.colors.white,
        fontSize: moderateScale(16),
        fontWeight: "700",
        fontFamily: COLORS_THEME.typography.heading.fontFamily,
        letterSpacing: 1,
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
        bottom: moderateScale(40),
        fontSize: moderateScale(13),
        fontFamily: COLORS_THEME.typography.body.fontFamily,
        fontStyle: "italic",
    },
});

export default SignBoardScreen;
