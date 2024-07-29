import * as yup from "yup";

export const CreateWarehouseSchema = yup.object({
  Name: yup
    .string(),
  districtId: yup
    .number(),
  MaxStorage: yup
    .number(),
  organisationId: yup
    .number()


});

export const UpdateWarehouseSchema = yup.object({
  Name: yup
  .string(),
districtId: yup
  .number(),
MaxStorage: yup
  .number(),
organisationId: yup
  .number()

});



