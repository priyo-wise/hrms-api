import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import "./HolidayList.css";
import * as yup from "yup";
import axios from "axios";
import FooterComponent from "../Layout/FooterComponent";
import validator from "validator";
import { WebService } from "../../Services/WebService";
import { format } from "date-fns";
const HolidayList = () => {
  const dispatch = useDispatch();
  const [records, setRecords] = useState([]);
  const fetchStatus = async () => {
    const data = await WebService({ endPoint: "Holiday/FetchUA", dispatch });
    console.log("HD", data);
    setRecords(data);
  };
  const renderAfterCalled = useRef(false);
  useEffect(() => {
    if (!renderAfterCalled.current) {
      fetchStatus();
    }
    renderAfterCalled.current = true;
  }, []);

  return (
    <div class="container">
      <div class="row">
        <div class="col-lg-12">
          <div class="wrapper wrapper-content animated fadeInRight">
            <div class="ibox-content m-b-sm border-bottom">
              <div class="col-md-9">
                <div class="logo-icon">
                  <img
                    src="../WiseLogoFinal.png"
                    alt="logo"
                    className="img-size"
                  />
                </div>
                <h2>Holiday List - 2023</h2>
                <div class="forum-sub-title">
                  List of period of time set aside for festivals or recreation
                </div>
              </div>
            </div>

            <div class="ibox-content forum-container">
              <div class="forum-title">
                <div class="pull-right forum-desc">
                  <samll>Total Holiday: 21</samll>
                </div>
                <h3>Calendar of 2023</h3>
              </div>
              {records.map((data) => (
                
                <div class="forum-item active">
                  <div class="row">
                    <div class="col-md-1">
                      <div class="widget-49-title-wrapper">
                        <div class={`widget-49-date-${data.HolidayWeekDay}`}>
                          <span class="widget-49-date-day">
                            {" "}
                            {format(new Date(data.HolidayDate), "dd")}{" "}
                          </span>
                          <span class="widget-49-date-month">
                            {format(new Date(data.HolidayDate), "MMM")}{" "}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div class="col-md-8">
                      <div class="forum-item-title">{data.HolidayName}</div>
                      <div class="forum-sub-title">{data.HolidayComments}</div>
                    </div>

                    <div class="d-flex align-items-center justify-content-start col-md-1 forum-info">
                      <span class="forum-day">{data.HolidayWeekDay}</span>
                    </div>
                    <div class="d-flex align-items-center justify-content-end col-md-2">
                      <span class=""> {data.HolidaySaka}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <FooterComponent />
        </div>
      </div>
    </div>
  );
};

export default HolidayList;
