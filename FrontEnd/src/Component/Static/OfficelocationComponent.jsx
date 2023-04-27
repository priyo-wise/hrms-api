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
      Text: "ACTION",
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
            id="btnErrorEdit"
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
