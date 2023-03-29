import React from "react";
import { useSelector, useDispatch } from "react-redux";
import Axios from "axios";
import { loginAction } from "../actions/userAction";
import { RadioGroup, Radio, HStack, useDisclosure } from "@chakra-ui/react";
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
  FormHelperText,
} from "@chakra-ui/react";
import Swal from "sweetalert2";

function EditUserGenBtn(props) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const dispatch = useDispatch();
  const { gender, email } = useSelector((state) => {
    return {
      gender: state.userReducer.gender,
      email: state.userReducer.email,
    };
  });
  const [editGender, setEditGender] = React.useState("");
  const onBtnUpdate = async () => {
    const response = await Axios.patch(process.env.REACT_APP_API_BASE_URL + "/user", {
      email: email,
      gender: editGender,
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
            setEditGender("");
          }
        } catch (error) {
          console.log(error);
        }
      });
    }
  };
  return (
    <>
      <Button size="sm" colorScheme="green" variant="link" onClick={onOpen}>
        Edit
      </Button>

      <Modal onClose={onClose} isOpen={isOpen} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Change Gender</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl as="fieldset">
              <FormLabel as="legend">Gender</FormLabel>
              <RadioGroup
                onChange={(e) => {
                  setEditGender(e);
                }}
                defaultValue={gender}
              >
                <HStack spacing="24px" justifyContent="center">
                  <Radio colorScheme="green" value="male">
                    Male
                  </Radio>
                  <Radio colorScheme="green" value="female">
                    Female
                  </Radio>
                </HStack>
              </RadioGroup>
            </FormControl>
          </ModalBody>
          <ModalFooter gap={4}>
            <Button variant="link" onClick={onClose}>
              Close
            </Button>
            <Button
              isDisabled={editGender === ""}
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

export default EditUserGenBtn;
