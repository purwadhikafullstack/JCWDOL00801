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
