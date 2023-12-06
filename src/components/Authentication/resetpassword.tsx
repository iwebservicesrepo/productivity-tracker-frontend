import { Field, Form, Formik, useFormikContext } from "formik";
import React, { Component, useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { Link, useHistory } from "react-router-dom";
import ValidationMessage from "../common/ValidationMessage";
import { eraseCookie } from "./authHelpers";
import { validatePasswordResetField } from "./model/ValidationSchema";
import { restPassword } from "./service/auth.service";
import { getPasswordLinkStatus } from "./service/auth.service";
export default function Resetpassword(props) {
  let navigate = useHistory();
  let [token, setToken] = useState(props.match.params.token);
  const [togglePassword, setTogglePass] = useState(true);
  const [view, setView] = useState(true);
  // validate email
  // send forgetpassword link to mail alog with token
  // create new pasword and redirect to login page.
  const submitPassword = async (value) => {
    let data = {
      token: token,
      password: value.password,
      confirmPassword: value.confirmPassword
    }
    try {
      let { status } = await restPassword(data);
      if (status == 200) {
        eraseCookie("_token");
        toast.success("Password reset successfull. Redirecting to login window.", {
          duration: 5000,
        });
        setTimeout(() => {
          navigate.replace("/");
        }, 5000);
      }
    } catch (error) {
      if (error.status == 500) {
        toast.error(error.data.message, {id:"reset error", duration: 9000 });
      }
    }
  };
  const showPassword = () => {
    setTogglePass(!togglePassword);
  };

  useEffect(() => {
    (async () => {
      let status = await getPasswordLinkStatus({ token });
      setView(status.data.isActive);
    })();
  }, [view])

  const [spclCharCheck, setSpclCharCheck] = useState(false);
  const [lowerCaseCheck, setlowerCaseCheck] = useState(false);
  const [checkNumber, setCheckNumber] = useState(false);
  const [checkUpperCase, setcheckUpperCase] = useState(false);
  const [checkLength, setcheckLength] = useState(false);
  const FormObserver = () => {
    const { values } = useFormikContext();
    let checkSpecialChar = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
    useEffect(() => {
      setSpclCharCheck(checkSpecialChar.test(values["password"]));
      setlowerCaseCheck(/[a-z]/.test(values["password"]));
      setCheckNumber(/\d/.test(values["password"]));
      setcheckUpperCase(/[A-Z]/.test(values["password"]));
      values["password"].length >= 8
        ? setcheckLength(true)
        : setcheckLength(false);
    }, [values]);
    return null;
  };
  return (view ? (
    <div className="auth login-wrapper">
      <div className="login-overlay">
        <img src={require('../../images/forgot-password-bg.jpg')} alt="" />
      </div>
      <Link to="/signup" className="login-logo">
        <img src={require("../../images/logoProd.png")} alt="" />
      </Link>
      <div className="auth_left">
        <Formik
          enableReinitialize={true}
          validateOnMount={true}
          validateOnChange={true}
          validateOnBlur={true}
          validationSchema={validatePasswordResetField}
          initialValues={{
            password: "",
            confirmPassword: "",
          }}
          onSubmit={(values) => { }}
        >
          {({ values, errors }) => (
            <Form className="login-from-wrapper">
              <div className="login-body">
                <h1>Recover your password</h1>
                <div className="go-back-button">
                  <Link className="btn btn-link" to="/">
                    <i className="fa fa-long-arrow-left mr-2" />Back
                  </Link>
                </div>
                <div className="form-group passwordIns">
                  <label className="form-label" htmlFor="exampleInputEmail1">
                    New Password<sup className="required"><i className="fa-solid fa-star-of-life"></i></sup>
                  </label>
                  <div className="input-group input-icon">
                    <Field
                      type={togglePassword ? "password" : "text"}
                      className="form-control"
                      placeholder="Password"
                      name="password"
                    />
                    <div className="card passwordPopover ">
                      <ul>
                        <li>
                          <small
                            className={`form-text   ${checkNumber ? "text-green" : "text-muted"
                              }`}
                          >
                            At least 1 Digit
                          </small>
                        </li>
                        <li>
                          <small
                            className={`form-text   ${lowerCaseCheck ? "text-green" : "text-muted"
                              }`}
                          >
                            At least 1 Lower Case
                          </small>
                        </li>
                        <li>
                          <small
                            className={`form-text   ${checkUpperCase ? "text-green" : "text-muted"
                              }`}
                          >
                            At least 1 Upper Case
                          </small>
                        </li>
                        <li>
                          <small
                            className={`form-text   ${spclCharCheck ? "text-green" : "text-muted"
                              }`}
                          >
                            At least 1 Special Character
                          </small>
                        </li>
                        <li>
                          <small
                            className={`form-text   ${checkLength ? "text-green" : "text-muted"
                              }`}
                          >
                            Minimum Length is 8 Character Long.
                          </small>
                        </li>
                      </ul>
                    </div>
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
                        {!togglePassword ? (
                          ""
                        ) : (
                          <span
                            className="slash"
                            style={{
                              position: "absolute",
                              top: "50%",
                              left: "50%",
                              transform: "translate(-50%,-50%)",
                              fontSize: "25px",
                            }}
                          >
                            /
                          </span>
                        )}
                      </span>
                    </div>
                  </div>
                  <ValidationMessage name="password" />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="exampleInputEmail1">
                    Confirm Password<sup className="required"><i className="fa-solid fa-star-of-life"></i></sup>
                  </label>
                  <Field
                    className="form-control"
                    placeholder="Confirm Password"
                    name="confirmPassword"
                  />
                  <ValidationMessage name="confirmPassword" />
                </div>
              </div>
              <div className="login-footer">
                <button
                  disabled={!!errors.password || !!errors.confirmPassword}
                  className="btn btn-primary btn-block"
                  type="button"
                  onClick={() =>
                    submitPassword({
                      password: values.password,
                      confirmPassword: values.confirmPassword,
                    })
                  }
                >
                  Change Password
                </button>
              </div>
              <FormObserver />
            </Form>
          )}
        </Formik>
      </div>
      <div className="auth_right">

      </div>
    </div>
  ) : (
    <div className="auth login-wrapper">
      <div className="login-overlay">
        <img src={require('../../images/forgot-password-bg.jpg')} alt="" />
      </div>
      <div className="login-logo">
        <img src={require("../../images/logoProd.png")} alt="" />
      </div>
      <div>
        <div className="auth_left">
          <div className="login-from-wrapper">
            <div className="login-body">
              <h1 className="alert alert-danger">Oops! This link has been expired.</h1>
              <div className="go-back-button">
                <Link className="btn btn-link" to="/">
                  <i className="fa fa-long-arrow-left mr-2" />Back to Login
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  ));
}
