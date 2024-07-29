import * as yup from "yup";
const MAX_FILE_SIZE = 1000000;

export const CreateBookingSchema = yup.object({
  bookingFrom: yup.date()
  .required("field is required"),
  bookingTo: yup.string()
  .required("field is required"),
  servicetype: yup.number()
  .required("field is required"),
  firstname: yup.string(),
  lastname: yup.string(),
  phone: yup
  .string().matches(
    /^(\+\d{1,2}\s?)?1?\-?\.?\s?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/,
    {
        message: "invalid phone number",
        excludeEmptyString: false,
    }
)
.required(),
  email: yup.string().email("enter valid email"),
  country: yup.string(),
  otherinfo: yup.string(),

  status: yup.string(),
});

export const UpdateBookingSchema = yup.object({
  bookingFrom: yup.string()
  .required("field is required"),
  bookingTo: yup.string()
  .required("field is required"),
  servicetype: yup.number()
  .required("field is required"),
  firstname: yup.string(),
  lastname: yup.string(),
  phone: yup
  .string().matches(
    /^(\+\d{1,2}\s?)?1?\-?\.?\s?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/,
    {
        message: "invalid phone number",
        excludeEmptyString: false,
    }
)
.required(),
  email: yup.string().email("enter valid email"),
  country: yup.string(),
  otherinfo: yup.string(),

  status: yup.string(),
});
