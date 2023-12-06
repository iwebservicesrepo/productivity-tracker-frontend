import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { mainServerAppUrl } from "../../apis/mainapi";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { getUser } from "../../ReduxStore/actions/userAction";
import Loaders from "../Loaders/Loaders";
import { useHistory } from "react-router-dom";
import { getAllLoginData } from "../../ReduxStore/actions/loginAction";



export default function SubscriptionDetails() {
  const permissions = useSelector((state: any) => state.loginReducers?.allData);
  const dispatch: any = useDispatch();
  const history = useHistory();
  const [details, setDetails] = useState([]);
  const [userCount, setUserCount]: any = useState(3);
  const [finalAmount, setfinalAmount]: any = useState(3);
  const [invoice, setInvoice] = useState("");
  const [subscriptionId, setSubscriptionId] = useState("");

  const { userList } = useSelector((state: any) => state.userReducer);
  const [page, setPage] = useState(0);
  const [totalPage, setTotalPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [isModal, setIsModal] = useState(false);
  const [isErrorModal, setErrorModal] = useState(false);
  const [isCancelModal, setCancelModal] = useState(false);
  const [changePlanModal, setChangePlanModal] = useState(false);
  const [changePlanModal2, setChangePlanModal2] = useState(false);
  const [subDetails, setSubDetails]: any = useState([]);
  const [isSeatModal, setSeatModal] = useState(false);
  const [accessToken, setAccessToken] = useState("");
  const [changeCycle, setChangeCycle] = useState("monthly");
  const [isUpdateModal, setUpdateModal] = useState(false);
  const [active, setActive] = useState("");
  const [link, setLink] = useState("")
  const [linkModal, setLinkModal] = useState(false)
  const [cardNumber, setCardNumber] = useState("")
  const [upiId, setUpiId] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("")
  const [nextDate, setNextDate]: any = useState("")
  const isRetrying = useRef(false)
  // const [lastFourDigits, setLastFourDigits] = useState("");

  async function total() {
    const userSubscription = await axios.get(
      mainServerAppUrl + "/get-subscription"
    );
    const total = userSubscription.data.subscriptions.length;
    setTotalPage(Math.ceil(total / pageSize));
  }
  total();


  const intervalRef = React.useRef<null | NodeJS.Timeout>(null);
  async function webhookResponse() {
    if (active === "true") return;
    const status = await axios.get(
      mainServerAppUrl + "/active/subscription-status"
    );
    if (status?.data?.success === 'false') {
      if (isRetrying.current === false) {
        isRetrying.current = true;
        setTimeout(() => {
          // console.log("clear interval")
          clearInterval(intervalRef.current)
        }, 200000)
      }
      setActive("true");
      return;
    } else {
      isRetrying.current = true;
      clearInterval(intervalRef.current)
      dispatch(getAllLoginData())
      setActive(status?.data?.success);
    }


  }
  // console.log(active)


  useEffect(() => {
    const timer = setInterval(() => {
      // console.log("webhook response")
      webhookResponse()
    }, 5000);
    intervalRef.current = timer;
    return () => clearInterval(timer);
  }, [])

  useEffect(() => {
    setUserCount(subDetails?.quantity);
    setChangeCycle(subDetails?.type);
  }, [subDetails]);

  async function getDetails(page) {
    const userSubscription = await axios.get(
      mainServerAppUrl + "/get-subscription"
    );
    const length = userSubscription.data.subscriptions.length;

    setSubDetails(userSubscription.data?.subscriptions[length - 1]);

    const SubscriptionId =
      userSubscription?.data?.subscriptions[length - 1].id;
    setSubscriptionId(SubscriptionId);
    setfinalAmount(userSubscription.data?.subscriptions[length - 1].quantity);
    getInvoices(userSubscription);
    // console.log(userSubscription)
    setPaymentMethod(userSubscription.data?.subscriptions[length - 1].paymentMethod)
    setUpiId(userSubscription.data?.subscriptions[length - 1].upi_id)
    setCardNumber(userSubscription.data?.subscriptions[length - 1].cardNumber)
    setNextDate(userSubscription.data?.subscriptions[length - 1].charge_At)

  }
  useEffect(() => {
    getDetails(page);
    // get Details
  }, [page]);
  useEffect(() => {
    // getPaymentId();
    // getCardDetails();
    dispatch(getUser());
  }, [dispatch]);
  // ///////////

  //  Function to get Card details Starts
  // const getPaymentId = async () => {
  //   let { data } = await axios.get(mainServerAppUrl + "/razorpay/getpaymentid");
  //   const PaymentId = data.orderId;

  //   getCardDetails(data.orderId);
  // };
  // // /////////
  // const getCardDetails = async (Payid) => {
  //   let { data } = await axios.get(
  //     mainServerAppUrl + `/razorpay/getcarddetails/${Payid}`
  //   );

  //   const lastdigit = data.last4;
  //   setLastFourDigits(lastdigit);
  // };
  //  Function to get Card details Ends

  // /////////
  async function getInvoices(userSubscription) {
    const length = userSubscription.data.subscriptions.length;
    let subscriptionId = userSubscription?.data?.subscriptions[length - 1]?.id;
    if (
      userSubscription?.data?.subscriptions[length - 1]?.paymentGateway === "RazorPay"
    ) {
      const userInvoice: any = await axios.post(
        mainServerAppUrl + `/razorpay/invoice/${subscriptionId}`
      );
      setInvoice(userInvoice?.data?.invoices);
      setDetails(userInvoice?.data);
      // console.log(userInvoice?.data)
      // window.open(`${userInvoice.data}`, '_blank');
      // window.location.href = `${userInvoice.data}`
    } else {
      axios
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
          fetch(
            "https://api-m.sandbox.paypal.com/v2/invoicing/invoices?total_required=true",
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${response.data.access_token}`,
              },
            }
          )
            .then((response) => response.json())
            .then((data) => console.log(data));
        });
    }
  }

  async function updateSubscriptionQuantityPlan() {
    const updateSub: any = await axios.patch(
      mainServerAppUrl + `/razorpay/update-subscription-plan/${subscriptionId}`,
      {
        quantity: userCount,
        // plan_id: "plan_KmGoJX9g5WaP7f",
        plan_id:
          changeCycle === "monthly"
            ? "plan_KqxQZYB1tkQtE0"
            : "plan_KmGoJX9g5WaP7f",

        remaining_count: "98",
      }
    );
    if (updateSub.status === 200) {
      if (updateSub.data.success) {
        toast.success("Your Subscription has been Updated", { duration: 2000 });
      } else {
        toast.error(updateSub.data.message, {
          duration: 2500,
        });
      }
    } else {
      toast.error("Your Subscription has not been Updated", {
        duration: 2000,
      });
    }
    getDetails(page);
  }

  async function cancelSubscription() {
    const cancelSub: any = await axios.post(
      mainServerAppUrl + `/razorpay/cancel-subscription/${subscriptionId}`
    );
    if (cancelSub.status === 200) {
      toast.success("Your Subscription has been cancelled", { duration: 2000 });
    } else {
      toast.error("Your Subscription has not been cancelled", {
        duration: 2000,
      });
    }
    permissions.subscriptionStatus = "cancelled"
    getDetails(page);
  }

  async function paypalCancelSubscription() {
    await axios
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
        fetch(
          `https://api-m.sandbox.paypal.com/v1/billing/subscriptions/${subscriptionId}/cancel`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${response.data.access_token}`,
            },
            // body: '{\n  "reason": "Not satisfied with the service"\n}',
            body: JSON.stringify({
              reason: "Not satisfied with the service",
            }),
          }
        );
      });
    await axios.post(mainServerAppUrl + `/paypal/cancel-subscription`,
      {
        subscriptionId,
      })
  }

  async function updatePayPalSubscription() {
    await axios
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
        fetch(`https://api-m.sandbox.paypal.com/v1/billing/subscriptions/${subscriptionId}/revise`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${response.data.access_token}`
          },
          body: JSON.stringify({
            plan_id:
              changeCycle === "monthly"
                ? "P-0DD4292349749733VMOJQDEQ"
                : "P-9UH88007P7979415DMOJQXXQ",
            quantity: userCount
          })
        }).then(response => response.json())
          .then(result => setLink(result.links[0].href))
          .catch(error => console.log('error', error));
      });
    // await axios.post(mainServerAppUrl + `/paypal/update-subscription`,
    //   {
    //     responsePlanId,
    //     responseQuantity,
    //     subscriptionId,
    //   }
    // );

  }

  // console.log(permissions.subscriptionStatus);

  return (
    <>
      {active !== "true" ?
        <Loaders />
        :
        <>
          <header className="page-header">
            <div className="flex-40">
              <h1>Subscription Details</h1>
            </div>
            <div className="flex-60">
              <div className="d-flex justify-content-end align-item-center"></div>
            </div>
          </header>
          <div className="section-body">
            {permissions?.subscriptionStatus !== "active" ? "" :
              <ul className="subscriptionDetails-counter">
                <li>
                  <div className="counter-card">
                    <div className="subscriptionDetails-counter-div">
                      <p>{userList?.length}</p>
                      <h5> current Users</h5>
                    </div>
                    <div>
                      <div className="counter_header">
                        <h5>Up to {subDetails?.quantity} Users</h5>
                      </div>
                      <div className="counter-footer">
                        <div className="bottom-button d-flex justify-content-between">

                          <button
                            className="btn btn-primary"
                            onClick={() => {
                              setChangePlanModal(true);
                              setUpdateModal(true);
                            }}
                          >
                            Add User
                          </button>
                          <button
                            className="btn btn-primary"
                            onClick={() => {
                              setChangePlanModal(true);
                              setUpdateModal(false);
                            }}
                          >
                            Remove User
                          </button>

                        </div>
                      </div>
                    </div>
                  </div>
                </li>
                <li>
                  <div className="counter-card">
                    <div className="counter_header">
                      <p>Payment Method</p>
                      <h5>{subDetails?.paymentGateway}</h5>
                      {/* {subDetails?.paymentGateway === "RazorPay" ? (
                        <p>
                          <span>Card : </span>xxxx xxxx xxxx {lastFourDigits}
                        </p>
                      ) : (
                        <p>
                          <span>Card : </span>xxxx xxxx xxxx {lastFourDigits}
                        </p>
                      )} */}
                      {paymentMethod === "upi" ?
                        <p><span>UPI ID : {upiId}</span></p> :
                        <p><span>Card : {cardNumber}</span></p>}
                    </div>
                    <div className="counter-footer">
                      <div className="bottom-button d-flex justify-content-between">
                        {subDetails?.paymentGateway === "RazorPay" ? (
                          <a
                            href="https://dashboard.razorpay.com/signin?screen=sign_in"
                            target="_blank"
                            rel="noreferrer"
                          >
                            <button className="btn btn-primary">UPDATE</button>
                          </a>
                        ) : (
                          <a
                            href="https://www.paypal.com/in/signin"
                            target="_blank"
                            rel="noreferrer"
                          >
                            <button className="btn btn-primary">UPDATE</button>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </li>
                <li>
                  <div className="counter-card">
                    <div className="subscriptionDetails-counter-div">
                      {subDetails?.paymentGateway === "RazorPay" ? (
                        <p>
                          {subDetails?.type === "monthly" ? (
                            <>
                              <span>₹</span> {100 * finalAmount}
                            </>
                          ) : (
                            <>
                              <span>₹</span> {960 * finalAmount}
                            </>
                          )}
                        </p>
                      ) : (
                        <p>
                          {subDetails?.type === "monthly" ? (
                            <>
                              <span>$</span> {1.5 * finalAmount}
                            </>
                          ) : (
                            <>
                              <span>$</span> {14.40 * finalAmount}
                            </>
                          )}
                        </p>
                      )}

                      <h5>{subDetails?.type}</h5>
                    </div>
                    <div>
                      <div className="counter_header">
                        <p>Pricing Plan</p>
                        <h5>Premium</h5>
                        <p>Status :  {active === "true" ? <span className="badge badge-success">Active</span> :
                          <span className="badge badge-danger">Canceled</span>}
                        </p>
                      </div>
                      <div className="counter-footer">
                        {subDetails?.paymentGateway === "RazorPay" ? (
                          <div className="bottom-button d-flex justify-content-between">
                            <button
                              className="btn btn-primary"
                              onClick={() => setChangePlanModal2(true)}
                            >
                              CHANGE PLAN
                            </button>

                            <button
                              className="btn btn-secondary"
                              onClick={() => setCancelModal(true)}
                            >
                              CANCEL
                            </button>
                          </div>
                        ) : (
                          <div className="bottom-button d-flex justify-content-between">
                            <button
                              className="btn btn-primary"
                              // onClick={() => setChangePlanModal(true)}
                              onClick={() => setChangePlanModal2(true)}
                            >
                              CHANGE PLAN
                            </button>

                            <button
                              className="btn btn-secondary"
                              onClick={() => setCancelModal(true)}
                            >
                              CANCEL
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </li>
              </ul>
            }
            <div className="row clearfix">
              <div className="col-md-12">
                {subDetails?.paymentGateway === "RazorPay" ? (
                  <div className="table-responsive mt-3">
                    <table className="table table-hover table-vcenter text-nowrap table_custom spacing8 mb-0">
                      <thead>
                        <tr>
                          <th>Date</th>
                          <th>Invoice ID</th>
                          <th>Amount</th>
                          <th>quantity</th>
                          <th>Next Due Date</th>
                          <th className="text-center">Action</th>
                        </tr>
                      </thead>

                      <tbody>
                        {details?.map((value, index) => (
                          <tr key={index}>
                            <td>
                              <span className="text-mute">
                                {new Date(
                                  value?.issued_at * 1000
                                ).toLocaleDateString()}
                              </span>
                            </td>
                            <td>
                              <div>{value?.invoice_id}</div>
                            </td>
                            <td>
                              <div>INR {value?.gross_amount / 100}</div>
                            </td>
                            <td>
                              <div className="alert alert-primary">
                                {value?.quantity}
                              </div>
                            </td>
                            <td>

                              {new Date(nextDate * 1000).toLocaleDateString()}


                            </td>
                            <td className="text-center">
                              <a
                                className="btn btn-primary"
                                href={value?.short_url}
                                target="_blank"
                                rel="noreferrer"
                              >
                                View
                              </a>
                            </td>
                          </tr>
                        ))}
                      </tbody>

                    </table>
                  </div>
                ) : (
                  <Loaders />
                )}
              </div>

            </div>
            <div className="d-flex justify-content-center">
              {/* <nav aria-label="Page navigation example">
                  <ul className="pagination">
                    <li className="page-item">
                      <a className="page-link" onClick={() => {
                          setPage(page - 1);
                        }} href="#" aria-label="Previous">
                        <span aria-hidden="true">&laquo;</span>
                        <span className="sr-only">Previous</span>
                      </a>
                    </li>
                    <li className="page-item">
                      <a className="page-link" href="#">
                        {page+1}/{totalPage}
                      </a>
                    </li>
                    
                    <li className="page-item">
                      <a className="page-link" onClick={() => {
                          setPage(page + 1);
                        }} href="#" aria-label="Next">
                        <span aria-hidden="true">&raquo;</span>
                        <span className="sr-only">Next</span>
                      </a>
                    </li>
                  </ul>
                </nav> */}
            </div>
          </div>

          {linkModal && (
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
                    <h1 className="text-red">Alert!</h1>
                    <p
                      className="text-secondary"
                      style={{ fontSize: "14px", fontWeight: "600" }}
                    >
                      You are adding number
                      of users <br />
                      to your organization.
                    </p>
                    <div className="delete-footer">
                      <a href={link} target='_blank'>
                        <button

                          type="reset"
                          className="btn btn-secondary mr-2"
                          data-dismiss="modal"
                          onClick={() => {
                            setLinkModal(false)
                            //setReset(false)
                          }}
                        >
                          pay now
                        </button>
                      </a>






                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          {isModal && (
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
                    <h1 className="text-red">Alert!</h1>
                    <p
                      className="text-secondary"
                      style={{ fontSize: "14px", fontWeight: "600" }}
                    >
                      You are adding {userCount - subDetails?.quantity} number
                      of users <br />
                      to your organization.
                    </p>
                    <div className="delete-footer">
                      <button
                        type="reset"
                        className="btn btn-secondary mr-2"
                        data-dismiss="modal"
                        onClick={() => {
                          setIsModal(false);
                          //setReset(false)
                        }}
                      >
                        Cancel
                      </button>
                      {subDetails?.paymentGateway === "RazorPay" ? (
                        <button
                          type="submit"
                          className="btn btn-primary"
                          onClick={() => {
                            updateSubscriptionQuantityPlan();
                            setIsModal(false);
                          }}
                        >
                          Confirm
                        </button>
                      ) : (
                        <button
                          type="submit"
                          className="btn btn-primary"
                          onClick={() => {
                            updatePayPalSubscription();
                            setLinkModal(true)
                            setIsModal(false);
                          }}
                        >
                          Confirm
                        </button>
                      )}

                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          {isErrorModal && (
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
                    <h1 className="text-red">Alert!</h1>
                    <p
                      className="text-secondary"
                      style={{ fontSize: "14px", fontWeight: "600" }}
                    >
                      You cannot reduce the number of users
                      <br />
                      from your organization from here. Go to the Users Page.
                    </p>
                    <div className="delete-footer">
                      <button
                        type="submit"
                        className="btn btn-primary"
                        onClick={() => {
                          //updateSubscription()
                          //setReset(true)
                          history.push("/user")
                        }}
                      >
                        Go to Users
                      </button>
                      <button
                        type="reset"
                        className="btn btn-secondary mr-2"
                        data-dismiss="modal"
                        onClick={() => {
                          setErrorModal(false);
                          setUserCount(subDetails?.quantity)
                          //setReset(false)
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          {isCancelModal && (
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
                    <h1 className="text-red">Alert!</h1>
                    <p
                      className="text-secondary"
                      style={{ fontSize: "14px", fontWeight: "600" }}
                    >
                      Are you sure you want to Cancel your Subscription? <br />
                      You won't be able to buy a subscription from us again!
                    </p>
                    <div className="delete-footer">
                      {subDetails?.paymentGateway === "RazorPay" ? (
                        <button
                          type="submit"
                          className="btn btn-primary"
                          onClick={() => {
                            cancelSubscription();
                            setCancelModal(false);
                          }}
                        >
                          Confirm
                        </button>
                      ) : (
                        <button
                          type="submit"
                          className="btn btn-primary"
                          onClick={() => {
                            paypalCancelSubscription();
                            setCancelModal(false);
                          }}
                        >
                          Confirm
                        </button>
                      )}

                      <button
                        type="reset"
                        className="btn btn-secondary"
                        data-dismiss="modal"
                        onClick={() => {
                          setCancelModal(false);
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          {isSeatModal && (
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
                    <h1 className="text-red">Alert!</h1>
                    <p
                      className="text-secondary"
                      style={{ fontSize: "14px", fontWeight: "600" }}
                    >
                      You are reducing {subDetails?.quantity - userCount} number
                      of seats <br />
                      from your Plan. Are you sure?
                    </p>
                    <div className="delete-footer">
                      <button
                        type="reset"
                        className="btn btn-secondary"
                        data-dismiss="modal"
                        onClick={() => {
                          setSeatModal(false);
                        }}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="btn btn-primary"
                        onClick={() => {
                          updateSubscriptionQuantityPlan()
                          setSeatModal(false);
                        }}
                      >
                        Update
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {changePlanModal && (
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
                    {isUpdateModal ? "Add more Users" : "Remove User"}
                    <button
                      type="button"
                      className="close"
                      data-dismiss="modal"
                      onClick={() => {
                        setChangePlanModal(false);
                        setUserCount(subDetails?.quantity);
                      }}
                      aria-label="Close"
                    >
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </div>

                  <div className="modal-body">
                    <div className="row">
                      <div className="col-md-12">
                        <div className="form-group">
                          <label className="form-label">
                            Number of Users
                            <span className="required">
                              <i className="fa-solid fa-star-of-life"></i>
                            </span>
                          </label>
                          <div className="input-group">
                            <input
                              name="totalUser"
                              type="number"
                              className="form-control text-center"
                              value={userCount}
                              onChange={(e) => setUserCount(e.target.value)}
                              disabled
                            />
                            {isUpdateModal ? (
                              <div className="input-group-append">
                                <button
                                  type="button"
                                  className="input-group-text"
                                  onClick={() =>
                                    setUserCount(Number(userCount) + 1)
                                  }
                                >
                                  <i className="fa fa-plus"></i>
                                </button>
                              </div>
                            ) : (
                              <div className="input-group-prepend">
                                <button
                                  type="button"
                                  disabled={userCount === 1}
                                  className="input-group-text"
                                  onClick={() =>
                                    setUserCount(Number(userCount) - 1)
                                  }
                                >
                                  <i className="fa fa-minus"></i>
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="col-md-12">
                        <div className="form-group">
                          <label className="form-label">
                            Subscription Cycle
                            <span className="required">
                              <i className="fa-solid fa-star-of-life"></i>
                            </span>
                          </label>
                          <div className="selectgroup feedback-group">
                            <label className="selectgroup-item">
                              <input
                                type="radio"
                                name="Type"
                                value="Monthly"
                                className="selectgroup-input"
                                checked={changeCycle === "monthly"}
                                onChange={() => setChangeCycle("monthly")}
                              />
                              <span className="selectgroup-button">
                                Monthly
                              </span>
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
                                checked={changeCycle === "yearly"}
                                onChange={() => setChangeCycle("yearly")}
                              />
                              <span className="selectgroup-button">Yearly</span>
                            </label>
                          </div>
                        </div>
                        <div className="form-group">
                          <label className="form-label">
                            {changeCycle === "monthly" ? (
                              <p className="m-0">

                                <strong>Total Amount</strong>
                                <span>{Math.round(userCount * 100)} </span>
                              </p>

                            ) : (
                              <>
                                <p className="m-0">
                                  <strong>Total Amount</strong>
                                  <span>{Math.round(userCount * 1200)} </span>
                                </p>
                                <p className="m-0">
                                  <strong>Discount</strong>
                                  <span> {Math.round(
                                    (20 / 100) * userCount * 100 * 12
                                  )} </span>
                                </p>
                                <p className="m-0">
                                  <strong>Discounted Amount</strong>
                                  <span>{Math.round(userCount * 960)} </span>
                                </p>
                              </>
                            )}
                          </label>
                        </div>
                      </div>
                    </div>
                    <div className="plan-modal-footer">
                      {subDetails?.paymentGateway === "RazorPay" ? (
                        <button
                          type="reset"
                          className="btn btn-primary"
                          data-dismiss="modal"
                          onClick={() => {
                            setChangePlanModal(false);
                            userCount < userList?.length
                              ? setErrorModal(true)
                              : userCount < subDetails?.quantity &&
                                userCount >= userList?.length
                                ? setSeatModal(true)
                                : setIsModal(true);
                          }}
                        >
                          Upgrade
                        </button>
                      ) : (
                        <button
                          type="reset"
                          className="btn btn-secondary"
                          data-dismiss="modal"
                          onClick={() => {
                            setChangePlanModal(false);
                            userCount < userList?.length
                              ? setErrorModal(true)
                              : userCount < subDetails?.quantity &&
                                userCount >= userList?.length
                                ? setSeatModal(true)
                                : setIsModal(true);
                          }}
                        >
                          Upgrade paypal
                        </button>
                      )}

                      <br /> <br />
                      <p className="form-label">
                        {isUpdateModal
                          ? "Increasing total number of seats will be reflected in your next invoice which will be due date "
                          : "Decreasing total number of seats will be reflected in your next invoice which will be due date "}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          {changePlanModal2 && (
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
                    Change Plan
                    <button
                      type="button"
                      className="close"
                      data-dismiss="modal"
                      onClick={() => {
                        setChangePlanModal2(false);
                        setUserCount(subDetails?.quantity);
                      }}
                      aria-label="Close"
                    >
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </div>

                  <div className="modal-body">
                    <div className="row">
                      <div className="col-md-12">
                        <div className="form-group">
                          <label className="form-label">
                            Number of Users
                            <span className="required">
                              <i className="fa-solid fa-star-of-life"></i>
                            </span>
                          </label>

                          <div className="input-group">
                            <div className="input-group-prepend">
                              <button
                                type="button"
                                disabled={userCount === 1}
                                className="input-group-text"
                                onClick={() =>
                                  setUserCount(Number(userCount) - 1)
                                }
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
                                onClick={() =>
                                  setUserCount(Number(userCount) + 1)
                                }
                              >
                                <i className="fa fa-plus"></i>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-12">
                        <div className="form-group">
                          <label className="form-label">
                            Subscription Cycle
                            <span className="required">
                              <i className="fa-solid fa-star-of-life"></i>
                            </span>
                          </label>
                          <div className="selectgroup feedback-group">
                            <label className="selectgroup-item">
                              <input
                                type="radio"
                                name="Type"
                                value="Monthly"
                                className="selectgroup-input"
                                checked={changeCycle === "monthly"}
                                onChange={() => setChangeCycle("monthly")}
                              />
                              <span className="selectgroup-button">
                                Monthly
                              </span>
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
                                checked={changeCycle === "yearly"}
                                onChange={() => setChangeCycle("yearly")}
                              />
                              <span className="selectgroup-button">Yearly</span>
                            </label>
                          </div>
                        </div>
                        <div className="form-group">
                          <label className="form-label">
                            {changeCycle === "monthly" ? (
                              <p className="m-0">

                                <strong>Total Amount</strong>
                                <span>{Math.round(userCount * 100)} </span>
                              </p>

                            ) : (
                              <>
                                <p className="m-0">
                                  <strong>Total Amount</strong>
                                  <span>{Math.round(userCount * 1200)} </span>
                                </p>
                                <p className="m-0">
                                  <strong>Discount</strong>
                                  <span> {Math.round(
                                    (20 / 100) * userCount * 100 * 12
                                  )} </span>
                                </p>
                                <p className="m-0">
                                  <strong>Discounted Amount</strong>
                                  <span>{Math.round(userCount * 960)} </span>
                                </p>
                              </>
                            )}

                          </label>
                        </div>
                      </div>
                    </div>
                    <div className="plan-modal-footer">
                      {subDetails?.paymentGateway === "RazorPay" ? (
                        <button
                          type="reset"
                          className="btn btn-primary"
                          data-dismiss="modal"
                          onClick={() => {
                            setChangePlanModal2(false);
                            // setType(false);
                            // updateSubscriptionQuantityPlan();
                            userCount < userList?.length
                              ? setErrorModal(true)
                              : userCount < subDetails?.quantity &&
                                userCount >= userList?.length
                                ? setSeatModal(true)
                                : setIsModal(true);
                          }}
                        >
                          Upgrade
                        </button>
                      ) : (
                        <button
                          type="reset"
                          className="btn btn-secondary"
                          data-dismiss="modal"
                          onClick={() => {
                            setChangePlanModal2(false);
                            // setType(false);
                            // updateSubscriptionQuantityPlan();
                            // updatePayPalSubscription();
                            userCount < userList?.length
                              ? setErrorModal(true)
                              : userCount < subDetails?.quantity &&
                                userCount >= userList?.length
                                ? setSeatModal(true)
                                : setIsModal(true);
                          }}
                        >
                          Upgrade paypal
                        </button>
                      )}

                      <br /> <br />
                      <p className="form-label">
                        Increasing total number of seats will be reflected in
                        your next invoice which will be due date
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      }
    </>
  );
}
