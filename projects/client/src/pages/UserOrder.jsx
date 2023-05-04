import { Container, Heading, Flex, Button, Text, IconButton, Input } from "@chakra-ui/react";
import React, { useEffect } from "react";
import OrderCard from "../components/OrderCard";
import ReactPaginate from "react-paginate";
import { ArrowLeftIcon, ArrowRightIcon } from "@chakra-ui/icons";
import Axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Image,
  Tag,
  Divider,
  Stack,
} from "@chakra-ui/react";
import { addYears, differenceInDays, subYears } from "date-fns";
import CalendarStartDate from "../components/CalendarStartDate";
import { clearAllDate } from "../actions/dateAction";
import CalendarEndDate from "../components/CalendarEndDate";

function UserOrder(props) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { email, name, searchStartDate, searchEndDate } = useSelector((state) => {
    return {
      email: state.userReducer.email,
      name: state.userReducer.name,
      searchStartDate: state.dateReducer.searchStartDate,
      searchEndDate: state.dateReducer.searchEndDate,
    };
  });
  const [page, setPage] = React.useState(0);
  const [limit, setLimit] = React.useState(0);
  const [pages, setPages] = React.useState(0);
  const [rows, setRows] = React.useState(0);
  const [pageMessage, setPageMessage] = React.useState("");
  const [userData, setUserData] = React.useState([]);
  const [selectedStatus, setSelectedStatus] = React.useState("");
  const [searchKeyword, setSearchKeyword] = React.useState("");
  const [sortData, setSortData] = React.useState("");
  const [desc, setDesc] = React.useState(true);
  const [keyword, setKeyword] = React.useState("");
  const [startDate, setStartDate] = React.useState("");
  const [endDate, setEndDate] = React.useState("");
  const [clicked, setClicked] = React.useState(false);
  const [modalData, setModalData] = React.useState("");
  const dispatch = useDispatch();

  const getUserData = async () => {
    let url = `/user-order?email=${email}&limit=${limit}&page=${page}`;
    let reqQuery = "";
    if (sortData) {
      if (desc) {
        reqQuery += `&sortby=${sortData}&order=desc`;
      } else {
        reqQuery += `&sortby=${sortData}`;
      }
    }
    if (startDate) {
      reqQuery += `&startDate=${startDate}`;
    }
    if (endDate) {
      reqQuery += `&endDate=${endDate}`;
    }
    if (selectedStatus) {
      reqQuery += `&status=${selectedStatus}`;
    }
    if (searchKeyword) {
      reqQuery += `&orderId=${searchKeyword}`;
    }
    try {
      let response = await Axios.get(process.env.REACT_APP_API_BASE_URL + url + reqQuery);
      setUserData(response.data.data);
      setPage(response.data.page);
      setPages(response.data.totalPage);
      setRows(response.data.totalRows);
    } catch (error) {
      console.log(error);
      setUserData(error.response.data.data);
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

  const handleSort = (data) => {
    setSortData(data);
    setDesc(!desc);
  };

  const onBtnSearch = (e) => {
    e.preventDefault();
    setPage(0);
    setSearchKeyword(keyword);
    setStartDate(searchStartDate);
    setEndDate(searchEndDate);
  };

  const onBtnReset = () => {
    dispatch(clearAllDate());
    setKeyword("");
    setSearchKeyword("");
    setSelectedStatus("");
    setSortData("");
    setStartDate("");
    setEndDate("");
    getUserData();
  };

  const onBtnDetails = (data) => {
    setModalData(data);
    setClicked(true);
    onOpen();
  };

  const renderData = () => {
    return userData.length === 0 ? (
      <Heading>DATA NOT FOUND</Heading>
    ) : (
      userData.map((data, idx) => {
        return (
          <OrderCard
            order={data}
            transaction={data.transaction}
            property={data.room.property}
            type={data.room.type}
            selectedStatus={selectedStatus}
            page={page}
            btnDetails={onBtnDetails}
            key={idx}
            getData={getUserData}
            userData={userData}
          />
        );
      })
    );
  };

  const renderModalData = () => {
    if (clicked) {
      const { orderId, room, transaction, price } = modalData;
      const { status } = transaction;
      const checkIn = new Date(transaction.checkinDate).toLocaleDateString("id");
      const checkOut = new Date(transaction.checkoutDate).toLocaleDateString("id");
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
              <Text textTransform="capitalize">{name}</Text>
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
              <Text textAlign={"end"}>{`${checkIn} - ${checkOut} / ${nights} night(s)`}</Text>
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
    getUserData();
  }, [selectedStatus, page, searchKeyword, desc, startDate, endDate]);

  return (
    <Container maxW={{ md: "container.lg" }} my="40px">
      <Heading mb={5}>My Orders</Heading>
      <Flex direction="column" p="4" border="1px" borderColor="#ccc" rounded="md">
        <Flex direction={{ base: "column", md: "row" }} mb="5" gap={3} align="center">
          <Input
            placeholder="Search Booking Number"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
          <CalendarStartDate />
          <Text display={{ base: "none", md: "block" }}>-</Text>
          <CalendarEndDate />
          <Flex direction={{ base: "row" }} gap={3}>
            <Button colorScheme="green" onClick={onBtnSearch}>
              Search
            </Button>
            <Button colorScheme="green" onClick={onBtnReset}>
              Reset
            </Button>
          </Flex>
        </Flex>
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
        <Flex gap={3} mb="5">
          Sort By:
          <Button colorScheme="green" variant="link" onClick={() => handleSort("orderId")}>
            Booking Number
          </Button>
          <Button colorScheme="green" variant="link" onClick={() => handleSort("createdAt")}>
            Order Date
          </Button>
        </Flex>
        <Flex direction="column" gap={3}>
          {renderData()}
        </Flex>
        {pages === 0 ? null : (
          <Flex justify="center" mt={5}>
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
        size={{ base: "full", md: "xl" }}
        scrollBehavior="inside"
        onClose={onClose}
        isOpen={isOpen}
        isCentered
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Order Details</ModalHeader>
          <ModalCloseButton />
          {renderModalData()}
          <ModalFooter>
            <Button onClick={onClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Container>
  );
}

export default UserOrder;
