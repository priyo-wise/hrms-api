import React, { useState, useEffect, useRef } from "react";
import { WebService } from "../../Services/WebService";
import AddEditJobFunction from "./AddEditJobFunction";
import { useDispatch } from "react-redux";
import Container from "react-bootstrap/Container";
import "./Static.css";
import { confirm } from "react-confirm-box";
import TableComponent from "../../Services/TableComponent";
import { ActionPermission, PageInfo } from "../PageInfo";
import SnackbarComponent from "../../Services/SnackbarComponent";
import DeleteConfirmAlert from "../../Services/AlertComponent";
import "../Static/Static.css";
import ActionButton from "../../Services/ActionButton";
import StaticListComponent from "../../Services/StaticListComponent";

const JobFunction = () => {
  const ref = useRef();
  const refSnackbar = useRef();
  PageInfo({ pageTitle: "Job Function" });
  const dispatch = useDispatch();
  const [records, setRecords] = useState([]);
  const [permission] = useState({
    ManageAdd: ActionPermission("Job Function - Add"),
    ManageEdit: ActionPermission("Job Function - Edit"),
    ManageDelete: ActionPermission("Job Function - Delete"),
  });
  const fetchJobFunction = async () => {
    const data = await WebService({ endPoint: "JobFunction/Fetch", dispatch });
    setRecords(data);
  };

  const onDelete = async (JobFunctionId) => {
    await WebService({
      endPoint: `JobFunction/Remove/${JobFunctionId}`,
      method: "DELETE",
      dispatch,
    });
    refSnackbar.current.setOpenSnackBar();
    await fetchJobFunction();
  };
  const renderAfterCalled = useRef(false);
  const addEditModalRef = useRef();
  useEffect(() => {
    if (!renderAfterCalled.current) {
      fetchJobFunction();
    }
    renderAfterCalled.current = true;
  }, []);
  const columns = [
    {
      Text: "Job Function",
      Value: "JobFunction",
    },
    {
      Text: "Job Description",
      Value: "JobDescription",
    },
    {
      Text: "Action",
      key: "JobFunctionId",
      cssClass: "text-center td-width-100",
      isVisiable: permission.ManageEdit || permission.ManageDelete,
      Template: (
        <>
          <ActionButton
            onClick={(e) =>
              fnEdit(e.currentTarget.parentElement.getAttribute("data-key"))
            }
            disabled={!permission.ManageEdit}
            IconName="Edit"
            id="btnJobFunctionEdit"
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
            id="btnJobFunctionDelete"
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
      title: "Job Function",
      hrefLink: "#",
    },
  ]);
  const MasterPageName = "Job Function";
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
      <AddEditJobFunction
        callBackEvent={() => fetchJobFunction()}
        ref={addEditModalRef}
      ></AddEditJobFunction>
    </>
  );
};
export default JobFunction;
