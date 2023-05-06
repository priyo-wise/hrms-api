import Modal from "react-bootstrap/Modal";
import React, {
  useState,
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";
import { WebService } from "../../Services/WebService";
import AddEditProject from "./AddEditProject";
import { useDispatch } from "react-redux";
import "./Static.css";
import TableComponent from "../../Services/TableComponent";
import { ActionPermission, PageInfo } from "../PageInfo";
import SnackbarComponent from "../../Services/SnackbarComponent";
import DeleteConfirmAlert from "../../Services/AlertComponent";
import "../Static/Static.css";
import ActionButton from "../../Services/ActionButton";
import StaticListComponent from "../../Services/StaticListComponent";
import { each, extend, filter, findWhere, map, pick, where } from "underscore";
import { InputDropdown } from "../Form";
import { IconButton, Menu, MenuItem } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";

const Project = () => {
  const cloneData = (ds) => JSON.parse(JSON.stringify(ds));
  const ref = useRef();
  const refAssignTeamToProject = useRef();
  const refSnackbar = useRef();
  PageInfo({ pageTitle: "Project" });
  const dispatch = useDispatch();
  const [records, setRecords] = useState([]);
  const [columns, setColumns] = useState();
  const [budgetSubCategory, setBudgetSubCategory] = useState([]);
  const [projectActualCost, setProjectActualCost] = useState([]);
  const fetchProject = async () => {
    const s1 = await WebService({
      dispatch,
      endPoint: "CommonUtility/project_budget",
    });
    let data = await WebService({
      endPoint: "CommonUtility/projectmaster",
      dispatch,
    }).then((ds) =>
      map(ds, (m) =>
        extend(m, {
          Category: map(cloneData(budgetSubCategory), (m1) =>
            extend(m1, {
              budget:
                findWhere(cloneData(s1), {
                  ProjectId: m.ProjectId,
                  TaskTypeId: m1.TaskTypeId,
                })?.Hours ?? 0,
              actual:
                findWhere(cloneData(projectActualCost), {
                  ProjectId: m.ProjectId,
                  TaskTypeId: m1.TaskTypeId,
                })?.TimeInHour ?? 0,
            })
          ),
        })
      )
    );

    setRecords(data);
  };
  const budgetViewComponent = (dr, taskType) => {
    var s1 = findWhere(dr?.Category ?? [], { TaskTypeId: taskType.TaskTypeId });
    var budget = s1?.budget ?? 0;
    var actual = s1?.actual ?? 0;
    return (
      <span>
        {actual}/{budget}
      </span>
    );
  };
  const fetchCommon = async () => {
    setProjectActualCost(
      await WebService({
        dispatch,
        endPoint:
          "CommonUtility/timesheet?expand=taskcategorymaster&select=taskcategorymaster.TaskTypeId, sum(TimeInHour) TimeInHour, ProjectId&groupBy=taskcategorymaster.TaskTypeId, ProjectId",
      })
    );
    await WebService({ dispatch, endPoint: "CommonUtility/tasktype" }).then(
      (ds) => {
        setBudgetSubCategory(ds);
        let cols = [
          {
            Text: "Project Name",
            Value: "ProjectName",
          },
          {
            Text: "Total Hour",
            Value: "BudgetTotalHour",
          },
          {
            Text: "Action",
            key: "ProjectId",
            style: { width: "135px" },
            isVisiable: permission.ManageEdit || permission.ManageDelete,
            render: (dr) => (
              <>
                <ActionButton
                  onClick={() => fnEdit(dr.ProjectId)}
                  disabled={!permission.ManageEdit}
                  IconName="Edit"
                  id="btnProjectEditModel"
                />

                <ActionButton
                  onClick={(e) =>
                    ref.current.confirmAlert(
                      "Delete", //Confirm button text
                      "Are You Sure", // Text if Alert
                      "Do you want to delete " + MasterPageName, // Message of Alert
                      dr.ProjectId // Endpoint to hit for delete
                    )
                  }
                  disabled={!permission.ManageDelete}
                  IconName="Delete"
                  id="btnProjectDelete"
                />
                <MoreAction
                  MenuItems={[
                    {
                      name: "Assign team",
                      action: async () =>
                        await refAssignTeamToProject.current.fetchTeam(
                          dr.ProjectId
                        ),
                      isVisiable: true,
                    },
                  ]}
                />
              </>
            ),
          },
        ];
        each(ds, (e, i) => {
          cols.splice(2 + i, 0, {
            Text: e.DisplayDescription,
            render: (dr) => budgetViewComponent(dr, e),
          });
        });
        setColumns(cols);
      }
    );
  };
  const [permission] = useState({
    ManageAdd: ActionPermission("Project - Add"),
    ManageEdit: ActionPermission("Project - Edit"),
    ManageDelete: ActionPermission("Project - Delete"),
  });
  const onDelete = async (ProjectId) => {
    await WebService({
      endPoint: `Project/Remove/${ProjectId}`,
      method: "DELETE",
      dispatch,
    });
    refSnackbar.current.setOpenSnackBar();
    await fetchProject();
  };
  const renderAfterCalled = useRef(false);
  const addEditModalRef = useRef();
  useEffect(() => {
    if (!renderAfterCalled.current) {
      fetchCommon();
    }
    renderAfterCalled.current = true;
  }, []);
  useEffect(() => {
    if (budgetSubCategory.length > 0) {
      fetchProject();
    }
  }, [budgetSubCategory]);
  const [bData, setBData] = React.useState([
    {
      title: "Master",
      hrefLink: "#",
    },
    {
      title: "Project",
      hrefLink: "#",
    },
  ]);
  const MasterPageName = "Project";
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
      <AddEditProject
        callBackEvent={() => fetchProject()}
        ref={addEditModalRef}
      ></AddEditProject>

      <AssignTeamToProject ref={refAssignTeamToProject} />
    </>
  );
};

const AssignTeamToProject = forwardRef(({}, ref) => {
  const renderAfterCalled = useRef(false);
  const [dataSet, setDataSet] = useState([]);
  const [roles, setRoles] = useState([]);
  const [permission] = useState({
    ManageAssignTeam: ActionPermission("Project - AssignTeam"),
  });
  const dispatch = useDispatch();
  const fetchTeam = async (projectId = 0) => {
    const assigned = await WebService({
      dispatch,
      endPoint: `CommonUtility/project_team?where=ProjectId eq ${projectId}&select=EmployeeId,ProjectRoleId`,
    });
    await WebService({
      dispatch,
      endPoint:
        "CommonUtility/employees?where=StatusId=3&select=EmployeeId, FullName, Designation, Department",
    })
      .then((drc) =>
        map(drc, (dr) =>
          extend(dr, {
            ProjectRoleId: findWhere(assigned, { EmployeeId: dr.EmployeeId })
              ?.ProjectRoleId,
            ProjectId: projectId,
          })
        )
      )
      .then((res) => {
        setDataSet(res);
        setShow(true);
      });
  };
  useImperativeHandle(ref, () => ({
    fetchTeam,
  }));
  useEffect(() => {
    if (!renderAfterCalled.current) {
      WebService({
        dispatch,
        endPoint:
          "CommonUtility/static_project_roles?select=ProjectRoleId,DisplayDescription",
      })
        .then((res) =>
          map(res, (m) => ({
            value: m.ProjectRoleId,
            text: m.DisplayDescription,
          }))
        )
        .then((res) => setRoles(res));
    }
    renderAfterCalled.current = true;
  }, []);
  const onAssign = async (obj, ProjectRoleId) => {
    if (ProjectRoleId == "") ProjectRoleId = null;
    setDataSet((dataSet) =>
      map(dataSet, (m) => {
        if (m.ProjectId == obj.ProjectId && m.EmployeeId == obj.EmployeeId)
          m.ProjectRoleId = ProjectRoleId;
        return m;
      })
    );
    var opt = {
      endPoint: "Project/Team",
      dispatch,
      body: {
        ProjectId: obj.ProjectId,
        EmployeeId: obj.EmployeeId,
        ProjectRoleId,
      },
    };
    await WebService(opt);
  };
  const columns = [
    {
      Text: "Member Name",
      Value: "FullName",
    },
    {
      Text: "Role",
      style: { width: "250px" },
      render: (dr) => (
        <>
          <InputDropdown
            ddOpt={[{}].concat(roles)}
            value={dr.ProjectRoleId}
            setValue={async (v) => {
              if ((dr?.ProjectRoleId ?? "") != (v ?? "")) await onAssign(dr, v);
            }}
            disabled={!permission.ManageAssignTeam}
          />
        </>
      ),
    },
  ];
  const BodyContaint = (
    <TableComponent
      data={dataSet}
      columns={columns}
      IsAddButtonVisible={false}
      isSearchRequired={true}
    ></TableComponent>
  );
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Team Assign</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">{BodyContaint}</Modal.Body>
      </Modal>
    </>
  );
});

const MoreAction = ({ MenuItems }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <>
      {filter(MenuItems, (f) => f.isVisiable ?? true).length > 0 && (
        <>
          <IconButton
            id="basic-button"
            size="small"
            aria-controls={open ? "basic-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
            onClick={handleClick}
          >
            <MoreVertIcon fontSize="small" />
          </IconButton>
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              "aria-labelledby": "basic-button",
            }}
          >
            {map(
              filter(MenuItems, (f) => f.isVisiable ?? true),
              (m) => (
                <MenuItem
                  onClick={() => {
                    handleClose();
                    m.action();
                  }}
                >
                  {m.name}
                </MenuItem>
              )
            )}
          </Menu>
        </>
      )}
    </>
  );
};

export default Project;
