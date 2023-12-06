/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable no-lone-blocks */
import React, { useEffect, useState } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import { useDispatch, useSelector } from "react-redux";
import {
  getUser,
  submitUser,
  getAllUserCount,
  deleteAllAssociatedData,
} from "../../ReduxStore/actions/userAction";
import {
  getRole,
  updateUser,
  userDeleteHandler,
} from "./../../ReduxStore/actions/userAction";
import { getAuthUser } from "../Authentication/authHelpers";
import * as yup from "yup";
import { getDepartmentList } from "./../../ReduxStore/actions/galleryAction";
import Select from "react-select";
import ReactTooltip from "react-tooltip";
import _ from "underscore";
import MessageModal from "../MessageModal/MessageModal";
import axios from "axios";
import { mainServerAppUrl } from "../../apis/mainapi";
import { useHistory } from "react-router-dom";
import Loaders from "../Loaders/Loaders";
import * as Constant from "./../../ReduxStore/constant";

function User({ fixNavbar }) {
  const history = useHistory();
  const dispatch: any = useDispatch();
  const permissions = useSelector((state: any) => state.loginReducers?.allData);
  let users = permissions?.role?.permissions?.access?.users;
  const { plan_type } = useSelector(
    (state: any) => state.loginReducers?.subscriptionplans
  );
  const frequencyList = plan_type === "free-forever" ? [10, 15] : [5, 10, 15];

  const { roleList, userList, ifloader, allUserCount, success, notSuccess } = useSelector(
    (state: any) => state.userReducer
  );


  const totalUserCount = allUserCount?.length;
  const inActiveCount = allUserCount?.filter(
    (user) => user.status === "active"
  ).length;
  const activeCount = allUserCount?.filter(
    (user) => user.status !== "active"
  ).length;
  const { departmentList } = useSelector((state: any) => state.galleryReducers);
  var option = departmentList.map((data) => ({
    value: data?._id,
    label: data?.dname,
  }));
  const [isAdd, setIAdd] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [team, setTeam] = useState({ department: "", id: "" });
  const [userRole, setUserRole] = useState("");
  const [editId, setEditId] = useState("");
  const [isModal, setIsModal] = useState(false);
  const [isDeleteModal, setDeleteModal] = useState(false);
  const [isDetailModal, setDetailModal] = useState(false);
  const [deleteUser, setDeleteUser] = useState({ id: "", user: "" });
  const [singleUserDetails, setSingleUserDetails]: any = useState();
  const [apptrack, setAppTrack] = useState(true);
  const [screenTrack, setScreenTrack] = useState(true);
  const [fre, setFreq]: any = useState("");
  const [toggleManager, setToggleManager] = useState(false);
  const [selectDepartment, setSelectDepartment]: any = useState([
    { department: "" },
  ]);
  const [defaultValue, setDefaultValue] = useState([]);
  const [isDisable, setIsDisabled] = useState(true);
  const [removedBy, setRemovedBy]: any = useState([]);
  const [messageModal, setMessageModal] = useState(false);
  const [defaultSsValue, setDefaultSsValue]: any = useState(plan_type === "free-forever" ? 10 : 5);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalPage, setTotalPage] = useState(0);
  const [firstTimeModal, setFirstTimeModal] = useState(false);
  const [welcomeModal, setWelcomeModal] = useState(1);
  const [subDetails, setSubDetails]: any = useState([]);
  const [maxSeats, setMaxSeats] = useState({})
  const [maxSeatModal, setMaxSeatModal] = useState(false)
  const [isdeleteAllAssociated, setIsdeleteAllAssociated] = useState(false)
  const [hooaryModal, setHorrayModal] = useState(3)


  var destArray = _.uniq(removedBy, (x) => x.department);
  function millisToMinutes(millis) {
    var minutes = Math.floor(millis / 60000);
    return minutes;
  }


  useEffect(() => {
    // totalUserCount > 1 ? setWelcomeModal(false) : setWelcomeModal(true);
    setWelcomeModal(totalUserCount)
    setHorrayModal(totalUserCount)
  }, [totalUserCount]);

  useEffect(() => {
    async function getDetails(page) {
      const userSubscription = await axios.get(
        mainServerAppUrl + "/get-subscription"
      );
      const length = userSubscription.data.subscriptions.length;
      const maxSeatss = userSubscription?.data?.subscriptions[length - 1]?.quantity;
      setMaxSeats(maxSeatss)

      setSubDetails(userSubscription.data?.subscriptions[length - 1]);
    }
    getDetails(page);

    // get Details
  }, [page]);

  useEffect(() => {
    dispatch(getRole());
    dispatch(getUser(page, pageSize));
    dispatch(getAllUserCount());
    dispatch(getDepartmentList());
    total();
  }, [dispatch, page]);

  useEffect(() => {
    if (isAdd) {
      setSelectDepartment([{ department: team.id }]);
    } else {
      setSelectDepartment([{ department: "" }]);
    }
    localStorage.getItem("notShowAgain")
  }, [isAdd, team.id]);
  useEffect(() => {
    axios
      .get(mainServerAppUrl + "/organization/default-settings")
      .then(async (res) => {
        if (res?.data?.org?.defaultSettings?.screenshotFrequency === null) {
          setDefaultSsValue(defaultSsValue);
        } else {
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
  const editUser = (selectedUser) => {
    setIsModal(true);
    setIAdd(true);
    setFirstName(selectedUser?.firstName);
    setLastName(selectedUser?.lastName);
    setEmail(selectedUser?.email);
    setUserRole(selectedUser?.role._id);
    setEditId(selectedUser._id);
    setAppTrack(selectedUser?.appSettings?.app_tracking);
    setScreenTrack(selectedUser?.appSettings?.screen_tracking);
    setFreq(millisToMinutes(selectedUser?.appSettings?.ss_frequency));
    selectedUser.departments.map((data) =>
      setTeam({ department: data.department?.dname, id: data.department?._id })
    );
    let checkValue = "manager";
    let checkComplianceUser = "compliance-user";
    let userAdmin = "user-administrator";
    let obj = roleList.find((data) => data._id === selectedUser?.role._id);
    if (checkValue === obj.role || checkComplianceUser === obj.role) {
      setToggleManager(true);
      let multiValue = selectedUser.departments.map((data) => ({
        value: data?.department?._id,
        label: data.department?.dname,
      }));
      setDefaultValue([...multiValue]);
    } else {
      setToggleManager(false);
      let multiValue = selectedUser.departments.map((data) => ({
        value: data?.department?._id,
        label: data.department?.dname,
      }));
      setDefaultValue([...multiValue]);
    }
    if (userAdmin === obj.role) {
      setIsDisabled(false);
    } else {
      setIsDisabled(true);
    }
  };

  function onKeyDown(keyEvent) {
    if ((keyEvent.charCode || keyEvent.keyCode) === 13) {
      keyEvent.preventDefault();
    }
  }

  const userDetails = (data) => {
    setSingleUserDetails(data);
    setDetailModal(true);
  };
  const deleteHandler = (id, user) => {
    setDeleteModal(true);
    setDeleteUser({ id: id, user: user });
    isdeleteAllAssociated === false ? setIsdeleteAllAssociated(false) : setIsdeleteAllAssociated(false)
  };
  const multiSelectDepartment = (selectedOption, actionMeta) => {
    if (actionMeta.action === "remove-value") {
      let obj = { department: actionMeta.removedValue.value };
      setRemovedBy((oldArray) => [...oldArray, obj]);
    }
    if (toggleManager === true) {
      setDefaultValue([...selectedOption]);
      const finalValue = selectedOption.map((data) => ({
        department: data.value,
      }));
      setSelectDepartment([...finalValue]);
    } else {
      const finalValue = { department: selectedOption?.value };
      setSelectDepartment([finalValue]);
      setDefaultValue([selectedOption]);
    }
  };
  const total = async () => {
    const userList = await axios.post(mainServerAppUrl + "/users/list-all");
    const total = userList?.data?.data?.length;
    setTotalPage(Math.ceil(total / pageSize));
  };
  const AddUserButton = () => {
    if (plan_type === "free-forever") {
      if (totalUserCount === 2 && localStorage.getItem("notShowAgain") !== "true") {
        setFirstTimeModal(true);

      }
      else {
        setIsModal(true);
        setIAdd(false);
        setToggleManager(false);
        setDefaultValue([]);
        setWelcomeModal(0);
        setFirstTimeModal(false)
      }
    }
    else {
      setIsModal(true);
      setIAdd(false);
      setToggleManager(false);
      setDefaultValue([]);
      setWelcomeModal(0);
    }
  };
  var getInitials = function (string) {
    var names = string.split(" "),
      initials = names[0].substring(0, 1).toUpperCase();
    if (names.length > 1) {
      initials += names[names.length - 1].substring(0, 1).toUpperCase();
    }
    return initials;
  };
  const deleteAllAssociated = (e) => {
    setIsdeleteAllAssociated(e.target.checked)
  }

  return (
    <>
      {ifloader === true ? (
        <Loaders />
      ) :
        <>
          <header className="page-header">
            <div className="flex-40">
              <h1>Users</h1>
            </div>
            <div className="flex-60">
              {users?.view === true ? (
                <div className="d-flex justify-content-end align-item-center">
                  {users?.modify === true ? (
                    getAuthUser()?.role === "manager" ? (
                      " "
                    ) : (
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() => {
                          if (
                            plan_type === "free-forever" &&
                            userList?.length === 3
                          ) {
                            setMessageModal(true);
                          }
                          else if (totalUserCount >= maxSeats) {
                            setMaxSeatModal(true);
                          } else {
                            AddUserButton();
                          }

                        }}
                        disabled={permissions?.subscriptionStatus !== "active" && plan_type !== "free-forever"}
                      >
                        <i className="fe fe-plus mr-2"></i>Add User
                      </button>
                    )
                  ) : (
                    ""
                  )}
                </div>
              ) : (
                ""
              )}
            </div>
          </header>
          <div className={`section-body ${fixNavbar ? "marginTop" : ""}`}>
            {users?.view === true ? (
              <>
                <div className="row row-cards">
                  {userList?.length > 0 ? (
                    <>
                      <div className="counter-wrapper">
                        <ul className="counter-list">
                          <li className="col-md-4">
                            <div className="counter-div">
                              <h1>Total Users</h1>
                              {totalUserCount > 0 ? (
                                <p>{totalUserCount}</p>
                              ) : (
                                <p className="text-light">Data not available</p>
                              )}
                              <div className="counter-icon">
                                <img
                                  src={require("../../images/UserCounter.png")}
                                />
                              </div>
                            </div>
                          </li>
                          <li className="col-md-4">
                            <div className="counter-div">
                              <h1>Active Users</h1>
                              {inActiveCount > 0 ? (
                                <p>{inActiveCount}</p>
                              ) : (
                                <p className="text-light">Data not available</p>
                              )}
                              <div className="counter-icon">
                                <img
                                  src={require("../../images/UserCounter.png")}
                                />
                              </div>
                            </div>
                          </li>
                          <li className="col-md-4">
                            <div className="counter-div">
                              <h1>Inactive Users</h1>
                              {activeCount > 0 ? (
                                <p>{activeCount}</p>
                              ) : (
                                <p className="text-light">Data not available</p>
                              )}
                              <div className="counter-icon">
                                <img
                                  src={require("../../images/UserCounter.png")}
                                />
                              </div>
                            </div>
                          </li>
                        </ul>
                      </div>
                      <div className="table-responsive">
                        <table className="table table-hover table-vcenter text-nowrap table_custom spacing8 mb-0">
                          <thead>
                            <tr>
                              <th className="text-center w-1">
                                <i className="icon-people" />
                              </th>
                              <th>Users</th>
                              <th>Activity</th>
                              <th>Role</th>
                              <th>Department</th>
                              <th>Tracking</th>
                              <th>SS Frequency</th>
                              <th className="text-center">Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {userList?.map((data, index) => (
                              <tr key={index}>
                                <td className="text-center">
                                  <div className="initials">
                                    {getInitials(data?.firstName)}

                                  </div>
                                </td>
                                <td>
                                  <div className="text-capitalize">
                                    {data?.firstName} {data?.lastName} {data?.status === "active" ? "" : <span className="ml-1 badge badge-primary">Invited</span>}
                                  </div>
                                  <span className="small">{data?.email}</span>
                                </td>
                                <td>
                                  <div
                                    className="text-truncate small"
                                    style={{ width: "180px" }}
                                    data-tip
                                    data-for={"Activity" + index}
                                  >
                                    <strong className="text-muted mr-2">
                                      <i className="fa-solid fa-chart-line"></i> :{" "}
                                    </strong>
                                    {data?.lastActivity === null
                                      ? "-"
                                      : data?.lastActivity?.windowName === ""
                                        ? "-"
                                        : data?.appSettings?.app_tracking ===
                                          false ? "-" : data?.lastActivity?.windowName}
                                  </div>

                                  <span
                                    className="small"
                                    data-tip
                                    data-for={"seen" + index}
                                  >
                                    <strong className="text-muted mr-2">
                                      <i className="fa-solid fa-eye"></i> :{" "}
                                    </strong>
                                    {data?.lastActivity === null
                                      ? "-"
                                      : data?.appSettings?.app_tracking ===
                                        false ? "-" : new Date(
                                          data?.lastActivity?.updatedAt
                                        ).toLocaleString()}
                                  </span>
                                  {data?.lastActivity === null || data?.appSettings?.app_tracking ===
                                    false ? (
                                    ""
                                  ) : (
                                    <ReactTooltip
                                      effect="solid"
                                      id={"Activity" + index}
                                      aria-haspopup="true"
                                      role={"Activity" + index}
                                    >
                                      Last Activity :{" "}
                                      {data?.lastActivity?.windowName === ""
                                        ? "-"
                                        : data?.lastActivity?.windowName}
                                    </ReactTooltip>
                                  )}
                                  {data?.lastActivity === null || data?.appSettings?.app_tracking ===
                                    false ? (
                                    ""
                                  ) : (
                                    <ReactTooltip
                                      effect="solid"
                                      id={"seen" + index}
                                      aria-haspopup="true"
                                      role={"Activity" + index}
                                    >
                                      Last Seen :{" "}
                                      {new Date(
                                        data?.lastActivity?.updatedAt
                                      ).toLocaleString()}
                                    </ReactTooltip>
                                  )}


                                </td>
                                <td>
                                  <div className="text-capitalize">
                                    {data?.role?.role}
                                  </div>
                                </td>
                                <td>
                                  {data?.departments?.length > 0
                                    ? data?.departments.map((item, index) => (
                                      <span
                                        key={index}
                                        className="text-capitalize mr-2"
                                      >
                                        <div className="alert alert-primary">
                                          {" "}
                                          {item?.department?.dname}
                                        </div>
                                      </span>
                                    ))
                                    : "-"}
                                </td>
                                <td>
                                  {getAuthUser()?._id === data?._id ? (
                                    "-"
                                  ) : (
                                    <div className="d-flex tracking">
                                      <div
                                        className="tracking-list"
                                        data-tip
                                        data-for={"app" + index}
                                      >
                                        <i className="fa-solid fa-computer-mouse"></i>
                                        <span className="icon">
                                          <i
                                            className={
                                              data?.appSettings?.app_tracking ===
                                                true
                                                ? "fa-solid fa-circle-check text-green"
                                                : "fa-solid fa-circle-xmark text-red"
                                            }
                                          ></i>
                                        </span>
                                      </div>
                                      <ReactTooltip
                                        effect="solid"
                                        id={"app" + index}
                                        aria-haspopup="true"
                                        role={"app" + index}
                                      >
                                        App Tracking -{" "}
                                        {data?.appSettings?.app_tracking ===
                                          true ? (
                                          <span className="text-green">On</span>
                                        ) : (
                                          <span className="text-red">Off</span>
                                        )}
                                      </ReactTooltip>
                                      <div
                                        className="tracking-list"
                                        data-tip
                                        data-for={"screen" + index}
                                      >
                                        <i className="fa-solid fa-laptop-code"></i>
                                        <span className="icon">
                                          <i
                                            className={
                                              data?.appSettings?.screen_tracking ===
                                                true
                                                ? "fa-solid fa-circle-check text-green"
                                                : "fa-solid fa-circle-xmark text-red"
                                            }
                                          ></i>
                                        </span>
                                      </div>
                                      <ReactTooltip
                                        effect="solid"
                                        id={"screen" + index}
                                        aria-haspopup="true"
                                        role={"screen" + index}
                                      >
                                        Screen Tracking -{" "}
                                        {data?.appSettings?.screen_tracking ===
                                          true ? (
                                          <span className="text-green">On</span>
                                        ) : (
                                          <span className="text-red">Off</span>
                                        )}
                                      </ReactTooltip>
                                    </div>
                                  )}
                                </td>
                                <td>
                                  {data?.appSettings
                                    ? data?.appSettings?.ss_frequency === null
                                      ? "-"
                                      : data?.appSettings?.ss_frequency === "0"
                                        ? "-"
                                        : millisToMinutes(
                                          data?.appSettings?.ss_frequency
                                        ) + " MINS"
                                    : "-"}
                                </td>
                                <td className="text-center">
                                  {users?.modify === true ? (
                                    <div
                                      className={
                                        getAuthUser()?.role === "manager"
                                          ? data?.departments?.map((data) =>
                                            getAuthUser()?.departmentId?.map(
                                              (items) =>
                                                items?.department ===
                                                  data?.department?._id
                                                  ? ""
                                                  : "d-none"
                                            )
                                          )
                                          : ""
                                      }
                                    >
                                      <button
                                        className="btn btn-icon"
                                        onClick={() => userDetails(data)}
                                        data-tip
                                        data-for={"view" + index}
                                        disabled={permissions?.subscriptionStatus !== "active" && plan_type !== "free-forever"}
                                      >
                                        <i className="fa fa-info-circle text-green" />
                                      </button>
                                      <ReactTooltip
                                        effect="solid"
                                        id={"view" + index}
                                        aria-haspopup="true"
                                        role={"Activity" + index}
                                      >
                                        View System details
                                      </ReactTooltip>
                                      <button
                                        disabled={permissions?.role?.role === "user-administrator" && data?.role?.role === "admin" || getAuthUser()?._id === data?._id || permissions?.subscriptionStatus !== "active" && plan_type !== "free-forever"}
                                        className="btn btn-icon"
                                        onClick={() => editUser(data)}
                                        data-tip
                                        data-for={"Edit" + index}
                                      >
                                        <i className="fa fa-pencil text-blue" />
                                      </button>
                                      <ReactTooltip
                                        effect="solid"
                                        id={"Edit" + index}
                                        aria-haspopup="true"
                                        role={"Activity" + index}
                                      >
                                        Edit
                                      </ReactTooltip>
                                      <button
                                        disabled={permissions?.role?.role === "user-administrator" && data?.role?.role === "admin" || getAuthUser()?._id === data?._id}
                                        className="btn btn-icon"
                                        onClick={() =>
                                          deleteHandler(
                                            data?._id,
                                            data?.firstName + " " + data?.lastName
                                          )
                                        }
                                        data-tip
                                        data-for={"delete" + index}
                                      >
                                        <i className="fa fa-trash-alt text-red" />
                                      </button>
                                      <ReactTooltip
                                        effect="solid"
                                        id={"delete" + index}
                                        aria-haspopup="true"
                                        role={"Activity" + index}
                                      >
                                        Delete
                                      </ReactTooltip>
                                    </div>
                                  ) : (
                                    ""
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        {userList?.length > 0 && (
                          <div className="d-flex justify-content-center">
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
                                      setPage(
                                        page == totalPage - 1
                                          ? totalPage - 1
                                          : page + 1
                                      );
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
                      </div>
                    </>
                  ) : (
                    <div className="no-data-found">
                      <div className="card">
                        <div className="card-body">
                          <i className="fa fa-file" />
                          <p>Not Data Found</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="no-data-found">
                <div className="card">
                  <div className="card-body">
                    <i className="fa fa-file" />
                    <p>Not able to view users</p>
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
                    <div className="modal-header">
                      <h5 className="modal-title" id="exampleModalLabel">
                        {isAdd === false ? "Add User" : "Edit User"}
                      </h5>
                      <button
                        type="button"
                        className="close"
                        data-dismiss="modal"
                        onClick={() => {
                          setIsModal(false);
                          setIAdd(false);
                          setDefaultValue([]);
                          setRemovedBy([]);
                          // setFirstTimeModal(true);
                          if (totalUserCount <= 1) {
                            setWelcomeModal(1);
                          }
                          else if (plan_type === "free-forever") {
                            totalUserCount === 2 && localStorage.getItem("notShowAgain") === "true" && setFirstTimeModal(false);
                          }
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
                      validationSchema={yup.object().shape({
                        firstName: yup
                          .string()
                          .required("First Name is required")
                          .matches(/^(?!\s+$)/, "Please Enter your First Name"),
                        lastName: yup
                          .string()
                          .required("Last Name is required")
                          .matches(/^(?!\s+$)/, "Please Enter your Last Name"),
                        email: yup
                          .string()
                          .email("Email is invalid")
                          .required("Email is required")
                          .matches(/^(?!\s+$)/, "Please Enter your Email"),
                        role: yup.string().required("Role  is required"),
                        ss_frequency: screenTrack
                          ? yup.string().required("Frequency is required")
                          : yup.string().notRequired(),
                      })}
                      initialValues={{
                        firstName: isAdd ? firstName : "",
                        lastName: isAdd ? lastName : "",
                        email: isAdd ? email : "",
                        ss_frequency: isAdd
                          ? fre === 0
                            ? defaultSsValue
                            : fre
                          : defaultSsValue,
                        role: isAdd ? userRole : "",
                      }}
                      validate={(values) => {
                        setUserRole(values?.role);
                        let checkManager = "manager";
                        let checkComplianceUser = "compliance-user";
                        let userAdmin = "user-administrator";
                        let obj = roleList?.find(
                          (data) => data?._id === values?.role
                        );
                        if (
                          checkManager === obj?.role ||
                          checkComplianceUser === obj?.role
                        ) {
                          setToggleManager(true);
                        } else {
                          setToggleManager(false);
                        }
                        if (userAdmin === obj?.role) {
                          setIsDisabled(false);
                        } else {
                          setIsDisabled(true);
                        }
                      }}
                      onSubmit={(fields, { resetForm }) => {
                        function MinutesToMilliseconds(time) {
                          return time * 60 * 1000;
                        }
                        let finalValues = {
                          ...fields,
                          role: userRole,
                          departments: !isDisable ? null : selectDepartment,
                          app_tracking: apptrack,
                          screen_tracking: screenTrack,
                          ss_frequency: screenTrack
                            ? MinutesToMilliseconds(fields?.ss_frequency)
                            : 0,
                        };
                        // {
                        //   !isDisable && delete finalValues.departments;
                        // }
                        if (isAdd === false) {
                          if (plan_type === "free-forever") {
                            if (userList?.length >= 3) {
                              setMessageModal(true);
                            } else {
                              dispatch(submitUser(finalValues));
                            }
                          } else {
                            dispatch(submitUser(finalValues));
                          }
                        } else {
                          if (toggleManager === true) {
                            let fieldss = {
                              ...finalValues,
                              _id: editId,
                              removedDepartment: destArray,
                            };
                            dispatch(updateUser(fieldss));
                          } else {
                            let fieldss = { ...finalValues, _id: editId };
                            dispatch(updateUser(fieldss));
                          }
                        }
                        setToggleManager(false);
                        setDefaultValue([]);
                        setIsModal(false);
                        setIAdd(false);
                        setRemovedBy([]);
                      }}
                      render={({ errors, status, touched }) => (
                        <Form >
                          <div className="modal-body" onKeyDown={onKeyDown}>
                            <div className="row">
                              <div className="col-sm-6 col-md-4">
                                <div className="form-group">
                                  <label className="form-label">
                                    First Name{" "}
                                    <sup className="required">
                                      <i className="fa-solid fa-star-of-life"></i>
                                    </sup>
                                  </label>
                                  <Field
                                    name="firstName"
                                    type="text"
                                    className={
                                      "form-control" +
                                      (errors.firstName && touched.firstName
                                        ? " is-invalid"
                                        : "")
                                    }
                                  />
                                  <ErrorMessage
                                    name="firstName"
                                    component="div"
                                    className="invalid-feedback"
                                  />
                                </div>
                              </div>
                              <div className="col-sm-6 col-md-4">
                                <div className="form-group">
                                  <label className="form-label">
                                    Last Name{" "}
                                    <sup className="required">
                                      <i className="fa-solid fa-star-of-life"></i>
                                    </sup>
                                  </label>
                                  <Field
                                    name="lastName"
                                    type="text"
                                    className={
                                      "form-control" +
                                      (errors.lastName && touched.lastName
                                        ? " is-invalid"
                                        : "")
                                    }
                                  />
                                  <ErrorMessage
                                    name="lastName"
                                    component="div"
                                    className="invalid-feedback"
                                  />
                                </div>
                              </div>
                              <div className="col-sm-6 col-md-4">
                                <div className="form-group">
                                  <label className="form-label">
                                    Email address{" "}
                                    <sup className="required">
                                      <i className="fa-solid fa-star-of-life"></i>
                                    </sup>
                                  </label>
                                  <Field
                                    name="email"
                                    type="text"
                                    className={
                                      "form-control" +
                                      (errors.email && touched.email
                                        ? " is-invalid"
                                        : "")
                                    }
                                  />
                                  <ErrorMessage
                                    name="email"
                                    component="div"
                                    className="invalid-feedback"
                                  />
                                </div>
                              </div>
                            </div>
                            <div className="row">
                              <div className="col-sm-6 col-md-6">
                                <div className="form-group">
                                  <label className="form-label">
                                    Role{" "}
                                    <sup className="required">
                                      <i className="fa-solid fa-star-of-life"></i>
                                    </sup>
                                  </label>
                                  <Field
                                    className={
                                      "form-control" +
                                      (errors.role && touched.role
                                        ? " is-invalid"
                                        : "")
                                    }
                                    component="select"
                                    name="role"
                                  >
                                    <option className="bg-secondary">
                                      Select Role
                                    </option>
                                    {roleList?.map((data, index) => (
                                      <option
                                        key={index}
                                        value={data._id}
                                        id={data.role}
                                      >
                                        {data.role}
                                      </option>
                                    ))}
                                  </Field>
                                  <ErrorMessage
                                    name="role"
                                    component="div"
                                    className="invalid-feedback"
                                  />
                                </div>
                              </div>
                              <div className="col-sm-6 col-md-6">
                                <div className="form-group">
                                  <label className="form-label">
                                    Department{" "}
                                    <sup className="required">
                                      <i className="fa-solid fa-star-of-life"></i>
                                    </sup>
                                  </label>
                                  <Select
                                    className="basic-multi-select"
                                    classNamePrefix="select"
                                    closeMenuOnSelect={true}
                                    isMulti={toggleManager === true ? true : false}
                                    options={option}
                                    name="department"
                                    onChange={multiSelectDepartment}
                                    value={!isDisable ? "" : defaultValue}
                                    isDisabled={!isDisable}
                                    required
                                  />
                                  {permissions?.role?.role === "manager" ? "" :
                                    <button
                                      className="btn btn-link"
                                      onClick={() => history.push("/department")}
                                    >
                                      Add New Department
                                    </button>
                                  }
                                </div>
                              </div>
                            </div>
                            <div className="app-setting-wrapper w-100">
                              <label>Desktop App Setting</label>
                            </div>
                            <div className="row">
                              <div className="col-md-4 col-sm-6">
                                <div className="form-group">
                                  <div className="form-label">
                                    Screenshot
                                    <div
                                      className="tooltip-icon"
                                      data-tip
                                      data-for="screen_tracking"
                                    >
                                      <img
                                        src={require("../../images/Question.png")}
                                      />
                                    </div>
                                  </div>
                                  <label className="custom-switch">
                                    <input
                                      type="checkbox"
                                      name="screen_tracking"
                                      disabled={getAuthUser()?.role === "manager"}
                                      className="custom-switch-input"
                                      checked={screenTrack}
                                      onChange={(e) =>
                                        setScreenTrack(e.target.checked)
                                      }
                                    />
                                    <span
                                      className="custom-switch-indicator"
                                      style={
                                        getAuthUser()?.role === "manager"
                                          ? { cursor: "not-allowed" }
                                          : { cursor: "pointer" }
                                      }
                                    />
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
                                    {screenTrack ? "disable" : "enable"} the
                                    Screenshot settings.
                                  </ReactTooltip>
                                </div>
                              </div>
                              <div className="col-md-4 col-sm-6">
                                <div className="form-group">
                                  <label className="form-label">
                                    Screenshot Frequency
                                    <div
                                      className="tooltip-icon"
                                      data-tip
                                      data-for="screenshot_Frequency"
                                    >
                                      <img
                                        src={require("../../images/Question.png")}
                                      />
                                    </div>
                                  </label>
                                  <div className="input-group">
                                    <Field
                                      className={
                                        screenTrack
                                          ? "form-control" +
                                          (errors.ss_frequency &&
                                            touched.ss_frequency
                                            ? " is-invalid"
                                            : "")
                                          : "form-control"
                                      }
                                      component="select"
                                      name="ss_frequency"
                                      disabled={
                                        !screenTrack ||
                                        getAuthUser()?.role === "manager"
                                      }
                                    >
                                      <option value=""
                                      disabled>Select</option>
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
                                    <ErrorMessage
                                      name="ss_frequency"
                                      component="div"
                                      className="invalid-feedback"
                                    />
                                  </div>
                                  <ReactTooltip
                                    effect="solid"
                                    id="screenshot_Frequency"
                                    aria-haspopup="true"
                                    role="app_tracking"
                                  >
                                    Set the Screenshot Frequency time so the
                                    application can take the screenshots according
                                    to the selected time interval.
                                  </ReactTooltip>
                                </div>
                              </div>
                              <div className="col-md-4 col-sm-6">
                                <div className="form-group">
                                  <div className="form-label">
                                    App Usage
                                    <div
                                      className="tooltip-icon"
                                      data-tip
                                      data-for="app_tracking"
                                    >
                                      <img
                                        src={require("../../images/Question.png")}
                                      />
                                    </div>
                                  </div>
                                  <label className="custom-switch">
                                    <input
                                      type="checkbox"
                                      name="app_tracking"
                                      className="custom-switch-input"
                                      disabled={getAuthUser()?.role === "manager"}
                                      checked={apptrack}
                                      onChange={(e) =>
                                        setAppTrack(e.target.checked)
                                      }
                                    />
                                    <span
                                      className="custom-switch-indicator"
                                      style={
                                        getAuthUser()?.role === "manager"
                                          ? { cursor: "not-allowed" }
                                          : { cursor: "pointer" }
                                      }
                                    />
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
                                    {apptrack ? "disable" : "enable"} the App
                                    tracking settings.
                                  </ReactTooltip>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="modal-footer">
                            <button type="submit" className="btn btn-success mr-2">
                              Save
                            </button>
                            <button
                              type="reset"
                              className="btn btn-secondary"
                              data-dismiss="modal"
                              onClick={() => {
                                setIsModal(false);
                                setIAdd(false);
                                setRemovedBy([]);
                                totalUserCount <= 1 && setWelcomeModal(1);
                                if (plan_type === "free-forever") {
                                  totalUserCount === 2 && localStorage.getItem("notShowAgain") === "true" && setFirstTimeModal(false);
                                }
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

            {permissions?.role?.role === "admin" && notSuccess === true && welcomeModal === 1 ?
              <div
                className="modal d-block"
                aria-labelledby="exampleModalLabel"
                aria-hidden="true"
              >
                <div
                  className="modal-dialog modal-dialog-centered modal-md welcome-modal"
                  role="document"
                >
                  <div className="modal-content">
                    <button
                      className="close"
                      onClick={() => {
                        setWelcomeModal(0)
                      }}
                    ></button>
                    <div className="modal-body">
                      <div className="welcome-modal-icon">
                        <img
                          src={require("../../images/monkey.png")}
                          alt="logoProd2.png"
                        />
                      </div>
                      <p>Let's get you your first user set up.</p>
                      <p>
                        <a
                          href="#"
                          onClick={() => {
                            if (
                              plan_type === "free-forever" &&
                              userList?.length >= 3
                            ) {
                              setMessageModal(true);
                            } else {
                              AddUserButton();
                            }
                          }}
                        >
                          Click here
                        </a>
                        to add your first user.
                      </p>
                      <div className="bottom-content">
                        <p>
                          Ask the person to check his email and download the{" "}
                          <strong>ProdChimp</strong> app from the link. You can
                          always change the data capture setting later
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              : ""}

            {permissions?.role?.role === "admin" && success === true && hooaryModal === 2 ?
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
                      <div className="welcome-modal-icon">
                        <img
                          src={require("../../images/monkey.png")}
                          alt="logoProd2.png"
                        />
                      </div>
                      <h1>Hooray!</h1>
                      <div className="bottom-content">
                        <p>
                          looks like you have got your first user set up. We are starting to capture some data;<br />
                          please come back in a few minutes.
                        </p>
                      </div>
                      <div className="delete-footer">
                        <button
                          type="submit"
                          className="btn btn-dark"
                          onClick={() => {
                            setHorrayModal(3)
                            dispatch({
                              type: Constant.GET_USER_SUCCESS,
                              Success: false,
                            })
                          }}
                        >
                          Close
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              : ""}

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
                        <span className="text-red">{deleteUser.user}</span> user
                      </strong>
                      <p
                        className="text-secondary"
                        style={{ fontSize: "14px", fontWeight: "600" }}
                      >
                        This will delete your user from user list <br />
                        Are you sure ?
                      </p>
                      <div className="form-check mb-2">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          id="deleteAllAssociated"
                          onChange={(e) => deleteAllAssociated(e)}
                        />
                        <label className="form-check-label">
                          if you want to delete all associated data of that user
                        </label>
                      </div>
                      <div className="delete-footer">
                        <button
                          type="submit"
                          className="btn btn-primary"
                          onClick={() => {
                            if (isdeleteAllAssociated === false) {
                              dispatch(userDeleteHandler(deleteUser?.id))
                            }
                            else {
                              dispatch(deleteAllAssociatedData(deleteUser?.id))
                            }
                            setDeleteModal(false);
                          }}
                        >
                          Confirm
                        </button>
                        <button
                          type="reset"
                          className="btn btn-secondary"
                          data-dismiss="modal"
                          onClick={() => {
                            setDeleteModal(false)
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {isDetailModal && (
              <div
                className="modal d-block"
                aria-labelledby="exampleModalLabel"
                aria-hidden="true"
              >
                <div
                  className="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-lg"
                  role="document"
                >
                  <div className="modal-content">
                    <div className="modal-header">
                      <h5 className="modal-title" id="exampleModalLabel">
                        {singleUserDetails?.lastName} {singleUserDetails?.firstName}
                      </h5>
                      <button
                        type="button"
                        className="close"
                        data-dismiss="modal"
                        aria-label="Close"
                        onClick={() => {
                          setDetailModal(false);
                        }}
                      >
                        <span aria-hidden="true">&times;</span>
                      </button>
                    </div>
                    <div className="modal-body user-detail-body">
                      <ul className="nav nav-tabs" id="myTab" role="tablist">
                        <li className="nav-item">
                          <a
                            className="nav-link active"
                            id="home-tab"
                            data-toggle="tab"
                            href="#home"
                            role="tab"
                            aria-controls="home"
                            aria-selected="true"
                          >
                            Basic Details{" "}
                          </a>
                        </li>
                        <li className="nav-item">
                          <a
                            className="nav-link"
                            id="profile-tab"
                            data-toggle="tab"
                            href="#profile"
                            role="tab"
                            aria-controls="profile"
                            aria-selected="false"
                          >
                            System Details
                          </a>
                        </li>
                        <li className="nav-item">
                          <a
                            className="nav-link"
                            id="contact-tab"
                            data-toggle="tab"
                            href="#contact"
                            role="tab"
                            aria-controls="contact"
                            aria-selected="false"
                          >
                            Graphic Details
                          </a>
                        </li>
                      </ul>
                      <div className="tab-content" id="myTabContent">
                        <div
                          className="tab-pane fade show active"
                          id="home"
                          role="tabpanel"
                          aria-labelledby="home-tab"
                        >
                          <div className="details-box">
                            <table className="table table-bordered">
                              <tbody>
                                <tr>
                                  <td>
                                    <strong>Email</strong>
                                  </td>
                                  <td>{singleUserDetails?.email}</td>
                                </tr>
                                <tr>
                                  <td>
                                    <strong>Department</strong>
                                  </td>
                                  <td>
                                    {singleUserDetails?.departments.length > 0
                                      ? singleUserDetails?.departments?.map(
                                        (dData, index) => (
                                          <span
                                            key={index}
                                            className="mr-2 badge badge-primary p-1"
                                          >
                                            {dData.department.dname}
                                          </span>
                                        )
                                      )
                                      : "-"}
                                  </td>
                                </tr>
                                <tr>
                                  <td>
                                    <strong>Role</strong>
                                  </td>
                                  <td>{singleUserDetails?.role?.role}</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                        <div
                          className="tab-pane fade"
                          id="profile"
                          role="tabpanel"
                          aria-labelledby="profile-tab"
                        >
                          <div className="details-box">
                            <table className="table table-bordered">
                              {singleUserDetails?.usersystem ? (
                                <tbody>
                                  <tr>
                                    <td>
                                      <strong>Operating System</strong>
                                    </td>
                                    <td>
                                      {singleUserDetails?.usersystem?.platform}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>
                                      <strong>Processor</strong>
                                    </td>
                                    <td>
                                      {
                                        singleUserDetails?.usersystem
                                          ?.additionalDetails?.processor
                                      }
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>
                                      <strong>Ram</strong>
                                    </td>
                                    <td>{singleUserDetails?.usersystem?.ram}</td>
                                  </tr>
                                  <tr>
                                    <td>
                                      <strong>Serial No</strong>
                                    </td>
                                    <td>{singleUserDetails?.usersystem?.serial}</td>
                                  </tr>
                                  <tr>
                                    <td>
                                      <strong>Host Name</strong>
                                    </td>
                                    <td>
                                      {
                                        singleUserDetails?.usersystem
                                          ?.additionalDetails?.hostName
                                      }
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>
                                      <strong>Manufacturer</strong>
                                    </td>
                                    <td>
                                      {
                                        singleUserDetails?.usersystem
                                          ?.additionalDetails?.manufacturer
                                      }
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>
                                      <strong>Version</strong>
                                    </td>
                                    <td>
                                      {
                                        singleUserDetails?.usersystem
                                          ?.additionalDetails?.version
                                      }
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>
                                      <strong>Model</strong>
                                    </td>
                                    <td>
                                      {
                                        singleUserDetails?.usersystem
                                          ?.additionalDetails?.model
                                      }
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>
                                      <strong>System Type</strong>
                                    </td>
                                    <td>
                                      {
                                        singleUserDetails?.usersystem
                                          ?.additionalDetails?.systemType
                                      }
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>
                                      <strong>Uuid</strong>
                                    </td>
                                    <td>
                                      {
                                        singleUserDetails?.usersystem
                                          ?.additionalDetails?.uuid
                                      }
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>
                                      <strong>Sku</strong>
                                    </td>
                                    <td>
                                      {
                                        singleUserDetails?.usersystem
                                          ?.additionalDetails?.sku
                                      }
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>
                                      <strong>Machine</strong>
                                    </td>
                                    <td>
                                      {
                                        singleUserDetails?.usersystem
                                          ?.additionalDetails?.machine
                                      }
                                    </td>
                                  </tr>
                                </tbody>
                              ) : (
                                <tbody>
                                  <tr>
                                    <td className="text-center" colSpan={2}>
                                      No Data Found
                                    </td>
                                  </tr>
                                </tbody>
                              )}
                            </table>
                          </div>
                        </div>
                        <div
                          className="tab-pane fade"
                          id="contact"
                          role="tabpanel"
                          aria-labelledby="contact-tab"
                        >
                          <div className="details-box">
                            <table className="table table-bordered">
                              {singleUserDetails?.usersystem?.additionalDetails
                                ?.gpuDetails ? (
                                <tbody>
                                  <tr>
                                    <td>
                                      <strong>Model</strong>
                                    </td>
                                    <td>
                                      {
                                        singleUserDetails?.usersystem
                                          ?.additionalDetails?.gpuDetails?.model
                                      }
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>
                                      <strong>Bus</strong>
                                    </td>
                                    <td>
                                      {
                                        singleUserDetails?.usersystem
                                          ?.additionalDetails?.gpuDetails?.bus
                                      }
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>
                                      <strong>Vendor</strong>
                                    </td>
                                    <td>
                                      {
                                        singleUserDetails?.usersystem
                                          ?.additionalDetails?.gpuDetails?.vendor
                                      }
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>
                                      <strong>Vram</strong>
                                    </td>
                                    <td>
                                      {
                                        singleUserDetails?.usersystem
                                          ?.additionalDetails?.gpuDetails?.vram
                                      }
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>
                                      <strong>Sub Device Id</strong>
                                    </td>
                                    <td>
                                      {
                                        singleUserDetails?.usersystem
                                          ?.additionalDetails?.gpuDetails
                                          ?.subDeviceId
                                      }
                                    </td>
                                  </tr>
                                </tbody>
                              ) : (
                                <tbody>
                                  <tr>
                                    <td className="text-center" colSpan={2}>
                                      No Data Found
                                    </td>
                                  </tr>
                                </tbody>
                              )}
                            </table>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="modal-footer">
                      <button
                        type="reset"
                        className="btn btn-primary mr-2"
                        data-dismiss="modal"
                        onClick={() => {
                          setDetailModal(false);
                        }}
                      >
                        OK
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {maxSeatModal && (
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
                      <h1 className="text-red">Alert!</h1>
                      <p
                        className="text-secondary"
                        style={{ fontSize: "14px", fontWeight: "600" }}
                      >
                        You have used all of your purchased seats.<br />
                        Increase your seats to add more Users.
                      </p>
                      <div className="delete-footer">
                        <button
                          type="reset"
                          className="btn btn-secondary mr-2"
                          data-dismiss="modal"
                          onClick={() => {
                            setMaxSeatModal(false);
                            //setReset(false)
                          }}
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="btn btn-primary"
                          onClick={() => {
                            setMaxSeatModal(false);
                            history.push("/subscriptionDetails")

                          }}
                        >
                          Go to Subscription Details
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {firstTimeModal && (
              <div
                className="modal d-block"
                aria-labelledby="exampleModalLabel"
                aria-hidden="true"
              >
                <div
                  className="modal-dialog modal-dialog-centered modal-md message-modal"
                  role="document"
                >
                  <div className="modal-content">
                    <button
                      className="close"
                      onClick={() => {
                        setIsModal(true);
                        setIAdd(false);
                        setToggleManager(false);
                        setDefaultValue([]);
                        setFirstTimeModal(false);
                      }}
                    ></button>
                    <div className="modal-body">
                      <div className="welcome-modal-icon">
                        <img
                          src={require("../../images/monkey.png")}
                          alt="logoProd2.png"
                        />
                      </div>
                      <div className="bottom-content">
                        <p>
                          Do you know you can add as many users as you want by just
                          paying $1.5/per month per user and enjoy unlimited data
                          retention and reports
                        </p>
                      </div>
                      <div className="form-check">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          id="exampleCheck1"
                          onChange={() => {
                            setIsModal(true);
                            setIAdd(false);
                            setToggleManager(false);
                            setDefaultValue([]);
                            setFirstTimeModal(false);
                            localStorage.setItem("notShowAgain", "true");
                          }}
                        />
                        <label className="form-check-label">
                          Do not show me again
                        </label>
                      </div>
                    </div>
                    <div className="modal-footer">
                      <button
                        type="submit"
                        className="btn btn-success"
                        onClick={() => history.push("/payment")}
                      >
                        Upgrade to Premium
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <MessageModal
              open={messageModal}
              closeHandler={() => setMessageModal(!messageModal)}
            />
          </div>
        </>
      }
    </>
  );
}
export default User;
