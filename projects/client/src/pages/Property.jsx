import { Container } from "@chakra-ui/react";
import React from "react";
import CreateProperty from "../components/CreateProperty";
import PropertyList from "../components/PropertyList";

function Property(props) {
  return (
    <Container maxW={{ base: "container", md: "container.xl" }}>
      <CreateProperty />
      <PropertyList />
    </Container>
  );
}

export default Property;
