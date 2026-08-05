import React from 'react';
import { moderateScale } from 'react-native-size-matters';
import {
    BaseToast,
    ErrorToast,
} from 'react-native-toast-message';

export const toastConfig = {
    success: props => (
        <BaseToast
            {...props}
            style={{
                borderLeftColor: '#22C55E',
                minHeight: moderateScale(55),
                height: 'auto',
                paddingVertical: moderateScale(8),
            }}
            contentContainerStyle={{
                paddingHorizontal: moderateScale(15),
                paddingVertical: moderateScale(8),
            }}
            text1NumberOfLines={2}
            text2NumberOfLines={6}
            text1Style={{
                fontSize: 16,
                fontWeight: '600',
            }}
            text2Style={{
                fontSize: 14,
                lineHeight: 20,
                flexWrap: 'wrap',
            }}
        />
    ),

    error: props => (
        <ErrorToast
            {...props}
            style={{
                borderLeftColor: '#EF4444',
                minHeight: moderateScale(55),
                height: 'auto',
                paddingVertical: moderateScale(8),
            }}
            contentContainerStyle={{
                paddingHorizontal: moderateScale(15),
                paddingVertical: moderateScale(8),
            }}
            text1NumberOfLines={2}
            text2NumberOfLines={6}
            text1Style={{
                fontSize: 16,
                fontWeight: '600',
            }}
            text2Style={{
                fontSize: 14,
                lineHeight: 20,
                flexWrap: 'wrap',
            }}
        />
    ),

    info: props => (
        <BaseToast
            {...props}
            style={{
                borderLeftColor: '#3B82F6',
                minHeight: moderateScale(55),
                height: 'auto',
                paddingVertical: moderateScale(7),
            }}
            contentContainerStyle={{
                paddingHorizontal: moderateScale(15),
                paddingVertical: moderateScale(8),
            }}
            text1NumberOfLines={2}
            text2NumberOfLines={6}
            text1Style={{
                fontSize: moderateScale(16),
                fontWeight: '600',
            }}
            text2Style={{
                fontSize: moderateScale(14),
                lineHeight: moderateScale(20),
                flexWrap: 'wrap',
            }}
        />
    ),
};