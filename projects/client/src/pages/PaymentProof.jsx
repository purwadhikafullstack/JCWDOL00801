import Axios from "axios";
import { useEffect, useState } from "react";
import { BsPatchCheckFill } from "react-icons/bs";
import { FaCheckCircle } from "react-icons/fa";
import { useNavigate, useSearchParams } from "react-router-dom";
import Swal from "sweetalert2";
import { format, addHours } from "date-fns";
import { MdCancel } from "react-icons/md";

const {
  Box,
  Flex,
  Text,
  Input,
  Button,
  AlertIcon,
  useMediaQuery,
  Alert,
} = require("@chakra-ui/react");

const PaymentProofPage = (props) => {
  const [data, setData] = useState([]);
  const [isExpired, setIsExpired] = useState(false);
  const [selectedFile, setFile] = useState(null);
  const [selectedImage, setImage] = useState(null);
  const [searchQuery, setSearchQuery] = useSearchParams();
  const navigate = useNavigate();
  const [isMobile] = useMediaQuery("(max-width: 760px)");
  const pictureChangeHandler = (e) => {
    setFile(e.target.files[0]);
    setImage(URL.createObjectURL(e.target.files[0]));
  };
  const removePreview = () => {
    setFile(null);
    setImage(null);
  };
  const uploadProofHandler = async () => {
    try {
      let data1 = new FormData();
      data1.append("transactionId", searchQuery.get("id"));
      data1.append("images", selectedFile);
      const getLocalStorage = localStorage.getItem("renthaven1");
      if (getLocalStorage) {
        const res = await Axios.post(
          process.env.REACT_APP_API_BASE_URL + "/transaction/upload-proof",data1,
          {
            headers: {
              Authorization: `Bearer ${getLocalStorage}`,
            },
          }
        );
        console.log(res.data)
        Swal.fire({
          title: "Payment proof uploaded",
          icon: "success",
          confirmButtonText: "Confirm",
          confirmButtonColor: "#48BB78",
        });
      }
    } catch (error) {
      console.log(error);
    }
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
        setIsExpired(true);
      }
      console.log(error);
    }
  };
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
          {isExpired ? (
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
              : "Thank you for booking our room"}
          </Text>
          <Text textAlign={"center"} fontSize="24px" fontWeight={"600"}>
            {isExpired
              ? "or the hotel has cancelled your booking ID"
              : "Please kindly finish your payment to the following bank account"}
          </Text>

          <Text fontSize="20px" fontWeight={"600"}>
            {isExpired ? "" : data.bankAccountNum}
          </Text>
          <Text fontSize="20px" fontWeight={"600"}>
            {isExpired ? "" : data.bankName}
          </Text>
          <Text fontSize="20px" fontWeight={"600"}>
            {isExpired
              ? ""
              : parseInt(data.price).toLocaleString("id", { style: "currency", currency: "IDR" })}
          </Text>
          <Text mb={isExpired ? "20px" : ""}>
            {isExpired
              ? ""
              : `Please upload the payment before ${new Date(
                  data.transactionExpired
                ).toLocaleTimeString("EN")}`}
          </Text>
          {isExpired ? (
            ""
          ) : (
            <>
              <Input
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
                onChange={pictureChangeHandler}
                name="image"
                w="50%"
                mt={3.5}
                mb={3.5}
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
              <Button variant="solid" colorScheme={"green"} mb="20px" onClick={uploadProofHandler}>
                Upload
              </Button>
            </>
          )}
        </Box>
      </Flex>
    </Box>
  );
};

export default PaymentProofPage;
