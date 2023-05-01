import React, { useState, useEffect, useRef } from "react";
import { WebService } from "../../Services/WebService";
import AddEditStaticComponents from "./AddEditStaticComponents";
import { useDispatch } from "react-redux";
import "./Static.css";
import { ActionPermission, PageInfo } from "../PageInfo";
import SnackbarComponent from "../../Services/SnackbarComponent";
import DeleteConfirmAlert from "../../Services/AlertComponent";
import "../Static/Static.css";
import ActionButton from "../../Services/ActionButton";
import StaticListComponent from "../../Services/StaticListComponent";

const StaticComponents = () => {
  const ref = useRef();
  const refSnackbar = useRef();
  PageInfo({ pageTitle: "Static Component" });
  const dispatch = useDispatch();
  const [records, setRecords] = useState([]);
  const [permission] = useState({
    ManageAdd: ActionPermission("Static Component - Add"),
    ManageDelete: ActionPermission("Static Component - Delete"),
    ManageEdit: ActionPermission("Static Component - Edit"),
  });
  const fetchStaticComponents = async () => {
    const data = await WebService({
      endPoint: "StaticComponents/Fetch",
      dispatch,
    });

    setRecords(data);
  };

  const onDelete = async (PageId) => {
    await WebService({
      endPoint: `StaticComponents/Remove/${PageId}`,
      method: "DELETE",
      dispatch,
    });
    refSnackbar.current.setOpenSnackBar();
    await fetchStaticComponents();
  };

  const renderAfterCalled = useRef(false);
  const addEditModalRef = useRef();
  useEffect(() => {
    if (!renderAfterCalled.current) {
      fetchStaticComponents();
    }
    renderAfterCalled.current = true;
  }, []);

  const columns = [
    {
      Text: "Component Name",
      Value: "ComponentName",
    },
    {
      Text: "Description",
      Value: "ComponentDescription",
    },
    {
      Text: "ACTION",
      key: "ComponentId",
      cssClass: "text-center td-width-100",
      isVisiable: permission.ManageDelete,
      Template: (
        <>
          <ActionButton
            onClick={(e) =>
              fnEdit(e.currentTarget.parentElement.getAttribute("data-key"))
            }
            disabled={!permission.ManageEdit}
            IconName="Edit"
            id="btnStaticComponentsEdit"
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
            id="btnStaticComponentsDelete"
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
      title: "Components",
      hrefLink: "#",
    },
  ]);
  const MasterPageName = "Component";
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
      <AddEditStaticComponents
        callBackEvent={() => fetchStaticComponents()}
        ref={addEditModalRef}
      ></AddEditStaticComponents>
    </>
  );
};
export default StaticComponents;
