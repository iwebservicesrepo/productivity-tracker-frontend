import React from 'react'
import axios from "axios";
import { mainServerAppUrl } from "../../apis/mainapi";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";

export default function WriteToUsForm({ fixNavbar }) {
    return (
        <>
            <header className="page-header">
                <div className="flex-40">
                    <h1>Write To Us</h1>
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
                            subject: Yup.string()
                                .required("Subject is Required")
                                .matches(/^(?!\s+$)/, "Please Enter the Subject"),
                            message: Yup.string()
                                .required("Message is Required")
                                .matches(/^(?!\s+$)/, "Please Enter the Message"),
                        })}
                        initialValues={{
                            subject: "",
                            message: "",
                        }}
                        onSubmit={(fields, { resetForm }) => {
                            axios
                                .post(
                                    mainServerAppUrl + "/writeToUs/add-writeToUs",
                                    fields
                                )
                                .then(async (res) => {
                                    if (res.status === 200) {
                                        toast.success("Write To Us sent Successfully", {
                                            duration: 2000,
                                        });
                                        resetForm()
                                    }
                                })
                                .catch((err) => {
                                    if (err) {
                                        toast.error("Message not sent!", {
                                            duration: 2000,
                                        });
                                    }
                                });
                        }}
                        render={({ errors, status, touched }) => (
                            <Form>
                                <div className="card-body">
                                    <div className="form-group">
                                        <label className="form-label">
                                            Subject{" "}
                                            <sup className="required">
                                                <i className="fa-solid fa-star-of-life"></i>
                                            </sup>
                                        </label>
                                        <Field
                                            name="subject"
                                            type="text"
                                            className={
                                                "form-control" +
                                                (errors.subject && touched.subject
                                                    ? " is-invalid"
                                                    : "")
                                            }
                                        />
                                        <ErrorMessage
                                            className="invalid-feedback"
                                            component="div"
                                            name="subject"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">
                                            Message{" "}
                                            <sup className="required">
                                                <i className="fa-solid fa-star-of-life"></i>
                                            </sup>
                                        </label>
                                        <Field
                                            name="message"
                                            type="text"
                                            component="textarea"
                                            rows="8"
                                            className={
                                                "form-control" +
                                                (errors.message && touched.message
                                                    ? " is-invalid"
                                                    : "")
                                            }
                                        />
                                        <ErrorMessage
                                            className="invalid-feedback"
                                            component="div"
                                            name="message"
                                        />
                                    </div>
                                </div>
                                <div className="card-footer text-right">
                                    <button type="submit" className="btn btn-success">
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
