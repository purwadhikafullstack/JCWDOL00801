import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Axios from "axios";
import { Flex, FormLabel, Input, Spinner, Text, useDisclosure } from "@chakra-ui/react";
import Swal from "sweetalert2";
import { logoutAction } from "../actions/userAction";
import { PinInput, PinInputField } from "@chakra-ui/react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  HStack,
  FormErrorMessage,
} from "@chakra-ui/react";
import { useFormik } from "formik";
import { profileSchema } from "../schemas/profileValidator";
import { useNavigate } from "react-router-dom";
import { tenantLogout } from "../actions/tenantAction";

function EditUserEmailBtn(props) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [otp, setOTP] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [verify, setVerify] = React.useState(false);
  const { email } = useSelector((state) => {
    return {
      email: state.userReducer.email,
    };
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const sendOTP = async () => {
    Swal.fire({
      title: "Are you sure you want to change your email?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#38A169",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
      reverseButtons: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        onOpen();
        setLoading(true);
        try {
          let response = await Axios.post(
            process.env.REACT_APP_API_BASE_URL + "/user/change-email",
            {
              email: props.email,
            }
          );
          if (response.data.success) {
            setLoading(false);
          }
        } catch (error) {
          console.log(error);
          setLoading(false);
          onClose();
        }
      }
    });
  };

  const onBtnVerify = async () => {
    setLoading(true);
    try {
      let response = await Axios.post(process.env.REACT_APP_API_BASE_URL + "/user/verify-email", {
        otp: otp,
        email: email,
      });
      if (response.data.success) {
        setLoading(false);
        setVerify(true);
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
      onClose();
      Swal.fire({
        icon: "error",
        title: error.response.data.message,
        confirmButtonText: "OK",
        confirmButtonColor: "#48BB78",
      }).then(() => {
        resetField();
      });
    }
  };

  const onBtnVerifyNewEmail = async () => {
    onClose();
    Swal.fire({
      title: "Make sure that your email is correct and click Continue",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#38A169",
      cancelButtonColor: "#0069a3",
      cancelButtonText: "Go Back",
      confirmButtonText: "Continue",
      reverseButtons: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        onOpen();
        setLoading(true);
        try {
          let response = await Axios.post(
            process.env.REACT_APP_API_BASE_URL + "/user/change-email",
            {
              email: props.email,
              newEmail: values.newEmail,
            }
          );
          if (response.data.success) {
            setLoading(false);
            setVerify(false);
          }
        } catch (error) {
          console.log(error);
          setLoading(false);
          onClose();
        }
      } else {
        onOpen();
      }
    });
  };

  const onBtnUpdate = async () => {
    setLoading(true);
    const response = await Axios.patch(process.env.REACT_APP_API_BASE_URL + "/user", {
      email: email,
      newEmail: values.newEmail,
    });
    if (response.data.success) {
      onClose();
      setLoading(false);
      Swal.fire({
        icon: "success",
        title: response.data.message,
        showConfirmButton: false,
        timer: 2500,
      }).then(async () => {
        resetField();
        dispatch(logoutAction());
        dispatch(tenantLogout());
        localStorage.removeItem("renthaven1");
        navigate("/signin", { replace: true });
        window.location.reload();
      });
    }
  };

  const onBtnResend = async () => {
    const reqBody =
      values.newEmail !== "" || values.newEmail
        ? { email: props.email, newEmail: values.newEmail }
        : { email: props.email };
    setLoading(true);
    try {
      let response = await Axios.post(
        process.env.REACT_APP_API_BASE_URL + "/user/change-email",
        reqBody
      );
      if (response.data.success) {
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
      onClose();
    }
  };

  const resetField = () => {
    setOTP("");
    setLoading(false);
    setVerify(false);
    setFieldValue("newEmail", "", false);
    onClose();
  };

  const onBtnBack = () => {
    setVerify(true);
  };

  //Formik configuration
  const { values, errors, touched, handleBlur, handleChange, setFieldValue, handleSubmit } =
    useFormik({
      initialValues: {
        newEmail: "",
      },
      validationSchema: profileSchema,
      onSubmit: onBtnUpdate,
    });

  return (
    <Flex align="center">
      <Button size="sm" colorScheme="green" variant="link" onClick={sendOTP}>
        Edit
      </Button>

      <Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={resetField} isCentered>
        <ModalOverlay />
        <ModalContent backgroundColor={loading ? "transparent" : null}>
          {loading ? (
            <ModalBody p={5}>
              <Flex align="center" justify="center" p={5}>
                <Spinner
                  size="xl"
                  emptyColor="gray.200"
                  speed="0.6s"
                  thickness="5px"
                  color="green.400"
                />
              </Flex>
            </ModalBody>
          ) : verify ? (
            <>
              <ModalHeader mt={8} fontSize="2xl" textAlign="center">
                Fill in your new email
              </ModalHeader>
              <ModalCloseButton />
              <ModalBody mt={5}>
                <form onSubmit={handleSubmit}>
                  <FormControl
                    px="10"
                    isInvalid={errors.newEmail && touched.newEmail ? true : false}
                  >
                    <FormLabel>New Email:</FormLabel>
                    <Input
                      type="email"
                      value={values.newEmail}
                      id="newEmail"
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    <FormErrorMessage fontSize="sm" m="auto">
                      {errors.newEmail}
                    </FormErrorMessage>
                  </FormControl>
                </form>
              </ModalBody>
              <ModalFooter mt={5} gap={6}>
                <Button
                  isDisabled={errors.newEmail || values.newEmail === "" ? true : false}
                  type="submit"
                  colorScheme="green"
                  variant="solid"
                  onClick={onBtnVerifyNewEmail}
                >
                  Verify New Email
                </Button>
              </ModalFooter>
            </>
          ) : (
            <>
              <ModalHeader mt={8} fontSize="2xl" textAlign="center">
                {values.newEmail !== "" || values.newEmail
                  ? `A code has been sent to ${values.newEmail}`
                  : `A code has been sent to your email to verify your account`}
              </ModalHeader>
              <ModalCloseButton />
              <ModalBody mt={5}>
                <Text textAlign="center" mb={3}>
                  Please type your code here:
                </Text>
                <Flex align="center" justify="center" direction="column">
                  <HStack>
                    <PinInput
                      otp
                      size="lg"
                      onChange={(e) => {
                        setOTP(e);
                      }}
                    >
                      <PinInputField />
                      <PinInputField />
                      <PinInputField />
                      <PinInputField />
                    </PinInput>
                  </HStack>
                </Flex>
              </ModalBody>
              <ModalFooter mt="10" justifyContent="space-between">
                <Flex justify="center" align="center" gap={1}>
                  <Text fontSize="sm">Didn't receive a code?</Text>
                  <Button size="sm" onClick={onBtnResend} colorScheme="green" variant="link">
                    Resend code
                  </Button>
                </Flex>
                <Flex gap={6} justify="center" align="center">
                  {values.newEmail !== "" || values.newEmail ? (
                    <Button variant="link" onClick={onBtnBack}>
                      Back
                    </Button>
                  ) : null}
                  <Button
                    colorScheme="green"
                    variant="solid"
                    onClick={values.newEmail !== "" || values.newEmail ? onBtnUpdate : onBtnVerify}
                  >
                    Verify
                  </Button>
                </Flex>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </Flex>
  );
}

export default EditUserEmailBtn;
