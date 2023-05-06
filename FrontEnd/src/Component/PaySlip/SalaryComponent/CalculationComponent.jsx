import React, { useEffect, useRef, useState } from "react";
import Col from "react-bootstrap/esm/Col";
import Container from "react-bootstrap/esm/Container";
import Row from "react-bootstrap/esm/Row";
import { useDispatch } from "react-redux";
import TableComponent from "../../../Services/TableComponent";
import { WebService } from "../../../Services/WebService";
import "../../Static/Static.css";
import { confirm } from "react-confirm-box";
import AddEditCalculationMethod from "./AddEditCalculationMethod";
import Button from "react-bootstrap/esm/Button";
import DeleteConfirmAlert from "../../../Services/AlertComponent";
import ActionButton from "../../../Services/ActionButton";
const SalaryComponent = () => {
  const MasterPageName = "SalarySlip";
  const confirmMessage = MasterPageName + " Deleted successfully";
  var dispatch = useDispatch();
  var [records, setRecords] = useState([]);
  var afterRender = useRef(false);
  const refSnackbar = useRef();
  const ref = useRef();
  const fetchCalculationList = async () => {
    var res = await WebService({ dispatch, endPoint: "CalculationMethod" });

    setRecords(res);
  };

  const onDelete = async (CalculationMethodId) => {
    await WebService({
      endPoint: `CalculationMethod/${CalculationMethodId}`,
      method: "DELETE",
      dispatch,
    });
    refSnackbar.current.setOpenSnackBar();
    await fetchCalculationList();
  };

  const addEditColModalRef = useRef();
  useEffect(() => {
    if (afterRender.current === false) {
      fetchCalculationList();
    }
    afterRender.current = true;
  }, []);
  const fnEdit = async (id) =>
    await addEditColModalRef.current.openModal(id || 0);

  var details = [
    {
      Text: "Code",
      Value: "Code",
    },
    {
      Text: "Calculation Method",
      Value: "CalculationMethod",
    },
    {
      Text: "Action",
      key: "CalculationMethodId",
      Template: (
        <>
          <ActionButton
            onClick={(e) =>
              fnEdit(e.currentTarget.parentElement.getAttribute("data-key"))
            }
            disabled={false}
            IconName="Edit"
            id="btnCalculationComponentEdit"
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
            id="btnCalculationComponentDelete"
          />
          {/* 
          <button
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
        <DeleteConfirmAlert ref={ref} confirmEvent={(v) => onDelete(v)} />
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
            <Button id="btnCalculationComponentAdd" onClick={() => fnEdit()}>
              Add +
            </Button>
          </Col>
        </Row>
        <Row>
          <TableComponent
            columns={details}
            data={records}
            allowSerialNo={true}
            IsAddButtonVisible={false}
            isSearchRequired={false}
          />
        </Row>

        <AddEditCalculationMethod
          callBackEvent={() => fetchCalculationList()}
          ref={addEditColModalRef}
        ></AddEditCalculationMethod>
      </Container>
    </>
  );
};

export default SalaryComponent;
