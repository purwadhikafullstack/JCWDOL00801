export const setDateAction = (data) => {
  return {
    type: "SET_DOB",
    payload: data,
  };
};
export const clearDobAction = () => {
  return {
    type: "CLEAR_DOB",
  };
};
export const clearAllDate = () => {
  return {
    type: "CLEAR_ALLDATE",
  };
};
export const clearChartDate = () => {
  return {
    type: "CLEAR_CHART_DATE",
  };
};
export const setDateActionBook = (data) => {
  return {
    type: "SET_DOB_BOOK",
    payload: data,
  };
};
export const clearDobActionBook = () => {
  return {
    type: "CLEAR_DOB_BOOK",
  };
};
export const clearAllDateBook = () => {
  return {
    type: "CLEAR_ALLDATE_BOOK",
  };
};
export const clearChartDateBook = () => {
  return {
    type: "CLEAR_CHART_DATE_BOOK",
  };
};
