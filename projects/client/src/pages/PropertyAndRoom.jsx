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
  Switch,
  FormControl,
  FormLabel,
  Select,
  Text,
  IconButton,
  Image,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Tag,
  Stack,
} from "@chakra-ui/react";
import { AddIcon, ArrowLeftIcon, ArrowRightIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";
import Axios from "axios";
import { useToast } from "@chakra-ui/react";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
import ReactPaginate from "react-paginate";
import { differenceInDays, format } from "date-fns";

function PropertyAndRoom(props) {
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [propertyData, setPropertyData] = React.useState([]);
  const toast = useToast();
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
  const [desc, setDesc] = React.useState(true);
  const [page, setPage] = React.useState(0);
  const [limit, setLimit] = React.useState(0);
  const [pages, setPages] = React.useState(0);
  const [rows, setRows] = React.useState(0);
  const [pageMessage, setPageMessage] = React.useState("");
  const [searchName, setSearchName] = React.useState("");
  const [searchCity, setSearchCity] = React.useState("");
  const [searchAddress, setSearchAddress] = React.useState("");
  const [roomList, setRoomList] = React.useState([]);
  const [modalData, setModalData] = React.useState("");
  const [clicked, setClicked] = React.useState(false);

  const getPropertyData = async () => {
    let url = `/property?tenant=${tenantId}&limit=${limit}&page=${page}`;
    let reqQuery = "";
    if (sortData) {
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
        process.env.REACT_APP_API_BASE_URL + `/property/roomlist/${tenantId}`
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
      const { name, address, isDeleted, propertyId, category } = property;
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
          onClick={
            filterRoom.length > 0 ? () => onBtnDetails(filterRoom) : () => onBtnDetails(property)
          }
        >
          <Td>
            <Flex mr={5} pr={5} align="center" gap={3}>
              <Image
                rounded={5}
                boxSize={{ base: "50px", md: "65px" }}
                src={process.env.REACT_APP_API_BASE_IMG_URL + property.image}
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

  const renderModalData = () => {
    if (clicked) {
      if (Array.isArray(modalData)) {
        const { name, image, phone, desc, address, category } = modalData[0].property;
        return (
          <ModalBody>
            <Heading mt={3} size="lg">
              {name}
            </Heading>
            <Flex mt={5} gap={2}>
              <Image boxSize={150} src={process.env.REACT_APP_API_BASE_IMG_URL + image} />
              <Stack>
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
                {modalData.map((val, idx) => {
                  const {
                    type: { name, typeImg, price, capacity },
                  } = val;
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
                      <Td>{}</Td>
                    </Tr>
                  );
                })}
              </Tbody>
            </Table>
          </ModalBody>
        );
      } else {
        const { image, name, phone, desc, address, category } = modalData;
        return (
          <ModalBody>
            <Heading mt={3} size="lg">
              {name}
            </Heading>
            <Flex mt={5} gap={2}>
              <Image boxSize={150} src={process.env.REACT_APP_API_BASE_IMG_URL + image} />
              <Stack>
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
            <Divider my={3} />
            <Heading textAlign="center" size="md">
              This property has no rooms
            </Heading>
          </ModalBody>
        );
      }
    }
  };

  const onBtnDetails = (data) => {
    setModalData(data);
    setClicked(true);
    onOpen();
  };

  const handleClose = () => {
    setClicked(false);
    onClose();
  };

  const handleEdit = async (propertyId) => {
    try {
      let response = await Axios.get(
        process.env.REACT_APP_API_BASE_URL + `/propety/check/${propertyId}`
      );
      if (response.data.success) {
        navigate(`/property/edit?${propertyId}`, { replace: true });
      }
    } catch (error) {
      console.log(error);
      if (!error.response.data.success) {
        Swal.fire({
          icon: "error",
          title: error.response.data.message,
          confirmButtonColor: "#38A169",
          confirmButtonText: "OK",
        });
      }
    }
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

  const onBtnSwitch = async (id, isDeleted) => {
    let changeStatus = !isDeleted;
    if (!isDeleted) {
      Swal.fire({
        title: "Are you sure you want to set this property as not active?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#38A169",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes",
        reverseButtons: true,
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            let response = await Axios.patch(
              process.env.REACT_APP_API_BASE_URL + `/property/update/${id}`,
              {
                isDeleted: changeStatus,
              }
            );
            if (response.data.success) {
              toast({
                title: response.data.message,
                status: "success",
                isClosable: true,
                duration: 2500,
                position: "top",
              });
              getPropertyData();
            }
          } catch (error) {
            console.log(error);
            if (!error.response.data.success) {
              Swal.fire({
                icon: "error",
                title: error.response.data.message,
                confirmButtonColor: "#38A169",
                confirmButtonText: "OK",
              });
            }
          }
        }
      });
    } else {
      try {
        let response = await Axios.patch(
          process.env.REACT_APP_API_BASE_URL + `/property/update/${id}`,
          {
            isDeleted: changeStatus,
          }
        );
        if (response.data.success) {
          toast({
            title: response.data.message,
            status: "success",
            isClosable: true,
            duration: 2500,
            position: "top",
          });
          getPropertyData();
        }
      } catch (error) {
        console.log(error);
        if (!error.response.data.success) {
          Swal.fire({
            icon: "error",
            title: error.response.data.message,
            confirmButtonColor: "#38A169",
            confirmButtonText: "OK",
          });
        }
      }
    }
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
  }, [page, filterAddress, filterCity, filterName, desc]);

  return (
    <Box pb="5" px={{ base: "5", md: "20" }}>
      <Heading mb={6}>Property List</Heading>
      <Flex direction="column">
        <Flex direction={{ base: "column", lg: "row" }} gap={6} mt="10" mb={6}>
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
      <Modal size="full" scrollBehavior="inside" onClose={handleClose} isOpen={isOpen} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          {renderModalData()}
          <ModalFooter>
            <Button onClick={handleClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}

export default PropertyAndRoom;
