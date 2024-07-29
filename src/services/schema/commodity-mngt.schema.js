import * as yup from "yup";

export const CreateUserSchema = yup.object({
  Name: yup
    .string(),
  Unit: yup
    .string(),
  PackSize: yup
    .string(),
  CommodityTypeId: yup
    .string()
});

export const UpdateUserSchema = yup.object({
  Name: yup
    .string(),
  Unit: yup
    .string(),
  PackSize: yup
    .string(),
  CommodityTypeId: yup
    .string()
});
