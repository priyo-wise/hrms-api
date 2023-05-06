import React, { useEffect, useRef, useState } from "react";
import Container from "react-bootstrap/esm/Container";
import { confirm } from "react-confirm-box";
import { useDispatch } from "react-redux";
import TableComponent from "../../Services/TableComponent";
import { WebService } from "../../Services/WebService";
import { PageInfo } from "../PageInfo";
import AddEditTaskType from "./AddEditTaskType";
import SnackbarComponent from "../../Services/SnackbarComponent";
import DeleteConfirmAlert from "../../Services/AlertComponent";
import "../Static/Static.css";
import ActionButton from "../../Services/ActionButton";
import StaticListComponent from "../../Services/StaticListComponent";

const TaskType = () => {
  const ref = useRef();
  const refSnackbar = useRef();
  PageInfo({ pageTitle: "Task Type" });
  const dispatch = useDispatch();
  const [records, setRecords] = useState([]);
  const renderAfterCalled = useRef(false);
  const addEditModalRef = useRef();
  useEffect(() => {
    if (!renderAfterCalled.current) {
      fetchRecords();
    }
    renderAfterCalled.current = true;
  }, []);
  const fetchRecords = async () => {
    const data = await WebService({
      endPoint: "TaskType",
      dispatch,
    });
    setRecords(data);
  };
  const fnEdit = async (id) => await addEditModalRef.current.openModal(id || 0);

  const onDelete = async (id) => {
    await WebService({
      endPoint: `TaskType/${id}`,
      method: "DELETE",
      dispatch,
    });
    refSnackbar.current.setOpenSnackBar();
    await fetchRecords();
  };
  var columns = [
    {
      Text: "Code",
      Value: "CoreCode",
    },
    {
      Text: "Description",
      Value: "DisplayDescription",
    },
    {
      Text: "Action",
      key: "TaskTypeId",
      cssClass: "text-center td-width-100",
      //isVisiable: permission.ManageEdit || permission.ManageDelete,
      Template: (
        <>
          <ActionButton
            onClick={(e) =>
              fnEdit(e.currentTarget.parentElement.getAttribute("data-key"))
            }
            // disabled={!permission.ManageEdit}
            IconName="Edit"
            id="btnTaskTypeEdit"
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
            // disabled={!permission.ManageDelete}
            IconName="Delete"
            id="btnTaskTypeDelete"
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
      title: "Task Type",
      hrefLink: "#",
    },
  ]);
  const MasterPageName = "Task Type";
  const confirmMessage = MasterPageName + " Deleted successfully";

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
        // IsAddButtonVisible={permission?.ManageAdd}
        isSearchRequired={true}
        allowSerialNo={true}
      ></StaticListComponent>
      <AddEditTaskType
        callBackEvent={() => fetchRecords()}
        ref={addEditModalRef}
      ></AddEditTaskType>
    </>
  );
};

export default TaskType;
