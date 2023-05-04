import React, { useEffect } from "react";
import { Button, Flex, Heading, Input, Divider, Center, Box, Stack, Tag } from "@chakra-ui/react";
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
  Image,
} from "@chakra-ui/react";
import { ArrowLeftIcon, ArrowRightIcon } from "@chakra-ui/icons";
import Axios from "axios";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
import ReactPaginate from "react-paginate";
import { differenceInDays, format } from "date-fns";

function OrderHistory(props) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { tenantId } = useSelector((state) => {
    return {
      tenantId: state.tenantReducer.tenantId,
    };
  });
  const [tableData, setTableData] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [limit, setLimit] = React.useState(0);
  const [pages, setPages] = React.useState(0);
  const [rows, setRows] = React.useState(0);
  const [pageMessage, setPageMessage] = React.useState("");
  const [selectedStatus, setSelectedStatus] = React.useState("");
  const [modalData, setModalData] = React.useState("");
  const [clicked, setClicked] = React.useState(false);
  const [selectedOption, setSelectedOption] = React.useState("");
  const [searchBooking, setSearchBooking] = React.useState("");
  const [searchProperty, setSearchProperty] = React.useState("");
  const [filterBooking, setFilterBooking] = React.useState("");
  const [filterProperty, setFilterProperty] = React.useState("");

  const getTableData = async () => {
    let url = `/orderlist?tenant=${tenantId}&limit=${limit}&page=${page}`;
    let reqQuery = "";

    if (selectedStatus) {
      reqQuery += `&status=${selectedStatus}`;
    }
    if (filterBooking) {
      reqQuery += `&orderId=${filterBooking}`;
    }
    if (filterProperty) {
      reqQuery += `&property=${filterProperty}`;
    }
    try {
      let response = await Axios.get(process.env.REACT_APP_API_BASE_URL + url + reqQuery);
      setTableData(response.data.data);
      setPage(response.data.page);
      setPages(response.data.totalPage);
      setRows(response.data.totalRows);
    } catch (error) {
      console.log(error);
      setTableData(error.response.data.data);
    }
  };

  const onBtnSearch = (e) => {
    e.preventDefault();
    setPage(0);
    setFilterBooking(searchBooking);
    setFilterProperty(searchProperty);
  };

  const onBtnReset = () => {
    setSearchBooking("");
    setSearchProperty("");
    setFilterBooking("");
    setFilterProperty("");
    setSelectedStatus("");
    getTableData();
  };

  const onBtnAction = async (transId, roomId, status) => {
    Swal.fire({
      title:
        status === "Confirmed"
          ? "Are you sure you want to confirm this order?"
          : "Are you sure you want to reject this order?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#38A169",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
      reverseButtons: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          let res = await Axios.patch(process.env.REACT_APP_API_BASE_URL + "/orderlist/update", {
            transactionId: transId,
            roomId,
            status,
          });
          if (res.data.success) {
            Swal.fire({
              icon: "success",
              title: res.data.message,
              confirmButtonText: "OK",
              confirmButtonColor: "#48BB78",
              timer: 1500,
            }).then(() => {
              getTableData();
              setSelectedOption("");
            });
          }
        } catch (error) {
          console.log(error);
        }
      }
    });
  };

  const onBtnDetails = (data) => {
    setModalData(data);
    setClicked(true);
    onOpen();
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

  const handleClose = () => {
    setSelectedOption("");
    setClicked(false);
    onClose();
  };
  const cancelTransactionHandler = (transId) => {
    Swal.fire({
      title: "Are you sure you want to cancel this order?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#38A169",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
      reverseButtons: true,
    }).then((response) => {
      if (response.isConfirmed) {
        Axios.patch(process.env.REACT_APP_API_BASE_URL + "/orderlist/cancel", {
          transactionId: transId,
        }).then((res) => {
          Swal.fire({
            title: `${res.data.message}`,
            icon: "success",
            confirmButtonColor: "#38A169",
            confirmButtonText: "Yes",
          }).then(r =>{
            onBtnReset();
            getTableData()
          })
        }).catch(e =>{
          Swal.fire({
            title: `${e.response.data.message}`,
            icon: "success",
            confirmButtonColor: "#38A169",
            confirmButtonText: "Yes",
          })
        });
      }
      else{
        onBtnReset();
        getTableData()
      }
    });
  };
  const renderTableData = () => {
    if (tableData.length === 0) {
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
    return tableData.map((data, idx) => {
      const { transaction, orderId, price, room } = data;
      const { status } = transaction;
      return (
        <Tr key={idx}>
          <Td>{orderId}</Td>
          <Td>{room.property.name}</Td>
          <Td>{room.type.name}</Td>
          <Td>{`${parseInt(price).toLocaleString("id", {
            style: "currency",
            currency: "IDR",
          })}`}</Td>
          <Td>
            <Tag
              size={"lg"}
              colorScheme={
                status === "Waiting for payment"
                  ? "orange"
                  : status === "Waiting for confirmation"
                  ? "blue"
                  : status === "Confirmed"
                  ? "green"
                  : status === "Cancelled"
                  ? "red"
                  : null
              }
            >
              {status}
            </Tag>
          </Td>
          <Td>
            <Select value={selectedOption} onChange={(e) => setSelectedOption(e.target.value)}>
              <option hidden>Action</option>
              <option
                hidden={
                  status === "Confirmed" ||
                  status === "Cancelled" ||
                  status === "Waiting for payment"
                }
                onClick={() => onBtnAction(transaction.transactionId, room.roomId, "Confirmed")}
              >
                Confirm
              </option>
              <option
                hidden={
                  status === "Confirmed" ||
                  status === "Cancelled" ||
                  status === "Waiting for payment"
                }
                onClick={() =>
                  onBtnAction(transaction.transactionId, room.roomId, "Waiting for payment")
                }
              >
                Reject
              </option>
              <option
                hidden={
                  status === "Confirmed" ||
                  status === "Cancelled" ||
                  status === "Waiting for confirmation"
                }
                onClick={() => cancelTransactionHandler(transaction.transactionId)}
              >
                Cancel
              </option>
              <option onClick={() => onBtnDetails(data)}>Details</option>
            </Select>
          </Td>
        </Tr>
      );
    });
  };

  const renderModalData = () => {
    if (clicked) {
      const { orderId, room, transaction, price } = modalData;
      const { status } = transaction;
      const checkIn = new Date(transaction.checkinDate);
      const checkOut = new Date(transaction.checkoutDate);
      const nights = differenceInDays(
        new Date(transaction.checkoutDate),
        new Date(transaction.checkinDate)
      );
      return (
        <ModalBody>
          <Flex justify="space-between" align="center">
            <Heading size="md">Booking No: {orderId}</Heading>
            <Flex align="center" justify="center">
              <Heading size="md">
                Status:{" "}
                <Tag
                  size={"lg"}
                  colorScheme={
                    status === "Waiting for payment"
                      ? "orange"
                      : status === "Waiting for confirmation"
                      ? "blue"
                      : status === "Confirmed"
                      ? "green"
                      : status === "Cancelled"
                      ? "red"
                      : null
                  }
                >
                  {status}
                </Tag>{" "}
              </Heading>
            </Flex>
          </Flex>
          <Divider my={3} />
          <Stack mx={5} gap={6}>
            <Flex justify="space-between">
              <Text>Guest Name : </Text>
              <Text textTransform="capitalize">{transaction.user.name}</Text>
            </Flex>
            <Flex justify="space-between">
              <Text>Total Guest :</Text>
              <Text>{transaction.totalGuest}</Text>
            </Flex>
            <Flex justify="space-between">
              <Text>Property Name :</Text>
              <Text>{room.property.name}</Text>
            </Flex>
            <Flex justify="space-between">
              <Text>Room Type :</Text>
              <Text>{room.type.name}</Text>
            </Flex>
            <Flex justify="space-between">
              <Text>Length of Stay :</Text>
              <Text>{`${format(checkIn, "MMM dd, yyyy")} - ${format(
                checkOut,
                "MMM dd, yyyy"
              )} / ${nights} night(s)`}</Text>
            </Flex>
            <Flex justify="space-between">
              <Text>Price :</Text>
              <Text fontSize="2xl">
                {parseInt(price).toLocaleString("id", { style: "currency", currency: "IDR" })}
              </Text>
            </Flex>
            {transaction.payProofImg ? (
              <Flex direction="column" gap={5}>
                <Divider />
                <Heading size="sm">Payment:</Heading>
                <Flex alignItems="center" justifyContent="center">
                  <Image
                    height="500px"
                    src={process.env.REACT_APP_API_BASE_IMG_URL + transaction.payProofImg}
                  />
                </Flex>
              </Flex>
            ) : null}
          </Stack>
        </ModalBody>
      );
    }
  };

  useEffect(() => {
    getTableData();
  }, [page, filterBooking, filterProperty, selectedStatus]);

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
                <Input value={searchBooking} onChange={(e) => setSearchBooking(e.target.value)} />
              </FormControl>
              <FormControl>
                <FormLabel>Property</FormLabel>
                <Input value={searchProperty} onChange={(e) => setSearchProperty(e.target.value)} />
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
            <Flex mb={4} gap={3} align={{ md: "center" }} direction={{ base: "column", md: "row" }}>
              Status:
              <Button
                colorScheme="twitter"
                variant="outline"
                onClick={() => {
                  setSelectedStatus("");
                }}
                isActive={selectedStatus === ""}
              >
                Show All
              </Button>
              <Button
                colorScheme="yellow"
                variant="outline"
                onClick={() => {
                  selectedStatus === "Waiting for payment"
                    ? setSelectedStatus("")
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
                    ? setSelectedStatus("")
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
                    ? setSelectedStatus("")
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
                    ? setSelectedStatus("")
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
              <Tbody>{renderTableData()}</Tbody>
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
      <Modal size="xl" scrollBehavior="inside" onClose={handleClose} isOpen={isOpen} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Order Details</ModalHeader>
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

export default OrderHistory;
