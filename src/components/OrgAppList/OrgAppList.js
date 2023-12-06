/* eslint-disable jsx-a11y/anchor-is-valid */
import axios from "axios";
import React, { Fragment, useEffect, useState } from "react";
import { mainServerAppUrl } from "./../../apis/mainapi";
import toast from "react-hot-toast";
import { Formik, Field, Form } from "formik";
import ValidationMessage from "./../common/ValidationMessage";
import { addFormValidation } from "../Authentication/model/ValidationSchema";
import ReactTooltip from "react-tooltip";
import Loaders from "../Loaders/Loaders";
import { getAuthUser } from "../Authentication/authHelpers";
import { CSVLink, CSVDownload } from "react-csv";
import moment from "moment";

function OrgAppList({ fixNavbar }) {
  const [appdata, setAppData] = useState([]);
  const [isModal, setIsModal] = useState(false);
  const [file, setFile] = useState();
  const [isFormModal, setIsFormModal] = useState(false);
  const [Type, setType] = useState();
  const [isAdd, setIAdd] = useState(false);
  const [appAndWebsite, setAppAndWebsite] = useState("");
  const [URL, setURL] = useState("");
  const [editId, setEditId] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPage, setTotalPage] = useState();
  const [superAppData, setSuperAppData] = useState([]);
  const [isDeleteModal, setDeleteModal] = useState(false);
  const [organization, setOrganization] = useState();
  // const [appType] = useState(["All Applications", "New Applications", "Default Applications"])

  function handleChange(event) {
    setFile(event.target.files[0]);
  }
  function handleSubmit(event) {
    event.preventDefault();
    const url = mainServerAppUrl + "/app-data";
    const formData = new FormData();
    formData.append("csvFile", file);
    axios
      .post(url, formData, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      })
      .then((response) => {
        toast.success("File Uploaded Successfully", { duration: 2000 });
        setIsModal(false);
        getOrgAppList(page);
      })
      .catch((err) => {
        toast.error("Please Upload a CSV File");
        console.log(err);
      });
  }

  async function total() {
    const applist = await axios.get(
      mainServerAppUrl + "/admin/get-app-data?pageSize=700&page=1"
    );
    const total = applist.data.totalApps.length;
    setTotalPage(Math.ceil(total / pageSize));
  }


  async function getOrgAppList(page) {
    const applist = await axios.get(
      mainServerAppUrl +
      "/admin/get-app-data?pageSize=" +
      pageSize +
      "&page=" +
      page
    );
    //console.log(applist)
    setAppData(applist.data.totalApps);
    total();
  }

  useEffect(() => {
    getOrgAppList(page);
  }, [page]);

  useEffect(() => {
    axios.get(mainServerAppUrl + "/admin/get-app-data?pageSize=700&page=1").then((res) => {
      setSuperAppData(res.data.totalApps);
    });
  }, []);

  function updateAppList(value) {
    setIsFormModal(true);
    setIAdd(true);
    setAppAndWebsite(value?.appAndWebsite);
    setURL(value?.URL);
    setEditId(value?._id);
    setType(value?.Type);
    setOrganization(value?.organization)
  }

  async function buttonUpdate(Type, value) {
    if (value.organization) {
      await axios
        .patch(mainServerAppUrl + "/admin/put-app-data/" + value._id, {
          _id: value?._id,
          appAndWebsite: value?.appAndWebsite,
          URL: value?.URL,
          Type: Type,
          isDeleted: false,
        })
        .then(() => {
          getOrgAppList(page);
        });
    } else {
      await axios
        .post(mainServerAppUrl + "/admin/single-app-data", {
          _id: value?._id,
          appAndWebsite: value?.appAndWebsite,
          URL: value?.URL,
          Type: Type,
          organization: getAuthUser()?.organization,
          isDeleted: false,
          default: false,
          new_app: true
        })
        .then(() => {
          getOrgAppList(page);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }

  async function deleteAppList(value) {
    await axios
      .delete(mainServerAppUrl + "/admin/delete-org-app-data/" + value._id)
      .then(getOrgAppList())
      .catch((err) => console.log(err));
  }

  async function softDeleteAppList(value) {
    setDeleteModal(true);
    setAppAndWebsite(value?.appAndWebsite);
    setURL(value?.URL);
    setType(value?.Type);
    setEditId(value?._id);
  }

  const createCsvFileName = () => `data_${moment().format()}.csv`;

  const headers = [
    { label: "URL", key: "URL" },
    { label: "appAndWebsite", key: "appAndWebsite" },
    { label: "Type", key: "Type" },
  ];

  let dataF = [];
  superAppData.forEach((item) => {
    dataF.push({
      Type: item.Type,
      URL: item.URL,
      appAndWebsite: item.appAndWebsite,
    });
  });

  return (
    <>
      <header className="page-header">
        <div className="flex-40">
          <h1>Productivity Settings</h1>
        </div>
        <div className="flex-60">
          <div className="d-flex justify-content-end align-items-center">
            {/* <div className="page-options d-flex">
                  
                    <select style={{ width: "200px", marginRight: "10px" }}
                      className="form-control"
                      //onChange={(e) => getAnomalyFilter(e)}
                      //value={selectedValue}
                    >
                      {appType?.map((data, index) => (
                        <option key={index} >
                          {data}
                        </option>
                      ))}
                    </select>
                </div> */}
            <CSVLink
              data={dataF}
              headers={headers}
              filename={createCsvFileName()}
              target="_blank"
              style={{ textDecoration: "none", outline: "none" }}
            >
              <button type="button" className="btn btn-primary mr-2">
                <i className="fa-solid fa-download mr-2"></i>Download CSV
              </button>
            </CSVLink>

            <button
              type="button"
              className="btn btn-primary mr-2"
              onClick={() => {
                setIsModal(true);
              }}
            >
              <i className="fa-solid fa-upload mr-2"></i>Upload CSV
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => {
                setIsFormModal(true);
              }}
            >
              <i className="fe fe-plus mr-2"></i>Add Data
            </button>
          </div>
        </div>
      </header>
      <div className="section-body">
        {appdata?.length > 0 ?
          <div className="table-responsive">
            <table className="table table-hover table-vcenter text-nowrap table_custom spacing8 mb-0">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Url</th>
                  <th>Type</th>
                  <th className="text-center">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {appdata?.map((value, index) => (
                  <tr key={index}>
                    <td className="text-wrap">{value?.default === true ? value?.appAndWebsite + " (Default)" : value?.appAndWebsite}</td>
                    <td>
                      <div
                        className="text-truncate"
                        style={{ width: "300px" }}
                      >
                        {value?.URL === "" ? "-" : value?.URL}
                      </div>
                    </td>
                    <td>
                      {/* {value?.Type} */}
                      <div className="row row-cards">
                        <div className="form-group m-0">
                          <div className="selectgroup w-100">
                            <label className="selectgroup-item">
                              <input
                                type="radio"
                                name={"Type" + index}
                                value="Productive"
                                className="selectgroup-input"
                                checked={value.Type === 1 ? true : false}
                                onChange={() => {
                                  buttonUpdate(1, value);
                                }}
                              />

                              <span className="selectgroup-button">
                                Productive
                              </span>
                            </label>
                            <label className="selectgroup-item">
                              <input
                                type="radio"
                                name={"Type" + index}
                                value="Unproductive"
                                className="selectgroup-input"
                                checked={value.Type === -1 ? true : false}
                                onChange={() => {
                                  buttonUpdate(-1, value);
                                }}
                              />

                              <span className="selectgroup-button">
                                Unproductive
                              </span>
                            </label>
                            <label className="selectgroup-item">
                              <input
                                type="radio"
                                name={"Type" + index}
                                value="Neutral"
                                className="selectgroup-input"
                                checked={value.Type === 0 ? true : false}
                                onChange={() => {
                                  buttonUpdate(0, value);
                                }}
                              />

                              <span className="selectgroup-button">
                                Neutral
                              </span>
                            </label>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="text-center">
                      <button
                        className="btn btn-icon"
                        onClick={() => updateAppList(value)}
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
                        className="btn btn-icon"
                        onClick={() => softDeleteAppList(value)}
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
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {appdata.length > 0 && (
              <div className="d-flex justify-content-center">
                <nav aria-label="Page navigation example">
                  <ul className="pagination">
                    <li className="page-item">
                      <a
                        className="page-link"
                        onClick={() => {
                          setPage(page <= 1 ? 1 : page - 1);
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
                        {page}/{totalPage}
                      </a>
                    </li>
                    <li className="page-item">
                      <a
                        className="page-link"
                        onClick={() => {
                          setPage(page == totalPage ? totalPage : page + 1);
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
          :
          <div className="no-data-found">
            <div className="card">
              <div className="card-body">
                <div className="no-data-image">
                  <svg style={{ filter: "opacity(0.5)" }} width="101" height="101" viewBox="0 0 32 33" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5.5 26.4482V17.4482H12.5" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M28.5 26.4482H3.5" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M12.5 26.4482V11.4482H19.5" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M26.5 5.44824H19.5V26.4482H26.5V5.44824Z" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <p>No Data Found</p>
              </div>
            </div>
          </div>
        }
      </div>

      {isModal && (
        <div
          className="modal d-block"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <form onSubmit={handleSubmit}>
            <div
              className="modal-dialog modal-dialog-centered modal-lg"
              role="document"
            >
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title" id="exampleModalLabel">
                    Upload CSV
                  </h5>
                  <button
                    type="button"
                    className="close"
                    data-dismiss="modal"
                    onClick={() => {
                      setIsModal(false);
                    }}
                    aria-label="Close"
                  >
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div className="modal-body">
                  <div className="form-group">
                    <label className="form-label">Upload CSV  <span className="required"><i className="fa-solid fa-star-of-life"></i></span></label>
                    <input
                      type="file"
                      name="csvFile"
                      className="form-control"
                      accept=".csv"
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="submit" className="btn btn-success  mr-2">
                    Upload
                  </button>
                  <button
                    type="reset"
                    className="btn btn-secondary"
                    data-dismiss="modal"
                    onClick={() => {
                      setIsModal(false);
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      )}
      {isFormModal && (
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
                  {isAdd === false ? "Add Data" : "Edit Data"}
                </h5>
                <button
                  type="button"
                  className="close"
                  data-dismiss="modal"
                  onClick={() => {
                    setIsFormModal(false);
                    setIAdd(false);
                    setType("");
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
                validationSchema={addFormValidation}
                initialValues={{
                  appAndWebsite: isAdd ? appAndWebsite : "",
                  URL: isAdd ? URL : "",
                  //Type:isAdd?Type:""
                }}
                onSubmit={(fields, { resetForm }) => {
                  let finalValues = {
                    ...fields,
                    Type: Type ? Type : 1,
                  };
                  //console.log(finalValues);
                  if (isAdd === false) {
                    axios
                      .post(
                        mainServerAppUrl + "/admin/single-app-data",
                        {
                          ...finalValues,
                          organization: getAuthUser().organization
                        }
                      )
                      .then((response) => {
                        //console.log(response.data);
                        getOrgAppList(page);
                        toast.success("Data Added Successfully", {
                          id: "data added",
                          duration: 5000,
                        });
                        toast.dismiss("Data Deleted")
                        setIsFormModal(false);
                      })
                      .catch((err) => {
                        console.log(err);
                        if (err) {
                          toast.error(
                            "Data not added. App, Website or URL Already Exists.",
                            { duration: 5000 }
                          );
                        }
                      });
                  } else {
                    let editFields = {
                      ...finalValues,
                      _id: editId,
                      default: false,
                      organization: organization,
                      Type:Type,
                    };
                    updateAppList(editFields);
                    if (!editFields.organization) {
                      axios
                        .post(
                          mainServerAppUrl + "/admin/single-app-data",
                          editFields
                        )
                        .then(() => {
                          // toast.success("Edited Successfully", {
                          //   duration: 5000,
                          // });
                          setIsFormModal(false);
                          setIAdd(false);
                          getOrgAppList(page)
                        })
                        .catch((err) => {
                          toast.error("There was an error!");
                          console.log(err);
                        });
                    } else {
                      axios
                        .patch(
                          mainServerAppUrl +
                          "/admin/put-app-data/" +
                          editFields._id,
                          {
                            //_id: editFields._id,
                            appAndWebsite: editFields.appAndWebsite,
                            URL: editFields.URL,
                            Type: editFields.Type,
                            organization: editFields.organization,
                          }
                        )
                        .then(() => {
                          toast.success("Edited Successfully", {
                            id: "edited",
                            duration: 5000,
                          });
                          setIsFormModal(false);
                          setIAdd(false);
                          setType("");
                          getOrgAppList(page);
                        });
                    }
                  }
                }}
                render={({ errors, status, touched }) => (
                  <Form>
                    <div className="modal-body">
                      <div className="row">
                        <div className="col-sm-6 col-md-4">
                          <div className="form-group">
                            <label className="form-label">Name  <span className="required"><i className="fa-solid fa-star-of-life"></i></span></label>
                            <Field
                              name="appAndWebsite"
                              type="text"
                              className={
                                "form-control" +
                                (errors.appAndWebsite && touched.appAndWebsite
                                  ? " is-invalid"
                                  : "")
                              }
                            />
                            <ValidationMessage name="appAndWebsite" />
                          </div>
                        </div>
                        <div className="col-sm-6 col-md-4">
                          <div className="form-group">
                            <label className="form-label">URL</label>
                            <Field
                              name="URL"
                              type="text"
                              className={
                                "form-control" +
                                (errors.URL && touched.URL ? " is-invalid" : "")
                              }
                            />
                            <ValidationMessage name="URL" />
                          </div>
                        </div>
                        <div className="col-sm-6 col-md-4">
                          <div className="form-group">
                            <div className="form-label">Type  <span className="required"><i className="fa-solid fa-star-of-life"></i></span></div>
                            <div className="custom-controls-stacked">
                              <label className="custom-control custom-radio custom-control-inline">
                                <input
                                  type="radio"
                                  className="custom-control-input"
                                  name="example-inline-radios"
                                  value={1}
                                  defaultChecked={!isAdd ? true : Type === 1 ? true : false}
                                  // checked={isAdd ? Type : Type===1 }
                                  onChange={(e) => {
                                    setType(e.target.value);
                                  }}
                                />
                                <span className="custom-control-label">
                                  Productive
                                </span>
                              </label>
                              <label className="custom-control custom-radio custom-control-inline">
                                <input
                                  type="radio"
                                  className="custom-control-input"
                                  name="example-inline-radios"
                                  value={-1}
                                  // checked={isAdd ? Type : Type===0 }
                                  defaultChecked={Type === -1 ? true : false}
                                  onChange={(e) => {
                                    setType(e.target.value);
                                  }}
                                />
                                <span className="custom-control-label">
                                  Unproductive
                                </span>
                              </label>
                              <label className="custom-control custom-radio custom-control-inline">
                                <input
                                  type="radio"
                                  className="custom-control-input"
                                  name="example-inline-radios"
                                  value={0}
                                  //checked={isAdd ? Type : Type===2 }
                                  defaultChecked={Type === 0 ? true : false}
                                  onChange={(e) => {
                                    setType(e.target.value);
                                  }}
                                />
                                <span className="custom-control-label">
                                  Neutral
                                </span>
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="modal-footer">
                      <button type="submit" className="btn btn-success  mr-2">
                        {isAdd === false ? "Add" : "Save"}
                      </button>
                      <button
                        type="reset"
                        className="btn btn-secondary"
                        data-dismiss="modal"
                        onClick={() => {
                          setIsFormModal(false);
                          setIAdd(false);
                          setType("");
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
                  <span className="text-red">{appAndWebsite}</span> Application
                </strong>
                <p
                  className="text-secondary"
                  style={{ fontSize: "14px", fontWeight: "600" }}
                >
                  This will delete your application or website from Application
                  list <br />
                  Are you sure ?
                </p>
                <div className="delete-footer">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    onClick={() => {
                      axios
                        .patch(
                          mainServerAppUrl +
                          "/admin/soft-delete-org-app-data/" +
                          editId,
                          {
                            appAndWebsite: appAndWebsite,
                            URL: URL,
                            Type: Type,
                            isDeleted: true,
                          }
                        )
                        .then(() => {
                          toast.success("Deleted Successfully", {
                            id: "Data Deleted",
                            duration: 5000,
                          });
                          toast.dismiss("data added")
                          getOrgAppList(page);
                        })
                        .catch((error) => {
                          console.log(error);
                        });
                      setDeleteModal(false);
                    }}
                  >
                    Delete
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
    </>
  );
}

export default OrgAppList;
