import React, { useState, useEffect, useRef } from "react";
import { WebService } from "../../Services/WebService";
import AddEditHolidayMaster from "./AddEditHolidayMaster";
import { useDispatch } from "react-redux";
import "./Static.css";
import { ActionPermission, PageInfo } from "../PageInfo";
import SnackbarComponent from "../../Services/SnackbarComponent";
import DeleteConfirmAlert from "../../Services/AlertComponent";
import "../Static/Static.css";
import ActionButton from "../../Services/ActionButton";
import StaticListComponent from "../../Services/StaticListComponent";

const apiUrl="CommonUtility/holidaymaster";
const HolidayMaster = () => {
  const ref = useRef();
  const refSnackbar = useRef();
  PageInfo({ pageTitle: "Holiday" });
  const dispatch = useDispatch();
  const [records, setRecords] = useState([]);
  const [permission] = useState({
    ManageAdd: ActionPermission("Holiday - Add"),
    ManageEdit: ActionPermission("Holiday - Edit"),
    ManageDelete: ActionPermission("Holiday - Delete"),
  });
  const fetchHolidayMaster = async () => {
    const data = await WebService({
      endPoint: apiUrl,
      dispatch,
    });
    setRecords(data);
  };

  const onDelete = async (HolidayId) => {
    await WebService({
      endPoint: `${apiUrl}?HolidayId=${HolidayId}`,
      method: "DELETE",
      dispatch,
    });
    refSnackbar.current.setOpenSnackBar();
    await fetchHolidayMaster();
  };
  const renderAfterCalled = useRef(false);
  const addEditModalRef = useRef();
  useEffect(() => {
    if (!renderAfterCalled.current) {
      fetchHolidayMaster();
    }
    renderAfterCalled.current = true;
  }, []);
  const columns = [
    {
      Text: "Date",
      DateFormat: "yyyy-MM-dd",
      Value: "HolidayDate",
    },
    {
      Text: "Day",
      Value: "HolidayWeekDay",
    },
    {
      Text: "Name",
      Value: "HolidayName",
    },
    {
      Text: "HolidaySaka",
      Value: "HolidaySaka",
    },
    {
      Text: "Holiday Comments",
      Value: "HolidayComments",
    },
    {
      Text: "Action",
      cssClass: "text-center td-width-100",
      isVisiable: permission.ManageEdit || permission.ManageDelete,
      render: (dr)=>(
        <>
          <ActionButton
            onClick={() =>
              fnEdit(dr.HolidayId)
            }
            disabled={!permission.ManageEdit}
            IconName="Edit"
            id={`btnHolidayEdit_${dr.HolidayId}`}
          />
          <ActionButton
            onClick={(e) =>
              ref.current.confirmAlert(
                "Delete", //Confirm button text
                "Are You Sure", // Text if Alert
                "Do you want to delete " + MasterPageName, // Message of Alert
                dr.HolidayId // Endpoint to hit for delete
              )
            }
            disabled={!permission.ManageDelete}
            IconName="Delete"
            id={`btnHolidayDelete_${dr.HolidayId}`}
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
      title: "Holiday",
      hrefLink: "#",
    },
  ]);
  const MasterPageName = "Holiday";
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
      <AddEditHolidayMaster
        callBackEvent={async () =>await fetchHolidayMaster()}
        ref={addEditModalRef}
      ></AddEditHolidayMaster>
    </>
  );
};
export default HolidayMaster;
