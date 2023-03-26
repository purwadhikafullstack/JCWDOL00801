import { Box, Checkbox, CheckboxGroup, Flex, Stack, Text, Textarea } from "@chakra-ui/react";
import { useState } from "react";

const SpecialReq = () => {
  const [isOther, setIsOther] = useState(false);
  const [values , setValues] = useState("");
  const onCheckedHandler = () =>{
    isOther ? setIsOther(false) : setIsOther(true)
    
  }
  return (
    <Box  rounded="md" shadow={"lg"} ml="20px" mt="30px" mb="30px"  background={"white"}>
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
              <Checkbox value="Non-smoking Room">Non-smoking Room</Checkbox>
              <Checkbox value="Connecting Room">Connecting Rooms</Checkbox>
            </Stack>
            <Stack spacing={[1, "89px"]} direction={["column", "row"]}>
              <Checkbox value="High Floor">High Floor</Checkbox>
              <Checkbox value="Others" onChange={onCheckedHandler}>Others</Checkbox>
            </Stack>
          </CheckboxGroup>
          {isOther ? <Textarea mt="20px" /> : ""}
          </Box>
      </Flex>
    </Box>
  );
};

export default SpecialReq;
