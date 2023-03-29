const INITIAL_STATE = {
  tenantId: "",
  noKtp: "",
  ktpImg: "",
  bankAccountNum: "",
  bankName: "",
  bankLogo: "",
};

export const tenantReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case `SET_TENANT_DATA`:
      return { ...state, ...action.payload };
    case `LOGOUT_SUCCESS`:
      return state;
    default:
      return state;
  }
};
