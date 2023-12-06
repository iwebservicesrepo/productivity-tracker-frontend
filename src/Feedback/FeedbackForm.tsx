import React, { useState } from 'react'
import axios from "axios";

import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import { mainServerAppUrl } from '../apis/mainapi';
import { useSelector } from 'react-redux';

export default function FeedbackForm({ fixNavbar }) {
    const loginData = useSelector((state: any) => state?.loginReducers?.allData);
    const [state, setState]: any = useState("");

    const onradiochange = (e) => {
        setState({ [e.target.type]: e.target.value });
    };

    return (
        <>
            <header className="page-header">
                <div className="flex-40">
                    <h1>Feedback</h1>
                </div>
                <div className="flex-60">
                </div>
            </header>
            <div className={`section-body ${fixNavbar ? "marginTop" : ""}`}>
                <div className="card">
                    <Formik
                        enableReinitialize={true}
                        validateOnMount={true}
                        validateOnChange={true}
                        validateOnBlur={true}
                        validationSchema={Yup.object().shape({
                            message: Yup.string()
                                .required("Message is Required")
                                .matches(/^(?!\s+$)/, "Please Enter the Message"),
                        })}
                        initialValues={{
                            message: "",
                        }}
                        onSubmit={(fields, { resetForm }) => {
                            let subject_feedback = {
                                feedback: fields.message,
                                subject: state.radio ? state.radio : "General",
                                userEmail: loginData?.email,
                                organization: loginData?.organization?._id,
                            };
                            console.log(fields);
                            axios
                                .post(
                                    mainServerAppUrl + "/feedback/add-feedback",
                                    subject_feedback
                                )
                                .then(() => {
                                    toast.success("Feedback sent successfully", {
                                        duration: 2000,
                                    });
                                    resetForm()
                                })
                                .catch((err) => {
                                    toast.error("Some Error Occurred", { duration: 2000 });
                                });
                        }}
                        render={({ errors, status, touched }) => (
                            <Form>
                                <div className="card-body">
                                    <div className="form-group">
                                        <label className="form-label">
                                            Feedback Type
                                        </label>
                                        <div
                                            className="selectgroup feedback-group"
                                            onChange={onradiochange}
                                        >
                                            <label className="selectgroup-item">
                                                <input
                                                    type="radio"
                                                    name="value"
                                                    className="selectgroup-input"
                                                    value="General"
                                                    defaultChecked
                                                />
                                                <span className="selectgroup-button">General</span>
                                            </label>

                                            <label className="selectgroup-item">
                                                <input
                                                    type="radio"
                                                    name="value"
                                                    className="selectgroup-input"
                                                    value="Bug"
                                                />
                                                <span className="selectgroup-button">Bug</span>
                                            </label>
                                            <label className="selectgroup-item">
                                                <input
                                                    type="radio"
                                                    name="value"
                                                    className="selectgroup-input"
                                                    value="Idea"
                                                />
                                                <span className="selectgroup-button">Idea</span>
                                            </label>
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">
                                            Feedback Message{" "}
                                            <span className="required">
                                                <i className="fa-solid fa-star-of-life"></i>
                                            </span>
                                        </label>
                                        <Field
                                            component="textarea"
                                            name="message"
                                            rows="2"
                                            className={
                                                "form-control" +
                                                (errors.message && touched.message
                                                    ? " is-invalid"
                                                    : "")
                                            }
                                            style={{ maxHeight: "350px", minHeight: "150px" }}
                                        />

                                        <ErrorMessage
                                            className="invalid-feedback"
                                            component="div"
                                            name="message"
                                        />
                                    </div>
                                </div>
                                <div className="card-footer text-right">
                                    <button
                                        type="submit"
                                        className="btn btn-primary btn-sm"
                                    >
                                        Submit
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
