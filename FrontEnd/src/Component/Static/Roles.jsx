import React, { useState, useEffect, useRef } from "react";
import { WebService } from "../../Services/WebService";
import AddEditRoles from "./AddEditRoles";
import { useDispatch } from "react-redux";
import "./Static.css";
import { ActionPermission, PageInfo } from "../PageInfo";
import SnackbarComponent from "../../Services/SnackbarComponent";
import DeleteConfirmAlert from "../../Services/AlertComponent";
import "../Static/Static.css";
import ActionButton from "../../Services/ActionButton";
import StaticListComponent from "../../Services/StaticListComponent";
import { sortBy } from "underscore";

const Roles = () => {
  const ref = useRef();
  const refSnackbar = useRef();
  const [appData, setAppData] = React.useState({
    searchPlaceHolder: "Search Role",
    addMenuTitle: "Add Role",
  });
  PageInfo({ pageTitle: "Roles" });
  const dispatch = useDispatch();
  const [records, setRecords] = useState([]);
  const [permission] = useState({
    ManageAdd: ActionPermission("Roles - Add"),
    ManageEdit: ActionPermission("Roles - Edit"),
    ManageDelete: ActionPermission("Roles - Delete"),
  });
  const fetchRole = async () => {
    const data = await WebService({
      endPoint: "CommonUtility/staticroles",
      dispatch,
    });
    setRecords(sortBy(data,s=>s.RoleName));
  };
  const onDelete = async (RoleId) => {
    await WebService({
      endPoint: `CommonUtility/staticroles?RoleId=${RoleId}`,
      method: "DELETE",
      dispatch,
    });
    refSnackbar.current.setOpenSnackBar();
    await fetchRole();
  };
  const renderAfterCalled = useRef(false);
  const addEditModalRef = useRef();
  useEffect(() => {
    if (!renderAfterCalled.current) {
      fetchRole();
    }
    renderAfterCalled.current = true;
  }, []);
  const columns = [
    {
      Text: "Role Name",
      Value: "RoleName",
    },
    {
      Text: "Action",
      cssClass: "text-center td-width-100",
      isVisiable: permission.ManageEdit || permission.ManageDelete,
      render: (dr) => (
        <>
          {dr.IsReserved != 1 && (
            <>
              <ActionButton
                onClick={() => fnEdit(dr.RoleId)}
                disabled={!permission.ManageEdit}
                IconName="Edit"
                id="btnRoleEdit"
              />

              <ActionButton
                onClick={(e) =>
                  ref.current.confirmAlert(
                    "Delete", //Confirm button text
                    "Are You Sure", // Text if Alert
                    "Do you want to delete " + MasterPageName, // Message of Alert
                    dr.RoleId // Endpoint to hit for delete
                  )
                }
                disabled={!permission.ManageDelete}
                IconName="Delete"
                id="btnRoleDelete"
              />
            </>
          )}
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
      title: "Roles",
      hrefLink: "#",
    },
  ]);
  const MasterPageName = "Role";
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
      <AddEditRoles
        callBackEvent={() => fetchRole()}
        ref={addEditModalRef}
      ></AddEditRoles>
    </>
  );
};
export default Roles;
