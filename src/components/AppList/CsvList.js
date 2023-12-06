import axios from "axios";
import React, { Fragment, useEffect, useState } from "react";
import { mainServerAppUrl } from "./../../apis/mainapi";
import toast from "react-hot-toast";
import { Formik, Field, Form } from "formik";
import ValidationMessage from "./../common/ValidationMessage";
import { addFormValidation } from "../Authentication/model/ValidationSchema";
import ReactTooltip from "react-tooltip";
import Loaders from "../Loaders/Loaders";

function CsvList({ fixNavbar }) {
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
  const [isDeleteModal, setDeleteModal] = useState(false);

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
        toast.success("File Uploaded Successfully", { duration: 5000 });
        setIsModal(false);
        getAppList(page);
        window.location.reload()
      })
      .catch((err) => {
        toast.error("Please Upload a CSV file", { duration: 5000 });
        console.log(err);
      });
  }
  async function total() {
    const applist = await axios.get(mainServerAppUrl + "/admin/get-app-data?pageSize=700&page=1");
    const total = applist?.data?.totalApps?.length;
    setTotalPage(Math.ceil(total / pageSize));
  }


  async function getAppList(page) {
    const applist = await axios.get(
      mainServerAppUrl + "/admin/get-app-data?pageSize=" + pageSize + "&page=" + page
    );

    setAppData(applist?.data?.totalApps);
    total();
  }
  useEffect(() => {
    getAppList(page);
  }, [page]);

  function updateAppList(value) {
    setIsFormModal(true);
    setIAdd(true);
    setAppAndWebsite(value?.appAndWebsite);
    setURL(value?.URL);
    setEditId(value?._id);
    setType(value?.Type);
  }

  async function buttonUpdate(Type, value) {
    await axios
      .patch(mainServerAppUrl + "/admin/put-app-data/" + value._id, {
        _id: value._id,
        appAndWebsite: value?.appAndWebsite,
        URL: value.URL,
        Type: Type,
      })
      .then(() => {
        getAppList(page);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  async function softDeleteAppList(value) {
    setDeleteModal(true);
    setAppAndWebsite(value?.appAndWebsite);
    setURL(value?.URL);
    setType(value?.Type);
    setEditId(value?._id);
  }

  async function deleteAppList(value) {
    await axios
      .delete(mainServerAppUrl + "/admin/delete-app-data/" + value._id)
      .then(getAppList(page));
  }

  return (
    <>
      <header className="page-header">
        <div className="flex-40">
          <h1>Default Application List</h1>
        </div>
        <div className="flex-60">
          <div className="d-flex justify-content-end align-item-center">
            <button
              type="button"
              className="btn btn-primary  mr-2"
              onClick={() => {
                setIsModal(true);
              }}
            >
              <i className="fa-solid fa-upload  mr-2"></i>Upload CSV
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
                  <th className="text-center"></th>
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
                    <td></td>
                    <td className="text-wrap">{value?.appAndWebsite}</td>
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
                                checked={value?.Type === 1 ? true : false}
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
                                checked={value?.Type === -1 ? true : false}
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
                                checked={value?.Type === 0 ? true : false}
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
                    <td>
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
            {appdata?.length > 0 && (
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
                <i className="fa fa-file" />
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
                    <label className="form-label"></label>
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
                  <button
                    type="reset"
                    className="btn btn-secondary mr-2"
                    data-dismiss="modal"
                    onClick={() => {
                      setIsModal(false);
                    }}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Upload
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
                      .post(mainServerAppUrl + "/admin/single-app-data", finalValues)
                      .then((response) => {
                        //console.log(response.data);
                        getAppList(page);
                        toast.success("Data Added Successfully", {
                          duration: 5000,
                        });
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
                      Type: Type,
                    };
                    updateAppList(editFields);
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
                        }
                      )
                      .then(() => {
                        toast.success("Edited Successfully", {
                          id: "edit success",
                          duration: 5000,
                        });
                        setIsFormModal(false);
                        setIAdd(false);
                        setType("");
                        getAppList(page);
                      });
                  }
                }}
                render={({ errors, status, touched }) => (
                  <Form>
                    <div className="modal-body">
                      <div className="row">
                        <div className="col-sm-6 col-md-4">
                          <div className="form-group">
                            <label className="form-label">Name <span className="required"><i className="fa-solid fa-star-of-life"></i></span></label>
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
                            <div className="form-label">Type <span className="required"><i className="fa-solid fa-star-of-life"></i></span></div>
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
                      <button
                        type="reset"
                        className="btn btn-secondary mr-2"
                        data-dismiss="modal"
                        onClick={() => {
                          setIsFormModal(false);
                          setIAdd(false);
                          setType("");
                        }}
                      >
                        Cancel
                      </button>
                      <button type="submit" className="btn btn-primary">
                        {isAdd === false ? "Add" : "Save"}
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
                  <span>
                    <i className="fa fa-trash" />
                  </span>
                </div>
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
              </div>
              <div className="modal-footer">
                <button
                  type="submit"
                  className="btn btn-secondary"
                  onClick={() => {
                    axios
                      .patch(
                        mainServerAppUrl +
                        "/admin/soft-delete-app-data/" +
                        editId,
                        {
                          appAndWebsite: appAndWebsite,
                          URL: URL,
                          Type: Type,
                          isDeleted: true,
                        }
                      )
                      .then((response) => {
                        toast.success("Deleted Successfully", {
                          duration: 5000,
                        });
                        getAppList(page);
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
                  className="btn btn-primary mr-2"
                  data-dismiss="modal"
                  onClick={() => setDeleteModal(false)}
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

export default CsvList;
