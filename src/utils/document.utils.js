import { Alert, Linking } from "react-native";

export const viewDocument = async (doc) => {

  if (!doc?.url) {
    Alert.alert("No document found");
    return;
  }

  try {
    await Linking.openURL(doc.url);
  } catch (e) {
    Alert.alert("Unable to open document");
  }
};
export const viewDocumentInApp = (navigation, { url, title }) => {

  // console.log('=======url is here',url);
  

  if (!url) {
    Alert.alert("Error", "Document URL not available");
    return;
  }

  navigation.navigate("PdfView", {
    url,
    title: title || "Document",
  });
};

export const checkExpiry = (date) => {
  if (!date) return { label: "", isExpired: false };

  const today = new Date();
  const exp = new Date(date);

  return {
    label: exp.toLocaleDateString(),
    isExpired: exp < today,
  };
};