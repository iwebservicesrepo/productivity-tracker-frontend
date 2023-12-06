import React, { useEffect, useState } from "react";
import { useHistory, Link } from "react-router-dom";
import axios from "axios";
import {
  getCookie,
  getPayload,
  isLoggedIn,
  iss,
  setCookie,
  getAuthUser
} from "./authHelpers";
import {
  AuthResponse,
  SignInDataResponse,
} from "./model/auth.service.data.model";
import { mainServerAppUrl } from "../../apis/mainapi";
import { signUpApi } from "../../apis/allapis";
import { Field, Form, Formik } from "formik";
import {
  loginFormValidationField,
  validatePasswordResetField,
} from "./model/ValidationSchema";
import ValidationMessage from "../common/ValidationMessage";
import toast, { Toaster } from "react-hot-toast";
import { useSelector } from 'react-redux';

export default function LoginPage(props) {
  let navigate = useHistory();
  const token = sessionStorage.getItem('token');
  let payload = {
    email: "",
    password: ""
  }
  if(token){
    payload = getPayload(token);
  }
  const [loginState, loginSetState] = useState({
    email: "",
    password: "",
  });
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [submitBtn, setSubmitBtn] = useState(false);
  const [togglePassword, setTogglePass] = useState(true);

  const [checkLogin, setLogin] = useState(isLoggedIn());

  useEffect(() => {
    if (checkLogin) {
      if (getAuthUser()?.role === "admin") {
        navigate.push("/adminDashboard");
      }
      if (getAuthUser()?.role === "user-administrator") {
        navigate.push("/adminDashboard");
      }
      if (getAuthUser()?.role === "employee") {
        navigate.push("/productivity");
      }
      if (getAuthUser()?.role === "super-admin") {
        navigate.push("/superAdminDashboard");
      }
      if (getAuthUser()?.role === "manager" || getAuthUser()?.role === "compliance-user") {
        navigate.push("/dashboard");
      }
    } else {
      navigate.replace("/");
    }
  }, [checkLogin]);

  const handleInput = (e) => {
    let { id, value } = e.target;
    loginSetState({
      ...loginState,
      [id]: value,
    });

    if (id == "email") {
      if (!isValidEmail(value)) {
        setEmailError("Email is invalid");
      } else {
        setEmailError("");
      }
    }
    if (id == "password") {
      if (!isValidPassword(value)) {
        setPasswordError("Password Required");
      } else {
        setPasswordError("");
      }
    }
  };

  const signIn = async (e) => {
    e.preventDefault();
    //    dispatch(signUpAction(loginState))

    try {
      let response = await axios.post(signUpApi, loginState);
      if (response.data.success) {
        let userCredentials = response.data as AuthResponse<SignInDataResponse>;
        handleResponseoken(userCredentials.data);
        navigate.push("/adminDashboard");
      } else {
        return false;
      }
    } catch (error) {
      alert(error.message);
      return false;
    }
  };

  const submitPassword = async (val) => {
    let response = await axios.post(signUpApi, val);
    // console.log(response)
    if(val.rememberMe){
      sessionStorage.setItem('token', response.data.data.token);
    }
    
    if (response.data.success) {
      let userCredentials = response.data as AuthResponse<SignInDataResponse>;
      handleResponseoken(userCredentials.data);
      if (userCredentials?.data?.role === "admin") {
        navigate.push("/adminDashboard");
      }
      if (userCredentials?.data?.role === "user-administrator") {
        navigate.push("/adminDashboard");
      }
      if (userCredentials?.data?.role === "employee") {
        navigate.push("/productivity");
      }
      if (userCredentials?.data?.role === "super-admin") {
        navigate.push("/superAdminDashboard");
      }
      if (userCredentials?.data?.role === "manager" || userCredentials?.data?.role === "compliance-user") {
        navigate.push("/dashboard");
      }
    } else {
      toast.error(response?.data?.message, {
        id: "invalid credentials",
        duration: 5000,
      });
    }
  };

  const handleResponseoken = (data: SignInDataResponse) => {
    let cookie = {
      name: "_token",
      value: data.token,
      days: 30,
    };
    // console.log({ data })
    setCookie(cookie);
    const token = getCookie("_token");
    const payload = getPayload(token);

    if (payload.iss == iss) {
      // here i need to change auth status to true.
      if (data?.role === "admin") {
        navigate.push("/adminDashboard");
      }
      if (data?.role === "user-administrator") {
        navigate.push("/adminDashboard");
      }
      if (data?.role === "employee") {
        navigate.push("/productivity");
      }
      if (data?.role === "super-admin") {
        navigate.push("/superAdminDashboard");
      }
      if (data?.role === "manager" || data?.role === "compliance-user") {
        navigate.push("/dashboard");
      }
    }
  };

  function isValidEmail(email) {
    return /\S+@\S+\.\S+/.test(email);
  }
  function isValidPassword(password) {
    if (password.length > 0) {
      return true;
    } else {
      return false;
    }
  }
  const showPassword = () => {
    setTogglePass(!togglePassword);
  };

  const google = () => {
    window.open(mainServerAppUrl + "/auth/google", "_self");
  };

  return (
    <div className="auth login-wrapper">
      <div className="login-overlay">
        <img src={require('../../images/login-bg.jpg')} alt="" style={{ objectFit: "cover" }} />
      </div>
      <Link to="/" className="login-logo">
        <img src={require("../../images/logoProd.png")} alt="" />
      </Link>
      <div className="auth_left">
        <div className="login-header">
          <h1>Sign In</h1>
          <p>No account yet?<Link to="/signup">Sign Up for Free Forever</Link></p>
        </div>
        <Formik
          enableReinitialize={true}
          validateOnMount={true}
          validateOnChange={true}
          validateOnBlur={true}
          validationSchema={loginFormValidationField}
          initialValues={{
            email: payload.email,
            password: payload.password,
            rememberMe: false
          }}
          onSubmit={(values) => { }}
        >
          {({ errors, values }) => (
            <Form className="login-from-wrapper">
              <div className="login-body">
                <div className="form-group">
                  <label className="form-label">
                    Work Email{" "}
                    <sup className="required">
                      <i className="fa-solid fa-star-of-life"></i>
                    </sup>
                  </label>
                  <Field
                    type="email"
                    className="form-control"
                    placeholder="Enter email"
                    name="email"
                  />
                  <ValidationMessage name="email" />
                </div>
                <div className="form-group">
                  <label className="form-label">
                    Password{" "}
                    <sup className="required">
                      <i className="fa-solid fa-star-of-life"></i>
                    </sup>
                    <Link className="float-right small" to="/forgotpassword">
                      I forgot password
                    </Link>
                  </label>

                  <div className="input-group input-icon">
                    <Field
                      type={togglePassword ? "password" : "text"}
                      className="form-control"
                      placeholder="Password"
                      name="password"
                    />

                    <div className="input-group-append">
                      <span
                        onClick={showPassword}
                        style={{
                          cursor: "pointer",
                          position: "relative"
                        }}
                        className="input-group-text"
                      >
                        <i
                          style={{
                            cursor: "pointer",
                          }}
                          className="fa fa-eye"
                        ></i>
                        {!togglePassword ? "" : <span className="slash" style={{
                          position: "absolute",
                          top: "50%",
                          left: "50%",
                          transform: "translate(-50%,-50%)",
                          fontSize: "25px"
                        }}>/</span>}
                      </span>
                    </div>
                  </div>
                  <ValidationMessage name="password" />
                </div>
                <div className="form-group">
                  <div className="form-check">
                  <Field type="checkbox" name="rememberMe" className="form-check-input"/>
                    <label className="form-check-label">Remember me</label>
                  </div>
                </div>
                <div className="login-footer">
                  <button
                    disabled={!!errors?.email || !!errors?.password}
                    className="btn btn-primary btn-block"
                    type="button"
                    onClick={() =>
                      submitPassword({
                        email: values?.email,
                        password: values.password,
                        rememberMe: values?.rememberMe
                      })
                    }
                  >
                    Sign In
                  </button>
                  {/* <button
                      className="btn btn-primary btn-block google-btn"
                      type="button"
                      onClick={google}
                    >
                      <span><img src={require("../../assets/images/googleimg.png")} /> </span>Sign in with Google
                    </button> */}
                </div>
              </div>
            </Form>
          )}
        </Formik>
      </div>
      <div className="auth_right">
        <div className="login-text-right">
          <p>Unlock Your<br />
            Team Performance</p>
        </div>
      </div>
    </div>
  );
}
