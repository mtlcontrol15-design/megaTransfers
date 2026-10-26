import { parsePhoneNumberFromString } from "libphonenumber-js";

export const formatInternationalPhone = (phone, defaultCountry = "GB") => {
    if (!phone) return "";

    const phoneString = String(phone).trim();

    try {
        const parsedPhone = parsePhoneNumberFromString(
            phoneString,
            defaultCountry
        );

        if (parsedPhone) {
            return parsedPhone.formatInternational();
        }

        return phoneString;
    } catch (error) {
        return phoneString;
    }
};