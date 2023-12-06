import React, { useState, useEffect } from 'react';
import Select from "react-select";
import DatePicker, { DateObject } from "react-multi-date-picker";
import { useDispatch, useSelector } from 'react-redux';
import { getDepartmentList } from '../../ReduxStore/actions/galleryAction';
import { getUser } from './../../ReduxStore/actions/userAction';
import { getAuthUser } from '../Authentication/authHelpers';
import { mainServerAppUrl } from './../../apis/mainapi';
import axios from 'axios';
import moment from "moment";
import { toast } from 'react-hot-toast';
import { Field, Form, Formik } from 'formik';
import * as Yup from "yup";
import ValidationMessage from '../common/ValidationMessage';

export default function Reporting({ fixNavbar }) {
    const dispatch: any = useDispatch()
    const adminId = getAuthUser()?._id;

    const { departmentList } = useSelector((state: any) => state.galleryReducers);
    const { userList } = useSelector((state: any) => state.userReducer);

    const adminDetails = userList?.find(val => val?._id === adminId);

    const [values, setValues]: any = useState([
        new DateObject().subtract(1, "days"),
        new DateObject()
    ])
    const [getDepartment, setGetDepartment] = useState("");
    const [userLists, setUserList] = useState([]);
    const [selectUser, setSelectUser]: any = useState([
        { id: "", firstName: "", lastName: "" }
    ]);
    const [defaultValue, setDefaultValue] = useState([]);
    const [isLoading, setLoading] = useState(false)
    const [isData, setIsData] = useState(false)
    const [showError, setShowError] = useState(false)
    const [isError,setError]= useState(false)
    const [validation,setValidation]= useState(false)
    const [reportData, setReportData] = useState([])
    const [isModal, setIsModal] = useState(false)
    const [isAdd,setIsAdd] = useState(false) 
    const [reportName, setReportName]= useState('')
    const [userValidation, setUserValidation]= useState(false)
    const [currentPage, setCurrentPage] = useState(1);   
    const [recordsPerPage] = useState(10);
    const [olderName, setOlderName] = useState("")

    useEffect(() => {
        dispatch(getDepartmentList());
        dispatch(getUser())
        getReportData()
    }, [dispatch])


    const handleDepartmentChange = (e) => {
        setGetDepartment(e.target.value)
        if (e.target.value === "") {
            setValidation(true)
        } else {
            setValidation(false)
        }
        const filterUser = userList?.filter(d => d?.departments?.find(t => t?.department?._id === e.target.value));
        setUserList(filterUser)
    }

    var options = userLists.map((data) => ({
        value: data?._id,
        label: data?.firstName + ' ' + data?.lastName,
        firstName: data?.firstName,
        lastName: data?.lastName
    }));

    const multiSelectDepartment = (selectedOption, actionMeta) => {

        setDefaultValue([...selectedOption]);
        
        if(selectedOption?.length<=0){
            setUserValidation(true)
        }else{
            setUserValidation(false)
        }
        const finalValue = selectedOption.map((data) => ({
            id: data.value,
            firstName: data.firstName,
            lastName: data?.lastName
        }));
        setSelectUser([...finalValue]);
    };


    const generateReport = (value) => {

        setLoading(true)
        
        let items = {
            users: selectUser, 
            recepients: [{ email_id: adminDetails?.email, firstName: adminDetails?.firstName, lastName: adminDetails?.lastName }]
            ,
            start_date: values[0]?.format("YYYY-MM-DD"), end_date: values[1]?.format("YYYY-MM-DD"), reportName: value?.reportName, timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
        }
        //console.log(items)
        axios.post(mainServerAppUrl + "/admin/app-usage-report", items)
            .then(async (res) => {
                    setLoading(false)
                    if(res.data.status==="failure"){
                        toast.error(res.data.message)
                    }
                    else{
                    setIsData(true)
                    setShowError(false)
                    getReportData()
                    setIsModal(false)
                    setDefaultValue([])
                    setGetDepartment('')
                    toast.success("Report Generated Successfully", {id:"generated", duration:3000})
                    }
                    toast.dismiss('deleted');
                    toast.dismiss('error');
                    //console.log("yes")

                
            })
            .catch((err) => {
                if (err.response.status === 400) {
                    setIsData(true)
                    setShowError(true)
                    setLoading(false)
                    console.log(err)
                }
                else {
                    setIsData(true)
                    setError(true)
                    setLoading(false)
                    console.log(err)
                }
            })
    }

    const getMaxDate = (date) => {
        var a = moment(date);
        var b = moment();
        var diffe = b.diff(a, 'days') // 1
        if (diffe <= 30) {
            return new DateObject(values[0]?.format("YYYY-MM-DD")).add(diffe, "days")
        }
        else {
            return new DateObject(values[0]?.format("YYYY-MM-DD")).add(30, "days")
        }
    }

    const getReportData = async()=>{
        let formData= {orgId:getAuthUser()?.organization, userId:adminId} 
        let {data} = await axios.post(mainServerAppUrl + "/admin/get-reports-link",formData)
        //console.log(data)
        setReportData([...data])
    }

    const deleteReportData= async(value)=>{
        //console.log(value?.key)
        let formData= {orgId:getAuthUser()?.organization, userId:adminId, fileName:value?.key, reportName: value?.key.match("reports/(.*).zip")[1]}
        await axios.post(mainServerAppUrl + "/admin/delete-reports", formData)
        .then(()=>{
            toast.success("Report Deleted Successfully", {id:"deleted", duration:3000})
            toast.dismiss('generated')
            toast.dismiss('error')
            getReportData()
        })
        .catch((err)=>{
            toast.error("Something Went Wrong");
            toast.dismiss('generated');
            toast.dismiss('deleted');
            console.log(err)
        })
    }

    const editReportName = (value)=>{
        setOlderName(value?.key.match("reports/(.*).zip")[1])
        setReportName(value?.key.match("reports/(.*).zip")[1])
        setIsAdd(true)
    }

    const openModal = ()=>{
        if(getDepartment==="" ){
            setValidation(true)
            setIsModal(false)
        }
        else if(defaultValue?.length===0){
            setUserValidation(true)
            setIsModal(false)
        }else{
            setUserValidation(false)
            setValidation(false)
            setIsModal(true)
        }
    }

        const indexOfLastRecord = currentPage * recordsPerPage;
        const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
        const currentRecords = reportData.slice(indexOfFirstRecord, 
        indexOfLastRecord);
        const nPages = Math.ceil(reportData.length / recordsPerPage)
        const nextPage = () => {
            if(currentPage !== nPages) 
                setCurrentPage(currentPage + 1)
        }
        const prevPage = () => {
            if(currentPage !== 1) 
                setCurrentPage(currentPage - 1)
        }
    return (
        <>
            <header className="page-header">
                <div className="flex-40">
                    <h1>Reports</h1>
                </div>
                <div className="flex-60">
                    <div className="d-flex justify-content-end align-item-center">
                    </div>
                </div>
            </header>
            <div className={`section-body ${fixNavbar ? "marginTop" : ""}`}>
                <div className="card filter-card">
                    <div className="card-header" style={{ paddingTop: "15px" }}>
                        <form className="page-subtitle ml-0 d-flex justify-content-between align-items-center" onSubmit={(e)=>{
                            e.preventDefault()}}>
                                <div className='form-group m-0'> 
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
                            <div className='form-group m-0'>
                            <Select
                                className={userValidation ? "basic-multi-select widthMulti border-danger" : "basic-multi-select widthMulti"}
                                classNamePrefix="select"
                                placeholder={'Select Users'}
                                closeMenuOnSelect={true}
                                isMulti
                                options={options}
                                onChange={multiSelectDepartment}
                                name="users"
                                value={defaultValue}
                                
                            />
                            {userValidation ? <span className="text-red">Required</span> : ""}
                            </div>
                            {/*values[0]?.format("YYYY-MM-DD") ? new DateObject(values[0]?.format("YYYY-MM-DD")).add(30, "days") : new DateObject() */}
                            <div className="input-group mr-2">
                                <DatePicker
                                    value={values}
                                    onChange={setValues}
                                    minDate={values[0]?.format("YYYY-MM-DD") && new DateObject(values[0]?.format("YYYY-MM-DD")).subtract(30, "days")}
                                    maxDate={getMaxDate(values[0]?.format("YYYY-MM-DD"))}
                                    range
                                    rangeHover
                                    onOpenPickNewDate={true}
                                    inputClass="form-control"
                                />
                            </div>
                            <button className="btn btn-primary btn-sm" onClick={()=>{openModal()
                            setIsAdd(false)}}>Generate</button>
                        </form>
                        {isLoading === false ? "" : "Loading"}
                    </div>
                </div>
                {reportData?.length>0 ? 
                <div className="table-responsive">
                        <table className="table table-hover table-vcenter text-nowrap table_custom spacing8 mb-0">
                           <thead>
                            <tr>
                                <th>File Name</th>
                                <th>Created At</th>
                                <th className='text-center'>Action</th>
                            </tr>
                            </thead> 
                            <tbody>
                                {currentRecords?.map((data,index)=>
                                <tr key={index}>
                                    <td className="text-wrap">
                                       {data?.key.match("reports/(.*).zip")[1]} 
                                    </td>
                                    <td>{new Date(data?.LastModified).toLocaleString()}</td>
                                    <td className='text-center'>
                                    <a
                                        className="btn btn-icon"
                                        href= {data?.src}
                                        target= "_blank"
                                        rel='noreferrer'
                                      >
                                        <i className="fa-solid fa-download text-green" />
                                      </a>
                                      <button
                                        className="btn btn-icon"
                                        onClick={()=>{editReportName(data)
                                        setIsModal(true)}}
                                        >
                                        <i className="fa fa-pencil text-blue" />
                                      </button>
                                      <button className='btn btn-icon'
                                        onClick={()=>deleteReportData(data)}
                                      >
                                        <i className="fa fa-trash-alt text-red" />
                                      </button>
                                    </td>
                                </tr>
                                )}
                                </tbody>        
                        </table>
                        {reportData?.length > 0 && (
              <div className="d-flex justify-content-center">
                <nav aria-label="Page navigation example">
                  <ul className="pagination">
                    <li className="page-item">
                      <a className="page-link" onClick={prevPage} href="#" aria-label="Previous">
                        <span aria-hidden="true">&laquo;</span>
                        <span className="sr-only" >Previous</span>
                      </a>
                    </li>
                    <li className="page-item">
                      <a className="page-link" href="#">
                        {currentPage}/{nPages}
                      </a>
                    </li>

                    <li className="page-item">
                      <a className="page-link" onClick={nextPage} href="#" aria-label="Next">
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
                                    <ul className="flow-page">
                                        <li>No Existing Reports Found</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                }
                {isModal && (
                    <div
                    className="modal d-block"
                    aria-labelledby="exampleModalLabel"
                    aria-hidden="true"
                  >
                    <div
                        className="modal-dialog modal-dialog-centered modal-md"
                        role="document"
                      >
                        <div className="modal-content">
                          <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">
                              {isAdd? "Edit Your File Name." : "Name your file."}
                            </h5>
                            <button
                                type="button"
                                className="close"
                                data-dismiss="modal"
                                onClick={() => {
                                setIsModal(false);
                                setIsAdd(false)
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
                    validationSchema={Yup.object().shape({
                        reportName: Yup.string()
                          .required("File Name is required")
                          .matches(/^(?!\s+$)/, "Please Enter the File Name"),
                      })}
                    initialValues={{
                     reportName: isAdd ? reportName : "",
                }}
                onSubmit={(fields, { resetForm }) => {
                  let finalValues = {
                    ...fields,
                  };
                  if(isAdd){
                   let modify = {...fields, olderName}
                   axios.patch(mainServerAppUrl + "/admin/edit-report-name", {
                    fileName: modify?.olderName,
                    newName: modify?.reportName,
                    created_by: adminDetails?._id,
                    org_id: adminDetails?.organization
                   })
                   .then((res)=>{
                    if(res.data.status==="success"){
                        
                        setTimeout(()=>{
                        toast.success(res.data.message)
                        getReportData();
                        setIsModal(false)
                        setIsAdd(false)
                        },500)
                        
                    }else{
                        toast.error(res.data.message)
                    }
                   })
                  }
                  else{
                   generateReport(finalValues)
                  }
                //   setIsAdd(false)
                }}
                render={({ errors, status, touched }) => (
                    <Form>
                  <div className="modal-body">
                  <div className="form-group">
                            <label className="form-label">File Name<span className="required"><i className="fa-solid fa-star-of-life"></i></span></label>
                            <Field
                              name="reportName"
                              type="text"
                              className={
                                "form-control" +
                                (errors.reportName && touched.reportName
                                  ? " is-invalid"
                                  : "")
                              }
                            />
                            <ValidationMessage name="reportName"/>
                          </div>
                    </div>
                    <div className="modal-footer">
                        <button type='submit' className='btn btn-success'
                        >{isAdd ? "Update" : "Save"}
                        </button>
                        <button type='reset' className='btn btn-secondary'
                        onClick={()=>{setIsModal(false)
                            setIsAdd(false)
                            }}>
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
            </div>
        </>
    )
}
