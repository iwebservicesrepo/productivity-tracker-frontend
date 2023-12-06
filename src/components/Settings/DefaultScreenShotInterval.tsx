import React, { useEffect, useState } from "react";
import { Field, Form, Formik, ErrorMessage, } from "formik";
import * as Yup from 'yup';
import axios from "axios";
import { mainServerAppUrl } from "../../apis/mainapi";
import toast from "react-hot-toast";
import { useSelector } from 'react-redux';

export default function DefaultScreenShotInterval({ fixNavbar }) {

    const { plan_type } = useSelector((state: any) => state.loginReducers?.subscriptionplans);



    const [defaultSsValue, setDefaultSsValue]: any = useState(plan_type === "free-forever" ? 10 : 5);

    useEffect(() => {
        axios.get(mainServerAppUrl + "/organization/default-settings")
            .then(async (res) => {
                let value = millisToMinutes(res.data.org.defaultSettings.screenshotFrequency)
                let minutesString = value.toString()
                setDefaultSsValue(minutesString)
            }).catch((err) => {
                console.error(err);
            })
    }, []);

    function millisToMinutes(millis) {
        var minutes = Math.floor(millis / 60000);
        return minutes;
    }


    const frequencyList = plan_type === "free-forever" ? [10, 15] : [5, 10, 15];
    return (
        <>
            <header className="page-header">
                <div className="flex-40">
                    <h1>Default Screenshot Interval</h1>
                </div>
                <div className="flex-60">

                </div>
            </header>
            <div className={`section-body ${fixNavbar ? "marginTop" : ""}`}>
                <div className="card" style={{ width: "500px" }}>
                    <Formik
                        enableReinitialize={true}
                        validateOnMount={true}
                        validateOnChange={true}
                        validateOnBlur={true}
                        initialValues={{
                            screenshotFrequency: defaultSsValue
                        }}
                        onSubmit={(fields, { resetForm }) => {
                            function MinutesToMilliseconds(time) {
                                return time * 60 * 1000;
                            }
                            let screenshotFrequency = MinutesToMilliseconds(fields.screenshotFrequency)
                            axios.put(mainServerAppUrl + "/organization/update-default-settings", { screenshotFrequency })
                                .then(async (res) => {
                                    if (res.status === 200) {
                                        toast.success("Successfully set the Default Setting interval", { id: "default interval", duration: 5000 })
                                    }
                                }).catch((err) => {
                                    toast.error(err, { duration: 5000 })
                                })
                        }}
                        render={({ errors, status, touched }) => (
                            <Form>
                                <div className="modal-body">
                                    <div className="row">
                                        <div className="col-md-12 col-sm-6">
                                            <div className="form-group">
                                                <label className="form-label">
                                                    Screenshot Frequency
                                                </label>
                                                <div className="input-group">
                                                    <Field
                                                        className="form-control"
                                                        component="select"
                                                        name="screenshotFrequency"
                                                    >
                                                        {frequencyList?.map((data, index) => (
                                                            <option key={index}>{data}</option>
                                                        ))}
                                                    </Field>
                                                    <div className="input-group-append">
                                                        <span
                                                            style={{ fontSize: "13px", display: "block" }}
                                                            className="input-group-text"
                                                        >
                                                            MINS
                                                        </span>
                                                    </div>
                                                    <ErrorMessage name="screenshotFrequency" component="div" className="invalid-feedback" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="card-footer text-right">
                                    <button type="submit" className="btn btn-success">
                                        Save
                                    </button>
                                </div>
                            </Form>
                        )}
                    />
                </div>
            </div>
        </>
    )
}
