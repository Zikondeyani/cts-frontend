import * as yup from "yup";
const MAX_FILE_SIZE = 20000000;

export const CreateListingSchema = yup.object({
  name: yup
    .string(),
  description: yup.string(),
  location: yup.string().url(),

  price: yup.number(),
  location_details: yup.string().url(),

  status: yup.bool().default(false),
});

export const UpdateListingSchema = yup.object({
  name: yup
    .string(),
  description: yup.string(),
  location: yup.string(),
  price: yup.number(),
  location_details: yup.string(),

  status: yup.bool().default(false),
});
