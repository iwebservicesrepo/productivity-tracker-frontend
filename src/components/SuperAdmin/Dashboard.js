import React, { useEffect, useState } from "react";
import { mainServerAppUrl } from "./../../apis/mainapi";
import axios from "axios";
import Loaders from "../Loaders/Loaders";
import ReactTooltip from "react-tooltip";
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux'
import { deleteOrgData, getAllOrganizationData } from "../../ReduxStore/actions/userAction";

export default function Dashboard({ fixNavbar }) {

  const dispatch = useDispatch();
  const history = useHistory();
  const { allOrgList, isLoader } = useSelector(
    (state) => state.userReducer
  );
  const data = allOrgList;
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalPage, setTotalPage] = useState(1);
  const [isLoad, setIsLoad] = useState(false)
  console.log(isLoad);

  useEffect(() => {
    dispatch(getAllOrganizationData(page, pageSize))
    total()
  }, [dispatch, page, pageSize]);

  useEffect(()=>{
    data?.orgData?.length>0 ? setIsLoad(true) : setIsLoad(false)
  },[data])
  

  const total = async () => {
    const userList = await axios.get(mainServerAppUrl + "/admin/all-organizations");
    //console.log(userList);
    const total = userList.data.orgData.length;
    setTotalPage(Math.ceil(total / pageSize));
  }

  const deleteHandler = (id) => {
    dispatch(deleteOrgData(id))
  }


  return (
    <>
      <header className="page-header">
        <div className="flex-40">
          <h1>Dashboard</h1>
        </div>
        <div className="flex-60">
          <div className="d-flex justify-content-end align-item-center">

          </div>
        </div>
      </header>
      <div className={`section-body ${fixNavbar ? "marginTop" : ""}`}>
        <div className="container-fluid">
          {isLoader === true ? <Loaders /> :
            data?.orgData?.length > 0 ? (
              <>
                <div className="row clearfix">
                  <div className="col-md-3 col-3">
                    <div className="card">
                      <div className="card-body w_social_state">
                        <div className="icon">
                          <i className="fa fa-building" />
                        </div>
                        <div className="content">
                          <h5 className="text" style={{ fontWeight: 400 }}>Organization
                            <span data-tip data-for='Organization'><i className="fa-solid fa-circle-info"></i></span>
                            <ReactTooltip effect="solid" id='Organization' aria-haspopup='true' role='Organization'>
                              This count represents the all the organization
                            </ReactTooltip>
                          </h5>
                          <h4 className="number">{data?.totalNumOrg}</h4>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-3 col-3">
                    <div className="card">
                      <div className="card-body w_social_state">
                        <div className="icon">
                          <i className="fa fa-users text-primary" />
                        </div>
                        <div className="content">
                          <h5 className="text" style={{ fontWeight: 400 }}>Users
                            <span data-tip data-for='Users'><i className="fa-solid fa-circle-info"> </i></span>
                            <ReactTooltip effect="solid" id='Users' aria-haspopup='true' role='Users'>
                              This count represents the all user of the all organization
                            </ReactTooltip>
                          </h5>
                          <h4 className="number">{data?.allUserCount}</h4>
                        </div>
                      </div>

                    </div>
                  </div>
                  <div className="col-md-3 col-3">
                    <div className="card">
                      <div className="card-body w_social_state form-group">
                        <div className="icon">
                          <i className="fa fa-users text-green" />
                        </div>
                        <div className="content">
                          <h5 className="text" style={{ fontWeight: 400 }}>Active Users
                            <span data-tip data-for='activeUsers'><i className="fa-solid fa-circle-info"></i></span>
                            <ReactTooltip effect="solid" id='activeUsers' aria-haspopup='true' role='activeUsers'>
                              This count represents the all Active user of the all organization
                            </ReactTooltip>
                          </h5>
                          <h4 className="number">{data?.allActiveUsers}</h4>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-3 col-3">
                    <div className="card">
                      <div className="card-body w_social_state form-group">
                        <div className="icon">
                          <i className="fa fa-user-times text-red" />
                        </div>
                        <div className="content">
                          <h5 className="text" style={{ fontWeight: 400 }}>Inactive Users
                            <span data-tip data-for='inactiveUsers'><i className="fa-solid fa-circle-info" ></i></span>
                            <ReactTooltip effect="solid" id='inactiveUsers' aria-haspopup='true' role='inactiveUsers'>
                              This count represents the all inactive user of the all organization
                            </ReactTooltip>
                          </h5>
                          <h4 className="number">{data?.allInactiveUsers}</h4>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row row-cards department-list">
                  <div className="table-responsive">
                    <table className="table table-hover table-vcenter text-nowrap table_custom spacing8 mb-0">
                      <thead>
                        <tr>
                          <th width="20%">Organization Name</th>
                          <th width="20%">Email</th>
                          <th width="10%">Phone No</th>
                          <th>Users</th>
                          <th>Active</th>
                          <th>Inactive</th>
                          <th>Departments</th>
                          <th width="20%">address</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        { isLoad===false ?<tr>
                          <td className="text-center" colSpan={9}><div className="loader" style={{margin: "0 auto"}}></div></td></tr> :
                        data?.orgData?.map((item, index) => (
                          <tr key={index}  style={{ cursor: "pointer" }}>
                            <td className="text-capitalize">{item?.name}</td>
                            <td>{item?.email}</td>
                            <td>{item?.countryCode + item?.phone}</td>
                            <td>
                              <div
                                className="alert alert-primary"
                              >
                                {item?.totalNumUser}
                              </div>
                            </td>
                            <td>
                            <div
                                className="alert alert-primary"
                              >
                                {item?.totalActiveUser}
                              </div>
                            </td>
                            <td>
                            <div
                                className="alert alert-primary"
                              >
                                {item?.totalInActiveUser}
                              </div>
                            </td>
                            <td>
                            <div
                                className="alert alert-primary"
                              >
                                {item?.departmantName.length}
                              </div>
                            </td>
                            <td className="text-wrap">{item?.address}</td>
                            <td>
                              <button className="btn btn-icon" onClick={() => history.push(
                            {
                              pathname: '/organizationDetails',
                              search: item?._id,
                            }
                          )}><i className="fa fa-eye text-green"></i></button>
                              <button className="btn btn-icon" onClick={() => deleteHandler(item?._id)}><i className="fa fa-trash-alt text-red"></i></button></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {data?.orgData?.length > 0 && (
                      <div className="d-flex justify-content-center">
                        <nav aria-label="Page navigation example">
                          <ul className="pagination">
                            <li className="page-item">
                              <a
                                className="page-link"
                                onClick={() => {
                                  setPage(page <= 0 ? 0 : page - 1);
                                  setIsLoad(false)
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
                                  setIsLoad(false)
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
                </div>
              </>
            ) : (
              <Loaders />
            )}
        </div>
      </div>
    </>
  );
}
