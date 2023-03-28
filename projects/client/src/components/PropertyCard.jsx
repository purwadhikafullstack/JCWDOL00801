import React from "react";
import { Card, CardBody, CardFooter, Icon } from "@chakra-ui/react";
import { Image, Stack, Heading, Text, Flex } from "@chakra-ui/react";
import { Button } from "@chakra-ui/react";
import { IoLocationSharp } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";

function PropertyCard({ data }) {
  console.log("data", data.typeId)
  const navigate = useNavigate();
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
      }).then(() =>{
        navigate("/signin", {replace: true})
        window.scrollTo(0,0)
      });
    }
    else{
      navigate(`/payment?id=${data.id}`, {state: {id: data.id, startDate: startDate, endDate: endDate, typeId: data.typeId}})
      window.scrollTo(0,0)
    }
  };

  return (
    <Card
      maxW="sm"
      _hover={{
        transform: "scale(1.05)",
        transitionTimingFunction: "ease-in-out",
        transitionDuration: "0.15s",
      }}
    >
      <Image
        src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80"
        alt="Green double couch with wooden legs"
        borderTopRadius="lg"
      />
      <CardBody>
        <Stack spacing="3">
          <Heading
            size="md"
            onClick={() => {navigate(`/detail?id=${data.id}`, { state: { id: data.id } })
            window.scrollTo(0,0)
          }}
            _hover={{ cursor: "pointer" }}
          >
            {data.name}
          </Heading>
          <Text>
            <Icon as={IoLocationSharp} color="blackAlpha.600" /> {data.city}
          </Text>
          <Flex justify="end">
            <Text color="blue.600" fontSize="2xl">
              {parseInt(data.price).toLocaleString("id", { style: "currency", currency: "idr" })}
            </Text>
          </Flex>
        </Stack>
      </CardBody>
      <CardFooter mt="-4" alignSelf="end">
        <Button variant="solid" colorScheme="green" onClick={bookNowHandler}>
          Book now
        </Button>
      </CardFooter>
    </Card>
  );
}

export default PropertyCard;
