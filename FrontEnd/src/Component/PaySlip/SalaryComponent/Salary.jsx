import React, { useEffect, useRef, useState } from "react";
import Col from "react-bootstrap/esm/Col";
import Container from "react-bootstrap/esm/Container";
import Row from "react-bootstrap/esm/Row";
import { useDispatch } from "react-redux";
import TableComponent from "../../../Services/TableComponent";
import { WebService } from "../../../Services/WebService";
import "../../Static/Static.css";
import { confirm } from "react-confirm-box";
import AddEditSalaryComponent from "./AddEditSalaryComponent";
import Button from "react-bootstrap/esm/Button";
import { ActionPermission, PageInfo } from "../../PageInfo";
import ActionButton from "../../../Services/ActionButton";
import SnackbarComponent from "../../../Services/SnackbarComponent";
import DeleteConfirmAlert from "../../../Services/AlertComponent";
const Salary = () => {
  const MasterPageName = "Salary Component";
  const confirmMessage = MasterPageName + " Deleted successfully";  
  const [permission] = useState({
    ManageAdd: ActionPermission("Salary - Component Add"),
    ManageEdit: ActionPermission("Salary - Component Edit"),
    //ManageDelete: ActionPermission("Roles - Delete"),
  });
  const ref = useRef();
  const refSnackbar = useRef();
  var dispatch = useDispatch();
  PageInfo({ pageTitle: "Salary Component" });
  var [data, setData] = useState([]);
  var [deductionData, setDeductionData] = useState([]);
  var afterRender = useRef(false);
  const fetchList = async () => {
    var res = await WebService({
      dispatch,
      endPoint: "SalaryComponent/Earning",
    });
    setData(res);
    var res = await WebService({
      dispatch,
      endPoint: "SalaryComponent/Deduction",
    });
    setDeductionData(res);
  };

  const onDelete = async (SalaryComponentsId) => {
    // const options = {
    //   labels: {
    //     confirmable: "Confirm",
    //     cancellable: "Cancel",
    //   },
    // };
    // const result = await confirm("Are you sure you want to delete?", options);
    // if (result) {
    //   await WebService({
    //     endPoint: `SalaryComponent/${SalaryComponentsId}`,
    //     method: "DELETE",
    //     dispatch,
    //   });

    // }

    await WebService({
      endPoint: `SalaryComponent/${SalaryComponentsId}`,
      method: "DELETE",
      dispatch,
    });
    //refSnackbar.current.setOpenSnackBar();
    fetchList();
  };

  const addEditModalRef = useRef();
  useEffect(() => {
    if (afterRender.current === false) {
      fetchList();
    }
    afterRender.current = true;
  }, []);
  const fnEdit = async (id) => await addEditModalRef.current.openModal(id || 0);
  var columns = [
    {
      Text: "Component Name",
      Value: "EarningOrDeductionName",
    },

    {
      Text: "ACTION",
      cssClass: "w-30 d-flex float-end",
      key: "SalaryComponentsId",
      isVisiable: permission.ManageEdit,
      Template: (
        <>
          <ActionButton
            onClick={(e) =>
              fnEdit(e.currentTarget.parentElement.getAttribute("data-key"))
            }
            disabled={false}
            IconName="Edit"
            id="btnSalaryEdit"
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
            disabled={false}
            IconName="Delete"
            id="btnSalaryDelete"
          />
          {/* <button
            className="btn btn-default mt-2 mx-4"
            onClick={(e) =>
              fnEdit(e.currentTarget.parentElement.getAttribute("data-key"))
            }
          >
            <i className="fa fa-pencil"></i>
          </button>
          <button
            className="btn btn-default mt-2 mx-4"
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

  var columnsDeduction = [
    {
      Text: "Component Name",
      Value: "EarningOrDeductionName",
    },
    {
      Text: "Tax",
      Value: "PreTaxORPostTax",
    },
    {
      Text: "ACTION",
      cssClass: "w-30 d-flex float-end",
      key: "SalaryComponentsId",
      isVisiable: permission.ManageEdit,
      Template: (
        <>
          <ActionButton
            onClick={(e) =>
              fnEdit(e.currentTarget.parentElement.getAttribute("data-key"))
            }
            disabled={false}
            IconName="Edit"
            id="btnSalaryComponentEdit"
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
            disabled={false}
            IconName="Delete"
            id="btnSalaryComponentDelete"
          />
          {/* <button
            className="btn btn-default mt-2 mx-4"
            onClick={(e) =>
              fnEdit(e.currentTarget.parentElement.getAttribute("data-key"))
            }
          >
            <i className="fa fa-pencil"></i>
          </button>
          <button
            className="btn btn-default mt-2 mx-4"
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
  return (
    <>
      <Container>
        {/* <SnackbarComponent ref={refSnackbar} confirmMessage={confirmMessage} />
        <DeleteConfirmAlert ref={ref} confirmEvent={(v) => onDelete(v)} /> */}
        <Row className="mt-2">
          <Col xs={4} md={2}>
            <img src="WiseLogoFinal.png" height="75" width="auto" />
          </Col>
          <Col
            xs={6}
            md={8}
            className="d-flex justify-content-center align-items-center"
          >
            <h4>Wise Software Solutions Pvt Ltd</h4>
          </Col>
          <Col
            xs={6}
            md={2}
            className="d-flex justify-content-center align-items-end flex-column"
          >
            <Button id="btnSalaryComponentAdd" IsAddButtonVisible={permission?.ManageAdd} onClick={() => fnEdit()}>
              Add +
            </Button>
          </Col>
        </Row>
        <Row>
          <Col md={6} className="text-center square border-end mb-1">
            <strong> Earnings</strong>
          </Col>
          <Col md={6} className="text-center bg-color:red">
            <strong>Deduction</strong>
          </Col>
        </Row>

        <Row>
          <Col className="square border-end">
            <TableComponent
              columns={columns}
              data={data}
              allowSerialNo={false}
              IsAddButtonVisible={false}
              isSearchRequired={false}
            />
          </Col>

          <Col>
            <TableComponent
              columns={columnsDeduction}
              data={deductionData}
              allowSerialNo={false}
              IsAddButtonVisible={false}
              isSearchRequired={false}
            />
          </Col>
        </Row>
      </Container>
      <AddEditSalaryComponent
        callBackEvent={() => fetchList()}
        ref={addEditModalRef}
      ></AddEditSalaryComponent>
    </>
  );
};

export default Salary;
