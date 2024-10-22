import * as yup from "yup";

export const CreateTransporterSchema = yup.object({
  Name: yup
    .string(),
 

});

export const UpdateTransporterSchema = yup.object({
  Name: yup
  .string(),


});



