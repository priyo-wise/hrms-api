import React, { useEffect, useState, useRef } from "react";
import { WebService } from "../../Services/WebService";
import { format } from "date-fns";
import "./Leave.css";

const AllApplyleavelist = () => {
  const [records, setRecords] = useState([]);
  const fetchLeaveList = async () => {
    const data = await WebService({ endPoint: "ApplyLeave/Fetch" });
    console.log(data);
    setRecords(data);
  };
  const renderAfterCalled = useRef(false);
  useEffect(() => {
    if (!renderAfterCalled.current) {
      fetchLeaveList();
    }
    renderAfterCalled.current = true;
  }, []);
  return (
    <div className="col-md-10 mx-4">
      <div className="row justify-content-center">
        <div className="col-md-12 success">
          <table className="table bg-white rounded table-sm table-bordered">
            <thead className="text-center">
              <tr>
                <th className="col-3">
                  <h3>Employee Name</h3>
                </th>
                <th className="col-3">
                  <h3>leave Type</h3>
                </th>
                <th className="col-3">
                  <h3>From</h3>
                </th>
                <th className="col-3">
                  <h3>To</h3>
                </th>
              </tr>
            </thead>
            <tbody className="text-center">
              {records.map((data) => (
                <tr>
                  <td>
                    <h6>{data.FullName}</h6>
                  </td>
                  <td>
                    <h6>{data.LeaveType}</h6>
                  </td>
                  <td>
                    <h6>{format(new Date(data.FromDate), "dd/MM/yyyy")}</h6>
                  </td>
                  <td>
                    <h6>{format(new Date(data.ToDate), "dd/MM/yyyy")}</h6>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AllApplyleavelist;
