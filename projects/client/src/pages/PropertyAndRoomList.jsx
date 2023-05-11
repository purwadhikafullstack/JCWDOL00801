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
  useDisclosure,
  TableContainer,
  Spinner,
  Radio,
  RadioGroup,
  Input,
  InputGroup,
  InputLeftAddon,
  InputRightAddon,
  NumberInput,
  NumberInputField,
  HStack,
} from "@chakra-ui/react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Axios from "axios";
import { ArrowLeftIcon, ArrowRightIcon } from "@chakra-ui/icons";
import ReactPaginate from "react-paginate";
import CalendarDateRange from "../components/CalendarDateRange";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import { clearAllDate } from "../actions/dateAction";

function PropertyAndRoomList(props) {
  const { search } = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { startDate, endDate, email } = useSelector((state) => {
    return {
      startDate: state.dateReducer.startDate,
      endDate: state.dateReducer.endDate,
      email: state.userReducer.email,
    };
  });
  const [nominal, setNominal] = useState(0);
  const [percentage, setPercentage] = useState(0);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [currentModal, setCurrentModal] = useState("none");
  const [roomList, setRoomList] = React.useState([]);
  const [propertyData, setPropertyData] = React.useState("");
  const [page, setPage] = React.useState(0);
  const [pageModal, setPageModal] = React.useState(0);
  const [limit, setLimit] = React.useState(0);
  const [limitModal, setLimitModal] = React.useState(0);
  const [pages, setPages] = React.useState(0);
  const [pagesModal, setPagesModal] = React.useState(0);
  const [radioValue, setRadioValue] = useState("nominal");
  const [specialPriceData, setSpecialPriceData] = useState([]);
  const [rows, setRows] = React.useState(0);
  const [rowsModal, setRowsModal] = React.useState(0);
  const [modalDataAvail, setModalDataAvail] = useState([]);
  const [modalDataPrice, setModalDataPrice] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [pageMessage, setPageMessage] = React.useState("");
  const [selectedOption, setSelectedOption] = React.useState("");
  const [filterDate, setFilterDate] = useState(false);
  const [sortData, setSortData] = useState("");
  const [desc, setDesc] = useState(false);
  const [selectedTypeData, setSelectedTypeData] = useState(0);
  const [selectedRoomData, setSelectedRoomData] = useState(0);

  const getRoomList = async () => {
    const propertyId = search.split("?")[1];
    const endpoint = "";
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
            <Image boxSize={150} src={process.env.REACT_APP_BASE_IMG_URL + image} />
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
  const resetHandler = () => {
    setDesc(false);
    setFilterDate(false);
    setSortData(false);
  };
  const onInputSpPChange = (e) => {
    if (e != "+" || e == "-") {
      if (e == "-" || (e < 301 && e > -101)) {
        setPercentage(e);
        const finalPrice =
          e === 0 || e === "-"
            ? specialPriceData.price
            : parseInt(specialPriceData.price) + (parseInt(specialPriceData.price) * e) / 100;
        setNominal(finalPrice);
      }
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
  const getContent = (selected, modal) => {
    setIsLoading(true);
    let query = [];
    const currentDesc = !desc;
    setDesc(currentDesc);
    if (sortData !== "") {
      if (currentDesc) {
        query.push(`&sort=${sortData}&order=desc`);
      } else {
        query.push(`&sort=${sortData}&order=asc`);
      }
    }
    if (filterDate) {
      query.push(
        `&startDate=${new Date(startDate).getTime()}&endDate=${new Date(endDate).getTime()}`
      );
    }
    if (modal === "specialprice") {
      const endpoint = `/special-price/all?id=${selectedTypeData}&limit=${limitModal}&page=${
        selected || pageModal || 0
      }`;
      Axios.get(process.env.REACT_APP_API_BASE_URL + endpoint + query.join(""))
        .then((response) => {
          setSpecialPriceData(response.data.necessaryData[0]);
          setModalDataPrice(response.data.data);
          setPageModal(response.data.page);
          setPagesModal(response.data.totalPage);
          setRowsModal(response.data.totalRows);
          setIsLoading(false);
        })
        .catch((error) => {
          console.log(error);
          setPagesModal(0);
          setPageModal(0);
          setModalDataPrice([]);
          setModalDataAvail([]);
          setSpecialPriceData([]);
          setIsLoading(false);
        });
    } else if (modal === "avail") {
      const endpoint = `/room-availability/all?id=${selectedRoomData}&limit=${limitModal}&page=${
        selected || 0
      }`;
      Axios.get(process.env.REACT_APP_API_BASE_URL + endpoint + query.join(""))
        .then((response) => {
          setModalDataAvail(response.data.data);
          setPageModal(response.data.page);
          setPagesModal(response.data.totalPage);
          setRowsModal(response.data.totalRows);
          setIsLoading(false);
        })
        .catch((error) => {
          console.log(error);
          setPagesModal(0);
          setPageModal(0);
          setModalDataPrice([]);
          setModalDataAvail([]);
          setSpecialPriceData([]);
          setIsLoading(false);
        });
    }
  };
  const onPageChangeModal = ({ selected }) => {
    setPageModal(selected);
    if (selected === 9) {
      setPageMessage(
        `If you can't find the data you're looking for, please try using a more specific keyword`
      );
      getContent(selected, currentModal);
    } else {
      getContent(selected, currentModal);
    }
  };
  const submitHandler = async () => {
    try {
      if (currentModal === "setAvailability") {
        const res = await Axios.post(
          process.env.REACT_APP_API_BASE_URL + "/room-availability/add",
          {
            roomId: selectedRoomData,
            startDate,
            endDate,
          }
        );
        onClose();
        Swal.fire({
          title: res.data.message,
          icon: "success",
          confirmButtonColor: "#48BB78",
          confirmButtonText: "Confirm",
          timer: 3000,
        }).then((response) => {
          setCurrentModal("avail");
          onOpen();
          dispatch(clearAllDate());
          getContent(0, "avail");
        });
      } else if (currentModal === "setSpecialPrice") {
        onClose();
        Swal.fire({
          title: "DESCLAIMER!",
          text: "By adding a new special price will also add to other rooms with the same type. Proceed?",
          confirmButtonColor: "#48BB78",
          showDenyButton: true,
          denyButtonColor: "red",
          denyButtonText: "Cancel",
          confirmButtonText: "Confirm",
          icon: "question",
          reverseButtons: true,
        }).then((response) => {
          if (response.isConfirmed) {
            if (
              radioValue === "percentage" &&
              parseInt(specialPriceData.price) !== parseInt(nominal) &&
              percentage !== 0
            ) {
              Axios.post(process.env.REACT_APP_API_BASE_URL + "/special-price/add", {
                startDate,
                endDate,
                nominal,
                percentage,
                roomId: selectedRoomData,
                typeId: selectedTypeData,
              })
                .then((res) => {
                  Swal.fire({
                    title: res.data.message,
                    icon: "success",
                    confirmButtonColor: "#48BB78",
                    confirmButtonText: "Confirm",
                    timer: 3000,
                  })
                    .then((response) => {
                      setCurrentModal("specialprice");
                      onOpen();
                      dispatch(clearAllDate());
                      getContent(0, "specialprice");
                      setPercentage(0);
                      setNominal(0);
                    })
                    .catch((e) => {
                      onClose();
                      Swal.fire({
                        title: e.response.data.message,
                        icon: "error",
                        confirmButtonColor: "#48BB78",
                        confirmButtonText: "Confirm",
                        timer: 5000,
                      }).then((res) => {
                        onOpen();
                        setRadioValue("nominal");
                        dispatch(clearAllDate());
                        getContent(0, "specialprice");
                      });
                    });
                })
                .catch((e) => {
                  onClose();
                  Swal.fire({
                    title: e.response.data.message,
                    icon: "error",
                    confirmButtonColor: "#48BB78",
                    confirmButtonText: "Confirm",
                    timer: 5000,
                  }).then((res) => {
                    onOpen();
                    setRadioValue("nominal");
                    dispatch(clearAllDate());
                    getContent(0, "specialprice");
                  });
                });
            } else if (
              radioValue === "nominal" &&
              parseInt(nominal) !== 0 &&
              parseInt(specialPriceData.price) !== parseInt(nominal)
            ) {
              Axios.post(process.env.REACT_APP_API_BASE_URL + "/special-price/add", {
                startDate,
                endDate,
                nominal,
                percentage: 0,
                roomId: selectedRoomData,
                typeId: selectedTypeData,
              })
                .then((res) => {
                  Swal.fire({
                    title: res.data.message,
                    icon: "success",
                    confirmButtonColor: "#48BB78",
                    confirmButtonText: "Confirm",
                    timer: 3000,
                  })
                    .then((response) => {
                      setCurrentModal("specialprice");
                      onOpen();
                      dispatch(clearAllDate());
                      getContent(0, "specialprice");
                      setPercentage(0);
                      setNominal(0);
                    })
                    .catch((e) => {
                      onClose();
                      Swal.fire({
                        title: e.response.data.message,
                        icon: "error",
                        confirmButtonColor: "#48BB78",
                        confirmButtonText: "Confirm",
                        timer: 5000,
                      }).then((res) => {
                        onOpen();
                        setRadioValue("nominal");
                        dispatch(clearAllDate());
                        getContent(0, "specialprice");
                      });
                    });
                })
                .catch((e) => {
                  onClose();
                  Swal.fire({
                    title: e.response.data.message,
                    icon: "error",
                    confirmButtonColor: "#48BB78",
                    confirmButtonText: "Confirm",
                    timer: 5000,
                  }).then((res) => {
                    onOpen();
                    setRadioValue("nominal");
                    dispatch(clearAllDate());
                    getContent(0, "specialprice");
                  });
                });
            } else {
              Swal.fire({
                title:
                  radioValue === "nominal"
                    ? "Nominal and current type price is identical or special price is 0"
                    : "Percentage not changed",
                text:
                  radioValue === "nominal"
                    ? "if you want to make it FREE, please use percentage"
                    : null,
                icon: "error",
                confirmButtonColor: "#48BB78",
                confirmButtonText: "Confirm",
                timer: 3000,
              }).then((resp) => {
                setRadioValue("nominal");
                onOpen();
              });
            }
          } else if (response.isDenied) {
            setRadioValue("nominal");
            onOpen();
          }
        });
      }
    } catch (error) {
      if (currentModal == "setAvailability" || currentModal == "setSpecialPrice") {
        onClose();
        Swal.fire({
          title: error.response.data.message,
          icon: "error",
          confirmButtonColor: "#48BB78",
          confirmButtonText: "Confirm",
          timer: 5000,
        }).then((res) => {
          onOpen();
          setRadioValue("nominal");
          dispatch(clearAllDate());
          getContent();
        });
      }
      console.log(error);
      getContent();
    }
  };
  const renderRoom = () => {
    if (roomList.length > 0) {
      return (
        <Table mt={6} variant="simple">
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
                        src={process.env.REACT_APP_BASE_IMG_URL + typeImg}
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
                    <Select w="50%" value={selectedOption} onChange={(e) => setSelectedOption(e)}>
                      <option hidden value="">
                        Action
                      </option>
                      <option
                        onClick={() => {
                          setSelectedRoomData(val.roomId);
                          setSelectedTypeData(val.typeId);
                          setFilterDate(false);
                          setSortData("");
                          setDesc(false);
                          setCurrentModal("avail");
                          dispatch(clearAllDate());
                          getContent(0, "avail");
                          onOpen();
                        }}
                      >
                        Set Availability
                      </option>
                      <option
                        onClick={() => {
                          setSelectedRoomData(val.roomId);
                          setSelectedTypeData(val.typeId);
                          setCurrentModal("specialprice");
                          setRadioValue("nominal");
                          setFilterDate(false);
                          setSortData("");
                          setDesc(false);
                          dispatch(clearAllDate());
                          getContent(0, "specialprice");
                          onOpen();
                        }}
                      >
                        Set Special Price
                      </option>
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

  useEffect(() => {
    getPropertyData();
  }, []);

  useEffect(() => {
    getRoomList();
  }, [page, selectedOption]);
  useEffect(() => {
    getContent(0, currentModal);
  }, [selectedRoomData, selectedTypeData, sortData, filterDate]);

  return (
    <>
      <Box pb={5} px={{ base: "5", md: "20" }} overflow={"auto"}>
        <Flex height={{ md: roomList.length < 5 ? "770px" : "860px" }} direction={"column"}>
          <Flex direction={"column"}>
            <Heading mb={5}>Room List</Heading>
            {renderProperty()}
            {renderRoom()}
          </Flex>
        </Flex>
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
        <Modal
          isCentered={props.isMobile ? false : true}
          allowPinchZoom
          isOpen={isOpen}
          onClose={onClose}
          size={props.isMobile ? "full" : currentModal === "specialprice" ? "5xl" : "2xl"}
        >
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>
              {currentModal === "avail" || currentModal === "setAvailability"
                ? "Set Room Availability"
                : "Set Special Price"}
            </ModalHeader>
            <ModalCloseButton
              onClick={() => {
                dispatch(clearAllDate());
                setSelectedOption("");
                setPercentage(0);
                setRadioValue("nominal");
                setNominal(0);
              }}
            />
            <ModalBody>
              {currentModal === "avail" ? (
                <>
                  <Button
                    variant={"outline"}
                    colorScheme="green"
                    onClick={() => {
                      onClose();
                      dispatch(clearAllDate());
                      setCurrentModal("setAvailability");
                      onOpen();
                    }}
                    mb={4}
                  >
                    Add Not Available Room Date
                  </Button>
                  <HStack gap={2}>
                    <CalendarDateRange />
                    <Button
                      variant={"outline"}
                      colorScheme="green"
                      size="sm"
                      onClick={resetHandler}
                    >
                      Reset
                    </Button>
                    <Button
                      variant={"solid"}
                      colorScheme="green"
                      size="sm"
                      onClick={() => {
                        setFilterDate(true);
                        getContent(0, currentModal);
                      }}
                    >
                      Search
                    </Button>
                  </HStack>
                  <HStack mt={2}>
                    <Text fontSize={"14px"}>Sort by :</Text>
                    <Button
                      variant={"link"}
                      colorScheme="blue"
                      size="sm"
                      onClick={() => {
                        setSortData("startDate");
                        getContent(0, currentModal);
                      }}
                    >
                      Start Date
                    </Button>
                  </HStack>
                  <TableContainer overflow={"scroll"}>
                    <Table variant={"simple"}>
                      <Thead>
                        <Th>Start Date</Th>
                        <Th>End Date</Th>
                        <Th>Action</Th>
                      </Thead>
                      <Tbody>
                        {isLoading ? (
                          <Td colSpan={3} textAlign={"center"}>
                            <Spinner />
                          </Td>
                        ) : modalDataAvail.length < 1 ? (
                          <Td colSpan={3} textAlign={"center"}>
                            Not Found
                          </Td>
                        ) : (
                          <>
                            {modalDataAvail.map((val, idx) => {
                              const deleteHandler = () => {
                                if (currentModal === "avail") {
                                  onClose();
                                  Swal.fire({
                                    title: `By deleting this, you make the room available from ${new Date(
                                      val.startDate
                                    )
                                      .toString()
                                      .substring(0, 24)} to ${new Date(val.endDate)
                                      .toString()
                                      .substring(0, 24)}`,
                                    icon: "warning",
                                    denyButtonColor: "red",
                                    denyButtonText: "Cancel",
                                    showDenyButton: true,
                                    confirmButtonColor: "#48BB78",
                                    confirmButtonText: "Confirm",
                                    reverseButtons: true,
                                  }).then((response) => {
                                    if (response.isConfirmed) {
                                      onClose();
                                      Axios.patch(
                                        process.env.REACT_APP_API_BASE_URL +
                                          "/room-availability/delete",
                                        {
                                          raId: val.raId,
                                          email,
                                        }
                                      )
                                        .then((res) => {
                                          Swal.fire({
                                            title: res.data.message,
                                            icon: "success",
                                            confirmButtonColor: "#48BB78",
                                            confirmButtonText: "Confirm",
                                            timer: 5000,
                                          }).then((resp) => {
                                            getContent(0, "avail");
                                            onOpen();
                                          });
                                        })
                                        .catch((e) => {
                                          onClose();
                                          Swal.fire({
                                            title: e.response.data.message,
                                            icon: "error",
                                            confirmButtonColor: "#48BB78",
                                            confirmButtonText: "Confirm",
                                            timer: 5000,
                                          }).then((res) => {
                                            onOpen();
                                            getContent();
                                          });
                                        });
                                    }
                                  });
                                }
                              };
                              return (
                                <>
                                  <Tr>
                                    <Td>{new Date(val.startDate).toString().substring(0, 24)}</Td>
                                    <Td>{new Date(val.endDate).toString().substring(0, 24)}</Td>
                                    <Td>
                                      <Button
                                        variant={"outline"}
                                        colorScheme="green"
                                        onClick={deleteHandler}
                                      >
                                        Delete
                                      </Button>
                                    </Td>
                                  </Tr>
                                </>
                              );
                            })}
                          </>
                        )}
                      </Tbody>
                    </Table>
                  </TableContainer>
                </>
              ) : currentModal === "specialprice" ? (
                <>
                  <Button
                    variant={"outline"}
                    colorScheme="green"
                    onClick={() => {
                      onClose();
                      setNominal(0);
                      setPercentage(0);
                      dispatch(clearAllDate());
                      setCurrentModal("setSpecialPrice");
                      onOpen();
                    }}
                    mb={4}
                  >
                    Add New Special Price
                  </Button>
                  <HStack gap={2}>
                    <CalendarDateRange />
                    <Button
                      variant={"outline"}
                      colorScheme="green"
                      size="sm"
                      onClick={resetHandler}
                    >
                      Reset
                    </Button>
                    <Button
                      variant={"solid"}
                      colorScheme="green"
                      size="sm"
                      onClick={() => {
                        setFilterDate(true);
                        getContent(0, currentModal);
                      }}
                    >
                      Search
                    </Button>
                  </HStack>
                  <HStack mt={3}>
                    <Text>Sort by :</Text>
                    <Button
                      variant={"link"}
                      colorScheme="blue"
                      onClick={() => {
                        setSortData("startDate");
                        getContent(0, currentModal);
                      }}
                    >
                      Start Date
                    </Button>
                    <Button
                      variant={"link"}
                      colorScheme="blue"
                      onClick={() => {
                        setSortData("nominal");
                        getContent(0, currentModal);
                      }}
                    >
                      Nominal
                    </Button>
                  </HStack>
                  <TableContainer>
                    <Table>
                      <Thead>
                        <Th>Type Name</Th>
                        <Th>Start Date</Th>
                        <Th>End Date</Th>
                        <Th>Percentage / Nominal</Th>
                        <Th>Action</Th>
                      </Thead>
                      <Tbody>
                        {isLoading ? (
                          <Td colSpan={5} textAlign={"center"}>
                            <Spinner />
                          </Td>
                        ) : modalDataPrice.length > 0 ? (
                          <>
                            {modalDataPrice.map((val) => {
                              const deleteHandlerPrice = () => {
                                if (currentModal === "specialprice") {
                                  onClose();
                                  Swal.fire({
                                    title: `Attention!`,
                                    text: `By deleting special price, it will also affect to other room with type room "${val.name}", proceed?`,
                                    icon: "warning",
                                    denyButtonColor: "red",
                                    denyButtonText: "Cancel",
                                    showDenyButton: true,
                                    confirmButtonColor: "#48BB78",
                                    confirmButtonText: "Confirm",
                                    reverseButtons: true,
                                  })
                                    .then((res) => {
                                      if (res.isConfirmed) {
                                        Axios.patch(
                                          process.env.REACT_APP_API_BASE_URL +
                                            "/special-price/delete",
                                          {
                                            email,
                                            spId: val.spId,
                                          }
                                        ).then((resp) => {
                                          Swal.fire({
                                            title: resp.data.message,
                                            icon: "success",
                                            confirmButtonColor: "#48BB78",
                                            confirmButtonText: "Confirm",
                                            timer: 5000,
                                          }).then((resp) => {
                                            onOpen();
                                            getContent(0, "specialprice");
                                          });
                                        });
                                      } else {
                                        onOpen();
                                      }
                                    })
                                    .catch((e) => {
                                      onClose();
                                      Swal.fire({
                                        title: e.response.data.message,
                                        icon: "error",
                                        confirmButtonColor: "#48BB78",
                                        confirmButtonText: "Confirm",
                                        timer: 5000,
                                      }).then((res) => {
                                        onOpen();
                                        getContent();
                                      });
                                    });
                                }
                              };
                              return (
                                <Tr>
                                  <Td>{val.name}</Td>
                                  <Td>{new Date(val.startDate).toString().substring(4, 24)}</Td>
                                  <Td>{new Date(val.endDate).toString().substring(4, 24)}</Td>
                                  <Td>
                                    {val.percentage ? `${val.percentage}% / ` : ""}
                                    {parseInt(val.nominal).toLocaleString("ID", {
                                      style: "currency",
                                      currency: "IDR",
                                    })}
                                  </Td>
                                  <Td>
                                    <Button
                                      variant={"outline"}
                                      colorScheme="green"
                                      onClick={deleteHandlerPrice}
                                    >
                                      Delete
                                    </Button>
                                  </Td>
                                </Tr>
                              );
                            })}{" "}
                          </>
                        ) : (
                          <Td colSpan={4} textAlign={"center"}>
                            Not Found
                          </Td>
                        )}
                      </Tbody>
                    </Table>
                  </TableContainer>
                </>
              ) : currentModal === "setAvailability" ? (
                <>
                  <Text fontWeight="600" mb={2}>
                    Please choose the date to set the room to be unavailble
                  </Text>
                  <CalendarDateRange direction="vertical" />
                  {/* <RadioGroup defaultValue="avail">
                            <Stack direction={"row"} gap="2">
                              <Radio value="avail">Available</Radio>
                              <Radio value="notAvail">Not Available</Radio>
                              </Stack>
                            </RadioGroup> */}
                </>
              ) : currentModal === "setSpecialPrice" ? (
                <Box>
                  <Text fontWeight="600" mb={2}>
                    Please choose the date to set the type's special price
                  </Text>
                  <Text fontSize={"14px"} mb={2}>
                    <span style={{ color: "red" }}>*</span>{" "}
                    <span style={{ fontWeight: 600 }}>DESCLAIMER:</span> The special price will also
                    be added to other rooms that have the same type
                  </Text>
                  <CalendarDateRange direction="vertical" />
                  <RadioGroup
                    colorScheme="green"
                    defaultValue="nominal"
                    mt={2}
                    onChange={(e) => {
                      setRadioValue(e);
                      setNominal(0);
                      setPercentage(0);
                    }}
                  >
                    <Stack direction={"row"} gap="2">
                      <Radio value="nominal">Nominal</Radio>
                      <Radio value="percentage">Percentage</Radio>
                    </Stack>
                  </RadioGroup>
                  <Box>
                    {radioValue === "nominal" ? (
                      <>
                        <Text fontWeight="600" mt={4}>
                          Type Price:{" "}
                          {isLoading ? (
                            <Spinner />
                          ) : (
                            parseInt(specialPriceData.price).toLocaleString("ID", {
                              style: "currency",
                              currency: "IDR",
                            })
                          )}
                        </Text>
                        <Text mt={1}>Please input your special price here:</Text>

                        <InputGroup>
                          <InputLeftAddon children="Rp." />
                          <NumberInput
                            min={0}
                            value={nominal}
                            onChange={setNominal}
                            focusBorderColor="#48BB78"
                          >
                            <NumberInputField />
                          </NumberInput>
                        </InputGroup>
                      </>
                    ) : radioValue === "percentage" ? (
                      <>
                        <Text fontWeight="600" mt={4}>
                          Type Price:{" "}
                          {isLoading ? (
                            <Spinner />
                          ) : (
                            parseInt(specialPriceData.price).toLocaleString("ID", {
                              style: "currency",
                              currency: "IDR",
                            })
                          )}
                        </Text>
                        <Text>
                          <span style={{ color: "red" }}>*</span> Use " - " to discount your type
                          price:
                        </Text>
                        <Text fontSize="14px" fontWeight={"600"}>
                          ("-10%" you discounted 10% of your current type's price.)
                        </Text>
                        <InputGroup mt={2} w="50%">
                          <NumberInput
                            max={300}
                            min={-100}
                            value={percentage}
                            onChange={onInputSpPChange}
                            focusBorderColor="#48BB78"
                          >
                            <NumberInputField />
                          </NumberInput>
                          <InputRightAddon children="%" />
                        </InputGroup>
                        <Text>
                          Final Price:{" "}
                          {isLoading ? (
                            <Spinner />
                          ) : nominal === 0 && percentage === 0 ? (
                            parseInt(specialPriceData.price).toLocaleString("ID", {
                              style: "currency",
                              currency: "IDR",
                            })
                          ) : (
                            parseInt(nominal).toLocaleString("ID", {
                              style: "currency",
                              currency: "IDR",
                            })
                          )}
                        </Text>
                      </>
                    ) : (
                      ""
                    )}
                  </Box>
                </Box>
              ) : (
                "Something went wrong"
              )}
              {pagesModal === 0 ? null : currentModal === "avail" ||
                currentModal === "specialprice" ? (
                <Flex
                  marginRight="auto"
                  w="100%"
                  justifyContent={"center"}
                  alignItems={"center"}
                  mt={2}
                >
                  <Text>{pageMessage}</Text>
                  <nav key={rowsModal}>
                    <ReactPaginate
                      previousLabel={
                        <IconButton
                          isDisabled={pageModal === 0}
                          variant="outline"
                          colorScheme="green"
                          icon={<ArrowLeftIcon />}
                        />
                      }
                      nextLabel={
                        <IconButton
                          isDisabled={pageModal + 1 === pagesModal}
                          variant="outline"
                          colorScheme="green"
                          icon={<ArrowRightIcon />}
                        />
                      }
                      pageCount={Math.min(10, pagesModal)}
                      onPageChange={onPageChangeModal}
                      containerClassName={"pagination-container"}
                      pageLinkClassName={"pagination-link"}
                      previousLinkClassName={"pagination-prev"}
                      nextLinkClassName={"pagination-next"}
                      activeLinkClassName={"pagination-link-active"}
                      disabledLinkClassName={"pagination-link-disabled"}
                    />
                  </nav>
                </Flex>
              ) : null}
            </ModalBody>
            <ModalFooter>
              {currentModal === "setAvailability" || currentModal === "setSpecialPrice" ? (
                <>
                  <Flex justifyContent={"space-between"} alignItems={"center"} w="100%">
                    <Box>
                      <Button
                        variant={"link"}
                        colorScheme="black"
                        onClick={() => {
                          dispatch(clearAllDate());
                          if (currentModal === "setAvailability") {
                            onClose();
                            setFilterDate(false);
                            setSortData("");
                            setDesc(false);
                            setCurrentModal("avail");
                            onOpen();
                            getContent(0, "avail");
                            clearAllDate();
                          } else if (currentModal === "setSpecialPrice") {
                            onClose();
                            setCurrentModal("specialprice");
                            setFilterDate(false);
                            setSortData("");
                            setDesc(false);
                            onOpen();
                            setRadioValue("nominal");
                            getContent(0, "specialprice");
                            clearAllDate();
                            setPercentage(0);
                            setNominal(0);
                          }
                        }}
                      >
                        Back
                      </Button>
                    </Box>
                    <Box display={"flex"} flexDirection={"row"} alignItems={"center"}>
                      <Button
                        variant={
                          currentModal === "avail" || currentModal === "specialprice"
                            ? "solid"
                            : "link"
                        }
                        colorScheme={
                          currentModal === "avail" || currentModal === "specialprice"
                            ? "green"
                            : "black"
                        }
                        mr={4}
                        onClick={() => {
                          dispatch(clearAllDate());
                          setSelectedOption("");
                          setModalDataAvail([]);
                          setModalDataPrice([]);
                          setRadioValue("nominal");
                          setPercentage(0);
                          setNominal(0);
                          onClose();
                        }}
                      >
                        Close
                      </Button>
                      <Button
                        hidden={
                          currentModal === "avail" || currentModal === "specialprice" ? true : false
                        }
                        variant="solid"
                        colorScheme="green"
                        onClick={submitHandler}
                      >
                        Confirm
                      </Button>
                    </Box>
                  </Flex>{" "}
                </>
              ) : (
                <>
                  <Button
                    variant={
                      currentModal === "avail" || currentModal === "specialprice" ? "solid" : "link"
                    }
                    colorScheme={
                      currentModal === "avail" || currentModal === "specialprice"
                        ? "green"
                        : "black"
                    }
                    mr={3}
                    onClick={() => {
                      onClose();
                      clearAllDate();
                      setPercentage(0);
                      setNominal(0);
                    }}
                  >
                    Close
                  </Button>
                  <Button
                    hidden={
                      currentModal === "avail" || currentModal === "specialprice" ? true : false
                    }
                    variant="solid"
                    colorScheme="green"
                  >
                    Confirm
                  </Button>
                </>
              )}
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Box>
    </>
  );
}

export default PropertyAndRoomList;
