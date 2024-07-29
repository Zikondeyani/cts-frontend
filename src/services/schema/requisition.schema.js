import * as yup from "yup";

export const CreateRequisitionSchema = yup.object({
  Name: yup
    .string(),
  MaxStorage: yup
    .number(),
  organisationId: yup
    .number()


});

export const UpdateRequisitionSchema = yup.object({
  Name: yup
  .string(),
MaxStorage: yup
  .number(),
organisationId: yup
  .number()

});



