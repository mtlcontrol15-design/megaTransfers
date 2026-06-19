import { Alert } from "react-native";
import { dispatchIsSignedIn, dispatchUser } from "../redux/slices/userSlice";

export const handleLogout = (dispatch, mutateLogout) => {
    Alert.alert("Logout", "Are you sure?", [
        { text: "Cancel", style: "cancel" },
        {
            text: "OK",
            onPress: () => {
                mutateLogout();
                dispatch(dispatchIsSignedIn(false));
                dispatch(dispatchUser(null));
            },
        },
    ]);
};