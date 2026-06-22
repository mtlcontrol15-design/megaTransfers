import React from 'react';
import { StatusBar, View } from 'react-native';
import { styles } from './SafeFlexViewStyle';
import { Theme } from '../../libs';

export default function SafeFlexView({
  children,
  statusBarColor = Theme.colors.primary1,
  barStyle = 'dark-content',
  backgroundColor,
}) {

  return (
    <View
      style={[
        styles.container,
        backgroundColor && { backgroundColor },
      ]}
    >
      <StatusBar
        backgroundColor={statusBarColor}
        barStyle={barStyle}
      />
      <View style={{ flex: 1 }}>{children}</View>
    </View>
  );
}
