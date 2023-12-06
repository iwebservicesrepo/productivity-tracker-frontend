import React from "react";
import { connect } from "react-redux";
import { getAuthUser } from "../Authentication/authHelpers";
import { useSelector } from "react-redux";
import Loaders from "../Loaders/Loaders";

function Profile(props) {
  const { fixNavbar } = props;
  const { allData, loader } = useSelector((state) => state.loginReducers);
  console.log(loader);
  let loginData = allData;
  let email = loginData?.email;
  let role = loginData?.role?.role;
  let name = loginData?.firstName + " " + loginData?.lastName;

  var getInitials = function (string) {
    var names = string.split(" "),
      initials = names[0].substring(0, 1).toUpperCase();

    if (names.length > 1) {
      initials += names[names.length - 1].substring(0, 1).toUpperCase();
    }
    return initials;
  };

  return (
    <>
      {loader ? (
        <Loaders />
      ) : (
        <>
          <header className="page-header">
            <div className="flex-40">
              <h1>{name}</h1>
            </div>
            <div className="flex-60"></div>
          </header>
          <div className={`section-body ${fixNavbar ? "marginTop" : ""} `}>
            <div className="card">
              <div className="card-body profile-wrapper">
                <div className="profile-wrapper-header">
                  <div className="card-profile-initials">
                    {getInitials(name)}
                  </div>
                  <h4 className="text-capitalize">{name}</h4>
                  <p>{email}</p>
                  <span className="badge bg-primary text-capitalize">
                    {role}
                  </span>
                </div>
                <div className="profile-wrapper-body">
                  <p className="mb-2">
                    {" "}
                    Click on the button below to download the desktop client of
                    ScalaTracker.
                  </p>
                  <p className="mb-4">
                    {" "}
                    Login to your account after the installation and you are
                    good to go.
                    <br /> No additional setup required.
                  </p>
                  <a
                    href="https://scalatrackerapp.s3.ap-south-1.amazonaws.com/Scalatracker+Setup+0.1.0.exe"
                    target="_blank"
                    className="btn btn-outline-primary btn-sm"
                    rel="noreferrer"
                  >
                    Download Application
                  </a>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

const mapStateToProps = (state) => ({
  fixNavbar: state.settings.isFixNavbar,
});

const mapDispatchToProps = (dispatch) => ({});
export default connect(mapStateToProps, mapDispatchToProps)(Profile);
