import React from "react";
import { Link } from "react-router-dom";
import { StandardConst } from "../../Services/StandardConst";
import { WebService } from "../../Services/WebService";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../Services/authSlice";
import _ from "underscore";
import Accordion from "react-bootstrap/Accordion";
import "./Sidemenu.css";
const Menu = ({ dataSet, childOf }) => {
  return (
    <>
      <Accordion as={"ul"} className="navbar-nav">
        {_.map(_.where(dataSet, { ParentId: childOf }), (m) => (
          <>
            {m.Route !== null && (
              <Accordion.Item
                style={{ border: "none" }}
                eventKey={m.MenuId}
                as={"li"}
                className="nav-item"
                id={`control_${m.Route}`}
              >
                <Link className="nav-link" to={`/${m.Route}`}>
                  {" "}
                  <i className={m.Icon}></i> {m.MenuText}
                </Link>
              </Accordion.Item>
            )}
            {m.Route === null && (
              <Accordion.Item
                eventKey={m.MenuId}
                as={"li"}
                id={`control_${m.MenuText}`}
              >
                <Accordion.Header className="accordion-header-custom">
                  <span className="nav-link p-0 m-0">
                    <i className={m.Icon}></i>
                    {m.MenuText}
                  </span>
                </Accordion.Header>
                <Accordion.Body style={{ padding: 0 }}>
                  <Menu dataSet={dataSet} childOf={m.MenuId} />
                </Accordion.Body>
              </Accordion.Item>
            )}
          </>
        ))}
      </Accordion>
    </>
  );
};
function SideBarComponent() {
  const dispatch = useDispatch();
  const fnLogout = async () => {
    await WebService({ dispatch, endPoint: "LogOut/Clear" });
    dispatch(logout());
  };
  const menu = useSelector((state) => state.auth.MenuList);
  return (
    <nav
      className="navbar show navbar-vertical navbar-expand-lg px-0 py-3 navbar-light bg-white border-bottom border-bottom-lg-0 border-end-lg"
      id="navbarVertical"
    >
      <div className="container-fluid">
        <button
          className="navbar-toggler ms-n2"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#sidebarCollapse"
          aria-controls="sidebarCollapse"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <a className="navbar-brand py-lg-2 px-lg-6 me-0" href="#">
          <img src={`${StandardConst.images}WiseEmployeeLogo.png`} alt="..." />
        </a>

        <div className="navbar-user d-lg-none">
          <div className="dropdown">
            <a
              href="#"
              id="sidebarAvatar"
              role="button"
              data-bs-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
            >
              <div className="avatar-parent-child">
                <img
                  alt="Image Placeholder"
                  src="https://images.unsplash.com/photo-1548142813-c348350df52b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=3&w=256&h=256&q=80"
                  className="avatar avatar- rounded-circle"
                />
                <span className="avatar-child avatar-badge bg-success"></span>
              </div>
            </a>

            <div
              className="dropdown-menu dropdown-menu-end"
              aria-labelledby="sidebarAvatar"
            >
              <a href="#" className="dropdown-item">
                Profile
              </a>
              <a href="#" className="dropdown-item">
                Settings
              </a>
              <a href="#" className="dropdown-item">
                Billing
              </a>
              <hr className="dropdown-divider" />
              <a href="#" className="dropdown-item">
                Logout
              </a>
            </div>
          </div>
        </div>

        <div className="collapse navbar-collapse" id="sidebarCollapse">
          <Menu dataSet={menu} childOf={null}></Menu>

          <hr className="navbar-divider my-2 opacity-20" />

          <ul className="navbar-nav">
            <li className="nav-item">
              <Link className="nav-link" id="btnUserProfileMenu" to="/Common/Profile">
                <i className="fa fa-user"></i> User Profile
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className="nav-link"
                id="btnChangrPasswordMenu"
                to="/Common/ChangePassword"
              >
                <i className="fa fa-key"></i> Change Password
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className="nav-link"
                id="btnlogoutMenu"
                to=""
                onClick={() => fnLogout()}
              >
                <i className="fa fa-sign-out"></i> Logout
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" id="btnErrorlogComponent" to="/Common/Error">
                <i className="fa fa-key"></i> Error
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default SideBarComponent;
