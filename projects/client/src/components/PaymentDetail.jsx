import Axios from "axios";
import { Box, Button, Flex, useMediaQuery, useUnmountEffect } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import BookingDetail from "./BookingDetail";
import GuestBookingForm from "./GuestBookingForm";
import PaymentMethod from "./PaymentMethod";
import SpecialReq from "./SpecialReqForm";
import { clearAllDate, clearDobAction } from "../actions/dateAction";
import Swal from "sweetalert2";
import { format, addHours, addDays } from "date-fns";


const PaymentDetail = () => {
  const location = useLocation();
  console.log("LOCATION", location.state)
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isMobile] = useMediaQuery("(max-width: 760px)");
  const [totalGuest, setTotalGuest] = useState(1);
  const [bankAccountNum, setAccountNum] = useState("");
  const [bankId, setBankId] = useState(0);
  const [night, setNight] = useState(0);
  const [specialRequest, setSpecialReq] = useState({
    specialReq: [],
  });
  const [price, setPrice] = useState(0);
  const [spPrice, setSpPrice] = useState(0);
  const [otherCheck, setOtherCheck] = useState("");
  const othercheckHandle = (e) => {
    setOtherCheck(e.target.value);
  };
  const setBankIdHandler = (e) => {
    const currentChoice = e.target.value.split(",");
    setBankId(parseInt(currentChoice[0]));
    setAccountNum(currentChoice[1]);
  };
  const handleNight = (e) =>{
    setNight(e);
  }
  const handleChange = (e) => {
    const { value, checked } = e.target;
    const { specialReq } = specialRequest;
    if (checked) {
      setSpecialReq({
        specialReq: [...specialReq, value],
      });
    } else {
      setSpecialReq({
        specialReq: specialReq.filter((e) => e !== value),
      });
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
          startDate: location.state.checkinDate ? location.state.checkinDate : startDate,
          endDate: location.state.checkoutDate ? location.state.checkoutDate: endDate
        }
      );
      setData(res.data.result[0]);
      setPrice(res.data.result[0].price);
      setSpPrice(res.data.result[0].nominal);
      console.log(res.data.result[0])
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
        }).then((response) => {
          if (response.isConfirmed) {
            Axios.post(
              process.env.REACT_APP_API_BASE_URL + "/transaction-new",
              {
                specialReq:
                  specialRequest.specialReq.length < 1 && otherCheck !== ""
                    ? otherCheck
                    : specialRequest.specialReq.length > 0 && otherCheck === ""
                    ? specialRequest.specialReq.join(", ")
                    : specialRequest.specialReq.length < 1 && otherCheck === ""
                    ? ""
                    : specialRequest.specialReq.join(", ") + " and " + otherCheck,
                totalGuest,
                checkinDate: location.state.checkinDate ? location.state.checkinDate : startDate,
                checkoutDate: location.state.checkoutDate ? location.state.checkoutDate: endDate,
                price: spPrice ? spPrice * night : price * night,
                bankId,
                bankAccountNum,
                propertyId: searchQuery.get("id"),
                transactionExpired: format(addDays(new Date(), 2), "yyyy-MM-dd HH:mm:ss"),
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
                }).then((r) => {
                  navigate(`/payment-proof?id=${res.data.result}`, { replace: true });
                  window.scrollTo(0, 0);
                  navigate(0);
                });
              })
              .catch((e) => {
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
    if (location.state === undefined || location.state === null || location.state === "") {
      return Swal.fire({
        title: "Please select the type room",
        icon: "error",
        confirmButtonText: "Confirm",
        confirmButtonColor: "#48BB78",
      }).then((res) => {
        navigate(`/`, { replace: true });
        window.scrollTo(0, 0);
        navigate(0);
      });
    }
    getData();
    return () => {
      dispatch(clearAllDate());
    };
  }, []);
  return (
    <Box style={{ padding: isMobile ? "0px" : "0px 0px 0px 160px" }} backgroundColor="#F0FFF4">
      <Flex direction={isMobile ? "column" : "row"} justifyContent={"flex-start"}>
        <Flex direction={"column"} w={isMobile ? "100%" : "50%"} order={isMobile ? 2 : 1}>
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
        <Flex
          direction={"column"}
          w={isMobile ? "100%" : "50%"}
          ml={isMobile ? "0px" : "40px"}
          order={isMobile ? 1 : 2}
        >
          <BookingDetail
            setNight = {setNight}
            totalGuest={totalGuest}
            data={data}
            startDate={location.state == null ? "" : location.state.checkinDate ? location.state.checkinDate : location.state.startDate }
            endDate={location.state == null ? "" : location.state.checkoutDate ? location.state.checkoutDate : location.state.endDate}
          />
        </Flex>
      </Flex>
      <Box display="flex" w={isMobile ? "100%" : "50%"} justifyContent={"flex-end"}>
        <Button
          isDisabled={bankId === 0 ? true : false}
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
