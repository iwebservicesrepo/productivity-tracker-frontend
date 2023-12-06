import { Field, Form, Formik, ErrorMessage, useFormikContext } from "formik";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import * as Yup from "yup";
import { createBrowserHistory } from "history";
import axios from "axios";
import { mainServerAppUrl } from "../../apis/mainapi";
import {
  getAuthUser,
  getCookie,
  getPayload,
  iss,
  setCookie,
} from "../Authentication/authHelpers";
import toast from "react-hot-toast";

const history = createBrowserHistory();

export default function SetPassword(props) {
  const [spclCharCheck, setSpclCharCheck] = useState(false);
  const [lowerCaseCheck, setlowerCaseCheck] = useState(false);
  const [checkNumber, setCheckNumber] = useState(false);
  const [checkUpperCase, setcheckUpperCase] = useState(false);
  const [checkLength, setcheckLength] = useState(false);
  const [togglePassword, setTogglePass] = useState(true);

  const [token, setToken] = useState(props.match.params.token);

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

  const showPassword = () => {
    setTogglePass(!togglePassword);
  };

  const submitForm = async (formData) => {
    try {
      let { data } = await axios.post(
        mainServerAppUrl + "/user/set/password",
        formData
      );

      let cookie = {
        name: "_token",
        value: data.userDetails.token,
        days: 30,
      };
      setCookie(cookie);

      console.log(data)

      const token = getCookie("_token");
      const payload = getPayload(token);

      // if (payload.iss === iss.setPass) {
        if (data.userDetails?.role === "admin" || data.userDetails?.role === "user-administrator") {
          history.push("/adminDashboard");
        }
        if (data.userDetails?.role === "employee") {
          history.push("/productivity");
        }
        if (data.userDetails?.role === "super-admin") {
          history.push("/superAdminDashboard");
        }
        if (data.userDetails?.role === "manager" || data.userDetails?.role === "compliance-user") {
          history.push("/dashboard");
        }
        window.location.reload();
      // }
    } catch (error) {
      toast.error("something went wrong.", { duration: 2000 });
    }
  };

  return (
    <>
      <div className="auth login-wrapper">
        <div className="login-overlay">
          <img src={require('../../images/login-bg.jpg')} alt="" style={{ objectFit: "cover" }} />
        </div>
        <Link to="/set-password" className="login-logo">
          <img src={require("../../images/logoProd.png")} alt="" />
        </Link>
        <div className="auth_left">
          <div className="login-header">
            <h1>Set Password</h1>
          </div>
          <Formik
            initialValues={{
              password: "",
              confirmPassword: "",
              token: token,
            }}
            validationSchema={Yup.object().shape({
              password: Yup.string().required("Password is required").matches(
                /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
                "Password doesn't meet the requirement"
              ),
              confirmPassword: Yup.string()
                .oneOf([Yup.ref("password"), null], "Passwords must match")
                .required("Confirm Password is required"),
            })}
            onSubmit={(fields) => {
              submitForm(fields);
            }}
            render={({ errors, status, touched }) => (
              <Form className="login-from-wrapper">
                <div className="login-body">
                  <div className="form-group passwordIns">
                    <label htmlFor="password">Password</label>
                    <div className="input-group input-icon">
                      <Field
                        name="password"
                        type={togglePassword ? "password" : "text"}
                        className={
                          "form-control" +
                          (errors.password && touched.password
                            ? " is-invalid"
                            : "")
                        }
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
                    <ErrorMessage
                      name="password"
                      component="div"
                      className="invalid-feedback"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="confirmPassword">Confirm Password</label>
                    <Field
                      name="confirmPassword"
                      type="password"
                      className={
                        "form-control" +
                        (errors.confirmPassword && touched.confirmPassword
                          ? " is-invalid"
                          : "")
                      }
                    />
                    <ErrorMessage
                      name="confirmPassword"
                      component="div"
                      className="invalid-feedback"
                    />
                  </div>
                </div>
                <div className="login-footer">
                  <button
                    className="btn btn-primary btn-block"
                    type="submit"
                  >
                    Set Password
                  </button>
                </div>
                <FormObserver />
              </Form>
            )}
          />
        </div>
      </div>
      <div className="auth_right">

      </div>
    </>
  );
}
