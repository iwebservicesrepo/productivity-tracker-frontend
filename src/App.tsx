import React, { Component, useEffect, useState } from "react";
import { connect } from "react-redux";
import "./App.css";
import Layout from "./components/Shared/Layout";
import SignUp from "./components/Authentication/signup";
import Resetpassword from "./components/Authentication/resetpassword";
import ForgotPassword from "./components/Authentication/forgotpassword";
import NotFound from "./components/Authentication/404";
import "./config/HttpConfig";
import InternalServer from "./components/Authentication/500";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { createBrowserHistory } from "history";
import PrivateRoute from "./components/Authentication/PrivateRoute";
import LoginPage from "./components/Authentication/LoginPage";
import {
	getAuthUser,
  getCookie,
  getPayload,
  isLoggedIn,
  iss,
  setCookie,
} from "./components/Authentication/authHelpers";
import { mainServerAppUrl } from "./apis/mainapi";
import SetPassword from "./components/SetPassword/SetPassword";
import { Toaster } from "react-hot-toast";
import ChangeEmail from "./components/Authentication/ChangeEmail";
import TawkMessengerReact from "@tawk.to/tawk-messenger-react";
import { useRef } from "react";

const history = createBrowserHistory();

const App = (props) => {
  const [checkLogIn, setcheckLogIn] = useState(isLoggedIn());

  // useEffect(() => {
  // 	if (checkLogIn) {
  // 	  history.replace("/profile");
  // 	}else{
  // 		history.replace("/")
  // 	}
  // }, [checkLogIn]);

  const handleResponseoken = (token) => {
    let cookie = {
      name: "_token",
      value: token,
      days: 30,
    };
    setCookie(cookie);
    // history.push("/dashboard");
  };
  useEffect(() => {
    // const getUser = () => {
    // 	fetch(mainServerAppUrl + "/auth/login/success", {
    // 		method: "GET",
    // 		credentials: "include",
    // 		headers: {
    // 			Accept: "application/json",
    // 			"Content-Type": "application/json",
    // 			"Access-Control-Allow-Credentials": "true",
    // 		},
    // 	})
    // 		.then((response) => {
    // 			if (response.status === 200) return response.json();
    // 			throw new Error("authentication has been failed!");
    // 		})
    // 		.then((resObject) => {
    // 			if (resObject?.user) {
    // 				handleResponseoken(resObject?.user);
    // 				setcheckLogIn(true)
    // 				// window.location.reload();
    // 			}
    // 			// else{
    // 			// 	// setcheckLogIn(isLoggedIn())
    // 			// }
    // 		})
    // };
    // // getUser();
  }, []);
  const tawkMessengerRef: any = useRef();

  const onLoad = () => {
    // console.log("onLoad works!");

    //   tawkMessengerRef.current.setAttributes({
    //     id : 'A1234',
    //     store : 'Midvalley'
    // }, function(error) {
    //     // do something if error
    // });

    // // Example for setting name and email

    // tawkMessengerRef.current.setAttributes({
    //     name : 'joe',
    //     email : 'yusuf@gmail.com',
    //     hash : 'has value'
    // }, function(error) {
    //     // do something if error
    // });

    tawkMessengerRef.current.setAttributes(
      {
        // id: "A0002",
        // name: "joey",
        // company: "abccompany",
        // email: "joey@gmail.com",
        // phone: "abc9833495592",
        // hash: "has value",
		    id: getAuthUser()?._id,
        name: getAuthUser()?.name,
        company: getAuthUser()?.organization,
        email: getAuthUser()?.emailId,
        //phone: "abc9833495592",
        //hash: "has value",
      },
      function (error) {
        // do something if error
        console.warn(error);
      }
    );
  };

  const {
    darkMode,
    boxLayout,
    darkSidebar,
    iconColor,
    gradientColor,
    rtl,
    fontType,
  } = props;
  return (
    <>
      <div
        className={`${darkMode ? "dark-mode" : ""}${
          darkSidebar ? "sidebar_dark" : ""
        } ${iconColor ? "iconcolor" : ""} ${gradientColor ? "gradient" : ""} ${
          rtl ? "rtl" : ""
        } ${fontType ? fontType : ""}${boxLayout ? "boxlayout" : ""}`}
      >
        <Router history={history}>
          <Switch>
            <Route exact path="/" component={LoginPage} />
            <Route path="/set-password/:token" component={SetPassword} />
            <Route path="/email-change/:id" component={ChangeEmail} />
            {/* <Route path="/user-roles" component={UsersRoles} /> */}
          	<Route path="/rest-password/:token" component={Resetpassword} />
            <Route path="/signup" component={SignUp} />
            <Route path="/forgotpassword" component={ForgotPassword} />
            <Route path="/notfound" component={NotFound} />
            <Route path="/internalserver" component={InternalServer} />
            <PrivateRoute isAuth={checkLogIn} component={Layout} />
          </Switch>
        </Router>
        <Toaster position="top-right" />
        <TawkMessengerReact
          propertyId="638914c9daff0e1306da7f4f"
          widgetId="1gj7nid26"
          onLoad={onLoad}
          ref={tawkMessengerRef}
        />
      </div>
    </>
  );
  // let navHeader = this.state.visibility ? <Layout /> : <Login />;
  // return (
  //   <div>
  //       {navHeader}
  //   </div>
  // )
};
const mapStateToProps = (state) => ({
  darkMode: state.settings.isDarkMode,
  darkSidebar: state.settings.isDarkSidebar,
  iconColor: state.settings.isIconColor,
  gradientColor: state.settings.isGradientColor,
  rtl: state.settings.isRtl,
  fontType: state.settings.isFont,
  boxLayout: state.settings.isBoxLayout,
});

const mapDispatchToProps = (dispatch) => ({});
export default connect(mapStateToProps, mapDispatchToProps)(App);
