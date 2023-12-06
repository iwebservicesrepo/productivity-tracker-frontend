import { Field, Form, Formik } from "formik";
import React, { Component, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { Link } from "react-router-dom";
import ValidationMessage from "../common/ValidationMessage";
import { forgetPaaswordEmail } from "./model/ValidationSchema";
import { forgetPasswordLink } from "./service/auth.service";
export default function ForgotPassword() {
  let [errMsg, setErrMsg] = useState("")
  // validate email
  // send forgetpassword link to mail alog with token
  // create new pasword and redirect to login page.
  const submitForm = async (email) => {
    let data = {
      email: email,
    };
    try {
      let { status } = await forgetPasswordLink(data);
      if (status == 200) {
        toast.success("Link has been sent. Please check your email.", {
          id: "link sent",
          duration: 9000,
        });
      }
    } catch (error) {
      if (error.status == 500) {
        setErrMsg(error.data.message);
        toast.error(error.data.message, { duration: 5000 });
      }
    }
  };
  return (
    <div className="auth login-wrapper">
      <div className="login-overlay">
        <img src={require('../../images/forgot-password-bg.jpg')} alt="" />
      </div>
      <Link to="/forgotpassword" className="login-logo">
        <img src={require("../../images/logoProd.png")} alt="" />
      </Link>
      <div className="auth_left">
        <Formik
          enableReinitialize={true}
          validateOnMount={true}
          validateOnChange={true}
          validateOnBlur={true}
          validationSchema={forgetPaaswordEmail}
          initialValues={{
            email: "",
          }}
          onSubmit={(values) => { }}
        >
          {({ values, errors }) => (
            <Form className="login-from-wrapper">
              <div className="login-body">
                <h1>Recover your password</h1>
                <p style={{ marginBottom: "50px" }}>If you have forgotten your password, simply enter your email address and we will send you a link to recover your password</p>
                <div className="go-back-button">
                  <Link className="btn btn-link" to="/">
                    <i className="fa fa-long-arrow-left mr-2" />Back
                  </Link>
                </div>
                <div className="form-group">
                  <label className="form-label">Work Email <sup className="required"><i className="fa-solid fa-star-of-life"></i></sup></label>
                  <Field
                    type="text"
                    className="form-control"
                    placeholder="Enter Email"
                    name="email"
                  />
                  <ValidationMessage name="email" />
                </div>
              </div>
              <div className="login-footer">
                <button
                  disabled={!!errors.email}
                  className="btn btn-primary btn-block"
                  type="button"
                  onClick={() => submitForm(values.email)}
                >
                  Continue
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
      <div className="auth_right">

      </div>
    </div>
  );
}