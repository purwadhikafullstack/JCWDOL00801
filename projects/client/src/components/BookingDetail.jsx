import { Box, CardHeader, Flex, Heading, Image, Text } from "@chakra-ui/react";
import image1 from "../assets/landingBanner/banner-1.jpg";
import { BsDot, BsFillPersonFill } from "react-icons/bs";
import format from "date-fns/format";

const BookingDetail = ({totalGuest, data, startDate, endDate}) => {
  console.log(startDate)
  return (
    <Box w="70%"  shadow="lg" rounded="md" ml="30px" mt="50px" pos="sticky" top="16px" alignSelf={"flex-start"} background={"white"}>
      <Flex direction={"column"} m="20px" >
        <Box>
          <Heading fontSize={"24px"} fontWeight={"600"} mt="10px" mb="20px">
            Booking Detail
          </Heading>
          <Flex border="#ccc solid 1px" alignItems="center" rounded="md">
            <Image h="70px" w="70px" src={image1} m="5px" rounded="md" objectFit="cover"/>
            <Flex direction={"column"}>
              <Text fontWeight={"600"} fontSize="18px" color="#6e6c6d">
                {data.name}
              </Text>
              <Text fontSize="14px">{data.typeName}</Text>
              <Flex alignItems={"center"}>
                <Text fontSize="12px">How many night</Text>
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
            <Text>{format(new Date(startDate), "E MMM, dd yyyy")}</Text>
          </Flex>
          <Flex justifyContent="space-between">
            <Text>Check out</Text>
            <Text>{format(new Date(endDate), "E MMM, dd yyyy")}</Text>
          </Flex>
          <Flex justifyContent="space-between" mt="20px">
            <Text>TOTAL</Text>
            <Text>{parseInt(data.price).toLocaleString("ID", {style: "currency", currency: "IDR"})}</Text>
          </Flex>
        </Flex>
      </Flex>
    </Box>
  );
};

export default BookingDetail;
