import React, { useState, useEffect, useRef } from "react";
import { WebService } from "../../Services/WebService";
import AddEditDocumentType from "./AddEditDocumentType";
import { useDispatch } from "react-redux";
import "./Static.css";
import { confirm } from "react-confirm-box";
import { ActionPermission, PageInfo } from "../PageInfo";
import SnackbarComponent from "../../Services/SnackbarComponent";
import DeleteConfirmAlert from "../../Services/AlertComponent";
import "../Static/Static.css";
import ActionButton from "../../Services/ActionButton";
import StaticListComponent from "../../Services/StaticListComponent";

const DocumentType = () => {
  const ref = useRef();
  const refSnackbar = useRef();
  PageInfo({ pageTitle: "Document" });
  const dispatch = useDispatch();
  const [records, setRecords] = useState([]);
  const [permission] = useState({
    ManageAdd: ActionPermission("Document - Add"),
    ManageEdit: ActionPermission("Document - Edit"),
    ManageDelete: ActionPermission("Document - Delete"),
  });
  const fetchDocumentType = async () => {
    const data = await WebService({ endPoint: "DocumentType/Fetch", dispatch });
    setRecords(data);
  };

  const onDelete = async (DocumentTypeId) => {
    await WebService({
      endPoint: `DocumentType/Remove/${DocumentTypeId}`,
      method: "DELETE",
      dispatch,
    });
    refSnackbar.current.setOpenSnackBar();
    await fetchDocumentType();
  };

  const renderAfterCalled = useRef(false);
  const addEditModalRef = useRef();
  useEffect(() => {
    if (!renderAfterCalled.current) {
      fetchDocumentType();
    }
    renderAfterCalled.current = true;
  }, []);
  const columns = [
    {
      Text: "Document Type",
      Value: "DocumentType",
    },
    {
      Text: "Status",
      Value: "Status",
    },
    {
      Text: "Mandatory",
      Value: "Mandatory",
    },
    {
      Text: "Action",
      key: "DocumentTypeId",
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
            id="btnDocumentTypeEdit"
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
            id="btnDocumentTypeDelete"
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
      title: "Document Type",
      hrefLink: "#",
    },
  ]);
  const MasterPageName = "Document Type";
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
      <AddEditDocumentType
        callBackEvent={() => fetchDocumentType()}
        ref={addEditModalRef}
      ></AddEditDocumentType>
    </>
  );
};
export default DocumentType;
