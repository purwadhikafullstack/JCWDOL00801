import Axios from "axios";
import { Box, Button, Flex, Icon, Text, Heading } from "@chakra-ui/react";
import { RiHotelLine, RiHotelBedLine, RiCamera2Line } from "react-icons/ri";
import { AddIcon, ArrowLeftIcon } from "@chakra-ui/icons";
import React from "react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Swal from "sweetalert2";

function RoomCreateMenu() {
  const navigate = useNavigate();
  const [propData, setPropData] = useState([]);
  const getPropData = async () =>{
    try {
      const getLocalStorage = localStorage.getItem("renthaven1")
      if(getLocalStorage){
        const res = await Axios.get(process.env.REACT_APP_API_BASE_URL + "/rooms/prop-availability", {
          headers: {
            "Authorization": `Bearer ${getLocalStorage}`
          }
        })
        if(res.data.result.length >0){
          setPropData(res.data.result);
          navigate("/room/new/type", {replace: true, state:{data: res.data.result}})
        }
        
      }
      else{

      }
    } catch (error) {
        Swal.fire({
          icon: "error",
          title: `${error.response.data.message}`,
          confirmButtonText: "OK",
          confirmButtonColor: "#48BB78",
          showDenyButton: true,
          denyButtonColor: "red",
          denyButtonText: "CANCEL",
        }).then(res =>{
          if(res.isConfirmed){
            navigate("/property/new", {replace: true, state:{data: propData}})
            window.scrollTo(0,0);
          }
        })
        console.log(error)
      
    }
  }
  return (
    <Box px={{ base: "0", md: "20" }}>
      <Flex direction="column" gap={6} align="center" justify="center">
        <Heading>Please Select One</Heading>
        <Flex gap={6} direction={{ base: "column", md: "row" }}>
          <Button
            px="16"
            py="20"
            colorScheme="green"
            variant="outline"
            onClick={getPropData}
          >
            <Flex direction="column" justify="center" align="center">
              <Icon boxSize={10} as={RiHotelBedLine} />
              <Text>Add Room</Text>
            </Flex>
          </Button>
          <Button
            px="16"
            py="20"
            colorScheme="green"
            variant="outline"
            onClick={() => navigate("/property/new/building-room", { replace: true })}
          >
            <Flex direction="column" justify="center" align="center">
              <Flex align="center" >
                <Icon boxSize={10} as={RiCamera2Line} />
              </Flex>
              <Text>Add Room Photo</Text>
            </Flex>
          </Button>
        </Flex>
        <Flex>
          <Button
            colorScheme="gray"
            variant="ghost"
            onClick={() => navigate("/room", { replace: true })}
            leftIcon={<ArrowLeftIcon boxSize={3} />}
          >
            Back
          </Button>
        </Flex>
      </Flex>
    </Box>
  );
}

export default RoomCreateMenu;
