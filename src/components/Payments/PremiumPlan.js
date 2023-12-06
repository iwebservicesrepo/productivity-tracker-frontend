/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from "react";
import axios from "axios";
// import { Formik, Field, Form } from "formik";
// import { basicFormValidation } from "../Authentication/model/ValidationSchema";
// import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import { mainServerAppUrl } from "../../apis/mainapi";

import { getAuthUser } from "../Authentication/authHelpers";
import PayPalBtn from "./PayPalBtn";
import { useHistory, Link } from "react-router-dom";
import { getAllUserCount } from "../../ReduxStore/actions/userAction";
import { useDispatch, useSelector } from "react-redux";

function PremiumPlan(props) {
  let history = useHistory();
  const dispatch = useDispatch();
  const { allUserCount } = useSelector((state) => state.userReducer);
  const loginData = useSelector((state) => state.loginReducers?.allData);
  const [isModal, setIsModal] = useState(false);
  // const [show, setShow] = useState(false);
  // const [success, setSuccess] = useState(false);
  // const [erroMessage, setErrorMessage] = useState("");
  // const [orderId, setOrderId] = useState(false);
  // const [screenTrack, setScreenTrack] = useState(false);
  // const [users, setUsers] = useState("");
  // const [cycle, setCycle] = useState("");

  const [amount, setAmount] = useState();
  const [userCount, setUserCount] = useState(1);
  console.log(userCount);
  const [type, setType] = useState("monthly");
  const [plans, setPlans] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [tokenType, setTokenType] = useState("");
  const [accessToken, setAccessToken] = useState("");

  useEffect(() => {
    getPlans();
    dispatch(getAllUserCount());
    // get token
  }, [dispatch]);

  useEffect(() => {
    if (plans) {
      getSelectedPlan();
    }
    setUserCount(allUserCount?.length);
  }, [type, plans]);

  const getPlans = async () => {
    let { data } = await axios.get(mainServerAppUrl + "/razorpay/getplans");
    setPlans(data?.razorpayPlans?.items);
  };

  const getSelectedPlan = () => {
    const findSelectedPlan = plans.find((item) => item.period === type);
    setSelectedPlan(findSelectedPlan);
    setAmount(findSelectedPlan.item.amount / 10);
  };

  // Razorpay Code
  const checkoutHandler = async () => {
    try {
      const data = await axios.get(mainServerAppUrl + "/razorpay");

      if (data.status === 200) {
        const subscription = await axios.post(
          mainServerAppUrl + "/razorpay/subscriptions",
          { quantity: userCount, selectedPlan: selectedPlan }
        );

        if (subscription.status === 200) {
          let finalAmount = type
            ? (userCount * amount * 1) / 10
            : Math.round(
              userCount * amount * 12 -
              ((20 / 100) * userCount * amount * 12).toFixed(1)
            ) / 100;

          const options = {
            key: data.data.razorpay,
            subscription_id: subscription.data.id,
            name: "ProdChimp",
            currency: "INR",
            description: "Monthly Test Plan",
            callback_url:
              mainServerAppUrl +
              `/razorpay/verification?Type=${type}&FinalAmount=${finalAmount}`,
            redirect: true,
            prefill: {
              name: getAuthUser()?.name,
              email: getAuthUser()?.emailId,
              contact: "",
            }
            // theme: {
            //   color: "#F37254",
            // },
          };

          const razor = new window.Razorpay(options);
          razor.open();
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Pay Pal code

  const paypalSubscribe = (data, actions) => {
    return actions.subscription.create({
      plan_id:
        type == "monthly"
          ? "P-0DD4292349749733VMOJQDEQ"
          : "P-9UH88007P7979415DMOJQXXQ",
      quantity: userCount,
    });
  };
  const paypalOnError = (err) => {
    console.log(err);
    history.push({
      pathname: "/failed",
      state: { detail: err },
    });
  };

  const paypalOnApprove = (data, detail) => {
    // axios.post(mainServerAppUrl + "/post-responses", {
    //   responses: data,
    //   paymentGateway: "PayPal",
    //   quantity: userCount,
    //   type: type,
    //   finalAmount: type
    //     ? (userCount * amount * 1) / 10
    //     : Math.round(
    //         userCount * amount * 12 -
    //           ((20 / 100) * userCount * amount * 12).toFixed(1)
    //       ) / 100,
    // });
    console.log("data", data);
    console.log("details", detail);
    // call the backend api to store transaction details
    // get token information
    const getToken = axios
      .post(
        "https://api-m.sandbox.paypal.com/v1/oauth2/token",
        new URLSearchParams({
          grant_type: "client_credentials",
        }),
        {
          auth: {
            username:
              "AZ65U47yga7ezAZsUuzO2Wt9PcrqZqs-vOdODxW2oizdTvSXK_8_WhR09KzsTiYa30-vWwiIQqGp5TCi",
            password:
              "EEZiHJYAoxnut8NkxufZ7bh_fvj5PE3BOSmnC51hJNe3qRsL1apeuBLUc38Famhxi1wNAgDnwG9iaClw",
          },
        }
      )
      .then((response) => {
        setTokenType(response.data.token_type);
        const responseAccessToken = response.data.access_token;
        localStorage.setItem("tokenPay", responseAccessToken);
        setAccessToken(response.data.access_token);

        const getSubscriptiondetails = fetch(
          `https://api-m.sandbox.paypal.com/v1/billing/subscriptions/${data.subscriptionID}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${responseAccessToken}`,
            },
          }
        )
          .then((res) => res.json())
          .then((response) => {
            console.log(response);
            axios.post(mainServerAppUrl + "/paypal-subscription", {
              response: response,
            });
            axios.post(mainServerAppUrl + "/post-responses", {
              responses: data,
              paymentGateway: "PayPal",
              quantity: userCount,
              type: type,
              finalAmount: type
                ? (userCount * amount * 1) / 10
                : Math.round(
                  userCount * amount * 12 -
                  ((20 / 100) * userCount * amount * 12).toFixed(1)
                ) / 100,
            });
          })
          .catch((error) => {
            console.log("getSubscriptiondetails", error);
          });
      })
      .catch((err) => {
        console.log(err);
      });

    // get subscription information

    history.push({
      pathname: "/verification",
      state: { detail: data },
    });
  };

  // Pay Pal code

  return (
    <>
      <div className="payment-cards-item">
        <div className="card premium-plan">
          <div className="ribbon">
            <img src={require("../../images/Frame.png")} alt="" />
          </div>
          <div className="card-body">
            <div className="card-category">Premium</div>
            <h1>
              $1.5<span>User/month</span>
            </h1>
            <button
              className="btn btn-primary"
              onClick={() => {
                setIsModal(true);
              }}
            >
              UPGRADE TO PREMIUM
            </button>
            <ul className="leading-loose">
              <li>Time tracking</li>
              <li>Activity tracking</li>
              <li>Up to 100 users</li>
              <li>5,10 & 15 Mins of frequency for screenshot capture</li>
              <li>12 months YTD retention of screenshots</li>
              <li>Only App-usage report for last 7 days</li>
              <li>12 months YTD retention of App-usage statistics</li>
              <li>Phone, Email & chat support</li>
            </ul>
            <button
              onClick={() => {
                setIsModal(true);
              }}
              type="submit"
              className="btn btn-primary"
            >
              UPGRADE TO PREMIUM
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
            className="modal-dialog modal-dialog-centered plan-modal modal-md"
            role="document"
          >
            <div className="modal-content">
              <div className="modal-header">
                PREMIUM
                <button
                  type="button"
                  className="close"
                  data-dismiss="modal"
                  onClick={() => {
                    setIsModal(false);
                    setUserCount(allUserCount?.length);
                  }}
                  aria-label="Close"
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>

              <div className="modal-body">
                <div className="row">
                  <div className="col-md-12 plan-modal-content">
                    <div className="form-group">
                      <label className="form-label">Number of Users</label>
                      <div className="input-group">
                        <div className="input-group-prepend">
                          <button
                            type="button"
                            disabled={userCount === allUserCount?.length}
                            className="input-group-text"
                            onClick={() => setUserCount(Number(userCount) - 1)}
                          >
                            <i className="fa fa-minus"></i>
                          </button>
                        </div>
                        <input
                          name="totalUser"
                          type="number"
                          className="form-control text-center"
                          value={userCount}
                          onChange={(e) => setUserCount(e.target.value)}
                          disabled
                        />
                        <div className="input-group-append">
                          <button
                            type="button"
                            className="input-group-text"
                            onClick={() => setUserCount(Number(userCount) + 1)}
                          >
                            <i className="fa fa-plus"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Subscription Cycle</label>
                      <div className="selectgroup feedback-group">
                        <label className="selectgroup-item">
                          <input
                            type="radio"
                            name="Type"
                            value="Monthly"
                            className="selectgroup-input"
                            // checked={type === "monthly"}
                            defaultChecked
                            onChange={() => setType("monthly")}
                          />
                          <span className="selectgroup-button">Monthly</span>
                        </label>
                        <label className="selectgroup-item">
                          <span
                            className="badge badge-warning"
                            style={{
                              position: "absolute",
                              top: "-10px",
                              right: "5px",
                              fontSize: "11px",
                              zIndex: "4",
                              color: "#000",
                            }}
                          >
                            20% Off
                          </span>
                          <input
                            type="radio"
                            name="Type"
                            className="selectgroup-input"
                            value="Yearly"
                            // checked={type === "yearly"}
                            onChange={() => setType("yearly")}
                          />
                          <span className="selectgroup-button">Yearly</span>
                        </label>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-12">
                    <div className="form-group">
                      <label className="form-label">
                        <p className="m-0">
                          {type === "monthly" ? (
                            ""
                          ) : (
                            <>
                              <strong>Total Yearly Amount</strong>
                              <span>
                                {Math.round(userCount * 100 * 12)}{" "}
                                {<small>INR</small>}
                              </span>
                            </>
                          )}
                        </p>
                        <p className="m-0">
                          {type === "monthly" ? (
                            ""
                          ) : (
                            <>
                              <strong>Discount (20%)</strong>
                              <span>
                                {" "}
                                {Math.round(
                                  (20 / 100) * userCount * 100 * 12
                                )}{" "}
                                {<small>INR</small>}
                              </span>
                            </>
                          )}
                        </p>
                        <p className="m-0">
                          <strong> Total Amount</strong>
                          {type ? (
                            <span>
                              {(userCount * amount * 1) / 10}{" "}
                              {<small>INR</small>}
                            </span>
                          ) : (
                            <span>
                              {Math.round(
                                userCount * amount * 12 -
                                (
                                  (20 / 100) *
                                  userCount *
                                  amount *
                                  12
                                ).toFixed(1)
                              ) / 100}{" "}
                              {<small>INR</small>}
                            </span>
                          )}
                        </p>
                      </label>
                    </div>
                  </div>
                </div>
                <div className="plan-modal-footer">
                  {type === "monthly" ? (
                    <div className="row">
                      <div className="col-md-12 mb-2">
                        {loginData?.organization?.countryCode !== "+91" ? (
                          // <PayPalBtn
                          //   // amount={type === "monthly"
                          //   //   && userCount * amount * 1
                          //   //  }
                          //   amount="20"
                          //   currency="USD"
                          //   createSubscription={paypalSubscribe}
                          //   onApprove={paypalOnApprove}
                          //   catchError={paypalOnError}
                          //   onError={paypalOnError}
                          //   onCancel={paypalOnError}
                          // />
                          ""
                        ) : (
                          <button
                            onClick={() => {
                              console.log("first");
                              checkoutHandler();
                            }}
                            className="btn btn-primary"
                          >
                            Pay via Razorpay
                          </button>
                        )}
                      </div>
                      <div className="col-md-12">
                        <button
                          type="reset"
                          className="btn btn-secondary"
                          data-dismiss="modal"
                          onClick={() => {
                            setIsModal(false);
                            setUserCount(allUserCount?.length);
                          }}
                        >
                          Cancel Payment
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="row">
                      <div className="col-md-12 mb-2"></div>
                      <div className="col-md-12 mb-2">
                        {loginData?.organization?.countryCode !== "+91" ? (
                          // <PayPalBtn
                          //   amount={
                          //     type === "yearly" &&
                          //     Math.round(
                          //       userCount * amount * 12 -
                          //         (
                          //           (20 / 100) *
                          //           userCount *
                          //           amount *
                          //           12
                          //         ).toFixed(1)
                          //     )
                          //   }
                          //   currency="USD"
                          //   createSubscription={paypalSubscribe}
                          //   onApprove={paypalOnApprove}
                          //   catchError={paypalOnError}
                          //   onError={paypalOnError}
                          //   onCancel={paypalOnError}
                          // />
                          ""
                        ) : (
                          <button
                            onClick={() => {
                              console.log("first");
                              checkoutHandler();
                            }}
                            className="btn btn-primary"
                          >
                            Pay via Razorpay
                          </button>
                        )}
                      </div>
                      <div className="col-md-12">
                        <button
                          type="reset"
                          className="btn btn-secondary"
                          data-dismiss="modal"
                          onClick={() => {
                            setIsModal(false);
                            setUserCount(allUserCount?.length);
                            // setType(false);
                          }}
                        >
                          Cancel Payment
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default PremiumPlan;
