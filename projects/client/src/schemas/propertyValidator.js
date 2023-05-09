import * as yup from "yup";

const FILE_SIZE = 1000000;
const SUPPORTED_FORMATS = ["image/jpg", "image/jpeg", "image/png"];

export const propertySchema = yup.object().shape({
  image: yup
    .mixed()
    .required("A file is required")
    .test("fileSize", "File size is too large", (value) => value && value.size < FILE_SIZE)
    .test(
      "fileFormat",
      "File extension is not supported",
      (value) => value && SUPPORTED_FORMATS.includes(value.type)
    ),
  name: yup.string().required("Please input property name"),
  address: yup.string().required("Please input an address"),
  phone: yup
    .string()
    .matches(/^[\d +]+$/, { message: "Please input the valid phone number" })
    .required("Please input your phone number"),
  description: yup.string(),
  city: yup.string().required("Required"),
});
