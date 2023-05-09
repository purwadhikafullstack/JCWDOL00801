import Axios from "axios";
import React, { useEffect, useState } from "react";
import {
  Container,
  Flex,
  Heading,
  Text,
  Icon,
  Avatar,
  Divider,
  FormLabel,
  IconButton,
} from "@chakra-ui/react";
import { IoLocationSharp } from "react-icons/io5";
import PropertyGallery from "../components/PropertyGallery";
import RoomCard from "../components/RoomCard";
import "../styles/imageGallery.css";
import { useLocation, useSearchParams } from "react-router-dom";
import CalendarDateRange from "../components/CalendarDateRange";
import { useDispatch, useSelector } from "react-redux";
import "../styles/imageGallery.css";
import Reviews from "../components/Reviews";
import { ArrowLeftIcon, ArrowRightIcon } from "@chakra-ui/icons";
import ReactPaginate from "react-paginate";

function PropertyDetail(props) {
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useSearchParams();
  const dispatch = useDispatch();
  const [noReview, setNoReview] = useState(false);
  const [notAvailableRoom, setNotAvailableRoom] = useState([]);
  const [types, setTypes] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [categories, setCategories] = useState([]);
  const [property, setProperty] = useState([]);
  const [tenant, setTenant] = useState([]);
  const [reviewsData, setReviewsData] = useState([]);
  const [userTenant, setUserTenant] = useState("");
  const [image, setImage] = useState([]);
  const [page, setPage] = useState(0);
  const [pageMessage, setPageMessage] = useState("");
  const [limit, setLimit] = useState(0);
  const [pages, setPages] = useState(0);
  const [rows, setRows] = useState(0);
  const { email, startDate, endDate } = useSelector((state) => {
    return {
      email: state.userReducer.email,
      startDate: state.dateReducer.startDate,
      endDate: state.dateReducer.endDate,
    };
  });
  const [checkinDate, setCheckinDate] = useState(null);
  const [checkoutDate, setCheckoutDate] = useState(null);
  const changeCheckinDate = (e) => {
    setCheckinDate(new Date(e));
  };
  const changeCheckoutDate = (e) => {
    setCheckoutDate(new Date(e));
  };
  const getData = async () => {
    try {
      const res = await Axios.post(
        process.env.REACT_APP_API_BASE_URL + `/property/find/${searchQuery.get("id")}`,
        {
          startDate: startDate,
          endDate: endDate,
        }
      );
      let roomNotAvail = [];
      res.data.roomAvail.map((val) => {
        roomNotAvail.push(val);
      });
      let roomAvail = res.data.room.filter((val) => {
        return !roomNotAvail.includes(val);
      });
      let images = [];
      images.push(process.env.REACT_APP_BASE_IMG_URL + res.data.property.image);
      res.data.type.map((val) => {
        images.push(process.env.REACT_APP_BASE_IMG_URL + val.typeImg);
      });

      setTypes(res.data.type);
      setRooms(roomAvail);
      setProperty(res.data.property);
      setCategories(res.data.category);
      setTenant(res.data.tenant);
      setUserTenant(res.data.userTenant);
      setImage(images);
      if (res.data.notAvailRooms.length > 0 && res.data.notAvailRooms != undefined) {
        setNotAvailableRoom(res.data.notAvailRooms);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const renderRoom = () => {
    return types.map((val, idx) => {
      return (
        <RoomCard
          key={idx}
          data={val}
          id={searchQuery.get("id")}
          startDate={checkinDate}
          endDate={checkoutDate}
          typeImg={types.typeImg}
          isAvailable={true}
        />
      );
    });
  };
  const renderNotAvailRoom = () => {
    return notAvailableRoom.map((val, idx) => {
      return (
        <RoomCard
          key={idx}
          data={val}
          id={searchQuery.get("id")}
          startDate={checkinDate}
          endDate={checkoutDate}
          isAvailable={false}
        />
      );
    });
  };
  const getReviewData = async () => {
    try {
      let url = `/reviews/all?id=${searchQuery.get("id")}&${limit}&page=${page}`;
      const res = await Axios.get(process.env.REACT_APP_API_BASE_URL + url);
      if (res.data.result.length > 0) {
        setReviewsData(res.data.result);
        setPage(res.data.page);
        setPages(res.data.totalPage);
        setRows(res.data.totalRows);
      } else {
        setNoReview(true);
      }
    } catch (error) {
      console.log(error);
      setNoReview(true);
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
    getData();
  }, [startDate, endDate]);
  useEffect(() => {
    getReviewData();
  }, [page, pages]);
  return (
    <Container mt={"20px"} maxW={{ base: "container", md: "container.lg" }}>
      <Flex direction="column" mb={3}>
        <Heading>{property.name}</Heading>
        <Text>
          <Icon as={IoLocationSharp} /> {categories.city}
        </Text>
      </Flex>
      <PropertyGallery image={image} />
      <Flex align="center" gap={3} mt={5}>
        <Avatar
          src={`${process.env.REACT_APP_BASE_IMG_URL}${userTenant.profileImg}`}
          bg="green.500"
          size="md"
        />
        <Heading size="md">{userTenant.name}</Heading>
      </Flex>
      <Divider my={5} />
      <Flex direction="column">
        <Heading size="sm">Description</Heading>
        <Text>{property.desc}</Text>
      </Flex>
      <Divider my={5} />
      <Flex minW="100%" direction={"column"}>
        <FormLabel>Date</FormLabel>
        <CalendarDateRange
          checkinHandler={changeCheckinDate}
          checkoutHandler={changeCheckoutDate}
        />
      </Flex>
      <Divider my={5} />
      <Flex direction="column" gap={4} mb="20px">
        <Heading size="sm">Available Rooms at {property.name}</Heading>
        {renderRoom()}
        {notAvailableRoom.length > 0 ? renderNotAvailRoom() : ""}
      </Flex>
      <Flex direction={"column"} mb={"20px"}>
        <Heading size="sm" mb={4}>
          Reviews
        </Heading>
        {!noReview ? (
          reviewsData.map((val, idx) => {
            return <Reviews data={val} key={idx} />;
          })
        ) : (
          <Text>No Review</Text>
        )}
      </Flex>
      <Flex mb={5} justify={"center"}>
        <nav key={rows}>
          <ReactPaginate
            previousLabel={
              <IconButton
                isDisabled={pages != 0 ? page === 0 : true}
                variant="outline"
                colorScheme="green"
                icon={<ArrowLeftIcon />}
              />
            }
            nextLabel={
              <IconButton
                isDisabled={pages != 0 ? page + 1 === pages : true}
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
    </Container>
  );
}

export default PropertyDetail;
