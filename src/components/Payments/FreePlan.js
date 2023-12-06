import React from "react";

function FreePlan() {
  return (
    <>
      <div className="payment-cards-item">
        <div className="card">
          <div className="card-body first-body">
            <div className="card-category">Forever FREE</div>
            <h1>$0<span>User/month</span></h1>
          {/* </div> */}
          <div className="current-plan">
            Current Plan
          </div>
          {/* <div className="card-body"> */}
            <ul className="leading-loose">
              <li>
                Time tracking
              </li>
              <li>
                Activity tracking
              </li>
              <li>
                Maximum 3 users
              </li>
              <li>
                10 & 15 Mins of frequency for screenshot capture
              </li>
              <li>
                7 days retention of screenshots
              </li>
              <li>
                Only App-usage report for last 7 days
              </li>
              <li>
                Email & chat support
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}

export default FreePlan;
