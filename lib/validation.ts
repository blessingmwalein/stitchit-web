import * as yup from 'yup';

export const orderSchema = yup.object().shape({
  customerName: yup
    .string()
    .required('Name is required')
    .min(2, 'Name must be at least 2 characters'),
  email: yup
    .string()
    .required('Email is required')
    .email('Invalid email address'),
  phone: yup
    .string()
    .required('Phone number is required')
    .matches(/^[\d\s\+\-\(\)]+$/, 'Invalid phone number'),
  address: yup
    .string()
    .required('Address is required')
    .min(10, 'Please provide a complete address'),
  city: yup
    .string()
    .required('City is required'),
  notes: yup.string(),
});

export const loginSchema = yup.object().shape({
  login: yup
    .string()
    .required('Phone or email is required'),
  password: yup
    .string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters'),
});

export const signupSchema = yup.object().shape({
  full_name: yup
    .string()
    .required('Full name is required')
    .max(255, 'Full name must be at most 255 characters'),
  phone: yup
    .string()
    .required('Phone number is required')
    .max(20, 'Phone number must be at most 20 characters'),
  email: yup
    .string()
    .nullable()
    .notRequired()
    .email('Invalid email address'),
  address: yup
    .string()
    .nullable()
    .notRequired(),
  gender: yup
    .mixed<'male' | 'female' | 'other'>()
    .oneOf(['male', 'female', 'other'])
    .nullable()
    .notRequired(),
  password: yup
    .string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters'),
  password_confirmation: yup
    .string()
    .required('Please confirm your password')
    .oneOf([yup.ref('password')], 'Passwords must match'),
});

export const googleCompleteRegistrationSchema = yup.object().shape({
  google_id: yup.string().required('google_id is required'),
  email: yup.string().required('Email is required').email('Invalid email address'),
  full_name: yup.string().required('Full name is required').max(255, 'Full name must be at most 255 characters'),
  avatar: yup.string().nullable().notRequired(),
  phone: yup.string().required('Phone number is required').max(20, 'Phone number must be at most 20 characters'),
  username: yup.string().nullable().notRequired().max(255, 'Username must be at most 255 characters'),
  address: yup.string().nullable().notRequired(),
  gender: yup
    .mixed<'male' | 'female' | 'other'>()
    .oneOf(['male', 'female', 'other'])
    .nullable()
    .notRequired(),
});

export const checkoutSchema = yup.object().shape({
  cardName: yup
    .string()
    .required('Cardholder name is required'),
  cardNumber: yup
    .string()
    .required('Card number is required')
    .matches(/^\d{16}$/, 'Card number must be 16 digits'),
  expiryDate: yup
    .string()
    .required('Expiry date is required')
    .matches(/^(0[1-9]|1[0-2])\/\d{2}$/, 'Format: MM/YY'),
  cvv: yup
    .string()
    .required('CVV is required')
    .matches(/^\d{3,4}$/, 'CVV must be 3 or 4 digits'),
});
