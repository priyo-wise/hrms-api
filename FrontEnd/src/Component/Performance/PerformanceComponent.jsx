import React, { useEffect, memo, useState, useRef } from "react";
import { WebService } from "../../Services/WebService";
import AddEditPerformanceComponent from "./AddEditPerformanceComponent";
import { ActionPermission, PageInfo } from "../PageInfo";
import { useDispatch } from "react-redux";
import Container from "react-bootstrap/Container";
import "../Static/Static.css";
import _ from "underscore";
import TableComponent from "../../Services/TableComponent";
import SnackbarComponent from "../../Services/SnackbarComponent";
import DeleteConfirmAlert from "../../Services/AlertComponent";
import "../Static/Static.css";
import ActionButton from "../../Services/ActionButton";
import StaticListComponent from "../../Services/StaticListComponent";


const PerformanceComponent = () => {
  const ref = useRef();
  const refSnackbar = useRef();
  const dispatch = useDispatch();
  PageInfo({ pageTitle: "Performance" });
  const [permission] = useState({
    ManageAdd: ActionPermission("Performance - Add"),
    ManageEdit: ActionPermission("Performance - Edit"),
    ManageAllUser: ActionPermission("Performance - Select User"),
  });
  const [records, setRecords] = useState([]);
  const fetchPerformanceList = async () => {
    var endPoint = "Performance/Fetch";
    if (permission.ManageAllUser) endPoint += "/All";
    else endPoint += "/Own";
    const data = await WebService({ endPoint, dispatch });
    setRecords(data);
  };
  const renderAfterCalled = useRef(false);
  const addEditModalRef = useRef();
  useEffect(() => {
    if (!renderAfterCalled.current) {
      fetchPerformanceList();
    }
    renderAfterCalled.current = true;
  }, []);
  const fnEdit = async (id) => await addEditModalRef.current.openModal(id || 0);
  const columns = [
    {
      Text: "EMP. NAME",
      Value: "FullName",
    },
    {
      Text: "FROM DATE",
      DateFormat: "yyyy-MM-dd",
      Value: "FromDate",
    },
    {
      Text: "TO DATE",
      DateFormat: "yyyy-MM-dd",
      Value: "ToDate",
    },
    {
      Text: "EMP. RATING",
      Value: "EmpSelfScore",
    },
    {
      Text: "MANAGER RATING",
      Value: "ManagerScore",
    },
    {
      Text: "FINAL RATING",
      Value: "FinalAgreedScore",
    },
    {
      Text: "REVIEW COMMENTS",
      Value: "FinalReviewComments",
    },
    {
      Text: "HR COMMENTS",
      Value: "HRComments",
    },
    {
      Text: "Action",
      key: "PerformanceId",
      cssClass: "text-center td-width-100",
      isVisiable: permission.ManageEdit,
      NotUseInExport: true,
      Template: (
        <>
          <ActionButton
            onClick={(e) =>
              fnEdit(e.currentTarget.parentElement.getAttribute("data-key"))
            }
            disabled={!permission.ManageEdit}
            IconName="Edit"
            id="btnPerformanceEdit"
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
      title: "Performance",
      hrefLink: "#",
    },
  ]);
  const MasterPageName = "Performance";
  const confirmMessage = MasterPageName + " Deleted successfully";
  
  return (
    <>        
    <Container
        className="p-4"
        style={{
          "background-color": "#FFF",
          "border-radius": "10px ",
          margin: "10px",
        }}
      >
    <SnackbarComponent ref={refSnackbar} confirmMessage={confirmMessage} />
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
    <div className="row m-2  mb-4">
       <div className="text-left mt-2">
         <a className="btn btn-outline-primary p-2 col-2" href="/">Back</a>
         
       </div>
     </div>
    </Container>
    <AddEditPerformanceComponent
        callBackEvent={() => fetchPerformanceList()}
        ref={addEditModalRef}
      />
    </>
  );
};

export default memo(PerformanceComponent);
