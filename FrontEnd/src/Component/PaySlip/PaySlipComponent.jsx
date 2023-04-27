import React, { useEffect, memo, useState, useRef } from "react";
import { WebService } from "../../Services/WebService";
import AddEditPayslip from "./AddEditPayslip";
import { ActionPermission, PageInfo } from "../PageInfo";
import { useDispatch } from "react-redux";
import ViewPaySlip from "./ViewPaySlip";
import "../Static/Static.css";
import ActionButton from "../../Services/ActionButton";
import StaticListComponent from "../../Services/StaticListComponent";
import DeleteConfirmAlert from "../../Services/AlertComponent";

const PayslipComponent = () => {
  const MasterPageName = "Salary Payslip";
  const confirmMessage = MasterPageName + " Deleted successfully";
  const dispatch = useDispatch();
  PageInfo({ pageTitle: "Payslip" });
  const [records, setRecords] = useState([]);
  const [permission] = useState({
    ManageAdd: ActionPermission("PaySlip - Add"),
    ManageDelete: ActionPermission("PaySlip - Delete"),
    ManageEdit: ActionPermission("PaySlip - Edit"),
    ManagePublish: ActionPermission("PaySlip - Publish"),
    ManageSearchAllUser: ActionPermission("PaySlip - Search AllUser"),
  });
  const ref = useRef();
  const refSnackbar = useRef();
  const fetchPayslipList = async () => {
    var onlyPublishData = permission.ManageSearchAllUser ? "N" : "Y";
    var allUserData = permission.ManageSearchAllUser ? "Y" : "N";
    var endPoint = `Payslip/Fetch?AllUser=${allUserData}&OnlyPublish=${onlyPublishData}`;
    const data = await WebService({ endPoint, dispatch });
    setRecords(data);
  };
  const renderAfterCalled = useRef(false);
  const addEditModalRef = useRef();
  const viewModalRef = useRef();
  const onDelete = async (PermissionId) => {
    await WebService({
      endPoint: `Payslip/${PermissionId}`,
      method: "DELETE",
      dispatch,
    });
    refSnackbar.current.setOpenSnackBar();
    await fetchPayslipList();
  };
  useEffect(() => {
    if (!renderAfterCalled.current) {
      fetchPayslipList();
    }
    renderAfterCalled.current = true;
  }, []);
  const fnEdit = async (id) => await addEditModalRef.current.openModal(id || 0);
  const fnView = async (id) => await viewModalRef.current.openModal(id || 0);
  const [bData, _] = React.useState([
    {
      title: "Salary",
      hrefLink: "#",
    },
    {
      title: "Salary Payslip",
      hrefLink: "#",
    },
  ]);
  const fnPublish = async (id) => {
    await WebService({
      dispatch,
      endPoint: `Payslip/${id}`,
      method: "PUT",
      body: { StatusId: 7 },
    });
    await fetchPayslipList();
  };

  const columns = [
    {
      Text: "Name",
      Value: "FullName",
      IsSearch: true,
      cssClass: "text-center",
    },
    {
      Text: "Working Days",
      Value: "TotalWorkingDays",
      IsSearch: true,
      cssClass: "text-center",
      //Searchable:false
    },
    {
      Text: "Gross Salary",
      Value: "GrossSalary",
      IsSearch: true,
      cssClass: "text-center",
    },
    {
      Text: "Deduction",
      Value: "TotalDeductions",
      IsSearch: true,
      cssClass: "text-center",
    },
    {
      Text: "Net Salary",
      Value: "NetSalary",
      IsSearch: true,
      cssClass: "text-center",
    },
    {
      Text: "ACTION",
      cssClass: "text-center td-width-100",
      render: (dr) => (
        <>
          <ActionButton onClick={() => fnView(dr.PayslipId)} IconName="View" id={`btn_view_${dr.PayslipId}`} />
          {dr.StatusId != 7 && permission.ManageEdit && (
            <ActionButton
              onClick={() => fnEdit(dr.PayslipId)}
              disabled={false}
              IconName="Edit"
              id={`btn_edit_${dr.PayslipId}`}
            />
          )}
          {dr.StatusId != 7 && permission.ManageDelete && (
            <ActionButton
              onClick={(e) =>
                ref.current.confirmAlert(
                  "Delete", //Confirm button text
                  "Are You Sure", // Text if Alert
                  "Do you want to delete " + MasterPageName, // Message of Alert
                  dr.PayslipId // Endpoint to hit for delete
                )
              }
              IconName="Delete"
              id={`btn_delete_${dr.PayslipId}`}
            />
          )}
          {dr.StatusId != 7 && permission.ManagePublish && (
            <ActionButton
              onClick={(e) => fnPublish(dr.PayslipId)}
              IconName="Publish"
              id={`btn_publish_${dr.PayslipId}`}
            />
          )}
        </>
      ),
    },
  ];
  return (
    <>
      <DeleteConfirmAlert ref={ref} confirmEvent={(v) => onDelete(v)} />
      <StaticListComponent
        columns={columns}
        records={records}
        bData={bData}
        MasterPageName={MasterPageName}
        onAddEvent={() => fnEdit()}
        isSearchRequired={true}
        allowSerialNo={true}
        IsAddButtonVisible={permission.ManageAdd}
      ></StaticListComponent>

      <AddEditPayslip
        callBackEvent={() => fetchPayslipList()}
        ref={addEditModalRef}
      ></AddEditPayslip>
      <ViewPaySlip ref={viewModalRef} />
    </>
  );
};

export default memo(PayslipComponent);
