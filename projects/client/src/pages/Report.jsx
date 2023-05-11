import React from "react";
import { Box, Heading, Flex } from "@chakra-ui/react";
import ReportCalendar from "../components/ReportCalendar";
import LineChart from "../components/LineChart";

function Report(props) {
  return (
    <Box pb="5" px={{ base: "5", md: "20" }}>
      <Heading mb={6}>Report</Heading>
      <Flex gap={5} direction={{ base: "column", md: "row" }}>
        <ReportCalendar />
        <LineChart />
      </Flex>
    </Box>
  );
}

export default Report;
