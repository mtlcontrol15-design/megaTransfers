import React from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
} from "react-native";
import { useTheme } from "@react-navigation/native";
import getStyles from "./style";

const CommonConfirmModal = ({
  visible,
  title,
  description,
  confirmText = "OK",
  onCancel,
  onConfirm,
}) => {
  const { colors } = useTheme();
  const styles = getStyles(colors);

  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>

          <Text style={styles.title}>{title}</Text>

          <Text style={styles.description}>{description}</Text>

          <View style={styles.buttonRow}>

            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={onCancel}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.confirmButton]}
              onPress={onConfirm}
            >
              <Text style={styles.confirmText}>{confirmText}</Text>
            </TouchableOpacity>

          </View>
        </View>
      </View>
    </Modal>
  );
};

export default CommonConfirmModal;