import React, { useState, useEffect, useRef } from "react";
import { WebService } from "../../Services/WebService";
import AddEditRolePermission from "./AddEditRolePermission";
import { useDispatch } from "react-redux";
import "./Static.css";
import { ActionPermission, PageInfo } from "../PageInfo";
import SnackbarComponent from "../../Services/SnackbarComponent";
import DeleteConfirmAlert from "../../Services/AlertComponent";
import "../Static/Static.css";
import ActionButton from "../../Services/ActionButton";
import StaticListComponent from "../../Services/StaticListComponent";


const RolePermission = () => {
  const ref = useRef();
  const refSnackbar = useRef();
  PageInfo({ pageTitle: "Role Permissions" });
  const dispatch = useDispatch();
  const [records, setRecords] = useState([]);
  const [permission] = useState({
    ManageAdd: ActionPermission("Role Permission - Add"),
    ManageDelete: ActionPermission("Role Permission - Delete"),
  });
  const fetchRolePermission = async () => {
    const data = await WebService({
      endPoint: "RolePermission/Fetch",
      dispatch,
    });

    setRecords(data);
  };

  const onDelete = async (dr) => {
    await WebService({
      endPoint: `RolePermission/${dr.RolePermissionId}`,
      method: "DELETE",
      dispatch,
    });
    refSnackbar.current.setOpenSnackBar();
    await fetchRolePermission();
  };
  const renderAfterCalled = useRef(false);
  const addEditModalRef = useRef();
  useEffect(() => {
    if (!renderAfterCalled.current) {
      fetchRolePermission();
    }
    renderAfterCalled.current = true;
  }, []);
  const columns = [
    {
      Text: "Role Name",
      Value: "RoleName",
    },
    {
      Text: "Permission",
      Value: "Permission",
    },
    {
      Text: "Action",
      cssClass: "text-center td-width-100",
      isVisiable: permission.ManageDelete,
      render: (dr)=>(
        <>
          <ActionButton
            onClick={(e) =>
              ref.current.confirmAlert(
                "Delete", //Confirm button text
                "Are You Sure", // Text if Alert
                "Do you want to delete " + MasterPageName, // Message of Alert
                dr // Endpoint to hit for delete
              )
            }
            disabled={!permission.ManageDelete}
            IconName="Delete"
            id={`btnRolePermissionDelete_${dr.RolePermissionId}`}
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
      title: "Role Permission",
      hrefLink: "#",
    },
  ]);
  const MasterPageName = "Role Permission";
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
    <AddEditRolePermission
        callBackEvent={() => fetchRolePermission()}
        ref={addEditModalRef}
      ></AddEditRolePermission>
    </>
  );
};
export default RolePermission;
