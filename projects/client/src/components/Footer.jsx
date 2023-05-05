import {
  Box,
  chakra,
  Container,
  Link,
  SimpleGrid,
  Stack,
  HStack,
  Text,
  VisuallyHidden,
  Image,
  Heading,
} from "@chakra-ui/react";
import { FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";
import logo from "../assets/logo.png";

const SocialButton = ({ children, label, href }) => {
  return (
    <chakra.button
      bg="blackAlpha.100"
      rounded={"full"}
      w={8}
      h={8}
      cursor={"pointer"}
      as={"a"}
      href={href}
      display={"inline-flex"}
      alignItems={"center"}
      justifyContent={"center"}
      transition={"background 0.3s ease"}
      _hover={{
        bg: "blackAlpha.200",
      }}
    >
      <VisuallyHidden>{label}</VisuallyHidden>
      {children}
    </chakra.button>
  );
};

const ListHeader = ({ children }) => {
  return (
    <Text fontWeight={"bold"} fontSize={"lg"} mb={2}>
      {children}
    </Text>
  );
};

function Footer() {
  return (
    <Box bg={"gray.50"} color={"gray.700"}>
      <Container as={Stack} maxW={"6xl"} py={10}>
        <SimpleGrid templateColumns={{ sm: "1fr 1fr 1fr", md: "2fr 1fr 1fr" }} spacing={8}>
          <Stack spacing={6}>
            <HStack>
              <Image boxSize="120px" src={logo} />
              <Heading size="xl">Renthaven</Heading>
            </HStack>
            <Text fontSize={"sm"}>© 2022 All rights reserved</Text>
            <Stack direction={"row"} spacing={6}>
              <SocialButton label={"Twitter"}>
                <FaTwitter />
              </SocialButton>
              <SocialButton label={"YouTube"}>
                <FaYoutube />
              </SocialButton>
              <SocialButton label={"Instagram"}>
                <FaInstagram />
              </SocialButton>
            </Stack>
          </Stack>

          <Stack align={"flex-start"}>
            <ListHeader>Useful Links</ListHeader>
            <Link>Home</Link>
            <Link>Tenant</Link>
            <Link>Profile</Link>
            <Link>Order List</Link>
          </Stack>
        </SimpleGrid>
      </Container>
    </Box>
  );
}

export default Footer;
