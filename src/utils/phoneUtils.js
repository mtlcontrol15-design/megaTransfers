export const formatPhoneWithPlus = (phone) => {
    if (!phone) return "";
    phone = phone.toString().trim();
    return phone.startsWith("+") ? phone : `+${phone}`;
};

export const getDialableNumber = (phone) => {
    if (!phone) return "";
    return phone.replace(/[^\d+]/g, "");
};