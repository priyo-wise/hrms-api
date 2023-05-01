import React, { useState, useEffect, useRef } from "react";
import { WebService } from "../../Services/WebService";
import AddEditKRA from "./AddEditKRA";
import { useDispatch } from "react-redux";
import "./Static.css";
import { ActionPermission, PageInfo } from "../PageInfo";
import SnackbarComponent from "../../Services/SnackbarComponent";
import DeleteConfirmAlert from "../../Services/AlertComponent";
import "../Static/Static.css";
import ActionButton from "../../Services/ActionButton";
import StaticListComponent from "../../Services/StaticListComponent";

const apiUrl="CommonUtility/staticKRA";
const KeyRating = () => {
  const ref = useRef();
  const refSnackbar = useRef();
  PageInfo({ pageTitle: "Key Rating" });
  const dispatch = useDispatch();
  const [records, setRecords] = useState([]);
  const [permission] = useState({
    ManageAdd: ActionPermission("Key Rating - Add"),
    ManageEdit: ActionPermission("Key Rating - Edit"),
    ManageDelete: ActionPermission("Key Rating - Delete"),
  });
  const fetchKeyRating = async () => {
    const data = await WebService({ endPoint: apiUrl, dispatch });
    setRecords(data);
  };

  const onDelete = async (KRAId) => {
    await WebService({
      endPoint: `${apiUrl}?KRAId=${KRAId}`,
      method: "DELETE",
      dispatch,
    });
    refSnackbar.current.setOpenSnackBar();
    await fetchKeyRating();
  };

  const renderAfterCalled = useRef(false);
  const addEditModalRef = useRef();
  useEffect(() => {
    if (!renderAfterCalled.current) {
      fetchKeyRating();
    }
    renderAfterCalled.current = true;
  }, []);
  const columns = [
    {
      Text: "Short Description",
      Value: "KRAShortDescription",
      cssClass: "text-left td-width-1",
    },
    {
      Text: "Description",
      Value: "KRADescription",
      cssClass: "text-left td-width-4",
    },
    {
      Text: "ACTION",
      key: "KRAId",
      cssClass: "text-center td-width-80",
      isVisiable: permission.ManageEdit || permission.ManageDelete,
      Template: (
        <>
          <ActionButton
            onClick={(e) =>
              fnEdit(e.currentTarget.parentElement.getAttribute("data-key"))
            }
            disabled={!permission.ManageEdit}
            IconName="Edit"
            id="btnKRAEdit"
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
            id="btnKRADelete"
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
      title: "Key Rating",
      hrefLink: "#",
    },
  ]);
  const MasterPageName = "Key Rating";
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
      <AddEditKRA
        callBackEvent={() => fetchKeyRating()}
        ref={addEditModalRef}
      ></AddEditKRA>
    </>
  );
};
export default KeyRating;
