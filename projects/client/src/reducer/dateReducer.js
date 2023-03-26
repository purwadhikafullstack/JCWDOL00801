import { addDays } from "date-fns";
import format from "date-fns/format";

const INITIAL_STATE = {
  startDate: new Date(format(new Date(), "MM/dd/yyyy")).getTime(),
  endDate: new Date(format(addDays(new Date, 1), "MM/dd/yyyy")).getTime(),
  dob: "",
};

export const dateReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case `SET_DOB`:
      return { ...state, ...action.payload };
    case `CLEAR_DOB`:
      return { ...state, dob: "" };
    default:
      return state;
  }
};
