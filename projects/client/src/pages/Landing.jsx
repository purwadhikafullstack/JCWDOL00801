import React from "react";
import LandingSearchForm from "../components/LandingSearchForm";
import LandingContent from "../components/LandingContent";
import { Box, Flex, Divider } from "@chakra-ui/react";
import Testimonials from "../components/Testimonials";
import MainContent from "../components/MainContent";
import LandingBanner from "../components/LandingBanner";

function Landing(props) {
  return (
    <Box>
      {/* banner */}
      <Flex direction="row" justify="center">
        <LandingBanner />
      </Flex>
      <LandingSearchForm />
      <Box mb="70">
        <MainContent />
      </Box>
      <Divider />
      <LandingContent />
      <Testimonials />
    </Box>
  );
}

export default Landing;
