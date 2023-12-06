import * as constant from "../constant";

const initialState = {
    roleList: [],
    userList: [],
    allUserList: [],
    orgList: {},
    allOrgList: {},
    allUserCount: [],
    loader: true,
    isLoader: true,
    ifloader: true,
    success: false,
    notSuccess: false
}

export default function userReducer(state = initialState, action) {
    switch (action.type) {
        case constant.GET_RESET_STATE:
            return {
                loader: true,
                isLoader: true,
                ifloader: true
            }
        case constant.GET_ROLE:
            return {
                ...state,
                roleList: action.payload,
            }
        case constant.GET_USER_LIST:
            return {
                ...state,
                userList: action.payload,
                loader: false
            }
        case constant.GET_ORGANIZATION_DATA:
            return {
                ...state,
                orgList: action.payload,
                loader: false,
                isLoader: true,
            }
        case constant.GET_ALL_ORGANIZATION_DATA:
            return {
                ...state,
                allOrgList: action.payload,
                isLoader: false,
                loader: true
            }
        case constant.GET_ALL_USER_LIST:
            return {
                ...state,
                allUserList: action.payload,
                loader: false
            }
        case constant.GET_USER_COUNT:
            return {
                ...state,
                allUserCount: action.payload,
                ifloader: false,
                notSuccess: action.successed
            }
        case constant.GET_USER_SUCCESS:
            return {
                ...state,
                success: action.Success,
            }
        case constant.REMOVED_sUCCESSED:
            return {
                ...state,
                notSuccess: action.successed,
            }
        default:
            return state;
    }
}