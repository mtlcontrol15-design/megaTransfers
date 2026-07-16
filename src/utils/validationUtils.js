import * as Yup from 'yup';

const today = new Date();

export const validationEmailSchema = Yup.object({
  email: Yup.string()
    .max(30, 'Email must be at most 30 characters')
    .matches(/^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,6}$/, 'Enter a valid email address')
    .required('Email is required'),
});

export const validationLoginSchema = Yup.object({
  email: Yup.string()
    .max(50, 'Email must be at most 50 characters')
    .matches(/^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,6}$/, 'Enter a valid email address')
    .required('Email is required'),

  password: Yup.string()
    .required('Password is required'),
});

export const validationNewPasswordSchema = Yup.object({
  newPassword: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .max(20, 'Password must be at most 20 characters')
    .matches(/^[^\s]*$/, 'Password must not contain spaces')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
    .matches(/\d/, 'Password must contain at least one number')
    .matches(/[!@#$%^&*(),.?":{}|<>]/, 'Password must contain at least one special character')
    .required('New password is required'),

  confirmPassword: Yup.string()
    .oneOf([Yup.ref('newPassword'), null], 'Passwords must match')
    .required('Confirm password is required'),
});

export const validationChangePasswordSchema = Yup.object({
  oldPassword: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .max(20, 'Password must be at most 20 characters')
    .matches(/^[^\s]*$/, 'Password must not contain spaces')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
    .matches(/\d/, 'Password must contain at least one number')
    .matches(/[!@#$%^&*(),.?":{}|<>]/, 'Password must contain at least one special character')
    .required('Old password is required'),

  newPassword: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .max(20, 'Password must be at most 20 characters')
    .matches(/^[^\s]*$/, 'Password must not contain spaces')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
    .matches(/\d/, 'Password must contain at least one number')
    .matches(/[!@#$%^&*(),.?":{}|<>]/, 'Password must contain at least one special character')
    .required('New password is required'),

  confirmPassword: Yup.string()
    .oneOf([Yup.ref('newPassword'), null], 'Passwords must match')
    .required('Confirm password is required'),
});

export const validationSignUpSchema = Yup.object({
  firstName: Yup.string()
    .transform(value => value?.trim())
    .min(1, 'First name must be at least 1 character')
    .max(30, 'First name must be at most 30 characters')
    // .matches(/^[A-Za-z]+(?: [A-Za-z]+)*$/, 'First name must contain letters only')
    .required('First name is required'),

  lastName: Yup.string()
    .transform(value => value?.trim())
    .min(1, 'Last name must be at least 1 character')
    .max(30, 'Last name must be at most 30 characters')
    // .matches(/^[A-Za-z]+(?: [A-Za-z]+)*$/, 'Last name must contain letters only')
    .required('Last name is required'),

  vatNumber: Yup.string().when('role', {
    is: 'corporate',
    then: schema =>
      schema
        .trim()
        .max(10, 'VAT number must be at most 10 characters')
        .required('VAT number is required'),
    otherwise: schema => schema.notRequired(),
  }),

  emailAddress: Yup.string()
    .max(50, 'Email must be at most 50 characters')
    .matches(/^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,6}$/, 'Enter a valid email address')
    .required('Email is required'),

  phoneNumber: Yup.string()
    .matches(/^\+?\d{10,15}$/, 'Enter a valid phone number')
    .required('Mobile phone is required'),

  address: Yup.string().when('role', {
    is: role => role === 'driver' || role === 'corporate',
    then: schema => schema.trim().required('Address is required'),
    otherwise: schema => schema.notRequired(),
  }),

  company: Yup.string().when('role', {
    is: role => role === 'customer' || role === 'corporate',
    then: schema => schema.trim().required('Company is required'),
    otherwise: schema => schema.notRequired(),
  }),

  password: Yup.string().when('isSocialSignUp', {
    is: false,
    then: schema =>
      schema.required('Password is required')
        .min(8, 'Password must be at least 8 characters')
        .max(20, 'Password must be at most 20 characters')
        .matches(/^[^\s]*$/, 'Password must not contain spaces')
        .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
        .matches(/\d/, 'Password must contain at least one number')
        .matches(/[!@#$%^&*(),.?":{}|<>]/, 'Password must contain at least one special character')
        .required('Password is required'),
    otherwise: schema => schema.notRequired(),
  }),

  confirmPassword: Yup.string().when('isSocialSignUp', {
    is: false,
    then: schema =>
      schema
        .oneOf([Yup.ref('password'), null], 'Passwords must match')
        .required('Confirm password is required'),
    otherwise: schema => schema.notRequired(),
  }),

  role: Yup.string().required('Role is required'),
});

export const validationForgotPasswordSchema = Yup.object({
  email: Yup.string()
    .max(50, 'Email must be at most 50 characters')
    .matches(/^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,6}$/, 'Enter a valid email address')
    .required('Email is required'),
});

export const validationForgotPasswordPhoneSchema = Yup.object({
  phone: Yup.string()
    .matches(/^\+?\d{10,15}$/, 'Enter a valid phone number')
    .required('Phone number is required'),
});

export const validationProfileSchemaEdit = Yup.object({
  name: Yup.string()
    .transform(value => value?.trim())
    .min(5, 'Full name must be at least 5 characters')
    .max(50, 'Full name must be at most 50 characters')
    // .matches(/^[A-Za-z]+(?: [A-Za-z]+)*$/, 'Name must contain letters only')
    .required('Full name is required'),
});

export const validationOTPSchema = Yup.object({
  otp: Yup.string()
    .required('OTP is required')
    .matches(/^\d{6}$/, 'OTP must be 6 digits'),
});

export const validationNewBookingSchema = Yup.object({

  name: Yup.string()
    .trim()
    .min(3, "Name must be at least 3 characters")
    .max(50, "Name must be at most 50 characters")
    .required("Passenger name is required"),

  email: Yup.string()
    .email("Invalid email")
    .max(50, "Email must be at most 50 characters")
    .required("Email is required"),

  phone: Yup.string()
    .matches(/^[0-9+ ]+$/, "Invalid phone number")
    .min(8, "Phone number too short")
    .max(14, "Phone number should not be more than 14 characters")
    .required("Phone number is required"),

  pickup: Yup.string()
    .trim()
    .required("Pickup location is required"),

  dropoff: Yup.string()
    .trim()
    .required("Dropoff location is required"),

  date: Yup.string()
    .required("Journey date is required"),

  hour: Yup.string()
    .required("Hour is required"),

  minute: Yup.string()
    .required("Minute is required"),

  vehicle: Yup.object()
    .nullable()
    .required("Please select a vehicle"),
  vehicleExtras: Yup.object()
    .nullable()
    .optional(),
});

const requiredText = (label, max = 80) =>
  Yup.string()
    .transform(value => value?.trim())
    .max(max, `${label} must be at most ${max} characters`)
    .required(`${label} is required`);

const phoneSchema = Yup.string()
  .test('valid-phone', 'Enter a valid contact number', value => {
    const normalized = value?.replace(/[\s-]/g, '') || '';
    return /^\+?\d{10,15}$/.test(normalized);
  })
  .required('Contact number is required');

const emailSchema = Yup.string()
  .max(50, 'Email must be at most 50 characters')
  .matches(/^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,6}$/, 'Enter a valid email address')
  .required('Email is required');

const documentSchema = (label) =>
  Yup.object({
    url: Yup.string().required(`${label} is required`),
    expiry: Yup.mixed().nullable(),
  });

export const registerDriverValidationSchema = Yup.object({
  fullName: requiredText('Full name', 60),
  email: emailSchema,
  password: Yup.string()
    .required('Password is required'),
  firstName: requiredText('First name', 30),
  surname: requiredText('Last name', 30),
  phone: phoneSchema,
  dob: Yup.string()
    .matches(/^\d{2}-\d{2}-\d{4}$/, 'Date of birth must be DD-MM-YYYY')
    .required('Date of birth is required'),
  niNumber: requiredText('NI number', 30),
  address: requiredText('Address', 160),
  employeeNumber: requiredText('Employee number', 30),
  status: requiredText('Status', 30),
  companyId: requiredText('Company ID', 80),
  reg: requiredText('Registration', 30),
  color: requiredText('Colour', 30),
  make: requiredText('Make', 40),
  model: requiredText('Model', 40),
  documents: Yup.object({
    driverPicture: documentSchema('Driver picture'),
    dvlaCard: documentSchema('DVLA card'),
    privateHireCard: documentSchema('Private hire card'),
    driverPrivateHirePaper: documentSchema('Driver private hire paper'),
    privateHireCarPaper: documentSchema('Private hire car paper'),
    insurance: documentSchema('Insurance'),
    motExpiry: documentSchema('MOT expiry'),
    V5: documentSchema('V5'),
    carPicture: documentSchema('Car picture'),
  }),
});