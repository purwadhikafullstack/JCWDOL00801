import { addDays, addHours } from "date-fns";
import { id } from "date-fns/locale";
import { zonedTimeToUtc, utcToZonedTime } from "date-fns-tz";
import format from "date-fns/format";

const date = Date.now();
const timeZone = "Asia/Jakarta";
const utcDate = zonedTimeToUtc(date, timeZone);
const indonesiaDate = utcToZonedTime(utcDate, timeZone);

const INITIAL_STATE = {
  startDate: new Date(format(addDays(new Date(), 1), "MM/dd/yyyy")).getTime(),
  endDate: new Date(format(addDays(new Date(), 2), "MM/dd/yyyy")).getTime(),
  dob: "",
  searchStartDate: "",
  searchEndDate: "",
  chartStartDate: "",
  chartEndDate: "",
};

export const dateBook = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case `SET_DOB_BOOK`:
      return { ...state, ...action.payload };
    case `CLEAR_DOB_BOOK`:
      return { ...state, dob: "" };
    case "CLEAR_ALLDATE_BOOK":
      return (state = INITIAL_STATE);
    case "CLEAR_CHART_DATE_BOOK":
      return { ...state, chartStartDate: "", chartEndDate: "" };
    default:
      return state;
  }
};
