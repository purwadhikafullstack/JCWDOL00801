import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Axios from "axios";
import { Input, useDisclosure } from "@chakra-ui/react";
import Swal from "sweetalert2";
import { loginAction } from "../actions/userAction";
import { setTenantAction } from "../actions/tenantAction";
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
import * as Yup from "yup";

function EditAccountNumBtn(props) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const dispatch = useDispatch();
  const { tenantId } = useSelector((state) => {
    return {
      tenantId: state.tenantReducer.tenantId,
    };
  });

  const onInputChange = (e) => {
    const { value } = e.target;

    const re = /^[0-9]*$/;
    if (value === "" || re.test(value)) {
      setFieldValue(value);
      handleChange(e);
    }
  };

  const onBtnUpdate = async () => {
    const response = await Axios.patch(process.env.REACT_APP_API_BASE_URL + "/tenant/payment", {
      tenantId: tenantId,
      bankAccountNum: values.accountNum,
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
            setFieldValue("accountNum", "");
            dispatch(loginAction(res.data.result));
            dispatch(setTenantAction(res.data.tenant));
            dispatch(setTenantAction(res.data.tenant.bank));
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
    setFieldValue("accountNum", props.accNum);
  };

  const accountNumSchema = Yup.object().shape({
    accountNum: Yup.string().required("Required"),
  });

  //Formik configuration
  const formName = useFormik({
    initialValues: {
      accountNum: "" || props.accNum,
    },
    validationSchema: accountNumSchema,
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
          <ModalHeader>Update Account Number</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form onSubmit={handleSubmit}>
              <FormControl isInvalid={errors.accountNum ? true : false}>
                <FormLabel>Account Number</FormLabel>
                <Input
                  value={values.accountNum}
                  name="accountNum"
                  onChange={(e) => {
                    onInputChange(e);
                  }}
                  onBlur={handleBlur}
                />
                <FormErrorMessage fontSize="sm" m="auto">
                  {errors.accountNum}
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
                errors.accountNum || values.accountNum === props.accNum || values.accountNum === ""
                  ? true
                  : false
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

export default EditAccountNumBtn;
