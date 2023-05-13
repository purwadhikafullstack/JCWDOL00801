import Axios from "axios";
import { useEffect, useState } from "react";
import { BsPatchCheckFill } from "react-icons/bs";
import { FaCheckCircle } from "react-icons/fa";
import { useNavigate, useSearchParams } from "react-router-dom";
import Swal from "sweetalert2";
import { format, addHours } from "date-fns";
import { MdCancel } from "react-icons/md";
import { replace, useFormik } from "formik";
import { ktpAndProofVal } from "../schemas/ktpAndProofVal";
import moment from "moment-timezone";

const {
  Box,
  Flex,
  Text,
  Input,
  Button,
  AlertIcon,
  useMediaQuery,
  Alert,
  FormControl,
  FormErrorMessage,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Image,
} = require("@chakra-ui/react");

const PaymentProofPage = (props) => {
  const [data, setData] = useState([]);
  const [isExpired, setIsExpired] = useState(false);
  const [selectedFile, setFile] = useState(null);
  const [selectedImage, setImage] = useState(null);
  const [searchQuery, setSearchQuery] = useSearchParams();
  const navigate = useNavigate();
  const [isMobile] = useMediaQuery("(max-width: 760px)");
  const { isOpen, onOpen, onClose } = useDisclosure()
  const pictureChangeHandler = (e) => {
    setFieldValue("image", e.target.files[0]);
    setFile(e.target.files[0]);
    setImage(URL.createObjectURL(e.target.files[0]));
  };
  const removePreview = () => {
    setFile(null);
    setImage(null);
  };
  const getData = async () => {
    try {
      const getLocalStorage = localStorage.getItem("renthaven1");
      if (getLocalStorage) {
        const res = await Axios.post(
          process.env.REACT_APP_API_BASE_URL + `/transaction/find?id=${searchQuery.get("id")}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${getLocalStorage}`,
            },
          }
        );
        setData(res.data.result[0]);
      } else {
        Swal.fire({
          title: "Please login to continue",
          icon: "error",
          confirmButtonText: "Confirm",
          confirmButtonColor: "#48BB78",
          timer: 3000,
        }).then((res) => {
          navigate("/signin", { replace: true });
          window.scrollTo(0, 0);
          navigate(0);
        });
      }
    } catch (error) {
      if (error.response.status == 401) {
        if(error.response.data.message = "Not Authorized"){
          Swal.fire({
          title: "You are not authorized to see this transaction!",
          icon: "error",
          confirmButtonText: "Confirm",
          confirmButtonColor: "#48BB78",
          timer: 3000,
          }).then(resp =>{
            navigate("/", {replace: true})
          })
        }
        setIsExpired(true);
      }
      setIsExpired(true);
      console.log(error);
    }
  };
  const uploadProofHandler = async () => {
    try {
      let data1 = new FormData();
      data1.append("transactionId", searchQuery.get("id"));
      data1.append("images", selectedFile);
      const getLocalStorage = localStorage.getItem("renthaven1");
      if (getLocalStorage) {
        const response = await Swal.fire({
          title: "Are you sure you want to upload?",
          icon: "info",
          showDenyButton: true,
          denyButtonColor: "red",
          denyButtonText: "Cancel",
          confirmButtonText: "Confirm",
          confirmButtonColor: "#48BB78",
          customClass: {
            confirmButton: "order-2",
            denyButton: "order-1",
          },
        });
        if (response.isConfirmed) {
          const res = await Axios.post(
            process.env.REACT_APP_API_BASE_URL + "/transaction/upload-proof",
            data1,
            {
              headers: {
                Authorization: `Bearer ${getLocalStorage}`,
              },
            }
          );
          Swal.fire({
            title: "Payment proof uploaded",
            icon: "success",
            confirmButtonText: "Confirm",
            confirmButtonColor: "#48BB78",
          }).then((res) => {
            getData()
          });
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
 
  //Formik configuration
  const { values, errors, touched, handleBlur, setFieldValue, handleSubmit } = useFormik({
    initialValues: {
      image: undefined,
    },
    validationSchema: ktpAndProofVal,
    onSubmit: uploadProofHandler,
  });
  useEffect(() => {
    getData();
  }, []);
  return (
    <Box>
      <Flex direction={"column"} alignItems="center">
        <Box
          w={isMobile ? "100%" : "50%"}
          shadow="md"
          display={"flex"}
          flexDirection="column"
          justifyContent={"center"}
          alignItems="center"
          mt="20px"
          mb="20px"
          pl="10px"
          pr="10px"
        >
          {isExpired || (data.payProofImg != null && data.status == "Waiting for payment")? (
            <MdCancel color="red" size={70} style={{ marginTop: "20px", marginBottom: "20px" }} />
          ) : (
            <FaCheckCircle
              color="#48BB78"
              size={70}
              style={{ marginTop: "20px", marginBottom: "20px" }}
            />
          )}
          <Text textAlign={"center"} fontSize="24px" fontWeight={"600"}>
            {isExpired
              ? "Sorry, it seems that you have exceeded payment time limit"
              : data.payProofImg != null && data.status == "Waiting for payment" ? "Uh-oh!" : data.payProofImg != null && data.status != "Waiting for payment" ? "Thank you!":"Thank you for booking our room"}
          </Text>
          <Text textAlign={"center"} fontSize="24px" fontWeight={"600"}>
            {isExpired
              ? "or the hotel has cancelled your booking ID"
              : data.payProofImg != null && data.status == "Waiting for payment" ? "It seems that the tenant rejected your payment proof" : data.payProofImg != null && data.status != "Waiting for payment" ? "You have uploaded the payment proof" : "Please kindly finish your payment to the following bank account"}
          </Text>

          <Text fontSize="20px" fontWeight={"600"}>
            {isExpired ? "" : data.payProofImg != null && data.status == "Waiting for payment" ? "Please kindly reupload your payment proof" : data.payProofImg != null && data.status != "Waiting for payment" ? "Please kindly wait for the hotel to confirm your transaction" : data.bankAccountNum}
          </Text>
          <Text fontSize="20px" fontWeight={"600"}>
            {isExpired ? "" :  data.payProofImg != null && data.status != "Waiting for payment" ? "" : data.bankName}
          </Text>
          <Text fontSize="20px" fontWeight={"600"}>
            {isExpired
              ? ""
              : data.payProofImg != null && data.status != "Waiting for payment" ? "" : parseInt(data.price).toLocaleString("id", { style: "currency", currency: "IDR" })}
          </Text>
          <Text mb={isExpired ? "20px" : ""}>
            {isExpired
              ? ""
              : data.status == "Cancelled" ? "" : data.payProofImg != null && data.status != "Waiting for payment" ? <Button variant={"ghost"} colorScheme="green" onClick={onOpen}>See your payment proof here</Button> : data.payProofImg != null ? <Box textAlign={"center"}> 
              <Button variant={"ghost"} colorScheme="green" onClick={onOpen}>See your payment proof here</Button> 
              <Text>Please upload the payment before {
                  new Date(data.transactionExpired).toLocaleTimeString("EN")}</Text>
              </Box>: `Please upload the payment before ${
                  new Date(data.transactionExpired).toLocaleTimeString("EN")}`}
          </Text>
          {data.payProofImg != null ? <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton/>
          <ModalBody mt={7} mb={5}>
            <Image src={`${process.env.REACT_APP_BASE_IMG_URL}${data.payProofImg}`}/>
          </ModalBody> </ModalContent> </Modal> : ""}
          {isExpired ? (
            ""
          ) : (
            <form onSubmit={handleSubmit} style={{ width: "100%" }}>
              <FormControl
                isInvalid={errors.image && touched.image ? true : false}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  width: "100%",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Input
                  required
                  type="file"
                  _hover={{
                    cursor: "pointer",
                  }}
                  p="0"
                  sx={{
                    "::file-selector-button": {
                      cursor: "pointer",
                      height: 10,
                      padding: 2,
                      mr: 4,
                      border: "none",
                      background: "gray.100",
                      fontSize: "md",
                      fontFamily: "Inter, sans-serif",
                      color: "gray.700",
                    },
                  }}
                  onBlur={handleBlur}
                  onChange={pictureChangeHandler}
                  name="image"
                  w="50%"
                  mt={3.5}
                  mb={3}
                  accept={"image/*"}
                />
                {selectedImage == null ? (
                  ""
                ) : (
                  <Box w="60%">
                    <Flex direction="column">
                      <Flex justifyContent="flex-end">
                        <p onClick={removePreview} style={{ cursor: "pointer" }}>
                          ❌
                        </p>
                      </Flex>
                      <Flex direction="column" justifyContent="center" alignItems="center" mb={6}>
                        <img src={selectedImage} alt="Thumb" width="200px" height="100px" />
                      </Flex>
                    </Flex>
                  </Box>
                )}
                <FormErrorMessage fontSize="sm" mb={"20px"}>
                  {errors.image}
                </FormErrorMessage>
                <Box>
                  <Button
                    isDisabled={errors.image && touched.image ? true : false}
                    variant="solid"
                    colorScheme={"green"}
                    mb="20px"
                    onClick={uploadProofHandler}
                  >
                    Upload
                  </Button>
                </Box>
              </FormControl>
            </form>
          )}
        </Box>
      </Flex>
    </Box>
  );
};

export default PaymentProofPage;
