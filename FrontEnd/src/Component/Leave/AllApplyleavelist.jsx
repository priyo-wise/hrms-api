import React, { useEffect, useState, useRef } from "react";
import { WebService } from "../../Services/WebService";
import { format } from "date-fns";
import AddEditLeave from "./AddEditleave";
import ApproveRejectLeave from "./ApproveDecline";
import Table from "react-bootstrap/Table";
import Container from "react-bootstrap/Container";
import "../Static/Static.css";
import { useDispatch } from "react-redux";
import TableComponent from "../../Services/TableComponent";
import { ActionPermission, PageInfo } from "../PageInfo";
import SnackbarComponent from "../../Services/SnackbarComponent";
import DeleteConfirmAlert from "../../Services/AlertComponent";
import "../Static/Static.css";
import ActionButton from "../../Services/ActionButton";
import StaticListComponent from "../../Services/StaticListComponent";

const empid = 0;
const AllApplyLeaveList = () => {
  const ref = useRef();
  const refSnackbar = useRef();
  const [records, setRecords] = useState([]);
  const [ApprovalStatus, setleaveApprovalStatus] = useState([]);
  const [Employeeleave, setEmployeeleave] = useState([]);
  const dispatch = useDispatch();
  PageInfo({ pageTitle: "Leave" });
  const [permission] = useState({
    ManageAdd: ActionPermission("Leave - Add"),
    ManageEdit: ActionPermission("Leave - Edit"),
    ManageAllUser: ActionPermission("Leave - Search All User"),
    ManageAprroveReject: ActionPermission("Leave - Approve Reject"),
  });
  const fetchLeaveList = async () => {
    var endPoint = "ApplyLeave/Fetch";
    if (permission.ManageAllUser) endPoint += "/All";
    else endPoint += "/Own";
    const data = await WebService({ endPoint, dispatch });
    setRecords(data.AllLeave);
    setEmployeeleave(data.Employeeleave);
    setleaveApprovalStatus(data?.AllLeave?.ApprovalStatusId);
  };
  const fetchtotalLeave = async (Remainingleave) => {
    let passId = {
      // EmployeeID:id,
    };
    const data = await WebService({
      dispatch,
      endPoint: "ApplyLeave/Remainingleave",
      body: passId,
    });
    console.log(data);
    //setRecords(data);
  };
  const renderAfterCalled = useRef(false);
  const addEditModalRef = useRef();
  const approveRejectModalRef = useRef();
  useEffect(() => {
    if (!renderAfterCalled.current) {
      fetchLeaveList();
    }
    renderAfterCalled.current = true;
  }, []);
  const fnEdit = async (id) => await addEditModalRef.current.openModal(id || 0);

  const fnLeaveApproveReject = async (id) =>
    await approveRejectModalRef.current.openModal(id || 0);

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
    fetchLeaveList();
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
    fetchLeaveList();
  };
  const validBtn = "btn btn-primary";
  const invalidBtn = "btn btn-primary disabled";
  const angle = null;
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
    fetchLeaveList();
  };
  const columns = [
    {
      Text: "Name",
      Value: "FullName",
    },
    {
      Text: "Apply Date",
      DateFormat: "yyyy-MM-dd",
      Value: "LeaveApplyDate",
    },
    {
      Text: "From Date",
      DateFormat: "yyyy-MM-dd",
      Value: "LeaveFromDate",
    },
    {
      Text: "To Date",
      DateFormat: "yyyy-MM-dd",
      Value: "LeaveToDate",
    },
    {
      Text: "leave Type",
      Value: "LeaveName",
    },
    {
      Text: "Approval Status",
      Value: "approvalStatus",
    },
    {
      Text: "Status",
      Value: "Status",
    },
    {
      Text: "ACTION",
      key: "LeavesId",
      isVisiable: permission.ManageEdit,
      cssClass: "text-center td-width-100",
      Template: (
        <>
        
        <ActionButton
            onClick={(e) =>
              fnEdit(e.currentTarget.parentElement.getAttribute("data-key"))
            }
            disabled={!permission.ManageEdit}
            IconName="Edit"
            id="btnleaveApplyEdit"
          />
          <button
            className="btn btn-default mt-2 mx-4"
            id="btnleaveApplyCancel"
            onClick={(e) =>
              fnLeaveApproveReject(
                e.currentTarget.parentElement.getAttribute("data-key")
              )
            }
          >
            <i className="fa fa-close"></i>
          </button>
        </>
      ),
    },
    {
      Text: "ACTION",
      key: "LeavesId",
      isVisiable: permission.ManageAprroveReject,
      cssClass: "text-center td-width-100",
      Template: (
        <>        
        <ActionButton
            onClick={(e) =>
              fnLeaveApproveReject(e.currentTarget.parentElement.getAttribute("data-key"))
            }
            disabled={!permission.ManageAprroveReject}
            IconName="Edit"
            id="btnleaveApplyApproveReject"
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
      title: "Leave",
      hrefLink: "#",
    },
  ]);
  const MasterPageName = "Leave";
  const confirmMessage = MasterPageName + " Deleted successfully";
  
  return (
    <>     
    <Container
        className="p-4"
        style={{
          "background-color": "#FFF",
          "border-radius": "10px ",
          margin: "10px",
        }}
      >
        <div>
          <div class="row align-items-center p-0">
            <div class="col-sm-4 col-12 mb-2 mb-sm-0">
              <h1 class="h2 mb-0 ls-tight">Leave Balance :</h1>
            </div>

            <div class="col-sm-6 col-12">
              <div class="mx-n1">
                {Employeeleave.map((data) => {
                  return (
                    <a href="#" class="btn d-inline-flex btn-sm btn-info mx-1">
                      <span>{data.LeaveName} :</span>
                      <span>
                        {data.Usedleave}/{data.Balance}
                      </span>
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        
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
      </Container>
  
      <AddEditLeave
        callBackEvent={() => fetchLeaveList()}
        ref={addEditModalRef}
      ></AddEditLeave>

      <ApproveRejectLeave
        callBackEvent={() => fetchLeaveList()}
        ref={approveRejectModalRef}
      ></ApproveRejectLeave>
    </>
  );
};

export default AllApplyLeaveList;
