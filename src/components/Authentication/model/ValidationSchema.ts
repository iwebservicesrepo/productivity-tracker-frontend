import axios from "axios";
import * as yup from "yup";

export const emailDomainValidation = (value) => {
  let blackListedmails = [
    "@yahoo.com",
    "@rediffmail.com",
    "@zoho.com",
    "@inbox.com",
    "@mail.com",
    "@gmxmail.com",
    "@yandex.com",
    "@icloud.com",
    "@aol.com",
    "@proton.com",
  ];
  let emailAddress = value;
  if (emailAddress == null || emailAddress == undefined) {
    return true;
  }
  let validateEmail = blackListedmails.map((bMail) => {
    let idx = emailAddress.indexOf(bMail);
    if (idx > -1) {
      return true;
    } else {
      return false;
    }
  });
  return validateEmail.includes(true);
};

function nameMatchWithDomain(orgName, email) {
  if (orgName == null || email == null) {
    return false;
  }
  const selectedEmail = email;
  let orgName1 = orgName;
  let domain = selectedEmail.split("@").pop();
  let emailSplit = domain.split(".");
  if (orgName1 == emailSplit[0]) {
    return true;
  } else {
    return false;
  }
}

function blackListedMails(orgName) {
  let blackListedNames = [
    "yahoo",
    "rediffmail",
    "zoho",
    "inbox",
    "mail",
    "gmxmail",
    "yandex",
    "icloud",
    "aol",
    "proton",
  ];
  if (orgName == null) {
    return false;
  }
  let orgName1 = orgName;
  let validateName = blackListedNames.map((bMail) => {
    let domain = bMail.split("@").pop();
    let emailSplit = domain.split(".");
    if (orgName1 == emailSplit[0]) {
      return true;
    } else {
      return false;
    }
  });
  return validateName.includes(true);
}

export const registrationValidationSchema = yup.object().shape({
  name: yup
    .string()
    .required("Please enter the Organization name")
    .max(50, "Max length is 50")
    .min(2, "Min length is 2")
    .matches(
      /^[-a-zA-Z0-9-,.'-]+(\s+[-a-zA-Z0-9-,.'-]+)*$/,
      "No special characters are allowed only - space , ' . are allowed"
    )
    .test(
      "name-did-not-match-with-blacklisted-domain",
      "Name Match with valid domain",
      (value) => {
        return !blackListedMails(value);
      }
    ),
  email: yup
    .string()
    .email("Please enter valid Email Address")
    .required("Please enter your Organization Email")
    .test(
      "email-domain-validation",
      "Email must be of company domain",
      (value) => {
        return !emailDomainValidation(value);
      }
    ),
  email_otp: yup.string().required("OTP is required").min(6, " ").max(6, " "),

  phone: yup
    .number()
    .typeError("You must specify a Number")
    .required("Phone number field required")
    .min(11111, "Minimum 5 digits required")
    .max(111111111111111, "Maximum 15 digits allowed"),

  address: yup.string().required("Address field required").matches(/^[\S]+(\s+[\S]+)*$/, "Address should not start and end with spaces"),
  password: yup
    .string()
    .required("Password field is required")
    .matches(
      /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
      "Password doesn't meet the requirement"
    )
    .min(8, ""),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), null], "Passwords must match")
    .required("Confirm password is required"),
});

export const forgetPaaswordEmail = yup.object().shape({
  email: yup
    .string()
    .email("Please enter valid Email Address")
    .required("Please enter your Email")
    .test(
      "email-domain-validation",
      "Email must be of company domain",
      (value) => {
        return !emailDomainValidation(value);
      }
    ),
});

export const validatePasswordResetField = yup.object().shape({
  password: yup
    .string()
    .required("Password is required")
    .matches(
      /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
      "Password doesn't meet the requirement"
    )
    .min(8, ""),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), null], "Passwords must match")
    .required("Confirm Password is required"),
});

export const loginFormValidationField = yup.object().shape({
  email: yup
    .string()
    .email("Please enter valid Email Address")
    .required("Please enter your Email ID")
    .test(
      "email-domain-validation",
      "Email must be of company domain",
      (value) => {
        return !emailDomainValidation(value);
      }
    ).matches(/^(?!\s+$)/, 'Please Enter your Email ID'),
  password: yup
    .string()
    .required("Password is required")
    .min(8, "Password must be atleast 8 characters"),
});

export const basicFormValidation = yup.object().shape({
  firstName: yup.string().required("First Name is required").matches(
    /^(?!\s+$)/,
    "Please Enter your First Name"
  ),
  lastName: yup.string().required("Last Name is required").matches(
    /^(?!\s+$)/,
    "Please Enter your Last Name"
  ),
  email: yup.string().email("Email is invalid").required("Email is required").matches(
    /^(?!\s+$)/,
    "Please Enter your Email"
  ),
  role: yup.string().required("Role  is required"),
});

export const addFormValidation = yup.object().shape({
  appAndWebsite: yup.string().required("Name is required").matches(/^(?!\s+$)/, "Please Enter the Name"),
  URL: yup.string().matches(/((https?):\/\/)?(www.)?[a-z0-9-]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#-]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/, "URL is invalid"),
});
