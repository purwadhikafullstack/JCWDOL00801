import { Box, SimpleGrid, Icon, Text, Stack, Flex, Container, Heading } from "@chakra-ui/react";
import { BiSupport, BiTimer, BiMoneyWithdraw } from "react-icons/bi";

const Feature = ({ title, text, icon }) => {
  return (
    <Stack>
      <Flex
        w={16}
        h={16}
        align={"center"}
        justify={"center"}
        color={"green.300"}
        rounded={"full"}
        bg={"white"}
        mb={1}
      >
        {icon}
      </Flex>
      <Text fontWeight={600}>{title}</Text>
      <Text color={"gray.600"}>{text}</Text>
    </Stack>
  );
};

function LandingContent(props) {
  return (
    <Box bg="gray.100">
      <Container maxW="container.xl" py={16}>
        <Flex mb={10} justify="center">
          <Heading>Why Renthaven?</Heading>
        </Flex>
        <Box p={4}>
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10}>
            <Feature
              icon={<Icon as={BiSupport} w={10} h={10} />}
              title={"Enjoy Peace of Mind"}
              text={
                "Our customer support team is available 24/7 to answer your questions and address your concerns"
              }
            />
            <Feature
              icon={<Icon as={BiTimer} w={10} h={10} />}
              title={"Save Time and Hassle"}
              text={
                " Our user-friendly platform makes it easy to find and book your perfect property"
              }
            />
            <Feature
              icon={<Icon as={BiMoneyWithdraw} w={10} h={10} />}
              title={"Get More Value for Your Money"}
              text={"Our properties are priced competitively and include essential amenities"}
            />
          </SimpleGrid>
        </Box>
      </Container>
    </Box>
  );
}

export default LandingContent;
