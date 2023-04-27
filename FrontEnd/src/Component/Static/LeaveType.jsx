import React, { useState, useEffect, useRef } from "react";
import { WebService } from "../../Services/WebService";
import AddEditLeaveType from "./AddEditLeaveType";
import { useDispatch } from "react-redux";
import "./Static.css";
import { ActionPermission, PageInfo } from "../PageInfo";
import SnackbarComponent from "../../Services/SnackbarComponent";
import DeleteConfirmAlert from "../../Services/AlertComponent";
import "../Static/Static.css";
import ActionButton from "../../Services/ActionButton";
import StaticListComponent from "../../Services/StaticListComponent";

const apiUrl="CommonUtility/staticLeaveTypes";
const LeaveType = () => {
  const ref = useRef();
  const refSnackbar = useRef();
  PageInfo({ pageTitle: "Leave Type" });
  const dispatch = useDispatch();
  const [records, setRecords] = useState([]);
  const [permission] = useState({
    ManageAdd: ActionPermission("Leave Type - Add"),
    ManageEdit: ActionPermission("Leave Type - Edit"),
    ManageDelete: ActionPermission("Leave Type - Delete"),
  });
  const fetchLeaveType = async () => {
    const data = await WebService({
      endPoint: apiUrl,
      dispatch,
    });
    setRecords(data);
  };

  const onDelete = async (LeaveId) => {
    await WebService({
      endPoint: `${apiUrl}?LeaveId=${LeaveId}`,
      method: "DELETE",
      dispatch,
    });
    refSnackbar.current.setOpenSnackBar();
    await fetchLeaveType();
  };
  const renderAfterCalled = useRef(false);
  const addEditModalRef = useRef();
  useEffect(() => {
    if (!renderAfterCalled.current) {
      fetchLeaveType();
    }
    renderAfterCalled.current = true;
  }, []);
  const columns = [
    {
      Text: "Leave Name",
      Value: "LeaveName",
    },
    {
      Text: "Description",
      Value: "LeaveDescription",
    },
    {
      Text: "ACTION",
      key: "LeaveId",
      style:{width:"60px",padding:"0px"},
      isVisiable: permission.ManageEdit || permission.ManageDelete,
      Template: (
        <>
          <ActionButton
            onClick={(e) =>
              fnEdit(e.currentTarget.parentElement.getAttribute("data-key"))
            }
            disabled={!permission.ManageEdit}
            IconName="Edit"
            id="btnleaveTypeEdit"
          />

          <ActionButton
            onClick={(e) =>
              ref.current.confirmAlert(
                "Delete", //Confirm button text
                "Are You Sure", // Text if Alert
                "Do you want to delete " + MasterPageName, // Message of Alert
                e.currentTarget.parentElement.getAttribute("data-key") // Endpoint to hit for delete
              )
            }
            disabled={!permission.ManageDelete}
            IconName="Delete"
            id="btnleaveTypeDelete"
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
      title: "Leave Type",
      hrefLink: "#",
    },
  ]);
  const MasterPageName = "Leave Type";
  const confirmMessage = MasterPageName + " Deleted successfully";

  const fnEdit = async (id) => await addEditModalRef.current.openModal(id || 0);
  return (
    <>
      <SnackbarComponent ref={refSnackbar} confirmMessage={confirmMessage} />
      <DeleteConfirmAlert ref={ref} confirmEvent={(v) => onDelete(v)} />
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
      <AddEditLeaveType
        callBackEvent={() => fetchLeaveType()}
        ref={addEditModalRef}
      ></AddEditLeaveType>
    </>
  );
};
export default LeaveType;
