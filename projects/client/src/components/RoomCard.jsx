import React from "react";
import {
  Card,
  Image,
  Stack,
  CardBody,
  Heading,
  Text,
  CardFooter,
  Button,
  Flex,
  Alert,
  AlertIcon,
  AlertDescription,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";

function RoomCard(props) {
  const navigate = useNavigate();
  console.log(props.isAvailable);
  const { email, startDate, endDate } = useSelector((state) => {
    return {
      email: state.userReducer.email,
      startDate: state.dateReducer.startDate,
      endDate: state.dateReducer.endDate,
    };
  });
  const bookNowHandler = () => {
    if (!email) {
      Swal.fire({
        title: "Please login as a user to continue",
        icon: "error",
        confirmButtonText: "Confirm",
        confirmButtonColor: "#48BB78",
      }).then(() => {
        navigate("/signin", { replace: true });
        window.scrollTo(0, 0);
      });
    } else {
      navigate(`/payment?id=${props.id}`, {
        state: {
          id: props.id,
          startDate: props.startDate,
          endDate: props.endDate,
          typeId: props.data.typeId,
        },
      });
      window.scrollTo(0, 0);
    }
  };

  return (
    <Card shadow="sm" direction={{ base: "column", sm: "row" }} overflow="hidden" variant="outline">
      <Image
        style={{ filter: props.isAvailable ? "" : "grayscale(1)" }}
        objectFit="cover"
        maxW={{ base: "100%", sm: "200px" }}
        src="https://images.unsplash.com/photo-1667489022797-ab608913feeb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw5fHx8ZW58MHx8fHw%3D&auto=format&fit=crop&w=800&q=60"
        alt="Caffe Latte"
      />
      <CardBody>
        {props.isAvailable ? (
          ""
        ) : (
          <Alert style={{ filter: "grayscale(0%)", height: "40px", marginTop: "-5px" }}>
            <AlertIcon />
            <AlertDescription>All rooms with this type are fully booked.</AlertDescription>
          </Alert>
        )}
        <Heading size="md" style={{ filter: props.isAvailable ? "" : "grayscale(1)" }} mt={2}>
          {props.data.name}
        </Heading>
        <Text py="2">{props.data.desc}</Text>
        <Flex
          justify="end"
          align="center"
          style={{ filter: props.isAvailable ? "" : "grayscale(1)" }}
        >
          <Text color="blue.600" fontWeight="bold" fontSize="2xl">
            {parseInt(props.data.price).toLocaleString("id", {
              style: "currency",
              currency: "IDR",
            })}
          </Text>
          <Text color="blue.600" fontSize="md">
            /Night
          </Text>
        </Flex>
      </CardBody>

      <CardFooter
        mt="-5"
        alignSelf="end"
        style={{ filter: props.isAvailable ? "" : "grayscale(1)" }}
      >
        <Button
          isDisabled={!props.isAvailable}
          variant="solid"
          colorScheme="green"
          onClick={() => bookNowHandler()}
        >
          Select Room
        </Button>
      </CardFooter>
    </Card>
  );
}

export default RoomCard;
