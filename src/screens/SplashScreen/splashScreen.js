import { ActivityIndicator, Text, View } from 'react-native';
import React, { useEffect } from 'react';

import { useNavigation } from '@react-navigation/native';

import { Theme } from '../../libs';
import { SvgXml } from 'react-native-svg';
import { splash, Splash1 } from '../../assets/svg/svg';
import { SafeFlexView } from '../../components';
import LoaderKit from 'react-native-loader-kit';
import { moderateScale } from 'react-native-size-matters';


const SplashScreen = () => {
  const navigation = useNavigation();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <SafeFlexView barStyle="light-content" statusBarColor={Theme.colors?.primary}>
      <View style={{ flex: 1, alignSelf: 'center', justifyContent: 'center', alignItems: 'center' }}>
        {/* <SvgXml xml={splash} />/ */}
        <LoaderKit
          style={{ width: 40, height: 40 }}
          name="BallSpinFadeLoader"
          color="#fff"
          size={50}
        />
        <Text style={{ color: Theme.colors?.white, fontSize: moderateScale(14), marginTop: moderateScale(20), marginHorizontal: moderateScale(20), textAlign: 'center' }}>
          Welcome to Mega Transfers
        </Text>
      </View>
    </SafeFlexView>
  );
};

export default SplashScreen;
