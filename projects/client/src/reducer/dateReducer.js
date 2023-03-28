import { addDays, addHours } from "date-fns";
import {id} from "date-fns/locale";
import { zonedTimeToUtc, utcToZonedTime } from 'date-fns-tz';
import format from "date-fns/format";

const date = Date.now();
const timeZone = 'Asia/Jakarta';
const utcDate = zonedTimeToUtc(date, timeZone);
const indonesiaDate = utcToZonedTime(utcDate, timeZone);

const INITIAL_STATE = {
  startDate: format(indonesiaDate, "yyyy-MM-dd HH:mm:ss"),
  endDate: format(addDays(new Date, 1), "yyyy-MM-dd HH:mm:ss"),
  dob: "",
};

export const dateReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case `SET_DOB`:
      return { ...state, ...action.payload };
    case `CLEAR_DOB`:
      return { ...state, dob: "" };
    case "CLEAR_ALLDATE":
      console.log("CLEAR DATE")
      return state = INITIAL_STATE;
    default:
      return state;
  }
};
