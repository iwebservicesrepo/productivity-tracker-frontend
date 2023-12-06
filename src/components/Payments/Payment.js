import FreePlan from "./FreePlan";
import PremiumPlan from "./PremiumPlan";
import EnterprisePlan from "./EnterprisePlan";

import Table from "./Table";

function Payment() {
  return (
    <>
      <header className="page-header">
        <div className="flex-40">
          <h1>Subscription Plans</h1>
        </div>
        <div className="flex-60">
          <div className="d-flex justify-content-end align-item-center">

          </div>
        </div>
      </header>
      <div className="section-body">
        <div className="payment-cards-wrapper">
          <FreePlan />
          <PremiumPlan />
          <EnterprisePlan />
        </div>
        <div className="card contact-us-card">
          <div className="card-body">
            <p>Having trouble? Please feel free to <a href="#">contact us</a>.</p>
          </div>
        </div>
      </div>
    </>
  );
}

export default Payment;
