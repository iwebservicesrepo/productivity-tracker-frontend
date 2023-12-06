import React from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";

const ThankYouMessage = () => {
  const location = useLocation();
  const id = location.search.replace("?reference=", "");
  console.log(location.state?.detail);
  // const {orderID, subscriptionID} = location.state?.detail
  return (
    <>
      <div className="section-body mt-3">
        <div className="container-fluid">
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
                  <h1>Hooray!</h1>
                  <strong>Thank You! Your Payment was successful.</strong>
                  <p
                    className="text-secondary"
                  >
                    To see your Details click on the See Details Button.
                    <br />
                    To add users go to the Add Users Button
                  </p>
                  <div className="delete-footer">
                    <a
                      href="/subscriptionDetails"
                      className="btn btn-primary"
                      onClick={() => window.location.reload()}
                    >
                      See Details
                    </a>

                    <a
                      href="/user"
                      className="btn btn-primary"
                      onClick={() => window.location.reload()}
                    >
                      Add Users
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ThankYouMessage;
