
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { moderateScale, verticalScale } from "react-native-size-matters";

const SortJobsModal = ({
    visible, onClose, selectedValue, onSelect, colors,
}) => {
    const styles = getStyles(colors);
    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
            statusBarTranslucent={true}
        >
            <TouchableOpacity
                activeOpacity={1} onPress={onClose} style={styles.overlay}
            >
                <View
                    style={styles.modalContainer}
                >
                    <Text style={styles.title}>
                        Sort Jobs
                    </Text>
                    <TouchableOpacity
                        style={[
                            styles.option,
                            selectedValue === "earliest" && {
                                backgroundColor: colors.darkGrey,
                            },
                        ]}
                        onPress={() => onSelect("earliest")}
                    >
                        <View
                            style={[
                                styles.radioCircle,
                                {
                                    backgroundColor:
                                        selectedValue === "earliest"
                                            ? colors.primary
                                            : colors.gray200,
                                },
                            ]}
                        >
                            {selectedValue === "earliest" && (
                                <Text style={styles.check}>✓</Text>
                            )}
                        </View>

                        <Text
                            style={[
                                styles.optionText,
                                {
                                    color: colors.white,
                                    fontWeight:
                                        selectedValue === "earliest" ? "600" : "400",
                                },
                            ]}
                        >
                            Earliest Job First
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[
                            styles.option,
                            selectedValue === "latest" && {
                                backgroundColor: colors.gray100,
                            },
                        ]}
                        onPress={() => onSelect("latest")}
                    >
                        <View
                            style={[
                                styles.radioCircle,
                                {
                                    backgroundColor:
                                        selectedValue === "latest"
                                            ? colors.primary
                                            : colors.gray200,
                                },
                            ]}
                        >
                            {selectedValue === "latest" && (
                                <Text style={styles.check}>✓</Text>
                            )}
                        </View>

                        <Text
                            style={[
                                styles.optionText,
                                {
                                    color: colors.white,
                                    fontWeight:
                                        selectedValue === "latest" ? "600" : "400",
                                },
                            ]}
                        >
                            Latest Job First
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[
                            styles.closeButton,
                            { borderColor: colors.gray200 },
                        ]}
                        onPress={onClose}
                    >
                        <Text
                            style={[
                                styles.closeText,
                                { color: colors.white },
                            ]}
                        >
                            Close
                        </Text>
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>
        </Modal>
    );
};

export default SortJobsModal;

const getStyles = (colors) => StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "center",
        alignItems: "center",
        padding: moderateScale(20),
    },

    modalContainer: {
        width: "100%",
        borderRadius: moderateScale(16),
        paddingVertical: verticalScale(20),
        paddingHorizontal: moderateScale(16),
        backgroundColor:colors?.buttonBackground
    },

    title: {
        fontSize: moderateScale(18),
        fontWeight: "700",
        marginBottom: verticalScale(15),
        color:colors?.white
    },

    option: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: verticalScale(12),
        paddingHorizontal: moderateScale(12),
        borderRadius: moderateScale(10),
        marginBottom: verticalScale(8),
    },

    radioCircle: {
        width: moderateScale(28),
        height: moderateScale(28),
        borderRadius: moderateScale(14),
        justifyContent: "center",
        alignItems: "center",
        marginRight: moderateScale(12),
    },

    check: {
        color: "#fff",
        fontSize: moderateScale(14),
        fontWeight: "700",
    },

    optionText: {
        fontSize: moderateScale(14),
    },

    closeButton: {
        marginTop: verticalScale(10),
        paddingVertical: verticalScale(12),
        borderRadius: moderateScale(10),
        borderWidth: 1,
    },

    closeText: {
        textAlign: "center",
        fontSize: moderateScale(14),
        fontWeight: "600",
    },
});