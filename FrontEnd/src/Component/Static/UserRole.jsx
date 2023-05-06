import React, { useState, useEffect, useRef } from "react";
import { WebService } from "../../Services/WebService";
import AddEditUserRole from "./AddEditUserRole";
import { useDispatch } from "react-redux";
import Container from "react-bootstrap/Container";
import { confirm } from "react-confirm-box";
import "./Static.css";
import TableComponent from "../../Services/TableComponent";
import { ActionPermission, PageInfo } from "../PageInfo";
import StaticListComponent from "../../Services/StaticListComponent";
import "../Static/Static.css";
import ActionButton from "../../Services/ActionButton";
import DeleteConfirmAlert from "../../Services/AlertComponent";
import SnackbarComponent from "../../Services/SnackbarComponent";

const apiUrl="CommonUtility/userroles";
const UserRole = () => {
  const ref = useRef();
  const refSnackbar = useRef();
  PageInfo({ pageTitle: "User Role" });
  const dispatch = useDispatch();
  const [records, setRecords] = useState([]);
  const [permission] = useState({
    ManageAdd: ActionPermission("User Role - Add"),
    ManageDelete: ActionPermission("User Role - Delete"),
  });
  const fetchUserRole = async () => {
    const data = await WebService({ 
      endPoint: `${apiUrl}?expand=employees,staticroles&select=UserRoleId,staticroles.RoleId,employees.EmployeeId,employees.FullName,staticroles.RoleName`, 
      dispatch });
    setRecords(data);
  };
  const onDelete = async (UserRoleId) => {
    await WebService({
      endPoint: `${apiUrl}?UserRoleId=${UserRoleId}`,
      method: "DELETE",
      dispatch,
    });
    refSnackbar.current.setOpenSnackBar();
    await fetchUserRole();
  };
  const renderAfterCalled = useRef(false);
  const addEditModalRef = useRef();
  useEffect(() => {
    if (!renderAfterCalled.current) {
      fetchUserRole();
    }
    renderAfterCalled.current = true;
  }, []);
  const columns = [
    {
      Text: "Role Name",
      Value: "RoleName",
    },
    {
      Text: "Full Name",
      Value: "FullName",
    },
    {
      Text: "Action",
      key: "UserRoleId",
      style:{width:"60px",textAlign:"center", padding:"0px"},
      isVisiable: permission.ManageDelete,
      Template: (
        <>
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
            id="btnUserRoleDelete"
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
      title: "User Role",
      hrefLink: "#",
    },
  ]);
  const MasterPageName = "User Role";
  const confirmMessage = MasterPageName + " Deleted successfully";

  //const fnEdit = async (id) => await addEditModalRef.current.openModal(id || 0);

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
      <AddEditUserRole
        callBackEvent={() => fetchUserRole()}
        ref={addEditModalRef}
      ></AddEditUserRole>
    </>
  );
};
export default UserRole;
