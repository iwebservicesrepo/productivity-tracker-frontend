import { mainServerAppUrl } from "./../../apis/mainapi";
import { setCookiesData } from "./model/auth.service.data.model";

export const iss = {
  login: mainServerAppUrl + "/users/login",
  signup: mainServerAppUrl + "/organizations/final-Submit",
  googleAuth: mainServerAppUrl + "/organizations/googleauth",
  setPass: mainServerAppUrl + "/user/set/password",
  changePassword: mainServerAppUrl + "/change-password"
};
export const setCookie = (data: setCookiesData) => {
  let expires = "";
  if (data.days) {
    let date = new Date();
    date.setTime(date.getTime() + data.days * 24 * 60 * 60 * 1000);
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = data.name + "=" + (data.value || "") + expires + "; path=/";
};
export const getCookie = (name) => {
  var nameEQ = name + "=";
  var ca = document.cookie.split(";");
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == " ") c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
};
export const eraseCookie = (name: string) => {
  document.cookie = name + "=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
};

const deCodePayload = (token: string) => {
  return JSON.parse(atob(token));
};

export const getPayload = (token: string) => {
  const payload = token.split(".")[1];
  return deCodePayload(payload);
};

export const getAuthUser = () => {
  const token = getCookie("_token");
  if (token) {
    const payload = getPayload(token);
    return {
      _id: payload._id,
      reportsTo: payload.reportsTo,
      role: payload.role,
      emailId: payload.email,
      organization: payload?.organization,
      name: payload?.name, 
      permissions: payload?.permissions,
      departmentId: payload?.department,
      subscriptionDetails: {
        type: payload?.planDetails?.plan_type === "free-forever" ? "free" : payload?.planDetails?.plan_type,
      }
    };
  }
};

const isValid = () => {
  const token = getCookie("_token");

  if (token) {
    const payload = getPayload(token);

    if (Date.now() >= payload?.exp * 1000) {
      return false;
    } else {
      return true;
    }
  } else {
    return false;
  }
};
export const isLoggedIn = () => {
  return isValid();
};
