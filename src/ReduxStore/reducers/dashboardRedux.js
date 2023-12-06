import * as constant from "../constant";

const initialState = {
    adminData: {},
    loader: true,
}

export default function adminReducers(state = initialState, action) {
    switch (action.type) {
        case constant.GET_ADMIN_DATA:
            return {
                ...state,
                adminData: action.payload,
                loader: action.loader,
            }
        case constant.SET_LOADER:
            return {
                ...state,
                loader: true,
            }
        default:
            return state;
    }
}