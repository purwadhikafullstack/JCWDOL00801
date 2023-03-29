import { Box, Container, Heading, Text } from "@chakra-ui/react";
import React from "react";
import PropertyList from "../components/PropertyList";

function Property(props) {
  return (
    <Box pb="5" px={{ base: "5", md: "20" }}>
      <Heading mb={6}>Manage Properties</Heading>
      <PropertyList />
    </Box>
  );
}

export default Property;
