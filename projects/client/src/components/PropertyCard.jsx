import React from "react";
import { Card, CardBody, CardFooter, Icon } from "@chakra-ui/react";
import { Image, Stack, Heading, Text, Flex } from "@chakra-ui/react";
import { Button } from "@chakra-ui/react";
import { IoLocationSharp } from "react-icons/io5";

function PropertyCard(props) {
  return (
    <Card
      _hover={{
        transform: "scale(1.05)",
        transitionTimingFunction: "ease-in-out",
        transitionDuration: "0.15s",
      }}
    >
      <Image
        src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80"
        alt="Green double couch with wooden legs"
        borderTopRadius="lg"
      />
      <CardBody>
        <Stack spacing="3">
          <Heading size="md">Nama Hotel</Heading>
          <Text>
            <Icon as={IoLocationSharp} color="blackAlpha.600" /> Jakarta
          </Text>
          <Flex justify="end">
            <Text color="blue.600" fontSize="2xl">
              Rp. 900,000
            </Text>
          </Flex>
        </Stack>
      </CardBody>
      <CardFooter mt="-4" alignSelf="end">
        <Button variant="solid" colorScheme="green">
          Book now
        </Button>
      </CardFooter>
    </Card>
  );
}

export default PropertyCard;
