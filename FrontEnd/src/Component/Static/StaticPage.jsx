import React, { useState, useEffect, useRef } from "react";
import { WebService } from "../../Services/WebService";
import AddEditStaticPage from "./AddEditStaticPage";
import { useDispatch } from "react-redux";
import "./Static.css";
import { ActionPermission, PageInfo } from "../PageInfo";
import SnackbarComponent from "../../Services/SnackbarComponent";
import DeleteConfirmAlert from "../../Services/AlertComponent";
import "../Static/Static.css";
import ActionButton from "../../Services/ActionButton";
import StaticListComponent from "../../Services/StaticListComponent";

const StaticPage = () => {
  const ref = useRef();
  const refSnackbar = useRef();
  PageInfo({ pageTitle: "Static Page" });
  const dispatch = useDispatch();
  const [records, setRecords] = useState([]);
  const [permission] = useState({
    ManageAdd: ActionPermission("Static Page - Add"),
    ManageDelete: ActionPermission("Static Page - Delete"),
    ManageEdit: ActionPermission("Static Page - Edit"),
  });
  const fetchStaticPage = async () => {
    const data = await WebService({
      endPoint: "StaticPage/Fetch",
      dispatch,
    });

    setRecords(data);
  };

  const onDelete = async (PageId) => {
    await WebService({
      endPoint: `StaticPage/Remove/${PageId}`,
      method: "DELETE",
      dispatch,
    });
    refSnackbar.current.setOpenSnackBar();
    await fetchStaticPage();
  };

  const renderAfterCalled = useRef(false);
  const addEditModalRef = useRef();
  useEffect(() => {
    if (!renderAfterCalled.current) {
      fetchStaticPage();
    }
    renderAfterCalled.current = true;
  }, []);

  const columns = [
    {
      Text: "Page Name",
      Value: "PageName",
    },
    {
      Text: "Menu Text",
      Value: "MenuText",
    },
    {
      Text: "ACTION",
      key: "PageId",
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
            id="btnStaticPageEdit"
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
            id="btnStaticPageDelete"
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
      title: "Page",
      hrefLink: "#",
    },
  ]);
  const MasterPageName = "Page";
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
      <AddEditStaticPage
        callBackEvent={() => fetchStaticPage()}
        ref={addEditModalRef}
      ></AddEditStaticPage>
    </>
  );
};
export default StaticPage;
