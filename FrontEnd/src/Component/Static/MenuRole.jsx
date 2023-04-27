import React, { useState, useEffect, useRef } from "react";
import { WebService } from "../../Services/WebService";
import AddEditMenuRole from "./AddEditMenuRole";
import { useDispatch } from "react-redux";
import Container from "react-bootstrap/Container";
import { confirm } from "react-confirm-box";
import "./Static.css";
import TableComponent from "../../Services/TableComponent";
import { ActionPermission, PageInfo } from "../PageInfo";
import SnackbarComponent from "../../Services/SnackbarComponent";
import DeleteConfirmAlert from "../../Services/AlertComponent";
import "../Static/Static.css";
import ActionButton from "../../Services/ActionButton";
import StaticListComponent from "../../Services/StaticListComponent";


const MenuRole = () => {
  const ref = useRef();
  const refSnackbar = useRef();
  PageInfo({ pageTitle: "Menu Role" });
  const dispatch = useDispatch();
  const [records, setRecords] = useState([]);
  const [permission] = useState({
    ManageAdd: ActionPermission("Menu Role - Add"),
    ManageDelete: ActionPermission("Menu Role - Delete"),
  });
  const fetchMenuRole = async () => {
    const data = await WebService({
      endPoint: "MenuRole/Fetch",
      dispatch,
    });

    setRecords(data);
  };

  const onDelete = async (MenuRoleId) => {
    await WebService({
      endPoint: `MenuRole/Remove/${MenuRoleId}`,
      method: "DELETE",
      dispatch,
    });
    refSnackbar.current.setOpenSnackBar();
    await fetchMenuRole();
  };

  const renderAfterCalled = useRef(false);
  const addEditModalRef = useRef();
  useEffect(() => {
    if (!renderAfterCalled.current) {
      fetchMenuRole();
    }
    renderAfterCalled.current = true;
  }, []);

  const columns = [
    {
      Text: "Role Name",
      Value: "RoleName",
    },
    {
      Text: "Menu Text",
      Value: "MenuText",
    },
    {
      Text: "ACTION",
      key: "MenuRoleId",
      cssClass: "text-center td-width-100",
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
            id="btnMenuRoleDelete"
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
      title: "Menu Role",
      hrefLink: "#",
    },
  ]);
  const MasterPageName = "Menu Role";
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
     <AddEditMenuRole
        callBackEvent={() => fetchMenuRole()}
        ref={addEditModalRef}
      ></AddEditMenuRole>
    </>
  );
};
export default MenuRole;
