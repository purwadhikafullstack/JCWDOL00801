import { Avatar, Box, Card, CardBody, CardHeader, Flex, Text } from "@chakra-ui/react";
import { useEffect } from "react";
import { useState } from "react";

const Reviews = ({ data, handlePage }) => {
  const [time, setTime] = useState("");
  useEffect(() => {
    setTime(new Date(data.createdAt.substring(0, 19).replace("T", " ")));
  }, []);
  return (
    <Card>
      <CardHeader>
        <Flex alignItems={"center"}>
          <Avatar size="lg" />
          <Text ml="20px" fontWeight={"600"} fontSize={"24px"}>
            {data.name}
          </Text>
        </Flex>
      </CardHeader>
      <CardBody>
        <Flex justifyContent={"space-between"}>
          <Text
            pl={1}
            pr={1}
            fontWeight={"600"}
            color={"green"}
            background={"green.100"}
            rounded={"md"}
          >
            Room: {data.roomName}
          </Text>
          <Text>{time.toString().substring(0, 15)}</Text>
        </Flex>
        <Text mt={5}>{data.desc}</Text>
      </CardBody>
    </Card>
  );
};

export default Reviews;
