import React, { useEffect, useState } from "react";
import { Field, Form, Formik, ErrorMessage, useFormikContext } from "formik";
import * as Yup from 'yup';
import axios from "axios";
import { mainServerAppUrl } from "../../apis/mainapi";
import { getAuthUser, getCookie, getPayload, iss, setCookie } from "../Authentication/authHelpers";
import toast from "react-hot-toast";

export default function ChangePassword({ fixNavbar }) {
    const [finalPayload, setFinalPayload] = useState({});
    const [isModal, setIsModal] = useState(false);
    const [togglePassword, setTogglePass] = useState(true);
    const [spclCharCheck, setSpclCharCheck] = useState(false);
    const [lowerCaseCheck, setlowerCaseCheck] = useState(false);
    const [checkNumber, setCheckNumber] = useState(false);
    const [checkUpperCase, setcheckUpperCase] = useState(false);
    const [checkLength, setcheckLength] = useState(false);

    const showPassword = () => {
        setTogglePass(!togglePassword);
    };

    const FormObserver = () => {
        const { values } = useFormikContext();
        let checkSpecialChar = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
        useEffect(() => {
            setSpclCharCheck(checkSpecialChar.test(values["password"]));
            setlowerCaseCheck(/[a-z]/.test(values["password"]));
            setCheckNumber(/\d/.test(values["password"]));
            setcheckUpperCase(/[A-Z]/.test(values["password"]));
            values["password"].length >= 8
                ? setcheckLength(true)
                : setcheckLength(false);
        }, [values]);


        return null;

    };

    const submitForm = async (formData) => {
        try {
            let { data } = await axios.post(
                mainServerAppUrl + "/change-password",
                formData
            );

            let cookie = {
                name: "_token",
                value: data.userDetails.token,
                days: 30,
            };
            console.log(cookie)
            setCookie(cookie);

            const token = getCookie("_token");
            const payload = getPayload(token);

            // if (payload.iss === iss.changePassword) {
                window.location.reload();
            // }
            toast.success("Password Changed Successfully", {id:"Password Changed", duration: 5000 })
        } catch (error) {
            toast.error(error.response.data.error, { duration: 5000 })
        }
    };

    return (
        <>
            <header className="page-header">
                <div className="flex-40">
                    <h1>Change Password</h1>
                </div>
                <div className="flex-60">

                </div>
            </header>
            <div className={`section-body ${fixNavbar ? "marginTop" : ""}`}>
                <div className="card" style={{ width: "500px" }}>
                    <Formik
                        initialValues={{
                            oldPassword: '',
                            password: '',
                            confirmPassword: '',
                        }}
                        validationSchema={Yup.object().shape({
                            oldPassword: Yup.string().required('Old Password is Required'),
                            password: Yup.string()
                                .required('New Password is required').matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/, 'Password does not meet the requirement'),
                            confirmPassword: Yup.string()
                                .oneOf([Yup.ref('password'), null], 'Passwords must match')
                                .required('Confirm Password is required')
                        })}
                        onSubmit={(fields, { resetForm }) => {
                            setFinalPayload(fields)
                            setIsModal(true);
                        }}
                        render={({ errors, status, touched }) => (
                            <Form>
                                <div className="card-body">
                                    <div className="form-group">
                                        <label className="form-label">Old Password<sup className="required"><i className="fa-solid fa-star-of-life"></i></sup></label>
                                        <Field name="oldPassword" type="password" className={'form-control' + (errors.oldPassword && touched.oldPassword ? ' is-invalid' : '')} />
                                        <ErrorMessage name="oldPassword" component="div" className="invalid-feedback" />
                                    </div>
                                    <div className="form-group passwordIns">
                                        <label className="form-label">New Password<sup className="required"><i className="fa-solid fa-star-of-life"></i></sup></label>
                                        <div className="input-group">
                                            <Field name="password" type={togglePassword ? "password" : "text"} className={'form-control' + (errors.password && touched.password ? ' is-invalid' : '')} />
                                            <div className="card passwordPopover">
                                                <ul>
                                                    <li>
                                                        <small
                                                            className={`form-text   ${checkNumber ? "text-green" : "text-muted"
                                                                }`}
                                                        >
                                                            At least 1 Digit
                                                        </small>
                                                    </li>
                                                    <li>
                                                        <small
                                                            className={`form-text   ${lowerCaseCheck ? "text-green" : "text-muted"
                                                                }`}
                                                        >
                                                            At least 1 Lower Case
                                                        </small>
                                                    </li>
                                                    <li>
                                                        <small
                                                            className={`form-text   ${checkUpperCase ? "text-green" : "text-muted"
                                                                }`}
                                                        >
                                                            At least 1 Upper Case
                                                        </small>
                                                    </li>
                                                    <li>
                                                        <small
                                                            className={`form-text   ${spclCharCheck ? "text-green" : "text-muted"
                                                                }`}
                                                        >
                                                            At least 1 Special Character
                                                        </small>
                                                    </li>
                                                    <li>
                                                        <small className={`form-text   ${checkLength ? "text-green" : "text-muted"}`}>
                                                            Minimum Length is 8 Character Long.
                                                        </small>
                                                    </li>
                                                </ul>
                                            </div>
                                            <div className="input-group-append">
                                                <span
                                                    onClick={showPassword}
                                                    style={{
                                                        cursor: "pointer",
                                                        position: "relative"
                                                    }}
                                                    className="input-group-text"
                                                >
                                                    <i style={{
                                                        cursor: "pointer",
                                                    }}
                                                        className="fa fa-eye"></i>
                                                    {!togglePassword ? "" : <span className="slash" style={{
                                                        position: "absolute",
                                                        top: "50%",
                                                        left: "50%",
                                                        transform: "translate(-50%,-50%)",
                                                        fontSize: "25px"
                                                    }}>/</span>}
                                                </span>
                                            </div>
                                            <ErrorMessage name="password" component="div" className="invalid-feedback" />
                                        </div>

                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Confirm Password<sup className="required"><i className="fa-solid fa-star-of-life"></i></sup></label>
                                        <Field name="confirmPassword" type="password" className={'form-control' + (errors.confirmPassword && touched.confirmPassword ? ' is-invalid' : '')} />
                                        <ErrorMessage name="confirmPassword" component="div" className="invalid-feedback" />
                                    </div>
                                </div>
                                <div className="card-footer text-right">
                                    <button className="btn btn-success btn-block" type="submit">Update Password</button>
                                </div>
                                <FormObserver />
                            </Form>
                        )}
                    />
                </div>
            </div>

            {
                isModal && (
                    <div
                        className="modal d-block"
                        aria-labelledby="exampleModalLabel"
                        aria-hidden="true"
                    >
                        <div
                            className="modal-dialog modal-dialog-centered modal-md delete-modal"
                            role="document"
                        >
                            <div className="modal-content">
                                <div className="modal-body">
                                    <div className="delete-icon">
                                        <img
                                            src={require("../../images/monkey.png")}
                                            alt="logoProd2.png"
                                        />
                                    </div>
                                    <h1>Ok!</h1>
                                    <strong>
                                        Confirmation
                                        <span className="text-red"></span>
                                    </strong>
                                    <p
                                        className="text-secondary"
                                        style={{ fontSize: "14px", fontWeight: "600" }}
                                    >
                                        Are you sure you want to <br />
                                        change your password?
                                    </p>
                                    <div className="delete-footer">
                                        <button
                                            type="reset"
                                            className="btn btn-secondary"
                                            data-dismiss="modal"
                                            onClick={() => {
                                                setIsModal(false)
                                            }}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="btn btn-primary"
                                            onClick={() => {
                                                submitForm(finalPayload)
                                                setIsModal(false)
                                            }}
                                        >
                                            Confirm
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }
        </>
    )
}
