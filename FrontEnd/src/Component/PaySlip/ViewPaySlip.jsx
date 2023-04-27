import React, { useRef } from "react";
import jsPDF from "jspdf";
import ReportTemplate from "./ReportTemplate";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { WebService } from "../../Services/WebService";
import { useDispatch } from "react-redux";
import "./Payslip.css";
import { Form, FormInputDropdown, FormInputText } from "../Form";
import * as yup from "yup";
import { DateTime } from "luxon";
import { extendOwn, filter, map, reduce } from "underscore";
import { Alert, Box, Paper } from "@mui/material";
import Row from "react-bootstrap/esm/Row";
import Col from "react-bootstrap/esm/Col";
import IconButton from "@mui/material/IconButton";
import { pink } from "@mui/material/colors";
import { Delete, Edit } from "@mui/icons-material";
import { ActionPermission } from "../PageInfo";
const { forwardRef, useState, useImperativeHandle } = React;

const ViewPaySlip = (prop, ref) => {
  const [show, setShow] = useState(false);
  const [data, setData] = useState({ Payslip: {} });
  const dispatch = useDispatch();

  const [permission] = useState({
    // ManagePublish: ActionPermission("PaySlip - Publish"),
    // ManageSearchAllUser: ActionPermission("PaySlip - Search AllUser"),
    ManageAddPayment: ActionPermission("PaySlip - Add Payment"),
    ManageDeletePayment: ActionPermission("PaySlip - Delete Payment"),
  });

  useImperativeHandle(ref, () => ({
    openModal: async (id) => {
      const data = await WebService({
        dispatch,
        endPoint: `Payslip/View/${id || 0}`,
      });
      setData(data);
      setShow(true);

      console.log("Emp", data);
    },
  }));
  let margin = 18; // narrow margin - 1.27 cm (36);
  const reportTemplateRef = useRef(null);
  const handleGeneratePdf = () => {
    const doc = new jsPDF({
      format: "a4",
      unit: "px",
    });

    // Adding the fonts.
    //doc.setFont('Inter-Regular', 'normal');

    doc.html(reportTemplateRef.current, {
      x: margin + 15,
      y: margin,
      async callback(doc) {
        await doc.save("document");
      },
      html2canvas: { scale: 0.5 },
    });
  };
  const addPayment = async (dr) => {
    extendOwn(dr, { PayslipId: data.PayslipId });
    dr = await WebService({ dispatch, endPoint: "Payslip/Payment", body: dr });
    var paymentDetails = data?.PaymentDetails ?? [];
    paymentDetails.push(dr);
    setData({ ...data, PaymentDetails: paymentDetails });
    formRef.current.fnReset({});
  };
  const roundOf = (num, position) => {
    return (
      Math.round((num + Number.EPSILON) * Math.pow(10, position)) /
      Math.pow(10, 2)
    );
  };
  const totalDueAmt = () =>
    roundOf(
      (data?.NetSalary ?? 0) -
        (reduce(
          data?.PaymentDetails ?? [],
          (m, v) => m + parseFloat(v?.PaidAmount ?? "0"),
          0
        ) ?? 0),
      2
    );
  const requiredMessage = "Value is required";
  const schema = yup
    .object()
    .shape({
      PaymentTrasactionNo: yup.string().required(requiredMessage),
      PaymentDate: yup
        .date()
        .label("Payment Date")
        .typeError("Enter valid date")
        .required(requiredMessage)
        .when([], (_, passSchema) =>
          passSchema.min(DateTime.fromISO(data.ToDate).toFormat("yyyy-MM-dd"))
        ),
      PaidAmount: yup
        .number()
        .label("Paid Amount")
        .typeError(requiredMessage)
        .required(requiredMessage)
        .min(1)
        .when([], (_, passSchema) => passSchema.max(totalDueAmt())),
    })
    .required();

  const formRef = useRef();
  const MyDocument = (
    <div>
      <div ref={reportTemplateRef}>
        <ReportTemplate data={data} />
      </div>
    </div>
  );
  const fnRemove = async (obj) => {
    await WebService({
      dispatch,
      endPoint: `Payslip/Payment/${obj.EmployeePayslipPaymentId}`,
      method: "DELETE",
    });
    setData({
      ...data,
      PaymentDetails: filter(
        data?.PaymentDetails ?? [],
        (f) => f.EmployeePayslipPaymentId !== obj.EmployeePayslipPaymentId
      ),
    });
  };
  const boxCommonStyles = {
    "& > :not(style)": {
      m: 1,
    },
  };
  const commonStyles = {
    border: 1,
    borderBottom: 1,
    borderColor: "#A6A6A6",
    p: 2,
  };
  const displayDateFormat = (dt, format) => {
    if (dt === undefined || dt === null) return null;
    return DateTime.fromISO(dt).toFormat(format);
  };
  const Payment = (
    <>
      <Box
        sx={{
          ...boxCommonStyles,
        }}
      >
        <Paper
          square
          elevation={0}
          sx={{
            ...commonStyles,
            p: 0,
          }}
        >
          <Alert severity="info" sx={{}}>
            Transaction Details
          </Alert>
          <Row className="mb-2 px-3">
            <Col md={3} className="square border-bottom">
              Date
            </Col>
            <Col md={3} className="square border-bottom">
              Trasaction No
            </Col>
            <Col md={2} className="square border-bottom">
              Method
            </Col>
            <Col className="square border-bottom text-end">Amount</Col>
            {permission.ManageDeletePayment && (
              <Col md={1} className="square border-bottom text-end">
                Action
              </Col>
            )}
          </Row>
          {map(data?.PaymentDetails ?? [], (m, i) => (
            <Row className="px-3">
              <Col md={3}>{displayDateFormat(m.PaymentDate, "dd-MM-yyyy")}</Col>
              <Col md={3}>{m.PaymentTrasactionNo}</Col>
              <Col md={2}>{m.PaymentMethod}</Col>
              <Col className="text-end">{m.PaidAmount}</Col>
              {permission.ManageDeletePayment && (
                <Col md={1} className="text-end">
                  {" "}
                  <IconButton
                    size="small"
                    sx={{ color: pink[500] }}
                    onClick={() => fnRemove(m)}
                    id={`btn_delete_${i}`}
                  >
                    <Delete fontSize="small" />
                  </IconButton>
                </Col>
              )}
            </Row>
          ))}
        </Paper>
      </Box>

      {permission.ManageAddPayment && totalDueAmt() > 0 && (
        <Box
          sx={{
            ...boxCommonStyles,
          }}
        >
          <Paper
            square
            elevation={0}
            sx={{
              ...commonStyles,
            }}
          >
            <Form
              defaultValues={{}}
              onSubmit={addPayment}
              validationSchema={schema}
              ref={formRef}
            >
              <Row>
                <Col>
                  <FormInputText
                    name="PaymentDate"
                    type="date"
                    min={DateTime.fromISO(data.ToDate).toFormat("yyyy-MM-dd")}
                    label="Payment Date"
                  />
                </Col>
                <Col>
                  {" "}
                  <FormInputText
                    label="Transaction No."
                    name="PaymentTrasactionNo"
                    type="text"
                  />
                </Col>
              </Row>
              <Row>
                <Col>
                  <FormInputDropdown
                    label="Method"
                    name="PaymentMethod"
                    ddOpt={[
                      { value: "NEFT", text: "NEFT" },
                      { value: "Cash", text: "Cash" },
                    ]}
                  />
                </Col>
                <Col>
                  {" "}
                  <FormInputText
                    label="Amount"
                    type="number"
                    name="PaidAmount"
                  />
                </Col>
              </Row>
              <Row>
                <Col></Col>
                <Col className="text-end">
                  {" "}
                  <Button type="submit">Submit</Button>
                </Col>
              </Row>
            </Form>
          </Paper>
        </Box>
      )}
      <p className="text-center italic">
        *This is machine generated payslip and doesn't require signature
      </p>
    </>
  );
  const handleClose = () => setShow(false);

  return (
    <>
      <Modal
        show={show}
        onHide={handleClose}
        size={"lg"}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Pay Slip</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {MyDocument}
          {(data?.StatusId ?? 0) == 7 && Payment}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-danger" onClick={handleClose}>
            Close
          </Button>
          <Button onClick={handleGeneratePdf} variant="outline-primary">
            <i class="fa fa-file-pdf-o" aria-hidden="true"></i> Download Payslip
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default forwardRef(ViewPaySlip);
