const INITIAL_STATE = {
    bankAccountNum: ""
}

export const userReducer = (state = INITIAL_STATE, action ) =>{
    switch (action.type) {
        case `CHANGE_NUM`:
            return {...state, ...action.payload};
        default:
            return state;
    }
}
