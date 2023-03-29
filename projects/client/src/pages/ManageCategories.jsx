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
  Image,
} from "@chakra-ui/react";
import { AddIcon, ArrowLeftIcon, ArrowRightIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";
import Axios from "axios";
import { useToast } from "@chakra-ui/react";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
import ReactPaginate from "react-paginate";

function ManageCategories(props) {
  const navigate = useNavigate();
  const toast = useToast();
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
  const [isOpen, setIsOpen] = React.useState(false);
  const [selectedProvince, setSelectedProvince] = React.useState("");
  const [selectedCity, setSelectedCity] = React.useState("");

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

      setCategoryData([]);
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
      setProvince([]);
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
        setCity([]);
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
        </Tr>
      );
    });
  };

  const onBtnSearch = (e) => {
    e.preventDefault();
    setPage(0);
    setQueryData(searchData);
  };

  const handleSort = (data) => {
    setSortData(data);
    setDesc(!desc);
  };

  const onBtnAdd = async () => {
    const provinceName = province.filter((province) => {
      return province.id === selectedProvince;
    });
    console.log(`province name:`, provinceName[0].name);
    console.log(`city`, selectedCity);
    try {
      let response = await Axios.post(process.env.REACT_APP_API_BASE_URL + "/category/regis", {
        province: provinceName[0].name,
        city: selectedCity,
        tenantId: tenantId,
      });
      if (response.data.success) {
        Swal.fire({
          icon: "success",
          title: response.data.message,
          confirmButtonText: "OK",
          confirmButtonColor: "#48BB78",
        }).then(() => {
          setIsOpen(false);
          setSelectedProvince("");
          setSelectedCity("");
          getCategoryData();
        });
      }
    } catch (error) {
      console.log(error);
      Swal.fire({
        icon: "error",
        title: error.response.data.message,
        confirmButtonText: "OK",
        confirmButtonColor: "#48BB78",
      });
    }
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
  }, [page, queryData, desc]);

  return (
    <Box pb="5" px={{ base: "5", md: "20" }}>
      <Heading mb={6}>Manage Categories</Heading>
      <Flex direction="column">
        <Flex direction={{ base: "column", lg: "row" }} gap={6} mt="10" mb={6}>
          <Flex direction="column" gap={6}>
            {!isOpen ? (
              <Button
                colorScheme="green"
                variant="outline"
                onClick={() => {
                  setIsOpen(true);
                }}
              >
                <AddIcon boxSize={3} mr={2} />
                Add New Category
              </Button>
            ) : null}
            {isOpen ? (
              <Stack gap={3}>
                <Heading size="md">Add Category</Heading>
                <Flex direction="column" gap={3}>
                  <FormControl>
                    <FormLabel>Province</FormLabel>
                    <Select
                      value={selectedProvince}
                      placeholder="Select province"
                      onChange={(e) => setSelectedProvince(e.target.value)}
                    >
                      {province.map((val, idx) => {
                        return (
                          <option value={val.id} key={idx}>
                            {val.name}
                          </option>
                        );
                      })}
                    </Select>
                  </FormControl>
                  {city.length !== 0 ? (
                    <FormControl>
                      <FormLabel>City</FormLabel>
                      <Select
                        value={selectedCity}
                        onChange={(e) => setSelectedCity(e.target.value)}
                        placeholder="Select city"
                      >
                        {city.map((val, idx) => {
                          return <option key={idx}>{val.name}</option>;
                        })}
                      </Select>
                    </FormControl>
                  ) : null}
                </Flex>
                <Flex justify="space-between" gap={3}>
                  <Button onClick={() => setIsOpen(false)} colorScheme="green" variant="ghost">
                    Cancel
                  </Button>
                  <Button onClick={onBtnAdd} colorScheme="green">
                    Add
                  </Button>
                </Flex>
                <Divider />
              </Stack>
            ) : null}
            <Heading size="md">Search by</Heading>
            <Flex direction="column" gap={3}>
              <FormControl>
                <FormLabel>Province or City</FormLabel>
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
            <Flex mb={4} gap={3}>
              Sort By:
              <Button
                colorScheme="green"
                variant="link"
                onClick={() => {
                  handleSort("province");
                }}
              >
                Province
              </Button>
              <Button
                colorScheme="green"
                variant="link"
                onClick={() => {
                  handleSort("city");
                }}
              >
                City
              </Button>
            </Flex>
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Province</Th>
                  <Th>City</Th>
                  {/* <Th>Active</Th>
                  <Th>Action</Th> */}
                </Tr>
              </Thead>
              <Tbody>{renderCategoryData()}</Tbody>
              <TableCaption>
                <Flex>
                  <Text>
                    Total Rows: {rows} Page: {rows ? page + 1 : 0} of {pages}
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
    </Box>
  );
}

export default ManageCategories;
