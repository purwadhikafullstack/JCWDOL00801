import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Axios from "axios";
import { Input, useDisclosure } from "@chakra-ui/react";
import Swal from "sweetalert2";
import { loginAction } from "../actions/userAction";
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
  FormLabel,
  FormErrorMessage,
} from "@chakra-ui/react";
import { useFormik } from "formik";
import { profileSchema } from "../schemas/profileValidator";

function EditUserNameBtn(props) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const dispatch = useDispatch();
  const { email } = useSelector((state) => {
    return {
      email: state.userReducer.email,
    };
  });

  const onInputChange = (e) => {
    const { value } = e.target;

    const re = /^[A-Za-z ]+$/;
    if (value === "" || re.test(value)) {
      setFieldValue(value);
      handleChange(e);
    }
  };

  const onBtnUpdate = async () => {
    const response = await Axios.patch(process.env.REACT_APP_API_BASE_URL + "/user", {
      email: email,
      name: values.name,
    });
    if (response.data.success) {
      onClose();
      Swal.fire({
        icon: "success",
        title: response.data.message,
        showConfirmButton: false,
        timer: 1500,
      }).then(async () => {
        try {
          let getLocalStorage = localStorage.getItem("renthaven1");
          if (getLocalStorage) {
            let res = await Axios.post(
              process.env.REACT_APP_API_BASE_URL + `/signin/keep-login`,
              {},
              {
                headers: {
                  Authorization: `Bearer ${getLocalStorage}`,
                },
              }
            );
            dispatch(loginAction(res.data.result));
            localStorage.setItem("renthaven1", res.data.token);
          }
        } catch (error) {
          console.log(error);
        }
      });
    }
  };

  const resetField = () => {
    onClose();
    setFieldValue("name", props.name);
  };

  //Formik configuration
  const formName = useFormik({
    initialValues: {
      name: "" || props.name,
    },
    validationSchema: profileSchema,
    enableReinitialize: true,
    onSubmit: onBtnUpdate,
  });

  const { values, errors, touched, handleBlur, handleChange, setFieldValue, handleSubmit } =
    formName;

  return (
    <>
      <Button size="sm" colorScheme="green" variant="link" onClick={onOpen}>
        Edit
      </Button>

      <Modal onClose={resetField} isOpen={isOpen} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Change Name</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form onSubmit={handleSubmit}>
              <FormControl isInvalid={errors.name && touched.name ? true : false}>
                <FormLabel>Name</FormLabel>
                <Input
                  value={values.name}
                  id="name"
                  onChange={(e) => {
                    onInputChange(e);
                  }}
                  onBlur={handleBlur}
                />
                <FormErrorMessage fontSize="sm" m="auto">
                  {errors.name}
                </FormErrorMessage>
              </FormControl>
            </form>
          </ModalBody>
          <ModalFooter gap={4}>
            <Button variant="link" onClick={resetField}>
              Close
            </Button>
            <Button
              isDisabled={
                errors.name || values.name === props.name || values.name === "" ? true : false
              }
              colorScheme="green"
              variant="solid"
              onClick={onBtnUpdate}
              type="submit"
            >
              Update
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default EditUserNameBtn;
