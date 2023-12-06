import { orgRegisterOTPRequest, orgRegisterOTPSubmit, orgRegisterMainDetails, orgRegisterFinalSubmit, forgetPasswordLinkRequest, restPasswordSubmit, passwordLinkStatus } from './../../../apis/allapis';
import axios from "axios";
export const requestForOTP = async (data) => {
    try {
        let response = await axios.post(orgRegisterOTPRequest, data);
        return response;
    } catch (error) {
        return Promise.reject(error.response);
    }
}
export const submitOTP = async (data) => {
    try {
        let response = await axios.post(orgRegisterOTPSubmit, data);
        return response;
    } catch (error) {
        return Promise.reject(error.response);
    }
}
export const submitMainDetail = async (data) => {
    try {
        let response = await axios.post(orgRegisterMainDetails, data);
        return response;
    } catch (error) {
        return Promise.reject(error.response);
    }
}
export const submitFinalSubmit = async (data) => {
    try {
        let response = await axios.post(orgRegisterFinalSubmit, data);
        return response;
    } catch (error) {
        return Promise.reject(error.response);
    }
}
export const forgetPasswordLink = async (data) => {
    try {
        let response = await axios.post(forgetPasswordLinkRequest, data);
        return response;
    } catch (error) {
        return Promise.reject(error.response);
    }
}
export const restPassword = async (data) => {
    try {
        let response = await axios.post(restPasswordSubmit, data);
        return response;
    } catch (error) {
        return Promise.reject(error.response);
    }
}
export const getPasswordLinkStatus = async (data) => {
    try {
        let response = await axios.get(passwordLinkStatus+'/'+data.token);
        return response;
    } catch(err){
        return Promise.reject(err.message);
    }
}