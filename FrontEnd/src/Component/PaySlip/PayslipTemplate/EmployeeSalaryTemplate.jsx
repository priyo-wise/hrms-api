import React, { useEffect, useRef, useState } from "react";
import Col from "react-bootstrap/esm/Col";
import Container from "react-bootstrap/esm/Container";
import Row from "react-bootstrap/esm/Row";
import { useDispatch } from "react-redux";
import TableComponent from "../../../Services/TableComponent";
import { WebService } from "../../../Services/WebService";
import "../../Static/Static.css";
import { confirm } from "react-confirm-box";
import AddEditEmployee from "./AddEditEmployee";
import Button from "react-bootstrap/esm/Button";
import { ActionPermission, PageInfo } from "../../PageInfo";

const EmployeeSalaryTemplate = () => {
  PageInfo({ pageTitle: "Payslip Template" });
  var dispatch = useDispatch();
  var [data, setData] = useState([]);
  var afterRender = useRef(false);
  const fetchPackageList = async () => {
    var res = await WebService({
      dispatch,
      endPoint: "EmployeeSalaryTemplate/Fetch",
    });
    setData(res);
  };

  const onDelete = async (SalaryTemplateId) => {
    const options = {
      labels: {
        confirmable: "Confirm",
        cancellable: "Cancel",
      },
    };
    const result = await confirm("Are you sure you want to delete?", options);
    if (result) {
      await WebService({
        endPoint: `EmployeeSalaryTemplate/Remove/${SalaryTemplateId}`,
        method: "DELETE",
        dispatch,
      });
      fetchPackageList();
    }
  };

  const addEditModalRef = useRef();
  useEffect(() => {
    if (afterRender.current === false) {
      fetchPackageList();
    }
    afterRender.current = true;
  }, []);
  const fnEdit = async (id) => await addEditModalRef.current.openModal(id || 0);
  var columns = [
    {
      Text: "FullName",
      Value: "FullName",
    },
    {
      Text: "From Date",
      Value: "FromDate",
      DateFormat: "yyyy-MM-dd",
    },
    {
      Text: "To Date",
      Value: "ToDate",
      DateFormat: "yyyy-MM-dd",
    },
    {
      Text: "Action",
      key: "SalaryTemplateId",
      Template: (
        <>
          <button
            className="btn btn-default mt-2 mx-4"
            id="btnEmployeeSalaryTemplateEdit"
            onClick={(e) =>
              fnEdit(e.currentTarget.parentElement.getAttribute("data-key"))
            }
          >
            <i className="fa fa-pencil"></i>
          </button>
          <button
            className="btn btn-default mt-2 mx-4"
            id="btnEmployeeSalaryTemplateDelete"
            onClick={(e) =>
              onDelete(e.currentTarget.parentElement.getAttribute("data-key"))
            }
          >
            <i className="fa fa-trash"></i>
          </button>
        </>
      ),
    },
  ];
  return (
    <>
      <Container
        style={{
          "background-color": "#FFF",
          "border-radius": "10px ",
          margin: "10px",
        }}
      >
        <Row>
          <Col>
            <div className="float-end mb-3">
              <>
                <Button
                  id="btnEmployeeSalaryTemplateAdd"
                  onClick={() => fnEdit()}
                >
                  Add +
                </Button>
              </>
            </div>
          </Col>
        </Row>
        <Row>
          <TableComponent columns={columns} data={data} />
        </Row>
      </Container>
      <AddEditEmployee
        callBackEvent={() => fetchPackageList()}
        ref={addEditModalRef}
      ></AddEditEmployee>
    </>
  );
};

export default EmployeeSalaryTemplate;
