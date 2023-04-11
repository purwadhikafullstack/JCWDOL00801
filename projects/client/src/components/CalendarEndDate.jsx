import React, { useEffect, useRef } from "react";
import { Calendar } from "react-date-range";
import format from "date-fns/format";
import { setDateAction } from "../actions/dateAction";
import { useDispatch } from "react-redux";

import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

import { Input, InputGroup, InputLeftElement } from "@chakra-ui/react";
import { CalendarIcon } from "@chakra-ui/icons";
import { addDays } from "date-fns";
import { useSelector } from "react-redux";

function CalendarEndDate(props) {
  const [calendar, setCalendar] = React.useState("");

  //state untuk mengontrol buka tutup calendar
  const [open, setOpen] = React.useState(false);

  const [minDate, setMinDate] = React.useState("");
  const [maxDate, setMaxDate] = React.useState("");
  const { searchEndDate, searchStartDate, createdAt } = useSelector((state) => {
    return {
      searchEndDate: state.dateReducer.searchEndDate,
      searchStartDate: state.dateReducer.searchStartDate,
      createdAt: state.userReducer.createdAt,
    };
  });

  const dispatch = useDispatch();
  const refOne = useRef(null);

  const handleSelect = (date) => {
    setCalendar(date);
    dispatch(setDateAction({ searchEndDate: format(date, "MM/dd/yyyy") }));
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
    <div className="calendarWrap">
      <InputGroup>
        <InputLeftElement pointerEvents="none" children={<CalendarIcon color="green.500" />} />
        <Input
          placeholder="Order End Date"
          value={searchEndDate}
          readOnly
          onClick={() => setOpen((open) => !open)}
        />
      </InputGroup>
      <div ref={refOne}>
        {open && (
          <Calendar
            date={calendar === "" ? new Date() : calendar}
            minDate={searchStartDate === "" ? minDate : addDays(new Date(searchStartDate), 1)}
            maxDate={maxDate}
            onChange={handleSelect}
            className="calendarElement"
            color="#38A169"
          />
        )}
      </div>
    </div>
  );
}

export default CalendarEndDate;
