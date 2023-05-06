import React, { useState, useEffect, useRef } from "react";
import { WebService } from "../../Services/WebService";
import { useDispatch } from "react-redux";
import StaticListComponent from "../../Services/StaticListComponent";
import "../Static/Static.css";
import ActionButton from "../../Services/ActionButton";
import DeleteConfirmAlert from "../../Services/AlertComponent";
import SnackbarComponent from "../../Services/SnackbarComponent";
import AddEditBankDetails from "./AddEditBankDetails";
import "./Static.css";
import { ActionPermission, PageInfo } from "../PageInfo";
import "./Master.css";
import "../Static/Static.css";

const BankDetails = () => {
  PageInfo({ pageTitle: "Bank Details" });
  //   const [permission] = useState({
  //     ManageAdd: ActionPermission("Menu - Add"),
  //     ManageEdit: ActionPermission("Menu - Edit"),
  //     ManageDelete: ActionPermission("Menu - Delete"),
  //   });

  const ref = useRef();
  const refSnackbar = useRef();
  const dispatch = useDispatch();
  const [records, setRecords] = useState([]);

  const fetchBankDetails = async () => {
    const data = await WebService({
      endPoint: "FinanceTemplate/Fetch",
      dispatch,
    });
    setRecords(data);
  };

  const onDelete = async (FinanceId) => {
    await WebService({
      endPoint: `FinanceTemplate/Remove/${FinanceId}`,
      method: "DELETE",
      dispatch,
    });
    refSnackbar.current.setOpenSnackBar();
    fetchBankDetails();
  };

  const renderAfterCalled = useRef(false);
  const addEditModalRef = useRef();
  useEffect(() => {
    if (!renderAfterCalled.current) {
      fetchBankDetails();
    }
    renderAfterCalled.current = true;
  }, []);
  const columns = [
    {
      Text: "Bank Name",
      Value: "BankName",
    },
    {
      Text: "Bank Account Number",
      Value: "BankAccountNo",
    },
    {
      Text: "Name In Account",
      Value: "NameInAccount",
    },
    {
      Text: "IFSC Code",
      Value: "IFSCCode",
    },
    {
      Text: "PF Account Number",
      Value: "PFAccountNo",
    },
    {
      Text: "PF UAN Number",
      Value: "PFUANNo",
    },
    {
      Searchable: false,
      Text: "Action",
      key: "FinanceId",
      cssClass: "text-center td-width-100",
      //isVisiable: permission.ManageEdit || permission.ManageDelete,
      Template: (
        <>
          <ActionButton
            onClick={(e) =>
              fnEdit(e.currentTarget.parentElement.getAttribute("data-key"))
            }
            //disabled={!permission.ManageEdit}
            IconName="Edit"
            id="btnBankDetailsEdit"
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
            //disabled={!permission.ManageDelete}
            IconName="Delete"
            id="btnBankDetailsDelete"
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
      title: "Bank Details",
      hrefLink: "#",
    },
  ]);
  const MasterPageName = "Bank Details";
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
        //IsAddButtonVisible={permission?.ManageAdd}
        isSearchRequired={true}
        allowSerialNo={true}
      ></StaticListComponent>
      <AddEditBankDetails
        callBackEvent={() => fetchBankDetails()}
        ref={addEditModalRef}
      ></AddEditBankDetails>
    </>
  );
};
export default BankDetails;
