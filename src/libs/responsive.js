import {Dimensions} from 'react-native';
const {width, height} = Dimensions.get('window');
import {RFPercentage} from 'react-native-responsive-fontsize';
import { moderateScale } from 'react-native-size-matters';

const parseValue = value => {
  if (typeof value === 'number') {
    // If the value is already a number, return it as is
    return value;
  } else if (typeof value === 'string') {
    // Check if the string ends with '%'
    const isPercentage = value.endsWith('%');

    // If it's a percentage, attempt to parse the numeric part
    if (isPercentage) {
      const numericPart = parseFloat(value);

      // Check if parsing was successful and the result is a finite number
      if (!isNaN(numericPart) && isFinite(numericPart)) {
        return numericPart;
      }
    }

    // If it's not a percentage or parsing fails, attempt to parse the entire string
    const parsedValue = parseFloat(value);

    // Check if parsing was successful and the result is a finite number
    if (!isNaN(parsedValue) && isFinite(parsedValue)) {
      return parsedValue;
    }
  }
};

const Responsive = {
  width,
  height,
  getWidth: value => {
    const parsedValue = parseValue(value);
    let responsiveWidth = 0;
    responsiveWidth = width * (parsedValue / 100);
    return responsiveWidth;
  },
  getHeight: value => {
    const parsedValue = parseValue(value);
    let responsiveHeight = 0;
    responsiveHeight = height * (parsedValue / 100);
    return responsiveHeight;
  },
  AppFonts: {
    h1: RFPercentage(4.5),
    h2: RFPercentage(4.0),
    h3: RFPercentage(3.5),
    h4: RFPercentage(3.0),
    h5: moderateScale(14),
    t1: RFPercentage(2.0),
    t2: RFPercentage(1.82),
    t3: RFPercentage(1.35),
  },
};

export default Responsive;
