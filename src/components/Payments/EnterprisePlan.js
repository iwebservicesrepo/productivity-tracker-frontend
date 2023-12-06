import React, { useState } from "react";
import axios from "axios";
import { Formik, Field, Form, ErrorMessage } from "formik";
import { basicFormValidation } from "../Authentication/model/ValidationSchema";
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import { mainServerAppUrl } from "../../apis/mainapi";
import toast from "react-hot-toast";
import * as Yup from 'yup';
import { CountryCodes } from "../common/CountryCodes";
import ReactFlagsSelect from "react-flags-select";



const __DEV__ = document.domain === "localhost";
function PopupEnterprise(props) {
  const [isModal, setIsModal] = useState(false);
  const [success, setSuccess] = useState(false);
  const [erroMessage, setErrorMessage] = useState("");
  const [orderId, setOrderId] = useState(false);;

  const [amount, setAmount] = useState(122.13);
  const [userCount, setUserCount] = useState(3);
  const [type, setType] = useState(true)
  const [duration, setDuration] = useState('Monthly')
  let [newLabels, setCustomLabels] = useState({});
  const [selected, setSelected] = useState("IN");
  const [selectedCountry, setselectedCountry] = useState({
    code: "+91",
    country: "India",
    iso: "",
  });
  // Pay Pal code
  const createOrder = (data, actions) => {
    return actions.order
      .create({
        purchase_units: [
          {
            description: "Book",
            amount: {
              currency_code: "USD",
              value: props.payment,
            },
          },
        ],
        application_context: {
          shipping_preference: "NO_SHIPPING",
        },
      })
      .then((orderID) => {
        setOrderId(orderID);
        return orderID;
      });
  };

  const onApprove = (data, actions) => {
    return actions.order.capture().then(function (details) {
      setSuccess(true);
      console.log(details);

      axios.post(mainServerAppUrl + "/post-responses", {
        responses: details,
      });
    });
  };

  function getCountryCode(C_code) {
    console.log(C_code);

    let newCountry = CountryCodes.map((data) => {
      return {
        code: "+" + data.code,
        country: data.country,
        iso: data.iso
      }
    })
    let a = newCountry.find((code) => {
      return code.iso == C_code;
    });

    setSelected(C_code);
    setselectedCountry({ ...a });
  }

  const onError = (data, action) => {
    setErrorMessage("An error occured with the payment");
  };
  // Pay Pal code

  return (
    <>
      <div className="payment-cards-item">
        <div className="card">
          <div className="card-body">
            <div className="card-category">Enterprise</div>
            <h1>$3<span>User/month</span></h1>
            <button className="btn btn-outline-primary"
              onClick={() => setIsModal(true)}
              type="submit"
            >
              Contact Us
            </button>
            <ul className="leading-loose">
              <li>
                Time tracking
              </li>
              <li>
                Activity tracking
              </li>
              <li>
              Unlimited users
              </li>
              <li>
                5,10 & 15 Mins of frequency for screenshot capture
              </li>
              <li>
                12 months YTD retention of screenshots
              </li>
              <li>
                Only App-usage report for last 7 days
              </li>
              <li>
                12 months YTD retention of App-usage statistics
              </li>
              <li>
                <a href="#"> Use your own DataStore (GDrive / S3 / Dropbox) for Data storage</a>
              </li>
            </ul>
            <button className="btn btn-outline-primary"
              onClick={() => setIsModal(true)}
              type="submit"
            >
              Contact Us
            </button>
          </div>
        </div>
      </div>
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
                {/* <div style={{ paddingLeft: "10px" }} className="w-100">
                       <label style={{ fontSize: "16px", fontWeight: 400 }}>Subscription Plan Setting</label>
                     </div> */}
                ENTERPRISE
                <button
                  type="button"
                  className="close"
                  data-dismiss="modal"
                  onClick={() => {
                    setIsModal(false);
                    setType(false);
                    setUserCount(3)
                  }}
                  aria-label="Close"
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <Formik
                initialValues={{
                  organization: '',
                  email: '',
                  organizationWebsite: '',
                  notes: '',
                  phone: '',

                }}
                validationSchema={Yup.object().shape({
                  organization: Yup.string().required('Organization Name is Required').matches(
                    /^(?!\s+$)/,
                    "Please Enter Organization Name"
                  ).matches(/^[^@.]*$/, "Enter a valid Organization Name"),
                  email: Yup.string()
                    .required('Email is required').email('Enter correct email').matches(
                      /^(?!\s+$)/,
                      "Please Enter your Email"
                    ),
                  organizationWebsite: Yup.string()
                    .required('Organization Website is required').url("Enter a valid website").matches(
                      /^(?!\s+$)/,
                      "Please Enter Organization Website"
                    ),
                  notes: Yup.string().required('Notes is required').matches(
                    /^(?!\s+$)/,
                    "Please Enter Notes"
                  ),
                  phone: Yup.number()
                    .typeError("You must specify a number")
                    .required("Phone number field required")
                    .min(11111, "Minimum 5 digits required")
                    .max(111111111111111, "Maximum 15 digits allowed"),
                })}
                onSubmit={async (fields, { resetForm }) => {
                  let finalValues = {
                    ...fields,
                    duration: duration,
                    userCount: userCount,
                    countryCode: selectedCountry.code,
                    country: selectedCountry.country
                  }
                  await axios.post(mainServerAppUrl + "/enterprise-plan-request", finalValues)
                    .then(() => {
                      toast.success("Request Received, our team will get in touch shortly", { duration: 5000 })
                      setIsModal(false)
                    }).catch((err) => {
                      console.log(err)
                      toast.error("Something went wrong!")
                      setIsModal(false)
                    })
                }}
                render={({ errors, status, touched }) => (
                  <Form>
                    <div className="card-body">
                      <div className="form-group" >
                        <label className="form-label">
                          Number of Users <span className="required"><i className="fa-solid fa-star-of-life"></i></span>
                        </label>
                        <div className="input-group">
                          <div className="input-group-prepend">
                            <button type="button" disabled={userCount === 1} className="input-group-text" onClick={() => setUserCount(Number(userCount) - 1)} ><i className="fa fa-minus"></i></button>
                          </div>
                          <input
                            name="totalUser"
                            type="number"
                            min={1}
                            className="form-control text-center"
                            value={userCount}
                            onChange={(e) => setUserCount(e.target.value)}
                            disabled
                          />
                          <div className="input-group-append">
                            <button type="button" className="input-group-text" onClick={() => setUserCount(Number(userCount) + 1)} ><i className="fa fa-plus"></i></button>
                          </div>
                        </div>
                      </div>
                      <div className="form-group">
                        <label className="form-label">
                          Subscription Cycle <span className="required"><i className="fa-solid fa-star-of-life"></i></span>
                        </label>
                        <div className="selectgroup w-100 feedback-group" >
                          <label className="selectgroup-item">
                            <input
                              type="radio"
                              name="Type"
                              value="Monthly"
                              className="selectgroup-input"
                              // checked={type === "monthly"}
                              defaultChecked
                              onChange={(e) => setDuration(e.target.value)}
                            />
                            <span className="selectgroup-button">
                              Monthly
                            </span>
                          </label>
                          <label className="selectgroup-item">
                            <input
                              type="radio"
                              name="Type"
                              className="selectgroup-input"
                              value="Yearly"
                              // checked={type === "yearly"}
                              onChange={(e) => setDuration(e.target.value)}
                            />
                            <span className="selectgroup-button">
                              Yearly
                            </span>
                          </label>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-6">
                          <div className="form-group">
                            <label className="form-label">Name of the Organization <span className="required"><i className="fa-solid fa-star-of-life"></i></span></label>
                            <Field name="organization" type="text" className={'form-control' + (errors.organization && touched.organization ? ' is-invalid' : '')} />
                            <ErrorMessage name="organization" component="div" className="invalid-feedback" />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="form-group">
                            <label className="form-label">Email ID <span className="required"><i className="fa-solid fa-star-of-life"></i></span></label>
                            <Field name="email" type="text" className={'form-control' + (errors.email && touched.email ? ' is-invalid' : '')} />
                            <ErrorMessage name="email" component="div" className="invalid-feedback" />
                          </div>
                        </div>
                      </div>


                      <div className="form-group">
                        <label className="form-label">
                          Country & Phone Number<span className="required"><i className="fa-solid fa-star-of-life"></i></span>
                        </label>
                        <div style={{ display: "flex", gap: " 10px" }}>
                          <ReactFlagsSelect
                            selected={selected}
                            onSelect={(code) => getCountryCode(code)}
                            searchable={true}
                            showSecondaryOptionLabel={true}
                            selectedSize={13}
                            optionsSize={10}
                            fullWidth={false}
                            placeholder="#"
                            customLabels={newLabels}
                          />

                          <div className="input-icon" style={{ width: "100%" }}>
                            <span
                              style={{
                                fontSize: "14px",
                                top: "44%",
                                transform: "translateY(-50%)",
                              }}
                              className="input-icon-addon"
                            >
                              {selectedCountry?.code}
                            </span>
                            <Field
                              type="number"
                              className={'form-control w-100' + (errors.phone && touched.phone ? ' is-invalid' : '')}
                              placeholder="Phone Number"
                              name="phone"
                            />
                          </div>
                        </div>
                        <ErrorMessage name="phone" component="div" className="invalid-feedback" />
                        {!selectedCountry?.code ? (
                          <div
                            style={{
                              color: "rgb(220, 53, 69)",
                              fontSize: "12px",
                            }}
                          >
                            Select Country Code.
                          </div>
                        ) : (
                          ""
                        )}
                      </div>
                      <div className="form-group">
                        <label className="form-label">Website of the Organization <span className="required"><i className="fa-solid fa-star-of-life"></i></span></label>
                        <Field name="organizationWebsite" type="text" className={'form-control' + (errors.organizationWebsite && touched.organizationWebsite ? ' is-invalid' : '')} />
                        <ErrorMessage name="organizationWebsite" component="div" className="invalid-feedback" />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Notes<span className="required"><i className="fa-solid fa-star-of-life"></i></span></label>
                        <Field component="textarea" rows="4" name="notes" type="text" className={'form-control' + (errors.notes && touched.notes ? ' is-invalid' : '')} />
                        <ErrorMessage name="notes" component="div" className="invalid-feedback" />
                      </div>
                    </div>
                    <div className="card-footer text-right">
                      <button className="btn btn-primary btn-block" type="submit">Submit Request</button>
                    </div>
                  </Form>
                )}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default PopupEnterprise;
