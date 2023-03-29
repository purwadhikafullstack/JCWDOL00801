import { Box, Button, Flex, Icon, Text, Heading } from "@chakra-ui/react";
import { RiHotelLine, RiHotelBedLine } from "react-icons/ri";
import { AddIcon, ArrowLeftIcon } from "@chakra-ui/icons";
import React from "react";
import { useNavigate } from "react-router-dom";

function PropertyCreateMenu() {
  const navigate = useNavigate();
  return (
    <Box px={{ base: "0", md: "20" }}>
      <Flex direction="column" gap={6} align="center" justify="center">
        <Heading>Please Select One</Heading>
        <Flex gap={6} direction={{ base: "column", md: "row" }}>
          <Button
            px="16"
            py="20"
            colorScheme="green"
            variant="outline"
            onClick={() => {
              navigate("/property/new/building");
            }}
          >
            <Flex direction="column" justify="center" align="center">
              <Icon boxSize={10} as={RiHotelLine} />
              <Text>Add Property</Text>
            </Flex>
          </Button>
          <Button
            px="16"
            py="20"
            colorScheme="green"
            variant="outline"
            onClick={() => navigate("/property/new/building-room", { replace: true })}
          >
            <Flex direction="column" justify="center" align="center">
              <Flex align="center" gap={3}>
                <Icon boxSize={10} as={RiHotelLine} />
                <AddIcon />
                <Icon boxSize={10} as={RiHotelBedLine} />
              </Flex>
              <Text>Add Property</Text>
              <Text>and Room</Text>
            </Flex>
          </Button>
        </Flex>
        <Flex>
          <Button
            colorScheme="gray"
            variant="ghost"
            onClick={() => navigate("/property", { replace: true })}
            leftIcon={<ArrowLeftIcon boxSize={3} />}
          >
            Back
          </Button>
        </Flex>
      </Flex>
    </Box>
  );
}

export default PropertyCreateMenu;
