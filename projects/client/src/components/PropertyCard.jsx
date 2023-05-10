import React from "react";
import { Card, CardBody, CardFooter, Icon, Box, Tooltip } from "@chakra-ui/react";
import { Image, Stack, Heading, Text, Flex } from "@chakra-ui/react";
import { Button } from "@chakra-ui/react";
import { IoLocationSharp } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
import { addDays, format } from "date-fns";

function PropertyCard({ data, isMobile }) {
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
      }).then(() => {
        navigate("/signin", { replace: true });
        window.scrollTo(0, 0);
      });
    } else {
      navigate(`/payment?id=${data.id}`, {
        state: { id: data.id, startDate: new Date(new Date(format(addDays(new Date(), 1), "MM/dd/yyyy")).getTime()), endDate: new Date(new Date(format(addDays(new Date(), 2), "MM/dd/yyyy")).getTime()), typeId: data.typeId },
      });
      window.scrollTo(0, 0);
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
      <Image
        onClick={() => {
          navigate(`/detail?id=${data.id}`, { state: { id: data.id } });
          window.scrollTo(0, 0);
        }}
        src={process.env.REACT_APP_BASE_IMG_URL + data.image}
        borderTopRadius="lg"
      />
      <CardBody
        onClick={() => {
          navigate(`/detail?id=${data.id}`, { state: { id: data.id } });
          window.scrollTo(0, 0);
        }}
      >
        <Stack spacing="3">
          <Tooltip label={data.name}>
            <Heading
              size="md"
              onClick={() => {
                navigate(`/detail?id=${data.id}`, { state: { id: data.id } });
                window.scrollTo(0, 0);
              }}
              _hover={{ cursor: "pointer", color: "green.600" }}
              noOfLines={1}
            >
              {data.name}
            </Heading>
          </Tooltip>
          <Text>
            <Icon as={IoLocationSharp} color="blackAlpha.600" /> {data.city}
          </Text>
          <Flex justify="end">
            {data.nominal ? (
              <>
                <Flex direction={"column"} alignItems={"flex-end"}>
                  {parseInt(data.nominal) < parseInt(data.price) ? (
                    <Text
                      color="blue.600"
                      opacity="0.5"
                      fontSize="sm"
                      textDecoration={"line-through"}
                    >
                      {parseInt(data.price).toLocaleString("id", {
                        style: "currency",
                        currency: "idr",
                      })}
                    </Text>
                  ) : (
                    ""
                  )}
                  <Text color="blue.600" fontSize="2xl">
                    {parseInt(data.nominal).toLocaleString("id", {
                      style: "currency",
                      currency: "idr",
                    })}
                  </Text>
                </Flex>
              </>
            ) : (
              <Text pt="24px" color="blue.600" fontSize="2xl">
                {parseInt(data.price).toLocaleString("id", {
                  style: "currency",
                  currency: "idr",
                })}
              </Text>
            )}
          </Flex>
        </Stack>
      </CardBody>
      <CardFooter mt="-4" alignSelf="end">
        <Button zIndex={"popover"} variant="solid" colorScheme="green" onClick={bookNowHandler}>
          Book now
        </Button>
      </CardFooter>
    </Card>
  );
}

export default PropertyCard;
