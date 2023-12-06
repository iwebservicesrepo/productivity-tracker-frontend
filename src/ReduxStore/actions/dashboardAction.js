import * as Constant from "../constant";
import axios from 'axios';
import { mainServerAppUrl } from '../../apis/mainapi';
import toast from "react-hot-toast";


export const getAdminData = (formData) => async (dispatch) => {
    try {
        let { data } = await axios.post(mainServerAppUrl + "/dashboard/analytics", formData);
        dispatch({
            type: Constant.GET_ADMIN_DATA,
            payload: data,
            loader: false
        })
        return data;
    } catch (error) {
        return error;
    }
}