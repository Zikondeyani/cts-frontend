import * as yup from "yup";

export const CreateInventorySchema = yup.object({
  Quantity: yup
    .number(),
  ExpiryDate: yup
    .string(),
    BatchNumber: yup
    .string(),
  commodityId: yup
    .string(),
  warehouseId: yup
    .string(),
  userId: yup
    .string()
});

export const UpdateInventorySchema = yup.object({
  Quantity: yup
    .number(),
  ExpiryDate: yup
    .string(),
    BatchNumber: yup
    .string(),
  commodityId: yup
    .string(),
  warehouseId: yup
    .string(),
  userId: yup
    .string()
});
