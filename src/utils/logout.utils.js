import { Alert } from "react-native";
import { dispatchIsSignedIn, dispatchRefreshToken, dispatchUser } from "../redux/slices/userSlice";

export const handleLogout = (dispatch, mutateLogout) => {
    Alert.alert("Logout", "Are you sure?", [
        { text: "Cancel", style: "cancel" },
        {
            text: "OK",
            onPress: () => {
                mutateLogout();
                dispatch(dispatchIsSignedIn(false));
                dispatch(dispatchRefreshToken(null));
                dispatch(dispatchUser(null));
            },
        },
    ]);
};