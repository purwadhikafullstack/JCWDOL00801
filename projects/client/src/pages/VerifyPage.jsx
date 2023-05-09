import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  FormControl,
  FormHelperText,
  Heading,
  Input,
} from "@chakra-ui/react";
import { useFormik } from "formik";
import { useSelector } from "react-redux";
import * as yup from "yup";
import Axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const VerifyPage = (props) => {
  const navigate = useNavigate();

  const sendOtpHandler = async () => {
    try {
      let getLocalStorage = localStorage.getItem("renthaven1");

      if (getLocalStorage) {
        let res = await Axios.post(
          process.env.REACT_APP_API_BASE_URL + "/sendotp",
          {},
          { headers: { Authorization: `Bearer ${getLocalStorage}` } }
        );

        if (res.data.success) {
          Swal.fire({
            title: `${res.data.message}`,
            icon: "success",
            confirmButtonText: "Confirm",
            confirmButtonColor: "#48BB78",
          });
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  const validationHandler = async () => {
    //validation func here
    try {
      let getLocalStorage = localStorage.getItem("renthaven1");

      if (getLocalStorage) {
        let res = await Axios.post(
          process.env.REACT_APP_API_BASE_URL + "/verify",
          {
            otp: values.otp,
            phone: values.phone,
          },
          { headers: { Authorization: `Bearer ${getLocalStorage}` } }
        );

        if (res.data.success) {
          Swal.fire({
            title: `${res.data.message}`,
            icon: "success",
            confirmButtonText: "Confirm",
            confirmButtonColor: "#48BB78",
          }).then((result) =>
            setTimeout(() => {
              navigate("/", { replace: true });
              window.location.reload();
            }, 500)
          );
        }
      }
    } catch (error) {
      Swal.fire({
        title: `${error.response.data.message}`,
        icon: "error",
        confirmButtonText: "Confirm",
        confirmButtonColor: "#48BB78",
      });
      console.log(error);
    }
  };

  const { provider, email } = useSelector((state) => {
    return {
      provider: state.userReducer.provider,
      email: state.userReducer.email,
    };
  });

  const phoneRule = yup.object().shape({
    phone:
      provider === "common"
        ? yup.string()
        : yup
            .string()
            .matches(/^[\d +]+$/, {
              message: "Please input the valid phone number",
            })
            .required("Please input your phone number"),
    otp: provider === "google.com" ? yup.string() : yup.string().required("Please input your OTP"),
    emails:
      email === "" && provider === "facebook.com"
        ? yup
            .string()
            .email("Please input the correct email")
            .required("Please input your email here")
        : yup.string(),
  });

  const { values, errors, touched, handleBlur, handleChange, setFieldValue, handleSubmit } =
    useFormik({
      initialValues: {
        phone: "",
        otp: "",
        emails: ""
      },
      validationSchema: phoneRule,
      onSubmit: validationHandler,
    });
  return (
    <Box>
      <Flex justifyContent="center" alignItems="center" minW={"30%"}>
        <Box border={"1px"} p={"6"} my={"50"} borderColor={"#ccc"} rounded={"md"}>
          <Box textAlign={"center"} mb={"8"}>
            <Heading>Verify Your Account</Heading>
          </Box>
          <form onSubmit={handleSubmit}>
            <FormControl isRequired mb={"6"}>
              
              {provider !== "common" && provider !== "google.com" ? (
                <div id="fb">
                  {provider === "facebook.com" && email === "" ? <>
                    <p>Email: </p>
                    <Input isInvalid={errors.emails && touched.emails ? true : false}
                    id="emails"
                    value={values.emails}
                    onChange={handleChange}
                    onBlur={handleBlur}/>
                  </>:""}
                  <p>Phone:</p>
                  <Input
                    isInvalid={errors.phone && touched.phone ? true : false}
                    id="phone"
                    value={values.phone}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  {errors.phone && touched.phone ? (
                    <p style={{ color: "red", marginBottom: "5px" }}>{errors.phone}</p>
                  ) : (
                    ""
                  )}

                  <p>OTP:</p>
                  <Input
                    isInvalid={errors.otp && touched.otp ? true : false}
                    id="otp"
                    value={values.otp}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </div>
              ) : provider === "google.com" ? (
                <div id="google.com">
                  <p>Phone:</p>
                  <Input
                    isInvalid={errors.phone && touched.phone ? true : false}
                    id="phone"
                    value={values.phone}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  {errors.phone && touched.phone ? (
                    <p style={{ color: "red", marginBottom: "5px" }}>{errors.phone}</p>
                  ) : (
                    ""
                  )}
                </div>
              ) : (
                <div id="common">
                  <p>OTP:</p>
                  <Input
                    isInvalid={errors.otp && touched.otp ? true : false}
                    id="otp"
                    value={values.otp}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </div>
              )}

              {/* <p>Phone:</p>
              <Input
                isInvalid={errors.phone && touched.phone ? true : false}
                id="phone"
                value={values.phone}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {errors.phone && touched.phone ? (
                <p style={{ color: "red", marginBottom: "5px" }}>
                  {errors.phone}
                </p>
              ) : (
                ""
              )}

              <p>OTP:</p>
              <Input
                isInvalid={errors.otp && touched.otp ? true : false}
                id="otp"
                value={values.otp}
                onChange={handleChange}
                onBlur={handleBlur}
              /> */}

              {provider === "google.com" ? null : (
                <FormHelperText>
                  Have not receive your OTP?
                  <Button
                    type="button"
                    colorScheme={"green"}
                    variant={"link"}
                    size={"xs"}
                    onClick={sendOtpHandler}
                    ms={"1"}
                  >
                    Send OTP
                  </Button>
                </FormHelperText>
              )}
            </FormControl>
            {provider === "google.com" ? (
              <div id="button-google">
                <Button type="submit" onSubmit={handleSubmit}>
                  Submit
                </Button>
              </div>
            ) : (
              <Flex justifyContent={"end"}>
                <ButtonGroup>
                  <Button colorScheme={"green"} type="submit" onSubmit={handleSubmit}>
                    Verify
                  </Button>
                </ButtonGroup>
              </Flex>
            )}
          </form>
        </Box>
      </Flex>
    </Box>
  );
};

export default VerifyPage;
