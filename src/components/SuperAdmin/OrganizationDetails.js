import React, { useState, useEffect } from 'react'
import Loaders from '../Loaders/Loaders'
import { useLocation, useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux'
import ReactTooltip from 'react-tooltip';
import { getOrganizationDetailPage } from '../../ReduxStore/actions/userAction';



export default function OrganizationDetails({ fixNavbar }) {
    const history = useHistory();
    const location = useLocation();
    const dispatch = useDispatch();

    const { orgList, loader } = useSelector(
        (state) => state.userReducer
    );

    const [userId, setUserId] = useState(location?.search);
    const data = orgList;
    const orgId = userId.replace('?', '');

    useEffect(() => {
        dispatch(getOrganizationDetailPage(orgId))
    }, [dispatch, orgId])

    return (
        <>
            <header className="page-header">
                <div className="flex-40">
                    <h1>Organization Details</h1>
                </div>
                <div className="flex-60">
                    <div className="d-flex justify-content-end align-item-center">
                        <button
                            type="button"
                            className="btn btn-primary"
                            onClick={() => { history.push('/superAdminDashboard') }}
                        >
                            <i className="fa fa-chevron-left mr-2"></i>Back
                        </button>
                    </div>
                </div>
            </header>

            <div className={`section-body ${fixNavbar ? "marginTop" : ""}`}>
                {loader === true ? <Loaders /> :
                    data?.allUsers?.length > 0 ? (
                        <>
                            <div className="row clearfix">
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
                                                        This count represents the all user of the  organization
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
                                                        This count represents the all Active user of the organization
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
                                                        This count represents the all inactive user of the organization
                                                    </ReactTooltip>
                                                </h5>
                                                <h4 className="number">{data?.allInactiveUsers}</h4>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-3 col-3">
                                    <div className="card">
                                        <div className="card-body w_social_state">
                                            <div className="icon">
                                                <i className="fa fa-building" />
                                            </div>
                                            <div className="content">
                                                <h5 className="text" style={{ fontWeight: 400 }}>Departments
                                                    <span data-tip data-for='Organization'><i className="fa-solid fa-circle-info"></i></span>
                                                    <ReactTooltip effect="solid" id='Organization' aria-haspopup='true' role='Organization'>
                                                        This count represents the organization
                                                    </ReactTooltip>
                                                </h5>
                                                <h4 className="number">{data?.totalDepartments}</h4>
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
                                                <th className="text-center w-1">
                                                    <i className="icon-people" />
                                                </th>
                                                <th width="20%">User Name</th>
                                                <th width="20%">Email</th>
                                                <th width="10%">Status</th>
                                                <th>Role</th>
                                                <th>Departments</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {data?.allUsers?.map((item, index) => (
                                                <tr key={index}>
                                                    <td className="text-center">
                                                        <div className="avatar d-block">
                                                            <img
                                                                className="rounded-circle"
                                                                src="../assets/images/xs/avatar7.jpg"
                                                                alt="avatar"
                                                            />
                                                        </div>
                                                    </td>
                                                    <td className="text-capitalize">{item?.firstName + " " + item?.lastName}</td>
                                                    <td>{item?.email}</td>
                                                    <td className="text-capitalize">
                                                        <span className={item?.status === "active" ? "badge bg-success p-2" : "badge bg-danger p-2"}>
                                                            {item?.status === "active" ? "active" : "inactive"}
                                                        </span>
                                                    </td>
                                                    <td className="text-capitalize">
                                                        <span
                                                            className="badge badge-primary p-2"
                                                        >{item?.role?.role}
                                                        </span>
                                                    </td>
                                                    <td className="text-capitalize">
                                                        {item?.departments.length > 0 ? item?.departments?.map((value, index) =>
                                                            <span
                                                                key={index}
                                                                className="badge badge-primary mr-2 p-2"
                                                            >
                                                                {value?.department?.dname}
                                                            </span>
                                                        ) : "-"}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="no-data-found">
                            <div className="card">
                                <div className="card-body">
                                    <i className="fa fa-file" />
                                    <p>No Data Found</p>
                                </div>
                            </div>
                        </div>
                    )}
            </div>
        </>
    )
}
