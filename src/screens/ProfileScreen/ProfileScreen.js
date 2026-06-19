import React, { useCallback, useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, TextInput, Linking, Alert, KeyboardAvoidingView, Platform, Image, ActionSheetIOS, ActivityIndicator } from "react-native";

import LoaderKit from 'react-native-loader-kit'
import { useDispatch, useSelector } from "react-redux";
import { moderateScale } from "react-native-size-matters";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useFocusEffect, useTheme } from "@react-navigation/native";

import getStyles from "./style";
import Icons from "../../assets/icons";
import images from "../../assets/images";
import toastUtils from "../../utils/Toast/toast";
import LoaderModal from "../../utils/loaderModal";
import { EndPoints } from "../../services/EndPoints";
import { handleLogout } from "../../utils/logout.utils";
import { dispatchUser } from "../../redux/slices/userSlice";
import { formatPhoneWithPlus } from "../../utils/phoneUtils";
import { pickAndUploadPDF, pickAndUploadDriverDocument } from '../../utils/pdfUpload.utils'
import { uploadImageToBackend } from "../../utils/imageUpload.utils";
import { openCameraOrGallery } from "../../utils/mediaPicker.utils";
import useQueryHandler from "../../services/queries/useQueryHandler";
import { getDriverDocuments } from "../../utils/driverDocuments.utils";
import { mutationHandler } from "../../services/mutations/mutationHandler";
import { checkExpiry, viewDocumentInApp } from "../../utils/document.utils";
import { setFormValue, mapUserToForm } from "../../utils/profileForm.utils";

const ProfileScreen = ({ navigation }) => {
  const { colors } = useTheme();
  const styles = getStyles(colors);
  const dispatch = useDispatch();
  const [errors, setErrors] = useState({});

  const { user } = useSelector(state => state.userReducer);

  // console.log('=======user====', user);

  const driverId = user?.driverId;


  const { mutate, isPending, reset } = mutationHandler(
    EndPoints.updateProfile,
    null,
    (res) => {
      // console.log('=======profile response is here', res);
      reset();
      dispatch(dispatchUser(res.user));
      toastUtils.showSuccess(
        "Update Success",
        "Profile has updated"
      );
    },
    (err) => {
      reset();

      // console.log('profile update error is here', err?.message);

      toastUtils.showError(
        "Update Failed",
        err?.message || "Current password is incorrect"
      );
    },
    "put"
  );


  const { mutate: mutateLogout } = mutationHandler(
    EndPoints?.logOut,
    null,
    (res) => {
      console.log(' Logout successfully:', res);
    },
    (err) => {
      console.log('Logout error:', err);
    },
    "post"
  );

  const { mutate: driverUpdateMutate, isPending: driverProfileIsPending, reset: driverProfileIsReset, } = mutationHandler(
    `${EndPoints.updateDrivers}/${driverId}`,
    null,
    (res) => {
      console.log("=======Driver Update Response:", res);
      driverProfileIsReset();
      refetch()
      dispatch(dispatchUser({
        ...user,
        driver: res.driver
      }));
    },
    (err) => {
      driverProfileIsReset();

      console.log("Driver Update Error:", err?.message);
      toastUtils.showError(
        "Update Failed",
        err?.message || "Failed to update driver profile"
      );
    },
    "put"
  );


  const { data, error, status, refetch } = useQueryHandler(
    `${EndPoints.getDrivers}/${driverId}`
  );

  // console.log('=======data is here', data);

  const mapDriverApiToForm = (apiData) => {
    const driver = apiData?.pages?.[0]?.driver;

    const d = driver?.DriverData || {};
    const v = driver?.VehicleData || {};

    // console.log('========driver data is here',d);
    // console.log('========vehicle data is here',v);


    return {
      firstName: d.firstName || "",
      surname: d.lastName || "",
      phone: formatPhoneWithPlus(d.phoneNumber) || "",
      email: d.email || "",
      dob: d.dateOfBirth ? formatDisplayDate(d.dateOfBirth) : "",
      niNumber: d.NationalInsurance || "",
      phid: d.privateHireCardNo || "",
      address: d.homeAddress || "",
      employeeNumber: d.employeeNumber || "",
      status: d.status || "",

      reg: v.carRegistration || "",
      color: v.carColor || "",
      make: v.carMake || "",
      model: v.carModal || "",
      category: v.vehicleTypes || [],
      carPrivateHireLicense: v.carPrivateHireLicense || "",
      carPrivateHireLicenseExpiry: v.carPrivateHireLicenseExpiry || "",
      carInsuranceExpiry: v.carInsuranceExpiry || "",
      motExpiryDate: v.motExpiryDate || "",
    };
  };



  const isDriver = user?.role === "driver";
  const isCustomer = user?.role === "customer";

  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isImageUploading, setIsImageUploading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [currentDocumentBeingEdited, setCurrentDocumentBeingEdited] = useState(null);
  const [isDocUploading, setIsDocUploading] = useState(false);
  const [awaitingExpiryFor, setAwaitingExpiryFor] = useState(null);
  const [selectedDocumentDate, setSelectedDocumentDate] = useState(new Date());

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    firstName: "John",
    surname: "Doe",
    phone: "+44 7123 456789",
    dob: "12 Feb 1990",
    niNumber: "QQ123456C",
    phid: "PH-982341",
    address: "221B Baker Street",
    reg: "AB12 CDE",
    color: "White",
    make: "Toyota",
    model: "Prius 2022",
    category: "Hybrid Taxi",
    currentPassword: "",
    newPassword: "",
    profileImage: null,
    documents: {
      driverPicture: { url: "", expiry: null },
      dvlaCard: { url: "", expiry: null },
      privateHireCard: { url: "", expiry: null },
      driverPrivateHirePaper: { url: "", expiry: null },
      privateHireCarPaper: { url: "", expiry: null },
      insurance: { url: "", expiry: null },
      motExpiry: { url: "", expiry: null },
      V5: { url: "", expiry: null },
      carPicture: { url: "", expiry: null },
    },

  });

  const formatDate = (date) =>
    date ? new Date(date).toISOString().split("T")[0] : null;

  const formatDisplayDate = (date) => {
    if (!date) return "";

    return new Date(date).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const formatApiDate = (date) => {
    if (!date) return null;

    const parts = date.split(" ");
    if (parts.length === 3) {
      const [day, monthStr, year] = parts;

      const monthMap = {
        Jan: 0, Feb: 1, Mar: 2, Apr: 3,
        May: 4, Jun: 5, Jul: 6, Aug: 7,
        Sep: 8, Oct: 9, Nov: 10, Dec: 11,
      };

      const parsed = new Date(
        Number(year),
        monthMap[monthStr],
        Number(day)
      );

      if (isNaN(parsed.getTime())) return null;

      return parsed.toISOString().split("T")[0];
    }

    return null;
  };

  const setValue = (key, value) => {
    setFormValue(setForm, form, key, value);
  };

  const openPicker = async (field) => {
    try {
      // mark current document for upload UI
      setCurrentDocumentBeingEdited(field);

      const url = await pickAndUploadDriverDocument(
        setIsDocUploading
      );

      if (!url) {
        setCurrentDocumentBeingEdited(null);
        return;
      }

      // set uploaded url into form and wait for expiry selection
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

      setAwaitingExpiryFor(field);
      setSelectedDocumentDate(new Date());
      setShowDatePicker(true);
      setCurrentDocumentBeingEdited(null);

    } catch (error) {
      console.log('error message is here', error);
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
      // Clear any awaiting expiry/upload states so loaders stop
      setAwaitingExpiryFor(null);
      setIsDocUploading(false);
      setCurrentDocumentBeingEdited(null);
      toastUtils.showInfo("Expiry Not Set", "Document uploaded without expiry");
      return;
    }

    if (selectedDate) {
      setSelectedDocumentDate(selectedDate);

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
      }

      if (Platform.OS === "ios") {
        setShowDatePicker(false);
      }

      toastUtils.showSuccess("Date Set", `Expiry date set to ${selectedDate.toLocaleDateString()}`);
      setCurrentDocumentBeingEdited(null);
      setAwaitingExpiryFor(null);
    }
  };

  const renderField = (label, key, half = false) => {
    const isEmail = key === "email";
    const isPassword = key.toLowerCase().includes("password");

    return (
      <View style={half ? styles.fieldHalf : styles.fieldContainer}>
        <Text style={styles.fieldLabel}>{label}</Text>

        {isEditing ? (
          <>
            <View
              style={[
                styles.inputWrapper,
                errors[key] && {
                  borderColor: "red",
                  borderWidth: 1,
                },
              ]}
            >
              <TextInput
                value={
                  Array.isArray(form[key])
                    ? form[key].join(", ")
                    : form[key]
                }
                secureTextEntry={isPassword && !showPassword}
                onChangeText={(text) => {
                  if (!isEmail) {

                    if (key === "phone") {
                      setValue(key, formatPhoneWithPlus(text));
                    } else if (key === "category") {
                      setValue(
                        key,
                        text.split(",").map(item => item.trim())
                      );
                    } else {
                      setValue(key, text);
                    }

                    if (errors[key]) {
                      setErrors(prev => ({ ...prev, [key]: null }));
                    }
                  }
                }}
                editable={!isEmail}
                style={[
                  styles.input,
                  isEmail && { backgroundColor: "#F3F4F6" },
                ]}
                placeholder={label}
                placeholderTextColor={colors?.gray600}
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
            {isEmail && (
              <Text style={styles?.adminText}>
                Email can be edited by admin only
              </Text>
            )}
          </>
        ) : isPassword ? (
          <Text style={styles.fieldValue}>••••••••</Text>
        ) : key === "category" && Array.isArray(form[key]) ? (
          form[key].map((item, index) => (
            <Text key={index} style={styles.fieldValue}>
              {item}{index !== form[key].length - 1 ? "," : ""}
            </Text>
          ))
        ) : (
          <Text style={styles.fieldValue}>
            {Array.isArray(form[key]) ? form[key].join(", ") : form[key]}
          </Text>
        )}
      </View>
    );
  };
  const renderDocumentItem = (doc) => {
    const formDocExpiry = form.documents[doc.field]?.expiry;
    const finalExpiry = formDocExpiry || doc.expiry;
    const { isExpired, label } = checkExpiry(finalExpiry);

    const formDocURL = form.documents[doc.field]?.url;
    const hasDocumentUrl = !!formDocURL || !!doc.url;

    const rawUrl = formDocURL || doc.url;

    const finalUrl = Array.isArray(rawUrl)
      ? rawUrl[0]
      : rawUrl;
    const formDocHasExpiry = formDocExpiry !== null && formDocExpiry !== undefined;

    return (
      <View key={doc.field} style={[styles?.cardButtons, {
        borderColor: isEditing
          ? colors.gray200
          : isExpired
            ? colors.error
            : colors.gray200
      }]}>
        <View>
          <Text style={{ fontWeight: "600", color: colors.text, right: moderateScale(3) }}> {doc.title} </Text>
          {finalExpiry && hasDocumentUrl ? (
            <Text style={{ fontSize: 12, color: isExpired ? colors.error : colors.primary, marginTop: moderateScale(3), fontWeight: "500" }}>
              Expiry: {new Date(finalExpiry).toLocaleDateString()} {isExpired ? "(Expired)" : ""}
            </Text>
          ) : (
            <View style={[styles.row, { marginTop: moderateScale(3) }]}>
              <Icons.Clock size={12} color={isEditing ? colors.gray600 : isExpired ? colors.error : colors?.gray600} />
              <Text
                style={{
                  fontSize: 12,
                  color: isEditing ? colors.black : isExpired ? "red" : colors.black,
                }}
              >
                {isEditing
                  ? "Expiry: Not Set"
                  : label
                    ? `Expiry: ${label} ${isExpired ? "(Expired)" : ""}`
                    : "Expiry: Not Set"}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.row}>
          {hasDocumentUrl ? (
            <>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => {
                  const documentToView = {
                    ...doc,
                    url: finalUrl,
                  };
                  viewDocumentInApp(navigation, documentToView);
                }}
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

              {isEditing && (
                <TouchableOpacity
                  activeOpacity={0.7}
                  style={{ marginLeft: moderateScale(8) }}
                  onPress={() => openPicker(doc.field)}
                >
                  <Icons.Edit2 size={16} color={colors.primary} />
                </TouchableOpacity>
              )}

              <Icons.CheckCircle
                size={16}
                color={isExpired ? colors.error : colors.gray600}
              />
            </>
          ) : isEditing ? (
            <TouchableOpacity
              activeOpacity={0.7}
              style={styles.uploadBtn}
              onPress={() => openPicker(doc.field)}
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
          ) : (
            <Icons.CheckCircle
              size={16}
              color={colors.gray400}
            />
          )}
        </View>
      </View>
    );
  }
  const handleSave = async () => {
    let newErrors = {};

    if (!form.currentPassword) {
      newErrors.currentPassword = "Current password is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      Alert.alert("Required", "Current password is required");
      return;
    }

    setErrors({});

    try {
      let imageUrl = form.profileImage;

      if (typeof form.profileImage === "object" && form.profileImage?.uri) {
        imageUrl = await uploadImageToBackend(form.profileImage);
      }

      const accountBody = {
        currentPassword: form.currentPassword,
        fullName: form.fullName,
        phone: form.phone,
        profileImage: imageUrl,
      };

      console.log('=======account body is here', accountBody);


      const driverBody = {
        firstName: form.firstName,
        surName: form.surname,
        email: form.email,
        contact: form.phone || "+441234567890",

        employeeNumber: form.employeeNumber || "001",
        status: form.status || "Active",

        dateOfBirth: formatApiDate(form.dob),
        NationalInsurance: form.niNumber,
        privateHireCardNo: form.phid,
        address: form.address,

        driverLicense: form.driverLicense || "XYZ123456789",
        driverLicenseExpiry: formatDate(form.driverLicenseExpiry) || "2028-12-31",
        driverPrivateHireLicenseExpiry: formatDate(form.driverPrivateHireLicenseExpiry) || "2027-06-30",

        availability: [
          {
            from: new Date().toISOString(),
            to: new Date().toISOString(),
          },
        ],

        carRegistration: form.reg,
        carColor: form.color,
        carMake: form.make,
        carModal: form.model,

        vehicleTypes: Array.isArray(form.category)
          ? form.category.join(",")
          : form.category || "",

        carPrivateHireLicense: form.carPrivateHireLicense,
        carPrivateHireLicenseExpiry: form.documents?.privateHireCarPaper?.expiry ? formatDate(form.documents.privateHireCarPaper.expiry) : formatDate(form.carPrivateHireLicenseExpiry),
        carInsuranceExpiry: form.documents?.insurance?.expiry ? formatDate(form.documents.insurance.expiry) : formatDate(form.carInsuranceExpiry),
        motExpiryDate: form.documents?.motExpiry?.expiry ? formatDate(form.documents.motExpiry.expiry) : formatDate(form.motExpiryDate),

        driverLicenseExpiry: form.documents?.dvlaCard?.expiry ? formatDate(form.documents.dvlaCard.expiry) : (formatDate(form.driverLicenseExpiry) || "2028-12-31"),
        driverPrivateHireLicenseExpiry: form.documents?.driverPrivateHirePaper?.expiry ? formatDate(form.documents.driverPrivateHirePaper.expiry) : (formatDate(form.driverPrivateHireLicenseExpiry) || "2027-06-30"),
        privateHireCardNoExpiry: form.documents?.privateHireCard?.expiry ? formatDate(form.documents.privateHireCard.expiry) : null,

        ...(form.documents && {
          driverPicture: form.documents.driverPicture?.url,
          dvlaCard: form.documents.dvlaCard?.url,
          privateHireCard: form.documents.privateHireCard?.url,
          driverPrivateHirePaper: form.documents.driverPrivateHirePaper?.url,
          privateHireCarPaper: form.documents.privateHireCarPaper?.url,
          insurance: form.documents.insurance?.url,
          motExpiry: form.documents.motExpiry?.url,
          V5: form.documents.V5?.url,
          carPicture: form.documents.carPicture?.url,
        }),
      };

      console.log("DRIVER BODY:", driverBody);

      mutate(accountBody);
      driverUpdateMutate(driverBody);

      setIsEditing(false);
    } catch (error) {
      console.log('error message is here', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );

  useEffect(() => {
    if (user) {
      setForm((prev) => mapUserToForm(user, prev));
    }
  }, [user]);

  useEffect(() => {
    if (data) {

      const mappedData = mapDriverApiToForm(data);

      setForm(prev => ({
        ...prev,
        ...mappedData,

        fullName: user?.fullName || prev.fullName,
        email: user?.email || prev.email,
      }));
    }
  }, [data, user]);

  const imageUri =
    form?.profileImage?.uri || user?.profileImage || null;

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
    // behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.headerIcon}
            onPress={() => navigation.goBack()}
            hitSlop={{ top: 30, bottom: 30, left: 30, right: 30 }}
          >
            <Icons.ArrowLeft size={22} color={colors.white} />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>My Profile</Text>

          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            {!isEditing && (
              <TouchableOpacity style={{ alignItems: 'center' }} activeOpacity={0.7} onPress={() => handleLogout(dispatch, mutateLogout)}>
                < Icons.LogOut size={22} color={colors.error} />
                <Text style={{ fontSize: moderateScale(10), color: colors?.error }}>Logout</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={styles.headerIcon}
              onPress={() => setIsEditing(!isEditing)}
            >
              {isEditing ? (
                <Icons.X size={24} style={{ color: colors?.white }} />
              ) : (
                <Icons.Edit2 size={24} style={{ color: colors?.white }} />
              )}
            </TouchableOpacity>
          </View>
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

                  {isImageUploading && form?.profileImage?.uri && (
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
                  <Icons.User size={40} color={colors.lightBlue} />
                  {isImageUploading && form?.profileImage?.uri && (
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

            {isEditing && (
              <TouchableOpacity
                activeOpacity={0.7}
                style={[
                  styles?.iconWrepper,
                  { opacity: isImageUploading ? 0.5 : 1 },
                ]}
                onPress={() => openCameraOrGallery(isImageUploading, setForm)}
                disabled={isImageUploading}
              >
                <Icons.Camera size={24} color={colors.lightBlue} />
              </TouchableOpacity>
            )}

            <Text style={styles.name}>{user?.fullName || ""}</Text>


            <View style={styles.roleBadge}>
              <Text style={styles.roleText}>
                {user?.role
                  ? user.role.charAt(0).toUpperCase() + user.role.slice(1)
                  : ""}
              </Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Account Info</Text>

            {renderField("Full Name", "fullName")}
            {renderField("Email", "email")}
            {isEditing && renderField("Current Password", "currentPassword")}
          </View>

          {isDriver && (
            <>
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Driver Information</Text>

                <View style={styles.row}>
                  {renderField("First Name", "firstName", true)}
                  {renderField("Surname", "surname", true)}
                </View>

                {renderField("Contact Number", "phone")}

                <View style={styles.row}>
                  {renderField("Date of Birth", "dob", true)}
                  {renderField("NI Number", "niNumber", true)}
                </View>

                {/* {renderField("PH Driver Number", "phid")} */}
                {renderField("Address", "address")}
              </View>
            </>
          )}
          {isDriver && <View style={styles.section}>
            <Text style={styles.sectionTitle}>Vehicle Details</Text>

            <View style={styles.row}>
              {renderField("Registration", "reg", true)}
              {renderField("Colour", "color", true)}
            </View>

            <View style={styles.row}>
              {renderField("Make", "make", true)}
              {renderField("Model", "model", true)}
            </View>

            {renderField("Category", "category")}
          </View>}
          {isDriver && <View style={styles.section}>
            <Text style={styles.sectionTitle}>Driver Documents</Text>

            {getDriverDocuments(data).map((doc) => {
              // Merge form state with API documents to show unsaved uploads
              const mergedDoc = {
                ...doc,
                url: form.documents[doc.field]?.url || doc.url,
                expiry: form.documents[doc.field]?.expiry || doc.expiry,
              };
              return renderDocumentItem(mergedDoc);
            })}
          </View>}
          {isEditing && (
            <View style={[styles.row, { marginHorizontal: moderateScale(16) }]}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setIsEditing(false)}
              >
                <Text style={{ color: colors?.text, textAlign: "center", width: moderateScale(80) }}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.saveBtn}
                onPress={handleSave}
              >
                <Text style={{ color: "white", textAlign: "center", width: moderateScale(80) }}>Save</Text>
              </TouchableOpacity>
            </View>
          )}
          {!isEditing && (
            <View style={{ marginTop: 20, paddingHorizontal: 16 }}>
              <TouchableOpacity
                onPress={() => handleLogout(dispatch, mutateLogout)}
                style={styles.logoutBtn}
              >
                < Icons.LogOut size={22} color={colors.white} />
                <Text style={styles.logoutText}>Logout</Text>
              </TouchableOpacity>
            </View>)}

        </ScrollView>
        <LoaderModal visible={isPending} />

        {showDatePicker && (
          <DateTimePicker
            value={selectedDocumentDate}
            mode="date"
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={handleDatePickerChange}
            minimumDate={new Date(2000, 0, 1)}
            maximumDate={new Date(2070, 11, 31)}
          />
        )}
      </View>
    </KeyboardAvoidingView>
  );
};

export default ProfileScreen;