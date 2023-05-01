import React, { useRef } from "react";
import jsPDF from "jspdf";
import ReportTemplate from "../PaySlip/ReportTemplate";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { WebService } from "../../Services/WebService";
import { useDispatch } from "react-redux";

const { forwardRef, useState, useImperativeHandle } = React;

const ViewDocument = (prop, ref) => {
  const [show, setShow] = useState(false);
  const [data, setData] = useState({ Payslip: {} });
  const dispatch = useDispatch();

  useImperativeHandle(ref, () => ({
    openModal: async (id) => {
      const data = await WebService({
        dispatch,
        endPoint: `Payslip/Fetch/${id || 0}`,
      });
      setData(data);
      setShow(true);
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

  const MyDocument = (
    <div>
      <div ref={reportTemplateRef}>
        <ReportTemplate />
      </div>
    </div>
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
        <Modal.Body>{MyDocument}</Modal.Body>
        <Modal.Footer>
          <Button id="btnPayslipClose" variant="outline-danger" onClick={handleClose}>
            Close
          </Button>
          <Button id="btnDownloadPayslip" onClick={handleGeneratePdf} variant="outline-primary">
            <i class="fa fa-file-pdf-o" aria-hidden="true"></i> Download Payslip
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default forwardRef(ViewDocument);
