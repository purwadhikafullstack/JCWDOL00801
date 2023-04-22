import { addDays, addHours } from "date-fns";
import { id } from "date-fns/locale";
import { zonedTimeToUtc, utcToZonedTime } from "date-fns-tz";
import format from "date-fns/format";

const date = Date.now();
const timeZone = "Asia/Jakarta";
const utcDate = zonedTimeToUtc(date, timeZone);
const indonesiaDate = utcToZonedTime(utcDate, timeZone);

const INITIAL_STATE = {
  startDate: format(new Date(), "yyyy-MM-dd HH:mm:ss"),
  endDate: format(addDays(new Date(), 1), "yyyy-MM-dd HH:mm:ss"),
  dob: "",
  searchStartDate: "",
  searchEndDate: "",
  chartStartDate: "",
  chartEndDate: "",
};

export const dateReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case `SET_DOB`:
      return { ...state, ...action.payload };
    case `CLEAR_DOB`:
      return { ...state, dob: "" };
    case "CLEAR_ALLDATE":
      return (state = INITIAL_STATE);
    case "CLEAR_CHART_DATE":
      return { ...state, chartStartDate: "", chartEndDate: "" };
    default:
      return state;
  }
};
