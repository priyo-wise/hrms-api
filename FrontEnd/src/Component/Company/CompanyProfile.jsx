import React, { useEffect, useState, useRef } from "react";
import { WebService } from "../../Services/WebService";
import { format } from "date-fns";
import "../Company/Company.css";
import AddEditError from "./AddEditCompany";
import { ActionPermission, PageInfo } from "../PageInfo";
import SnackbarComponent from "../../Services/SnackbarComponent";
import "../Company/Company.css";
import ActionButton from "../../Services/ActionButton";
import StaticListComponent from "../../Services/StaticListComponent";
import { useDispatch } from "react-redux";

const CompanyList = () => {
  const ref = useRef();
  const refSnackbar = useRef();
  PageInfo({ pageTitle: "Company Info" });
  const [records, setRecords] = useState([]);
  const dispatch = useDispatch();

  const fetchcompanyList = async () => {
    const data = await WebService({ endPoint: "CompanyProfile/Fetch",dispatch });
    setRecords(data);
  };
  const renderAfterCalled = useRef(false);
  const addEditModalRef = useRef();
  useEffect(() => {
    if (!renderAfterCalled.current) {
      fetchcompanyList();
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
      Text: "Company Type",
      Value: "Type",
    },
    
    {
      Text: "Email",
      Value: "Email",
    },
    {
      Text: "Phone",
      Value: "Phone",
    },
    {
      Text: "ACTION",
      key: "CompanyId",
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
      title: "Company",
      hrefLink: "#",
    },
    {
      title: "Company Info",
      hrefLink: "#",
    },
  ]);
  const MasterPageName = " Company Info";  
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
     // IsAddButtonVisible={permission?.ManageAdd}
      isSearchRequired={true}
      allowSerialNo={true}
    ></StaticListComponent>    
      <AddEditError
        callBackEvent={() => fetchcompanyList()}
        ref={addEditModalRef}
      ></AddEditError>
    </>
      );
};

export default CompanyList;
