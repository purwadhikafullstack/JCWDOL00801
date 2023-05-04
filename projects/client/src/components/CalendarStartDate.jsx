import React, { useEffect, useRef } from "react";
import { Calendar } from "react-date-range";
import format from "date-fns/format";
import { setDateAction } from "../actions/dateAction";
import { useDispatch } from "react-redux";

import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

import { Input, InputGroup, InputLeftElement, Box } from "@chakra-ui/react";
import { CalendarIcon } from "@chakra-ui/icons";
import { subDays } from "date-fns";
import { useSelector } from "react-redux";

function CalendarStartDate(props) {
  const [calendar, setCalendar] = React.useState("");

  //state untuk mengontrol buka tutup calendar
  const [open, setOpen] = React.useState(false);

  const [minDate, setMinDate] = React.useState("");
  const [maxDate, setMaxDate] = React.useState("");
  const { searchStartDate, createdAt, searchEndDate } = useSelector((state) => {
    return {
      searchStartDate: state.dateReducer.searchStartDate,
      createdAt: state.userReducer.createdAt,
      searchEndDate: state.dateReducer.searchEndDate,
    };
  });

  const dispatch = useDispatch();
  const refOne = useRef(null);

  const handleSelect = (date) => {
    setCalendar(date);
    dispatch(setDateAction({ searchStartDate: format(date, "MM/dd/yyyy") }));
  };

  const hideOnEscape = (e) => {
    if (e.key === "Escape") {
      setOpen(false);
      setCalendar("");
    }
  };

  const hideOnClickOutside = (e) => {
    if (refOne.current && !refOne.current.contains(e.target)) {
      setOpen(false);
      setCalendar("");
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", hideOnEscape, true);
    document.addEventListener("click", hideOnClickOutside, true);
    const date = new Date();
    setMaxDate(date);
    setMinDate(new Date(createdAt));
  }, []);

  return (
    <Box w={"100%"}>
      <div className="calendarWrap">
        <InputGroup>
          <InputLeftElement pointerEvents="none" children={<CalendarIcon color="green.500" />} />
          <Input
            placeholder="Order Start Date"
            value={searchStartDate}
            readOnly
            onClick={() => setOpen((open) => !open)}
          />
        </InputGroup>
        <div ref={refOne}>
          {open && (
            <Calendar
              date={calendar === "" ? new Date() : calendar}
              minDate={minDate}
              maxDate={searchEndDate === "" ? maxDate : subDays(new Date(searchEndDate), 1)}
              onChange={handleSelect}
              className="calendarElement"
              color="#38A169"
            />
          )}
        </div>
      </div>
    </Box>
  );
}

export default CalendarStartDate;
