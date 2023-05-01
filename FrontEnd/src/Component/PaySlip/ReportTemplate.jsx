import { Alert, Paper } from "@mui/material";
import { Box } from "@mui/system";
import Col from "react-bootstrap/esm/Col";
import Row from "react-bootstrap/esm/Row";
import _, { each, findWhere, omit } from "underscore";
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
const ReportTemplate = (props) => {
  return (
    <>
      <Row>
        <Col width="10%" md={3}>
          <img src="WiseLogoFinal.png" height="100" width="auto" />
        </Col>
        <Col md={9}>
          <div className="text-center">
            <h4>Wise Software Solutions Pvt Ltd</h4>

            <p className="text-center m-0 p-0">
              B209, Shubh City, Palda, RTO Road, Indore - 452020, Madhya
              Pradesh, India
            </p>
            <p className="m-0 p-0">Ph: +91-8217643532</p>
          </div>
        </Col>
      </Row>
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
            Payslip for the Month of : {props.data.PayMonth}
          </Alert>
          <div className="p-3">
            <Row>
              <Col md={6}>
                <Row className="square border-end">
                  <Col md={6}>Name</Col>
                  <Col md={6}>{props.data.FullName}</Col>
                </Row>
              </Col>
              <Col md={6}>
                <Row>
                  <Col md={6}>Employee Code</Col>
                  <Col md={6}>{props.data.EmployeeCode}</Col>
                </Row>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Row className=" square border-end">
                  <Col md={6}>Joining Date</Col>
                  <Col md={6}>{props.data.DOJ}</Col>
                </Row>
              </Col>
              <Col md={6}>
                <Row>
                  <Col md={6}>Bank Name</Col>
                  <Col md={6}>{props.data.BankName}</Col>
                </Row>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Row className=" square border-end">
                  <Col md={6}>Designation</Col>
                  <Col md={6}>{props.data.Designation}</Col>
                </Row>
              </Col>
              <Col md={6}>
                <Row>
                  <Col md={6}>Bank Account No</Col>
                  <Col md={6}>{props.data.BankAccountNo}</Col>
                </Row>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Row className=" square border-end">
                  <Col md={6}>Department</Col>
                  <Col md={6}>{props.data.Department}</Col>
                </Row>
              </Col>
              <Col md={6}>
                <Row>
                  <Col md={6}>PF No</Col>
                  <Col md={6}>{props.data.PFAccountNo}</Col>
                </Row>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Row className=" square border-end">
                  <Col md={6}>Location</Col>
                  <Col md={6}>Indore</Col>
                </Row>
              </Col>
              <Col md={6}>
                <Row>
                  <Col md={6}>PF UAN</Col>
                  <Col md={6}>{props.data.PFUANNo}</Col>
                </Row>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Row className=" square border-end">
                  <Col md={6}>Effective Days</Col>
                  <Col md={6}>{props.data.TotalWorkingDays}</Col>
                </Row>
              </Col>
              <Col md={6}>
                <Row>
                  <Col md={6}>PAN No</Col>
                  <Col md={6}>{props.data.PFUANNo}</Col>
                </Row>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Row className=" square border-end">
                  <Col md={6}>Leave without Pay</Col>
                  <Col md={6}>0</Col>
                </Row>
              </Col>
              <Col md={6}>
                <Row>
                  <Col md={6}>Month</Col>
                  <Col md={6}>{props.data.PayMonth}</Col>
                </Row>
              </Col>
            </Row>
          </div>
        </Paper>
      </Box>
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
          <Row>
            <Col md={6} className="text-center square border-end">
              <strong> Earnings</strong>
            </Col>
            <Col md={6} className="text-center bg-color:red">
              <strong>Deduction</strong>
            </Col>
          </Row>
        </Paper>
        <Paper
          square
          elevation={0}
          sx={{
            ...commonStyles,
          }}
        >
          <Row>
            <Col>
              {_.map(
                _.where(props.data.Components, {
                  EarningOrDeductionType: "Earning",
                }),
                (m) => (
                  <>
                    <Row className="square border-end">
                      <Col md={8}>{m.EarningOrDeductionName}</Col>
                      <Col md={1} className="text-end">
                        ₹
                      </Col>
                      <Col md={3} className="text-end">
                        {m.CalculatedAmount}
                      </Col>
                    </Row>
                  </>
                )
              )}
            </Col>
            <Col>
              {_.map(
                _.where(props.data.Components, {
                  EarningOrDeductionType: "Deduction",
                }),
                (m) => (
                  <>
                    <Row>
                      <Col md={8}>{m.EarningOrDeductionName}</Col>
                      <Col md={1} className="text-end">
                        ₹
                      </Col>
                      <Col md={3} className="text-end">
                        {m.CalculatedAmount}
                      </Col>
                    </Row>
                  </>
                )
              )}
            </Col>
          </Row>
        </Paper>
      </Box>

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
          <Row>
            <Col className="square border-end">
              <Row>
                <Col>
                  <strong>Total Earnings :</strong>
                </Col>
                <Col className="text-end">
                  <strong>{props.data.GrossSalary}</strong>
                </Col>
              </Row>
            </Col>
            <Col>
              <Row>
                <Col>
                  <strong>Total Deductions :</strong>
                </Col>
                <Col className="text-end">
                  <strong>{props.data.TotalDeductions}</strong>
                </Col>
              </Row>
            </Col>
          </Row>
          <Row>
            <Col className="fw-bold square border-end">Net pay for the:</Col>
            <Col className="text-end">
              <span>
                <strong> {props.data.NetSalary}</strong>
              </span>
            </Col>
          </Row>
        </Paper>
      </Box>
    </>
  );
};

export default ReportTemplate;
