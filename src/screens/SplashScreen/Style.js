import { StyleSheet } from 'react-native';

import { Theme, Responsive } from '../../libs';
import { moderateScale } from 'react-native-size-matters';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal:moderateScale(16),
        // alignItems: 'center',
    },
    heading:{
        fontSize:moderateScale(22),
        fontFamily:Theme.typography?.heading.fontFamily
    }
});

export default styles;
