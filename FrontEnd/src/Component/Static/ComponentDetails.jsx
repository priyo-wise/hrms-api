import React, { useState, useEffect, useRef } from "react";
import { WebService } from "../../Services/WebService";
import AddEditComponentDetails from "./AddEditComponentDetails";
import { useDispatch } from "react-redux";
import "./Static.css";
import { ActionPermission, PageInfo } from "../PageInfo";
import SnackbarComponent from "../../Services/SnackbarComponent";
import DeleteConfirmAlert from "../../Services/AlertComponent";
import "../Static/Static.css";
import ActionButton from "../../Services/ActionButton";
import StaticListComponent from "../../Services/StaticListComponent";

const ComponentDetails = () => {
  const ref = useRef();
  const refSnackbar = useRef();
  PageInfo({ pageTitle: "Component Details" });
  const dispatch = useDispatch();
  const [records, setRecords] = useState([]);
  const [permission] = useState({
    ManageAdd: ActionPermission("Component Details - Add"),
    ManageDelete: ActionPermission("Component Details - Delete"),
    ManageEdit: ActionPermission("Component Details - Edit"),
  });
  const fetchComponentDetails = async () => {
    const data = await WebService({
      endPoint: "ComponentDetails/Fetch",
      dispatch,
    });

    setRecords(data);
  };

  const onDelete = async (ComponentDetailsId) => {
    await WebService({
      endPoint: `ComponentDetails/Remove/${ComponentDetailsId}`,
      method: "DELETE",
      dispatch,
    });
    refSnackbar.current.setOpenSnackBar();
    await fetchComponentDetails();
  };

  const renderAfterCalled = useRef(false);
  const addEditModalRef = useRef();
  useEffect(() => {
    if (!renderAfterCalled.current) {
      fetchComponentDetails();
    }
    renderAfterCalled.current = true;
  }, []);

  const columns = [
    {
      Text: "Component Details",
      Value: "ComponentDetails",
    },
    {
      Text: "Page Name",
      Value: "PageName",
    },
    {
      Text: "Component Name",
      Value: "ComponentName",
    },
    {
      Text: "Component Class",
      Value: "ComponentClass",
    },
    {
      Text: "Sequence",
      Value: "Sequence",
    },
    {
      Text: "Action",
      key: "ComponentDetailsId",
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
            id="btnComponentDetailsEdit"
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
            id="btnComponentDetailsDelete"
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
      title: "Component Details",
      hrefLink: "#",
    },
  ]);
  const MasterPageName = "Component Details";
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
      <AddEditComponentDetails
        callBackEvent={() => fetchComponentDetails()}
        ref={addEditModalRef}
      ></AddEditComponentDetails>
    </>
  );
};
export default ComponentDetails;
