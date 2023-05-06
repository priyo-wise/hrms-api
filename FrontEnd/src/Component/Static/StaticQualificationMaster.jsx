import React, { useState, useEffect, useRef } from "react";
import { WebService } from "../../Services/WebService";
import AddEditQualification from "./AddEditQualification";
import { useDispatch } from "react-redux";
import "./Static.css";
import { ActionPermission, PageInfo } from "../PageInfo";
import SnackbarComponent from "../../Services/SnackbarComponent";
import DeleteConfirmAlert from "../../Services/AlertComponent";
import "../Static/Static.css";
import ActionButton from "../../Services/ActionButton";
import StaticListComponent from "../../Services/StaticListComponent";
import { sortBy } from "underscore";

const Qualification = () => {
  const ref = useRef();
  const refSnackbar = useRef();
  const [appData, setAppData] = React.useState({
    searchPlaceHolder: "Search Qualification",
    addMenuTitle: "Add Qualification",
  });
  PageInfo({ pageTitle: "Qualification" });
  const dispatch = useDispatch();
  const [records, setRecords] = useState([]);
  const [permission] = useState({
    ManageAdd: ActionPermission("Qualification - Add"),
    ManageEdit: ActionPermission("Qualification - Edit"),
    ManageDelete: ActionPermission("Qualification - Delete"),
  });
  const fetchQualification = async () => {
    const data = await WebService({
      endPoint: "CommonUtility/static_qualification_master",
      dispatch,
    });
    setRecords(sortBy(data,s=>s.DisplayQualification));
  };
  const onDelete = async (QualificationId) => {
    await WebService({
      endPoint: `CommonUtility/static_qualification_master?QualificationId=${QualificationId}`,
      method: "DELETE",
      dispatch,
    });
    refSnackbar.current.setOpenSnackBar();
    await fetchQualification();
  };
  const renderAfterCalled = useRef(false);
  const addEditModalRef = useRef();
  useEffect(() => {
    if (!renderAfterCalled.current) {
      fetchQualification();
    }
    renderAfterCalled.current = true;
  }, []);
  const columns = [
    {
      Text: "Qualification",
      Value: "DisplayQualification",
    },
    {
      Text: "Action",
      cssClass: "text-center td-width-100",
     // isVisiable: permission.ManageEdit || permission.ManageDelete,
      render: (dr) => (
        
            <>
              <ActionButton
                onClick={() => fnEdit(dr.QualificationId)}
                //disabled={!permission.ManageEdit}
                IconName="Edit"
                id="btnQualificationEdit"
              />

              <ActionButton
                onClick={(e) =>
                  ref.current.confirmAlert(
                    "Delete", //Confirm button text
                    "Are You Sure", // Text if Alert
                    "Do you want to delete " + MasterPageName, // Message of Alert
                    dr.QualificationId // Endpoint to hit for delete
                  )
                }
               // disabled={!permission.ManageDelete}
                IconName="Delete"
                id="btnQualificationDelete"
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
      title: "Qualification",
      hrefLink: "#",
    },
  ]);
  const MasterPageName = "Qualification";
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
       // IsAddButtonVisible={permission?.ManageAdd}
        isSearchRequired={true}
        allowSerialNo={true}
      ></StaticListComponent>
      <AddEditQualification
        callBackEvent={() => fetchQualification()}
        ref={addEditModalRef}
      ></AddEditQualification>
    </>
  );
};
export default Qualification;
