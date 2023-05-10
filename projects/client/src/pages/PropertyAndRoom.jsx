import React, { useEffect } from "react";
import { Button, Flex, Heading, Input, Divider, Center, Box } from "@chakra-ui/react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
  FormControl,
  FormLabel,
  Select,
  Text,
  IconButton,
  Image,
} from "@chakra-ui/react";
import { ArrowLeftIcon, ArrowRightIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";
import Axios from "axios";
import { useSelector } from "react-redux";
import ReactPaginate from "react-paginate";

function PropertyAndRoom(props) {
  const navigate = useNavigate();
  const [propertyData, setPropertyData] = React.useState([]);
  const { tenantId } = useSelector((state) => {
    return {
      tenantId: state.tenantReducer.tenantId,
    };
  });
  const [city, setCity] = React.useState([]);
  const [filterName, setFilterName] = React.useState("");
  const [filterCity, setFilterCity] = React.useState("");
  const [filterAddress, setFilterAddress] = React.useState("");
  const [sortData, setSortData] = React.useState("");
  const [desc, setDesc] = React.useState(false);
  const [page, setPage] = React.useState(0);
  const [limit, setLimit] = React.useState(0);
  const [pages, setPages] = React.useState(0);
  const [rows, setRows] = React.useState(0);
  const [pageMessage, setPageMessage] = React.useState("");
  const [searchName, setSearchName] = React.useState("");
  const [searchCity, setSearchCity] = React.useState("");
  const [searchAddress, setSearchAddress] = React.useState("");
  const [roomList, setRoomList] = React.useState([]);

  const getPropertyData = async () => {
    let url = `/property?tenant=${tenantId}&limit=${limit}&page=${page}`;
    let reqQuery = "";
    if (sortData !== "") {
      if (desc) {
        reqQuery += `&sortby=${sortData}&order=desc`;
      } else {
        reqQuery += `&sortby=${sortData}`;
      }
    }
    if (filterName) {
      reqQuery += `&name=${filterName}`;
    }
    if (filterCity) {
      reqQuery += `&city=${filterCity}`;
    }
    if (filterAddress) {
      reqQuery += `&address=${filterAddress}`;
    }
    try {
      let response = await Axios.get(process.env.REACT_APP_API_BASE_URL + url + reqQuery);
      setPropertyData(response.data.data);
      setPage(response.data.page);
      setPages(response.data.totalPage);
      setRows(response.data.totalRows);
    } catch (error) {
      console.log(error);
      setPropertyData(error.response.data.data);
    }
  };

  const getRoomList = async () => {
    try {
      let response = await Axios.get(
        process.env.REACT_APP_API_BASE_URL + `/property/roomlist/count/${tenantId}`
      );
      setRoomList(response.data.data);
    } catch (error) {
      console.log(error);
      setRoomList(error.response.data.data);
    }
  };

  const getCityData = async () => {
    try {
      let response = await Axios.get(process.env.REACT_APP_API_BASE_URL + `/category/${tenantId}`);
      setCity(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const renderPropertyData = () => {
    if (propertyData.length === 0) {
      return (
        <Tr>
          <Td colSpan="5">
            <Text fontSize="lg" align="center">
              DATA NOT FOUND
            </Text>
          </Td>
        </Tr>
      );
    }
    return propertyData.map((property, idx) => {
      const { name, address, propertyId, category } = property;
      let filterRoom = [];
      if (roomList.length > 0) {
        filterRoom = roomList.filter((val) => {
          return val.propertyId === propertyId;
        });
      }
      return (
        <Tr
          key={idx}
          _hover={{ bg: "gray.100", cursor: "pointer" }}
          onClick={() => navigate(`/property-list/room?${propertyId}`, { replace: true })}
        >
          <Td>
            <Flex mr={5} pr={5} align="center" gap={3}>
              <Image
                rounded={5}
                boxSize={{ base: "50px", md: "65px" }}
                src={process.env.REACT_APP_BASE_IMG_URL + property.image}
              />
              <Text>{name}</Text>
            </Flex>
          </Td>
          <Td textAlign="center">{filterRoom.length}</Td>
          <Td>{`${category.province} - ${category.city}`}</Td>
          <Td whiteSpace={{ base: "nowrap", md: "normal" }}>
            <Text noOfLines={1}>{address}</Text>
          </Td>
        </Tr>
      );
    });
  };

  const onBtnSearch = (e) => {
    e.preventDefault();
    setPage(0);
    setFilterName(searchName);
    setFilterCity(searchCity);
    setFilterAddress(searchAddress);
  };

  const handleSort = (data) => {
    setSortData(data);
    setDesc(!desc);
  };

  const onBtnReset = () => {
    setFilterAddress("");
    setFilterName("");
    setFilterCity("");
    setSearchName("");
    setSearchAddress("");
    setSearchCity("");
    setSortData("");
    getPropertyData();
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
    getCityData();
    getRoomList();
  }, []);

  useEffect(() => {
    getPropertyData();
  }, [page, filterAddress, filterCity, filterName, desc, sortData]);

  return (
    <Box pb="5" px={{ base: "5", md: "20" }}>
      <Heading mb={6}>Property List</Heading>
      <Flex direction="column">
        <Flex
          height={{ md: "660px" }}
          direction={{ base: "column", lg: "row" }}
          gap={6}
          mt="10"
          mb={6}
        >
          <Flex direction="column" gap={6}>
            <Heading size="md">Search by</Heading>
            <Flex direction="column" gap={3}>
              <FormControl>
                <FormLabel>Name</FormLabel>
                <Input value={searchName} onChange={(e) => setSearchName(e.target.value)} />
              </FormControl>
              <FormControl>
                <FormLabel>City</FormLabel>
                <Select
                  name="city"
                  value={searchCity}
                  onChange={(e) => setSearchCity(e.target.value)}
                  placeholder="Select City"
                >
                  {city.map((val, idx) => {
                    return (
                      <option
                        value={val.categoryId}
                        key={idx}
                      >{`${val.province} - ${val.city}`}</option>
                    );
                  })}
                </Select>
              </FormControl>
              <FormControl>
                <FormLabel>Address</FormLabel>
                <Input value={searchAddress} onChange={(e) => setSearchAddress(e.target.value)} />
              </FormControl>
            </Flex>
            <Flex justify="space-between" gap={3}>
              <Button onClick={onBtnReset} colorScheme="green" variant="ghost">
                Reset
              </Button>
              <Button onClick={onBtnSearch} colorScheme="green">
                Search
              </Button>
            </Flex>
          </Flex>
          <Center>
            <Divider orientation="vertical" />
          </Center>
          <TableContainer width="100%">
            <Flex mb={4} gap={3}>
              Sort By:
              <Button
                colorScheme="green"
                variant="link"
                onClick={() => {
                  handleSort("name");
                }}
              >
                Name
              </Button>
              <Button
                colorScheme="green"
                variant="link"
                onClick={() => {
                  handleSort("address");
                }}
              >
                Address
              </Button>
            </Flex>
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Name</Th>
                  <Th>Rooms</Th>
                  <Th>City</Th>
                  <Th>Address</Th>
                </Tr>
              </Thead>
              <Tbody>{renderPropertyData()}</Tbody>
              <TableCaption>
                <Flex>
                  <Text>
                    Page: {rows ? page + 1 : 0} of {pages}
                  </Text>
                </Flex>
              </TableCaption>
            </Table>
          </TableContainer>
        </Flex>
        {pages === 0 ? null : (
          <Flex justify="center">
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
  );
}

export default PropertyAndRoom;
