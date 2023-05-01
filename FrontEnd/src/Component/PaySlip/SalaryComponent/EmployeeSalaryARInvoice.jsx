import React, { useEffect, useState, useRef } from "react";
import { WebService } from "../../../Services/WebService";
import { format } from "date-fns";
import "../../Static/Static.css";
import AddEditSalaryARInvoice from "./AddEditSalaryARInvoice";
import { ActionPermission, PageInfo } from "../../PageInfo";
import SnackbarComponent from "../../../Services/SnackbarComponent";
import "../../Static/Static.css";
import ActionButton from "../../../Services/ActionButton";
import StaticListComponent from "../../../Services/StaticListComponent";
import { useDispatch } from "react-redux";

const EmployeeSalaryARInvoiceList = () => {
  const ref = useRef();
  const refSnackbar = useRef();
  PageInfo({ pageTitle: "Salary AR Invoice" });
  const [records, setRecords] = useState([]);
  const dispatch = useDispatch();

//   const [permission] = useState({
//     ManageAdd: ActionPermission("AR Type - Add"),
//     ManageEdit: ActionPermission("AR Type - Edit"),
//     ManageDelete: ActionPermission("AR Type - Delete"),
//   });

  const fetchEmployeeSalaryARInvoiceList = async () => {
    const data = await WebService({ endPoint: "SalaryARInvoice/Fetch",dispatch });
    setRecords(data);
  };
  const renderAfterCalled = useRef(false);
  const addEditModalRef = useRef();
  useEffect(() => {
    if (!renderAfterCalled.current) {
        fetchEmployeeSalaryARInvoiceList();
    }
    renderAfterCalled.current = true;
  }, []);
  const fnEdit = async (id) => await addEditModalRef.current.openModal(id || 0);
  
  const columns = [
    {
      Text: "Employee Name",
      Value: "FullName",
    },
    {
      Text: "AR Type",
      Value: "DisplayDescription",
    },
    {
      Text: " Transaction No",
      Value: "TransactionNo",
    },
    {
      Text: " Transaction Date",
      Value: "TransactionDate",
    },
    {
      Text: "Transaction Mode",
      Value: "TransactionMode",
    },
    {
      Text: "Amount",
      Value: "Amount",
    },
    {
      Text: "ACTION",
      key: "ARInvoiceId",
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
            id="btnARInvoiceIdEdit"
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
      title: "Salary Invoice",
      hrefLink: "#",
    },
  ]);
  const MasterPageName = "Salary Invoice";  
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
      <AddEditSalaryARInvoice
        callBackEvent={() => fetchEmployeeSalaryARInvoiceList()}
        ref={addEditModalRef}
      ></AddEditSalaryARInvoice>
    </>
      );
};

export default EmployeeSalaryARInvoiceList;
