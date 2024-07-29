import * as yup from "yup";

export const CreateUserSchema = yup.object({
  Name: yup
    .string(),
  ContactPerson: yup
    .string(),
  PhoneNumber: yup
    .string()
    .matches(
      /^(\+\d{1,2}\s?)?1?\-?\.?\s?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/,
      {
        message: "invalid phone number",
        excludeEmptyString: false,
      }
    )
    .required()

});

export const UpdateUserSchema = yup.object({
  Name: yup
    .string(),
  ContactPerson: yup
    .string(),
  PhoneNumber: yup
    .string()
    .matches(
      /^(\+\d{1,2}\s?)?1?\-?\.?\s?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/,
      {
        message: "invalid phone number",
        excludeEmptyString: false,
      }
    )
    .required()
});
