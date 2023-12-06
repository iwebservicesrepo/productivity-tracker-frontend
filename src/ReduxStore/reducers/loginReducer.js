import * as constant from "../constant";

const initialState = {
    subscriptionplans: {},
    allData: {},
    loader: true,
}


export default function loginReducers(state = initialState, action) {
    switch (action.type) {
        case constant.GET_ALL_LOGIN_DATA:
            return {
                ...state,
                subscriptionplans: action.payload[0].subscriptionplans,
                allData: action.payload[0],
                loader: false
            }
        default:
            return state;
    }
}