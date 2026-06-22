import React, { useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Image,
} from "react-native";

import LoaderKit from "react-native-loader-kit";
import { useSelector } from "react-redux";
import { moderateScale } from "react-native-size-matters";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useTheme } from "@react-navigation/native";
import { Formik } from "formik";

import getStyles from "./style";
import Icons from "../../assets/icons";
import images from "../../assets/images";
import toastUtils from "../../utils/Toast/toast";
import LoaderModal from "../../utils/loaderModal";
import { EndPoints } from "../../services/EndPoints";
import { setFormValue } from "../../utils/profileForm.utils";
import { formatPhoneWithPlus } from "../../utils/phoneUtils";
import { openCameraOrGallery } from "../../utils/mediaPicker.utils";
import { uploadImageToBackend } from "../../utils/imageUpload.utils";
import { mutationHandler } from "../../services/mutations/mutationHandler";
import { checkExpiry, viewDocumentInApp } from "../../utils/document.utils";
import { registerDriverValidationSchema } from "../../utils/validationUtils";
import { pickAndUploadPDF, pickAndUploadDriverDocument } from "../../utils/pdfUpload.utils";
import LocationSearchModal from "../../components/JourneyCard/components/LocationSearchModal";

const DRIVER_DOCUMENTS = [
  { title: "Driver Picture", field: "driverPicture" },
  { title: "DVLA Card", field: "dvlaCard" },
  { title: "Private Hire Card", field: "privateHireCard" },
  { title: "Driver Private Hire Paper", field: "driverPrivateHirePaper" },
  { title: "Private Hire Car Paper", field: "privateHireCarPaper" },
  { title: "Insurance", field: "insurance" },
  { title: "MOT Expiry", field: "motExpiry" },
  { title: "V5", field: "V5" },
  { title: "Car Picture", field: "carPicture" },
];

const emptyDocuments = DRIVER_DOCUMENTS.reduce((acc, doc) => {
  acc[doc.field] = { url: "", expiry: null };
  return acc;
}, {});

const RegisterDriverScreen = ({ navigation, route }) => {
  const { colors } = useTheme();
  const styles = getStyles(colors);
  const { user } = useSelector(state => state.userReducer);
  const driverInfo = route?.params?.driver;
  const driverData = driverInfo?.DriverData || {};
  const formikRef = useRef(null);

  const [showPassword, setShowPassword] = useState(false);
  const [isImageUploading, setIsImageUploading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [currentDocumentBeingEdited, setCurrentDocumentBeingEdited] = useState(null);
  const [isDocUploading, setIsDocUploading] = useState(false);
  const [awaitingExpiryFor, setAwaitingExpiryFor] = useState(null);
  const [selectedDocumentDate, setSelectedDocumentDate] = useState(new Date());
  const [datePickerTarget, setDatePickerTarget] = useState(null);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [addressSearchText, setAddressSearchText] = useState("");

  const [form, setForm] = useState({
    fullName: `${driverData.firstName || ""} ${driverData.lastName || ""}`.trim(),
    email: driverData.emailAddress || "",
    password: "",
    firstName: driverData.firstName || "",
    surname: driverData.lastName || "",
    phone: formatPhoneWithPlus(driverData.phoneNumber) || "",
    dob: "",
    niNumber: "",
    phid: "",
    address: driverData.homeAddress || "",
    employeeNumber: driverData.employeeNumber || "",
    status: driverData.status || "Active",
    companyId: driverInfo?.companyId || user?.companyId || "",
    driverLicense: "",
    driverLicenseExpiry: "",
    driverPrivateHireLicenseExpiry: "",
    reg: "",
    color: "",
    make: "",
    model: "",
    category: [],
    carPrivateHireLicense: "",
    carPrivateHireLicenseExpiry: "",
    carInsuranceExpiry: "",
    motExpiryDate: "",
    profileImage: null,
    documents: emptyDocuments,
  });

  const { mutate, isPending, reset } = mutationHandler(
    EndPoints.registerDriver,
    null,
    (res) => {
      console.log("Driver registration response:", res);
      reset();
      toastUtils.showSuccess("Driver Registered", "Driver profile has been created");
      route?.params?.onRegistered?.(res);
      navigation.goBack();
    },
    (err) => {
      reset();
      toastUtils.showError(
        "Registration Failed",
        err?.message || "Failed to register driver"
      );
    },
    "post"
  );

  const formatDate = (date) =>
    date ? new Date(date).toISOString().split("T")[0] : null;

  const formatDisplayDateDash = (date) => {
    if (!date) return "";

    const parsed = new Date(date);
    if (isNaN(parsed.getTime())) return "";

    const day = String(parsed.getDate()).padStart(2, "0");
    const month = String(parsed.getMonth() + 1).padStart(2, "0");
    const year = parsed.getFullYear();

    return `${day}-${month}-${year}`;
  };

  const parseDisplayDateDash = (date) => {
    if (!date) return new Date();

    const [day, month, year] = date.split("-");
    const parsed = new Date(Number(year), Number(month) - 1, Number(day));

    return isNaN(parsed.getTime()) ? new Date() : parsed;
  };

  const formatApiDate = (date) => {
    if (!date) return null;

    const dashParts = date.split("-");
    if (dashParts.length === 3) {
      const [day, month, year] = dashParts;
      const parsed = new Date(Number(year), Number(month) - 1, Number(day));
      if (isNaN(parsed.getTime())) return null;
      return parsed.toISOString().split("T")[0];
    }

    const parts = date.split(" ");
    if (parts.length === 3) {
      const [day, monthStr, year] = parts;
      const monthMap = {
        Jan: 0,
        Feb: 1,
        Mar: 2,
        Apr: 3,
        May: 4,
        Jun: 5,
        Jul: 6,
        Aug: 7,
        Sep: 8,
        Oct: 9,
        Nov: 10,
        Dec: 11,
      };
      const parsed = new Date(Number(year), monthMap[monthStr], Number(day));
      if (isNaN(parsed.getTime())) return null;
      return parsed.toISOString().split("T")[0];
    }

    const parsed = new Date(date);
    return isNaN(parsed.getTime()) ? null : parsed.toISOString().split("T")[0];
  };

  const setValue = (key, value) => {
    setFormValue(setForm, form, key, value);
    formikRef.current?.setFieldValue(key, value, true);
  };

  const IMAGE_DOCUMENT_FIELDS = ["driverPicture", "carPicture"];
  const openDocumentPicker = async (field) => {
    if (IMAGE_DOCUMENT_FIELDS.includes(field)) {
      openCameraOrGallery(false, async (update) => {
        const nextState =
          typeof update === "function"
            ? update(form)
            : update;

        const selectedImage = nextState?.profileImage;

        if (!selectedImage?.uri) return;

        try {
          setCurrentDocumentBeingEdited(field);

          const url = await uploadImageToBackend(
            selectedImage,
            setIsDocUploading
          );

          setForm(prev => ({
            ...prev,
            documents: {
              ...prev.documents,
              [field]: {
                ...prev.documents[field],
                url,
                expiry: null,
              },
            },
          }));

          formikRef.current?.setFieldValue(
            `documents.${field}.url`,
            url,
            true
          );

          formikRef.current?.setFieldTouched(
            `documents.${field}.url`,
            true,
            false
          );
        } catch (error) {
          toastUtils.showError(
            "Upload Failed",
            error?.message || "Image upload failed"
          );
        } finally {
          setCurrentDocumentBeingEdited(null);
          setIsDocUploading(false);
        }
      });

      return;
    }
    await openPicker(field);
  };

  const openPicker = async (field) => {
    try {
      setCurrentDocumentBeingEdited(field);

      const url = await pickAndUploadDriverDocument(
        setIsDocUploading
      );

      if (!url) {
        setCurrentDocumentBeingEdited(null);
        return;
      }

      setForm(prev => ({
        ...prev,
        documents: {
          ...prev.documents,
          [field]: {
            ...prev.documents[field],
            url,
          },
        },
      }));
      formikRef.current?.setFieldValue(`documents.${field}.url`, url, true);
      formikRef.current?.setFieldTouched(`documents.${field}.url`, true, false);

      setAwaitingExpiryFor(field);
      setSelectedDocumentDate(new Date());
      setDatePickerTarget("document");
      setShowDatePicker(true);
      setCurrentDocumentBeingEdited(null);
    } catch (error) {
      console.log("Driver document upload error:", error);
      setCurrentDocumentBeingEdited(null);
      setAwaitingExpiryFor(null);
      setIsDocUploading(false);
    }
  };

  const handleDatePickerChange = (event, selectedDate) => {
    if (Platform.OS === "android") {
      setShowDatePicker(false);
    }

    if (event.type === "dismissed") {
      setShowDatePicker(false);
      setDatePickerTarget(null);
      setAwaitingExpiryFor(null);
      setIsDocUploading(false);
      setCurrentDocumentBeingEdited(null);
      if (datePickerTarget === "document") {
        toastUtils.showInfo("Expiry Not Set", "Document uploaded without expiry");
      }
      return;
    }

    if (selectedDate) {
      setSelectedDocumentDate(selectedDate);

      if (datePickerTarget === "dob") {
        setValue("dob", formatDisplayDateDash(selectedDate));
        formikRef.current?.setFieldTouched("dob", true, false);

        if (Platform.OS === "ios") {
          setShowDatePicker(false);
        }

        setDatePickerTarget(null);

        return;
      }

      const docField = currentDocumentBeingEdited || awaitingExpiryFor;

      if (docField) {
        setForm(prev => ({
          ...prev,
          documents: {
            ...prev.documents,
            [docField]: {
              ...prev.documents[docField],
              expiry: selectedDate.toISOString(),
            },
          },
        }));
        formikRef.current?.setFieldValue(`documents.${docField}.expiry`, selectedDate.toISOString(), true);
      }

      if (Platform.OS === "ios") {
        setShowDatePicker(false);
      }

      toastUtils.showSuccess(
        "Date Set",
        `Expiry date set to ${selectedDate.toLocaleDateString()}`
      );
      setCurrentDocumentBeingEdited(null);
      setAwaitingExpiryFor(null);
      setIsDocUploading(false);
      setDatePickerTarget(null);
    }
  };

  const openDobDatePicker = () => {
    setDatePickerTarget("dob");
    setSelectedDocumentDate(form.dob ? parseDisplayDateDash(form.dob) : new Date(2000, 0, 1));
    setShowDatePicker(true);
  };

  const renderField = (label, key, half = false, options = {}, formikProps = null) => {
    const isPassword = key.toLowerCase().includes("password");
    const keyboardType = options.keyboardType || (key === "email" ? "email-address" : "default");
    const isDisabled = options.disabled;
    const values = formikProps?.values || form;
    const fieldError = formikProps?.touched?.[key] && formikProps?.errors?.[key];

    return (
      <View style={half ? styles.fieldHalf : styles.fieldContainer}>
        <Text style={styles.fieldLabel}>{label}</Text>
        <View
          style={[
            styles.inputWrapper,
            isDisabled && { backgroundColor: "#F3F4F6" },
            fieldError && {
              borderColor: "red",
              borderWidth: 1,
            },
          ]}
        >
          <TextInput
            value={Array.isArray(values[key]) ? values[key].join(", ") : values[key]}
            secureTextEntry={isPassword && !showPassword}
            onChangeText={(text) => {
              if (isDisabled) return;

              if (key === "phone") {
                setValue(key, formatPhoneWithPlus(text));
              } else if (key === "category") {
                setValue(
                  key,
                  text.split(",").map(item => item.trim()).filter(Boolean)
                );
              } else {
                setValue(key, text);
              }
            }}
            onBlur={() => formikProps?.setFieldTouched(key, true)}
            editable={!isDisabled}
            style={[
              styles.input,
              isDisabled && { color: colors?.gray600 },
            ]}
            placeholder={label}
            placeholderTextColor={colors?.gray600}
            keyboardType={keyboardType}
            autoCapitalize={options.autoCapitalize || "sentences"}
          />

          {isPassword && (
            <View style={{ marginLeft: 5 }}>
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                {showPassword ? (
                  <Icons.EyeOff size={20} color={colors.primary} />
                ) : (
                  <Icons.Eye size={20} color={colors.primary} />
                )}
              </TouchableOpacity>
            </View>
          )}
        </View>
        {!!fieldError && (
          <Text style={{ color: "red", fontSize: 12, marginTop: 4 }}>
            {fieldError}
          </Text>
        )}
      </View>
    );
  };

  const renderAddressField = (formikProps = null) => {
    const fieldError = formikProps?.touched?.address && formikProps?.errors?.address;

    return (
      <View style={styles.fieldContainer}>
        <Text style={styles.fieldLabel}>Address</Text>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => {
            setAddressSearchText(form.address || "");
            setShowLocationModal(true);
          }}
        >
          <View
            style={[
              styles.inputWrapper,
              fieldError && {
                borderColor: "red",
                borderWidth: 1,
              },
            ]}
          >
            <Text
              numberOfLines={2}
              style={[
                styles.input,
                {
                  color: form.address ? colors.text : colors?.gray600,
                  paddingVertical: moderateScale(10),
                },
              ]}
            >
              {form.address || "Select address"}
            </Text>

            {form.address ? (
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => {
                  setValue("address", "");
                  setAddressSearchText("");
                  formikProps?.setFieldTouched("address", true, false);
                }}
              >
                <Icons.X size={18} color={colors?.gray600} />
              </TouchableOpacity>
            ) : (
              <Icons.Search size={18} color={colors.primary} />
            )}
          </View>
        </TouchableOpacity>

        {!!fieldError && (
          <Text style={{ color: "red", fontSize: 12, marginTop: 4 }}>
            {fieldError}
          </Text>
        )}
      </View>
    );
  };

  const renderDobField = (formikProps = null) => {
    const fieldError = formikProps?.touched?.dob && formikProps?.errors?.dob;

    return (
      <View style={styles.fieldHalf}>
        <Text style={styles.fieldLabel}>Date of Birth</Text>

        <TouchableOpacity activeOpacity={0.8} onPress={openDobDatePicker}>
          <View
            style={[
              styles.inputWrapper,
              fieldError && {
                borderColor: "red",
                borderWidth: 1,
              },
            ]}
          >
            <Text
              style={[
                styles.input,
                {
                  color: form.dob ? colors.text : colors?.gray600,
                  paddingVertical: moderateScale(10),
                },
              ]}
            >
              {form.dob || "Date of Birth"}
            </Text>

            <Icons.Clock size={18} color={colors.primary} />
          </View>
        </TouchableOpacity>

        {!!fieldError && (
          <Text style={{ color: "red", fontSize: 12, marginTop: 4 }}>
            {fieldError}
          </Text>
        )}
      </View>
    );
  };

  const renderDocumentItem = (doc, formikProps = null) => {
    const isPicture = IMAGE_DOCUMENT_FIELDS.includes(doc.field);
    const formDoc = form.documents[doc.field] || {};
    const { isExpired, label } = checkExpiry(formDoc.expiry);
    const hasDocumentUrl = !!formDoc.url;
    const documentTouched = formikProps?.touched?.documents?.[doc.field]?.url;
    const documentError = formikProps?.errors?.documents?.[doc.field]?.url;

    return (
      <>
        <View
          key={doc.field}
          style={[
            styles?.cardButtons,
            {
              marginBottom: documentTouched && documentError ? moderateScale(0) : moderateScale(10),
              borderColor: documentTouched && documentError
                ? "red"
                : isExpired
                  ? colors.error
                  : colors.gray200,
            },
          ]}
        >
          <View>
            <Text style={{ fontWeight: "600", color: colors.text, right: moderateScale(0) }}>
              {doc.title}
            </Text>
            {!isPicture && (formDoc.expiry && hasDocumentUrl ? (
              <Text style={{ fontSize: 12, color: isExpired ? colors.error : colors.primary, marginTop: moderateScale(3), fontWeight: "500" }}>
                Expiry: {new Date(formDoc.expiry).toLocaleDateString()} {isExpired ? "(Expired)" : ""}
              </Text>
            ) : (
              <View style={[styles.row, { marginTop: moderateScale(3),width:'50%' }]}>
                <Icons.Clock size={12} color={isExpired ? colors.error : colors?.gray600} />
                <Text
                  style={{
                    fontSize: 12,
                    color: isExpired ? "red" : colors.black,
                  }}
                >
                  {label
                    ? `Expiry: ${label} ${isExpired ? "(Expired)" : ""}`
                    : "Expiry: Not Set"}
                </Text>
              </View>
            ))}
          </View>

          <View style={styles.row}>
            {hasDocumentUrl ? (
              <>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => viewDocumentInApp(navigation, { ...doc, url: formDoc.url })}
                >
                  <Image style={styles?.pdfIcon} source={images?.pdf} />
                  {((isDocUploading && currentDocumentBeingEdited === doc.field) || awaitingExpiryFor === doc.field) && (
                    <View style={styles?.indicator}>
                      <LoaderKit
                        style={{ width: 30, height: 30 }}
                        name="BallSpinFadeLoader"
                        color={colors.white}
                        size={40}
                      />
                    </View>
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.7}
                  style={{ marginLeft: moderateScale(8) }}
                  onPress={() => openDocumentPicker(doc.field)}
                >
                  <Icons.Edit2 size={16} color={colors.primary} />
                </TouchableOpacity>

                <Icons.CheckCircle size={16} color={isExpired ? colors.error : colors.gray600} />
              </>
            ) : (
              <TouchableOpacity
                activeOpacity={0.7}
                style={styles.uploadBtn}
                onPress={() => openDocumentPicker(doc.field)}
              >
                <Image style={styles?.pdfIcon} source={images?.pdf} />
                {((isDocUploading && currentDocumentBeingEdited === doc.field) || awaitingExpiryFor === doc.field) && (
                  <View style={styles?.indicator}>
                    <LoaderKit
                      style={{ width: 30, height: 30 }}
                      name="BallSpinFadeLoader"
                      color={colors.primary}
                      size={40}
                    />
                  </View>
                )}
                <Text style={styles.uploadText}>Upload</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
        {!!documentTouched && !!documentError && (
          <Text style={{ color: "red", fontSize: 12, marginVertical: moderateScale(8) }}>
            {documentError}
          </Text>
        )}
      </>
    );
  };

  const handleRegister = async (values) => {
    try {
      let imageUrl = values.profileImage || form.profileImage;

      if (typeof imageUrl === "object" && imageUrl?.uri) {
        setIsImageUploading(true);
        imageUrl = await uploadImageToBackend(imageUrl);
        setIsImageUploading(false);
      }

      const driverBody = {
        driverId: driverInfo?._id || route?.params?.driverId || user?.driverId,
        firstName: values.firstName,
        lastName: values.surname,
        phoneNumber: values.phone,
        emailAddress: values.email,
        homeAddress: values.address,
        dateOfBirth: formatApiDate(values.dob),
        NationalInsurance: values.niNumber,
        privateHireCardNo: values.phid,
        driverLicense: values.driverLicense,
        driverLicenseExpiry: values.documents?.dvlaCard?.expiry
          ? formatDate(values.documents.dvlaCard.expiry)
          : formatApiDate(values.driverLicenseExpiry),
        driverPrivateHireLicenseExpiry: values.documents?.driverPrivateHirePaper?.expiry
          ? formatDate(values.documents.driverPrivateHirePaper.expiry)
          : formatApiDate(values.driverPrivateHireLicenseExpiry),

        carRegistration: values.reg,
        carMake: values.make,
        carModal: values.model,
        carColor: values.color,
        vehicleTypes: Array.isArray(values.category)
          ? values.category
          : values.category
            ? [values.category]
            : [],
        carPrivateHireLicense: values.carPrivateHireLicense,
        carPrivateHireLicenseExpiry: values.documents?.privateHireCarPaper?.expiry
          ? formatDate(values.documents.privateHireCarPaper.expiry)
          : formatApiDate(values.carPrivateHireLicenseExpiry),
        carInsuranceExpiry: values.documents?.insurance?.expiry
          ? formatDate(values.documents.insurance.expiry)
          : formatApiDate(values.carInsuranceExpiry),
        motExpiryDate: values.documents?.motExpiry?.expiry
          ? formatDate(values.documents.motExpiry.expiry)
          : formatApiDate(values.motExpiryDate),

        availability: [
          {
            from: formatDate(new Date()),
            to: formatDate(new Date()),
          },
        ],

        UploadedData: {
          driverPicture: values.documents?.driverPicture?.url
            ? [values.documents.driverPicture.url]
            : imageUrl
              ? [imageUrl]
              : [],
          privateHireCard: values.documents?.privateHireCard?.url
            ? [values.documents.privateHireCard.url]
            : [],
          dvlaCard: values.documents?.dvlaCard?.url
            ? [values.documents.dvlaCard.url]
            : [],
          carPicture: values.documents?.carPicture?.url
            ? [values.documents.carPicture.url]
            : [],
          privateHireCarPaper: values.documents?.privateHireCarPaper?.url
            ? [values.documents.privateHireCarPaper.url]
            : [],
          driverPrivateHirePaper: values.documents?.driverPrivateHirePaper?.url
            ? [values.documents.driverPrivateHirePaper.url]
            : [],
          insurance: values.documents?.insurance?.url
            ? [values.documents.insurance.url]
            : [],
          motExpiry: values.documents?.motExpiry?.url
            ? [values.documents.motExpiry.url]
            : [],
          V5: values.documents?.V5?.url
            ? [values.documents.V5.url]
            : [],
          additionalUploads: [],
        },
      };

      console.log("Driver registration payload:", driverBody);
      mutate(driverBody);
    } catch (error) {
      setIsImageUploading(false);
      toastUtils.showError("Upload Failed", error?.message || "Failed to upload image");
    }
  };

  const imageUri = form?.profileImage?.uri || form?.profileImage || null;

  return (
    <Formik
      innerRef={formikRef}
      initialValues={form}
      validationSchema={registerDriverValidationSchema}
      validateOnBlur
      validateOnChange
      onSubmit={handleRegister}
    >
      {(formikProps) => (
        <KeyboardAvoidingView style={{ flex: 1 }}>
          <View style={styles.container}>
            <View style={styles.header}>
              <TouchableOpacity
                style={styles.headerIcon}
                onPress={() => navigation.goBack()}
                hitSlop={{ top: 30, bottom: 30, left: 30, right: 30 }}
              >
                <Icons.ArrowLeft size={22} color={colors.white} />
              </TouchableOpacity>

              <Text style={styles.headerTitle}>Register Driver</Text>

              <View style={{ width: moderateScale(34) }} />
            </View>

            <ScrollView
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={{ paddingBottom: moderateScale(120) }}
            >
              <View style={styles.profileCard}>
                <View style={styles.avatar}>
                  {imageUri ? (
                    <View style={{ width: moderateScale(85), height: moderateScale(85) }}>
                      <Image
                        source={{ uri: imageUri }}
                        style={{ width: moderateScale(85), height: moderateScale(85), borderRadius: 45 }}
                      />

                      {isImageUploading && (
                        <View style={styles?.indicator}>
                          <LoaderKit
                            style={{ width: 30, height: 30 }}
                            name="BallSpinFadeLoader"
                            color="#07384d"
                            size={40}
                          />
                        </View>
                      )}
                    </View>
                  ) : (
                    <View style={{ width: 80, height: 80, justifyContent: "center", alignItems: "center" }}>
                      <Icons.User size={40} color={colors.bttonColor} />
                      {isImageUploading && (
                        <View style={styles?.indicator}>
                          <LoaderKit
                            style={{ width: 30, height: 30 }}
                            name="BallSpinFadeLoader"
                            color="#07384d"
                            size={40}
                          />
                        </View>
                      )}
                    </View>
                  )}
                </View>

                <TouchableOpacity
                  activeOpacity={0.7}
                  style={[
                    styles?.iconWrepper,
                    { opacity: isImageUploading ? 0.5 : 1 },
                  ]}
                  onPress={() => openCameraOrGallery(isImageUploading, setForm)}
                  disabled={isImageUploading}
                >
                  <Icons.Camera size={24} color={colors.bttonColor} />
                </TouchableOpacity>

                <Text style={styles.name}>
                  {form.fullName || `${form.firstName} ${form.surname}`.trim() || "New Driver"}
                </Text>

                <View style={styles.roleBadge}>
                  <Text style={styles.roleText}>Driver</Text>
                </View>
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Account Info</Text>

                {renderField("Full Name", "fullName", false, {}, formikProps)}
                {renderField("Email", "email", false, {
                  keyboardType: "email-address",
                  autoCapitalize: "none",
                  disabled: true,
                }, formikProps)}
                {renderField("Password", "password", false, {}, formikProps)}
                {/* {renderField("Company ID", "companyId", false, {}, formikProps)} */}
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Driver Information</Text>

                <View style={styles.row}>
                  {renderField("First Name", "firstName", true, {}, formikProps)}
                  {renderField("Surname", "surname", true, {}, formikProps)}
                </View>

                {renderField("Contact Number", "phone", false, {
                  keyboardType: "phone-pad",
                }, formikProps)}

                <View style={styles.row}>
                  {renderDobField(formikProps)}
                  {renderField("NI Number", "niNumber", true, {
                    autoCapitalize: "characters",
                  }, formikProps)}
                </View>

                <View style={styles.row}>
                  {renderField("Employee Number", "employeeNumber", true, {}, formikProps)}
                  {renderField("Status", "status", true, { disabled: true }, formikProps)}
                </View>

                {renderAddressField(formikProps)}
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Vehicle Details</Text>

                <View style={styles.row}>
                  {renderField("Registration", "reg", true, {
                    autoCapitalize: "characters",
                  }, formikProps)}
                  {renderField("Colour", "color", true, {}, formikProps)}
                </View>

                <View style={styles.row}>
                  {renderField("Make", "make", true, {}, formikProps)}
                  {renderField("Model", "model", true, {}, formikProps)}
                </View>

                {renderField("Category", "category", false, {}, formikProps)}
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Driver Documents</Text>
                {DRIVER_DOCUMENTS.map((doc) => renderDocumentItem(doc, formikProps))}
              </View>

              <View style={[styles.row, { marginHorizontal: moderateScale(16) }]}>
                <TouchableOpacity
                  style={styles.cancelBtn}
                  onPress={() => navigation.goBack()}
                >
                  <Text style={{ color: colors?.text, textAlign: "center", width: moderateScale(80) }}>
                    Cancel
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.saveBtn} onPress={formikProps.handleSubmit}>
                  <Text style={{ color: "white", textAlign: "center", width: moderateScale(80) }}>
                    Register
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>

            <LocationSearchModal
              visible={showLocationModal}
              onClose={() => setShowLocationModal(false)}
              searchText={addressSearchText}
              setSearchText={setAddressSearchText}
              colors={colors}
              field={{ field: "address" }}
              oldAddresses={form.address ? [form.address] : []}
              onSelect={(location) => {
                setValue("address", location?.description || "");
                formikProps.setFieldTouched("address", true, false);
                setAddressSearchText(location?.description || "");
                setShowLocationModal(false);
              }}
            />

            <LoaderModal visible={isPending || isImageUploading} />

            {showDatePicker && (
              <DateTimePicker
                value={selectedDocumentDate}
                mode="date"
                display={Platform.OS === "ios" ? "spinner" : "default"}
                onChange={handleDatePickerChange}
                minimumDate={datePickerTarget === "dob" ? new Date(1900, 0, 1) : new Date(2000, 0, 1)}
                maximumDate={datePickerTarget === "dob" ? new Date() : new Date(2070, 11, 31)}
              />
            )}
          </View>
        </KeyboardAvoidingView>
      )}
    </Formik>
  );
};

export default RegisterDriverScreen;