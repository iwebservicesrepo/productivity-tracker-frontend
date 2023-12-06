import React from "react";
import { useHistory, useLocation } from "react-router-dom";

const CancelPopup = (props) => {
  const history = useHistory();
  const location = useLocation();

  const { open, closeHandler } = props;
  return (
    <>
      {location?.pathname !== "/user" &&
        location?.pathname !== "/payment" &&
        open && (
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
                    <button
                      type="button"
                      className="close"
                      onClick={() => closeHandler()}
                      aria-label="Close"
                    ></button>
                    <div className="modal-body">
                      <div className="welcome-modal-icon">
                        <img
                          src={require("../../images/monkey.png")}
                          alt="logoProd2.png"
                        />
                      </div>
                      <h1 className="text-red">Oops!</h1>
                      <p>
                        <strong>Your Subscription has been cancelled</strong>
                      </p>
                      <div className="delete-footer">
                        <button
                          className="btn btn-primary"
                          onClick={() => {
                            //  closeHandler();
                            history.push("/payment");
                          }}
                        >
                          Buy again
                        </button>

                        <button
                          className="btn btn-primary"
                          onClick={() => {
                            //  closeHandler();
                            history.push("/user");
                          }}
                        >
                          See Users
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
    </>
  );
};

export default CancelPopup;
