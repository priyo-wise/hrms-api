import React, { useState, useEffect, useRef } from "react";
import { WebService } from "../../Services/WebService";
import AddEditTaxMaster from "./AddEditTaxMaster";
import { useDispatch } from "react-redux";
import Container from "react-bootstrap/Container";
import "./Static.css";
import { confirm } from "react-confirm-box";
import TableComponent from "../../Services/TableComponent";
import { ActionPermission, PageInfo } from "../PageInfo";
import SnackbarComponent from "../../Services/SnackbarComponent";
import DeleteConfirmAlert from "../../Services/AlertComponent";
import "../Static/Static.css";
import ActionButton from "../../Services/ActionButton";
import StaticListComponent from "../../Services/StaticListComponent";

const TaxMaster = () => {
  const ref = useRef();
  const refSnackbar = useRef();

  PageInfo({ pageTitle: "Task Master" });
  const dispatch = useDispatch();
  const [records, setRecords] = useState([]);
  const [permission] = useState({
    ManageAdd: ActionPermission("Tax - Add"),
    ManageEdit: ActionPermission("Tax - Edit"),
    ManageDelete: ActionPermission("Tax - Delete"),
  });
  const fetchTaxMaster = async () => {
    const data = await WebService({ endPoint: "TaxMaster/Fetch", dispatch });
    setRecords(data.data);
  };

  const onDelete = async (TaxId) => {
    await WebService({
      endPoint: `TaxMaster/Remove/${TaxId}`,
      method: "DELETE",
      dispatch,
    });
    refSnackbar.current.setOpenSnackBar();
    await fetchTaxMaster();
  };
  const renderAfterCalled = useRef(false);
  const addEditModalRef = useRef();
  useEffect(() => {
    if (!renderAfterCalled.current) {
      fetchTaxMaster();
    }
    renderAfterCalled.current = true;
  }, []);
  const columns = [
    {
      Text: "PaySlip Text For Tax",
      Value: "PaySlipTextForTax",
    },
    {
      Text: "Tax Description",
      Value: "TaxDescription",
    },
    {
      Text: "Percentage/Fixed",
      Value: "PercentageOrFixed",
    },
    {
      Text: "Number/Amount",
      Value: "NumberOrAmount",
    },
    {
      Text: "Frequency Monthly/Yearly",
      Value: "FrequencyMonthlyYearly",
    },
    {
      Text: "Deduction Type",
      Value: "DeductionType",
    },
    {
      Text: "ACTION",
      key: "TaxId",
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
            id="btnTaxMasterEdit"
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
            id="btnTaxMasterDelete"
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
      title: "Tax Master",
      hrefLink: "#",
    },
  ]);
  const MasterPageName = "Tax Master";
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
      <AddEditTaxMaster
        callBackEvent={() => fetchTaxMaster()}
        ref={addEditModalRef}
      ></AddEditTaxMaster>
    </>
  );
};
export default TaxMaster;
