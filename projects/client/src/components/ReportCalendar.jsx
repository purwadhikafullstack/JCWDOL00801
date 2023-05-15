import React, { useEffect } from "react";
import { Box, Heading, Text, Flex } from "@chakra-ui/react";
import { format, eachDayOfInterval, subDays, isWithinInterval } from "date-fns";
import { Calendar } from "react-date-range";
import { Select as Select2 } from "chakra-react-select";
import { useSelector } from "react-redux";
import Axios from "axios";

function ReportCalendar(props) {
  const [propData, setPropData] = React.useState(null);
  const [roomData, setRoomData] = React.useState(null);
  const [roomOption, setRoomOption] = React.useState(null);
  const [propId, setPropId] = React.useState(0);
  const [selectedRoom, setSelectedRoom] = React.useState(false);
  const { createdAt } = useSelector((state) => {
    return {
      createdAt: state.userReducer.createdAt,
    };
  });
  const getPropData = async () => {
    try {
      const getLocalStorage = localStorage.getItem("renthaven1");
      if (getLocalStorage) {
        const res = await Axios.get(
          process.env.REACT_APP_API_BASE_URL + "/rooms/prop-availability",
          {
            headers: {
              Authorization: `Bearer ${getLocalStorage}`,
            },
          }
        );
        if (res.data.result.length > 0) {
          const optionPropData = res.data.result.map((val, idx) => {
            return { value: val.propertyId, label: val.name };
          });
          setPropData(optionPropData);
        }
      }
    } catch (e) {
      console.log(e);
    }
  };

  const getRoomData = async () => {
    try {
      if (propId) {
        let response = await Axios.get(
          process.env.REACT_APP_API_BASE_URL + `/property/room/${propId}`
        );
        const roomOptionData = response.data.data.map((val) => {
          return { value: val.roomId, label: val.type.name };
        });
        setRoomOption(roomOptionData);
      } else {
        setRoomOption(null);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getOneRoomData = async (roomId) => {
    try {
      if (propId) {
        let response = await Axios.get(
          process.env.REACT_APP_API_BASE_URL + `/property/room/${propId}/${roomId}`
        );
        setRoomData(response.data.data[0]);
      } else {
        setRoomData(null);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSelectProp = (e, action) => {
    if (action.action === "clear") {
      setPropId("");
      setSelectedRoom(false);
      return;
    }
    setPropId(e.value);
  };

  const handleSelectRoom = async (e, action) => {
    if (action.action === "clear") {
      setSelectedRoom(false);
      return;
    }
    await getOneRoomData(e.value);
    setSelectedRoom(true);
  };

  const setDisabledDates = selectedRoom
    ? roomData.roomAvail.length > 0
      ? roomData.roomAvail.flatMap((val) => {
          return eachDayOfInterval({
            start: new Date(val.startDate),
            end: new Date(val.endDate),
          });
        })
      : []
    : [];

  useEffect(() => {
    getRoomData();
  }, [propId]);

  useEffect(() => {
    getPropData();
  }, []);

  const isWithinRanges = (date, ranges) => {
    return ranges.some((range) => isWithinInterval(date, { start: range[0], end: range[1] }));
  };

  const customDayContent = (day) => {
    let price = "";
    let content = null;
    if (selectedRoom) {
      if (day >= subDays(new Date(roomData.createdAt), 1)) {
        const specialPrice = roomData.type.specialPrice;
        if (specialPrice.length > 0) {
          const disabledRanges = specialPrice.map((val) => {
            return [new Date(val.startDate), new Date(val.endDate)];
          });

          if (isWithinRanges(day, disabledRanges)) {
            const price = specialPrice.filter((val) => {
              return isWithinInterval(day, {
                start: new Date(val.startDate),
                end: new Date(val.endDate),
              });
            });
            // tampilan ketika special price
            content = (
              <Text
                zIndex={"overlay"}
                position={"absolute"}
                top={"50%"}
                transform={"auto"}
                translateX={"-50%"}
                color={"orange"}
                fontSize={"sm"}
              >
                {price[0].nominal.slice(0, -6)}
              </Text>
            );
          } else {
            //tampilan ketika tidak ada special price
            price = roomData.type.price;
            content = (
              <Text
                zIndex={"overlay"}
                position={"absolute"}
                top={"50%"}
                transform={"auto"}
                translateX={"-50%"}
                fontSize={"sm"}
              >
                {price.slice(0, -6)}
              </Text>
            );
          }
        } else {
          //tampilan default
          price = roomData.type.price;
          content = (
            <Text
              zIndex={"overlay"}
              position={"absolute"}
              top={"50%"}
              transform={"auto"}
              translateX={"-50%"}
              fontSize={"sm"}
            >
              {price.slice(0, -6)}
            </Text>
          );
        }
        return (
          <Box>
            {content}
            <span>{format(day, "d")}</span>
          </Box>
        );
      }
    }
  };

  return (
    <Box border="1px" p={5} borderRadius={5} borderColor={"#ccc"}>
      <Flex direction="column">
        <Heading size={"sm"} mb={3}>
          Room Availability and Price
        </Heading>
        <Flex direction={"column"}>
          <Flex direction="column" gap={3}>
            <Select2
              isSearchable
              isClearable
              options={propData}
              onChange={(e, action) => handleSelectProp(e, action)}
              placeholder="Choose Property"
            ></Select2>
            {roomOption ? (
              <Select2
                isSearchable
                isClearable
                options={roomOption}
                onChange={(e, action) => handleSelectRoom(e, action)}
                placeholder="Choose Room Type"
              ></Select2>
            ) : null}
          </Flex>
          <Flex mt={5} direction={"column"} gap={1} align={"center"}>
            <Calendar
              date={new Date()}
              disabledDates={setDisabledDates}
              minDate={selectedRoom ? new Date(roomData.createdAt) : new Date(createdAt)}
              dayContentRenderer={customDayContent}
              className="static-calendar"
              color="#38A169"
            />
          </Flex>
          <Flex mt={1} direction={"column"}>
            <Text fontSize={"sm"} color={"blue.600"}>
              *Prices are in IDR x100
            </Text>
            <Text fontSize={"sm"} color={"blue.600"}>
              *Grayed out dates are not available
            </Text>
          </Flex>
        </Flex>
      </Flex>
    </Box>
  );
}

export default ReportCalendar;
