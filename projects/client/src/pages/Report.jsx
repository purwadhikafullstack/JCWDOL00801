import React, { useEffect } from "react";
import { Box, Heading, Text } from "@chakra-ui/react";
import { format, isWeekend } from "date-fns";
import { Calendar } from "react-date-range";
import { Select as Select2 } from "chakra-react-select";
import Axios from "axios";
import Swal from "sweetalert2";

function Report(props) {
  const [propData, setPropData] = React.useState(null);
  const [roomData, setRoomData] = React.useState(null);
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
        } else {
          Swal.fire({
            icon: "error",
            title: `You have not create a property, please create it first`,
            confirmButtonText: "OK",
            confirmButtonColor: "#48BB78",
            timer: 3000,
          }).then((res) => {
            window.scrollTo(0, 0);
          });
        }
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {}, []);

  useEffect(() => {
    getPropData();
  }, []);

  function customDayContent(day) {
    let extraDot = null;
    extraDot = (
      <p
        style={{
          position: "absolute",
          top: "50%",
        }}
      >
        10000
      </p>
    );

    return (
      <Box>
        {extraDot}
        <span>{format(day, "d")}</span>
      </Box>
    );
  }
  return (
    <Box pb="5" px={{ base: "5", md: "20" }}>
      <Heading mb={6}>Report</Heading>
      <Select2 isSearchable isClearable options={propData} placeholder="Choose Property"></Select2>
      <div className="calendarWrap">
        <Calendar
          date={new Date()}
          dayContentRenderer={customDayContent}
          className="static-calendar"
          color="#38A169"
        />
      </div>
    </Box>
  );
}

export default Report;
