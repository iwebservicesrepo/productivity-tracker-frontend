import React, { useEffect, useState } from "react";
import { Field, Form, Formik, ErrorMessage, useFormikContext } from "formik";
import * as Yup from 'yup';
import axios from "axios";
import { mainServerAppUrl } from "../../apis/mainapi";
import { getAuthUser, getCookie, getPayload, iss, setCookie } from "../Authentication/authHelpers";
import toast from "react-hot-toast";

export default function DeleteAccount({ fixNavbar }) {
    const [requestData, setRequestData]: any = useState({})
    const [isFormModal, setFormModal] = useState(false);

    useEffect(() => {
        deleteRequest()
    }, [])

    const deleteRequest = () => {
        let deleteRequestData = axios.get(mainServerAppUrl + "/delete-request-data").then((response) => {
            let delData = response.data.organizations.find(el => el._id === getAuthUser()?.organization)
            setRequestData(delData)
        }).catch((err) => console.log(err))
    }

    return (
        <>
            <header className="page-header">
                <div className="flex-40">
                    <h1>Delete Account</h1>
                </div>
                <div className="flex-60"></div>
            </header>
            <div className={`section-body ${fixNavbar ? "marginTop" : ""}`}>
                <div className="card" style={{ width: "500px" }}>
                    <Formik
                        initialValues={{
                            reason: ''
                        }}
                        validationSchema={Yup.object().shape({
                            reason: Yup.string().required('Reason is required').matches(/^(?!\s+$)/, "Please Enter the Reason In words"),
                        })}
                        onSubmit={async (fields, { resetForm }) => {

                            let finalValues = {
                                ...fields,
                                username: getAuthUser()?.name,
                                email: getAuthUser()?.emailId,
                                organizationName: requestData?.name,
                                contact: requestData?.phone,
                            }
                            await axios.post(mainServerAppUrl + "/delete-request", finalValues)
                                .then((response) => {
                                    toast.success("Request Sent Successfully, our Team will get in touch with you shortly", { duration: 5000 })
                                    resetForm()
                                    setFormModal(false)
                                }).catch((err) => {
                                    console.log(err)
                                    toast.error("Some error occurred", { duration: 5000 })
                                })
                        }}
                        render={({ errors, status, touched }) => (
                            <Form>
                                <div className="card-body">
                                    <div className="form-group">
                                        <label className="form-label">Reason<sup className="required"><i className="fa-solid fa-star-of-life"></i></sup></label>
                                        <Field component="textarea" name="reason" type="text" rows="10" className={'form-control' + (errors.reason && touched.reason ? ' is-invalid' : '')} />
                                        <ErrorMessage name="reason" component="div" className="invalid-feedback" />
                                    </div>
                                </div>
                                <div className="card-footer d-flex justify-content-end">
                                    <button className="btn btn-success  mr-2" type="submit">Send Deletion Request</button>
                                    <button type='reset' className="btn btn-secondary">Reset</button>
                                </div>
                            </Form>
                        )}
                    />
                </div>
            </div>
        </>
    )
}
