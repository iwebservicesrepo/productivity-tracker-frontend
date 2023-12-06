import { mainServerAppUrl } from "./mainapi";

export const signUpApi: string = mainServerAppUrl + "/users/login";
export const allUserList: string = mainServerAppUrl + "/users/list";
export const organizationCreate: string = mainServerAppUrl + "/organizations/create";
export const architectureTree: string = mainServerAppUrl + "/users/list";

export const ProjectList: string = mainServerAppUrl + "/projects/list";
export const orgRegisterOTPRequest: string =
  mainServerAppUrl + "/organizations/request-otp";
export const orgRegisterOTPSubmit: string =
  mainServerAppUrl + "/organizations/submit-otp";
export const orgRegisterMainDetails: string =
  mainServerAppUrl + "/organizations/submit-main";
export const orgRegisterFinalSubmit: string =
  mainServerAppUrl + "/organizations/final-Submit";
// forget password start
export const forgetPasswordLinkRequest: string =
  mainServerAppUrl + "/forget-password/request-link";
export const restPasswordSubmit: string =
  mainServerAppUrl + "/forget-password/rest-password";
export const passwordLinkStatus: string = 
  mainServerAppUrl + "/forget-password";

export const dsrCreate: string = mainServerAppUrl + "/dsr/create";
export const dsrGetList: string = mainServerAppUrl + "/dsr/list";

// user API Create, Update, and Delete
export const createUserUrl: string = mainServerAppUrl + "/users/create";
export const updateUsers: string = mainServerAppUrl + "/users/update";
export const deleteUserUrl: string = mainServerAppUrl + "/users/delete";

// cvs Import API
export const importCsvUrl: string = mainServerAppUrl + "/users/import";

// Validation API 
export const createValidationUrl: string = mainServerAppUrl + "/validations/create";
export const getValidationLIstUrl: string = mainServerAppUrl + "/validations/list";
export const updateValidationUrl: string = mainServerAppUrl + "/validations/update";
export const deleteValidationUrl: string = mainServerAppUrl + "/validations/delete";

export const departmentListUrl: string = mainServerAppUrl + "/departments/list";
export const subDepartments: string = mainServerAppUrl + "/sub-department/list";
export const CreateSubDepartments: string = mainServerAppUrl + "/sub-department/create";
export const createProject: string = mainServerAppUrl + "/projects/create";




