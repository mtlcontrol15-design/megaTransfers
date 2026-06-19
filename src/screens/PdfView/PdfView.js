
import React, { useState } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";

import { WebView } from 'react-native-webview';
import { useTheme } from "@react-navigation/native";

import getStyles from "./style";
import Icons from "../../assets/icons";

const PdfView = ({ navigation, route }) => {
  const { colors } = useTheme();
  const styles = getStyles(colors);
  const [isLoading, setIsLoading] = useState(true);

  // Get PDF URL from route params
  const pdfUrl = route?.params?.url || null;
  const docTitle = route?.params?.title || "PDF Viewer";


  const isPdf = pdfUrl?.toLowerCase().endsWith('.pdf');

  const viewerUrl = isPdf
    ? `https://docs.google.com/gview?embedded=true&url=${pdfUrl}`
    : pdfUrl;



  if (!pdfUrl) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.white, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ color: colors.text, fontSize: 16 }}>No document URL provided</Text>
        <TouchableOpacity
          style={{ marginTop: 20, paddingHorizontal: 20, paddingVertical: 10, backgroundColor: colors.primary, borderRadius: 8 }}
          onPress={() => navigation.goBack()}
        >
          <Text style={{ color: colors.white }}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.white }}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerIcon}
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 30, bottom: 30, left: 30, right: 30 }}
        >
          <Icons.ArrowLeft size={26} color={colors.white} />
        </TouchableOpacity>

        <Text style={styles.headerTitle} numberOfLines={1}>
          {docTitle}
        </Text>

        <View style={styles.headerRight} />
      </View>

      {/* {isLoading && (
        <View style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, justifyContent: "center", alignItems: "center", zIndex: 10 }}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      )} */}

      <WebView
        source={{ uri: viewerUrl }}
        onLoadStart={() => setIsLoading(true)}
        onLoadEnd={() => setIsLoading(false)}
        onError={() => {
          setIsLoading(false);
          console.error("Failed to load PDF");
        }}
        style={{ flex: 1 }}
        startInLoadingState={true}
      />
    </View>
  );
};

export default PdfView;