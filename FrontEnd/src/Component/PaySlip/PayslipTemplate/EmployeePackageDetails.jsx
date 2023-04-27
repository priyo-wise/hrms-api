import React, { useEffect, useRef, useState } from "react";
import Col from "react-bootstrap/esm/Col";
import Container from "react-bootstrap/esm/Container";
import Row from "react-bootstrap/esm/Row";
import { useDispatch } from "react-redux";
import TableComponent from "../../../Services/TableComponent";
import { WebService } from "../../../Services/WebService";
import "../../Static/Static.css";
import { confirm } from "react-confirm-box";
import AddEditPackage from "./AddEditEmployee";
import Button from "react-bootstrap/esm/Button";

const EmployeePackageDetails = () => {
  var dispatch = useDispatch();
  var [data, setData] = useState([]);
  var afterRender = useRef(false);
  const fetchPackageList = async () => {
    var res = await WebService({ dispatch, endPoint: "PackageDetails/Fetch" });
    setData(res);
  };

  const onDelete = async (EmployeePackageId) => {
    const options = {
      labels: {
        confirmable: "Confirm",
        cancellable: "Cancel",
      },
    };
    const result = await confirm("Are you sure you want to delete?", options);
    if (result) {
      await WebService({
        endPoint: `PackageDetails/Remove/${EmployeePackageId}`,
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
      Text: "Earning/Deduction Name",
      Value: "EarningOrDeductionName",
    },
    {
      Text: "Amount",
      Value: "Amount",
    },
    {
      Text: "ACTION",
      key: "EmployeePackageId",
      Template: (
        <>
          <button
            className="btn btn-default mt-2 mx-4"
            id="btnEmployeePackageDetailsEdit"
            onClick={(e) =>
              fnEdit(e.currentTarget.parentElement.getAttribute("data-key"))
            }
          >
            <i className="fa fa-pencil"></i>
          </button>
          <button
            className="btn btn-default mt-2 mx-4"
            id="btnEmployeePackageDetailsDelete"
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
                  id="btnEmployeePackageDetailsAdd"
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
      <AddEditPackage
        callBackEvent={() => fetchPackageList()}
        ref={addEditModalRef}
      ></AddEditPackage>
    </>
  );
};

export default EmployeePackageDetails;
