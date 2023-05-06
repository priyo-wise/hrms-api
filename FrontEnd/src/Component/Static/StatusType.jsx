import React, { useState, useEffect, useRef } from "react";
import { WebService } from "../../Services/WebService";
import AddEditStatusType from "./AddEditStatusType";
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

const StatusType = () => {
  const ref = useRef();
  const refSnackbar = useRef();
  PageInfo({ pageTitle: "Status" });
  const dispatch = useDispatch();
  const [records, setRecords] = useState([]);
  const [permission] = useState({
    ManageAdd: ActionPermission("Status - Add"),
    ManageEdit: ActionPermission("Status - Edit"),
    ManageDelete: ActionPermission("Status - Delete"),
  });
  const fetchStatus = async () => {
    const data = await WebService({ endPoint: "StatusType/fetch", dispatch });
    setRecords(data);
  };

  const onDelete = async (StatusId) => {
    await WebService({
      endPoint: `StatusType/Remove/${StatusId}`,
      method: "DELETE",
      dispatch,
    });
    refSnackbar.current.setOpenSnackBar();
    await fetchStatus();
  };
  const renderAfterCalled = useRef(false);
  const addEditModalRef = useRef();
  useEffect(() => {
    if (!renderAfterCalled.current) {
      fetchStatus();
    }
    renderAfterCalled.current = true;
  }, []);
  const columns = [
    {
      Text: "Status",
      Value: "Status",
    },
    {
      Text: "Status Meaning",
      Value: "StatusMeaning",
    },
    {
      Text: "Action",
      key: "StatusId",
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
            id="btnStatusTypeEdit"
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
            id="btnStatusTypeDelete"
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
      title: "Status",
      hrefLink: "#",
    },
  ]);
  const MasterPageName = "Status";
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
      <AddEditStatusType
        callBackEvent={() => fetchStatus()}
        ref={addEditModalRef}
      ></AddEditStatusType>
    </>
  );
};
export default StatusType;
