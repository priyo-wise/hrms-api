import React, { forwardRef, useEffect, useRef, useState } from "react";
import Col from "react-bootstrap/esm/Col";
import Container from "react-bootstrap/esm/Container";
import Row from "react-bootstrap/esm/Row";
import { Form, FormInputDropdown, FormInputText, InputText } from "../../Form";
import * as yup from "yup";
import { WebService } from "../../../Services/WebService";
import { useDispatch } from "react-redux";
import _, { each, findWhere, omit } from "underscore";
import { DateTime } from "luxon";
import { useAsyncDebounce } from "react-table";
import Button from "react-bootstrap/Button";
import { useImperativeHandle } from "react";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { Avatar, Divider, Grid, Paper, Table } from "@mui/material";
import { Box } from "@mui/system";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
const AddEditEmpSalaryPackage = forwardRef(({}, ref) => {
  const dispatch = useDispatch();
  const initialDataValue = {
    FromDate: DateTime.local().toSQLDate(),
    ToDate: null,
    TotalEarning: 0,
    TotalDeduction: 0,
    CTC: null,
    SalaryTemplateId: null,
  };
  const [alertState, setAlertState] = React.useState({
    open: false,
    vertical: "bottom",
    horizontal: "right",
  });
  const { vertical, horizontal, open } = alertState;
  const [data, setData] = useState(initialDataValue);
  const [empList, setElpList] = useState([]);
  const [salaryTemplateList, setSalaryTemplateList] = useState([]);
  const [componentList, setComponentList] = useState([]);
  const formRef = useRef();
  const afterRender = useRef(false);
  const requiredMessage = "Field is a required";
  const schema = yup
    .object()
    .shape({
      EmployeeId: yup.string().required(requiredMessage),
      FromDate: yup.date().typeError(requiredMessage).required(requiredMessage),
      ToDate: yup.date().typeError(requiredMessage).notRequired(),
      SalaryTemplateId: yup.string().required(requiredMessage),
      SalaryPaymentFrequency: yup.string().required(requiredMessage),
      CTC: yup.number().typeError(requiredMessage).required(requiredMessage),
    })
    .required();
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setAlertState({ ...alertState, open: false });
  };
  const onSubmit = async (dr) => {
    dr.TotalEarning = data.TotalEarning;
    dr.TotalDeduction = data.TotalDeduction;
    dr.Details = _.map(componentList, (m) =>
      _.pick(
        m,
        "EmployeePackageDetailId",
        "EmployeePackageId",
        "SalaryComponentId",
        "Amount"
      )
    );
    var opt = {
      endPoint: "EmployeePackage",
      dispatch,
      body: dr,
    };
    if ((dr?.EmployeePackageId ?? 0) !== 0) {
      opt.endPoint += `/${dr.EmployeePackageId}`;
      opt.method = "PUT";
    }
    await WebService(opt);
    await fnReset();
    setAlertState({ ...alertState, open: true });
  };
  const fnReset = async (obj) => {
    obj ??= initialDataValue;
    if ((obj?.FromDate ?? null) != null) {
      obj.FromDate = DateTime.fromISO(obj.FromDate).toFormat("yyyy-MM-dd");
    }
    if ((obj?.ToDate ?? null) != null) {
      obj.ToDate = DateTime.fromISO(obj.ToDate).toFormat("yyyy-MM-dd");
    }
    obj.SalaryTemplateId ??=
      salaryTemplateList.length > 0 ? salaryTemplateList[0].value : 0;
    setData(obj);
    await formRef.current.fnReset(omit(obj, "Details"));
    await fetchTemplateComponent(obj.SalaryTemplateId, obj?.Details ?? []);
  };
  const fetchSalaryTemplateList = () => {
    debugger;
    WebService({ endPoint: "SalaryTemplate/Fetch", dispatch }).then(
      (result) => {
        const ddOpt = _.map(result, (m) => {
          return {
            value: m.TemplateId,
            text: m.TemplateName,
          };
        });
        setSalaryTemplateList(ddOpt);
      }
    );
  };
  const fetchEmployeeList = () => {
    WebService({ endPoint: "User/ActiveUserList", dispatch }).then((result) => {
      const empDDOpt = _.map(result, (m) => {
        return {
          value: m.EmployeeId,
          text: m.FullName,
        };
      });
      setElpList(empDDOpt);
    });
  };
  const fetchTemplateComponent = async (templateId, details) => {
    details ??= data?.Details ?? [];
    let result = await WebService({
      dispatch,
      endPoint: `SalaryTemplateComp/ByTemplate/${templateId}`,
    });
    if (result.length > 0 && (details ?? []).length > 0)
      each(result, (m) => {
        m.ManualAmount = findWhere(details ?? [], {
          SalaryComponentId: m.SalaryComponentId,
        })?.Amount;
      });
    setTimeout(() => setComponentList(result));
  };
  const init = () => {
    fetchEmployeeList();
    fetchSalaryTemplateList();
  };
  const roundOf = (num, position) => {
    return (
      Math.round((num + Number.EPSILON) * Math.pow(10, position)) /
      Math.pow(10, 2)
    );
  };
  const claculateValue = (dependValue, e) => {
    dependValue ??= 0;
    e.NumberOrAmount ??= 0;
    if ((e?.Code ?? "") === "Percentage") {
      return roundOf((dependValue * e.NumberOrAmount) / 100, 2);
    } else {
      return roundOf(parseFloat(e.NumberOrAmount), 2);
    }
  };
  const onComponentValueCalculation = () => {
    let comList = JSON.parse(JSON.stringify(componentList));
    _.each(comList, (e) => {
      if ((e.ManualAmount ?? "") === "") {
        if (e.IsDependentOnCTC) {
          e.Amount = claculateValue(data?.CTC, e);
        } else if (e.DependentOnComponentId !== null) {
          var dependAmt =
            _.findWhere(comList, {
              TemplateComponentId: e.DependentOnComponentId,
            })?.Amount ?? 0;
          e.Amount = claculateValue(dependAmt, e);
        } else {
          e.Amount = claculateValue(0, e);
        }
      } else {
        e.Amount = parseFloat(e.ManualAmount);
      }
    });

    if (JSON.stringify(comList) !== JSON.stringify(componentList)) {
      setComponentList(comList);
      var totalEarning = _.reduce(
        _.where(comList, { EarningOrDeductionType: "Earning" }),
        (m, v) => m + v.Amount,
        0
      );
      var totalDeduction = _.reduce(
        _.where(comList, { EarningOrDeductionType: "Deduction" }),
        (m, v) => m + v.Amount,
        0
      );
      setData({
        ...data,
        TotalEarning: roundOf(totalEarning ?? 0, 2),
        TotalDeduction: roundOf(totalDeduction ?? 0, 2),
      });
    }
  };
  const updateManualAmt = useAsyncDebounce((m, v) => {
    const newState = componentList.map((obj) => {
      if (obj.TemplateComponentId === m.TemplateComponentId) {
        return { ...obj, ManualAmount: v };
      }
      return obj;
    });
    setComponentList(newState);
  }, 100);
  const editPackage = async (id = null) => {
    if (id != null) {
      var result = await WebService({
        dispatch,
        endPoint: `EmployeePackage/${id}`,
      });
      await fnReset(result ?? initialDataValue);
    } else {
      await fnReset(initialDataValue);
    }
  };
  useEffect(() => {
    if (!afterRender.current) {
      init();
    }
    afterRender.current = true;
  }, []);
  useEffect(() => {
    if (componentList.length > 0 && (data?.CTC ?? 0) > 0) {
      onComponentValueCalculation();
    }
  }, [componentList, data?.CTC]);
  useEffect(() => {
    if ((data?.SalaryTemplateId ?? "") !== "") {
      fetchTemplateComponent(data?.SalaryTemplateId);
    }
  }, [data?.SalaryTemplateId]);
  useImperativeHandle(ref, () => ({ editPackage }));
  //New Code for Style
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
  const content = (
    <div>
      {`Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus id dignissim justo.
   Nulla ut facilisis ligula. Interdum et malesuada fames ac ante ipsum primis in faucibus.
   Sed malesuada lobortis pretium.`}
    </div>
  );
  //New Code for Style
  return (
    <>
      <Container className="p-4">
        <Form
          defaultValues={data}
          onSubmit={onSubmit}
          validationSchema={schema}
          ref={formRef}
          id="hook-form"
        >
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
              display: { xs: "block", md: "none", lg: "none" },
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
                <Col xs={4} md={2}>
                  <img src="WiseLogoFinal.png" height="100" width="auto" />
                </Col>
                <Col xs={8} md={6}>
                  <h4>Wise Software Solutions Pvt Ltd</h4>
                </Col>
              </Row>

              <Row>
                <Col xs={12} md={12}>
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
              <Row>
                <Col>
                  <FormInputDropdown
                    name="EmployeeId"
                    ddOpt={empList}
                    label="Select Employee"
                    className="form-control"
                    isRequired="true"
                  />
                </Col>
                <Col>
                  <FormInputDropdown
                    name="SalaryTemplateId"
                    ddOpt={salaryTemplateList}
                    label="Select Template"
                    className="form-control"
                    isRequired="true"
                    setValue={(v) => setData({ ...data, SalaryTemplateId: v })}
                  />
                </Col>
              </Row>
              <Row>
                <Col>
                  <FormInputText
                    label="From Date"
                    name="FromDate"
                    type="date"
                    className="form-control"
                    setValue={(dt) => setData({ ...data, FromDate: dt })}
                    isRequired="true"
                    min={DateTime.local().toSQLDate()}
                  />
                </Col>
                <Col>
                  <FormInputText
                    label="To Date"
                    name="ToDate"
                    type="date"
                    className="form-control"
                    isRequired="true"
                    min={data.FromDate || DateTime.local().toSQLDate()}
                  />
                </Col>
              </Row>
              <Row>
                <Col>
                  <FormInputDropdown
                    name="SalaryPaymentFrequency"
                    ddOpt={[
                      { value: "Monthly", text: "Monthly" },
                      { value: "Weekly", text: "Weekly" },
                    ]}
                    label="Payment Frequency"
                    className="form-control"
                    isRequired="true"
                    setValue={(v) =>
                      setData({ ...data, SalaryPaymentFrequency: v })
                    }
                  />
                </Col>
                <Col>
                  <FormInputText
                    label="CTC"
                    name="CTC"
                    type="number"
                    className="form-control"
                    isRequired="true"
                    setValue={(v) => setData({ ...data, CTC: v })}
                  />
                </Col>
              </Row>
            </Paper>
          </Box>
        </Form>

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
                {_.map(
                  _.where(componentList, { EarningOrDeductionType: "Earning" }),
                  (m) => (
                    <>
                      <Row className="square border-end">
                        <Col>{m.EarningOrDeductionName}</Col>
                        <Col>
                          <InputText
                            className="form-control text-end"
                            value={m.Amount}
                            setValue={(v) => updateManualAmt(m, v)}
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
                {_.map(
                  _.where(componentList, {
                    EarningOrDeductionType: "Deduction",
                  }),
                  (m) => (
                    <>
                      <Row>
                        <Col>{m.EarningOrDeductionName}</Col>
                        <Col>
                          <InputText
                            className="form-control text-end"
                            value={m.Amount}
                            setValue={(v) => updateManualAmt(m, v)}
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
              <Col className="square border-end">
                <Row>
                  <Col>
                    <strong>Total Earnings :</strong>
                  </Col>
                  <Col className="text-end">
                    <strong>{data.TotalEarning ?? 0}</strong>
                  </Col>
                </Row>
              </Col>
              <Col>
                <Row>
                  <Col>
                    <strong>Total Deductions :</strong>
                  </Col>
                  <Col className="text-end">
                    <strong>{data.TotalDeduction ?? 0}</strong>
                  </Col>
                </Row>
              </Col>
            </Row>
            <Row>
              <Col>
                <span>
                  <strong>
                    Net pay for the {data.SalaryPaymentFrequency} :{" "}
                  </strong>
                </span>
              </Col>
              <Col className="text-end">
                <span>
                  <strong>
                    {" "}
                    {roundOf(data.TotalEarning - data.TotalDeduction, 2)}
                  </strong>
                </span>
              </Col>
            </Row>
          </Paper>
        </Box>

        <Row className="p-2">
          <div className="text-end">
            <Button variant="danger" type="button" onClick={() => fnReset()}>
              Reset
            </Button>
            <span> </span>
            <Button variant="primary" type="submit" form="hook-form">
              Submit
            </Button>
          </div>
        </Row>
      </Container>
      <Snackbar
        open={open}
        autoHideDuration={3000}
        onClose={handleClose}
        anchorOrigin={{ vertical, horizontal }}
        key={vertical + horizontal}
      >
        <Alert onClose={handleClose} severity="success" sx={{ width: "100%" }}>
          Submitted successfully
        </Alert>
      </Snackbar>
    </>
  );
});

export default AddEditEmpSalaryPackage;
