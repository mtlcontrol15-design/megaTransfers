import React, { useEffect, useState } from 'react';
import { Linking, Platform } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import NoInternetModal from '../components/NoInternetModal/NoInternetModal';

const InternetConnectionHandler = () => {
    const [isOffline, setIsOffline] = useState(false);
    const [isRetrying, setIsRetrying] = useState(false);

    const checkConnection = state => {
        const offline =
            state.isConnected === false ||
            state.isInternetReachable === false;

        setIsOffline(offline);
    };

    const handleRetry = async () => {
        try {
            setIsRetrying(true);

            const state = await NetInfo.refresh();
            checkConnection(state);
        } catch (error) {
            console.log('Internet retry error:', error);
            setIsOffline(true);
        } finally {
            setIsRetrying(false);
        }
    };

    const handleOpenSettings = async () => {
        try {
            if (Platform.OS === 'android') {
                await Linking.sendIntent('android.settings.WIRELESS_SETTINGS');
                return;
            }

            await Linking.openSettings();
        } catch (error) {
            console.log('Open wireless settings error:', error);

            try {
                if (Platform.OS === 'android') {
                    await Linking.sendIntent('android.settings.SETTINGS');
                    return;
                }

                await Linking.openSettings();
            } catch (fallbackError) {
                console.log('Fallback settings error:', fallbackError);
            }
        }
    };

    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener(state => {
            checkConnection(state);
        });

        NetInfo.fetch().then(checkConnection);

        return () => {
            unsubscribe();
        };
    }, []);

    return (
        <NoInternetModal
            visible={isOffline}
            isRetrying={isRetrying}
            onRetry={handleRetry}
            onOpenSettings={handleOpenSettings}
        />
    );
};

export default InternetConnectionHandler;