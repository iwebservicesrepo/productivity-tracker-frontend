import React from "react";
import { ErrorMessage } from "formik";

const ValidationMessage = ({ name }) => {
  return (
    <div style={{ color: "#dc3545","fontSize": "12px"}}>
      <ErrorMessage name={name} />
    </div>
  );
};

export default ValidationMessage;
