import * as Constant from "../constant";
import axios from 'axios';
import { mainServerAppUrl } from '../../apis/mainapi';
import toast from "react-hot-toast";
import { getDepartmentList } from './galleryAction';

let count = 0;

export const getRole = () => async (dispatch) => {
    try {
        let { data } = await axios.get(mainServerAppUrl + "/roles/get-all");
        dispatch({
            type: Constant.GET_ROLE,
            payload: data.roles,
        })
        return data;
    } catch (error) {
        return error;
    }
}


export const getUser = (page, pageSize) => async (dispatch) => {
    try {
        let url = page || pageSize ? mainServerAppUrl + "/users/list-all?pageSize=" + pageSize + "&page=" + page : mainServerAppUrl + "/users/list-all"

        let { data } = await axios.post(url);
        dispatch({
            type: Constant.GET_USER_LIST,
            payload: data.data,
        })
        return data;

    } catch (error) {
        return error;
    }
}

export const getAllUserCount = () => async (dispatch) => {
    try {
        let url = mainServerAppUrl + "/users/list-all"
        let { data } = await axios.post(url);
        count = data?.data?.length
        dispatch({
            type: Constant.GET_USER_COUNT,
            payload: data.data,
            successed: true
        })
        return data;

    } catch (error) {
        return error;
    }
}

export const getAllUsers = () => async (dispatch) => {
    try {

        let { data } = await axios.post(mainServerAppUrl + "/users/all-users");
        dispatch({
            type: Constant.GET_ALL_USER_LIST,
            payload: data.data,
        })
        return data;
    } catch (error) {
        return error;
    }
}

export const updateUser = (formData) => async (dispatch) => {
    // delete formData.email;
    try {
        let { data } = await axios.post(mainServerAppUrl + "/users/update", formData);
        dispatch(getUser())
        dispatch(getAllUserCount());
        toast.success("User Updated Successfully", { duration: 2000 });
        return data;
    } catch (error) {
        return error;
    }
}


export const userDeleteHandler = (formData) => async (dispatch) => {
    try {
        let { data } = await axios.post(mainServerAppUrl + "/users/delete", { _id: formData });
        toast.success("User Deleted successfully", { duration: 2000 });
        dispatch(getUser())
        dispatch(getAllUserCount());
        return data;
    } catch (error) {
        return error;
    }
}

export const deleteAllAssociatedData = (formData) => async (dispatch) => {
    let id = { userId: formData };
    console.log({ id })
    try {
        let { data } = await axios.post(mainServerAppUrl + "/delete-user-data", id);
        toast.success("User Deleted successfully", { duration: 2000 });
        dispatch(getUser())
        dispatch(getAllUserCount());
        return data;
    } catch (error) {
        console.log(error)
        //toast.error(error, { duration: 2000 });
        return error;
    }
}


export const deleteDepartmentList = (id) => async (dispatch) => {
    axios.post(mainServerAppUrl + "/department/delete-department", { id: id })
        .then(async (res) => {
            toast.success("Department deleted successfully", { duration: 2000 });
            dispatch(getDepartmentList())
        })
        .catch((err) => {
            console.log(err);
        })
}

export const getAllOrganizationData = (page, pageSize) => async (dispatch) => {
    axios.get(mainServerAppUrl + "/admin/all-organizations?pageSize=" + pageSize + "&page=" + page)
        .then(async (res) => {
            dispatch({
                type: Constant.GET_ALL_ORGANIZATION_DATA,
                payload: res.data,
            })
        })
        .catch((err) => {
            console.log(err);
        })
}

export const getOrganizationDetailPage = (id) => async (dispatch) => {
    axios.post(mainServerAppUrl + "/super-admin/get-data-by-org", { orgId: id })
        .then(async (res) => {
            dispatch({
                type: Constant.GET_ORGANIZATION_DATA,
                payload: res.data,
            })
        })
        .catch((err) => {
            console.log(err);
        })
}

export const deleteOrgData = (formData) => async (dispatch) => {
    let id = { orgId: formData };
    console.log({ id })
    try {
        let { data } = await axios.post(mainServerAppUrl + "/delete-org-data", id);
        toast.success("Organization Deleted Successfully", { duration: 2000 });
        dispatch(getAllOrganizationData(0, 10));
        return data;
    } catch (error) {
        console.log(error)
        //toast.error(error, { duration: 2000 });
        return error;
    }
}

export const submitUser = (formData) => async (dispatch) => {
    try {
        let { data, status } = await axios.post(mainServerAppUrl + "/users/create/new", formData);
        if (status === 200) {
            if (data.success == true) {
                dispatch(getUser())
                dispatch(getAllUserCount());
                toast.success("User Created SuccessFully", { duration: 2000 });
                // console.log({ data })
            }
            if (data.success == false) {
                toast.error(data.message, { duration: 2000 });
            }
            dispatch({
                type: Constant.GET_USER_SUCCESS,
                Success: count > 3 ? false : true,
            })
        }
        return data;
    } catch (error) {
        toast.error("Something Went Wrong", { duration: 2000 });
        dispatch(getUser())
        dispatch(getAllUserCount());
        return error;
    }
}






