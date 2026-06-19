import { Alert, Platform, ActionSheetIOS, PermissionsAndroid, } from "react-native";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";

export const openCamera = async (setForm) => {

  try {

    if (Platform.OS === "android") {

      const granted =
        await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA
        );

      if (
        granted !==
        PermissionsAndroid.RESULTS.GRANTED
      ) {

        Alert.alert(
          "Permission Required",
          "Camera permission is required"
        );

        return;
      }
    }

    const options = {
      mediaType: "photo",
      cameraType: "back",
      quality: 0.8,
      saveToPhotos: true,
    };

    launchCamera(options, (response) => {

      console.log(
        "CAMERA RESPONSE:",
        JSON.stringify(response, null, 2)
      );

      if (response.didCancel) return;

      if (response.errorCode) {

        console.log(
          "Camera Error:",
          response.errorCode,
          response.errorMessage
        );

        Alert.alert(
          "Camera Error",
          response.errorMessage || "Unable to open camera"
        );

        return;
      }

      const image = response.assets?.[0];

      if (!image) return;

      setForm((prev) => ({
        ...prev,
        profileImage: image,
      }));
    });

  } catch (error) {

    console.log("OPEN CAMERA ERROR:", error);
  }
};

export const openGallery = (setForm) => {
  const options = {
    mediaType: "photo",
    quality: 0.8,
  };

  launchImageLibrary(options, (response) => {
    if (response.didCancel) return;
    if (response.errorCode) {
      console.log("Gallery Error:", response.errorMessage);
      return;
    }

    const image = response.assets[0];
    setForm((prev) => ({ ...prev, profileImage: image }));
  });
};

export const openCameraOrGallery = (isUploading, setForm) => {
  if (isUploading) return;

  if (Platform.OS === "ios") {
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: ["Cancel", "Take Photo", "Choose from Gallery"],
        cancelButtonIndex: 0,
      },
      (buttonIndex) => {
        if (buttonIndex === 1) openCamera(setForm);
        else if (buttonIndex === 2) openGallery(setForm);
      }
    );
  } else {
    Alert.alert(
      "Upload Photo",
      "Choose an option",
      [
        { text: "Camera", onPress: () => openCamera(setForm) },
        { text: "Gallery", onPress: () => openGallery(setForm) },
        { text: "Cancel", style: "cancel" },
      ],
      { cancelable: true }
    );
  }
};