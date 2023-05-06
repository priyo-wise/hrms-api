import React, { useEffect, useState, useRef } from "react";
import { WebService } from "../../Services/WebService";
import { format } from "date-fns";
import "../Static/Static.css";
import AddEditARTypeMaster from "./AddEditARTypeMaster";
import { ActionPermission, PageInfo } from "../PageInfo";
import SnackbarComponent from "../../Services/SnackbarComponent";
import "../Static/Static.css";
import ActionButton from "../../Services/ActionButton";
import StaticListComponent from "../../Services/StaticListComponent";
import { useDispatch } from "react-redux";

const ARTypeMasterList = () => {
  const ref = useRef();
  const refSnackbar = useRef();
  PageInfo({ pageTitle: "AR Type" });
  const [records, setRecords] = useState([]);
  const dispatch = useDispatch();

//   const [permission] = useState({
//     ManageAdd: ActionPermission("AR Type - Add"),
//     ManageEdit: ActionPermission("AR Type - Edit"),
//     ManageDelete: ActionPermission("AR Type - Delete"),
//   });

  const fetchARTypeMasterList = async () => {
    const data = await WebService({ endPoint: "ARTypeMaster/Fetch",dispatch });
    setRecords(data);
  };
  const renderAfterCalled = useRef(false);
  const addEditModalRef = useRef();
  useEffect(() => {
    if (!renderAfterCalled.current) {
        fetchARTypeMasterList();
    }
    renderAfterCalled.current = true;
  }, []);
  const fnEdit = async (id) => await addEditModalRef.current.openModal(id || 0);
  
  const columns = [
    {
      Text: "Code",
      Value: "Code",
    },
    {
      Text: "Salary Component",
      Value: "EarningOrDeductionName",
    },
    {
      Text: "Display Description",
      Value: "DisplayDescription",
    },
    {
      Text: "Action",
      key: "ARTypeId",
      cssClass: "text-center td-width-100",
     // isVisiable: permission.ManageEdit,
      Template: (
        <>
          <ActionButton
            onClick={(e) =>
              fnEdit(e.currentTarget.parentElement.getAttribute("data-key"))
            }
           // disabled={!permission.ManageEdit}
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
      title: "AR Type",
      hrefLink: "#",
    },
  ]);
  const MasterPageName = "AR Type";  
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
      //IsAddButtonVisible={permission?.ManageAdd}
      isSearchRequired={true}
      allowSerialNo={true}
    ></StaticListComponent>    
      <AddEditARTypeMaster
        callBackEvent={() => fetchARTypeMasterList()}
        ref={addEditModalRef}
      ></AddEditARTypeMaster>
    </>
      );
};

export default ARTypeMasterList;
