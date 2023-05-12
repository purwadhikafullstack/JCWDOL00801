import {
    Box,
    Flex,
    Input,
    Button,
    InputGroup,
    InputRightElement,
    FormControl,
    FormLabel,
    FormErrorMessage,
    Heading,
  } from "@chakra-ui/react";
  import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
  import React, { useEffect, useState } from "react";
  import { useFormik } from "formik";
  import { profileSchema } from "../schemas/profileValidator";
  import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
  import Axios from "axios";
  import Swal from "sweetalert2";
  
  const InputResetPassword = (props) => {
    const [show, setShow] = useState(false);
    const handleClick = () => setShow(!show);
    const location = useLocation();
    const navigate = useNavigate();
    const currentPath = window.location.pathname;
    const [searchQuery, setSearchQuery] = useSearchParams();
    const submitHandler = async () => {
      try {
        let token = location.search.split("=")[1];
  
        let { data } = await Axios.patch(
          process.env.REACT_APP_API_BASE_URL + "/user/reset-password",
          { password: values.password, confirmPassword: values.confirmPassword },
          { headers: { Authorization: `Bearer ${token}` } }
        );
  
        if (data.success) {
          Swal.fire({
            title: `${data.message}`,
            icon: "success",
            confirmButtonText: "Confirm",
            confirmButtonColor: "#48BB78",
          });
          setTimeout(() => {
            navigate("/signin", { replace: true });
          }, 1000);
        }
      } catch (error) {
        console.log(error);
        Swal.fire({
          title: `${error.response.data.message}`,
          icon: "warning",
          confirmButtonText: "Confirm",
          confirmButtonColor: "#48BB78",
        });
      }
    };
  
    const { errors, values, touched, handleBlur, handleChange, handleSubmit } =
      useFormik({
        initialValues: {
          password: "",
          confirmPassword: "",
        },
        validationSchema: profileSchema,
        onSubmit: submitHandler,
      });
  useEffect(() => {
    if(!searchQuery.get("t")){
        navigate("/", {replace: true})
    }
  }, [])
    return (
      <>
        <Box>
          <Flex justifyContent={"center"} alignItems={"center"}>
            <Box
              border={"1px"}
              p={"6"}
              my={"50"}
              borderColor={"#ccc"}
              rounded={"md"}
            >
              <Box>
                <Heading textAlign={"center"} mb={"8"}>
                  Input new password
                </Heading>
              </Box>
              <form onSubmit={handleSubmit}>
                <FormControl
                  isInvalid={errors.password && touched.password ? true : false}
                >
                  <FormLabel>New password</FormLabel>
                  <InputGroup size="md" style={{ marginTop: "5px" }}>
                    <Input
                      id="password"
                      value={values.password}
                      type={show ? "text" : "password"}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    <InputRightElement width="3.5rem">
                      <Button h="1.75rem" size="sm" onClick={handleClick}>
                        {show ? <AiFillEyeInvisible /> : <AiFillEye />}
                      </Button>
                    </InputRightElement>
                  </InputGroup>
                  <FormErrorMessage>{errors.password}</FormErrorMessage>
                </FormControl>
  
                <FormControl
                  isInvalid={
                    errors.confirmPassword && touched.confirmPassword
                      ? true
                      : false
                  }
                >
                  <FormLabel>Confirm new password</FormLabel>
                  <InputGroup size="md" style={{ marginTop: "5px" }}>
                    <Input
                      id="confirmPassword"
                      value={values.confirmPassword}
                      type={show ? "text" : "password"}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    <InputRightElement width="3.5rem">
                      <Button h="1.75rem" size="sm" onClick={handleClick}>
                        {show ? <AiFillEyeInvisible /> : <AiFillEye />}
                      </Button>
                    </InputRightElement>
                  </InputGroup>
                  <FormErrorMessage>{errors.confirmPassword}</FormErrorMessage>
                </FormControl>
  
                <Flex justifyContent={"end"} my={"5"}>
                  <Button
                    type="submit"
                    onClick={submitHandler}
                    colorScheme={"green"}
                  >
                    Submit
                  </Button>
                </Flex>
              </form>
            </Box>
          </Flex>
        </Box>
      </>
    );
  };
  
  export default InputResetPassword;