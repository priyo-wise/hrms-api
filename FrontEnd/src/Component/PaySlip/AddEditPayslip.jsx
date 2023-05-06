import React, {
  useEffect,
  useRef,
  forwardRef,
  useState,
  useImperativeHandle,
} from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { WebService } from "../../Services/WebService";
import { Form, FormInputText, FormInputDropdown, InputText } from "../Form";
import * as yup from "yup";
import { useDispatch } from "react-redux";
import "./Payslip.css";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import {
  each,
  extend,
  findWhere,
  map,
  mapObject,
  omit,
  reduce,
  where,
} from "underscore";
import { DateTime } from "luxon";
import { Box, Paper } from "@mui/material";

const AddEditPayslip = (prop, ref) => {
  const [show, setShow] = useState(false);
  const [empList, setEmpList] = useState([]);
  const [componentList, setComponentList] = useState([]);
  const [payslipData, setPayslipData] = useState({});
  const [calculationDays, setCalculationDays] = useState({});
  const [total, setTotal] = useState({});
  const dispatch = useDispatch();
  const formRef = useRef();
  const fetchExistingPayslip = async (id = 0) => {
    var data = await WebService({
      dispatch,
      endPoint: `Payslip/Fetch/${id || 0}`,
    }).then((d) =>
      mapObject(d, (value, key) => {
        if (key == "FromDate" || key == "ToDate")
          return DateTime.fromISO(value).toFormat("yyyy-MM-dd");
        return value;
      })
    );
    setPayslipData(omit(data, ["GrossSalary", "TotalDeductions", "NetSalary"]));
    setTotal({
      totalEarning: data?.GrossSalary,
      totalDeduction: data?.TotalDeductions,
      netAmount: data?.NetSalary,
    });
  };
  const fetchUsers = async () => {
    const empDDOpt = await WebService({
      endPoint: "User/ActiveUserList",
      dispatch,
    }).then((result) =>
      map(result, (m) => {
        return {
          value: m.EmployeeId,
          text: m.FullName,
        };
      })
    );
    setEmpList(empDDOpt);
  };
  useImperativeHandle(ref, () => ({
    openModal: async (id) => {
      await fetchUsers();
      await fetchExistingPayslip(id);
      setShow(true);
    },
  }));
  const handleClose = () => setShow(false);
  const requiredMessage = "This is a required field";
  const ratingRangeErrorMessage = "Range between 1 to 5";
  const NumericvaluesError = "Please Insert Numeric values";
  const WorkingdayError = "Please insert days less then working days";
  const schema = yup
    .object()
    .shape({
      TotalWorkingDays: yup
        .number()
        .typeError(NumericvaluesError)
        .min(1, requiredMessage)
        .max(31, requiredMessage)
        .required(requiredMessage),
      EmployeeId: yup.string().required(requiredMessage),
      FromDate: yup
        .date()
        .typeError("Enter valid date")
        .required(requiredMessage)
        .max("9999-12-31", "Please select valid date"),
      // PaymentDate: yup
      //   .date()
      //   .typeError("Enter valid date")
      //   .required(requiredMessage),
      ToDate: yup
        .date()
        .typeError("Enter valid date")
        .required(requiredMessage)
        .max("9999-12-31", "Please select valid date"),
      IncludeKRAScoreInPayslip: yup
        .number()
        .typeError(requiredMessage)
        .required(requiredMessage)
        .min(1, ratingRangeErrorMessage)
        .max(5, ratingRangeErrorMessage),
      UnpaidAbsenceDays: yup
        .number()
        .typeError(NumericvaluesError)
        .nullable(true)
        .min(0, requiredMessage)
        .when("TotalWorkingDays", (days, passSchema) =>
          (days ?? 0) === 0 ? passSchema : passSchema.max(days, WorkingdayError)
        ),
    })
    .required();
  const onSubmit = async (data) => {
    const body = extend(omit(data, "PaymentDate", "PayslipId"), {
      GrossSalary: total.totalEarning,
      TotalDeductions: total.totalDeduction,
      NetSalary: total.netAmount,
      employeepayslipcomponents: map(componentList, (m) => {
        return {
          SalaryComponentId: m.SalaryComponentId,
          CalculatedAmount: m.ManualValue ?? m.CalculatedValue ?? m.Amount,
        };
      }),
    });
    let opt = { endPoint: "Payslip", dispatch, body };
    if ((data?.PayslipId ?? 0) != 0) {
      opt.endPoint += `/${data.PayslipId}`;
      opt.method = "PUT";
    }
    await WebService(opt);
    handleClose();
    prop.callBackEvent();
  };
  const fnComponentFetch = async (date, empId) => {
    const data = await WebService({
      dispatch,
      endPoint: `Payslip/Component/${empId}/${date}`,
    }).then((d) =>
      (payslipData?.Details ?? []).length == 0
        ? d
        : map(d, (m) =>
            extend(m, {
              ManualValue: findWhere(payslipData?.Details ?? [], {
                SalaryComponentId: m.SalaryComponentId,
              })?.CalculatedAmount,
            })
          )
    );
    setComponentList(data);
    setPayslipData({ ...payslipData, Details: [] });
    console.log(data);
  };
  const roundOf = (num, position) => {
    return (
      Math.round((num + Number.EPSILON) * Math.pow(10, position)) /
      Math.pow(10, 2)
    );
  };
  useEffect(() => {
    if (
      (payslipData?.FromDate ?? null) != null &&
      (payslipData?.EmployeeId ?? null) != null
    ) {
      fnComponentFetch(payslipData?.FromDate, payslipData?.EmployeeId);
    } else {
      setComponentList([]);
    }
  }, [payslipData?.FromDate, payslipData?.EmployeeId]);
  useEffect(() => {
    if (
      (payslipData?.FromDate ?? null) != null &&
      (payslipData?.ToDate ?? null) != null
    ) {
      var i1 = DateTime.fromISO(payslipData?.FromDate),
        i2 = DateTime.fromISO(payslipData?.ToDate).plus({ days: 1 });
      var diff = i2.diff(i1, ["days", "hours"]).toObject();
      payslipData.TotalWorkingDays = diff.days;
      setPayslipData(payslipData);
      formRef.current.fnReset(payslipData);
    }
  }, [payslipData?.FromDate, payslipData?.ToDate]);
  useEffect(() => {
    if (
      (payslipData?.FromDate ?? null) != null &&
      (payslipData?.ToDate ?? null) != null &&
      (payslipData?.TotalWorkingDays ?? 0) != 0
    ) {
      const totalDays = DateTime.fromSQL(payslipData.FromDate).daysInMonth;
      const workingDays =
        (payslipData?.TotalWorkingDays ?? 0) -
        (payslipData?.UnpaidAbsenceDays ?? 0);
      setCalculationDays({ totalDays, workingDays });
    }
  }, [
    payslipData?.FromDate,
    payslipData?.ToDate,
    payslipData?.TotalWorkingDays,
    payslipData?.UnpaidAbsenceDays,
  ]);
  useEffect(() => {
    if (
      (calculationDays?.totalDays ?? 0) != 0 &&
      (calculationDays?.workingDays ?? -1) != -1 &&
      componentList.length > 0
    ) {
      var temp = JSON.parse(JSON.stringify(componentList));
      each(temp, (m) => {
        if ((m.Amount ?? 0) > 0) {
          m.CalculatedValue = roundOf(
            (m.Amount / calculationDays.totalDays) *
              calculationDays.workingDays,
            2
          );
        } else {
          m.CalculatedValue = 0;
        }
      });
      if (JSON.stringify(temp) != JSON.stringify(componentList)) {
        setComponentList(temp);
      }
    }
  }, [calculationDays, componentList]);
  useEffect(() => {
    totalValueCalculation();
  }, [componentList]);
  const totalValueCalculation = (dataList = componentList) => {
    var totalEarning = roundOf(
      reduce(
        where(dataList, { EarningOrDeductionType: "Earning" }),
        (m, v) =>
          m + parseFloat(v.ManualValue ?? v.CalculatedValue ?? v.Amount),
        0
      ),
      2
    );
    var totalDeduction = roundOf(
      reduce(
        where(componentList, { EarningOrDeductionType: "Deduction" }),
        (m, v) =>
          m + parseFloat(v.ManualValue ?? v.CalculatedValue ?? v.Amount),
        0
      ),
      2
    );
    var netAmount = roundOf(totalEarning - totalDeduction, 2);
    setTotal({ totalEarning, totalDeduction, netAmount });
  };
  const updateAmtByUserEnty = (value, toObject) => {
    setComponentList(
      map(componentList, (obj) => {
        if (obj.SalaryComponentId == toObject.SalaryComponentId) {
          if (value == "") value = null;
          else value = parseFloat(value);
          return { ...obj, ManualValue: value };
        } else {
          return obj;
        }
      })
    );
  };
  const commonStyles = {
    border: 1,
    borderBottom: 1,
    borderColor: "primary.main",
    p: 2,
  };

  const boxCommonStyles = {
    "& > :not(style)": {
      m: 1,
    },
  };
  return (
    <Modal
      size="lg"
      aria-labelledby="contained-modal-title-vcenter "
      centered
      show={show}
      onHide={handleClose}
      className="container-fluid"
    >
      <Modal.Header closeButton>
        <Modal.Title>
          {(payslipData.PayslipId || 0) === 0 ? "Add Payslip" : "Edit Payslip"}
        </Modal.Title>
      </Modal.Header>
      <Form
        defaultValues={payslipData}
        onSubmit={onSubmit}
        validationSchema={schema}
        ref={formRef}
      >
        <Modal.Body>
          <Box
            sx={{
              ...boxCommonStyles,
              display: "flex",
              alignItems: "center",
              display: {
                xs: "none",
                md: "block",
                lg: "block",
              },
            }}
          >
            <Paper
              square
              elevation={0}
              sx={{
                ...commonStyles,
              }}
            >
              <Row
                sx={{
                  alignItems: "center",
                }}
              >
                <Col xs={4} md={2}>
                  <img src="WiseLogoFinal.png" height="100" width="auto" />
                </Col>
                <Col xs={8} md={10}>
                  <h4>Wise Software Solutions Pvt Ltd</h4>

                  <h6>
                    B209, Shubh City, Palda, RTO Road, Indore - 452020, Madhya
                    Pradesh, India, Ph: +91-8217643532
                  </h6>
                </Col>
              </Row>
            </Paper>
          </Box>
          <Box
            sx={{
              ...boxCommonStyles,
            }}
          >
            <Paper square elevation={0} sx={{ ...commonStyles }}>
              <div className="row">
                <div className="col-md-6">
                  <FormInputText
                    label="From Date"
                    name="FromDate"
                    type="date"
                    setValue={(v) =>
                      setPayslipData({ ...payslipData, FromDate: v })
                    }
                    max={
                      (payslipData?.ToDate ?? "") == "2999-12-31"
                        ? undefined
                        : payslipData.ToDate
                    }
                    min={
                      (payslipData?.ToDate ?? "") == ""
                        ? undefined
                        : DateTime.fromSQL(payslipData.ToDate)
                            .startOf("month")
                            .toFormat("yyyy-MM-dd")
                    }
                    pattern="[0-8]{4}"
                  />
                </div>
                <div className="col-md-6">
                  <FormInputText
                    label="To Date"
                    name="ToDate"
                    isRequired="true"
                    type="date"
                    setValue={(v) =>
                      setPayslipData({ ...payslipData, ToDate: v })
                    }
                    min={
                      (payslipData?.FromDate ?? "") == ""
                        ? undefined
                        : payslipData.FromDate
                    }
                    max={
                      (payslipData?.FromDate ?? "") == ""
                        ? undefined
                        : DateTime.fromSQL(payslipData.FromDate)
                            .endOf("month")
                            .toFormat("yyyy-MM-dd")
                    }
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-md-6">
                  <FormInputDropdown
                    name="EmployeeId"
                    ddOpt={empList}
                    className="form-control"
                    label="Employee"
                    setValue={(v) =>
                      setPayslipData({ ...payslipData, EmployeeId: v })
                    }
                  ></FormInputDropdown>
                </div>
                <div className="col-md-6">
                  <FormInputText
                    label="KRA Score"
                    name="IncludeKRAScoreInPayslip"
                    type="number"
                    isRequired="true"
                    min={1}
                    max={5}
                  />
                </div>
                {/* <div className="col-md-6">
              <FormInputText
                label="Payment Date"
                name="PaymentDate"
                type="date"
                setValue={(v) =>
                  setPayslipData({ ...payslipData, PaymentDate: v })
                }
              />
            </div> */}
              </div>
              <div className="row">
                <div className="col-md-6">
                  <FormInputText
                    label="Total Working Days"
                    name="TotalWorkingDays"
                    type="number"
                    isRequired="true"
                    setValue={(v) =>
                      setPayslipData({ ...payslipData, TotalWorkingDays: v })
                    }
                  />
                </div>
                <div className="col-md-6">
                  <FormInputText
                    label="Not Working Days"
                    name="UnpaidAbsenceDays"
                    type="number"
                    isRequired="true"
                    setValue={(v) =>
                      setPayslipData({ ...payslipData, UnpaidAbsenceDays: v })
                    }
                    min={0}
                  />
                </div>
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
                borderColor: "error.main",
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
                  {map(
                    where(componentList, { EarningOrDeductionType: "Earning" }),
                    (m) => (
                      <>
                        <Row className="square border-end">
                          <Col>{m.EarningOrDeductionName}</Col>
                          <Col>
                            <InputText
                              className="text-end"
                              value={
                                m.ManualValue ?? m.CalculatedValue ?? m.Amount
                              }
                              setValue={(v) => updateAmtByUserEnty(v, m)}
                              type="number"
                              id={`txt_earning_from_${m.EarningOrDeductionName.replace(
                                " ",
                                "_"
                              )}`}
                            ></InputText>
                          </Col>
                        </Row>
                      </>
                    )
                  )}
                </Col>
                <Col>
                  {map(
                    where(componentList, {
                      EarningOrDeductionType: "Deduction",
                    }),
                    (m) => (
                      <>
                        <Row>
                          <Col>{m.EarningOrDeductionName}</Col>
                          <Col>
                            <InputText
                              className="text-end"
                              value={
                                m.ManualValue ?? m.CalculatedValue ?? m.Amount
                              }
                              setValue={(v) => updateAmtByUserEnty(v, m)}
                              type="number"
                              id={`txt_deduction_by_${m.EarningOrDeductionName.replace(
                                " ",
                                "_"
                              )}`}
                            ></InputText>
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
                <Col>
                  <Row>
                    <div>
                      <Col>
                        <InputText
                          className="text-end"
                          label="Net Salary"
                          name="NetSalary"
                          type="number"
                          value={total.netAmount}
                        />
                      </Col>
                    </div>
                  </Row>
                  <Row>
                    <Col>
                      <InputText
                        className="text-end"
                        label="Gross Salary"
                        name="GrossSalary"
                        type="number"
                        value={total.totalEarning}
                      />
                    </Col>
                  </Row>
                </Col>
                <Col>
                  <Row>
                    <div>
                      <Col>
                        <InputText
                          className="text-end"
                          label="Total Deduction"
                          name="TotalDeductions"
                          type="number"
                          value={total.totalDeduction}
                        />
                      </Col>
                    </div>
                  </Row>
                </Col>
              </Row>
            </Paper>
          </Box>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="outline-danger"
            className="me-4"
            onClick={handleClose}
          >
            Close
          </Button>
          <Button variant="outline-primary" type="submit">
            {(payslipData.PayslipId || 0) === 0 ? "Submit" : "Save Changes"}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default forwardRef(AddEditPayslip);
