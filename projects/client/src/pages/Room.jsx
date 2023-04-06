import { Box, Heading } from "@chakra-ui/react";
import React from "react";
import RoomList from "../components/RoomList";

function RoomListPage(props) {
  return (
    <Box pb="5" px={{ base: "5", md: "20" }}>
      <Heading mb={6}>Manage Rooms</Heading>
      <RoomList />
    </Box>
  );
}

export default RoomListPage;
