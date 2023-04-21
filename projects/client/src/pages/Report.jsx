import React from "react";
import { Box, Heading, Flex } from "@chakra-ui/react";
import ReportCalendar from "../components/ReportCalendar";

function Report(props) {
  return (
    <Box pb="5" px={{ base: "5", md: "20" }}>
      <Heading mb={6}>Report</Heading>
      <Flex gap={5}>
        <ReportCalendar />
      </Flex>
    </Box>
  );
}

export default Report;
