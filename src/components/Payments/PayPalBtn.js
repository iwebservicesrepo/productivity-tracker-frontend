import { PayPalButton } from "react-paypal-button-v2";
import React from "react";
export function PayPalBtn(props) {
  const {
    amount,
    currency,
    createSubscription,
    onApprove,
    catchError,
    onError,
    onCancel,
    
  } = props;
  // const paypalKey =
  //   "AdDKcWUFC9zUexOb_z9sa1EWm4tib6X3YR2alpM-DjQBK5d5vkk73mM2JJkyvvrGtDvalpiY2bD3C6Yw";

  // test
  const paypalKey =
    "AZ65U47yga7ezAZsUuzO2Wt9PcrqZqs-vOdODxW2oizdTvSXK_8_WhR09KzsTiYa30-vWwiIQqGp5TCi";
  

  return (
    <PayPalButton
      
      amount={amount}
      currency={currency}
      createSubscription={(data, details) => createSubscription(data, details)}
      onApprove={(data, details) => onApprove(data, details)}
      onError={(err) => onError(err)}
      catchError={(err) => catchError(err)}
      onCancel={(err) => onCancel(err)}
      options={{
        clientId: paypalKey,
        vault: true,
        
      }}
      style={{
        shape: "rect",
        color: "blue",
        layout: "horizontal",
        label: "subscribe",
      }}
    />
  );
}
export default PayPalBtn;
