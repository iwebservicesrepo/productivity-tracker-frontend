import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";

import {
  Form,
  Field,
  Formik,
  ErrorMessage,
  useFormikContext,

} from "formik";

import { CountryCodes } from "../common/CountryCodes";
import ValidationMessage from "../common/ValidationMessage";
import ReCAPTCHA from "react-google-recaptcha";
import ReactFlagsSelect from "react-flags-select";
import toast, { Toaster } from "react-hot-toast";
import "./users.css";
import "../Authentication/flags.css";
import { registrationValidationSchema } from "./model/ValidationSchema";
import { requestForOTP, submitFinalSubmit, submitMainDetail, submitOTP } from "./service/auth.service";
import { getCookie, getPayload, isLoggedIn, iss, setCookie } from "./authHelpers";
import Countdown, { zeroPad } from 'react-countdown';
import moment from 'moment';
import axios from "axios";



export default function SignUp(props) {
  let navigate = useHistory();


  const [togglePassword, setTogglePass] = useState(true);

  const [checkLogin, setLogin] = useState(isLoggedIn());

  let [formsteps, setFormSteps] = useState(1);
  let [newLabels, setCustomLabels] = useState({});

  const [requestedEmail, setRequestedEmail] = useState("");
  const [selected, setSelected] = useState("IN");
  const [selectedCountry, setselectedCountry] = useState({
    code: "+91",
    country: "",
    iso: "",
  });
  const [isVerified, setVerified] = useState(false);

  const [spclCharCheck, setSpclCharCheck] = useState(false);
  const [lowerCaseCheck, setlowerCaseCheck] = useState(false);
  const [checkNumber, setCheckNumber] = useState(false);
  const [checkUpperCase, setcheckUpperCase] = useState(false);
  const [checkLength, setcheckLength] = useState(false);
  const [resetState, setResetState] = useState(false);
  const [resetTime, setResetTime] = useState(10000);
  const [changeCountDown, setChangeCountDown] = useState(false);
  const [counter, setCounter] = useState(-1);
  const [resetButton, setResetButton] = useState(false);
  const [ip, setIP] = useState('');

  const getData = async () => {
    const res = await axios.get('https://geolocation-db.com/json/')
    setIP(res.data.IPv4)
    console.log(ip)
  }

  useEffect(() => {
    getData();
    const timer = counter > 0 && setInterval(() => setCounter(counter - 1), 1000);
    return () => clearInterval(timer);

  }, [counter]);


  const FormObserver = () => {
    const { values } = useFormikContext();
    let checkSpecialChar = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
    useEffect(() => {
      setSpclCharCheck(checkSpecialChar.test(values["password"]))
      setlowerCaseCheck(/[a-z]/.test(values["password"]));
      setCheckNumber(/\d/.test(values["password"]));
      setcheckUpperCase(/[A-Z]/.test(values["password"]));
      values["password"].length >= 8 ? setcheckLength(true) : setcheckLength(false);

    }, [values]);

    return null;
  };

  function handleOnchange() {
    setVerified(true);

  }
  useEffect(() => {
    if (checkLogin) {
      navigate.replace("/profile");
    }
  }, [checkLogin]);

  useEffect(() => {
    let customLabels = {};
    CountryCodes.map((val, index) => {
      customLabels[val.iso] = val.iso;
      customLabels[val.iso] = {
        primary: val.country,
        secondary: "+" + val.code,
      };
    });
    setCustomLabels({ ...customLabels });
  }, []);

  function getCountryCode(C_code) {

    let newCountry = CountryCodes.map((data) => {
      return {
        code: "+" + data.code,
        country: data.country,
        iso: data.iso
      }
    })
    let a = newCountry.find((code) => {
      return code.iso == C_code;
    });

    setSelected(C_code);
    setselectedCountry({ ...a });
  }

  async function resendOTP(values?) {

    let val = {
      requestedEmail: values?.email,
    };
    try {
      let { status } = await requestForOTP(val);
      if (status == 200) {
        toast.success("OTP sent", { duration: 5000 })
      }
    } catch (error) {
      if (error.status == 500) {
        toast.error(error.data.message, { duration: 5000 });
        setResetState(true)
        getCountDownTime()
      }
    }

  }

  const handleResponseoken = (data) => {

    let cookie = {
      name: "_token",
      value: data.token,
      days: 30,
    };

    setCookie(cookie);
    const token = getCookie("_token");
    const payload = getPayload(token);

    // if (payload.iss == iss.signup) {
      // here i need to change auth status to true.
      navigate.push("/adminDashboard");
    // }
  };

  async function formStep(values?, type?, fsteps?) {

    if (type == "request-otp") {
      let val = {
        requestedEmail: values?.email,
      };
      try {
        let { status } = await requestForOTP(val);
        if (status == 200) {
          setFormSteps(fsteps);
          setResetState(false)
          setChangeCountDown(false)
        }
      } catch (error) {
        if (error.status == 400) {
          setResetState(true)
          toast.error("No Personal Emails allowed, Enter only Company Domains!", { duration: 5000 });
        }
        else {
          setResetState(true)
          toast.error(error.data.message, { id: "user already exists", duration: 5000 });
          getCountDownTime()

        }
      }
    }

    if (type == "submit-otp") {
      try {

        let data = {
          requestedEmail: values?.email,
          otp: values?.otp,
          ip: ip
        };
        let { status } = await submitOTP(data);

        if (status === 200) {
          setFormSteps(fsteps);
          toast.success("Email Verified Successfully", { duration: 5000 });
        }
      } catch (error) {
        if (error.status === 500) {
          localStorage.setItem("expireTime", error.data.expiredDate);
          toast.error(error.data.message, { id: "error message", duration: 5000 });
          getCountDownTime()
        }
      }
    }

    if (type == "submit-details") {
      try {
        let { status } = await submitMainDetail(values);
        if (status == 200) {
          setFormSteps(fsteps);
          // toast.success("Details Submit successfully ", { duration: 5000 });
        }

      } catch (error) {
        if (error.status == 500) {
          toast.error(error.data.message, { duration: 5000 });
        }

      }
    }
    if (type == "final-submit") {
      try {
        setVerified(false);
        let { status, data } = await submitFinalSubmit(values);
        if (status == 200) {
          toast.success(
            "Organization registered successfully.\n Redirecting to dashboard.",
            { duration: 5000 }
          );
          setTimeout(() => {
            handleResponseoken(data.userDetails);
          }, 4000);
        }

      } catch (error) {
        if (error.status == 500) {
          toast.error(error.data.message, { duration: 5000 });
        }
      }

    }

  }

  const renderer = ({ hours, minutes, seconds, completed }) => {
    if (completed) {
      setChangeCountDown(false)
      setResetButton(false)
    } else {
      setResetButton(true)
      return <span>{zeroPad(minutes)}:{zeroPad(seconds)}</span>;
    }
  };

  const getCountDownTime = () => {
    const expireTime = localStorage.getItem("expireTime");
    const nowTime = new Date()
    var a = moment(nowTime);
    var b = moment(new Date(Number(expireTime)))
    //a.diff(b, 'minutes');
    let getTime = b.diff(a, 'seconds');
    let milliseconds = (getTime+60) * 1000;
    console.log(milliseconds)
    if (Number.isNaN(milliseconds)) {
      setResetTime(10000)
      setChangeCountDown(false)
    }
    else {
      setChangeCountDown(true)
      setResetTime(milliseconds)
    }
  }

  function goBack() {
    let steps = formsteps - 1;
    setFormSteps(steps);
    setCounter(0)
    // if (changeCountDown === true) {
    //   getCountDownTime()
    // }
    setChangeCountDown(false)
  }

  useEffect(() => {
    if (formsteps > 4) {
      setFormSteps(1);
    }
    if (formsteps < 1) {
      setFormSteps(1);
    }
  }, [formsteps]);

  const showPassword = () => {
    setTogglePass(!togglePassword);
  };

  const goBackDown = (num) => {
    let steps = formsteps - num;
    setFormSteps(steps);
  }


  return (
    <div className="auth login-wrapper signUp-wrapper">
      <div className="login-overlay">
        <img src={require('../../images/signup-bg.jpg')} alt="" />
      </div>
      <Link to="/signup" className="login-logo">
        <img src={require("../../images/logoProd.png")} alt="" />
      </Link>
      <div className="auth_left">
        {Number(formsteps) === 1 ?
          <div className="login-header">
            <h1>Sign Up</h1>
            <p> Already have account?
              <Link
                to="/login"
              >
                Sign In
              </Link></p>
          </div>
          :
          ""
        }
        <div className="stepper-wrapper">
          <ul className="stepper-list">
            <li className={Number(formsteps) >= 2 ? "active" : ""}> 1
              {Number(formsteps) === 1 ? <span>1</span> : ""}
            </li>
            <li className={Number(formsteps) >= 3 ? "active" : ""}> 2
              {Number(formsteps) === 2 ? <span>2</span> : ""}
            </li>
            <li className={Number(formsteps) >= 4 ? "active" : ""}> 3
              {Number(formsteps) === 3 ? <span>3</span> : ""}
            </li>
            <li className={Number(formsteps) === 4 ? "active" : ""}> 4
              {Number(formsteps) === 4 ? <span>4</span> : ""}
            </li>
          </ul>
        </div>
        {changeCountDown === false ? "" :
          <span className="text-red" style={{ fontSize: "12px" }}>
            This Email Id Is blocked Please Try Again after : {" "}
            <Countdown
              date={Date.now() + Number(resetTime)}
              controlled={false}
              renderer={renderer}
              autoStart={true}
            />
          </span>
        }
        <div
          className="login-from-wrapper"
          style={{
            display: Number(formsteps) === 1 ? "block" : "none",
          }}
          id="firstStep"
        >
          <Formik
            enableReinitialize={true}
            validateOnMount={true}
            validateOnChange={true}
            validateOnBlur={true}
            validationSchema={registrationValidationSchema}
            initialValues={{
              email: "",
            }}
            onSubmit={(values, { resetForm }) => { }}
            render={({
              values,
              touched,
              errors,
              isValid,
              dirty,
              isValidating }) => (
              <Form>
                <div className="login-body">
                  <div className="form-group">
                    <label className="form-label">
                      Work Email <sup className="required"><i className="fa-solid fa-star-of-life"></i></sup>
                    </label>
                    <Field
                      type="text"
                      className={
                        "form-control" +
                        (errors.email && touched.email
                          ? " is-invalid"
                          : "")
                      }
                      placeholder="Organization Email"
                      name="email"
                    />
                    <ValidationMessage name="email" />
                  </div>
                </div>
                <div className="login-footer">
                  <button
                    disabled={!!errors.email}
                    onClick={() => {
                      formStep(
                        {
                          email: values.email,
                        },
                        "request-otp",
                        2
                      );
                      setRequestedEmail(values.email)
                    }
                    }
                    className="btn btn-primary btn-block"
                    type="button"
                  >
                    Next
                  </button>
                  <p>By clicking the button above you agree to the<a target="_blank" href="https://prodchimp.com/terms/">Terms of Use</a> </p>
                </div>
              </Form>
            )}
          />
        </div>

        <div
          className="login-from-wrapper"
          style={{
            display: Number(formsteps) === 2 ? "block" : "none",
          }}
        >
          <Formik
            enableReinitialize={true}
            validateOnMount={true}
            validateOnChange={true}
            validateOnBlur={true}
            validationSchema={registrationValidationSchema}
            initialValues={{
              email: "",
              email_otp: "",
            }}
            onSubmit={(values, { resetForm }) => {
              resetForm()
            }}
            render={({
              values,
              touched,
              errors,
              isValid,
              dirty,
              isValidating }) => (
              <Form>
                <div className="login-body">
                  <p>Please check your inbox, we have sent you an One Time Password for email verification.</p>
                  <div className="go-back-button">
                    <button  type="reset" className="btn btn-link" onClick={goBack}>
                      <i className="fa fa-long-arrow-left mr-2" />Back
                    </button>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Verify OTP <sup className="required"><i className="fa-solid fa-star-of-life"></i></sup></label>
                    <Field
                      type="text"
                      className="form-control"
                      placeholder="Enter OTP"
                      name="email_otp"
                    />
                    <ValidationMessage name="email_otp" />
                    {
                      counter > 0 && <label className="form-label">Resend OTP after {counter} s</label>
                    }
                  </div>
                </div>
                <div className="login-footer">
                  <button
                    className="btn btn-link"
                    onClick={() => {
                      resendOTP({
                        email: requestedEmail,
                      })
                      setCounter(60);
                    }}
                    disabled={counter > 0 || resetButton}
                  >
                    Resend OTP
                  </button>
                  <button
                    onClick={() => {
                      formStep(
                        {
                          email: requestedEmail,
                          otp: values.email_otp,
                        },
                        "submit-otp",
                        3
                      )
                      // values.email_otp = "";
                    }}
                    className="btn btn-primary btn-block"
                    type="reset"
                    disabled={!!errors.email_otp}
                  >
                    Verify & Continue
                  </button>
                  <p>By clicking the button above you agree to the<a target="_blank" href="https://prodchimp.com/terms/">Terms of Use</a> </p>
                </div>
              </Form>
            )}
          />
        </div>

        <div
          className="login-from-wrapper"
          style={{
            display: Number(formsteps) === 3 ? "block" : "none",
          }}
          id="thirdStep"
        >
          <Formik
            enableReinitialize={true}
            validateOnMount={true}
            validateOnChange={true}
            validateOnBlur={true}
            validationSchema={registrationValidationSchema}
            initialValues={{
              email: requestedEmail ? requestedEmail : "",
              name: "",
              countryCode: "",
              phone: "",
              address: "",
              email_otp: "",
              password: "",
              confirmPassword: "",
            }}
            onSubmit={(values, { resetForm }) => { }}
            render={({
              values,
              touched,
              errors,
              isValid,
              dirty,
              isValidating }) => (
              <Form>
                <div className="login-body">
                  <div className="go-back-button go-button">
                    <button type="reset" className="btn btn-link" onClick={() => goBackDown(1)}>
                      <i className="fa fa-long-arrow-left mr-2" />Back
                    </button>
                  </div>
                  <h1>Create your organization</h1>
                  <div className="form-group">
                    <label className="form-label">
                      Organization Name<sup className="required"><i className="fa-solid fa-star-of-life"></i></sup>
                    </label>
                    <Field
                      type="text"
                      className="form-control"
                      placeholder="Organization Name"
                      name="name"
                    />

                    <ValidationMessage name="name" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">
                      Organization Email address
                    </label>
                    <Field
                      disabled={true}
                      type="email"
                      className="form-control"
                      placeholder="Organization Email"
                      value={requestedEmail}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      Country Code & Phone Number <sup className="required"><i className="fa-solid fa-star-of-life"></i></sup>
                    </label>
                    <div style={{ display: "flex", gap: " 10px" }}>
                      <ReactFlagsSelect
                        selected={selected}
                        onSelect={(code) => getCountryCode(code)}
                        searchable={true}
                        showSecondaryOptionLabel={true}
                        selectedSize={13}
                        optionsSize={10}
                        fullWidth={false}
                        placeholder="#"
                        customLabels={newLabels}
                      />

                      <div className="input-icon">
                        <span
                          style={{
                            fontSize: "14px",
                            top: "44%",
                            transform: "translateY(-50%)",
                          }}
                          className="input-icon-addon"
                        >
                          {selectedCountry?.code}
                        </span>
                        <Field
                          type="text"
                          className="form-control"
                          placeholder="Phone Number"
                          name="phone"
                        />
                      </div>
                    </div>
                    <ValidationMessage name="phone" />
                    {!selectedCountry?.code ? (
                      <div
                        style={{
                          color: "rgb(220, 53, 69)",
                          fontSize: "12px",
                        }}
                      >
                        Select Country Code.
                      </div>
                    ) : (
                      ""
                    )}
                  </div>
                  <div className="form-group">
                    <label className="form-label">Address<sup className="required"><i className="fa-solid fa-star-of-life"></i></sup>
                    </label>
                    <Field
                      style={{
                        maxHeight: "100px",
                        minHeight: "100px",
                        resize: "none",
                        padding: "9px",
                        boxSizing: "border-box",
                        fontSize: "15px",
                      }}
                      className="form-control"
                      placeholder="Address of organization"
                      component="textarea"
                      name="address"
                      rows={1}
                    />
                    <ValidationMessage name="address" />
                  </div>
                </div>
                <div className="login-footer">
                  <button
                    disabled={
                      !!errors.name ||
                      !!errors.phone ||
                      !!errors.phone ||
                      !selectedCountry?.code
                    }
                    onClick={() => {
                      formStep(
                        {
                          email: requestedEmail,
                          orgName: values.name,
                          countrycode: selectedCountry.code,
                          phone: values.phone,
                          address: values.address,
                        },
                        "submit-details",
                        4
                      );
                    }}
                    className="btn btn-primary btn-block"
                    type="submit"
                  >
                    Continue
                  </button>
                  <p>By clicking the button above you agree to the<a target="_blank" href="https://prodchimp.com/terms/">Terms of Use</a> </p>
                </div>
                <FormObserver />
              </Form>
            )}
          />
        </div>

        <div
          className="login-from-wrapper"
          style={{
            display: Number(formsteps) === 4 ? "block" : "none",
          }}
          id="forthStep"
        >
          <Formik
            enableReinitialize={true}
            validateOnMount={true}
            validateOnChange={true}
            validateOnBlur={true}
            validationSchema={registrationValidationSchema}
            initialValues={{
              email: "",
              name: "",
              countryCode: "",
              phone: "",
              address: "",
              email_otp: "",
              password: "",
              confirmPassword: "",
            }}
            onSubmit={(values, { resetForm }) => { }}
            render={({
              values,
              touched,
              errors,
              isValid,
              dirty,
              isValidating }) => (
              <Form>
                <div className="login-body">
                  <div className="go-back-button go-button">
                    <button className="btn btn-link" onClick={() => goBackDown(1)}>
                      <i className="fa fa-long-arrow-left mr-2" />Back
                    </button>
                  </div>
                  <h1>Create your password</h1>
                  <div className="form-group passwordIns">
                    <label className="form-label">Password <sup className="required"><i className="fa-solid fa-star-of-life"></i></sup></label>
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
                    <label className="form-label">Confirm Password <sup className="required"><i className="fa-solid fa-star-of-life"></i></sup></label>
                    <Field
                      type="password"
                      className="form-control"
                      placeholder="Password"
                      name="confirmPassword"
                    />
                    <ValidationMessage name="confirmPassword" />
                  </div>
                  <div className="form-group">
                    <ReCAPTCHA
                      className="captcha-wrapper"
                      sitekey= {process.env.REACT_APP_RECAPTCHA_SITE_KEY}
                      onChange={handleOnchange}
                    />
                  </div>
                </div>
                <div className="login-footer">
                  <button
                    hidden={false}
                    disabled={
                      !isVerified ||
                      !!errors.password ||
                      !!errors.confirmPassword
                    }
                    className="btn btn-primary btn-block"
                    type="button"
                    onClick={() => {
                      formStep(
                        {
                          email: requestedEmail,
                          password: values.password,
                        },
                        "final-submit",
                        1
                      );
                    }}
                  >
                    Register Organization
                  </button>
                  <p>By clicking the button above you agree to the<a target="_blank" href="https://prodchimp.com/terms/">Terms of Use</a> </p>
                </div>
                <FormObserver />
              </Form>
            )}
          />
        </div>
      </div>
      <div className="auth_right">
        <div className="login-text-right">
          <h5>Welcome to ProdChimp</h5>
          <p>Start tracking hours<br />
            in minutes</p>
        </div>
      </div>
    </div>
  );
}

const style = {
  editMail: {
    fontSize: "14px",
    fontWeight: "400",
    cursor: "pointer",
  },
};
