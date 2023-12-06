import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getDepartmentList } from "./../../ReduxStore/actions/galleryAction";
import { getAuthUser } from "../Authentication/authHelpers";
import {
  deleteDepartmentList,
  getUser,
} from "./../../ReduxStore/actions/userAction";
import { mainServerAppUrl } from "./../../apis/mainapi";
import _ from "underscore";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
// import { basicFormValidation } from "../Authentication/model/ValidationSchema";
// import ValidationMessage from './../common/ValidationMessage';
import Select from "react-select";
import ReactTooltip from "react-tooltip";

export default function Department({ fixNavbar }) {
  const permissions = useSelector((state: any) => state.loginReducers?.allData);
  const { plan_type } = useSelector((state: any) => state.loginReducers?.subscriptionplans);
  let department = permissions?.role?.permissions?.access?.department;

  // console.log(permissions.subscriptionStatus);

  const dispatch: any = useDispatch();

  const { loader, departmentList } = useSelector(
    (state: any) => state.galleryReducers
  );
  const { userList } = useSelector((state: any) => state.userReducer);

  const managerList = userList?.filter((data) => data?.role?.role === "manager");
  var option = managerList?.map((data) => ({
    value: data?._id,
    label: data?.firstName + " " + data?.lastName,
  }));


  const [isModal, setIsModal] = useState(false);
  const [editDepartmentDetail, setEditDepartmentDetail] = useState("");
  const [ssfrq, setSsfrq]: any = useState("");
  const [apptrack, setAppTrack] = useState(true);
  const [screenTrack, setScreenTrack] = useState(true);
  const [departmentId, setDepartmentId] = useState("");
  const [deleteUser, setDeleteUser] = useState({
    name: "",
    id: "",
    userCount: "",
  });
  const [isDeleteModal, setDeleteModal] = useState(false);
  const [isAdd, setIsAdd] = useState(false);
  const frequencyList = plan_type === "free-forever" ? [10, 15] : [5, 10, 15];
  const [managedBy, setmanagedBy]: any = useState([{ user: "" }]);
  const [defaultValue, setDefaultValue] = useState([]);
  const [removedBy, setRemovedBy]: any = useState([]);
  const [defaultSsValue, setDefaultSsValue]: any = useState(plan_type === "free-forever" ? 10 : 5);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(4);
  const [totalPage, setTotalPage] = useState(1);
  var destArray = _.uniq(removedBy, (x) => x?.user);

  function millisToMinutes(millis) {
    var minutes = Math.floor(millis / 60000);
    return minutes;
  }

  useEffect(() => {
    dispatch(getDepartmentList(page, pageSize));
    dispatch(getUser());
    total()
  }, [dispatch, page]);

  useEffect(() => {
    axios
      .get(mainServerAppUrl + "/organization/default-settings")
      .then(async (res) => {
        if (res?.data?.org?.defaultSettings?.screenshotFrequency === null) {
          setDefaultSsValue(defaultSsValue)
        }
        else {
          // let value = millisToMinutes(
          //   res?.data?.org?.defaultSettings?.screenshotFrequency
          // );
          // let minutesString = value.toString();
          setDefaultSsValue(millisToMinutes(res?.data?.org?.defaultSettings?.screenshotFrequency));
        }
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  const editDepartment = (data) => {
    setIsModal(true);
    setEditDepartmentDetail(data?.dname);
    let milisec = millisToMinutes(data?.ss_frequency);
    setSsfrq(milisec);
    setAppTrack(data?.app_tracking);
    setScreenTrack(data?.screen_tracking);
    setDepartmentId(data?._id);
    let multiValue = data?.managedBy?.map((item) => ({
      value: item?._id,
      label: item?.firstName + " " + item?.lastName,
    }));
    const finalValue = data?.managedBy?.map((ites) => ({ user: ites?._id }));
    setmanagedBy([...finalValue]);
    setDefaultValue([...multiValue]);
    setIsAdd(true);
  };

  const multiSelectDepartment = (selectedOption, actionMeta) => {
    if (actionMeta.action === "remove-value") {
      let obj = { user: actionMeta.removedValue.value };
      setRemovedBy((oldArray) => [...oldArray, obj]);
    }
    if (isAdd === true) {
      const finalValue = selectedOption?.map((data) => ({
        user: data?.value,
      }));
      setmanagedBy([...finalValue]);
      setDefaultValue([...selectedOption]);
    } else {
      const finalValue = { user: selectedOption?.value };
      setmanagedBy([finalValue]);
      setDefaultValue([selectedOption]);
    }
  };

  const submitFrom = (formData) => {
    if (isAdd === false) {
      let item = { ...formData };
      axios
        .post(mainServerAppUrl + "/department/crate-department", item)
        .then(async (res) => {
          if (res.status === 200) {
            if (res.data.message == 'Department added') {
              dispatch(getDepartmentList(page, pageSize));
              setIsAdd(false);
              setIsModal(false);
              total()
              toast.success("Department Added successfully", { duration: 2000 });
              console.log(res)
            }
            if (res.data.success == false) {
              toast.error(res.data.message, { duration: 2000 });
            }
          } else {
            toast.error("Please Filled the inputs Properly", {
              duration: 2000,
            });
          }
        })
        .catch((err) => {
          toast.error("Please Filled the inputs Properly", { duration: 2000 });
        });
    } else {
      let item = { ...formData, id: departmentId, removedUser: destArray };
      axios
        .post(mainServerAppUrl + "/department/edit-department", item)
        .then(async (res) => {
          if (res.status === 200) {
            dispatch(getDepartmentList(page, pageSize));
            setIsAdd(false);
            total()
            setIsModal(false);
            toast.success("Department Updated successfully", {
              duration: 2000,
            });
          } else {
            toast.error("Please Filled the inputs Properly", {
              duration: 2000,
            });
          }
        })
        .catch((err) => {
          toast.error("Please Filled the inputs Properly", { duration: 2000 });
        });
    }
  };

  const total = async () => {
    const departmentList = await axios.get(mainServerAppUrl + "/department/get-department");
    const total = departmentList.data.data.length;
    setTotalPage(Math.ceil(total / pageSize));
  }


  return (
    <>
      <header className="page-header">
        <div className="flex-40">
          <h1>Department</h1>
        </div>
        <div className="flex-60">
          {department?.view === true ?
            <div className="d-flex justify-content-end align-items-center">
              {department?.modify === true ? (
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => {
                    setIsModal(true);
                    setIsAdd(false);
                  }}
                  disabled={permissions?.subscriptionStatus !== "active" && plan_type !== "free-forever"}
                >
                  <i className="fe fe-plus mr-2"></i>Add Department
                </button>
              ) : (
                " "
              )}
            </div>
            :
            ""
          }
        </div>
      </header>
      <div className={`section-body ${fixNavbar ? "marginTop" : ""}`}>
        {department?.view === true ? (
          loader ? (
            <div
              className="loader"
              style={{ height: "500px", width: "100%" }}
            />
          ) : (
            <>
              {departmentList?.length > 0 ? (
                <>
                  <div className="card-list-wrapper">
                    <ul className="card-type-list">
                      {departmentList?.map((data, index) => (
                        <li key={index}>
                          <div className="card">
                            <div className="card-body">
                              <div className="card-type-header">
                                <h1 className="text-capitalize">{data?.dname}</h1>
                                <p className="m-0"><span>By</span>  {data?.createdBy?.firstName
                                  ? data?.createdBy?.firstName
                                  : "-"}{" "}
                                  {data?.createdBy?.lastName}</p>
                                <p><span>on</span>{new Date(data?.createdAt).toLocaleDateString()} <small>{new Date(data?.createdAt).toLocaleTimeString()}</small></p>
                              </div>
                              <div className="card-type-counter">
                                <div className="card-type-icon">
                                  <img src={require('../../images/departmentUsers.png')} alt="" />
                                </div>
                                <strong>{data?.userCount}</strong>
                                <span>Total User</span>
                              </div>
                              <div className="card-type-tracking">
                                <h1>Tracking</h1>
                                <p>App  {data?.app_tracking === true ? (
                                  <strong className="text-green">On</strong>
                                ) : (
                                  <strong className="text-red">Off</strong>
                                )}</p>
                                <p>Screen {data?.screen_tracking === true ? (
                                  <strong className="text-green">On</strong>
                                ) : (
                                  <strong className="text-red">Off</strong>
                                )}</p>
                              </div>
                              <h3>SS Frequency <strong>{millisToMinutes(data?.ss_frequency) === 0 ? "-" : millisToMinutes(data?.ss_frequency) + " mins"} </strong></h3>
                              <div className="card-type-tracking badge-div">
                                <h1>Managed By</h1>

                                {data?.managedBy?.length > 0 ? data?.managedBy?.map((item, index) => (
                                  <span
                                    key={index}
                                    className="alert alert-primary"
                                  >
                                    {item?.firstName} {item?.lastName}
                                  </span>
                                ))
                                  :
                                  "-"
                                }
                              </div>
                            </div>
                            <div className="card-footer">
                              {department?.modify === true ? (
                                <>
                                  <button
                                    className="btn btn-warning"
                                    onClick={() => {
                                      editDepartment(data);
                                    }}
                                    disabled={permissions?.subscriptionStatus !== "active" && plan_type !== "free-forever"}
                                  >
                                    <span><i className="fa fa-pencil" /></span> Edit
                                  </button>

                                  <button
                                    className="btn btn-danger"
                                    onClick={() => {
                                      setDeleteUser({
                                        name: data?.dname,
                                        id: data?._id,
                                        userCount: data?.userCount,
                                      });
                                      setDeleteModal(true);
                                    }}
                                  >
                                    <span><i className="fa fa-trash-alt" /></span> Delete
                                  </button>
                                </>
                              ) : (
                                ""
                              )}
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                  {departmentList?.length > 0 && (
                    <div className="d-flex justify-content-center mt-2">
                      <nav aria-label="Page navigation example">
                        <ul className="pagination">
                          <li className="page-item">
                            <a
                              className="page-link"
                              onClick={() => {
                                setPage(page <= 0 ? 0 : page - 1);
                              }}
                              href="#"
                              aria-label="Previous"
                            >
                              <span aria-hidden="true">&laquo;</span>
                              <span className="sr-only">Previous</span>
                            </a>
                          </li>
                          <li className="page-item">
                            <a className="page-link" href="#">
                              {page + 1}/{totalPage}
                            </a>
                          </li>

                          <li className="page-item">
                            <a
                              className="page-link"
                              onClick={() => {
                                setPage(page == totalPage - 1 ? totalPage - 1 : page + 1);
                              }}
                              href="#"
                              aria-label="Next"
                            >
                              <span aria-hidden="true">&raquo;</span>
                              <span className="sr-only">Next</span>
                            </a>
                          </li>
                        </ul>
                      </nav>
                    </div>
                  )}
                </>
              ) : (
                <div className="no-data-found">
                  <div className="card">
                    <div className="card-body">
                      <div className="no-data-image">
                        <svg style={{ filter: "opacity(0.5)" }} width="101" height="101" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M10 25C12.2091 25 14 23.2091 14 21C14 18.7909 12.2091 17 10 17C7.79086 17 6 18.7909 6 21C6 23.2091 7.79086 25 10 25Z" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M4 28C4.6986 27.0685 5.60448 26.3125 6.6459 25.7918C7.68731 25.2711 8.83566 25 10 25C11.1643 25 12.3127 25.2711 13.3541 25.7918C14.3955 26.3125 15.3014 27.0685 16 28" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M10 12C12.2091 12 14 10.2091 14 8C14 5.79086 12.2091 4 10 4C7.79086 4 6 5.79086 6 8C6 10.2091 7.79086 12 10 12Z" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M4 15C4.6986 14.0685 5.60448 13.3125 6.6459 12.7918C7.68731 12.2711 8.83566 12 10 12C11.1643 12 12.3127 12.2711 13.3541 12.7918C14.3955 13.3125 15.3014 14.0685 16 15" stroke="black" stroke-width="2" strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M22 25C24.2091 25 26 23.2091 26 21C26 18.7909 24.2091 17 22 17C19.7909 17 18 18.7909 18 21C18 23.2091 19.7909 25 22 25Z" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M16 28C16.6986 27.0685 17.6045 26.3125 18.6459 25.7918C19.6873 25.2711 20.8357 25 22 25C23.1643 25 24.3127 25.2711 25.3541 25.7918C26.3955 26.3125 27.3014 27.0685 28 28" stroke="black" stroke-width="2" strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M22 12C24.2091 12 26 10.2091 26 8C26 5.79086 24.2091 4 22 4C19.7909 4 18 5.79086 18 8C18 10.2091 19.7909 12 22 12Z" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M16 15C16.6986 14.0685 17.6045 13.3125 18.6459 12.7918C19.6873 12.2711 20.8357 12 22 12C23.1643 12 24.3127 12.2711 25.3541 12.7918C26.3955 13.3125 27.3014 14.0685 28 15" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                      <p>
                        Looks like you do not have any Departments yet.<br />
                        Start by adding using the Add Department Button.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </>
          )
        ) : (
          <div className="no-data-found">
            <div className="card">
              <div className="card-body">
                <div className="no-data-image">
                  <svg style={{ filter: "opacity(0.5)" }} width="101" height="101" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10 25C12.2091 25 14 23.2091 14 21C14 18.7909 12.2091 17 10 17C7.79086 17 6 18.7909 6 21C6 23.2091 7.79086 25 10 25Z" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M4 28C4.6986 27.0685 5.60448 26.3125 6.6459 25.7918C7.68731 25.2711 8.83566 25 10 25C11.1643 25 12.3127 25.2711 13.3541 25.7918C14.3955 26.3125 15.3014 27.0685 16 28" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M10 12C12.2091 12 14 10.2091 14 8C14 5.79086 12.2091 4 10 4C7.79086 4 6 5.79086 6 8C6 10.2091 7.79086 12 10 12Z" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M4 15C4.6986 14.0685 5.60448 13.3125 6.6459 12.7918C7.68731 12.2711 8.83566 12 10 12C11.1643 12 12.3127 12.2711 13.3541 12.7918C14.3955 13.3125 15.3014 14.0685 16 15" stroke="black" stroke-width="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M22 25C24.2091 25 26 23.2091 26 21C26 18.7909 24.2091 17 22 17C19.7909 17 18 18.7909 18 21C18 23.2091 19.7909 25 22 25Z" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M16 28C16.6986 27.0685 17.6045 26.3125 18.6459 25.7918C19.6873 25.2711 20.8357 25 22 25C23.1643 25 24.3127 25.2711 25.3541 25.7918C26.3955 26.3125 27.3014 27.0685 28 28" stroke="black" stroke-width="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M22 12C24.2091 12 26 10.2091 26 8C26 5.79086 24.2091 4 22 4C19.7909 4 18 5.79086 18 8C18 10.2091 19.7909 12 22 12Z" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M16 15C16.6986 14.0685 17.6045 13.3125 18.6459 12.7918C19.6873 12.2711 20.8357 12 22 12C23.1643 12 24.3127 12.2711 25.3541 12.7918C26.3955 13.3125 27.3014 14.0685 28 15" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <p>Not able to view the department</p>
              </div>
            </div>
          </div>
        )}
        {isModal && (
          <div
            className="modal d-block"
            aria-labelledby="exampleModalLabel"
            aria-hidden="true"
          >
            <div
              className="modal-dialog modal-dialog-centered modal-lg"
              role="document"
            >
              <div className="modal-content">
                <div className="modal-header position-relative">
                  <h5 className="modal-title" id="exampleModalLabel">
                    {isAdd ? "Edit Department" : "Add Department"}
                  </h5>
                  <button
                    type="button"
                    className="close"
                    data-dismiss="modal"
                    onClick={() => {
                      setIsModal(false);
                      setIsAdd(false);
                      setDefaultValue([]);
                    }}
                    aria-label="Close"
                  >
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <Formik
                  enableReinitialize={true}
                  validateOnMount={true}
                  validateOnChange={true}
                  validateOnBlur={true}
                  initialValues={{
                    dname: isAdd === true ? editDepartmentDetail : "",
                    ss_frequency: isAdd === true ? ssfrq === 0 ? defaultSsValue : ssfrq : defaultSsValue
                  }}
                  validationSchema={Yup.object().shape({
                    dname: Yup.string()
                      .required("Department Name is required")
                      .matches(/^(?!\s+$)/, "Please Enter the Department Name"),
                    ss_frequency: screenTrack ? Yup.string().required(
                      "Frequency is required"
                    ) : Yup.string().notRequired(),

                  })}
                  onSubmit={(fields, { resetForm }) => {
                    function MinutesToMilliseconds(time) {
                      return time * 60 * 1000;
                    }
                    let finalFeild = {
                      dname: fields.dname,
                      ss_frequency: screenTrack ? MinutesToMilliseconds(fields.ss_frequency) : 0,
                      managedBy,
                      app_tracking: apptrack,
                      screen_tracking: screenTrack,
                    };
                    submitFrom(finalFeild);
                    dispatch(getDepartmentList(page,pageSize));
                    total();
                  }}
                  render={({ errors, status, touched }) => (
                    <Form>
                      <div className="modal-body">
                        <div className="row">
                          <div className="col-md-6 col-sm-6">
                            <div className="form-group">
                              <label className="form-label">
                                Department Name
                                <sup className="required"> <i className="fa-solid fa-star-of-life"></i></sup>
                              </label>
                              <Field
                                name="dname"
                                type="text"
                                placeholder="Enter Department Name"
                                className={
                                  "form-control" +
                                  (errors.dname && touched.dname
                                    ? " is-invalid"
                                    : "")
                                }
                              />
                              <ErrorMessage
                                name="dname"
                                component="div"
                                className="invalid-feedback"
                              />
                            </div>
                          </div>
                          <div className="col-md-6 col-sm-6">
                            <div className="form-group">
                              <label className="form-label">Manager Name</label>
                              <Select
                                className="basic-multi-select"
                                classNamePrefix="select"
                                placeholder="Select Manager"
                                closeMenuOnSelect={true}
                                isMulti={isAdd === true ? true : false}
                                options={option}
                                name="managedBy"
                                inputId="managedBy"
                                onChange={multiSelectDepartment}
                                value={defaultValue}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="app-setting-wrapper w-100">
                          <label>Desktop App Setting</label>
                        </div>
                        <div className="row">
                          <div className="col-md-4 col-sm-6">
                            <div className="form-group">
                              <div className="form-label">Screenshot
                                <div className="tooltip-icon" data-tip
                                  data-for="screen_tracking">
                                  <img src={require('../../images/Question.png')} />
                                </div>
                              </div>
                              <label
                                className="custom-switch"

                              >
                                <input
                                  type="checkbox"
                                  name="screen_tracking"
                                  className="custom-switch-input"
                                  checked={screenTrack}
                                  onChange={(e) =>
                                    setScreenTrack(e.target.checked)
                                  }
                                />
                                <span className="custom-switch-indicator" />
                                <span className="custom-switch-description">
                                  {screenTrack
                                    ? "Switch to Disable"
                                    : "Switch to Enable"}
                                </span>
                              </label>
                              <ReactTooltip
                                effect="solid"
                                id="screen_tracking"
                                aria-haspopup="true"
                                role="screen_tracking"
                              >
                                You are going to{" "}
                                {screenTrack ? "Disable" : "Enable"} the
                                Screenshots Setting
                              </ReactTooltip>
                            </div>
                          </div>
                          <div className="col-md-4 col-sm-6">
                            <div
                              className="form-group"

                            >
                              <label className="form-label">
                                Screenshot Frequency  <div className="tooltip-icon" data-tip
                                  data-for="screenshot_Frequency">
                                  <img src={require('../../images/Question.png')} />
                                </div>
                              </label>
                              <div className="input-group">
                                <Field
                                  className={screenTrack ?
                                    "form-control" +
                                    (errors.ss_frequency && touched.ss_frequency
                                      ? " is-invalid"
                                      : "") : "form-control"
                                  }
                                  component="select"
                                  placeholder="Select"
                                  name="ss_frequency"
                                  disabled={!screenTrack}
                                >
                                  <option value=""
                                  disabled>Select</option>
                                  {
                                    frequencyList?.map((data, index) => (
                                      <option key={index}>{data}</option>
                                    ))
                                  }
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
                                {screenTrack ?
                                  <ErrorMessage
                                    name="ss_frequency"
                                    component="div"
                                    className="invalid-feedback"
                                  />
                                  : ""}
                                <ReactTooltip
                                  effect="solid"
                                  id="screenshot_Frequency"
                                  aria-haspopup="true"
                                  role="app_tracking"
                                >
                                  Set the Screenshot Frequency time so
                                  application can take the screenshot according
                                  to you selecting interval time
                                </ReactTooltip>
                              </div>
                            </div>
                          </div>
                          <div className="col-md-4 col-sm-6">
                            <div className="form-group">
                              <div className="form-label">App Usage
                                <div className="tooltip-icon" data-tip
                                  data-for="app_tracking">
                                  <img src={require('../../images/Question.png')} />
                                </div>
                              </div>
                              <label
                                className="custom-switch"
                              >
                                <input
                                  type="checkbox"
                                  name="app_tracking"
                                  className="custom-switch-input"
                                  checked={apptrack}
                                  onChange={(e) =>
                                    setAppTrack(e.target.checked)
                                  }
                                />
                                <span className="custom-switch-indicator" />
                                <span className="custom-switch-description">
                                  {apptrack
                                    ? "Switch to Disable"
                                    : "Switch to Enable"}
                                </span>
                              </label>
                              <ReactTooltip
                                effect="solid"
                                id="app_tracking"
                                aria-haspopup="true"
                                role="app_tracking"
                              >
                                You are going to{" "}
                                {apptrack ? "Disable" : "Enable"} the App
                                Tracking Setting
                              </ReactTooltip>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="modal-footer">
                        <button type="submit" className="btn btn-success">
                          Save
                        </button>
                        <button
                          type="reset"
                          className="btn btn-secondary mr-2"
                          data-dismiss="modal"
                          onClick={() => {
                            setIsModal(false);
                            setIsAdd(false);
                            total();
                            setDefaultValue([]);
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    </Form>
                  )}
                />
              </div>
            </div>
          </div>
        )}
        {isDeleteModal && (
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
                  <div className="delete-icon">
                    <img
                      src={require("../../images/monkey.png")}
                      alt="logoProd2.png"
                    />
                  </div>
                  <h1>Oh!</h1>
                  <strong>
                    You are about to delete this{" "}
                    <span className="text-red">{deleteUser?.name}</span>{" "}
                    Department
                  </strong>
                  <p
                    className="text-secondary"
                    style={{ fontSize: "14px", fontWeight: "600" }}
                  >
                    {Number(deleteUser?.userCount) > 0
                      ? "If you want to delete the department please assign the users to different Department Then you can delete the department"
                      : "This will delete your Department from Department list"}{" "}
                    <br />
                    {Number(deleteUser?.userCount) > 0 ? "" : " Are you sure "}
                  </p>
                  <div className="delete-footer">
                    <button
                      type="submit"
                      className="btn btn-primary"
                      onClick={() => {
                        dispatch(deleteDepartmentList(deleteUser?.id));
                        total()
                        setDeleteModal(false);
                      }}
                      disabled={Number(deleteUser?.userCount) > 0}
                    >
                      Confirm
                    </button>
                    <button
                      type="reset"
                      className="btn btn-secondary"
                      data-dismiss="modal"
                      onClick={() => setDeleteModal(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </div>

              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
