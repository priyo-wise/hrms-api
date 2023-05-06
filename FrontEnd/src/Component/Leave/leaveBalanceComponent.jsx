import React, { useEffect, useState, useRef } from "react";
import { WebService } from "../../Services/WebService";
import { format } from "date-fns";
import "../Static/Static.css";
import AddEditleaveBalance from "./AddEditleaveBalance";
import Table from "react-bootstrap/Table";
import Container from "react-bootstrap/Container";
import TableComponent from "../../Services/TableComponent";
import { ActionPermission, PageInfo } from "../PageInfo";
import SnackbarComponent from "../../Services/SnackbarComponent";
import "../Static/Static.css";
import ActionButton from "../../Services/ActionButton";
import StaticListComponent from "../../Services/StaticListComponent";
import { useDispatch } from "react-redux";

const AllLeaveBalanceList = () => {
  const ref = useRef();
  const refSnackbar = useRef();
  PageInfo({ pageTitle: "Leave Allocation" });
  const [records, setRecords] = useState([]);
  const dispatch = useDispatch();
  const [permission] = useState({
    ManageAdd: ActionPermission("Leave - Allocation"),
    ManageEdit: ActionPermission("Permission - Edit"),
    ManageDelete: ActionPermission("Permission - Delete"),
  });
  const fetchLeaveBalanceList = async () => {
    const data = await WebService({ endPoint: "leaveBalance/Fetch",dispatch });
    setRecords(data);
  };
  const renderAfterCalled = useRef(false);
  const addEditModalRef = useRef();
  useEffect(() => {
    if (!renderAfterCalled.current) {
      fetchLeaveBalanceList();
    }
    renderAfterCalled.current = true;
  }, []);
  const fnEdit = async (id) => await addEditModalRef.current.openModal(id || 0);
  const fnCancel = async (id) => {
    let data = {
      LeavesId: id,
      StatusId: 2,
      ApprovalStatusId: 5,
    };
    //alert(JSON.stringify(data));

    //console.log("Submit Data" ,data)
    await WebService({
      endPoint: "Applyleave/ChangeLeaveStatus",
      body: data,
      dispatch,
    });
    fetchLeaveBalanceList();
  };
  const fnApprove = async (id) => {
    let data = {
      LeavesId: id,
      StatusId: 1,
      ApprovalStatusId: 3,
    };
    await WebService({
      endPoint: "Applyleave/ChangeLeaveStatus",
      body: data,
      dispatch,
    });
    fetchLeaveBalanceList();
  };
  const fnReject = async (id) => {
    let data = {
      LeavesId: id,
      StatusId: 1,
      ApprovalStatusId: 4,
    };
    await WebService({
      endPoint: "Applyleave/ChangeLeaveStatus",
      body: data,
      dispatch,
    });
    fetchLeaveBalanceList();
  };
  const columns = [
    {
      Text: "Employee Name",
      Value: "employeeName",
    },
    {
      Text: "leave Type",
      Value: "LeaveName",
    },
    {
      Text: "Allocated leaves",
      Value: "NoOfLeaveDebited",
    },
    {
      Text: "Action",
      key: "leaveTransactionsId",
      cssClass: "text-center td-width-100",
      isVisiable: permission.ManageEdit,
      Template: (
        <>
          <ActionButton
            onClick={(e) =>
              fnEdit(e.currentTarget.parentElement.getAttribute("data-key"))
            }
            disabled={!permission.ManageEdit}
            IconName="Edit"
            id="btnleaveBalanceModelEdit"
          />

        </>
      ),
    },
  ];
 
  const [bData, setBData] = React.useState([
    {
      title: "Master",
      hrefLink: "#",
    },
    {
      title: "Leaves Allocation",
      hrefLink: "#",
    },
  ]);
  const MasterPageName = "Leaves Allocation";  
  const confirmMessage = MasterPageName + " Deleted successfully";
  
  return (
    <>
    <SnackbarComponent ref={refSnackbar} confirmMessage={confirmMessage} />
    <StaticListComponent
      columns={columns}
      records={records}
      bData={bData}
      MasterPageName={MasterPageName}
      onAddEvent={() => fnEdit()}
      IsAddButtonVisible={permission?.ManageAdd}
      isSearchRequired={true}
      allowSerialNo={true}
    ></StaticListComponent>    
      <AddEditleaveBalance
        callBackEvent={() => fetchLeaveBalanceList()}
        ref={addEditModalRef}
      ></AddEditleaveBalance>
    </>
      );
};

export default AllLeaveBalanceList;
