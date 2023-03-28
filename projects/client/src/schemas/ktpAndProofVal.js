import * as yup from "yup";

const FILE_SIZE = 1000000;
const SUPPORTED_FORMATS = ["image/jpg", "image/jpeg", "image/png"];

export const profilePictureSchema = yup.object().shape({
  image: yup
    .mixed()
    .required("A file is required")
    .test("fileSize", "File size is too large", (value) => value && value.size < FILE_SIZE)
    .test(
      "fileFormat",
      "File extension is not supported",
      (value) => value && SUPPORTED_FORMATS.includes(value.type)
    ),
});
