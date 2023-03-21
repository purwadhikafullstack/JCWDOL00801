import React from "react";
import {
  Container,
  Flex,
  Heading,
  Text,
  Icon,
  Avatar,
  Divider,
} from "@chakra-ui/react";
import { IoLocationSharp } from "react-icons/io5";
import PropertyGallery from "../components/PropertyGallery";
import RoomCard from "../components/RoomCard";

function PropertyDetail(props) {
  return (
    <Container maxW={{ base: "container", md: "container.lg" }}>
      <Flex direction="column" mb={3}>
        <Heading>Hotel Name</Heading>
        <Text>
          <Icon as={IoLocationSharp} /> Location
        </Text>
      </Flex>
      <PropertyGallery />
      <Flex align="center" gap={3} mt={5}>
        <Avatar bg="green.500" size="md" />
        <Heading size="md">Tenant Name</Heading>
      </Flex>
      <Divider my={5} />
      <Flex direction="column">
        <Heading size="sm">Description</Heading>
        <Text>
          Property Desc: Lorem ipsum dolor sit amet consectetur adipisicing
          elit. Consequatur magnam facere error ullam, a officiis delectus
          nostrum provident cumque, voluptatibus eveniet nisi itaque eos
          accusamus quaerat harum nulla architecto? Voluptatibus?
        </Text>
      </Flex>
      <Divider my={5} />
      <Flex direction="column" gap={4}>
        <Heading size="sm">Available Rooms at "Hotel Name"</Heading>
        <RoomCard />
        <RoomCard />
        <RoomCard />
        <RoomCard />
      </Flex>
    </Container>
  );
}

export default PropertyDetail;
