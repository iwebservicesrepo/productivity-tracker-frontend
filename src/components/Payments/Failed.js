import React from "react";
import Payment from "./Payment";

function Failed() {
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
              className="modal-dialog modal-dialog-centered modal-md"
              role="document"
            >
              <div className="modal-content">
                <h3 className="modal-header">
                  Oops! Your Payment could not be completed.
                </h3>

                <div className="card-body">
                  <p>
                    An error occurred while processing your payment. If any
                    amount was debited from your account it would be refunded.
                  </p>
                </div>

                <div className="modal-footer">
                  <a
                    href="/payment"
                    className="btn btn-primary btn-sm"
                    onClick={() => window.location.reload()}
                  >
                    Retry Payment
                  </a>
                  {/* <a href="/#" className="btn btn-secondary btn-sm ml-2">
                  Action 2
                </a> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Failed;
