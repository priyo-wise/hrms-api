import React, { useState, useEffect, useRef } from "react";
import { WebService } from "../../Services/WebService";
import { useDispatch } from "react-redux";
import StaticListComponent from "../../Services/StaticListComponent";
import "../Static/Static.css";
import ActionButton from "../../Services/ActionButton";
import DeleteConfirmAlert from "../../Services/AlertComponent";
import SnackbarComponent from "../../Services/SnackbarComponent";
import AddEditMenuMaster from "./AddEditMenuMaster";
import "./Static.css";
import { ActionPermission, PageInfo } from "../PageInfo";
import "./Master.css";
import "../Static/Static.css";

const MenuMaster = () => {
  PageInfo({ pageTitle: "Menu" });
  const [permission] = useState({
    ManageAdd: ActionPermission("Menu - Add"),
    ManageEdit: ActionPermission("Menu - Edit"),
    ManageDelete: ActionPermission("Menu - Delete"),
  });

  const ref = useRef();
  const refSnackbar = useRef();
  const dispatch = useDispatch();
  const [records, setRecords] = useState([]);

  const fetchMenuMaster = async () => {
    const data = await WebService({ endPoint: "MenuMaster/Fetch", dispatch });
    setRecords(data.data);
  };

  const onDelete = async (MenuId) => {
    await WebService({
      endPoint: `MenuMaster/Remove/${MenuId}`,
      method: "DELETE",
      dispatch,
    });
    refSnackbar.current.setOpenSnackBar();
    fetchMenuMaster();
  };

  const renderAfterCalled = useRef(false);
  const addEditModalRef = useRef();
  useEffect(() => {
    if (!renderAfterCalled.current) {
      fetchMenuMaster();
    }
    renderAfterCalled.current = true;
  }, []);
  const columns = [
    {
      Text: "Menu Text",
      Value: "MenuText",
    },
    {
      Text: "Parent Menu",
      Value: "ParentMenu",
    },
    {
      Text: "Route",
      Value: "Route",
    },
    {
      Text: "Icon",
      Value: "Icon",
    },
    {
      Searchable: false,
      Text: "ACTION",
      key: "MenuId",
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
            id="btnMenuMasterEdit"
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
            id="btnMenuMasterDelete"
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
      title: "Menu",
      hrefLink: "#",
    },
  ]);
  const MasterPageName = "Menu";
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
      <AddEditMenuMaster
        callBackEvent={() => fetchMenuMaster()}
        ref={addEditModalRef}
      ></AddEditMenuMaster>
    </>
  );
};
export default MenuMaster;
