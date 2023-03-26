import Axios from "axios";
import { Box, Button, Flex } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {useLocation, useSearchParams} from "react-router-dom";
import BookingDetail from "./BookingDetail";
import GuestBookingForm from "./GuestBookingForm";
import PaymentMethod from "./PaymentMethod";
import SpecialReq from "./SpecialReqForm";

const PaymentDetail = () => {
  const location = useLocation();
  console.log("checkking",location.state.typeId)
  const [totalGuest, setTotalGuest] = useState(1);
  const [searchQuery, setSearchQuery] = useSearchParams();
  const [data, setData] = useState([]);
  const {name, gender, email, phone} = useSelector(state =>{
    return{
      name: state.userReducer.name,
      gender: state.userReducer.gender,
      email: state.userReducer.email,
      phone: state.userReducer.phone
    }
  })
  const getData = async () =>{
    try {
      const res = await Axios.post(process.env.REACT_APP_API_BASE_URL + `/transaction-detail?id=${searchQuery.get("id")}`, {
        typeId: location.state.typeId
      });
      console.log(res.data.result[0]);
      setData(res.data.result[0])
    } catch (error) {
      console.log(error)
    }
  }
  const setTotalGuestHandler = (e) =>{
    setTotalGuest(e)
  }
  {console.log("ID", searchQuery.get("id"))}
  useEffect(() =>{
    getData();
  }, [])
  return (
    <Box style={{ padding: "0px 0px 0px 160px" }} backgroundColor="#F0FFF4">
      <Flex direction="row" justifyContent={"flex-start"}>
        <Flex direction={"column"} w="50%">
          <GuestBookingForm setTotalGuestHandler = {setTotalGuestHandler} name = {name} gender={gender} email={email} phone={phone} data={data}/>
          <PaymentMethod data = {data}/>
          <SpecialReq />
        </Flex>
        <Flex direction={"column"} w="50%" ml="40px">
        <BookingDetail totalGuest = {totalGuest} data={data} startDate={location.state.startDate} endDate={location.state.endDate}/>
        </Flex>
      </Flex>
      <Box display="flex" w="50%" justifyContent={"flex-end"}  >
        <Button colorScheme={"green"} variant="solid" size="lg" mr="15px" mb="30px">
          {" "}
          Continue
        </Button>
      </Box>
    </Box>
  );
};

export default PaymentDetail;
