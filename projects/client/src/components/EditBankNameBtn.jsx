import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Axios from "axios";
import { loginAction } from "../actions/userAction";
import { setTenantAction } from "../actions/tenantAction";
import { useDisclosure } from "@chakra-ui/react";
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
  Select,
} from "@chakra-ui/react";
import Swal from "sweetalert2";

function EditBankNameBtn(props) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const dispatch = useDispatch();
  const [banks, setBanks] = React.useState([]);
  const [selectedBank, setSelectedBank] = React.useState("");
  const { tenantId } = useSelector((state) => {
    return {
      tenantId: state.tenantReducer.tenantId,
    };
  });

  const onBtnUpdate = async () => {
    const response = await Axios.patch(process.env.REACT_APP_API_BASE_URL + "/tenant/payment", {
      tenantId: tenantId,
      bankId: selectedBank,
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
            dispatch(setTenantAction(res.data.tenant));
            dispatch(setTenantAction(res.data.bank.bank));
            localStorage.setItem("renthaven1", res.data.token);
            setSelectedBank("");
          }
        } catch (error) {
          console.log(error);
        }
      });
    }
  };

  const getBankData = async () => {
    try {
      let response = await Axios.get(process.env.REACT_APP_API_BASE_URL + `/payment`);
      setBanks(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getBankData();
  }, []);

  return (
    <>
      <Button size="sm" colorScheme="green" variant="link" onClick={onOpen}>
        Edit
      </Button>

      <Modal onClose={onClose} isOpen={isOpen} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Update Bank Name</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel as="legend">Bank Name</FormLabel>
              <Select
                name="bank"
                value={selectedBank}
                onChange={(e) => setSelectedBank(e.target.value)}
                placeholder="Select Bank"
              >
                {banks.map((bank, idx) => {
                  return (
                    <option value={bank.bankId} key={idx}>
                      {bank.bankName}
                    </option>
                  );
                })}
              </Select>
            </FormControl>
          </ModalBody>
          <ModalFooter gap={4}>
            <Button variant="link" onClick={onClose}>
              Close
            </Button>
            <Button
              isDisabled={selectedBank === ""}
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

export default EditBankNameBtn;
