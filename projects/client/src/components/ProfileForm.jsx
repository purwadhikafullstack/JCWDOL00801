import React from "react";
import Axios from "axios";
import { Flex, Heading, Text, Divider, Input, Button, FormControl } from "@chakra-ui/react";
import { InputRightElement, InputGroup, FormErrorMessage } from "@chakra-ui/react";
import { AiFillEyeInvisible, AiFillEye } from "react-icons/ai";
import { useFormik } from "formik";
import { profileSchema } from "../schemas/profileValidator";
import Swal from "sweetalert2";
import { useSelector } from "react-redux";
import EditUserNameBtn from "./EditUserNameBtn";
import EditUserDobBtn from "./EditUserDobBtn";
import EditUserGenBtn from "./EditUserGenBtn";
import EditUserEmailBtn from "./EditUserEmailBtn";
import EditBankNameBtn from "./EditBankNameBtn";
import EditAccountNumBtn from "./EditAccountNumBtn";

function ProfileForm(props) {
  const [isLoading, setIsLoading] = React.useState(false);

  const { email, name, gender, dob, provider, role, bankName, bankAccountNum } = useSelector(
    (state) => {
      return {
        email: state.userReducer.email,
        name: state.userReducer.name,
        gender: state.userReducer.gender,
        dob: state.userReducer.dob,
        provider: state.userReducer.provider,
        role: state.userReducer.role,
        bankName: state.tenantReducer.bankName,
        bankAccountNum: state.tenantReducer.bankAccountNum,
      };
    }
  );

  const onBtnUpdatePass = async () => {
    const { oldPass, password, confirmPassword } = values;
    if (oldPass !== "" || password !== "" || confirmPassword !== "") {
      if (provider !== "common") {
        Swal.fire({
          icon: "info",
          title: `Sorry you cant update your password if you login with a ${provider} account`,
          confirmButtonText: "OK",
          confirmButtonColor: "#48BB78",
        });
      } else if (password !== confirmPassword) {
        Swal.fire({
          icon: "error",
          title: `Password and Password Confirmation didn't match`,
          confirmButtonText: "OK",
          confirmButtonColor: "#48BB78",
        });
      } else {
        setIsLoading(true);
        try {
          let response = await Axios.patch(
            process.env.REACT_APP_API_BASE_URL + "/user/change-password",
            { oldPass, password, email: email, provider: email }
          );
          Swal.fire({
            icon: "success",
            title: response.data.message,
            showConfirmButton: false,
            timer: 1500,
          }).then(() => {
            setFieldValue("oldPass", "", false);
            setFieldValue("password", "", false);
            setFieldValue("confirmPassword", "", false);
            window.location.reload();
          });
        } catch (error) {
          console.log(error);
          Swal.fire({
            icon: "error",
            title: error.response.data.message,
            confirmButtonText: "OK",
            confirmButtonColor: "#48BB78",
          }).then(() => {
            setFieldValue("oldPass", "", false);
            setFieldValue("password", "", false);
            setFieldValue("confirmPassword", "", false);
            window.location.reload();
          });
        }
      }
    }
    setIsLoading(false);
  };

  //Formik configuration
  const { values, errors, touched, handleBlur, handleChange, setFieldValue, handleSubmit } =
    useFormik({
      initialValues: {
        name: "",
        email: "",
        gender: "",
        dateOfBirth: "",
        oldPass: "",
        password: "",
        confirmPassword: "",
      },
      validationSchema: profileSchema,
      onSubmit: onBtnUpdatePass,
    });

  const [showOldPass, setShowOldPass] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

  const handleClick = (value) => {
    if (value === 1) {
      setShowOldPass(!showOldPass);
    } else if (value === 2) {
      setShowPassword(!showPassword);
    } else {
      setShowConfirmPassword(!showConfirmPassword);
    }
  };

  return (
    <Flex gap={3} pt={6} direction="column" mb={3} minW="50%">
      <Heading size="md">Profile</Heading>
      <Flex direction="column" gap={8}>
        <Flex direction="row" gap={4}>
          <Text minW="35%">Name</Text>
          <Text>{name}</Text>
          <EditUserNameBtn name={name} />
        </Flex>
        <Flex direction="row" gap={4}>
          <Text minW="35%">Date of Birth</Text>
          <Text>
            {dob === null
              ? `not set yet`
              : new Date(dob).toLocaleDateString("id", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
          </Text>
          <EditUserDobBtn />
        </Flex>
        <Flex direction="row" gap={4}>
          <Text minW="35%">Gender</Text>
          <Text>{gender === null ? `not set yet` : gender}</Text>
          <EditUserGenBtn />
        </Flex>
        <Flex direction="row" gap={4}>
          <Text minW="35%">Email</Text>
          <Text>{email}</Text>
          {provider !== "common" ? null : <EditUserEmailBtn email={email} />}
        </Flex>
      </Flex>

      {role !== "user" ? (
        <>
          <Divider mt="3" mb="2" />
          <Heading mb={3} size="md">
            Bank Information
          </Heading>
          <Flex direction="column" gap={8}>
            <Flex direction="row" gap={4}>
              <Text minW="35%">Bank Name</Text>
              <Text>{bankName === "" ? `not set yet` : bankName}</Text>
              <EditBankNameBtn />
            </Flex>
            <Flex direction="row" gap={4}>
              <Text minW="35%">Account Number</Text>
              <Text>
                {bankAccountNum === "" || bankAccountNum === null ? `not set yet` : bankAccountNum}
              </Text>
              <EditAccountNumBtn accNum={bankAccountNum} />
            </Flex>
          </Flex>
        </>
      ) : null}

      {provider === "common" ? (
        <form onSubmit={handleSubmit}>
          <Divider my="4" />
          <Flex direction="column" gap={4}>
            <Heading size="md">Password</Heading>
            <Flex direction="row" align="center">
              {/* OLD PASSWORD */}
              <Text noOfLines={{ base: 2, md: 1 }} minW="40%">
                Current Password
              </Text>
              <FormControl isInvalid={errors.oldPass && touched.oldPass ? true : false}>
                <InputGroup>
                  <Input
                    type={showOldPass ? "text" : "password"}
                    id="oldPass"
                    value={values.oldPass}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  <InputRightElement width="3.5rem">
                    <Button h="1.75rem" size="sm" onClick={() => handleClick(1)}>
                      {showOldPass ? <AiFillEyeInvisible /> : <AiFillEye />}
                    </Button>
                  </InputRightElement>
                </InputGroup>
                <FormErrorMessage fontSize="xs" m="auto">
                  {errors.oldPass}
                </FormErrorMessage>
              </FormControl>
            </Flex>
            <Flex direction="row" align="center">
              {/* NEW PASSWORD */}
              <Text minW="40%">New Password</Text>
              <FormControl isInvalid={errors.password && touched.password ? true : false}>
                <InputGroup>
                  <Input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    value={values.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  <InputRightElement width="3.5rem">
                    <Button h="1.75rem" size="sm" onClick={() => handleClick(2)}>
                      {showPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
                    </Button>
                  </InputRightElement>
                </InputGroup>
                <FormErrorMessage fontSize="xs" m="auto">
                  {errors.password}
                </FormErrorMessage>
              </FormControl>
            </Flex>
            <Flex direction="row" align="center">
              {/* CONFIRM PASSWORD */}
              <Text minW="40%">Confirm New Password</Text>
              <FormControl
                isInvalid={errors.confirmPassword && touched.confirmPassword ? true : false}
              >
                <InputGroup>
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    value={values.confirmPassword}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  <InputRightElement width="3.5rem">
                    <Button h="1.75rem" size="sm" onClick={() => handleClick(3)}>
                      {showConfirmPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
                    </Button>
                  </InputRightElement>
                </InputGroup>
                <FormErrorMessage fontSize="xs" m="auto">
                  {errors.confirmPassword}
                </FormErrorMessage>
              </FormControl>
            </Flex>
            <Flex justify="end">
              <Button
                isLoading={isLoading}
                onClick={onBtnUpdatePass}
                type="submit"
                colorScheme="green"
                variant="outline"
              >
                Update Password
              </Button>
            </Flex>
          </Flex>
        </form>
      ) : null}
    </Flex>
  );
}

export default ProfileForm;
