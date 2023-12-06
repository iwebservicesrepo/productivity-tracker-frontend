import { Field, Form, Formik, ErrorMessage, useFormikContext } from "formik";
import React, { useEffect, useState } from "react";
//import {Link } from "react-router-dom";
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
import moment from "moment";

const history = createBrowserHistory();

export default function Settings({ fixNavbar }) {
  let { type } = getAuthUser()?.subscriptionDetails;

  const [spclCharCheck, setSpclCharCheck] = useState(false);
  const [lowerCaseCheck, setlowerCaseCheck] = useState(false);
  const [checkNumber, setCheckNumber] = useState(false);
  const [checkUpperCase, setcheckUpperCase] = useState(false);
  const [checkLength, setcheckLength] = useState(false);
  const [togglePassword, setTogglePass] = useState(true);
  const [isModal, setIsModal] = useState(false);
  const [finalPayload, setFinalPayload] = useState({});
  const [reset, setReset] = useState(false);
  const [isFormModal, setFormModal] = useState(false);
  const [requestData, setRequestData]: any = useState({});
  const [defaultSsValue, setDefaultSsValue]: any = useState("");

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

  function millisToMinutes(millis) {
    var minutes = Math.floor(millis / 60000);
    return minutes;
  }

  useEffect(() => {
    deleteRequest();
  }, []);

  useEffect(() => {
    axios
      .get(mainServerAppUrl + "/organization/default-settings")
      .then(async (res) => {
        let value = millisToMinutes(
          res.data.org.defaultSettings.screenshotFrequency
        );
        let minutesString = value.toString();
        setDefaultSsValue(minutesString);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  const showPassword = () => {
    setTogglePass(!togglePassword);
  };

  const submitForm = async (formData) => {
    try {
      let { data } = await axios.post(
        mainServerAppUrl + "/change-password",
        formData
      );

      let cookie = {
        name: "_token",
        value: data.userDetails.token,
        days: 30,
      };
      console.log(cookie);
      setCookie(cookie);

      const token = getCookie("_token");
      const payload = getPayload(token);

      // if (payload.iss === iss.changePassword) {
        // here i need to change auth status to true.
        window.location.reload();
      // }
      toast.success("Password Changed Successfully", { duration: 5000 });
    } catch (error) {
      toast.error("Please Enter the Correct Old Password.", { duration: 5000 });
    }
  };

  const deleteRequest = () => {
    let deleteRequestData = axios
      .get(mainServerAppUrl + "/delete-request-data")
      .then((response) => {
        let delData = response.data.organizations.find(
          (el) => el._id === getAuthUser()?.organization
        );
        setRequestData(delData);
      })
      .catch((err) => console.log(err));
  };

  const frequencyList = type === "free" ? [10, 15] : [5, 10, 15];

  return (
    <>
      <div
        className={`section-body setting-page ${
          fixNavbar ? "marginTop" : ""
        } mt-3`}
      >
        <div className="container-fluid">
          <div
            className="nav flex-column nav-pills"
            id="v-pills-tab"
            role="tablist"
            aria-orientation="vertical"
          >
            <a
              className="nav-link active"
              id="v-pills-home-tab"
              data-toggle="pill"
              href="#v-pills-home"
              role="tab"
              aria-controls="v-pills-home"
              aria-selected="true"
            >
              <i className="fa-solid fa-lock mr-3"></i>Change Password
            </a>
            <a
              className="nav-link"
              id="v-pills-profile-tab"
              data-toggle="pill"
              href="#v-pills-profile"
              role="tab"
              aria-controls="v-pills-profile"
              aria-selected="false"
            >
              <i className="fa-solid fa-user mr-3"></i>Delete Account
            </a>
            <a
              className="nav-link"
              id="v-pills-interval-tab"
              data-toggle="pill"
              href="#v-pills-interval"
              role="tab"
              aria-controls="v-pills-interval"
              aria-selected="false"
            >
              <i className="fa-solid fa-image mr-3"></i>Default Screenshot
              Interval
            </a>
            <a
              className="nav-link"
              id="v-pills-digest-tab"
              data-toggle="pill"
              href="#v-pills-digest"
              role="tab"
              aria-controls="v-pills-digest"
              aria-selected="false"
            >
              <i className="fa-solid fa-envelope mr-3"></i>Email Digest
            </a>
          </div>
          <div className="tab-content" id="v-pills-tabContent">
            <div
              className="tab-pane fade show active"
              id="v-pills-home"
              role="tabpanel"
              aria-labelledby="v-pills-home-tab"
            >
              <div className="d-flex justify-content-center align-items-center">
                <div className="card" style={{ width: "500px" }}>
                  <Formik
                    initialValues={{
                      oldPassword: "",
                      password: "",
                      confirmPassword: "",
                    }}
                    validationSchema={Yup.object().shape({
                      oldPassword: Yup.string().required(
                        "Old Password is Required"
                      ),
                      password: Yup.string()
                        .required("New Password is required")
                        .matches(
                          /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
                          "Password does not meet the requirement"
                        ),
                      confirmPassword: Yup.string()
                        .oneOf(
                          [Yup.ref("password"), null],
                          "Passwords must match"
                        )
                        .required("Confirm Password is required"),
                    })}
                    onSubmit={(fields, { resetForm }) => {
                      setFinalPayload(fields);
                      setIsModal(true);
                    }}
                    render={({ errors, status, touched }) => (
                      <Form>
                        <div className="card-header">
                          <h3 className="card-title">CHANGE PASSWORD</h3>
                        </div>
                        <div className="card-body">
                          <div className="form-group">
                            <label htmlFor="oldPassword">Old Password</label>
                            <Field
                              name="oldPassword"
                              type="password"
                              className={
                                "form-control" +
                                (errors.oldPassword && touched.oldPassword
                                  ? " is-invalid"
                                  : "")
                              }
                            />
                            <ErrorMessage
                              name="oldPassword"
                              component="div"
                              className="invalid-feedback"
                            />
                          </div>
                          <div className="form-group passwordIns">
                            <label htmlFor="password">New Password</label>
                            <div className="input-group">
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
                              <div className="card passwordPopover">
                                <ul>
                                  <li>
                                    <small
                                      className={`form-text   ${
                                        checkNumber
                                          ? "text-green"
                                          : "text-muted"
                                      }`}
                                    >
                                      At least 1 Digit
                                    </small>
                                  </li>
                                  <li>
                                    <small
                                      className={`form-text   ${
                                        lowerCaseCheck
                                          ? "text-green"
                                          : "text-muted"
                                      }`}
                                    >
                                      At least 1 Lower Case
                                    </small>
                                  </li>
                                  <li>
                                    <small
                                      className={`form-text   ${
                                        checkUpperCase
                                          ? "text-green"
                                          : "text-muted"
                                      }`}
                                    >
                                      At least 1 Upper Case
                                    </small>
                                  </li>
                                  <li>
                                    <small
                                      className={`form-text   ${
                                        spclCharCheck
                                          ? "text-green"
                                          : "text-muted"
                                      }`}
                                    >
                                      At least 1 Special Character
                                    </small>
                                  </li>
                                  <li>
                                    <small
                                      className={`form-text   ${
                                        checkLength
                                          ? "text-green"
                                          : "text-muted"
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
                                    position: "relative",
                                  }}
                                  className="input-group-text"
                                >
                                  <i
                                    style={{
                                      cursor: "pointer",
                                    }}
                                    className="fa fa-eye"
                                  ></i>
                                  {togglePassword ? (
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
                            <label htmlFor="confirmPassword">
                              Confirm Password
                            </label>
                            <Field
                              name="confirmPassword"
                              type="password"
                              className={
                                "form-control" +
                                (errors.confirmPassword &&
                                touched.confirmPassword
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
                        <div className="card-footer text-right">
                          <button
                            className="btn btn-primary btn-block"
                            type="submit"
                          >
                            Change Password
                          </button>
                        </div>
                        <FormObserver />
                      </Form>
                    )}
                  />
                </div>
              </div>
            </div>
            <div
              className="tab-pane fade"
              id="v-pills-profile"
              role="tabpanel"
              aria-labelledby="v-pills-profile-tab"
            >
              <div className="d-flex justify-content-center align-items-center">
                <div className="card" style={{ width: "500px" }}>
                  <Formik
                    initialValues={{
                      reason: "",
                    }}
                    validationSchema={Yup.object().shape({
                      reason: Yup.string()
                        .required("Reason is required")
                        .matches(
                          /^(?!\s+$)/,
                          "Please Enter the Reason In words"
                        ),
                    })}
                    onSubmit={async (fields, { resetForm }) => {
                      let finalValues = {
                        ...fields,
                        username: getAuthUser()?.name,
                        email: getAuthUser()?.emailId,
                        organizationName: requestData?.name,
                        contact: requestData?.phone,
                      };
                      await axios
                        .post(mainServerAppUrl + "/delete-request", finalValues)
                        .then((response) => {
                          console.log(response);
                          toast.success(
                            "Request Sent Successfully, our Team will get in touch with you shortly",
                            { duration: 5000 }
                          );
                          setFormModal(false);
                        })
                        .catch((err) => {
                          console.log(err);
                          toast.error("Some error occurred", {
                            duration: 5000,
                          });
                        });
                    }}
                    render={({ errors, status, touched }) => (
                      <Form>
                        <div className="card-header">
                          <h3 className="card-title">Delete Your Account</h3>
                        </div>
                        <div className="card-body">
                          <div className="form-group">
                            <label htmlFor="reason">Reason</label>
                            <Field
                              component="textarea"
                              name="reason"
                              type="text"
                              rows="10"
                              className={
                                "form-control" +
                                (errors.reason && touched.reason
                                  ? " is-invalid"
                                  : "")
                              }
                            />
                            <ErrorMessage
                              name="reason"
                              component="div"
                              className="invalid-feedback"
                            />
                          </div>
                        </div>
                        <div className="card-footer d-flex justify-content-end">
                          <button
                            type="reset"
                            className="btn btn-secondary mr-2"
                          >
                            Reset
                          </button>
                          <button className="btn btn-primary" type="submit">
                            Send Deletion Request
                          </button>
                        </div>
                      </Form>
                    )}
                  />
                </div>
              </div>
            </div>
            <div
              className="tab-pane fade"
              id="v-pills-interval"
              role="tabpanel"
              aria-labelledby="v-pills-interval-tab"
            >
              <div className="d-flex justify-content-center align-items-center">
                <div className="card" style={{ width: "500px" }}>
                  <div className="card-header">
                    <h3 className="card-title">Default Screenshot Interval</h3>
                  </div>
                  <Formik
                    enableReinitialize={true}
                    validateOnMount={true}
                    validateOnChange={true}
                    validateOnBlur={true}
                    initialValues={{
                      screenshotFrequency: defaultSsValue,
                    }}
                    onSubmit={(fields, { resetForm }) => {
                      function MinutesToMilliseconds(time) {
                        return time * 60 * 1000;
                      }
                      let screenshotFrequency = MinutesToMilliseconds(
                        fields.screenshotFrequency
                      );
                      axios
                        .put(
                          mainServerAppUrl +
                            "/organization/update-default-settings",
                          { screenshotFrequency }
                        )
                        .then(async (res) => {
                          if (res.status === 200) {
                            toast.success(
                              "Successfully set the Default Setting interval",
                              { duration: 5000 }
                            );
                          }
                        })
                        .catch((err) => {
                          toast.error(err, { duration: 5000 });
                        });
                    }}
                    render={({ errors, status, touched }) => (
                      <Form>
                        <div className="modal-body">
                          <div className="row">
                            <div className="col-md-12 col-sm-6">
                              <div className="form-group">
                                <label className="form-label">
                                  Screenshot Frequency
                                </label>
                                <div className="input-group">
                                  <Field
                                    className="form-control"
                                    component="select"
                                    name="screenshotFrequency"
                                  >
                                    <option>Select</option>
                                    {frequencyList?.map((data, index) => (
                                      <option key={index}>{data}</option>
                                    ))}
                                  </Field>
                                  <div className="input-group-append">
                                    <span
                                      style={{
                                        fontSize: "13px",
                                        display: "block",
                                      }}
                                      className="input-group-text"
                                    >
                                      MINS
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="modal-footer">
                          <button type="submit" className="btn btn-primary">
                            Save
                          </button>
                        </div>
                      </Form>
                    )}
                  />
                </div>
              </div>
            </div>
            <div
              className="tab-pane fade"
              id="v-pills-digest"
              role="tabpanel"
              aria-labelledby="v-pills-digest-tab"
            >
              <div className="d-flex justify-content-center align-items-center">
                <div className="card" style={{ width: "500px" }}>
                  <Formik
                    initialValues={{
                      emailDigest: "false",
                    }}
                    validationSchema={Yup.object().shape({
                      reason: Yup.string().required("Reason is required"),
                    })}
                    onSubmit={(fields, { resetForm }) => {}}
                    render={({ errors, status, touched }) => (
                      <Form>
                        <div className="card-header">
                          <h3 className="card-title">Email Digest Setting</h3>
                        </div>
                        <div className="card-body">
                          <div className="form-group">
                            <label htmlFor="reason">Email Digest</label>
                            <div
                              className="form-group"
                              role="group"
                              aria-labelledby="my-radio-group"
                            >
                              <label className="custom-control custom-radio custom-control-inline">
                                <Field
                                  type="radio"
                                  name="emailDigest"
                                  value="true"
                                  className="custom-control-input"
                                />
                                <span className="custom-control-label">
                                  Enabled
                                </span>
                              </label>
                              <label className="custom-control custom-radio custom-control-inline">
                                <Field
                                  type="radio"
                                  name="emailDigest"
                                  value="false"
                                  className="custom-control-input"
                                />
                                <span className="custom-control-label">
                                  Disabled
                                </span>
                              </label>
                            </div>
                            <ErrorMessage
                              name="reason"
                              component="div"
                              className="invalid-feedback"
                            />
                          </div>
                        </div>
                        <div className="card-footer d-flex justify-content-end">
                          <button className="btn btn-primary" type="submit">
                            Save
                          </button>
                        </div>
                      </Form>
                    )}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isModal && (
        <div
          className="modal d-block"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div
            className="modal-dialog modal-dialog-centered modal-md delete-modal"
            role="document"
          >
            <div className="modal-content">
              <div className="modal-body">
                <strong>
                  Confirmation
                  <span className="text-red"></span>
                </strong>
                <p
                  className="text-secondary"
                  style={{ fontSize: "14px", fontWeight: "600" }}
                >
                  Are you sure you want to <br />
                  change your password?
                </p>
              </div>
              <div className="modal-footer">
                <button
                  type="submit"
                  className="btn btn-secondary"
                  onClick={() => {
                    submitForm(finalPayload);
                    //setReset(true)
                    setIsModal(false);
                  }}
                >
                  Confirm
                </button>
                <button
                  type="reset"
                  className="btn btn-primary mr-2"
                  data-dismiss="modal"
                  onClick={() => {
                    setIsModal(false);
                    //setReset(false)
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
