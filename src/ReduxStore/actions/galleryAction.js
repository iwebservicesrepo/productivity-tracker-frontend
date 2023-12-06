import * as Constant from "../constant";
import axios from 'axios';
import { mainServerAppUrl } from '../../apis/mainapi';


export const getImageData = (data) => async (dispatch) => {
    axios.post(mainServerAppUrl + "/get-list", data)
        .then(async (res) => {
            let imd = res.data.data;
            let lastIndexValue = imd[imd.length - 1];
            const imageItemLength = (data) => {
                if (data === 0) {
                    return false;
                }
                else {
                    return true;
                }
            }
            dispatch({
                type: Constant.GET_IMAGE_DATA,
                payload: imd,
                lastValue: lastIndexValue?.key,
                imageSuccess: imageItemLength(imd.length)
            });
        })
        .catch((err) => {
            console.log(err);
        })
}

export const getUserData = () => async (dispatch) => {
    axios.post(mainServerAppUrl + "/users/list")
        .then(async (res) => {
            let imd = res.data.data;
            dispatch({
                type: Constant.GET_USER,
                payload: imd,
            });
        })
        .catch((err) => {
            console.log(err);
        })
}


export const getDepartmentList = (page,pageSize) => async (dispatch) => {
    let url = page||pageSize?mainServerAppUrl + "/department/get-department?pageSize="+pageSize+"&page="+page: mainServerAppUrl + "/department/get-department"
    
    axios.get(url)
        .then(async (res) => {
            let imd = res.data.data;
            dispatch({
                type: Constant.GET_DEPARTMENT_LIST,
                payload: imd,
            });
        })
        .catch((err) => {
            console.log(err);
        }) 
}