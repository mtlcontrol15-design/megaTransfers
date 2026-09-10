import React from 'react';
import {
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { moderateScale } from 'react-native-size-matters';
import { Theme } from '../../libs';

const SessionExpiredModal = ({ visible, onDismiss }) => {
    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            statusBarTranslucent
            onRequestClose={onDismiss}>
            <View style={styles.overlay}>
                <View style={styles.card}>
                    <Text style={styles.title}>Session Expired</Text>
                    <Text style={styles.message}>
                        Your session has expired. Please log in again to continue.
                    </Text>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={onDismiss}
                        activeOpacity={0.8}>
                        <Text style={styles.buttonText}>Go to Login</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: moderateScale(20),
        backgroundColor: 'rgba(0, 0, 0, 0.55)',
    },
    card: {
        width: '100%',
        maxWidth: moderateScale(360),
        padding: moderateScale(24),
        borderRadius: moderateScale(12),
        backgroundColor: '#FFFFFF',
    },
    title: {
        color: Theme.colors.red,
        fontSize: moderateScale(20),
        fontWeight: '700',
        textAlign: 'center',
    },
    message: {
        marginTop: moderateScale(10),
        color: '#4B5563',
        fontSize: moderateScale(15),
        lineHeight: moderateScale(22),
        textAlign: 'center',
    },
    button: {
        marginTop: moderateScale(22),
        paddingVertical: moderateScale(13),
        borderRadius: moderateScale(10),
        backgroundColor: Theme.colors.primary,
        alignItems: 'center',
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: moderateScale(15),
        fontWeight: '700',
    },
});

export default SessionExpiredModal;