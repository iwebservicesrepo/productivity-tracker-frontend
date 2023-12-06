import React, { useEffect, useState } from 'react';
// import CountUp from 'react-countup';
// import html2canvas from 'html2canvas';
// import { jsPDF } from "jspdf";
import { useDispatch, useSelector } from 'react-redux';
import { getUser } from '../../ReduxStore/actions/userAction';
import { getAdminData } from '../../ReduxStore/actions/dashboardAction';
import moment from 'moment';
import Loaders from './../Loaders/Loaders';

const date = Date.now()
let currentDate = moment(date).utc().format('YYYY-MM-DD');
export default function AdminDashboard({ fixNavbar }) {
    const dispatch: any = useDispatch();

    const organization = useSelector((state: any) => state.loginReducers?.allData);

    const { userList } = useSelector(
        (state: any) => state.userReducer
    );

    const { adminData, loader } = useSelector(
        (state: any) => state.adminReducers
    );

    const durationArray = [1, 3, 6, 12];

    // const [values, setValues]: any = useState([
    //     new DateObject(),
    //     new DateObject()
    // ])

    const [type, setType] = useState(false);
    const [isLoader, setIsLoader] = useState(false);
    const [customDateColor, setCustomDateColor] = useState("");

    const nowdate = moment().format("YYYY-MM-DD")

    useEffect(() => {
        let feilds = { duration: 1, end_date: null, org_id: organization?.organization?._id, start_date: null, type: "hour" }
        dispatch(getUser());
        dispatch(getAdminData(feilds))
        const interval = setInterval(() => {
            window.location.reload();
        }, 300000);
        return () => clearInterval(interval);
    }, [dispatch, organization?.organization?._id]);

    useEffect(() => {
        if (adminData) {
            setIsLoader(false)
        }
        else {
            setIsLoader(true)
        }
    }, [adminData])

    var getInitials = function (string) {
        var names = string.split(' '),
            initials = names[0].substring(0, 1).toUpperCase();

        if (names.length > 1) {
            initials += names[names.length - 1].substring(0, 1).toUpperCase();
        }
        return initials;
    };

    const hoursHandler = (e) => {
        const value = e.target.value;
        setCustomDateColor(e.target.value)
        if (value === "Custom Date") {
            setType(true)
        }
        else {
            setType(false)
            let feilds = { duration: Number(value), end_date: null, org_id: organization?.organization?._id, start_date: null, type: "hour" };
            dispatch(getAdminData(feilds))
            setIsLoader(true)
        }
    }

    const dateHandler = (e) => {
        const dateValue = e.target.value;
        let tomorrow = moment(dateValue).add(1, 'days').startOf('day').format();
        let feilds = {
            duration: null,
            start_date: moment(dateValue).startOf('day').format() ,
            end_date: tomorrow,
            org_id: organization?.organization?._id,
            type: "date",
        }
        dispatch(getAdminData(feilds))
        setIsLoader(true)
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
                <div className="counter-wrapper">
                    <ul className="counter-list">
                        <li className="col-md-3">
                            <div className="counter-div">
                                <h1>Total Users</h1>
                                {userList?.length > 0 ? (
                                    <p>{userList?.length}</p>
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
                        <li className="col-md-3">
                            <div className="counter-div">
                                <h1>Active Users</h1>
                                {adminData?.active_users ? (
                                    <p>{adminData?.active_users}</p>
                                ) : (
                                    <p className="text-light">Data not available</p>
                                )}
                                <div className="counter-icon">
                                    <img
                                        src={require("../../images/UserCounter.png")}
                                        alt=""
                                    />
                                </div>
                            </div>
                        </li>
                        <li className="col-md-3">
                            <div className="counter-div">
                                <h1>Productive Time</h1>
                                {adminData?.productive_time ?
                                    <p style={{color:"#45c309"}}>{adminData?.productive_time?.hours}<small style={{fontSize:"20px", color:"black"}}>h </small>{adminData?.productive_time?.minutes}<small style={{fontSize:"20px", color:"black"}}>m</small></p>
                                    :
                                    <p className="text-light">Data not available</p>
                                }

                                <div className="counter-icon">
                                    <img
                                        src={require("../../images/ChartPieSliceCounter.png")}
                                        alt=""
                                    />
                                </div>
                            </div>
                        </li>
                        <li className="col-md-3">
                            <div className="counter-div">
                                <h1>Non-Productive Time</h1>
                                {adminData?.unproductive_time ?
                                    <p style={{color:"#ff4646"}}>{adminData?.unproductive_time?.hours}<small style={{fontSize:"20px", color:"black"}}>h </small>{adminData?.unproductive_time?.minutes}<small style={{fontSize:"20px", color:"black"}}>m</small></p>
                                    :
                                    <p className="text-light">Data not available</p>
                                }
                                <div className="counter-icon">
                                    <img
                                        src={require("../../images/ChartPieSliceCounter.png")}
                                        alt=""
                                    />
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
                <div className="adminDashboard-filter">
                    <h1>Productivity Overview For</h1>
                    <select className="form-control custom-form-control text-green" 
                        onChange={(e) => hoursHandler(e)} style={{cursor:"pointer"}}>
                        {durationArray.map((data, index) => <option className="text-dark" key={index} value={data}>{data === 1 ? "Last Hour" : data + " Hours"}</option>
                        )}
                        <option className="text-dark" value="Custom Date">Custom Date</option>
                    </select>
                    {type === true ?
                        <input
                            type="date"
                            className="form-control"
                            max={currentDate}
                            onChange={(e) => dateHandler(e)}
                            name="start_date"
                            style={{ width: "200px", marginRight: "10px", fontSize: "12px" }}
                        />
                        : ""
                    }
                </div>
                {
                    isLoader ?
                        <Loaders />
                        :
                        adminData?.app_list?.length > 0 || adminData?.productive_users?.length > 0 || adminData?.unproductive_users?.length > 0 ?
                            <>
                                <div className="row clearfix admin-dashboard">
                                    <div className="col-lg-4 col-md-6">
                                        <div className="card mb-0" style={{ height: "100%" }}>
                                            <div className="card-header">
                                                <h3 className="card-title">Top 5 Productive Users</h3>
                                            </div>
                                            <div className="card-body">
                                                {adminData?.productive_users?.length > 0 ?
                                                    <ul className="right_chat list-unstyled">
                                                        {adminData?.productive_users?.map((user, index) =>
                                                            <li className="online" key={index}>
                                                                <a>
                                                                    <div className="media">
                                                                        <div className="media-object">
                                                                            {getInitials(user?.firstName)}
                                                                        </div>
                                                                        <div className="media-body">
                                                                            <span className="name">{user?.firstName}{" "}{user?.lastName}</span>
                                                                            <span className="message">{user?.email}</span>
                                                                        </div>
                                                                    </div>
                                                                </a>
                                                            </li>
                                                        )}
                                                    </ul>
                                                    :
                                                    "No Productive Users Found"
                                                }
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-lg-4 col-md-6">
                                        <div className="card mb-0" style={{ height: "100%" }}>
                                            <div className="card-header">
                                                <h3 className="card-title">Top 5 Non-Productive Users</h3>
                                            </div>
                                            <div className="card-body">
                                                {adminData?.unproductive_users?.length > 0 ?
                                                    <ul className="right_chat list-unstyled">
                                                        {adminData?.unproductive_users?.map((Uuser, index) =>
                                                            <li className="online" key={index}>
                                                                <a>
                                                                    <div className="media">
                                                                        <div className="media-object">
                                                                            {getInitials(Uuser?.firstName)}
                                                                        </div>
                                                                        <div className="media-body">
                                                                            <span className="name">{Uuser?.firstName}{" "}{Uuser?.lastName}</span>
                                                                            <span className="message">{Uuser?.email}</span>
                                                                        </div>
                                                                    </div>
                                                                </a>
                                                            </li>
                                                        )}
                                                    </ul>
                                                    :
                                                    "No Unproductive Users found"
                                                }
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-lg-4 col-md-6">
                                        <div className="card mb-0" style={{ height: "100%" }}>
                                            <div className="card-header">
                                                <h3 className="card-title">Top 5 Apps</h3>
                                            </div>
                                            <div className="card-body">
                                                {adminData?.app_list?.length > 0 ?
                                                    <table className="table card-table">
                                                        <tbody>
                                                            {adminData?.app_list?.map((data, index) =>
                                                                <tr key={index}>
                                                                    <td className="width45"><img src={`https://t0.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${data}/&size=64`} /></td>
                                                                    <td>{data}</td>
                                                                </tr>
                                                            )}
                                                        </tbody>
                                                    </table>
                                                    :
                                                    "No App Data Found"
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </>
                            :
                            <div className="no-data-found">
                                <div className="card">
                                    <div className="card-body">
                                        <div className="no-data-image">
                                            <svg width="101" height="101" viewBox="0 0 101 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M10.3022 72.8099V63.8646C10.3022 41.4036 28.3491 22.888 50.771 22.8099C56.1191 22.7893 61.4186 23.8249 66.3655 25.8573C71.3124 27.8897 75.8093 30.8788 79.5983 34.6533C83.3872 38.4277 86.3936 42.9131 88.445 47.8522C90.4963 52.7912 91.5523 58.0867 91.5522 63.4349V72.8099C91.5522 73.6387 91.223 74.4335 90.637 75.0196C90.0509 75.6056 89.256 75.9349 88.4272 75.9349H13.4272C12.5984 75.9349 11.8036 75.6056 11.2175 75.0196C10.6315 74.4335 10.3022 73.6387 10.3022 72.8099Z" stroke="#ABABAB" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                                                <path d="M50.9272 22.8096V35.3096" stroke="#ABABAB" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                                                <path d="M11.6694 52.9277L23.7788 56.1699" stroke="#ABABAB" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                                                <path d="M90.1851 52.9277L78.0757 56.1699" stroke="#ABABAB" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                                                <path d="M41.3174 75.9336L68.0361 41.1289" stroke="#ABABAB" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                                                <rect x="74.4044" y="15.1015" width="7" height="89.9129" rx="3.5" transform="rotate(37.1532 74.4044 15.1015)" fill="#ABABAB" stroke="white" strokeWidth="3" />
                                            </svg>
                                        </div>
                                        <p>No Data Found</p>
                                    </div>
                                </div>
                            </div>
                }
            </div>
        </>
    )
}
