import React, { useEffect, memo, useState, useRef } from "react";
import { WebService } from "../../Services/WebService";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import { format } from "date-fns";
import AddEditPerformanceComponent from "./AddEditPerformanceComponent";
import { PageInfo } from "../PageInfo";

const PerformanceComponent = () => {
  PageInfo({ pageTitle: "Performance" });
  const [records, setRecords] = useState([]);
  const fetchPerformanceList = async () => {
    const data = await WebService({ endPoint: "Performance/Fetch" });
    setRecords(data);
  };
  const renderAfterCalled = useRef(false);
  const addEditModalRef = useRef();
  useEffect(() => {
    if (!renderAfterCalled.current) {
      fetchPerformanceList();
    }
    renderAfterCalled.current = true;
  }, []);
  const fnEdit = async (id) => await addEditModalRef.current.openModal(id || 0);
  return (
    <>
      <div style={{ width: "100%" }}>
        <Table striped bordered hover size="sm">
          <thead>
            <tr>
              <th>Emp. Code</th>
              <th>Emp. Name</th>
              <th>From</th>
              <th>To</th>
              <th>KRA</th>
              <th>Emp. Description</th>
              <th>Emp. Rating</th>
              <th>Manager Description</th>
              <th>Manager Rating</th>
              <th>Final Rating</th>
              <th>
                <Button variant="primary" size="sm" onClick={() => fnEdit()}>
                  Add
                </Button>
              </th>
            </tr>
          </thead>
          <tbody>
            {records.map((data) => (
              <tr key={data.PerformanceId}>
                <td>{data.EmployeeCode}</td>
                <td>{data.FullName}</td>
                <td>{format(new Date(data.FromDate), "dd/MM/yyyy")}</td>
                <td>{format(new Date(data.ToDate), "dd/MM/yyyy")}</td>
                <td>{data.KeyRatingAria}</td>
                <td>{data.EmployeeDescription}</td>
                <td>{data.EmployeeRating}</td>
                <td>{data.ManagerDescription}</td>
                <td>{data.ManagerRating}</td>
                <td>{data.FinalRating}</td>
                <td>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => fnEdit(data.PerformanceId)}
                  >
                    Edit
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
      <AddEditPerformanceComponent
        callBackEvent={()=>fetchPerformanceList()}
        ref={addEditModalRef}
      ></AddEditPerformanceComponent>
    </>
  );
};

export default memo(PerformanceComponent);
