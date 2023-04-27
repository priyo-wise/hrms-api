import React from "react";
import { Link } from "react-router-dom";
import "../Login.css";
import { useSelector } from "react-redux";

function FooterComponent() {
  const CompanyInfo = useSelector((s) => s.auth.CompanyInfo ?? {});

  return (
    <div class="bg-blue py-4">
      <div class=" d-flex justify-content-between px-3">
        <div class="social-contact ml-4 ml-sm-auto d-none d-lg-block">
          <Link className="link-route" to={`/Auth/Register?company=${(CompanyInfo??{}).Code}`} id="btnFooterRegister">
            Register
          </Link>
          <span className="vertical-line mx-2"></span>
          <Link className="link-route" to={`/Auth/HolidayList?company=${(CompanyInfo??{}).Code}`} id="btnFooterHoliday">
            Holiday
          </Link>
          <span className="vertical-line mx-2"></span>
          <Link className="link-route" to={`/Auth?company=${(CompanyInfo??{}).Code}`} id="btnFooterlogin">
            Login
          </Link>
        </div>
        <small class="ml-4 ml-sm-5 mb-2">
          Copyright &copy; 2023. All rights reserved.
        </small>
        <div class="social-contact ml-4 ml-sm-auto d-none d-lg-block">
          <span class="fa fa-facebook me-4 text-sm"></span>
          <span class="fa fa-linkedin me-4 text-sm"></span>
          <span class="fa fa-twitter me-4 mr-sm-5 text-sm"></span>
        </div>
      </div>
    </div>
  );
}

export default FooterComponent;
