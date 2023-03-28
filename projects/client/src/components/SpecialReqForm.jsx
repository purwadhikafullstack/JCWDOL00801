import { Box, Checkbox, CheckboxGroup, Flex, Stack, Text, Textarea, useMediaQuery } from "@chakra-ui/react";
import { useState } from "react";

const SpecialReq = ({handleChange, othercheckHandle}) => {
  const [isOther, setIsOther] = useState(false);
  const [values , setValues] = useState("");
  const [isMobile] = useMediaQuery("(max-width: 760px)");
  const onCheckedHandler = () =>{
    isOther ? setIsOther(false) : setIsOther(true)
  }
  return (
    <Box  rounded="md" shadow={isMobile ? "none":"lg"} ml={isMobile? "0px": "20px"} mt={isMobile? "0px":"30px"} mb="30px"  background={"white"}>
      <Flex direction={"column"} m="20px">
        <Text fontWeight="600" fontSize="24px" mt="20px" mb="20px">
          Special Request
        </Text>
        <Text fontSize="14px" textAlign="justify" mb="20px">
          Please note that special requests are not guaranteed and additional charges
          may occur outside of this transaction.</Text>
          <Box mb="30px">
          <CheckboxGroup colorScheme="green">
            <Stack spacing={[1, 5]} direction={["column", "row"]}>
              <Checkbox value="Non-smoking Room" onChange={(e) => handleChange(e)}>Non-smoking Room</Checkbox>
              <Checkbox value="Connecting Room" onChange={(e) => handleChange(e)}>Connecting Rooms</Checkbox>
            </Stack>
            <Stack spacing={[1, "89px"]} direction={["column", "row"]}>
              <Checkbox value="High Floor" onChange={(e) => handleChange(e)}>High Floor</Checkbox>
              <Checkbox value="Others" onChange={onCheckedHandler}>Others</Checkbox>
            </Stack>
          </CheckboxGroup>
          {isOther ? <Textarea mt="20px" onChange={(e) => othercheckHandle(e)}/> : ""}
          </Box>
      </Flex>
    </Box>
  );
};

export default SpecialReq;
