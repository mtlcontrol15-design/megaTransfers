import { parsePhoneNumberFromString } from "libphonenumber-js";

export const formatInternationalPhone = (phone, defaultCountry = "GB") => {
    if (!phone) return "";

    const phoneString = String(phone).trim();

    try {
        // First try as an international number
        const internationalPhone = phoneString.startsWith("+")
            ? phoneString
            : `+${phoneString}`;

        const parsedInternational =
            parsePhoneNumberFromString(internationalPhone);

        if (parsedInternational?.isValid()) {
            return parsedInternational.formatInternational();
        }

        // Fallback to default country for local numbers
        const parsedLocal = parsePhoneNumberFromString(
            phoneString,
            defaultCountry
        );

        if (parsedLocal?.isValid()) {
            return parsedLocal.formatInternational();
        }

        return phoneString;
    } catch (error) {
        return phoneString;
    }
};