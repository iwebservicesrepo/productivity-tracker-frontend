import React, { useState } from "react";

export const Faq = () => {
  const [box1Open, setBox1Open] = useState(false);
  const [box2Open, setBox2Open] = useState(false);
  const [box3Open, setBox3Open] = useState(false);
  const [box4Open, setBox4Open] = useState(false);
  const [box5Open, setBox5Open] = useState(false);
  const [box6Open, setBox6Open] = useState(false);
  const [box7Open, setBox7Open] = useState(false);
  const [box8Open, setBox8Open] = useState(false);
  const [box9Open, setBox9Open] = useState(false);


  return (
    <>
      <header className="page-header">
        <div className="flex-40">
          <h1>Frequently Asked Questions (FAQs)</h1>
        </div>
        <div className="flex-60">
        </div>
      </header>
      <div className="section-body collapsible-wrapper">
        <div onClick={() => {
          setBox1Open(!box1Open);
        }} className={`card  ${!box1Open ? "card-collapsed" : ""}`}>
          <div className="card-header">
            <h3 className="card-title">
              How do I receive credit card payments?
            </h3>
            <div className="card-options">
              <span
                className="card-options-collapse"
                data-toggle="card-collapse"
                onClick={() => {
                  setBox1Open(!box1Open)
                }}
              >
              </span>
            </div>
          </div>
          <div className="card-body" style={{ color: "#6c757d" }}>
            <p> Use the System Configuration application to connect to a payment
              processor, such as Chase Paymentech. See{" "}
              <a
                href="https://xy2401-local-doc-java.github.io/cloud/monetization-cloud-latest/BCSIG/integrating-your-business-systems1.htm#BCSIG2206"
                target="_blank"
                rel="noopener noreferrer"
              >
                About integrating your business systems.
              </a>
            </p>
            <p>
              After your payment gateway is configured, you use Subscriber
              Management to create customer accounts for customers who pay by
              credit card. Oracle Monetization Cloud stores all of the credit card
              information. See{" "}
              <a
                href="https://xy2401-local-doc-java.github.io/cloud/monetization-cloud-latest/BCSUG/managing-payment-methods1.htm#GUID-3FE51160-2622-489C-A089-4F0F66197CC8"
                target="_blank"
                rel="noopener noreferrer"
              >
                {" "}
                Managing payment methods.
              </a>
            </p>
            <p> To receive credit card payments, run a payment job by using
              Business Operations. See
              <a
                href="https://xy2401-local-doc-java.github.io/cloud/monetization-cloud-latest/BCSUG/processing-credit-card-and-debit-card-payments1.htm#GUID-93C010F0-CF7B-4CCE-9398-8D4AAFC60342"
                target="_blank"
                rel="noopener noreferrer"
              > Processing credit card and debit card payments.
              </a>
            </p>
          </div>
        </div>
        <div onClick={() => {
          setBox2Open(!box2Open)
        }} className={`card  ${!box2Open ? "card-collapsed" : ""}`}>
          <div className="card-header">
            <h3 className="card-title">
              How do I set credit limits for customers?
            </h3>
            <div className="card-options">
              <span
                className="card-options-collapse"
                data-toggle="card-collapse"
                onClick={() => {
                  setBox2Open(!box2Open)
                }}
              >
              </span>
            </div>
          </div>
          <div className="card-body" style={{ color: "#6c757d" }}>
            <p>
              You configure credit limits when you create packages in Offer
              Design. When a customer purchases a package, the credit limits
              defined in the package apply to the customer's services. See
              <a
                href="https://xy2401-local-doc-java.github.io/cloud/monetization-cloud-latest/BCSUG/creating-packages1.htm#GUID-19C29957-A507-4279-B7AB-1BFDE6C14176"
                target="_blank"
                rel="noopener noreferrer"
              > Creating packages.
              </a>
            </p>
          </div>
        </div>
        <div onClick={() => {
          setBox3Open(!box3Open)
        }} className={`card  ${!box3Open ? "card-collapsed" : ""}`}>
          <div className="card-header" >
            <h3 className="card-title">
              Can a bill carry forward a past due amount from the previous bill?
            </h3>
            <div className="card-options">
              <span
                className="card-options-collapse"
                data-toggle="card-collapse"
                onClick={() => {
                  setBox3Open(!box3Open)
                }}
              >
              </span>
            </div>
          </div>
          <div className="card-body" style={{ color: "#6c757d" }}>
            <p> Yes. Oracle Monetization Cloud uses two accounting types:
              balance forward and open item. With balance forward accounting,
              a customer's bill includes all the charges that a customer owes,
              including those from previous billing cycles. With open item
              accounting, a customer is billed only for charges from the bill
              items in the current bill cycle. See<a href="https://xy2401-local-doc-java.github.io/cloud/monetization-cloud-latest/BCSUG/billing2.htm#GUID-F7C282B0-D978-498F-B5DC-B141AED61397" target="_blank" rel="noopener noreferrer"> About accounting types.</a>
            </p>
          </div>
        </div>
        <div onClick={() => {
          setBox4Open(!box4Open)
        }} className={`card  ${!box4Open ? "card-collapsed" : ""}`}>
          <div className="card-header">
            <h3 className="card-title">
              Can one customer pay for another customer's bill?
            </h3>
            <div className="card-options">
              <span
                className="card-options-collapse"
                data-toggle="card-collapse"
                onClick={() => {
                  setBox4Open(!box4Open)
                }}
              >
              </span>
            </div>
          </div>
          <div className="card-body" style={{ color: "#6c757d" }}>
            <p>Yes. This is called a billing hierarchy. When creating or editing a bill unit in Subscriber Management, you can select another account instead of a payment method. See<a href="https://xy2401-local-doc-java.github.io/cloud/monetization-cloud-latest/BCSUG/configuring-customers-billing-settings1.htm#GUID-A23072B8-938F-458C-A6AA-B1E7F988C505" target="_blank" rel="noopener noreferrer"> Configuring a customer's billing settings </a>and<a href="https://xy2401-local-doc-java.github.io/cloud/monetization-cloud-latest/BCSUG/managing-customers1.htm#GUID-6DE30194-4424-46A3-84C4-7FAF6DF450E0" target="_blank" rel="noopener noreferrer"> Managing billing hierarchies.</a>
            </p>
          </div>
        </div>
        <div onClick={() => {
          setBox5Open(!box5Open)
        }} className={`card  ${!box5Open ? "card-collapsed" : ""}`}>
          <div className="card-header">
            <h3 className="card-title">
              How do I put my logo on invoices?
            </h3>
            <div className="card-options">
              <span
                className="card-options-collapse"
                data-toggle="card-collapse"
                onClick={() => {
                  setBox5Open(!box5Open)
                }}
              >
              </span>
            </div>
          </div>
          <div className="card-body" style={{ color: "#6c757d" }}>
            <p> Use Oracle Business Intelligence (BI) Publisher to customize your invoice templates.
              You can change the appearance, but you can't change the content. See<a href="https://xy2401-local-doc-java.github.io/cloud/monetization-cloud-latest/BCSUG/generating-invoices2.htm#GUID-E9959C5B-C706-4B3E-98B1-A0CBCE6B7F7D" target="_blank" rel="noopener noreferrer"> Generating invoices.</a>
            </p>
          </div>
        </div>
        <div onClick={() => {
          setBox6Open(!box6Open)
        }} className={`card  ${!box6Open ? "card-collapsed" : ""}`}>
          <div className="card-header">
            <h3 className="card-title">
              Can I customize how charges are shown on a bill?
            </h3>
            <div className="card-options">
              <span
                className="card-options-collapse"
                data-toggle="card-collapse"
                onClick={() => {
                  setBox6Open(!box6Open)
                }}
              >
              </span>
            </div>
          </div>
          <div className="card-body" style={{ color: "#6c757d" }}>
            <p> Yes. Use Business Configuration to create customized bill items.
              Oracle Monetization Cloud provides some predefined bill items such as Cycle Forward, Cycle Forward Arrears, Usage, One Time, and so on. You can create your own bill items to aggregate and display your charges differently in your bills. See<a href="https://xy2401-local-doc-java.github.io/cloud/monetization-cloud-latest/BCSUG/customizing-bill-items2.htm#GUID-D4966A51-AACF-4167-823A-08B9332C3CF5" target="_blank" rel="noopener noreferrer"> Customizing bill items.</a>
            </p>
          </div>
        </div>
        <div onClick={() => {
          setBox7Open(!box7Open)
        }} className={`card  ${!box7Open ? "card-collapsed" : ""}`}>
          <div className="card-header">
            <h3 className="card-title">
              How do I handle failed payments?
            </h3>
            <div className="card-options">
              <span
                className="card-options-collapse"
                data-toggle="card-collapse"
                onClick={() => {
                  setBox7Open(!box7Open)
                }}
              >
              </span>
            </div>
          </div>
          <div className="card-body" style={{ color: "#6c757d" }}>
            <p> You can suspend a payment, troubleshoot it, and re-allocate it.
              See<a href="https://xy2401-local-doc-java.github.io/cloud/monetization-cloud-latest/BCSUG/suspending-and-correcting-payments1.htm#GUID-C95EA667-EBED-4DC4-9F66-62B881079246" target="_blank" rel="noopener noreferrer"> Suspending and correcting payments.</a>
            </p>
          </div>
        </div>
        <div onClick={() => {
          setBox8Open(!box8Open)
        }} className={`card  ${!box8Open ? "card-collapsed" : ""}`}>
          <div className="card-header">
            <h3 className="card-title">
              Can I skip charging a credit card for a very small amount?
            </h3>
            <div className="card-options">
              <span
                className="card-options-collapse"
                data-toggle="card-collapse"
                onClick={() => {
                  setBox8Open(!box8Open)
                }}
              >
              </span>
            </div>
          </div>
          <div className="card-body" style={{ color: "#6c757d" }}>
            <p>  Yes. You can specify the minimum amount required for charging a credit card. The default is 2, in the account's currency.
              See<a href="https://xy2401-local-doc-java.github.io/cloud/monetization-cloud-latest/BCSUG/setting-business-configuration-options1.htm#GUID-0F20FB51-8576-4F83-9AE9-BEF8BA29BE36" target="_blank" rel="noopener noreferrer"> Setting the minimum credit card charge threshold.</a>
            </p>
          </div>
        </div>
        <div onClick={() => {
          setBox9Open(!box9Open)
        }} className={`card  ${!box9Open ? "card-collapsed" : ""}`}>
          <div className="card-header">
            <h3 className="card-title">
              Can I apply a payment to more than one account?
            </h3>
            <div className="card-options">
              <span
                className="card-options-collapse"
                data-toggle="card-collapse"
                onClick={() => {
                  setBox9Open(!box9Open)
                }}
              >
              </span>
            </div>
          </div>
          <div className="card-body" style={{ color: "#6c757d" }}>
            <p>Yes. If your customer has already made the payment for distribution, you must first suspend it. If the customer hasn't made the payment, you must first create the payment as a suspended payment.
              See<a href="https://xy2401-local-doc-java.github.io/cloud/monetization-cloud-latest/BCSUG/suspending-and-correcting-payments1.htm#GUID-304890AF-5519-4416-9196-42C66E43BCC6" target="_blank" rel="noopener noreferrer"> Distributing a payment among multiple accounts.</a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};
