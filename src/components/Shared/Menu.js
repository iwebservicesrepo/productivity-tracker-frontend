import React, { Component } from "react";
import { connect } from "react-redux";
import MetisMenu from "react-metismenu";
import { Switch, Route, NavLink } from "react-router-dom";
import Header from "../Shared/Header";
import Footer from "../Shared/Footer";
import DefaultLink from "./DefaultLink";
import toast from "react-hot-toast";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { withRouter } from "react-router";

import "./Menu.css";

import {
  darkModeAction,
  darkHeaderAction,
  fixNavbarAction,
  darkMinSidebarAction,
  darkSidebarAction,
  iconColorAction,
  gradientColorAction,
  rtlAction,
  fontAction,
  subMenuIconAction,
  menuIconAction,
  boxLayoutAction,
  statisticsAction,
  friendListAction,
  statisticsCloseAction,
  friendListCloseAction,
  toggleLeftMenuAction,
} from "../../ReduxStore/actions/settingsAction";
import Routes from "../Route";
import { getAuthUser } from "../Authentication/authHelpers";
import axios from "axios";

import moment from "moment";
import { mainServerAppUrl } from "../../apis/mainapi";
import {
  getAllLoginData,
  getResetState,
} from "./../../ReduxStore/actions/loginAction";
import { eraseCookie, isLoggedIn } from "../Authentication/authHelpers";
import CancelPopup from "../Payments/CancelPopup";
const masterNone = {
  display: "none",
};

const masterBlock = {
  display: "block",
};

class Menu extends Component {
  constructor(props) {
    super(props);
    this.toggleLeftMenu = this.toggleLeftMenu.bind(this);
    this.toggleUserMenu = this.toggleUserMenu.bind(this);
    this.toggleRightSidebar = this.toggleRightSidebar.bind(this);
    this.toggleSubMenu = this.toggleSubMenu.bind(this);
    this.handleDarkMode = this.handleDarkMode.bind(this);
    this.handleFixNavbar = this.handleFixNavbar.bind(this);
    this.handleDarkHeader = this.handleDarkHeader.bind(this);
    this.handleMinSidebar = this.handleMinSidebar.bind(this);
    this.handleSidebar = this.handleSidebar.bind(this);
    this.handleIconColor = this.handleIconColor.bind(this);
    this.handleGradientColor = this.handleGradientColor.bind(this);
    this.handleRtl = this.handleRtl.bind(this);
    this.handleFont = this.handleFont.bind(this);
    this.handleStatistics = this.handleStatistics.bind(this);
    this.handleFriendList = this.handleFriendList.bind(this);
    this.closeFriendList = this.closeFriendList.bind(this);
    this.closeStatistics = this.closeStatistics.bind(this);
    this.handleBoxLayout = this.handleBoxLayout.bind(this);
    this.handler = this.handler.bind(this);
    this.state = {
      isModal: false,
      writeToUs: false,
      isToggleLeftMenu: false,
      isOpenUserMenu: false,
      isOpenRightSidebar: false,
      isBoxLayout: false,
      setSignoutModal: false,
      parentlink: null,
      childlink: null,
      isRole: getAuthUser()?.role,
      message: "",
      radio: "",
      path: "",
      isCancelledModalOpen: false,
    };
  }

  componentDidMount() {
    this.setState({ isCancelledModalOpen: false });
    const pathname = window.location.pathname; //returns the current url minus the domain name
    this.setState({ path: pathname });
    const { location } = this.props;
    const links = location.pathname.substring(1).split(/-(.+)/);
    const parentlink = links[0];
    const nochildlink = links[1];

    if (parentlink && nochildlink && nochildlink === "dashboard") {
      this.handler(parentlink, `${parentlink}${nochildlink}`);
    } else if (parentlink && nochildlink && nochildlink !== "dashboard") {
      this.handler(parentlink, nochildlink);
    } else if (parentlink) {
      this.handler(parentlink, "");
    } else {
      this.handler("hr", "dashboard");
    }
    this.setState({ isRole: getAuthUser()?.role });
    this.props.getAllLoginData();
    if (!isLoggedIn()) {
      this.props.history.replace("/");
    }
  }

  handleFeedbackButtonClicked(e) {
    // e.preventdefault()
    const subject_feedback = {
      subject: this.state.radio,
      feedback: this.state.message,
      useremail: "param@gmail.com",
      organization: "jfs",
    };
    //console.log(subject_feedback);
    axios
      .post(mainServerAppUrl + "/feedback/add-feedback", subject_feedback)
      .then(() => {
        toast.success("Feedback sent successfully", { duration: 2000 });
        this.setState({ isModal: false });
        this.setState({});
        //console.log("toast Called");
      });
    // .then(response => setArticleId(response.data.id));
    //console.log("post ");
  }

  componentDidUpdate(prevprops, prevstate) {
    if (this.props?.userRole?.subscriptionStatus) {
      this.props.userRole.subscriptionStatus === "cancelled" && prevstate.isCancelledModalOpen === false &&
        this.state.setSignoutModal === false &&
        this.setState({ isCancelledModalOpen: true });

      // this.props.userRole.subscriptionStatus === "active" && this.props.userRole.subscriptionStatus === "created" &&
      //   prevstate.isCancelledModalOpen !== false &&
      //   this.setState({ isCancelledModalOpen: false });
    }
    const { location } = this.props;
    const links = location.pathname.substring(1).split(/-(.+)/);
    const parentlink = links[0];
    const nochildlink = links[1];
    if (prevprops.location !== location) {
      if (parentlink && nochildlink && nochildlink === "dashboard") {
        this.handler(parentlink, `${parentlink}${nochildlink}`);
      } else if (parentlink && nochildlink && nochildlink !== "dashboard") {
        this.handler(parentlink, nochildlink);
      } else if (parentlink) {
        this.handler(parentlink, "");
      } else {
        this.handler("hr", "dashboard");
      }
    }
  }

  handler(parentlink, nochildlink) {
    this.setState({
      parentlink: parentlink,
      childlink: nochildlink,
    });
  }

  handleDarkMode(e) {
    this.props.darkModeAction(e.target.checked);
  }
  handleFixNavbar(e) {
    this.props.fixNavbarAction(e.target.checked);
  }
  handleDarkHeader(e) {
    this.props.darkHeaderAction(e.target.checked);
  }
  handleMinSidebar(e) {
    this.props.darkMinSidebarAction(e.target.checked);
  }
  handleSidebar(e) {
    this.props.darkSidebarAction(e.target.checked);
  }
  handleIconColor(e) {
    this.props.iconColorAction(e.target.checked);
  }
  handleGradientColor(e) {
    this.props.gradientColorAction(e.target.checked);
  }
  handleRtl(e) {
    this.props.rtlAction(e.target.checked);
  }
  handleFont(e) {
    this.props.fontAction(e);
  }
  handleFriendList(e) {
    this.props.friendListAction(e);
  }
  handleStatistics(e) {
    this.props.statisticsAction(e);
  }
  closeFriendList(e) {
    this.props.friendListCloseAction(e);
  }
  closeStatistics(e) {
    this.props.statisticsCloseAction(e);
  }
  handleSubMenuIcon(e) {
    this.props.subMenuIconAction(e);
  }
  handleMenuIcon(e) {
    this.props.menuIconAction(e);
  }
  handleBoxLayout(e) {
    this.props.boxLayoutAction(e.target.checked);
  }
  toggleLeftMenu(e) {
    this.props.toggleLeftMenuAction(e);
  }
  toggleRightSidebar() {
    this.setState({ isOpenRightSidebar: !this.state.isOpenRightSidebar });
  }
  toggleUserMenu() {
    this.setState({ isOpenUserMenu: !this.state.isOpenUserMenu });
  }
  toggleSubMenu(e) {
    let menucClass = "";
    if (e.itemId) {
      const subClass = e.items.map((menuItem, i) => {
        if (menuItem.to === this.props.location.pathname) {
          menucClass = "in";
        } else {
          menucClass = "collapse";
        }
        return menucClass;
      });
      return subClass;
      // return "collapse";
    } else {
      return e.visible ? "collapse" : "metismenu";
    }
  }

  render() {
    const forEmployee = [
      {
        id: 38,
        icon: "ChartBar.png",
        label: "Productivity",
        to: "/productivity",
      },
      {
        id: 61,
        icon: "Chats.png",
        label: "Feedback",
        to: "/feedBackForm",
      },
    ];

    let forComplineUser = [
      {
        id: 39,
        icon: "ImageSquare.png",
        label: "Screenshot Gallery",
        to: "/dashboard",
      },
      {
        id: 38,
        icon: "ChartBar.png",
        label: "Productivity",
        to: "/productivity",
      },
      {
        id: 48,
        icon: "ChartPieSlice.png",
        label: "Reports",
        to: "/reporting",
      },
      {
        id: 61,
        icon: "Chats.png",
        label: "Feedback",
        to: "/feedBackForm",
      },
    ];

    const forManager = [
      {
        id: 39,
        icon: "ImageSquare.png",
        label: "Screenshot Gallery",
        to: "/dashboard",
      },
      {
        id: 38,
        icon: "ChartBar.png",
        label: "Productivity",
        to: "/productivity",
      },
      {
        id: 40,
        icon: "Users.png",
        label: "Users",
        to: "/user",
      },
      {
        id: 61,
        icon: "Chats.png",
        label: "Feedback",
        to: "/feedBackForm",
      },
    ];

    const superAdmin = [
      {
        id: 44,
        icon: "gauge.png",
        label: "Dashboard",
        to: "/superAdminDashboard",
      },
      {
        id: 45,
        icon: "Chats.png",
        label: "Feedbacks",
        to: "/feedback",
      },
      {
        id: 46,
        icon: "ChartBar.png",
        label: "App List",
        to: "/csvlist",
      },
      {
        id: 52,
        icon: "Lifebuoy.png",
        label: "Write to Us",
        to: "/writeToUs",
      },
    ];

    let content = [
      {
        id: 50,
        icon: "gauge.png",
        label: "Dashboard",
        to: "/adminDashboard",
      },
      {
        id: 39,
        icon: "ImageSquare.png",
        label: "Screenshot Gallery",
        to: "/dashboard",
      },
    ];

    let content1 = [
      {
        id: 38,
        icon: "ChartBar.png",
        label: "Productivity",
        to: "/productivity",
      },
      {
        id: 40,
        icon: "Users.png",
        label: "Users",
        to: "/user",
      },
      {
        id: 44,
        icon: "UsersFour.png",
        label: "Departments",
        to: "/department",
      },
      {
        id: 49,
        icon: "Question.png",
        label: "FAQs",
        to: "/faqs",
      },
      {
        id: 13,
        icon: "GearSix.png",
        label: "Settings",
        content: [
          {
            id: 51,
            icon: "ChartBar.png",
            label: "Productivity Settings",
            to: "/orgAppList",
          },
          {
            id: 16,
            icon: "Crop.png",
            label: "Default Screenshot Interval",
            to: "/defaultScreenShotInterval",
          },
          {
            id: 17,
            icon: "UserCircleMinus.png",
            label: "Delete Account",
            to: "/deleteAccount",
          },
        ],
      },
    ];

    let content2 = [
      {
        id: 61,
        icon: "Chats.png",
        label: "Feedback",
        to: "/feedBackForm",
      },
      {
        id: 60,
        icon: "Lifebuoy.png",
        label: "Write to Us",
        to: "/writeToUsForm",
      },
    ];

    let freeRoute = [
      {
        id: 46,
        icon: "CurrencyCircleDollar.png",
        label: "Plan",
        to: "/payment",
      },
    ];

    let PremiumRoutes = [
      {
        id: 48,
        icon: "ChartPieSlice.png",
        label: "Reports",
        to: "/reporting",
      },
    ];

    let PremiumRoutes1 = [
      {
        id: 47,
        icon: "CurrencyCircleDollar.png",
        label: " Subscription Details",
        to: "/subscriptionDetails",
      },
    ];

    let userAdminster = [
      {
        id: 38,
        icon: "ChartBar.png",
        label: "Productivity",
        to: "/productivity",
      },
      {
        id: 40,
        icon: "Users.png",
        label: "Users",
        to: "/user",
      },
      {
        id: 44,
        icon: "UsersFour.png",
        label: "Departments",
        to: "/department",
      },
      {
        id: 49,
        icon: "Question.png",
        label: "FAQs",
        to: "/faqs",
      },
      {
        id: 13,
        icon: "GearSix.png",
        label: "Settings",
        content: [
          {
            id: 16,
            icon: "Crop.png",
            label: "Default Screenshot Interval",
            to: "/defaultScreenShotInterval",
          },
          {
            id: 51,
            icon: "ChartBar.png",
            label: "Productivity Settings",
            to: "/orgAppList",
          },
        ],
      },
    ];

    userAdminster = [
      ...content,
      ...PremiumRoutes,
      ...userAdminster,
      ...content2,
    ];

    content =
      this.props?.subscriptionPlan === "free-forever"
        ? [...content, ...content1, ...freeRoute, ...content2]
        : this.props?.userRole.subscriptionStatus === "active"
          ? [
            ...content,
            ...PremiumRoutes,
            ...content1,
            ...PremiumRoutes1,
            ...content2,
          ]
          : [
            ...content,
            ...PremiumRoutes,
            ...content1,
            ...PremiumRoutes1,
            ...content2,
            ...freeRoute,
          ];

    const { isOpenRightSidebar, isOpenUserMenu } = this.state;
    const {
      darkMinSidebar,
      istoggleLeftMenu,
      friendListOpen,
      statisticsOpen,
      statisticsClose,
      friendListClose,
    } = this.props;
    const pageHeading = Routes.filter(
      (route) => route.path === this.props.location.pathname
    );

    // feedback code
    const handleMessageChange = (event) => {
      this.setState({ [event.target.name]: event.target.value });
      // console.log(event.target.value);
    };
    const onradiochange = (e) => {
      this.setState({ [e.target.type]: e.target.value });
      // console.log(this.state.radio);
    };

    const signOut = (e) => {
      e.preventDefault();
      eraseCookie("_token");
      localStorage.removeItem("notShowAgain");
      this.props.history.replace("/");
      this.props.getResetState();
    };

    var getInitials = function (string) {
      var names = string.split(" "),
        initials = names[0].substring(0, 1).toUpperCase();

      if (names.length > 1) {
        initials += names[names.length - 1].substring(0, 1).toUpperCase();
      }
      return initials;
    };

    let userName =
      this.props?.userRole?.firstName + " " + this.props?.userRole?.lastName;
    console.log(this.props?.userRole?.role?.role)
    return (
      <>
        <div
          className={`${istoggleLeftMenu ? "offcanvas-active" : "inActiveMenu"
            }`}
        >
          <div
            style={this.state.parentlink === "login" ? masterNone : masterBlock}
          >
            <div className="top-header-prod">
              <div className="flex-60">
                <div className="d-flex align-item-center">
                  <button
                    className="btn collapse-icon"
                    onClick={() => this.toggleLeftMenu(!istoggleLeftMenu)}
                  >
                    <i className="fa  fa-align-left" />
                  </button>
                  {this.props?.userRole?.role?.role === "admin" ? (
                    this.props?.subscriptionPlan === "free-forever" ? (
                      <div className="current-plan">
                        <p>Current : </p>

                        <>
                          <button className="btn btn-primary text-capitalize">
                            {this.props?.subscriptionPlan}
                          </button>
                          <button
                            className="btn btn-success ml-2 text-capitalize"
                            onClick={() => {
                              this.props.history.push("payment");
                            }}
                          >
                            <img
                              src={require("../../images/PremiumIcon.png")}
                              style={{
                                marginRight: "10px",
                                height: "20px",
                                width: "20px",
                              }}
                            />
                            UPGRADE TO PREMIUM
                          </button>
                        </>
                      </div>
                    ) : (
                      ""
                    )
                  ) : (
                    ""
                  )}
                </div>
              </div>
              <div className="flex-40">
                <div className="d-flex align-item-center justify-content-end">
                  <ul className="list-header-top">
                    <li>
                      <div className="dropdown">
                        <button
                          className="btn btn-secondary dropdown-toggle"
                          type="button"
                          id="dropdownMenuButton"
                          data-toggle="dropdown"
                          aria-haspopup="true"
                          aria-expanded="false"
                        >
                          {this.props?.isLoader ? (
                            <>
                              <span className="initials skeleton"></span>
                              <p className="skeleton"></p>
                              <small className="skeleton"></small>
                            </>
                          ) : (
                            <>
                              <span className="initials">
                                {getInitials(userName)}
                              </span>

                              <p>{userName}</p>
                              <small>
                                {this.props?.userRole?.organization?.name}
                              </small>
                            </>
                          )}
                        </button>
                        <div
                          className="dropdown-menu"
                          aria-labelledby="dropdownMenuButton"
                        >
                          <a
                            onClick={() => {
                              this.props.history.push("profile");
                            }}
                            className="dropdown-item"
                          >
                            <i className="dropdown-icon fe fe-user"></i>
                            Profile
                          </a>
                          <a
                            onClick={() => {
                              this.props.history.push("changePassword");
                            }}
                            className="dropdown-item"
                          >
                            <i className="dropdown-icon fe fe-lock"></i> Change
                            Password
                          </a>
                          <a
                            onClick={() => {
                              this.setState({ setSignoutModal: true });

                            }}
                            className="dropdown-item"
                          >
                            <i className="dropdown-icon fe fe-log-out" /> Sign
                            out
                          </a>
                        </div>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div id="left-sidebar" className="sidebar ">
              {!istoggleLeftMenu ? (
                <div className="company-logo">
                  <div className="header-brand">
                    <img src={require("../../images/logoProd.png")} />
                  </div>
                </div>
              ) : (
                <div className="company-logo">
                  <div className="header-brand">
                    <img src={require("../../images/logoProd2.png")} />
                  </div>
                </div>
              )}
              <nav
                id="left-sidebar-nav"
                className="sidebar-nav position-relative"
              >
                <MetisMenu
                  className=""
                  content={
                    this.props?.userRole?.role?.role === "employee"
                      ? forEmployee
                      : this.props?.userRole?.role?.role === "compliance-user"
                        ? forComplineUser
                        : this.props?.userRole?.role?.role === "manager"
                          ? forManager
                          : this.props?.userRole?.role?.role === "super-admin"
                            ? superAdmin
                            : this.props?.userRole?.role?.role === "admin"
                              ? content
                              : userAdminster
                  }
                  noBuiltInClassNames={true}
                  classNameContainer={(e) => this.toggleSubMenu(e)}
                  classNameContainerVisible="in"
                  classNameItemActive="active"
                  classNameLinkActive="active"
                  // classNameItemHasActiveChild="active"
                  classNameItemHasVisibleChild="active"
                  classNameLink="has-arrow arrow-c"
                  // classNameIcon
                  // classNameStateIcon

                  iconNamePrefix=""
                  // iconNameStateHidden=""
                  LinkComponent={(e) => <DefaultLink itemProps={e} />}
                // toggleSubMenu={this.toggleSubMenu}
                />
                {this.props?.userRole?.role?.role === "admin" ? (
                  this.props?.subscriptionPlan === "free-forever" ? (
                    <div className="text-center mt-2">
                      <button
                        className="btn btn-success ml-2 text-capitalize"
                        onClick={() => {
                          this.props.history.push("payment");
                        }}
                      >
                        <img
                          src={require("../../images/PremiumIcon.png")}
                          style={{
                            marginRight: "10px",
                            height: "20px",
                            width: "20px",
                          }}
                        />
                        UPGRADE TO PREMIUM
                      </button>
                    </div>
                  ) : (
                    ""
                  )
                ) : (
                  ""
                )}
              </nav>
            </div>
          </div>

          <div className="page">
            <Switch>
              {Routes.map((layout, i) => {
                return (
                  <Route
                    key={i}
                    exact={layout.exact}
                    path={layout.path}
                    component={layout.component}
                  ></Route>
                );
              })}
            </Switch>
          </div>
        </div>

        {this.state.setSignoutModal && (
          <div
            className="modal d-block"
            aria-labelledby="exampleModalLabel"
            aria-hidden="true"
          >
            <div
              className="modal-dialog modal-dialog-centered modal-md delete-modal"
              role="document"
            >
              <div className="modal-content">
                <div className="modal-body">
                  <div className="delete-icon">
                    <img
                      src={require("../../images/monkey.png")}
                      alt="logoProd2.png"
                    />
                  </div>
                  <h1>Oh!</h1>
                  <strong>
                    Sign Out
                    <span className="text-red"></span>
                  </strong>
                  <p
                    className="text-secondary"
                    style={{ fontSize: "14px", fontWeight: "600" }}
                  >
                    Are you sure you want to sign out?
                    <br />
                  </p>
                  <div className="delete-footer">
                    <button
                      type="reset"
                      className="btn btn-secondary mr-2"
                      data-dismiss="modal"
                      onClick={() => {
                        this.setState({ setSignoutModal: false })
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary"
                      onClick={signOut}
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <CancelPopup
          open={this.state.isCancelledModalOpen}
          closeHandler={() =>
            this.setState((prevState) => ({ isCancelledModalOpen: !prevState }))
          }
        />
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  darkMinSidebar: state.settings.isMinSidebar,
  statisticsOpen: state.settings.isStatistics,
  friendListOpen: state.settings.isFriendList,
  statisticsClose: state.settings.isStatisticsClose,
  friendListClose: state.settings.isFriendListClose,
  istoggleLeftMenu: state.settings.isToggleLeftMenu,
  subscriptionPlan: state.loginReducers?.subscriptionplans?.plan_type,
  userRole: state.loginReducers?.allData,
  isLoader: state.loginReducers?.loader,
});

const mapDispatchToProps = (dispatch) => ({
  darkModeAction: (e) => dispatch(darkModeAction(e)),
  darkHeaderAction: (e) => dispatch(darkHeaderAction(e)),
  fixNavbarAction: (e) => dispatch(fixNavbarAction(e)),
  darkMinSidebarAction: (e) => dispatch(darkMinSidebarAction(e)),
  darkSidebarAction: (e) => dispatch(darkSidebarAction(e)),
  iconColorAction: (e) => dispatch(iconColorAction(e)),
  gradientColorAction: (e) => dispatch(gradientColorAction(e)),
  rtlAction: (e) => dispatch(rtlAction(e)),
  fontAction: (e) => dispatch(fontAction(e)),
  subMenuIconAction: (e) => dispatch(subMenuIconAction(e)),
  menuIconAction: (e) => dispatch(menuIconAction(e)),
  boxLayoutAction: (e) => dispatch(boxLayoutAction(e)),
  statisticsAction: (e) => dispatch(statisticsAction(e)),
  friendListAction: (e) => dispatch(friendListAction(e)),
  statisticsCloseAction: (e) => dispatch(statisticsCloseAction(e)),
  friendListCloseAction: (e) => dispatch(friendListCloseAction(e)),
  toggleLeftMenuAction: (e) => dispatch(toggleLeftMenuAction(e)),
  getAllLoginData: () => dispatch(getAllLoginData()),
  getResetState: () => dispatch(getResetState()),
});
export default connect(mapStateToProps, mapDispatchToProps)(Menu);
