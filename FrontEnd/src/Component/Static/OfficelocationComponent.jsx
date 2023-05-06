import React, { useEffect, useState, useRef } from "react";
import { WebService } from "../../Services/WebService";
import { format } from "date-fns";
import "../Static/Static.css";
import AddEditOfficelocation from "./AddEditOfficelocation";
import { ActionPermission, PageInfo } from "../PageInfo";
import SnackbarComponent from "../../Services/SnackbarComponent";
import "../Static/Static.css";
import ActionButton from "../../Services/ActionButton";
import StaticListComponent from "../../Services/StaticListComponent";
import { useDispatch } from "react-redux";
import DeleteConfirmAlert from "../../Services/AlertComponent";

const AllErrorList = () => {
  const ref = useRef();
  const refSnackbar = useRef();
  PageInfo({ pageTitle: "Office location" });
  const [records, setRecords] = useState([]);
  const dispatch = useDispatch();

  const [permission] = useState({
    ManageAdd: ActionPermission("Office Location - Add"),
    ManageEdit: ActionPermission("Office Location - Edit"),
    ManageDelete: ActionPermission("Office Location - Delete"),
  });

  const fetchOfficelocationList = async () => {
    const data = await WebService({ endPoint: "Officelocation/Fetch",dispatch });
    setRecords(data);
  };
  const renderAfterCalled = useRef(false);
  const addEditModalRef = useRef();
  useEffect(() => {
    if (!renderAfterCalled.current) {
      fetchOfficelocationList();
    }
    renderAfterCalled.current = true;
  }, []);
  const fnEdit = async (id) => await addEditModalRef.current.openModal(id || 0);
  const onDelete = async (OfficeLocationId) => {
    await WebService({
      endPoint: `CommonUtility/officelocation?OfficeLocationId=${OfficeLocationId}`,
      method: "DELETE",
      dispatch,
    });
    refSnackbar.current.setOpenSnackBar();
    await fetchOfficelocationList();
  };
  
  const columns = [
    {
      Text: "Company Name",
      Value: "CompanyName",
    },
    {
      Text: "Location",
      Value: "Location",
    },
    {
      Text: "Address",
      Value: "Address",
    },
    {
      Text: "Action",
      key: "OfficeLocationId",
      cssClass: "text-center td-width-100",
      isVisiable: permission.ManageEdit,
      Template: (
        <>
          <ActionButton
            onClick={(e) =>
              fnEdit(e.currentTarget.parentElement.getAttribute("data-key"))
            }
            disabled={!permission.ManageEdit}
            IconName="Edit"
            id="btnOfficelocationEdit"
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
            id="btnOfficelocationDelete"
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
      title: "Office Location",
      hrefLink: "#",
    },
  ]);
  const MasterPageName = "Office Location";  
  const confirmMessage = MasterPageName + " Deleted successfully";
  
  return (
    <>
    <SnackbarComponent ref={refSnackbar} confirmMessage={confirmMessage} />;
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
      <AddEditOfficelocation
        callBackEvent={() => fetchOfficelocationList()}
        ref={addEditModalRef}
      ></AddEditOfficelocation>
    </>
      );
};

export default AllErrorList;
