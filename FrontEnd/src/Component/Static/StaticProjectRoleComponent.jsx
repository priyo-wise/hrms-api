import React, { useState, useEffect, useRef } from "react";
import { WebService } from "../../Services/WebService";
import { useDispatch } from "react-redux";
import StaticListComponent from "../../Services/StaticListComponent";
import "../Static/Static.css";
import ActionButton from "../../Services/ActionButton";
import DeleteConfirmAlert from "../../Services/AlertComponent";
import SnackbarComponent from "../../Services/SnackbarComponent";
import AddEditProjectRoleMaster from "./AddEditProjectRoleMaster";
import "./Static.css";
import { ActionPermission, PageInfo } from "../PageInfo";
import "./Master.css";
import "../Static/Static.css";
import { extend, findWhere, map } from "underscore";

const ProjectRoleMaster = () => {
  PageInfo({ pageTitle: "Project Role" });
  const [permission] = useState({
    ManageAdd: ActionPermission("Project Role - Add"),
    ManageEdit: ActionPermission("Project Role - Edit"),
    ManageDelete: ActionPermission("Project Role - Delete"),
  });

  const ref = useRef();
  const refSnackbar = useRef();
  const dispatch = useDispatch();
  const [records, setRecords] = useState([]);

  const fetchProjectRoleMaster = async () => {
    const data = await WebService({
      endPoint: "CommonUtility/static_project_roles",
      dispatch,
    }).then((c) =>
      map(c, (m) =>
        extend(m, {
          ParentProjectRole: findWhere(c, { ProjectRoleId: m.ParentId })
            ?.DisplayDescription,
        })
      )
    );
    setRecords(data);
  };

  const onDelete = async (ProjectRoleId) => {
    await WebService({
      endPoint: `CommonUtility/static_project_roles?ProjectRoleId=${ProjectRoleId}`,
      method: "DELETE",
      dispatch,
    });
    refSnackbar.current.setOpenSnackBar();
    fetchProjectRoleMaster();
  };

  const renderAfterCalled = useRef(false);
  const addEditModalRef = useRef();
  useEffect(() => {
    if (!renderAfterCalled.current) {
        fetchProjectRoleMaster();
    }
    renderAfterCalled.current = true;
  }, []);
  const columns = [
    {
      Text: "Project Role Text",
      Value: "DisplayDescription",
    },
    {
      Text: "Parent Project Role",
      Value: "ParentProjectRole",
    },
    {
      Searchable: false,
      Text: "ACTION",
      cssClass: "text-center td-width-100",
     // isVisiable: permission.ManageEdit || permission.ManageDelete,
     // Template: (
      render: (dr)=>(
        <>
          <ActionButton
            onClick={() =>
              fnEdit(dr.ProjectRoleId)
            }
           // disabled={!permission.ManageEdit}
            IconName="Edit"
            id="btnProjectRoleMasterEdit"
          />

          <ActionButton
            onClick={(e) =>
              ref.current.confirmAlert(
                "Delete", //Confirm button text
                "Are You Sure", // Text if Alert
                "Do you want to delete " + MasterPageName, // Message of Alert
                dr.ProjectRoleId // Endpoint to hit for delete
              )
            }
           // disabled={!permission.ManageDelete}
            IconName="Delete"
            id="btnProjectRoleMasterDelete"
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
      title: "Project Role",
      hrefLink: "#",
    },
  ]);
  const MasterPageName = "Project Role";
  const confirmMessage = MasterPageName + " Deleted successfully";

  const fnEdit = async (id=0) => await addEditModalRef.current.openModal(id);
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
      <AddEditProjectRoleMaster
        callBackEvent={() => fetchProjectRoleMaster()}
        ref={addEditModalRef}
      ></AddEditProjectRoleMaster>
    </>
  );
};
export default ProjectRoleMaster;
