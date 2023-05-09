import React, { useEffect } from "react";
import { Box, Flex, Heading, Text, Stack, Container, Avatar } from "@chakra-ui/react";
import Axios from "axios";

const Testimonial = ({ children }) => {
  return <Box>{children}</Box>;
};

const TestimonialContent = ({ children }) => {
  return (
    <Stack
      bg="green.200"
      boxShadow={"lg"}
      p={6}
      rounded={"xl"}
      align={"center"}
      pos={"relative"}
      height={"75%"}
      justifyContent={"center"}
      _after={{
        content: `""`,
        w: 0,
        h: 0,
        borderLeft: "solid transparent",
        borderLeftWidth: 16,
        borderRight: "solid transparent",
        borderRightWidth: 16,
        borderTop: "solid",
        borderTopWidth: 16,
        borderTopColor: "green.200",
        pos: "absolute",
        bottom: "-16px",
        left: "50%",
        transform: "translateX(-50%)",
      }}
    >
      {children}
    </Stack>
  );
};

const TestimonialText = ({ children }) => {
  return (
    <Text textAlign={"center"} color="gray.600" fontSize={"sm"}>
      {children}
    </Text>
  );
};

const TestimonialAvatar = ({ src, name, title }) => {
  return (
    <Flex align={"center"} mt={8} direction={"column"}>
      <Avatar bg="green.500" src={src} alt={name} mb={2} />
      <Stack spacing={-1} align={"center"}>
        <Text textTransform={"capitalize"} fontWeight={600}>
          {name}
        </Text>
        <Text fontSize={"sm"} color="gray.600">
          {title}
        </Text>
      </Stack>
    </Flex>
  );
};

function Testimonials(props) {
  const [reviewData, setReviewData] = React.useState([]);

  const getReview = async () => {
    try {
      let response = await Axios.get(process.env.REACT_APP_API_BASE_URL + "/review/testi");
      setReviewData(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const testimonialContent = () => {
    return reviewData.map((val, idx) => {
      const { desc } = val;
      const { name, profileImg } = val.user;
      return (
        <Testimonial key={idx}>
          <TestimonialContent>
            <TestimonialText>{desc}</TestimonialText>
          </TestimonialContent>
          <TestimonialAvatar src={process.env.REACT_APP_BASE_IMG_URL + profileImg} name={name} />
        </Testimonial>
      );
    });
  };

  useEffect(() => {
    getReview();
  }, []);

  return (
    <Box bg="white">
      <Container maxW={"7xl"} py={16} as={Stack} spacing={12}>
        <Stack spacing={0} align={"center"}>
          <Heading>Our Clients Speak</Heading>
          <Text>We have been working with clients around the world</Text>
        </Stack>
        <Stack
          pb={16}
          direction={{ base: "column", md: "row" }}
          spacing={{ base: 10, md: 4, lg: 10 }}
        >
          {testimonialContent()}
        </Stack>
      </Container>
    </Box>
  );
}

export default Testimonials;
