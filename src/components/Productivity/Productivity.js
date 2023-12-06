/* eslint-disable array-callback-return */
import React, { useState, useEffect } from "react";
import ReactApexChart from "react-apexcharts";
import { analytics } from "./apexValue";
import moment from "moment";
import axios from "axios";
import _ from "underscore";
import { mainServerAppUrl } from "../../apis/mainapi";
import { useDispatch, useSelector } from "react-redux";
import { getDepartmentList } from "../../ReduxStore/actions/galleryAction";
import { getUser } from "./../../ReduxStore/actions/userAction";
import { getAuthUser } from "../Authentication/authHelpers";
import { CSVLink, CSVDownload } from "react-csv";
import Loaders from "./../Loaders/Loaders";

export default function Productivity({ fixNavbar }) {
  const dispatch = useDispatch();

  const date = Date.now();
  let currentDate = moment(date).utc().format("YYYY-MM-DD");

  let { departmentList } = useSelector((state) => state.galleryReducers);
  const { plan_type } = useSelector(
    (state) => state.loginReducers?.subscriptionplans
  );
  const loginData = useSelector((state) => state.loginReducers?.allData);
  const thirdArray = departmentList?.filter((elem) => {
    return getAuthUser()?.departmentId?.some((ele) => {
      return ele?.department === elem?._id;
    });
  });
  departmentList =
    loginData?.role?.role === "manager" ? thirdArray : departmentList;

  const { userList } = useSelector((state) => state.userReducer);
  const [isLoader, SetIsLoader] = useState(false);

  const [getDepartment, setGetDepartment] = useState("");
  const [userLists, setUserList] = useState([]);
  const [defaultUser, setDefaultUser] = useState("");
  const [dDate, setDDate] = useState(currentDate);
  const [mainArry, setMainArry] = useState([]);
  const [validation, setValidation] = useState(false);
  const [useValid, setUserValid] = useState(false);

  let [productiveApp, setProductiveApp] = useState([]);
  let [nonproductiveApp, setNonproductiveApp] = useState([]);
  let [neutralApp, setNeutralApp] = useState([]);

  productiveApp = _.uniq(productiveApp, (x) => x?.windowClass);
  nonproductiveApp = _.uniq(nonproductiveApp, (x) => x?.windowClass);
  neutralApp = _.uniq(neutralApp, (x) => x?.windowClass);

  const [setIdle, setSetidle] = useState({
    name: "Idle Time",
    data: [],
  });
  const [setTracked, setSetTracked] = useState({
    name: "Tracked Time",
    data: [],
  });

  const [productData, setProductData] = useState({
    name: "PRODUCTIVE",
    data: [],
  });
  const [nonproductData, setNonProductData] = useState({
    name: "NONPRODUCTIVE",
    data: [],
  });
  const [neutralData, setNeutralData] = useState({
    name: "NEUTRAL",
    data: [],
  });

  const [generateCsv, setGenerateCsv] = useState([]);

  const datachart = [productData, nonproductData, neutralData];

  const trackedChart = [setIdle, setTracked];

  useEffect(() => {
    dispatch(getDepartmentList());
    dispatch(getUser());
  }, [dispatch]);

  useEffect(() => {
    if (getAuthUser()?.role === "employee") {
      filterByDate();
    }
  }, []);

  const handleDepartmentChange = (e) => {
    if (e.target.value === "") {
      setValidation(true);
    } else {
      setValidation(false);
    }
    setGetDepartment(e.target.value);
    setDefaultUser("");
    const filterUser = userList?.filter((d) =>
      d?.departments?.find((t) => t?.department?._id === e.target.value)
    );
    setUserList(filterUser);
  };

  const handleUserChange = (e) => {
    if (e.target.value === "") {
      setUserValid(true);
    } else {
      setUserValid(false);
    }
    setDefaultUser(e.target.value);
  };

  const filterByDate = (e) => {
    // e.preventDefault();
    setProductData({
      name: "PRODUCTIVE",
      data: [],
    });
    setNonProductData({
      name: "NONPRODUCTIVE",
      data: [],
    });
    setNeutralData({
      name: "NEUTRAL",
      data: [],
    });
    setSetidle({
      name: "Idle Time",
      data: [],
    });
    setSetTracked({
      name: "Tracked Time",
      data: [],
    });

    // SetIsLoader(true)
    if (getDepartment === "") {
      setValidation(true);
    } else if (defaultUser === "") {
      setUserValid(true);
    } else {
      setValidation(false);
      setUserValid(false);
      SetIsLoader(true);
    }
    // var check = moment(dDate).format("YYYY,MM,DD");
    // let finalDate = check;
    // let endDate = moment(finalDate).add(1, 'days').format("YYYY,MM,DD");
    var check = moment(dDate).startOf();
    let finalDate = check;
    let endDate = moment(finalDate).add(1, "days").startOf();

    if (
      getAuthUser()?.role === "admin" ||
      getAuthUser()?.role === "user-administrator" ||
      getAuthUser()?.role === "manager" ||
      getAuthUser()?.role === "compliance-user"
    ) {
      let formItem = { user: defaultUser, start: finalDate, end: endDate };
      getChartData(formItem);
    } else {
      let formItem = {
        user: getAuthUser()?._id,
        start: finalDate,
        end: endDate,
      };
      getChartData(formItem);
      SetIsLoader(true);
    }
  };

  const clearFilter = (e) => {
    e.preventDefault();
    setValidation(false);
    setUserValid(false);
    SetIsLoader(false);
    setDDate(currentDate);
    setDefaultUser("");
    setGetDepartment("");
    setProductData({
      name: "PRODUCTIVE",
      data: [],
    });
    setNonProductData({
      name: "NONPRODUCTIVE",
      data: [],
    });
    setNeutralData({
      name: "NEUTRAL",
      data: [],
    });
    setSetidle({
      name: "Idle Time",
      data: [],
    });
    setSetTracked({
      name: "Tracked Time",
      data: [],
    });
    setMainArry([]);
    SetIsLoader(false);
  };

  // useEffect(() => {
  //     var check = moment(dDate).format("YYYY,MM,DD");
  //     let finalDate = check;
  //     let endDate = moment(finalDate).add(1, 'days').format("YYYY,MM,DD");
  //     let formItem = { user: getAuthUser()?._id, start: finalDate, end: endDate }
  //     if (getAuthUser()?.role === "employee") {
  //         getChartData(formItem);
  //         SetIsLoader(true)
  //     }
  //     else {
  //         SetIsLoader(false)
  //     }
  // }, [dDate]);

  function getChartData(item) {
    axios
      .post(mainServerAppUrl + "/analytics/get", item)
      .then(async (res) => {
        let result = res?.data?.appdata;
        console.log("1st", result);
        result?.length > 0 ? SetIsLoader(false) : SetIsLoader(false);
        result = result.filter((item) => item.createdAt);
        console.log("kapil :: ", [...result]);
        // result = result
        //   .map((item) => item)
        //   .filter((value, index, self) => self.indexOf(value) === index);
        result = result.filter((value, index, self) => {
          return (
            self.findIndex((v) => v.createdAt === value.createdAt) === index
          );
        });
        console.log("kapil sharma", [...result]);
        setMainArry([...result]);
        result.map((data, index) => {
          // delete data['duration']
          data.createdTime = new Date(data?.createdAt).toLocaleString();
          data.updatedTime = new Date(data?.updatedAt).toLocaleString();
          let a = moment(data?.updatedTime);
          let b = moment(data?.createdTime);
          data.newDuration = a.diff(b, "seconds", false);
        });
        result = result?.filter((item) => Number(item?.newDuration) !== 0);
        console.log("2nd", { result });
        // lowerChartData()
        createTrackedTimeChart(result);
        result = result?.filter((item) => item?.windowClass !== "idle-time");
        setGenerateCsv(result);
        let newDataSet = [];
        console.log("result length", result.length);

        // for (let i=0; i<result?.length; i++){
        //   let timeRange = 300;
        //   if(result[i]?.newDuration <= timeRange ){
        //     newDataSet.push(result[i]);
        //     timeRange -= result[i]?.newDuration;
        //   }else{
        //     let newSplitEntry = {};
        //     newSplitEntry.newDuration = timeRange;

        //     timeRange = 0;

        //   }

        // }
        for (let i = 0; i < result?.length; i++) {
          if (result[i]?.newDuration <= 300) {
            newDataSet?.push(result[i]);
          } else {
            let totalSpilits = Math.ceil(result[i]?.newDuration / 300);
            console.log({ totalSpilits });
            let createdt = new Date(result[i]?.createdTime).getTime();
            let spendTime = result[i]?.newDuration;
            console.log({ spendTime });
            for (let j = 0; j < totalSpilits; j++) {
              let obj = {};
              if (new Date(result[i]?.updatedTime).getTime() > createdt) {
                let date = new Date(createdt);
                obj["createdAt"] = date?.toISOString();
                if (spendTime >= 300) {
                  obj["newDuration"] = 300;
                  spendTime = spendTime - 300;
                  console.log("2nd", { spendTime });
                } else {
                  obj["newDuration"] = spendTime;
                }
                obj["windowName"] = result[i]?.windowName
                  ? result[i]?.windowName
                  : result[i]?.windowClass;
                obj["windowClass"] = result[i]?.windowClass;
                // obj["_id"] = result[i]?._id;
                obj["type"] = result[i]?.type;
                // obj["os"] = result[i]?.os;
                let newData = new Date(createdt);
                let xyz = moment(newData).add(5, "minutes").format();
                createdt = new Date(xyz)?.getTime();
                let newDate = new Date(xyz);
                obj["updatedAt"] = newDate?.toISOString();
              }
              newDataSet?.push(obj);
            }
          }
        }
        console.log("New Data Set =======>", newDataSet);
        timeAllStamp.map((item, tindex) => {
          let durationSum = 0;
          newDataSet.map((ditem, dindex) => {
            if (
              new Date(ditem?.createdAt).getTime() >= timeAllStamp[tindex] &&
              new Date(ditem?.createdAt).getTime() <= timeAllStamp[tindex + 1]
            ) {
              durationSum = durationSum + Number(ditem?.newDuration);
              if (Number(durationSum) > 300) {
                if (
                  Number(ditem?.newDuration) === 300 ||
                  Number(ditem?.newDuration) > 240 ||
                  Number(ditem?.newDuration) > 250 ||
                  Number(ditem?.newDuration) > 200 ||
                  Number(ditem?.newDuration) > 150
                ) {
                  ditem.newDuration = Math.abs(
                    durationSum - ditem?.newDuration - 300
                  );
                  durationSum = durationSum - 300;
                }
              }
            }
          });
        });

        newDataSet = newDataSet?.filter((item) => Number(item?.y) !== 0);
        console.log("1st -", { newDataSet });
        createTypeArray(newDataSet);
      })
      .catch((err) => {
        console.log(err);
      });
  }

h

  const getTrackedChartData = (trackingData) => {
    let finalIdealTime = [];
    console.log({ trackingData });
    trackingData?.map((trackedData) => {
      let obj = {
        y: [],
      };
      obj["x"] = "Time";
      obj["y"] = [
        new Date(trackedData?.createdAt).getTime(),
        new Date(trackedData?.updatedAt).getTime(),
      ];
      finalIdealTime.push({ ...obj });
    });
    console.log({ finalIdealTime });
    return finalIdealTime;
  };

  function getTimeRanges(interval) {
    const ranges = [];
    const date = new Date(dDate);
    for (let minutes = 0; minutes < 24 * 60; minutes = minutes + interval) {
      date.setHours(0);
      date.setMinutes(minutes);
      date.setSeconds(0);
      ranges.push(date.getTime());
    }
    return ranges;
  }

  const createTypeArray = (items) => {
    const productive = items?.filter((item) => item?.type === 1);
    setProductiveApp(productive);
    console.log({ productive });
    let productiveArray = createAnalyticsChart(productive);

    const nonproductive = items?.filter((item) => Number(item?.type) === -1);
    setNonproductiveApp(nonproductive);
    let nonProductiveArray = createAnalyticsChart(nonproductive);

    const neutral = items?.filter((item) => Number(item?.type) === 0);
    console.log({ neutral });
    setNeutralApp(neutral);
    let neutralArray = createAnalyticsChart(neutral);

    setProductData({
      name: "PRODUCTIVE",
      data: [...productiveArray],
    });
    setNonProductData({
      name: "NONPRODUCTIVE",
      data: [...nonProductiveArray],
    });
    setNeutralData({
      name: "NEUTRAL",
      data: [...neutralArray],
    });
  };

  const createAnalyticsChart = (productive) => {
    console.log("analytic chart fn:::", productive);
    let finalArry = [];
    timeAllStamp?.map((item, tindex) => {
      let obj = {
        goals: [],
      };
      let durationSum = 0;
      productive?.map((ditem, dindex) => {
        if (
          new Date(ditem?.createdAt).getTime() >= timeAllStamp[tindex] &&
          new Date(ditem?.createdAt).getTime() <= timeAllStamp[tindex + 1]
        ) {
          console.log("new duration:::", ditem.newDuration);
          durationSum = durationSum + Number(ditem?.newDuration);
          obj["y"] = durationSum;
          obj["goals"].push({
            name: ditem?.windowName ? ditem?.windowName : ditem?.windowClass,
            value: ditem?.newDuration,
          });
          console.log(obj);
        }
      });
      finalArry.push({ x: item, y: 0, ...obj });
    });
    //final array value to be checked if greater than 300
    for (let i = 0; i < finalArry?.length; i++) {
      if (finalArry[i]?.goals?.length > 0) {
        let holder = {};
        finalArry[i]?.goals?.forEach(function (d) {
          if (holder?.hasOwnProperty(d?.name)) {
            holder[d?.name] = holder[d?.name] + d?.value;
          } else {
            holder[d?.name] = d?.value;
          }
        });
        for (var prop in holder) {
          finalArry[i]?.goals?.push({
            name: prop,
            value: holder[prop],
            type: true,
            strokeHeight: 0,
            strokeColor: "transparent",
          });
        }
        finalArry[i].goals = finalArry[i]?.goals?.filter(
          (item) => item?.type === true
        );
      }
    }
    console.log({ finalArry });
    return finalArry;
  };

  const timeAllStamp = getTimeRanges(5);
  let minusHours = new Date(
    moment(mainArry[0]?.createdAt).subtract(1, "hours").format()
  );
  minusHours.setMinutes(0);
  minusHours.setSeconds(0);

  const secondaryChart = {
    series: [...trackedChart],
    options: {
      chart: {
        // height: 50,
        width: "100%",
        height: "auto",
        type: "rangeBar",
        zoom: {
          enabled: false,
        },
        toolbar: {
          show: false,
        },
        animations: {
          enabled: false,
        },
      },
      plotOptions: {
        bar: {
          horizontal: true,
          barHeight: "30%",
          rangeBarGroupRows: true,
        },
      },
      colors: ["#7D3C98", "#00E396"],
      fill: {
        type: "solid",
        // style: 'horizontalLines'
      },
      xaxis: {
        type: "datetime",
        tickPlacement: "on",
        tickAmount: 23,
        min: timeAllStamp[0],
        max: timeAllStamp[timeAllStamp?.length - 1],
        labels: {
          show: true,
          formatter: function (opt) {
            let dated = new Date(opt);
            dated.setMinutes(0);
            let result = moment(dated).format("HH:mm");
            return result;
          },
        },
      },
      yaxis: {
        show: false,
      },
      legend: {
        position: "right",
        show: false,
      },
      tooltip: {
        x: {
          formatter: function (timestamp, value) {
            let result = moment(new Date(timestamp)).format("HH:mm");
            return result;
          },
        },
      },
    },
  };

  const createCsvFileName = () => `data_${moment().format()}.csv`;

  const headers = [
    { label: "Type", key: "name" },
    { label: "Created At", key: "x" },
    { label: "Updated At", key: "y" },
    { label: "App Name", key: "goals" },
    { label: "App duration", key: "value" },
  ];

  let csvData = [...generateCsv];

  let dataF = [];

  csvData.forEach((item) => {
    let dateObj = new Date(Number(item?.newDuration) * 1000);
    let minutes = dateObj.getUTCMinutes();
    let seconds = dateObj.getSeconds();
    let timeString =
      minutes.toString().padStart(2, "0") +
      ":" +
      seconds.toString().padStart(2, "0");
    let appName = item?.windowName
      ? item?.windowName
      : item?.windowClass
      ? item?.windowClass
      : "No title";
    let capitalized = appName.charAt(0).toUpperCase() + appName.slice(1);
    dataF.push({
      name:
        item?.type === 1
          ? "Productive"
          : item?.type === -1
          ? "NonProductive"
          : "Neutral",
      x: moment(item?.createdTime).format("MMMM Do YYYY, h:mm:ss a"),
      y: moment(item?.updatedTime).format("MMMM Do YYYY, h:mm:ss a"),
      goals: capitalized,
      value: timeString,
    });
  });

  let chartData = {
    series: [...datachart],
    options: {
      chart: {
        type: "bar",
        stacked: true,
        width: "100%",
        // height: 'auto',
        zoom: {
          enabled: false,
        },
        export: {
          show: false,
        },
        animations: {
          enabled: false,
        },
      },
      title: {
        text: "PRODUCTIVITY CHART",
      },
      grid: {
        row: {
          colors: ["#fff", "#f2f2f2"],
        },
      },
      plotOptions: {
        bar: {
          horizontal: false,
          // columnWidth: '100px',
          columnWidth: "130%",
          // distributed: true
        },
      },
      dataLabels: {
        enabled: false,
      },

      legend: {
        show: true,
        showForSingleSeries: true,
        position: "top",
        markers: {
          fillColors: ["#3bb06c", "#ecab45", "#bac0c4"],
        },
      },
      stroke: {
        show: true,
        width: 2,
        colors: ["transparent"],
      },
      yaxis: {
        show: true,
        max: 300,
        showForNullSeries: true,
        tickAmount: 2,
        labels: {
          formatter: (value) => {
            // console.log(value);
            if (value === 300) {
              value = 100;
            }
            if (value === 225) {
              value = 75;
            }
            if (value === 150) {
              value = 50;
            }
            if (value === 75) {
              value = 0;
            }
            return value.toFixed(0) + "%";
          },
        },
      },
      xaxis: {
        type: "datetime",
        tickPlacement: "on",
        // min: new Date(minusHours).getTime(),
        tickAmount: 23,
        min: timeAllStamp[0],
        max: timeAllStamp[timeAllStamp.length - 1],
        labels: {
          show: true,
          formatter: function (timestamp) {
            let dated = new Date(timestamp);
            dated.setMinutes(0);
            let result = moment(dated).format("HH:mm");
            return result;
          },
        },
      },
      tooltip: {
        y: {
          formatter: function (val) {
            return moment.utc(val * 1000).format("mm:ss");
          },
        },
        x: {
          formatter: function (timestamp) {
            let result = moment(new Date(timestamp)).format("HH:mm");
            let secondResult = moment(new Date(timestamp + 5 * 60000)).format(
              "HH:mm"
            );
            let finalResult = result + " - " + secondResult;
            return finalResult;
          },
        },
      },
      fill: {
        opacity: 1,
        colors: ["#3bb06c", "#ecab45", "#bac0c4"],
      },
    },
  };

  let c = moment().subtract(7, "days");

  const dateHandler = (e) => {
    e.preventDefault();
    setProductData({
      name: "PRODUCTIVE",
      data: [],
    });
    setNonProductData({
      name: "NONPRODUCTIVE",
      data: [],
    });
    setNeutralData({
      name: "NEUTRAL",
      data: [],
    });
    setSetidle({
      name: "Idle Time",
      data: [],
    });
    setSetTracked({
      name: "Tracked Time",
      data: [],
    });
    setMainArry([]);
    SetIsLoader(false);
    setDDate(e.target.value);
  };

  return (
    <>
      <header className="page-header">
        <div className="flex-40">
          <h1>Productivity</h1>
        </div>
        <div className="flex-60">
          <div className="d-flex justify-content-end align-item-center"></div>
        </div>
      </header>
      <div className={`section-body ${fixNavbar ? "marginTop" : ""} `}>
        <>
          <div className="card filter-card">
            <div className="card-header" style={{ paddingTop: "15px" }}>
              <div className="page-subtitle ml-0 d-flex justify-content-between align-items-center">
                {getAuthUser()?.role === "admin" ||
                getAuthUser()?.role === "user-administrator" ||
                getAuthUser()?.role === "manager" ||
                getAuthUser()?.role === "compliance-user" ? (
                  <>
                    <div className="form-group m-0">
                      <select
                        style={{
                          width: "200px",
                          marginRight: "10px",
                          textTransform: "capitalize",
                        }}
                        className={
                          validation
                            ? "form-control border border-danger"
                            : "form-control"
                        }
                        onChange={(e) => {
                          handleDepartmentChange(e);
                        }}
                        value={getDepartment}
                      >
                        <option value="">Select Department</option>
                        {departmentList?.map((data, index) => (
                          <option key={index} value={data?._id}>
                            {data?.dname}
                          </option>
                        ))}
                      </select>
                      {validation ? (
                        <span className="text-red">Required</span>
                      ) : (
                        ""
                      )}
                    </div>
                    <div className="form-group m-0">
                      <select
                        style={{
                          width: "200px",
                          marginRight: "10px",
                          textTransform: "capitalize",
                        }}
                        className={
                          useValid
                            ? "form-control border border-danger"
                            : "form-control"
                        }
                        onChange={(e) => handleUserChange(e)}
                        value={defaultUser}
                      >
                        <option value="">Select User</option>
                        {userLists?.map((data, index) => (
                          <option
                            className={
                              getAuthUser()?._id === data?._id ? "d-none" : ""
                            }
                            key={index}
                            value={data?._id}
                          >
                            {data?.firstName} {data?.lastName}
                          </option>
                        ))}
                      </select>
                      {useValid ? (
                        <span className="text-red">Required</span>
                      ) : (
                        ""
                      )}
                    </div>
                  </>
                ) : (
                  ""
                )}
                <div className="input-group mr-2">
                  <input
                    type="date"
                    className="form-control"
                    min={
                      plan_type === "free-forever" ? c.format("YYYY-MM-DD") : ""
                    }
                    max={currentDate}
                    placeholder="Select Date"
                    value={dDate}
                    onChange={(e) => dateHandler(e)}
                  />
                </div>
                <button
                  className="btn btn-primary btn-sm mr-2"
                  onClick={(e) => filterByDate(e)}
                >
                  Search
                </button>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={clearFilter}
                >
                  Clear
                </button>
              </div>
              {getAuthUser()?.role === "employee" ? (
                " "
              ) : mainArry?.length > 0 ? (
                <div className="page-options d-flex">
                  <CSVLink
                    data={dataF}
                    headers={headers}
                    filename={createCsvFileName()}
                    target="_blank"
                    className="btn btn-primary btn-sm d-block"
                    style={{ lineHeight: "28px" }}
                  >
                    Download CSV
                  </CSVLink>
                </div>
              ) : (
                ""
              )}
            </div>
          </div>
          <>
            {isLoader ? <Loaders /> : ""}
            {mainArry?.length > 0 ? (
              <>
                <div className="card">
                  <div className="card-body">
                    <div id="chart" style={{ width: "100%" }}>
                      <ReactApexChart
                        style={{ width: "100%" }}
                        className="apex-chart productivity-chart"
                        options={chartData?.options}
                        series={chartData?.series}
                        type="bar"
                        height={250}
                      />
                    </div>
                    <div
                      id="charts"
                      style={{
                        paddingLeft: "30px",
                        width: "100%",
                      }}
                    >
                      <ReactApexChart
                        options={secondaryChart?.options}
                        series={secondaryChart?.series}
                        type="rangeBar"
                        height={150}
                        width="100%"
                      />
                    </div>
                  </div>
                </div>
                <div className="row productivity chart-productivity-list">
                  <div className="col-md-4">
                    <div className="card">
                      <div className="card-header card-header-productive">
                        <h3 className="card-title">Productive Apps</h3>
                      </div>
                      <div className="card-body">
                        <ul className="data-productivity-list">
                          {productiveApp?.map((el, index) => (
                            <li className="text-truncate" key={index}>
                              <img
                                src={`https://t0.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${el?.windowName}/&size=64`}
                                alt=""
                              />{" "}
                              {el?.windowName
                                ? el?.windowName
                                : el?.windowClass}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="card">
                      <div className="card-header card-header-nonproductive">
                        <h3 className="card-title">Non-Productive Apps</h3>
                      </div>
                      <div className="card-body">
                        <ul className="data-productivity-list">
                          {nonproductiveApp?.map((el, index) => (
                            <li className="text-truncate" key={index}>
                              <img
                                src={`https://t0.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${el?.windowName}/&size=64`}
                              />{" "}
                              {el?.windowName
                                ? el?.windowName
                                : el?.windowClass}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="card">
                      <div className="card-header card-header-neutral">
                        <h3 className="card-title">Neutral Apps</h3>
                      </div>
                      <div className="card-body">
                        <ul className="data-productivity-list">
                          {neutralApp?.map((el, index) => (
                            <li className="text-truncate" key={index}>
                              <img
                                src={`https://t0.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${el?.windowName}/&size=64`}
                              />{" "}
                              {el?.windowName
                                ? el?.windowName
                                : el?.windowClass}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : !isLoader ? (
              <div className="no-data-found">
                <div className="card">
                  <div className="card-body">
                    <div className="no-data-image">
                      <svg
                        style={{ filter: "opacity(0.5)" }}
                        width="101"
                        height="101"
                        viewBox="0 0 32 33"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M5.5 26.4482V17.4482H12.5"
                          stroke="black"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M28.5 26.4482H3.5"
                          stroke="black"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M12.5 26.4482V11.4482H19.5"
                          stroke="black"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M26.5 5.44824H19.5V26.4482H26.5V5.44824Z"
                          stroke="black"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <p>No Data Found</p>
                    {getAuthUser()?.role === "employee" ? (
                      ""
                    ) : (
                      <p>Please Select the filter and Search then</p>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              ""
            )}
          </>
        </>
      </div>
    </>
  );
}
