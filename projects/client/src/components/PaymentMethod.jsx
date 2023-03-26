import { Box, Select, MenuOptionGroup, Flex, Text } from "@chakra-ui/react";
import bca from "../assets/bankLogo/bca.svg"

const PaymentMethod = ({data}) =>{
    return(
        <Box rounded="md" ml="20px" shadow="lg" background={"white"}>
            <Flex direction={"column"} m="20px">
                <Text fontSize={"24px"} fontWeight="600" mt="20px" mb="20px">Payment Method</Text>
            <Select mb="20px" >
                <option value="">SELECT PAYMENT METHOD</option>
                <option value={`${data.bankName}`}>{data.bankName}</option>
            </Select>
            </Flex>
        </Box>
    )
}

export default PaymentMethod;