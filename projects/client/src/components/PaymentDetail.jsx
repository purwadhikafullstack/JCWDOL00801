import Axios from "axios";
import { Box, Button, Flex, useUnmountEffect } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import BookingDetail from "./BookingDetail";
import GuestBookingForm from "./GuestBookingForm";
import PaymentMethod from "./PaymentMethod";
import SpecialReq from "./SpecialReqForm";
import { clearAllDate, clearDobAction } from "../actions/dateAction";
import Swal from "sweetalert2";

const PaymentDetail = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const [totalGuest, setTotalGuest] = useState(1);
  const [bankAccountNum, setAccountNum] = useState("");
  const [bankId, setBankId] = useState(0);
  const [specialRequest, setSpecialReq] = useState({
    specialReq: [],
  });
  const [price, setPrice] = useState(0);
  const [otherCheck, setOtherCheck] = useState("");
  const othercheckHandle = (e) => {
    setOtherCheck(e.target.value);
    console.log(otherCheck);
  };
  const setBankIdHandler = (e) => {
    const currentChoice = e.target.value.split(",");
    setBankId(parseInt(currentChoice[0]));
    setAccountNum(currentChoice[1]);
    console.log(currentChoice);
    console.log(parseInt(currentChoice[0]));
  };
  const handleChange = (e) => {
    const { value, checked } = e.target;
    const { specialReq } = specialRequest;
    console.log(`${value} is ${checked}`);
    if (checked) {
      setSpecialReq({
        specialReq: [...specialReq, value],
      });
      console.log(specialRequest.specialReq.join(", ") + " and " + otherCheck);
    } else {
      setSpecialReq({
        specialReq: specialReq.filter((e) => e !== value),
      });
      console.log(specialRequest.specialReq.join(", ") + " and " + otherCheck);
    }
  };
  const [searchQuery, setSearchQuery] = useSearchParams();
  const [data, setData] = useState([]);
  const { name, gender, email, phone, startDate, endDate } = useSelector((state) => {
    return {
      name: state.userReducer.name,
      gender: state.userReducer.gender,
      email: state.userReducer.email,
      phone: state.userReducer.phone,
      startDate: state.dateReducer.startDate,
      endDate: state.dateReducer.endDate,
    };
  });
  const getData = async () => {
    try {
      const res = await Axios.post(
        process.env.REACT_APP_API_BASE_URL + `/transaction-detail?id=${searchQuery.get("id")}`,
        {
          typeId: location.state.typeId,
        }
      );
      console.log(res.data.result[0]);
      setData(res.data.result[0]);
      setPrice(res.data.result[0].price);
    } catch (error) {
      console.log(error);
    }
  };
  const setTotalGuestHandler = (e) => {
    setTotalGuest(e);
  };
  const createPaymentHandler = async () => {
    try {
      const getLocalStorage = localStorage.getItem("renthaven1");
      if (getLocalStorage) {
        Swal.fire({
          title: "Are you sure you want to continue?",
          icon: "info",
          showDenyButton: true,
          denyButtonColor: "red",
          denyButtonText: "Cancel",
          confirmButtonText: "Continue to payment",
          confirmButtonColor: "#48BB78",
          customClass:{
            confirmButton: "order-2",
            denyButton: "order-1"
          }
        }).then((response) => {
          if (response.isConfirmed) {
            Axios.post(
              process.env.REACT_APP_API_BASE_URL + "/transaction-new",
              {
                specialReq: specialRequest.specialReq.join(", ") + " and " + otherCheck,
                totalGuest,
                checkinDate: startDate,
                checkoutDate: endDate,
                price,
                bankId,
                bankAccountNum,
                propertyId: searchQuery.get("id"),
              },
              {
                headers: {
                  Authorization: `Bearer ${getLocalStorage}`,
                },
              }
            )
              .then((res) => {
                Swal.fire({
                  title: "Payment Created",
                  icon: "success",
                  confirmButtonText: "Confirm",
                  confirmButtonColor: "#48BB78",
                }).then(r =>{
                  navigate(`/payment-proof?id=${res.data.result.transactionId}`, {replace: true})
                  window.scrollTo(0,0)
                  navigate(0);
                })
              })
              .catch((e) => {
                console.log(e);
                Swal.fire({
                  title: e.response.data.message,
                  icon: "error",
                  confirmButtonText: "Confirm",
                  confirmButtonColor: "#48BB78",
                });
              });
          }
        });
      }
    } catch (error) {
      console.log(error);
      Swal.fire({
        title: error.response.data.message,
        icon: "error",
        confirmButtonText: "Confirm",
        confirmButtonColor: "#48BB78",
      });
    }
  };

  useEffect(() => {
    if(location.state === undefined ||location.state === null || location.state === ""){
      return Swal.fire({
        title: "Please select the type room",
        icon: "error",
        confirmButtonText: "Confirm",
        confirmButtonColor: "#48BB78",
      }).then(res =>{
        navigate(`/`, {replace: true})
        window.scrollTo(0,0)
        navigate(0)
      })
    }
    getData();
    return () => {
      dispatch(clearAllDate());
    };
  }, []);
  return (
    <Box style={{ padding: "0px 0px 0px 160px" }} backgroundColor="#F0FFF4">
      <Flex direction="row" justifyContent={"flex-start"}>
        <Flex direction={"column"} w="50%">
          <GuestBookingForm
            setTotalGuestHandler={setTotalGuestHandler}
            name={name}
            gender={gender}
            email={email}
            phone={phone}
            data={data}
          />
          <PaymentMethod data={data} setBankIdHandler={setBankIdHandler} />
          <SpecialReq handleChange={handleChange} othercheckHandle={othercheckHandle} />
        </Flex>
        <Flex direction={"column"} w="50%" ml="40px">
          <BookingDetail
            totalGuest={totalGuest}
            data={data}
            startDate={location.state == null ? "" : location.state.startDate}
            endDate={location.state == null ? "" : location.state.endDate}
          />
        </Flex>
      </Flex>
      <Box display="flex" w="50%" justifyContent={"flex-end"}>
        <Button
          colorScheme={"green"}
          variant="solid"
          size="lg"
          mr="15px"
          mb="30px"
          onClick={createPaymentHandler}
        >
          {" "}
          Continue
        </Button>
      </Box>
    </Box>
  );
};

export default PaymentDetail;
