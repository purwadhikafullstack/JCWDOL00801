import React, { useEffect, useRef } from "react";
import { DateRange } from "react-date-range";
import format from "date-fns/format";
import { addDays } from "date-fns";

import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

import { Input, InputGroup, InputLeftElement } from "@chakra-ui/react";
import { CalendarIcon } from "@chakra-ui/icons";
import { useDispatch } from "react-redux";
import { setDateAction } from "../actions/dateAction";

function CalendarDateRange(props) {
  //state untuk menyimpan date
  const [calendar, setCalendar] = React.useState([
    {
      startDate: new Date(),
      endDate: addDays(new Date(), 1),
      key: "selection",
    },
  ]);

  //state untuk mengontrol buka tutup calendar
  const [open, setOpen] = React.useState(false);

  // elemen untuk di toggle
  const refOne = useRef(null);
  const dispatch = useDispatch();

  useEffect(() => {
    // event listener untuk mengecek keydown dan click
    document.addEventListener("keydown", hideOnEscape, true);
    document.addEventListener("click", hideOnClickOutside, true);
  }, []);

  // hide calendar ketika menekan tombol esc
  const hideOnEscape = (e) => {
    if (e.key === "Escape") {
      setOpen(false);
    }
  };

  // hide calendar ketika menekan diluar calendar
  const hideOnClickOutside = (e) => {
    if (refOne.current && !refOne.current.contains(e.target)) {
      setOpen(false);
    }
  };

  const handleChange = (item) => {
    setCalendar([item.selection]);
    // props.checkinHandler(new Date(format(item.selection.startDate, "MM/dd/yyyy")).getTime())
    // props.checkoutHandler(new Date(format(item.selection.endDate, "MM/dd/yyyy")).getTime())
    dispatch(
      setDateAction({
        startDate: new Date(format(item.selection.startDate, "MM/dd/yyyy")).getTime(),
        endDate: new Date(format(item.selection.endDate, "MM/dd/yyyy")).getTime(),
      })
    );
  };

  return (
    <div className="calendarWrap">
      <InputGroup>
        <InputLeftElement pointerEvents="none" children={<CalendarIcon color="green.500" />} />
        <Input
          value={`${format(calendar[0].startDate, "MMM dd, yyy")} - ${format(
            calendar[0].endDate,
            "MMM dd, yyy"
          )}`}
          readOnly
          onClick={() => setOpen((open) => !open)}
        />
      </InputGroup>
      <div ref={refOne}>
        {open && (
          <DateRange
            onChange={(item) => handleChange(item)}
            editableDateInputs={true}
            moveRangeOnFirstSelection={false}
            ranges={calendar}
            minDate={new Date()}
            maxDate={addDays(calendar[0].startDate, 365)}
            months={1}
            direction="horizontal"
            className="calendarElement"
            rangeColors={["#38A169", "#cf543e", "#3e78cf"]}
          />
        )}
      </div>
    </div>
  );
}

export default CalendarDateRange;
