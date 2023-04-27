import React, { useState, useEffect, useRef } from "react";
import { WebService } from "../../Services/WebService";
import AddEditPermission from "./AddEditPermission";
import { useDispatch } from "react-redux";
import { ActionPermission, PageInfo } from "../PageInfo";
import StaticListComponent from "../../Services/StaticListComponent";
import "../Static/Static.css";
import ActionButton from "../../Services/ActionButton";
import DeleteConfirmAlert from "../../Services/AlertComponent";
import SnackbarComponent from "../../Services/SnackbarComponent";

const Permission = () => {
  const [bData, setBData] = React.useState([
    {
      title: "Master",
      hrefLink: "#",
    },
    {
      title: "Permission",
      hrefLink: "#",
    },
  ]);
  const addEditModalRef = useRef();
  PageInfo({ pageTitle: "Permission" });
  const MasterPageName = "Permission";
  const confirmMessage = MasterPageName + " Deleted successfully";
  const renderAfterCalled = useRef(false);
  const ref = useRef();
  const refSnackbar = useRef();
  const dispatch = useDispatch();
  const [records, setRecords] = useState([]);

  const [permission] = useState({
    ManageAdd: ActionPermission("Permission - Add"),
    ManageEdit: ActionPermission("Permission - Edit"),
    ManageDelete: ActionPermission("Permission - Delete"),
  });
  const columns = [
    {
      Text: "Permission",
      Value: "Permission",
      IsSearch: true,
      cssClass: "text-left",
    },
    {
      Text: "Description",
      Value: "PermissionDescription",
      IsSearch: true,
      cssClass: "text-center",
    },
    {
      Text: "Code",
      Value: "Code",
      IsSearch: true,
      cssClass: "text-center",
    },
    {
      Text: "ACTION",
      key: "PermissionId",
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
            id="btnPermissionEdit"
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
            id="btnPermissionDelete"
          />
        </>
      ),
    },
  ];
  const fetchPermission = async () => {
    const data = await WebService({ endPoint: "Permission/Fetch", dispatch });
    setRecords(data);
  };

  const onDelete = async (PermissionId) => {
    await WebService({
      endPoint: `Permission/Remove/${PermissionId}`,
      method: "DELETE",
      dispatch,
    });
    refSnackbar.current.setOpenSnackBar();
    await fetchPermission();
  };

  useEffect(() => {
    if (!renderAfterCalled.current) {
      fetchPermission();
    }
    renderAfterCalled.current = true;
  }, []);

  const fnEdit = async (id = 0) =>
    await addEditModalRef.current.openModal(id || 0);
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
      <AddEditPermission
        callBackEvent={() => fetchPermission()}
        ref={addEditModalRef}
      ></AddEditPermission>
    </>
  );
};
export default Permission;
