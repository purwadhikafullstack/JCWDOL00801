export const setTenantAction = (data) => {
  return {
    type: "SET_TENANT_DATA",
    payload: data,
  };
};
export const tenantLogout = () => {
  return {
    type: "LOGOUT_SUCCESS",
  };
};
