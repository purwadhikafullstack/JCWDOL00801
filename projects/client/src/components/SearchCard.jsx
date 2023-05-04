import {
  Button,
  Card,
  CardBody,
  CardFooter,
  Flex,
  Heading,
  Icon,
  Image,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useState } from "react";
import { IoLocationSharp } from "react-icons/io5";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const SearchCard = ({ data }) => {
  console.log(data)
  const navigate = useNavigate();
  const [discount, setDiscount] = useState(0);
  const { startDate, endDate } = useSelector((state) => {
    return {
      startDate: state.dateReducer.startDate,
      endDate: state.dateReducer.endDate,
    };
  });
  useState(() =>{
    if(data.nominal){
      const difference = data.price - data.nominal;
      const discount = (difference * 100) / data.price;
      setDiscount(discount)
    }
  }, [])
  return (
    <Card
      shadow={"md"}
      direction={{ base: "column", sm: "row" }}
      overflow="hidden"
      variant="outline"
      minW="100%"
    >
      <Image
        objectFit="cover"
        maxW={{ base: "100%", sm: "200px" }}
        src={process.env.REACT_APP_BASE_IMG_URL + data.image}
        alt="Caffe Latte"
      />

      <Stack w="100%">
        <CardBody>
          <Heading
            _hover={{ cursor: "pointer" }}
            size="md"
            onClick={() => {
              navigate(`/detail?id=${data.id}`, { state: { id: data.id } });
              window.scrollTo(0, 0);
            }}
          >
            {data.name}
          </Heading>
          <Flex alignItems={"center"} color={"gray"} mt={1}>
            <Text>
              <Icon as={IoLocationSharp} /> {data.city}
            </Text>
          </Flex>
          <Text py="2">{data.desc}</Text>
        </CardBody>

        <CardFooter w="100%">
          <Flex direction={"row"} w="100%" justifyContent={"space-between"} alignItems={"center"}>
            {data.nominal ? (
              <>
              <Flex direction={"column"}>
                {parseInt(data.nominal) < parseInt(data.price) ? <Text color="blue.600" textDecoration={"line-through"}>
                  {parseInt(data.price).toLocaleString("ID", {
                    style: "currency",
                    currency: "IDR",
                  })}
                </Text>: ""}
                <Text color="blue.600" fontSize="2xl">
                  {parseInt(data.nominal).toLocaleString("ID", {
                    style: "currency",
                    currency: "IDR",
                  })}
                </Text>{" "}
                </Flex>
              </>
            ) : (
              <Text color="blue.600" fontSize="2xl">
                {parseInt(data.price).toLocaleString("ID", { style: "currency", currency: "IDR" })}
              </Text>
            )}
            <Button
              variant="solid"
              colorScheme="green"
              onClick={() => {
                navigate(`/detail?id=${data.id}`, { state: { id: data.id } });
                window.scrollTo(0, 0);
              }}
            >
              See Details
            </Button>
          </Flex>
        </CardFooter>
      </Stack>
    </Card>
  );
};

export default SearchCard;
