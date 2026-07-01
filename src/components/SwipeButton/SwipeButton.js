import React, { useEffect, useRef, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    Animated,
    PanResponder,
    Dimensions,
} from "react-native";
import { moderateScale, verticalScale } from "react-native-size-matters";
import { ChevronsRight } from "lucide-react-native";

import toastUtils from "../../utils/Toast/toast";
import { useSelector } from "react-redux";

const SCREEN_WIDTH = Dimensions.get("window").width;
const BUTTON_WIDTH = SCREEN_WIDTH * 0.9;
const THUMB_SIZE = verticalScale(40);
const THUMB_HEIGHT = verticalScale(20);
const MAX_SWIPE = BUTTON_WIDTH - THUMB_SIZE - moderateScale(10);

const SwipeButton = ({ colors, onSwipeSuccess }) => {

    const translateX = useRef(new Animated.Value(0)).current;

    const fillWidth = translateX.interpolate({
        inputRange: [0, MAX_SWIPE],
        outputRange: [0, BUTTON_WIDTH],
        extrapolate: "clamp",
    });

    const [isSwiping, setIsSwiping] = useState(false);

    const { isOnline } = useSelector(state => state.userReducer);


    const isOnlineRef = useRef(isOnline);

    useEffect(() => {
        isOnlineRef.current = isOnline;
    }, [isOnline]);


    const panResponder = useRef(
        PanResponder.create({

            onStartShouldSetPanResponder: () => true,

            onMoveShouldSetPanResponder: () => true,

            onPanResponderGrant: () => {
                setIsSwiping(true);
            },

            onPanResponderMove: (_, gestureState) => {

                if (gestureState.dx > 0 && gestureState.dx <= MAX_SWIPE) {
                    translateX.setValue(gestureState.dx);
                }

            },

            onPanResponderRelease: async (_, gestureState) => {

                setIsSwiping(false);

                if (gestureState.dx >= MAX_SWIPE * 0.7) {

                    // const hasPermission = await requestSinglePermission('location');

                    // if (!hasPermission) {
                    //     Animated.spring(translateX, {
                    //         toValue: 0,
                    //         useNativeDriver: false,
                    //     }).start();
                    //     return;
                    // }
                    Animated.spring(translateX, {
                        toValue: MAX_SWIPE,
                        useNativeDriver: false,
                    }).start();

                    const newStatus = !isOnlineRef.current;

                    const success = await onSwipeSuccess?.(newStatus);

                    if (!success) {
                        Animated.spring(translateX, {
                            toValue: 0,
                            useNativeDriver: false,
                        }).start();
                        return;
                    }

                    if (newStatus) {
                        toastUtils.showSuccess("You are now ONLINE");
                    } else {
                        toastUtils.showInfo("You are now OFFLINE");
                    }

                    setTimeout(() => {
                        Animated.spring(translateX, {
                            toValue: 0,
                            useNativeDriver: false,
                        }).start();
                    }, 900);

                } else {
                    Animated.spring(translateX, {
                        toValue: 0,
                        useNativeDriver: false,
                    }).start();
                }
            },
        })
    ).current;


    const swipeColor = "#FF3B30";
    const normalColor = "#3db0bb";

    const buttonText = isOnline ? "GO OFFLINE" : "GO ONLINE";

    const textColor = isOnline ? swipeColor : normalColor;

    const fillColor = translateX.interpolate({
        inputRange: [0, MAX_SWIPE],
        outputRange: isOnline ? ["#FF3B30", "#3db0bb"] : ["#3db0bb", "#FF3B30"],
        extrapolate: "clamp",
    });


    return (
        <View style={styles.wrapper}>

            <View
                style={[
                    styles.container,
                    {
                        backgroundColor: colors.gray100,
                        borderColor: colors.gray200,
                    },
                ]}
            >
                <Animated.View
                    style={[
                        styles.fill,
                        {
                            width: fillWidth,
                            backgroundColor: fillColor,
                        },
                    ]}
                />

                <Text style={[styles.text, { color: isSwiping ? "#fff" : textColor }]}>
                    {buttonText}
                </Text>

                <Animated.View
                    {...panResponder.panHandlers}
                    style={[
                        styles.thumb,
                        {
                            transform: [{ translateX }],
                        },
                    ]}
                >
                    <ChevronsRight
                        color={isSwiping ? "#fff" : textColor}
                        size={moderateScale(22)}
                    />
                </Animated.View>

            </View>

        </View>
    );
};

export default SwipeButton;

const styles = StyleSheet.create({

    wrapper: {
        alignItems: "center",
        marginTop: verticalScale(10),
    },

    container: {
        width: BUTTON_WIDTH,
        height: verticalScale(25),
        borderRadius: moderateScale(30),
        justifyContent: "center",
        paddingHorizontal: moderateScale(5),
    },

    text: {
        position: "absolute",
        alignSelf: "center",
        fontSize: moderateScale(15),
        fontWeight: "700",
        letterSpacing: 1,
    },

    thumb: {
        width: THUMB_SIZE,
        height: THUMB_HEIGHT,
        borderRadius: THUMB_SIZE / 2,
        backgroundColor: "#fff",
        justifyContent: "center",
        alignItems: "center",
    },
    fill: {
        position: "absolute",
        left: 0,
        height: "100%",
        borderRadius: moderateScale(30),
    },
});