import {
  Box,
  Heading,
  Flex,
  Stack,
  Image,
  Text,
  Table,
  Th,
  Tr,
  Td,
  Tbody,
  Thead,
  Divider,
  Button,
  IconButton,
  Select,
} from "@chakra-ui/react";
import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Axios from "axios";
import { ArrowLeftIcon, ArrowRightIcon } from "@chakra-ui/icons";
import ReactPaginate from "react-paginate";

function PropertyAndRoomList(props) {
  const { search } = useLocation();
  const navigate = useNavigate();
  const [roomList, setRoomList] = React.useState([]);
  const [propertyData, setPropertyData] = React.useState("");
  const [page, setPage] = React.useState(0);
  const [limit, setLimit] = React.useState(0);
  const [pages, setPages] = React.useState(0);
  const [rows, setRows] = React.useState(0);
  const [pageMessage, setPageMessage] = React.useState("");
  const [selectedOption, setSelectedOption] = React.useState("");

  const getRoomList = async () => {
    const propertyId = search.split("?")[1];
    try {
      let response = await Axios.get(
        process.env.REACT_APP_API_BASE_URL +
          `/property/roomlist/all?propertyId=${propertyId}&limit=${limit}&page=${page}`
      );
      setRoomList(response.data.data);
      setPage(response.data.page);
      setPages(response.data.totalPage);
      setRows(response.data.totalRows);
    } catch (error) {
      console.log(error);
      setRoomList(error.response.data.data);
    }
  };

  const getPropertyData = async () => {
    const propertyId = search.split("?")[1];
    try {
      let response = await Axios.get(
        process.env.REACT_APP_API_BASE_URL + `/property/${propertyId}`
      );
      setPropertyData(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const renderProperty = () => {
    if (propertyData) {
      const { name, image, phone, desc, address, category } = propertyData;
      return (
        <>
          <Flex mt={5} gap={5}>
            <Image boxSize={150} src={process.env.REACT_APP_API_BASE_IMG_URL + image} />
            <Stack>
              <Heading size="md">{name}</Heading>
              <Flex justify="space-between">
                <Text>{phone}</Text>
              </Flex>
              <Flex justify="space-between">
                <Text>{address}</Text>
              </Flex>
              <Flex justify="space-between">
                <Text>
                  {category.province} - {category.city}
                </Text>
              </Flex>
            </Stack>
          </Flex>
          <Flex mt={3} direction="column">
            <Text>Description:</Text>
            <Text>{desc ? desc : "none"}</Text>
          </Flex>
        </>
      );
    }
  };

  const renderRoom = () => {
    if (roomList.length > 0) {
      return (
        <Table mt={10} variant="simple">
          <Thead>
            <Tr>
              <Th>Room Name</Th>
              <Th>Price</Th>
              <Th>Capacity</Th>
              <Th>Action</Th>
            </Tr>
          </Thead>
          <Tbody>
            {roomList.map((val, idx) => {
              const { name, typeImg, price, capacity } = val.type;
              return (
                <Tr key={idx}>
                  <Td>
                    <Flex align="center" gap={3}>
                      <Image
                        rounded={5}
                        boxSize={{ base: "50px", md: "65px" }}
                        src={process.env.REACT_APP_API_BASE_IMG_URL + typeImg}
                      />
                      <Text>{name}</Text>
                    </Flex>
                  </Td>
                  <Td>{`${parseInt(price).toLocaleString("id", {
                    style: "currency",
                    currency: "IDR",
                  })}`}</Td>
                  <Td>{capacity}</Td>
                  <Td>
                    <Select
                      w="50%"
                      value={selectedOption}
                      onChange={(e) => setSelectedOption(e.target.value)}
                    >
                      <option hidden>Action</option>
                      <option>Set Availability</option>
                      <option>Set Special Price</option>
                    </Select>
                  </Td>
                </Tr>
              );
            })}
          </Tbody>
        </Table>
      );
    } else {
      return (
        <>
          <Divider my={3} />
          <Heading textAlign="center" size="md">
            This property has no rooms
          </Heading>
        </>
      );
    }
  };

  const onPageChange = ({ selected }) => {
    setPage(selected);
    if (selected === 9) {
      setPageMessage(
        `If you can't find the data you're looking for, please try using a more specific keyword`
      );
    } else {
      setPageMessage("");
    }
  };

  useEffect(() => {
    getPropertyData();
  }, []);

  useEffect(() => {
    getRoomList();
  }, [page]);

  return (
    <>
      <Box pb={5} px={{ base: "5", md: "20" }}>
        <Heading mb={5}>Room List</Heading>
        {renderProperty()}
        {renderRoom()}
        <Flex justify="center" align="center" mt={5}>
          <Button
            colorScheme="gray"
            variant="ghost"
            onClick={() => navigate("/property-list", { replace: true })}
            leftIcon={<ArrowLeftIcon boxSize={3} />}
            marginRight="auto"
          >
            Back
          </Button>
          {pages === 0 ? null : (
            <Flex marginRight="auto">
              <Text>{pageMessage}</Text>
              <nav key={rows}>
                <ReactPaginate
                  previousLabel={
                    <IconButton
                      isDisabled={page === 0}
                      variant="outline"
                      colorScheme="green"
                      icon={<ArrowLeftIcon />}
                    />
                  }
                  nextLabel={
                    <IconButton
                      isDisabled={page + 1 === pages}
                      variant="outline"
                      colorScheme="green"
                      icon={<ArrowRightIcon />}
                    />
                  }
                  pageCount={Math.min(10, pages)}
                  onPageChange={onPageChange}
                  containerClassName={"pagination-container"}
                  pageLinkClassName={"pagination-link"}
                  previousLinkClassName={"pagination-prev"}
                  nextLinkClassName={"pagination-next"}
                  activeLinkClassName={"pagination-link-active"}
                  disabledLinkClassName={"pagination-link-disabled"}
                />
              </nav>
            </Flex>
          )}
        </Flex>
      </Box>
    </>
  );
}

export default PropertyAndRoomList;
