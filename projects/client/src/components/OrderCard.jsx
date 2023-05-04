import React, { useEffect, useState } from "react";
import {
  Card,
  Image,
  CardBody,
  CardFooter,
  Heading,
  Text,
  Button,
  CardHeader,
  Flex,
  Tag,
  Icon,
  Select,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Textarea,
} from "@chakra-ui/react";
import { format } from "date-fns";
import { AiOutlineUser } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import Axios from "axios";
import Swal from "sweetalert2";

function OrderCard(props) {
  const { orderId, price, createdAt } = props.order;
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { status, totalGuest, checkinDate, checkoutDate, transactionId } = props.transaction;
  const { tenant, name, image } = props.property;
  const [isReview, setIsReview] = React.useState(false);
  const [reviews, setReviews] = React.useState("");
  const [currentReviews, setCurrentReviews] = React.useState("");
  const [selectedOption, setSelectedOption] = useState("");
  const navigate = useNavigate();

  const getReview = async () => {
    try {
      let response = await Axios.get(
        process.env.REACT_APP_API_BASE_URL + `/review/check?id=${transactionId}`
      );
      if (response.data.data.length > 0) {
        setIsReview(true);
        setReviews(response.data.data[0].desc);
        setCurrentReviews(response.data.data[0].desc);
      }
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };
  const createReview = async () => {
    try {
      const getLocalStorage = localStorage.getItem("renthaven1");
      if (getLocalStorage) {
        const res = await Axios.post(
          process.env.REACT_APP_API_BASE_URL + "/reviews/new",
          {
            transactionId,
            desc: currentReviews,
          },
          {
            headers: {
              Authorization: `Bearer ${getLocalStorage}`,
            },
          }
        );
        onClose();
        Swal.fire({
          icon: "success",
          title: res.data.message,
          confirmButtonText: "OK",
          confirmButtonColor: "#48BB78",
          timer: 3000,
        }).then((response) => {
          props.getData();
        });
      }
    } catch (error) {
      console.log(error);
      onClose();
      Swal.fire({
        icon: "error",
        title: error.response.data.message,
        confirmButtonText: "OK",
        confirmButtonColor: "#48BB78",
        timer: 3000,
      });
    }
  };
  const cancelHandler = async () => {
    Swal.fire({
      icon: "info",
      title: "Are you sure you want to cancel?",
      showCancelButton: true,
      cancelButtonColor: "red",
      confirmButtonText: "OK",
      confirmButtonColor: "#48BB78",
    })
      .then((res) => {
        if (res.isConfirmed) {
          const getLocalStorage = localStorage.getItem("renthaven1");
          if(getLocalStorage){
            Axios.patch(
              process.env.REACT_APP_API_BASE_URL + "/orderlist-user/cancel",
              {
                transactionId,
              },
              {
                headers: {
                  "Authorization": `Bearer ${getLocalStorage}`,
                },
              }
            )
              .then((response) => {
                Swal.fire({
                  icon: "success",
                  title: response.data.message,
                  confirmButtonText: "OK",
                  confirmButtonColor: "#48BB78",
                  timer: 3000,
                }).then(resp => {
                  props.getData();
                  setSelectedOption("")
                });
              })
              .catch((e) => {
                console.log(e);
                setSelectedOption("");
              });

          }
        }
        setSelectedOption("");
      })
      .catch((e) => console.log(e));
  };
  const editHandler = async () => {
    try {
      const res = await Axios.patch(process.env.REACT_APP_API_BASE_URL + "/reviews/update", {
        id: transactionId,
        desc: currentReviews,
      });
      onClose();
      Swal.fire({
        icon: "success",
        title: res.data.message,
        confirmButtonText: "OK",
        confirmButtonColor: "#48BB78",
        timer: 3000,
      }).then((response) => {
        props.getData();
      });
    } catch (error) {
      onClose();
      Swal.fire({
        icon: "error",
        title: error.response.data.message,
        confirmButtonText: "OK",
        confirmButtonColor: "#48BB78",
        timer: 3000,
      });
    }
  };

  useEffect(() => {
    getReview();
  }, [props.userData, props.selectedStatus, props.page]);

  return (
    <Card overflow="hidden">
      <CardHeader pb="0">
        <Flex align="center" justifyContent="space-between">
          <Flex gap={3}>
            <Flex direction="row" gap={1}>
              <Heading size="xs" fontWeight="500">
                Booking Number :
              </Heading>
              <Heading size="xs">{orderId}</Heading>
            </Flex>
            <Flex display={{ base: "none", md: "flex" }} direction="row" gap={1}>
              <Heading size="xs" fontWeight="500">
                Order Date :
              </Heading>
              <Heading size="xs">{format(new Date(createdAt), "MMM dd, yy")}</Heading>
            </Flex>
          </Flex>
          <Flex align="center" gap={2}>
            <Flex display={{ base: "none", md: "flex" }} direction="row" gap={1}>
              <Heading size="xs" fontWeight="500">
                Check In
              </Heading>
              <Heading size="xs">{format(new Date(checkinDate), "MMM dd, yy")}</Heading>
            </Flex>
            <Flex display={{ base: "none", md: "flex" }} direction="row" gap={1}>
              <Heading size="xs" fontWeight="500">
                Check Out
              </Heading>
              <Heading size="xs">{format(new Date(checkoutDate), "MMM dd, yy")}</Heading>
            </Flex>
            <Tag
              size={{ base: "sm", md: "lg" }}
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
          </Flex>
        </Flex>
        <Flex
          mt={{ base: "5px", md: "0" }}
          display={{ base: "flex", md: "none" }}
          direction="row"
          gap={1}
        >
          <Heading size="xs" fontWeight="500">
            Order Date :
          </Heading>
          <Heading size="xs">{format(new Date(createdAt), "MMM dd, yy")}</Heading>
        </Flex>
      </CardHeader>
      <Flex>
        <CardBody>
          <Flex gap={1}>
            <Icon as={AiOutlineUser} />
            <Heading size="xs" mb={2} textTransform="capitalize">
              {tenant.user.name}
            </Heading>
          </Flex>
          <Flex gap={3}>
            <Image
              boxSize={{ base: "100px", md: "150px" }}
              src={process.env.REACT_APP_API_BASE_IMG_URL + image}
              fallbackSrc="https://via.placeholder.com/150"
            />
            <Flex direction="column">
              <Heading size={{ base: "sm", md: "md" }}>{name}</Heading>

              <Text py="2">{props.type.name}</Text>
              <Text py="2"># of guest: {totalGuest}</Text>
            </Flex>
          </Flex>
        </CardBody>
      </Flex>
      <CardFooter justify="end" pt="0">
        <Flex direction="column" gap={3} align="end">
          <Text color="blue.600" fontSize="2xl">
            {parseInt(price).toLocaleString("ID", { style: "currency", currency: "IDR" })}
          </Text>
          {status === "Waiting for payment" ? (
            <Select value={selectedOption} onChange={(e) => setSelectedOption(e.target.value)}>
              <option hidden value={""}>
                Action
              </option>
              <option onClick={() => navigate(`/payment-proof?id=${transactionId}`)}>
                Proceed to payment
              </option>
              <option value="Cancel" onClick={cancelHandler}>
                Cancel
              </option>
            </Select>
          ) : status === "Confirmed" && new Date() > new Date(checkoutDate) ? (
            <Flex gap={3}>
              {isReview ? (
                <>
                  <Button variant="outline" colorScheme="green" onClick={onOpen}>
                    {"Edit review"}
                  </Button>
                  <Modal
                    closeOnEsc={false}
                    closeOnOverlayClick={false}
                    isOpen={isOpen}
                    onClose={onClose}
                    size={"md"}
                    isCentered
                  >
                    <ModalOverlay />
                    <ModalContent>
                      <ModalHeader>Edit Review</ModalHeader>
                      <ModalCloseButton
                        onClick={() => {
                          setCurrentReviews(reviews);
                          onClose();
                        }}
                      />
                      <ModalBody>
                        <Text mb={5}>Edit your review</Text>
                        <Textarea
                          resize={"vertical"}
                          size="md"
                          value={currentReviews}
                          onChange={(e) => {
                            if (e.target.value.length <= 255) {
                              setCurrentReviews(e.target.value);
                            }
                          }}
                        />
                      </ModalBody>
                      <ModalFooter>
                        <Button
                          variant={"link"}
                          colorScheme="black"
                          mr={3}
                          onClick={() => {
                            setCurrentReviews(reviews);
                            onClose();
                          }}
                        >
                          Close
                        </Button>
                        <Button variant="solid" colorScheme="green" onClick={editHandler}>
                          Confirm
                        </Button>
                      </ModalFooter>
                    </ModalContent>
                  </Modal>
                </>
              ) : (
                <>
                  <Button variant="outline" colorScheme="green" onClick={onOpen} size={"md"}>
                    {"Write a review"}
                  </Button>
                  <Modal
                    isOpen={isOpen}
                    onClose={onClose}
                    isCentered
                    closeOnOverlayClick={false}
                    closeOnEsc={false}
                  >
                    <ModalOverlay />
                    <ModalContent>
                      <ModalHeader>Write review</ModalHeader>
                      <ModalCloseButton />
                      <ModalBody>
                        <Text>Please tell us your thoughts</Text>
                        <Textarea
                          value={currentReviews}
                          resize={"vertical"}
                          size={"md"}
                          onChange={(e) => {
                            if (e.target.value.length <= 255) {
                              setCurrentReviews(e.target.value);
                            }
                          }}
                        />
                      </ModalBody>

                      <ModalFooter>
                        <Button variant={"link"} colorScheme="black" mr={3} onClick={onClose}>
                          Close
                        </Button>
                        <Button variant="solid" colorScheme="green" onClick={createReview}>
                          Confirm
                        </Button>
                      </ModalFooter>
                    </ModalContent>
                  </Modal>
                </>
              )}
              <Button
                variant="solid"
                onClick={() => props.btnDetails(props.order)}
                colorScheme="green"
              >
                {"Details"}
              </Button>
            </Flex>
          ) : (
            <>
              <Button
                variant="solid"
                onClick={() => props.btnDetails(props.order)}
                colorScheme="green"
              >
                {"Details"}
              </Button>
            </>
          )}
        </Flex>
      </CardFooter>
    </Card>
  );
}

export default OrderCard;
