export const getDriverDocuments = (data) => {
    const driver = data?.pages?.[0]?.driver;

    const d = driver?.DriverData || {};
    const v = driver?.VehicleData || {};
    const u = driver?.UploadedData || {};

    // console.log("=======UploadedData structure:", u);

    // Handle both nested (u?.dvlaCard?.url) and flat (u?.dvlaCard) structures
    const getUrl = (field) => u?.[field]?.url || u?.[field] || null;

    return [
        {
            title: "Driver Picture",
            expiry: null,
            field: "driverPicture",
            url: getUrl("driverPicture"),
        },
        {
            title: "Driver License",
            expiry: d?.driverLicenseExpiry,
            field: "dvlaCard",
            url: getUrl("dvlaCard"),
        },
        {
            title: "Private Hire Card",
            expiry: d?.driverPrivateHireLicenseExpiry,
            field: "privateHireCard",
            url: getUrl("privateHireCard"),
        },
        {
            title: "PH License",
            expiry: d?.driverPrivateHireLicenseExpiry,
            field: "driverPrivateHirePaper",
            url: getUrl("driverPrivateHirePaper"),
        },
        {
            title: "Vehicle PH License",
            expiry: v?.carPrivateHireLicenseExpiry,
            field: "privateHireCarPaper",
            url: getUrl("privateHireCarPaper"),
        },
        {
            title: "Insurance",
            expiry: v?.carInsuranceExpiry,
            field: "insurance",
            url: getUrl("insurance"),
        },
        {
            title: "MOT",
            expiry: v?.motExpiryDate,
            field: "motExpiry",
            url: getUrl("motExpiry"),
        },
        {
            title: "V5 Logbook",
            expiry: null,
            field: "V5",
            url: getUrl("V5"),
        },
        {
            title: "Car Photo",
            expiry: null,
            field: "carPicture",
            url: getUrl("carPicture"),
        },
    ];
};