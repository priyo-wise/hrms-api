import React, { useState, useEffect, useRef } from "react";
import { WebService } from "../../Services/WebService";
import AddEditTask from "./AddEditTaskCategory";
import { useDispatch } from "react-redux";
import "./Static.css";
import { ActionPermission, PageInfo } from "../PageInfo";
import SnackbarComponent from "../../Services/SnackbarComponent";
import DeleteConfirmAlert from "../../Services/AlertComponent";
import "../Static/Static.css";
import ActionButton from "../../Services/ActionButton";
import StaticListComponent from "../../Services/StaticListComponent";


const Task = () => {
  const ref = useRef();
  const refSnackbar = useRef();
  PageInfo({ pageTitle: "Task Category" });
  const dispatch = useDispatch();
  const [records, setRecords] = useState([]);
  const fetchTask = async () => {
    const data = await WebService({ endPoint: "CommonUtility/taskcategorymaster?select=TaskCategoryId,TaskCategoryName,tasktype.DisplayDescription&expand=tasktype", dispatch });
    setRecords(data);
  };
  
  const onDelete = async (TaskCategoryId) => {
    await WebService({
      endPoint: `CommonUtility/taskcategorymaster?TaskCategoryId=${TaskCategoryId}`,
      method: "DELETE",
      dispatch,
    });
    refSnackbar.current.setOpenSnackBar();
    await fetchTask();
  };
  const renderAfterCalled = useRef(false);
  const addEditModalRef = useRef();
  useEffect(() => {
    if (!renderAfterCalled.current) {
      fetchTask();
    }
    renderAfterCalled.current = true;
  }, []);
  const columns = [
    {
      Text: "Type",
      Value: "DisplayDescription",
    },
    {
      Text: "Task Category Name",
      Value: "TaskCategoryName",
    },
    {
      Text: "ACTION",
      key: "TaskCategoryId",
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
            id="btnTaskEdit"
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
            id="btnTaskDelete"
          />
        </>
      ),
    },
  ];
  const fnEdit = async (id) => await addEditModalRef.current.openModal(id || 0);
  const [bData, setBData] = React.useState([
    {
      title: "Master",
      hrefLink: "#",
    },
    {
      title: "Task Category",
      hrefLink: "#",
    },
  ]);
  const MasterPageName = "Task Category";
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
      <AddEditTask
        callBackEvent={() => fetchTask()}
        ref={addEditModalRef}
      ></AddEditTask>
    </>
  );
};
export default Task;
