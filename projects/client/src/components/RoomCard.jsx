import React from "react";
import {
  Card,
  Image,
  Stack,
  CardBody,
  Heading,
  Text,
  CardFooter,
  Button,
  Flex,
} from "@chakra-ui/react";

function RoomCard(props) {
  return (
    <Card shadow="sm" direction={{ base: "column", sm: "row" }} overflow="hidden" variant="outline">
      <Image
        objectFit="cover"
        maxW={{ base: "100%", sm: "200px" }}
        src="https://images.unsplash.com/photo-1667489022797-ab608913feeb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw5fHx8ZW58MHx8fHw%3D&auto=format&fit=crop&w=800&q=60"
        alt="Caffe Latte"
      />

      <CardBody>
        <Heading size="md">Room Name</Heading>

        <Text py="2">
          Room Desc: Caffè latte is a coffee beverage of Italian origin made with espresso and
          steamed milk.
        </Text>
        <Flex justify="end" align="center">
          <Text color="blue.600" fontWeight="bold" fontSize="2xl">
            Rp. 900,000
          </Text>
          <Text color="blue.600" fontSize="md">
            /Night
          </Text>
        </Flex>
      </CardBody>

      <CardFooter mt="-5" alignSelf="end">
        <Button variant="solid" colorScheme="green">
          Select Room
        </Button>
      </CardFooter>
    </Card>
  );
}

export default RoomCard;
