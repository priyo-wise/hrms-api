import React, { useEffect, useRef, useState } from "react";
import Col from "react-bootstrap/esm/Col";
import Container from "react-bootstrap/esm/Container";
import Row from "react-bootstrap/esm/Row";
import { useDispatch } from "react-redux";
import TableComponent from "../../../Services/TableComponent";
import { WebService } from "../../../Services/WebService";
import "../../Static/Static.css";
import { confirm } from "react-confirm-box";
import AddEditComponent from "./AddEditComponentTemplate";
import { ActionPermission, PageInfo } from "../../PageInfo";
import ActionButton from "../../../Services/ActionButton";
import Button from "react-bootstrap/esm/Button";
import SnackbarComponent from "../../../Services/SnackbarComponent";
import DeleteConfirmAlert from "../../../Services/AlertComponent";

const SalaryTemplateComponent = () => { 
  const ref = useRef();
  const refSnackbar = useRef();
  var dispatch = useDispatch();
  var [data, setData] = useState([]);
  var afterRender = useRef(false);
  const fetchComponentList = async () => {
    var res = await WebService({
      dispatch,
      endPoint: "SalaryTemplateComp/Fetch",
    });
    setData(res);
  };

  const [permission] = useState({
    ManageAdd: ActionPermission("Salary - Component Add"),
    ManageEdit: ActionPermission("Salary - Component Edit"),
    // ManageDelete: ActionPermission("Roles - Delete"),
  });
  
  const onDelete = async (TemplateComponentId) => {
    await WebService({
      endPoint: `SalaryTemplateComp/Delete/${TemplateComponentId}`,
      method: "DELETE",
      dispatch,
    });
    refSnackbar.current.setOpenSnackBar();
    await fetchComponentList();
  };

  // const onDelete = async (TemplateComponentId) => {
  //   const options = {
  //     labels: {
  //       confirmable: "Confirm",
  //       cancellable: "Cancel",
  //     },
  //   };
  //   const result = await confirm("Are you sure you want to delete?", options);
  //   if (result) {
  //     await WebService({
  //       endPoint: `SalaryTemplateComp/Delete/${TemplateComponentId}`,
  //       method: "DELETE",
  //       dispatch,
  //     });
  //     fetchComponentList();
  //   }
  // };

  const addEditModalRef = useRef();
  useEffect(() => {
    if (afterRender.current === false) {
      fetchComponentList();
    }
    afterRender.current = true;
  }, []);
  const fnEdit = async (id) => await addEditModalRef.current.openModal(id || 0);
  var columns = [
    {
      Text: "Template Name",
      Value: "TemplateName",
    },
    {
      Text: "Earning/Deduction Name",
      Value: "EarningOrDeductionName",
    },
    {
      Text: "Calculation Method",
      Value: "CalculationMethod",
    },
    {
      Text: "Number/Amount",
      Value: "NumberOrAmount",
    },
    {
      Text: "Action",
      key: "TemplateComponentId",
      isVisiable: permission.ManageEdit,
      Template: (
        <>
          <ActionButton
            onClick={(e) =>
              fnEdit(e.currentTarget.parentElement.getAttribute("data-key"))
            }
            disabled={!permission.ManageEdit}
            IconName="Edit"
            id="btnSalaryTemplateCompEdit"
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
            id="btnSalaryTemplateCompDelete"
          />
          {/* <button
            className="btn btn-default mt-2 mx-4"
            id="btnSalaryTemplateCompDelete"
            onClick={(e) =>
              onDelete(e.currentTarget.parentElement.getAttribute("data-key"))
            }
          >
            <i className="fa fa-trash"></i>
          </button> */}
        </>
      ),
    },
  ];
  
  const MasterPageName = "Salary Template Component";
  const confirmMessage = MasterPageName + " Deleted successfully";
  return (
    <>
    <SnackbarComponent ref={refSnackbar} confirmMessage={confirmMessage} />
    <DeleteConfirmAlert ref={ref} confirmEvent={(v) => onDelete(v)} />
      <Container
        style={{
          "background-color": "#FFF",
          "border-radius": "10px ",
        }}
      >
        <Row className="mt-2">
          {/* <Col xs={4} md={2}>
            <img src="WiseLogoFinal.png" height="75" width="auto" />
          </Col> */}
          <Col
            xs={12}
            md={12}
            className="d-flex justify-content-center align-items-center"
          >
            <h4>Template Component</h4>
          </Col>
          {/* <Col
            xs={6}
            md={2}
            className="d-flex justify-content-center align-items-end flex-column"
          >
            <Button id="btnCalculationComponentAdd" onClick={() => fnEdit()}>
              Add +
            </Button>
          </Col> */}
        </Row>

        <Row>
          <TableComponent
            columns={columns}
            data={data}
            IsAddButtonVisible={permission?.ManageAdd}
            isSearchRequired={true}
            onAddEvent={() => fnEdit()}
          />
        </Row>
      </Container>
      <AddEditComponent
        callBackEvent={() => fetchComponentList()}
        ref={addEditModalRef}
      ></AddEditComponent>
    </>
  );
};

export default SalaryTemplateComponent;
