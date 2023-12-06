
import CsvList from "./AppList/CsvList";
import Profile from "./Profile/Profile";
import ForgotPassword from "./Authentication/forgotpassword";
import NotFound from "./Authentication/404";
import InternalServer from "./Authentication/500";
import Gallery from "./Gallery/Gallery";
import LoginPage from "./Authentication/LoginPage";
import SignUp from "./Authentication/signup";
import User from "./AddUsers/User";
import Department from "./Department/Department";
import Productivity from "./Productivity/Productivity";
import Feedback from "../Feedback/Feedback";
import Payment from "./Payments/Payment";
import Forms from "./Forms/Forms";
import ThankYouMessage from "./Payments/ThankYouMessage";
import SubscriptionDetails from "./Payments/SubscriptionDetails";
import Failed from "./Payments/Failed";
import Dashboard from "./SuperAdmin/Dashboard";
import OrganizationDetails from "./SuperAdmin/OrganizationDetails";
import Settings from "./Settings/Settings";
import Reporting from "./Reporting/Reporting";
import AdminDashboard from "./AdminDashboard/AdminDashboard";
import { Faq } from './FAQ/Faq';
import OrgAppList from "./OrgAppList/OrgAppList";
import WriteToUs from "./WriteToUs/WriteToUs";
import ChangePassword from "./Settings/ChangePassword";
import DeleteAccount from "./Settings/DeleteAccount";
import DefaultScreenShotInterval from "./Settings/DefaultScreenShotInterval";
import WriteToUsForm from "./WriteToUs/WriteToUsForm";
import FeedbackForm from "../Feedback/FeedbackForm";

const Routes = [
  {
    path: "/dashboard",
    name: "Screenshot Gallery",
    pageTitle: "Screenshot Gallery",
    component: Gallery,
  },
  {
    path: "/user",
    name: "user",
    pageTitle: "Users",
    component: User,
  },
  {
    path: "/department",
    name: "department",
    pageTitle: "Departments",
    component: Department,
  },
  {
    path: "/productivity",
    name: "productivity",
    pageTitle: "Productivity",
    component: Productivity,
  },
  {
    path: "/feedback",
    name: "Feedback",
    pageTitle: "List of Feedbacks",
    component: Feedback,
  },

  {
    path: "/",
    name: "login",
    exact: true,
    component: LoginPage,
  },
  {
    path: "/signup",
    name: "signup",
    exact: true,
    component: SignUp,
  },
  {
    path: "/forgotpassword",
    name: "forgotpassword",
    exact: true,
    pageTitle: "Tables",
    component: ForgotPassword,
  },
  {
    path: "/notfound",
    name: "notfound",
    exact: true,
    pageTitle: "Tables",
    component: NotFound,
  },
  {
    path: "/internalserver",
    name: "internalserver",
    exact: true,
    pageTitle: "Tables",
    component: InternalServer,
  },
  {
    path: "/profile",
    name: "profile",
    exact: true,
    pageTitle: "My Profile",
    component: Profile,
  },
  {
    path: "/superAdminDashboard",
    name: "Dashboard",
    exact: true,
    pageTitle: "Dashboard",
    component: Dashboard,
  },
  {
    path: "/payment",
    name: "Payment",
    exact: true,
    pageTitle: "Payment Page",
    component: Payment,
  },
  {
    path: "/organizationDetails",
    name: "Organization Details",
    exact: true,
    pageTitle: "Organization Details",
    component: OrganizationDetails,
  },
  {
    path: "/csvlist",
    name: "CsvList",
    exact: true,
    pageTitle: "App List",
    component: CsvList,
  },
  {
    path: "/forms",
    name: "Forms",
    exact: true,
    pageTitle: "Forms",
    component: Forms,
  },
  {
    path: "/verification",
    name: "Verification",
    exact: true,
    pageTitle: "Verification",
    component: ThankYouMessage,
  },
  {
    path: "/subscriptionDetails",
    name: "Subscription Details",
    exact: true,
    pageTitle: "Subscription Details",
    component: SubscriptionDetails,
  },
  {
    path: "/reporting",
    name: "Reporting",
    exact: true,
    pageTitle: "Reporting",
    component: Reporting,
  },
  {
    path: "/failed",
    name: "Verification",
    exact: true,
    pageTitle: "Payment Failed",
    component: Failed,
  },
  {
    path: "/adminDashboard",
    name: "Dashboard",
    exact: true,
    pageTitle: "Dashboard",
    component: AdminDashboard,
  },
  {
    path: "/faqs",
    name: "FAQs",
    exact: true,
    pageTitle: "Frequently Asked Questions (FAQs)",
    component: Faq,
  },
  {
    path: "/orgAppList",
    name: "Organization App List",
    exact: true,
    pageTitle: "Organization App List",
    component: OrgAppList,
  },
  {
    path: "/writeToUs",
    name: "Write to Us",
    exact: true,
    pageTitle: "Write to Us",
    component: WriteToUs,
  },
  {
    path: "/changePassword",
    name: "Change Password",
    exact: true,
    pageTitle: "Change Password",
    component: ChangePassword,
  },
  {
    path: "/deleteAccount",
    name: "Delete Account",
    exact: true,
    pageTitle: "Delete Account",
    component: DeleteAccount,
  },
  {
    path: "/defaultScreenShotInterval",
    name: "Default ScreenShot Interval",
    exact: true,
    pageTitle: "Default ScreenShot Interval",
    component: DefaultScreenShotInterval,
  },
  {
    path: "/writeToUsForm",
    name: "Write to Us",
    exact: true,
    pageTitle: "Write to Us",
    component: WriteToUsForm,
  },
  {
    path: "/feedBackForm",
    name: "Feed Back",
    exact: true,
    pageTitle: "Feed Back",
    component: FeedbackForm,
  }
];

export default Routes;
