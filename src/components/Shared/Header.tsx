import React, { Component, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { eraseCookie, isLoggedIn } from '../Authentication/authHelpers';
import { useHistory, Link } from "react-router-dom";
import { mainServerAppUrl } from '../../apis/mainapi';

const Header = ({ fixNavbar, darkHeader, dataFromSubParent }) => {
  let navigate = useHistory();
  const [checkLogin, setLogin] = useState(isLoggedIn());
  const [isCancelModal, setCancelModal] = useState(false);

  const signOut = (e) => {
    e.preventDefault();
    eraseCookie("_token")
    navigate.replace('/');
  }


  useEffect(() => {
    if (!checkLogin) {
      navigate.replace("/");
    }
  }, [checkLogin]);

  return (
    <div>
      <div
        id="page_top"
        className={`section-body ${fixNavbar ? "sticky-top" : ""} ${darkHeader ? "top_dark" : ""
          }`}
      >
        <div className="container-fluid">
          <div className="page-header">
            <div className="left">
              <h1 className="page-title">{dataFromSubParent}</h1>
            </div>
            <div className="right">
              <button onClick={() => setCancelModal(true)} className="btn btn-outline-primary btn-sm">
                <i className="dropdown-icon fe fe-log-out" /> Sign out
              </button>
              {/* <div className="notification d-flex">
                <div className="dropdown d-flex">
                  <a
                    href="/#"
                    className="nav-link icon d-none d-md-flex btn btn-default btn-icon ml-1"
                    data-toggle="dropdown"
                  >
                    <i className="fa fa-user" />
                  </a>
                  <div className="dropdown-menu dropdown-menu-right dropdown-menu-arrow">
                    <NavLink to="/profile" className="dropdown-item">
                      <i className="dropdown-icon fe fe-user" /> Profile
                    </NavLink>
                    <button className="dropdown-item" onClick={()=>{navigate.push("/settings")}}>
                      <i className="dropdown-icon fe fe-settings" /> Settings
                    </button>
                    <button onClick={signOut} className="dropdown-item">
                      <i className="dropdown-icon fe fe-log-out" /> Sign out
                    </button>
                  </div>
                </div>
              </div> */}
            </div>
          </div>
        </div>
      </div>
      {isCancelModal && (
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
            </div>
            <div className="modal-footer">
              <button
                type="reset"
                className="btn btn-secondary mr-2"
                data-dismiss="modal"
                onClick={() => {
                  setCancelModal(false);
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
    )}
    </div>
  );
};
const mapStateToProps = state => ({
  fixNavbar: state.settings.isFixNavbar,
  darkHeader: state.settings.isDarkHeader
})

const mapDispatchToProps = dispatch => ({})
export default connect(mapStateToProps, mapDispatchToProps)(Header);