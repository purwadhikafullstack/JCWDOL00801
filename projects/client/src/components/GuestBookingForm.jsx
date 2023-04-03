import {
  Box,
  Flex,
  FormLabel,
  Heading,
  Input,
  NumberInput,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInputField,
  NumberInputStepper,
  Text,
  useMediaQuery,
} from "@chakra-ui/react";
import { useState } from "react";

const GuestBookingForm = ({setTotalGuestHandler, name, email, gender, phone, data}) => {
  const [isMobile] = useMediaQuery("(max-width: 760px)");
  return (
    <Box rounded="md" shadow={isMobile? "none" :"lg"} ml={isMobile? "0px":"20px"} mb={isMobile? "0px":"20px"} mt={isMobile? "0px":"50px"} background={"white"}>
      <Flex direction={"column"} m="20px">
        <Heading fontWeight="600" fontSize="24px" mb="20px">
          Guest Detail
        </Heading>
        <Flex>
          <Box w="50%" mr="10px">
            <Text>Contact's Name</Text>
            <Text>{name}</Text>
          </Box>
          <Box w="50%" ml="10px">
            <Text>Gender</Text>
            <Text>{gender != null && gender != "" ? `${gender}`: "Not set yet"}</Text>
          </Box>
        </Flex>
        <Flex mt="10px" mb="10px">
          <Box w="50%" mr="10px">
            <Text>Phone Number</Text>
            <Text>{phone}</Text>
          </Box>
          <Box w="50%" ml="10px">
            <Text>Email Address</Text>
            <Text>{email}</Text>
          </Box>
        </Flex>
        <Text mb={1}>Total Guest</Text>
        <NumberInput defaultValue={1} min={1} max={data.capacity} w={isMobile? "30%":"15%"} onChange= {e => setTotalGuestHandler(e)}>
          <NumberInputField />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
      </Flex>
    </Box>
  );
};

export default GuestBookingForm;
