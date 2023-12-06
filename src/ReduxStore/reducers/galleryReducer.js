import * as constant from "../constant";

const initialState = {
    galleryData: [],
    userData: [],
    lastValue: "",
    loader: true,
    departmentList: [],
    imageSuccess: "",
}

export default function galleryReducers(state = initialState, action) {
    switch (action.type) {
        case constant.GET_IMAGE_DATA:
            return {
                ...state,
                galleryData: action.payload,
                lastValue: action.lastValue,
                loader: false,
                imageSuccess: action.imageSuccess
            }
        case constant.GET_USER:
            return {
                ...state,
                userData: action.payload,
                loader: false
            }
        case constant.GET_DEPARTMENT_LIST:
            return {
                ...state,
                loader: false,
                departmentList: action.payload,
            }
        default:
            return state;
    }
}