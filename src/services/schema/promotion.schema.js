import * as yup from "yup";
const MAX_FILE_SIZE = 20000000;

export const CreateListingSchema = yup.object({
  name: yup
    .string(),
  description: yup.string(),
 
  short_desc: yup.number(),
  from: yup.string(),

  to: yup.string(),
});

export const UpdateListingSchema = yup.object({
  name: yup
    .string(),
  description: yup.string(),
 
  short_desc: yup.number(),
  from: yup.string(),

  to: yup.string(),
});
