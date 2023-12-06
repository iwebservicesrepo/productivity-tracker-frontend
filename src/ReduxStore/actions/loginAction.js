import * as Constant from "../constant";
import axios from 'axios';
import { mainServerAppUrl } from '../../apis/mainapi';
import toast from "react-hot-toast";


export const getAllLoginData = () => async (dispatch) => {
    try {
        let { data } = await axios.get(mainServerAppUrl + "/logged-in-userDetails");
        dispatch({
            type: Constant.GET_ALL_LOGIN_DATA,
            payload: data,
        })
        return data;
    } catch (error) {
        return error;
    }
}
export const getResetState = () =>  (dispatch) => {
    dispatch({
        type: Constant.GET_RESET_STATE,
    })
}
