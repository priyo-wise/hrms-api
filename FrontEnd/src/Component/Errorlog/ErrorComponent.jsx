import React, { useEffect, useState, useRef } from "react";
import { WebService } from "../../Services/WebService";
import { format } from "date-fns";
import "../Static/Static.css";
import AddEditError from "./AddEditError";
import { ActionPermission, PageInfo } from "../PageInfo";
import SnackbarComponent from "../../Services/SnackbarComponent";
import "../Static/Static.css";
import ActionButton from "../../Services/ActionButton";
import StaticListComponent from "../../Services/StaticListComponent";
import { useDispatch } from "react-redux";

const AllErrorList = () => {
  const ref = useRef();
  const refSnackbar = useRef();
  PageInfo({ pageTitle: "Error log" });
  const [records, setRecords] = useState([]);
  const dispatch = useDispatch();

  const fetchErrorList = async () => {
    const data = await WebService({ endPoint: "Errorlog/Fetch",dispatch });
    setRecords(data);
  };
  const renderAfterCalled = useRef(false);
  const addEditModalRef = useRef();
  useEffect(() => {
    if (!renderAfterCalled.current) {
        fetchErrorList();
    }
    renderAfterCalled.current = true;
  }, []);
  const fnEdit = async (id) => await addEditModalRef.current.openModal(id || 0);
  
  const columns = [
    {
      Text: "Error Number",
      Value: "ErrorNumber",
    },
    {
      Text: "Error Code",
      Value: "ErrorCode",
    },
    {
      Text: "Error Description",
      Value: "ErrorDescription",
    },
    {
      Text: "ACTION",
      key: "ErrorId",
      cssClass: "text-center td-width-100",
     // isVisiable: permission.ManageEdit,
      Template: (
        <>
          <ActionButton
            onClick={(e) =>
              fnEdit(e.currentTarget.parentElement.getAttribute("data-key"))
            }
            //disabled={!permission.ManageEdit}
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
      title: "Error Log",
      hrefLink: "#",
    },
  ]);
  const MasterPageName = "Error Log";  
  const confirmMessage = MasterPageName + " Deleted successfully";
  
  return (
    <>
    <SnackbarComponent ref={refSnackbar} confirmMessage={confirmMessage} />
    <StaticListComponent
      columns={columns}
      records={records}
      bData={bData}
      MasterPageName={MasterPageName}
      onAddEvent={() => fnEdit()}
     // IsAddButtonVisible={permission?.ManageAdd}
      isSearchRequired={true}
      allowSerialNo={true}
    ></StaticListComponent>    
      <AddEditError
        callBackEvent={() => fetchErrorList()}
        ref={addEditModalRef}
      ></AddEditError>
    </>
      );
};

export default AllErrorList;
