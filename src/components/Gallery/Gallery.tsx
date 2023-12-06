/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from 'react'
import { connect, useDispatch, useSelector } from 'react-redux';
// import Pagination from './Pagination';
import Viewer from 'react-viewer';
// import _ from 'underscore';
import { getDepartmentList, getImageData, getUserData } from '../../ReduxStore/actions/galleryAction';
// import Loaders from '../Loaders/Loaders';
import moment from "moment";
import LazyLoadingGallery from '../Loaders/LazyLoadingGallery';
import InfiniteScroll from "react-infinite-scroll-component";
import { getAuthUser } from '../Authentication/authHelpers';
import { getAllUsers, getUser } from './../../ReduxStore/actions/userAction';
import _ from 'underscore';
import { mainServerAppUrl } from '../../apis/mainapi';
import axios from 'axios';
import Header from "../Shared/Header";
import Loaders from '../Loaders/Loaders';

const bgGray = { background: "gray", color: "white" }
const bgTransparent = { background: "transparent", color: "initial" }

const Gallery = (props) => {
  const { fixNavbar } = props;
  const { plan_type } = useSelector((state: any) => state?.loginReducers?.subscriptionplans);
  const permissions = useSelector((state: any) => state?.loginReducers?.allData);
  let screenshots = permissions?.role?.permissions?.access?.screenshots;

  const dispatch: any = useDispatch();

  const date = Date.now()
  let currentDate = moment(date).utc().format('YYYY-MM-DD');

  let { galleryData, loader, lastValue, departmentList, imageSuccess } = useSelector((state: any) => state?.galleryReducers)
  const { allUserList } = useSelector((state: any) => state?.userReducer);
  const userList = allUserList
  const [data, setData] = useState([]);

  const thirdArray = departmentList?.filter((elem) => {
    return getAuthUser()?.departmentId?.some((ele) => {
      return ele?.department === elem?._id
    });
  });
  departmentList = permissions?.role?.role === "manager" ? thirdArray : departmentList;


  const [defaultUser, setDefaultUser] = useState("");
  const [isChecked, setIsChecked] = useState(false);
  const [activeIndex, setActiveIndex]: any = useState();
  const [recordsPerPage] = useState(9);
  const [visible, setVisible] = useState(false);
  const [dDate, setDDate] = useState(currentDate);
  const [filterData, setFilterData] = useState([]);
  const [hasMore, setHasMore] = useState(false);
  const [getDepartment, setGetDepartment] = useState("");
  const [userLists, setUserList] = useState([]);
  const [showToggle, setShowToggle] = useState([]);
  const [dataType] = useState(["All Data", "Unproductive", "Productive", "Neutral"])
  const [selectedValue, setSelectedValue] = useState("");
  const [isMultiDelete, setIsMultiDelete] = useState(false)
  const [deleteData, setDeleteData] = useState([]);
  const [validation, setValidation] = useState(false)
  const [useValid, setUserValid] = useState(false)


  let userListMap = userLists;

  let sortedData = data.sort(function (a, b) {
    return Number(new Date(b?.dateNTime === null ? b?.LastModified : b?.dateNTime)) - Number(new Date(a?.dateNTime === null ? a?.LastModified : a?.dateNTime))
  })

  const item = { currentDate: dDate ? dDate : currentDate, userId: defaultUser }

  useEffect(() => {
    setData([...galleryData]);
    setFilterData(oldArray => [...oldArray, ...galleryData])
    setShowToggle(oldArray => [...oldArray, ...galleryData])
    setDeleteData(oldArray => [...oldArray, ...galleryData])
    if (imageSuccess === true) {
      setHasMore(true)
    }
    else {
      setHasMore(false)
    }
  }, [galleryData, imageSuccess])

  useEffect(() => {
    setData([])
    setFilterData([])
    dispatch(getAllUsers())
    dispatch(getDepartmentList())
    setHasMore(false)
  }, [dispatch])

  const fetchMoreData = () => {

    let items = { ...item, last: lastValue }
    dispatch(getImageData(items))
  }

  const clearFilter = (e) => {
    e.preventDefault();
    setDDate(currentDate)
    setData([]);
    setDefaultUser("")
    setValidation(false)
    setUserValid(false)
    setHasMore(false)
    setFilterData([]);
    setIsChecked(false)
    setGetDepartment("")
    setShowToggle([])
  }

  const filterByDate = (e) => {
    setData([]);
    sortedData = [];
    if (getDepartment === "") {
      setValidation(true)
      setHasMore(false)
    }
    else {
      setValidation(false)
      setHasMore(true)
    }
    if (defaultUser === "") {
      setUserValid(true)
      setHasMore(false)
    }
    else {
      setUserValid(false)
      setHasMore(true)
    }
    // setShowToggle(true)
    setFilterData([]);
    e.preventDefault();
    dispatch(getImageData(item))
    setShowToggle([])
  }

  const getAnomalyFilter = (e) => {
    setData([]);
    setSelectedValue(e.target.value)
    if (e.target.value === "All Data") {
      setData(oldArray => [...oldArray, ...filterData]);
      setHasMore(true)
    }
    if (e.target.value === "Unproductive") {
      let filterArray = filterData?.filter(result => Number(result.prodVal) === -1)
      setData(oldArray => [...oldArray, ...filterArray])
      setHasMore(false)
    }
    if (e.target.value === "Productive") {
      let filterArray = filterData?.filter(result => Number(result.prodVal) === 1)
      setData(oldArray => [...oldArray, ...filterArray])
      setHasMore(false)
    }
    if (e.target.value === "Neutral") {
      let filterArray = filterData?.filter(result => Number(result.prodVal) === 0)
      setData(oldArray => [...oldArray, ...filterArray])
      setHasMore(false)
    }
  }



  const handleUserChange = (e) => {
    setData([]);
    setDefaultUser(e.target.value)
    if (e.target.value === "") {
      setUserValid(true)
    }
    else {
      setUserValid(false)
    }
    setHasMore(false)
  }

  const handleDepartmentChange = (e) => {
    if (e.target.value === "") {
      setValidation(true)
    }
    else {
      setValidation(false)
    }
    setHasMore(false)
    setDefaultUser('');
    setData([]);
    setGetDepartment(e.target.value)
    const filterUser = userList?.filter(d => d?.departments?.find(t => t?.department?._id === e.target.value));
    setUserList(filterUser)
  }

  const singleDelete = (item, index) => {
    let singleData = { selectedFile: [{ fileName: item }] }
    axios.post(mainServerAppUrl + "/aws/delete-file", singleData)
      .then(async (res) => {
        if (res.status === 200) {
          setData([...sortedData.filter(ele => ele.key !== item)]);
        }
      }).catch((err) => {
        console.log(err);
      })
  }

  let c = moment().subtract(7, 'days');
  console.log(dDate)
  return (
    <>
      <header className="page-header">
        <div className="flex-40">
          <h1>Screenshot gallery</h1>
        </div>
        <div className="flex-60">
          <div className="d-flex justify-content-end align-item-center">

          </div>
        </div>
      </header>
      <div className={`section-body ${fixNavbar ? "marginTop" : ""}`}>
        {screenshots?.view === true ? loader ? <Loaders /> :
          <>
            <div className="card filter-card">
              <div className="card-header">
                <div className="page-subtitle ml-0 d-flex justify-content-between align-items-center">
                  <div className="form-group m-0">
                    <select style={{ width: "200px", marginRight: "10px", textTransform: "capitalize" }}
                      className={validation ? "form-control border border-danger" : "form-control"}
                      onChange={(e) => handleDepartmentChange(e)}
                      value={getDepartment}
                    >
                      <option value="">Select Department</option>
                      {departmentList?.map((data, index) => (
                        <option key={index} value={data?._id}>
                          {data?.dname}
                        </option>
                      ))}
                    </select>
                    {validation ? <span className="text-red">Required</span> : ""}
                  </div>
                  <div className="form-group m-0">
                    <select style={{ width: "200px", marginRight: "10px", textTransform: "capitalize" }}
                      className={useValid ? "form-control border border-danger" : "form-control"}
                      onChange={(e) => handleUserChange(e)}
                      value={defaultUser}
                    >
                      <option>Select User</option>
                      {userListMap?.map((data, index) => (
                        <option style={data?.isDeleted === true ? bgGray : bgTransparent} className={getAuthUser()?._id === data?._id ? "d-none" : ""} key={index} value={data?._id}>
                          {data?.isDeleted ? data?.firstName + ' ' + data?.lastName + ' (Deleted)' : data?.firstName + ' ' + data?.lastName + ' '}
                        </option>
                      ))}
                    </select>
                    {useValid ? <span className="text-red">Required</span> : ""}
                  </div>
                  <div className="input-group mr-2">
                    <input type="date" className="form-control" placeholder="Select Date" min={plan_type === "free-forever" ? c.format('YYYY-MM-DD') : ""} max={currentDate}
                      value={dDate} onChange={(e) => setDDate(e.target.value)} />
                  </div>
                  <button className="btn btn-primary btn-sm mr-2" onClick={(e) => filterByDate(e)}>Search</button>
                  <button className="btn btn-secondary btn-sm" onClick={clearFilter}>Clear</button>
                </div>
                <div className="page-options d-flex">
                  {showToggle.length > 0 &&
                    <select style={{ width: "200px", marginRight: "10px" }}
                      className="form-control"
                      onChange={(e) => getAnomalyFilter(e)}
                      value={selectedValue}
                    >
                      {dataType?.map((data, index) => (
                        <option key={index} >
                          {data}
                        </option>
                      ))}
                    </select>
                  }

                </div>
              </div>
            </div>
            <>

              {sortedData.length > 0 ?
                <div className="row">
                  {sortedData?.map((data, index) => (
                    <div key={index} className={moment(data?.dateNTime === null ? data?.LastModified : data?.dateNTime).format("YYYY-MM-DD") === dDate ? "col-sm-6 col-lg-4" : "col-sm-6 col-lg-4 d-none"}>
                      <div className={activeIndex === index ? "active" : ""}>
                        <div
                          className="card p-2"
                        >
                          <a
                            style={{ cursor: "pointer" }}
                            onClick={() => {
                              setVisible(true);
                              setActiveIndex(index);
                            }}
                            className="mb-3 image-box"
                          >
                            {Number(data.prodVal) === -1 ? <span className="anomaly-status"><i className="fa fa-exclamation-triangle text-red" /></span> : ""}
                            <img
                              src={data.src ? data.src : "../../src/assets/images/27002.jpg"}
                              className="rounded"
                            />
                          </a>
                          <div className="d-flex align-items-center p-2">
                            <div className="text-truncate" style={{
                              width: "40%",
                              display: "block",
                              fontSize: "12px"
                            }}>
                              {new Date(data?.dateNTime === null ? data?.LastModified : data?.dateNTime).toLocaleString()}
                            </div>
                            <div title={data?.imgName} className="ml-auto text-muted  text-truncate" style={{
                              position: "relative", paddingRight: "30px", width: "60%", textAlign: "right",
                              fontSize: "13px",
                              cursor: "pointer"
                            }}>
                              {data?.imgName}
                              {isMultiDelete ?
                                <div className="custom-controls-stacked icon ml-2" style={{ display: "block", marginBottom: "0px" }}>
                                  <label className="custom-control custom-checkbox" style={{ minHeight: "15px", marginBottom: "0px" }}>
                                    <input type="checkbox" className="custom-control-input" name="fileName" value={data.key} defaultValue="option1" />
                                    <span className="custom-control-label"></span>
                                  </label>
                                </div>
                                :
                                <button style={{
                                  position: "absolute",
                                  top: "50%",
                                  transform: "translateY(-50%)",
                                  right: "0"
                                }} className="btn btn-icon icon p-1" onClick={() => singleDelete(data.key, index)}>
                                  <i className="fa fa-trash-alt text-red"></i>
                                </button>
                              }
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                :
                !hasMore ?
                  <div className="no-data-found">
                    <div className="card">
                      <div className="card-body">
                        <div className="no-data-image">
                          <img src={require('../../images/no-data-Image.png')} />
                        </div>
                        <p>No Data Found</p>
                      </div>
                    </div>
                  </div>
                  :
                  <Loaders />
              }

              {/* <div id="scrollableDiv"
                style={{
                  width: '100%',
                  height: "calc(100vh - 241px)",
                  overflow: "auto"
                }}
               >

                <InfiniteScroll
                  dataLength={sortedData?.length}
                  next={fetchMoreData}
                  hasMore={hasMore}
                  loader={<h4 className="loader" style={{ width: "100%", textAlign: "center", paddingLeft: "200px", lineHeight: "inherit" }}>Loading...</h4>}
                  scrollableTarget="scrollableDiv"
                  scrollThreshold="200px"
                >


                  {sortedData.length > 0 ?
                    sortedData?.map((data, index) => (
                      <div className={activeIndex === index ? "col-sm-6 col-lg-4 active" : "col-sm-6 col-lg-4"} key={index}>
                        <div className="card p-2 ">
                          <a
                            style={{ cursor: "pointer" }}
                            onClick={() => {
                              setVisible(true);
                              setActiveIndex(index);
                            }}
                            className="mb-3 image-box"
                          >
                            {Number(data.prodVal) === -1 ? <span className="anomaly-status"><i className="fa fa-exclamation-triangle text-red" /></span> : ""}
                            <img
                              src={data.src ? data.src : "../../src/assets/images/27002.jpg"}
                              className="rounded"
                            />
                          </a>
                          <div className="d-flex align-items-center p-2">
                            <div className="text-truncate" style={{
                              width: "40%",
                              display: "block",
                              fontSize: "12px"
                            }}>
                              {new Date(data?.dateNTime === null ? data?.LastModified : data?.dateNTime).toLocaleString()}
                            </div>
                            <div title={data?.imgName} className="ml-auto text-muted  text-truncate" style={{
                              position: "relative", paddingRight: "30px", width: "60%", textAlign: "right",
                              fontSize: "13px",
                              cursor: "pointer"
                            }}>
                              {data?.imgName}
                              {isMultiDelete ?
                                <div className="custom-controls-stacked icon ml-2" style={{ display: "block", marginBottom: "0px" }}>
                                  <label className="custom-control custom-checkbox" style={{ minHeight: "15px", marginBottom: "0px" }}>
                                    <input type="checkbox" className="custom-control-input" name="fileName" value={data.key} defaultValue="option1" />
                                    <span className="custom-control-label"></span>
                                  </label>
                                </div>
                                :
                                <button style={{
                                  position: "absolute",
                                  top: "50%",
                                  transform: "translateY(-50%)",
                                  right: "0"
                                }} className="btn btn-icon icon p-1" onClick={() => singleDelete(data.key, index)}>
                                  <i className="fa fa-trash-alt text-red"></i>
                                </button>
                              }
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                    :
                    !hasMore ?
                      <div className="no-data-found">
                        <div className="card">
                          <div className="card-body">
                            <div className="no-data-image">
                              <img src={require('../../images/no-data-Image.png')} />
                            </div>
                            <p>No Data Found</p>
                          </div>
                        </div>
                      </div>
                      : ""
                  }
                </InfiniteScroll>
              </div> */}
            </>
          </>
          :
          <div className="no-data-found">
            <div className="card">
              <div className="card-body">
                <i className="fa fa-file" />
                <p>Not able to view screenshots</p>
              </div>
            </div>
          </div>
        }
      </div>

      <Viewer
        visible={visible}
        onClose={() => {
          setVisible(false);
        }}
        zoomSpeed={0.1}
        images={data}
        activeIndex={activeIndex}
        maxScale={2}
        minScale={0.5}
        rotatable={false}
        scalable={false}
      />
    </>
  );
}
const mapStateToProps = state => ({
  fixNavbar: state.settings.isFixNavbar
})

const mapDispatchToProps = dispatch => ({

})
export default connect(mapStateToProps, mapDispatchToProps)(Gallery);