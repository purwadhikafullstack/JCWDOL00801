import { Box, CardHeader, Flex, Heading, Image, Text, useMediaQuery } from "@chakra-ui/react";
import image1 from "../assets/landingBanner/banner-1.jpg";
import { BsDot, BsFillPersonFill } from "react-icons/bs";
import format from "date-fns/format";
import { useEffect, useState } from "react";

const BookingDetail = ({totalGuest, data, startDate, endDate, setNight}) => {
  const [diffDays, setdiffDays] = useState(0);
  const [isMobile] = useMediaQuery("(max-width: 760px)");
  const howManyNight =() =>{
    const date1 = new Date(startDate);
    const date2 = new Date(endDate);
    const diffTime = Math.abs(date2 - date1);
    const diffDay = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    setdiffDays(diffDay);
    setNight(diffDay)
  }
  useEffect(() =>{
    howManyNight()
  },[])
  return (
    <Box w={isMobile? "100%" : "70%"}  shadow={isMobile? "none" :"lg"} rounded="md" ml={isMobile? "0px":"30px"} mt={isMobile? "0px":"50px"} pos="sticky" top="16px" alignSelf={"flex-start"} background={"white"}>
      <Flex direction={"column"} m="20px" >
        <Box>
          <Heading fontSize={"24px"} fontWeight={"600"} mt="10px" mb="20px">
            Booking Detail
          </Heading>
          <Flex border="#ccc solid 1px" alignItems="center" rounded="md">
            <Image h="70px" w="70px" src={process.env.REACT_APP_API_BASE_IMG_URL + data.typeImg} m="5px" rounded="md" objectFit="cover"/>
            <Flex direction={"column"}>
              <Text fontWeight={"600"} fontSize="18px" color="#6e6c6d">
                {data.name}
              </Text>
              <Text fontSize="14px">{data.typeName}</Text>
              <Flex alignItems={"center"}>
                <Text fontSize="12px">{diffDays < 2 ? diffDays + " Night" : diffDays + " Nights"}</Text>
                <BsDot />
                <BsFillPersonFill fontSize={"12px"} />
                <Text fontSize="12px" ml={1}>{totalGuest} {totalGuest < 2 ? "Guest" : "Guests"} </Text>
              </Flex>
            </Flex>
          </Flex>
        </Box>
        <Flex direction="column" mt="20px" mb="30px">
          <Flex justifyContent="space-between">
            <Text>Check in</Text>
            <Text>{startDate == "" || startDate == null? "" : format(new Date(startDate), "E MMM, dd yyyy")}</Text>
          </Flex>
          <Flex justifyContent="space-between">
            <Text>Check out</Text>
            <Text>{startDate == "" || startDate == null ? "": format(new Date(endDate), "E MMM, dd yyyy") }</Text>
          </Flex>
          <Flex justifyContent="space-between" mt="20px">
            <Text>TOTAL</Text>
            <Text>{parseInt(data.price * diffDays).toLocaleString("ID", {style: "currency", currency: "IDR"})}</Text>
          </Flex>
        </Flex>
      </Flex>
    </Box>
  );
};

export default BookingDetail;
