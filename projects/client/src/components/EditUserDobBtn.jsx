import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Axios from "axios";
import { Select, Input, useDisclosure } from "@chakra-ui/react";
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
} from "@chakra-ui/react";
import Swal from "sweetalert2";
import { loginAction } from "../actions/userAction";
import CalendarDate from "./CalendarDate";
import { clearDobAction } from "../actions/dateAction";
import { setTenantAction } from "../actions/tenantAction";

function EditUserDobBtn(props) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const dispatch = useDispatch();
  const { email, dob } = useSelector((state) => {
    return {
      email: state.userReducer.email,
      dob: state.dateReducer.dob,
    };
  });

  const onBtnUpdate = async () => {
    const response = await Axios.patch(process.env.REACT_APP_API_BASE_URL + "/user", {
      email: email,
      dob: dob,
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
            if (res.data.tenant) {
              dispatch(setTenantAction(res.data.tenant));
              dispatch(setTenantAction(res.data.bank));
            }
            dispatch(loginAction(res.data.user));
            localStorage.setItem("renthaven1", res.data.token);
            dispatch(clearDobAction());
          }
        } catch (error) {
          console.log(error);
          dispatch(clearDobAction());
        }
      });
    }
  };
  return (
    <>
      <Button size="sm" colorScheme="green" variant="link" onClick={onOpen}>
        Edit
      </Button>

      <Modal closeOnOverlayClick={false} onClose={onClose} isOpen={isOpen} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Change Date of Birth</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>Date</FormLabel>
              <CalendarDate />
            </FormControl>
          </ModalBody>
          <ModalFooter gap={4}>
            <Button variant="link" onClick={onClose}>
              Close
            </Button>
            <Button
              isDisabled={dob === "" ? true : false}
              colorScheme="green"
              variant="solid"
              onClick={onBtnUpdate}
            >
              Update
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default EditUserDobBtn;
