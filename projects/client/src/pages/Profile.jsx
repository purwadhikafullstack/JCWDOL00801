import { Container, Flex, Heading } from "@chakra-ui/react";
import React, { useEffect } from "react";
import ProfileCard from "../components/ProfileCard";
import ProfileForm from "../components/ProfileForm";

function Profile(props) {
  useEffect(() => {
    document.title = "Profile - RentHaven";
  }, []);
  return (
    <>
      <Container maxW={{ md: "container.lg" }} my="40px">
        <Heading mb={5}>My Profile</Heading>
        <Flex direction="column" p="4" border="1px" borderColor="#ccc" rounded="md">
          <Flex mt={3} gap={6} direction={{ base: "column", md: "row" }}>
            <ProfileCard />
            <ProfileForm />
          </Flex>
        </Flex>
      </Container>
    </>
  );
}

export default Profile;
