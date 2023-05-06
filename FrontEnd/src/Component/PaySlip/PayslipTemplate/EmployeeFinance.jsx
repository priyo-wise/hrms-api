import React, { useEffect, useRef, useState } from "react";
import Col from "react-bootstrap/esm/Col";
import Container from "react-bootstrap/esm/Container";
import Row from "react-bootstrap/esm/Row";
import { useDispatch } from "react-redux";
import TableComponent from "../../../Services/TableComponent";
import { WebService } from "../../../Services/WebService";
import "../../Static/Static.css";
import { confirm } from "react-confirm-box";
import AddEditFinance from "./AddEditFinance";
import Button from "react-bootstrap/esm/Button";

const FinanceTemplate = () => {
  var dispatch = useDispatch();
  var [data, setData] = useState([]);
  var afterRender = useRef(false);
  const fetchFinanceList = async () => {
    var res = await WebService({ dispatch, endPoint: "FinanceTemplate/Fetch" });
    setData(res);
  };

  const onDelete = async (FinanceId) => {
    const options = {
      labels: {
        confirmable: "Confirm",
        cancellable: "Cancel",
      },
    };
    const result = await confirm("Are you sure you want to delete?", options);
    if (result) {
      await WebService({
        endPoint: `FinanceTemplate/Remove/${FinanceId}`,
        method: "DELETE",
        dispatch,
      });
      fetchFinanceList();
    }
  };

  const addEditModalRef = useRef();
  useEffect(() => {
    if (afterRender.current === false) {
      fetchFinanceList();
    }
    afterRender.current = true;
  }, []);
  const fnEdit = async (id) => await addEditModalRef.current.openModal(id || 0);
  var columns = [
    {
      Text: "Bank Name",
      Value: "BankName",
    },
    {
      Text: "Account Number",
      Value: "BankAccountNo",
    },
    {
      Text: "Name In Account",
      Value: "NameInAccount",
    },
    {
      Text: "IFSC Code",
      Value: "IFSCCode",
    },
    {
      Text: "PF Account No",
      Value: "PFAccountNo",
    },
    {
      Text: "PF UAN No",
      Value: "PFUANNo",
    },
    {
      Text: "Full Name",
      Value: "FullName",
    },
    {
      Text: "Action",
      key: "FinanceId",
      Template: (
        <>
          <button
            className="btn btn-default mt-2 mx-4"
            id="btnEmployeeFinanceEdit"
            onClick={(e) =>
              fnEdit(e.currentTarget.parentElement.getAttribute("data-key"))
            }
          >
            <i className="fa fa-pencil"></i>
          </button>
          <button
            className="btn btn-default mt-2 mx-4"
            id="btnEmployeeFinanceDelete"
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
                <Button id="btnEmployeeFinanceAdd" onClick={() => fnEdit()}>
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
      <AddEditFinance
        callBackEvent={() => fetchFinanceList()}
        ref={addEditModalRef}
      ></AddEditFinance>
    </>
  );
};

export default FinanceTemplate;
