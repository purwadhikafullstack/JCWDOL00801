import Axios from "axios";
import React, { useEffect, useState } from "react";
import { Container, Flex, Heading, Text, Icon, Avatar, Divider, FormLabel } from "@chakra-ui/react";
import { IoLocationSharp } from "react-icons/io5";
import PropertyGallery from "../components/PropertyGallery";
import RoomCard from "../components/RoomCard";
import "../styles/imageGallery.css";
import { useLocation, useSearchParams } from "react-router-dom";
import CalendarDateRange from "../components/CalendarDateRange";
import { useDispatch, useSelector } from "react-redux";

function PropertyDetail(props) {
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useSearchParams();
  const dispatch = useDispatch();
  const [notAvailableRoom , setNotAvailableRoom] = useState([]);
  const [types, setTypes] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [categories, setCategories] = useState([]);
  const [property, setProperty] = useState([]);
  const [tenant, setTenant] = useState([]);
  const [userTenant, setUserTenant] = useState("");
  const {email, startDate, endDate} = useSelector(state => {
    return{
      email: state.userReducer.email,
      startDate: state.dateReducer.startDate,
      endDate: state.dateReducer.endDate
    }
  })
  const getData = async () =>{
    try {
      const res = await Axios.post(process.env.REACT_APP_API_BASE_URL + `/property/${searchQuery.get('id')}`, {
        startDate: startDate,
        endDate: endDate
      })
      let roomNotAvail = [];
      res.data.roomAvail.map(val =>{
        roomNotAvail.push(val)
      })
      let roomAvail = res.data.room.filter(val =>{
        return !roomNotAvail.includes(val)
      })
      setTypes(res.data.type);
      setRooms(roomAvail);
      setProperty(res.data.property)
      setCategories(res.data.category)
      setTenant(res.data.tenant)
      setUserTenant(res.data.userTenant)
      if(res.data.notAvailRooms.length > 0 && res.data.notAvailRooms != undefined){
        setNotAvailableRoom(res.data.notAvailRooms);
      }
    } catch (error) {
      console.log(error)
    }
  }
  const renderRoom = () =>{
      return types.map((val, idx )=>{
        return <RoomCard key={idx} data={val} id={searchQuery.get('id')} startDate={startDate} endDate={endDate} isAvailable = {true} />
      })
  }
  const renderNotAvailRoom = () =>{
    return notAvailableRoom.map((val, idx) =>{
      return <RoomCard key={idx} data={val} id={searchQuery.get('id')} startDate={startDate} endDate={endDate} isAvailable = {false} />
    })
  }
  useEffect(() =>{
    getData();
    
  },[])
  return (
    <Container maxW={{ base: "container", md: "container.lg" }}>
      <Flex direction="column" mb={3}>
        <Heading>{property.name}</Heading>
        <Text>
          <Icon as={IoLocationSharp} /> {categories.city}
        </Text>
      </Flex>
      <PropertyGallery />
      <Flex align="center" gap={3} mt={5}>
        <Avatar src={`http://localhost:8000/${userTenant.profileImg}`} bg="green.500" size="md" />
        <Heading size="md">{userTenant.name}</Heading>
      </Flex>
      <Divider my={5} />
      <Flex direction="column">
        <Heading size="sm">Description</Heading>
        <Text>
          {property.desc}
        </Text>
      </Flex>
      <Divider my={5} />
      <Flex minW="100%" direction={"column"}>
        <FormLabel>Date</FormLabel>
        <CalendarDateRange />
      </Flex>
      <Divider my={5} />
      <Flex direction="column" gap={4} mb="20px">
        <Heading size="sm">Available Rooms at "Hotel Name"</Heading>
        {renderRoom()}
        {notAvailableRoom.length > 0 ? renderNotAvailRoom() : ""}
      </Flex>
    </Container>
  );
}

export default PropertyDetail;
