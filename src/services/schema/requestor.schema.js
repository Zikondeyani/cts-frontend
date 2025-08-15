import * as yup from "yup";

export const CreateRequestorSchema = yup.object({
  Name: yup
    .string(),
 

});

export const UpdateRequestorSchema = yup.object({
  Name: yup
  .string(),


});



