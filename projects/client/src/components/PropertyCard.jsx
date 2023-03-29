import React from "react";
import { Card, CardBody, CardFooter, Icon, Box } from "@chakra-ui/react";
import { Image, Stack, Heading, Text, Flex } from "@chakra-ui/react";
import { Button } from "@chakra-ui/react";
import { IoLocationSharp } from "react-icons/io5";
import banner1 from "../assets/landingBanner/banner-4.jpg";

function PropertyCard(props) {
  return (
    <Card
      _hover={{
        transform: "scale(1.05)",
        transitionTimingFunction: "ease-in-out",
        transitionDuration: "0.15s",
      }}
    >
      <Image src={banner1} alt="Green double couch with wooden legs" borderTopRadius="lg" />
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
