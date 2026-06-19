import { Platform } from "react-native";

import {
    check,
    request,
    RESULTS,
    PERMISSIONS,
} from "react-native-permissions";

export const requestCameraPermission = async () => {

    const permission =
        Platform.OS === "ios"
            ? PERMISSIONS.IOS.CAMERA
            : PERMISSIONS.ANDROID.CAMERA;

    const result = await check(permission);

    if (result === RESULTS.GRANTED) {
        return true;
    }

    const requestResult =
        await request(permission);

    return requestResult === RESULTS.GRANTED;
};