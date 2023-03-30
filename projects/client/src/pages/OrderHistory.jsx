import React, { useEffect } from "react";
import { Button, Flex, Heading, Input, Divider, Center, Box, Stack } from "@chakra-ui/react";
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
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from "@chakra-ui/react";
import { AddIcon, ArrowLeftIcon, ArrowRightIcon } from "@chakra-ui/icons";
import Axios from "axios";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
import ReactPaginate from "react-paginate";

function OrderHistory(props) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { tenantId } = useSelector((state) => {
    return {
      tenantId: state.tenantReducer.tenantId,
    };
  });
  const [categoryData, setCategoryData] = React.useState([]);
  const [sortData, setSortData] = React.useState("");
  const [desc, setDesc] = React.useState(false);
  const [page, setPage] = React.useState(0);
  const [limit, setLimit] = React.useState(0);
  const [pages, setPages] = React.useState(0);
  const [rows, setRows] = React.useState(0);
  const [pageMessage, setPageMessage] = React.useState("");
  const [searchData, setSearchData] = React.useState("");
  const [queryData, setQueryData] = React.useState("");

  const [province, setProvince] = React.useState([]);
  const [city, setCity] = React.useState([]);
  const [selectedProvince, setSelectedProvince] = React.useState("");
  const [selectedCity, setSelectedCity] = React.useState("");
  const [selectedStatus, setSelectedStatus] = React.useState(null);

  const getCategoryData = async () => {
    let endpoint = [`/category?tenant=${tenantId}&limit=${limit}&page=${page}&`];
    let reqQuery = [];
    if (sortData !== "") {
      if (desc) {
        reqQuery.push(`sortby=${sortData}&order=desc`);
      } else {
        reqQuery.push(`sortby=${sortData}`);
      }
    }
    if (queryData !== "") {
      reqQuery.push(`search=${queryData}`);
    }
    console.log(endpoint + reqQuery.join("&"));
    try {
      let response = await Axios.get(
        process.env.REACT_APP_API_BASE_URL + endpoint + reqQuery.join("&")
      );
      setCategoryData(response.data.data);
      setPage(response.data.page);
      setPages(response.data.totalPage);
      setRows(response.data.totalRows);
    } catch (error) {
      console.log(error);
    }
  };

  const getProvinceData = async () => {
    try {
      let response = await Axios.get(
        "http://www.emsifa.com/api-wilayah-indonesia/api/provinces.json"
      );
      setProvince(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getCityData = async () => {
    if (province.length !== 0) {
      try {
        let response = await Axios.get(
          `http://www.emsifa.com/api-wilayah-indonesia/api/regencies/${selectedProvince}.json`
        );
        setCity(response.data);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const renderCategoryData = () => {
    if (categoryData.length === 0) {
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
    return categoryData.map((category, idx) => {
      const { city, province } = category;
      return (
        <Tr key={idx}>
          <Td>
            <Text>{province}</Text>
          </Td>
          <Td>{city}</Td>
          <Td>{city}</Td>
          <Td>{city}</Td>
          <Td>{city}</Td>
          <Td>
            <Select>
              <option value="option1" hidden>
                Action
              </option>
              <option value="option2">Confirm</option>
              <option value="option3">Reject</option>
              <option value="option4" onClick={onOpen}>
                Details
              </option>
            </Select>
          </Td>
        </Tr>
      );
    });
  };

  const onBtnSearch = (e) => {
    e.preventDefault();
    setPage(0);
    setQueryData(searchData);
  };

  const onBtnReset = () => {
    setQueryData("");
    setSearchData("");
    setSortData("");
    getCategoryData();
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
    getProvinceData();
  }, []);

  useEffect(() => {
    getCityData();
  }, [selectedProvince]);

  useEffect(() => {
    getCategoryData();
  }, [page, queryData, selectedStatus]);

  return (
    <Box pb="5" px={{ base: "5", md: "20" }}>
      <Heading mb={6}>Order History</Heading>
      <Flex direction="column">
        <Flex direction={{ base: "column", lg: "row" }} gap={6} mt="10" mb={6}>
          <Flex direction="column" gap={6}>
            <Heading size="md">Search by</Heading>
            <Flex direction="column" gap={3}>
              <FormControl>
                <FormLabel>Booking Number</FormLabel>
                <Input value={searchData} onChange={(e) => setSearchData(e.target.value)} />
              </FormControl>
              <FormControl>
                <FormLabel>Property</FormLabel>
                <Input value={searchData} onChange={(e) => setSearchData(e.target.value)} />
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
            <Flex mb={4} gap={3} align="center">
              Status:
              <Button
                colorScheme="yellow"
                variant="outline"
                onClick={() => {
                  selectedStatus === "Waiting for payment"
                    ? setSelectedStatus(null)
                    : setSelectedStatus("Waiting for payment");
                }}
                isActive={selectedStatus === "Waiting for payment"}
              >
                Waiting for payment
              </Button>
              <Button
                colorScheme="blue"
                variant="outline"
                onClick={() => {
                  selectedStatus === "Waiting for confirmation"
                    ? setSelectedStatus(null)
                    : setSelectedStatus("Waiting for confirmation");
                }}
                isActive={selectedStatus === "Waiting for confirmation"}
              >
                Waiting for confirmation
              </Button>
              <Button
                colorScheme="green"
                variant="outline"
                onClick={() => {
                  selectedStatus === "Confirmed"
                    ? setSelectedStatus(null)
                    : setSelectedStatus("Confirmed");
                }}
                isActive={selectedStatus === "Confirmed"}
              >
                Confirmed
              </Button>
              <Button
                colorScheme="red"
                variant="outline"
                onClick={() => {
                  selectedStatus === "Cancelled"
                    ? setSelectedStatus(null)
                    : setSelectedStatus("Cancelled");
                }}
                isActive={selectedStatus === "Cancelled"}
              >
                Cancelled
              </Button>
            </Flex>
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Booking Number</Th>
                  <Th>Property Name</Th>
                  <Th>Room Type</Th>
                  <Th>Price</Th>
                  <Th>Status</Th>
                  <Th></Th>
                </Tr>
              </Thead>
              <Tbody>{renderCategoryData()}</Tbody>
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
      </Flex>
      <Modal onClose={onClose} isOpen={isOpen} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Order Details</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Heading size="md">Booking No: </Heading>
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}

export default OrderHistory;
