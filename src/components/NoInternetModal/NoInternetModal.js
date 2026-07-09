import React from 'react';
import {
    Modal,
    View,
    Text,
    Image,
    StyleSheet,
    Pressable,
    ActivityIndicator,
} from 'react-native';
import { moderateScale } from 'react-native-size-matters';
import { Theme } from '../../libs';


const NoInternetModal = ({
    visible,
    onRetry,
    onOpenSettings,
    isRetrying,
}) => {
    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            statusBarTranslucent
        >
            <View style={styles.overlay}>
                <View style={styles.modalBox}>
                    <Image
                        source={require('../../assets/images/NoInternet.png')}
                        style={styles.image}
                        resizeMode="contain"
                    />

                    <Text style={styles.title}>
                        No Internet Connection
                    </Text>

                    <Text style={styles.description}>
                        Please check your Wi-Fi or mobile data. Tap retry after turning your internet back on.
                    </Text>

                    <Pressable
                        style={styles.retryButton}
                        onPress={onRetry}
                        disabled={isRetrying}
                    >
                        {isRetrying ? (
                            <ActivityIndicator color="#FFFFFF" />
                        ) : (
                            <Text style={styles.retryButtonText}>
                                Retry
                            </Text>
                        )}
                    </Pressable>

                    <Pressable
                        style={styles.settingsButton}
                        onPress={onOpenSettings}
                    >
                        <Text style={styles.settingsButtonText}>
                            Open Settings
                        </Text>
                    </Pressable>
                </View>
            </View>
        </Modal>
    );
};

export default NoInternetModal;

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.45)',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: moderateScale(20),
    },
    modalBox: {
        width: '100%',
        backgroundColor: '#FFFFFF',
        borderRadius: moderateScale(8),
        paddingVertical: moderateScale(28),
        paddingHorizontal: moderateScale(20),
        alignItems: 'center',
    },
    image: {
        width: moderateScale(150),
        height: moderateScale(150),
        marginBottom: moderateScale(18),
    },
    title: {
        fontSize: moderateScale(18),
        fontWeight: '700',
        color: Theme.colors.black,
        textAlign: 'center',
        marginBottom: moderateScale(8),
    },
    description: {
        fontSize: moderateScale(13),
        color: Theme.colors.gray,
        textAlign: 'center',
        lineHeight: moderateScale(18),
        marginBottom: moderateScale(20),
    },
    retryButton: {
        width: '100%',
        height: moderateScale(48),
        backgroundColor: '#000000',
        borderRadius: moderateScale(12),
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: moderateScale(12),
    },
    retryButtonText: {
        color: '#FFFFFF',
        fontSize: moderateScale(15),
        fontWeight: '700',
    },
    settingsButton: {
        width: '100%',
        height: moderateScale(46),
        borderRadius: moderateScale(12),
        borderWidth: moderateScale(1),
        borderColor: '#D1D5DB',
        justifyContent: 'center',
        alignItems: 'center',
    },
    settingsButtonText: {
        color: '#111111',
        fontSize: moderateScale(15),
        fontWeight: '600',
    },

});