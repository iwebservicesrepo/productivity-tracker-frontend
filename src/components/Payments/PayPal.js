import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import { useState } from "react";
import axios from "axios";


function PayPal(props) {
  const [show, setShow] = useState(false);
  const [success, setSuccess] = useState(false);
  const [erroMessage, setErrorMessage] = useState("");
  const [orderId, setOrderId] = useState(false);

  // handlePayPalResponse() {
  //   // e.preventdefault()
  //   const payPalResponse = {details};
  //   console.log(payPalResponse);
  //   axios.post(
  //     "http://localhost:9000/api/post-responses",
  //     payPalResponse
  //   );
  // };
  console.log(props)

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
       
      axios.post("http://localhost:9000/api/post-responses", {responses:details});
    });
  };

  const onError = (data, action) => {
    setErrorMessage("An error occured with the payment");
  };

  return (
   <>
    
   <div className="card col-lg-3 col-md-6 mx-3">
   <div className="card-status bg-green" />
   <div className="card-body text-center">
       <div className="card-category">Premium</div>
       <div className="display-3 my-4">₹49</div>
       <ul className="list-unstyled leading-loose">
           <li><strong>10</strong> Users</li>
           <li><i className="fe fe-check text-success mr-2" aria-hidden="true" /> Sharing Tools</li>
           <li><i className="fe fe-check text-success mr-2" aria-hidden="true" /> Design Tools</li>
           <li><i className="fe fe-x text-danger mr-2" aria-hidden="true" /> Private Messages</li>
           <li><i className="fe fe-x text-danger mr-2" aria-hidden="true" /> Twitter API</li>
       </ul>
       
       <PayPalScriptProvider
      
              options={{
                "client-id":
                  "AR1Wr6zGmZvBp4GpMVwgrwNhZtIkLCoWJICUWTrF7FOQNbDnu3QxByvMVQ-zvFJxP0_0rRu2c2yYbt7J",
              }}
            >
       <div className="text-center mt-6">
           <a onClick={() => setShow(true)}
                type="submit" className="btn btn-block btn-success">Pay with PayPal</a>
       </div>
       {show ? (
                <PayPalButtons
                className="mt-3"
                  style={{ layout: "vertical" }}
                  createOrder={createOrder}
                  onApprove={onApprove}
                  onError={onError}
                />
              ) : null}

              {/* {success ? (
                <h1>
                  Your Payment has been done success Please check your email
                </h1>
              ) : (
                <h2>Your Payment is Pending</h2>
              )} */}
            </PayPalScriptProvider>
           
   </div>
</div>
</>
  );
}

export default PayPal;
