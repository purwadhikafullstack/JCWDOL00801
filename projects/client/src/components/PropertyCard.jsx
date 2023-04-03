import React from "react";
import { Card, CardBody, CardFooter, Icon, Box } from "@chakra-ui/react";
import { Image, Stack, Heading, Text, Flex } from "@chakra-ui/react";
import { Button } from "@chakra-ui/react";
import { IoLocationSharp } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
import banner1 from "../assets/landingBanner/banner-4.jpg";


function PropertyCard({ data }) {
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
      _hover={{
        transform: "scale(1.05)",
        transitionTimingFunction: "ease-in-out",
        transitionDuration: "0.15s",
      }}
    >
      <Image src={banner1} alt="Green double couch with wooden legs" borderTopRadius="lg" />
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
