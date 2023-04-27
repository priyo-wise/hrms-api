import React, { useEffect, useRef } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { WebService } from "../../../Services/WebService";
import {
  Form,
  FormInputText,
  FormInputDropdown,
  FormCheckRadioInput,
} from "../../Form";
import * as yup from "yup";
import { useDispatch } from "react-redux";
import "./../Payslip.css";
import _, {
  drop,
  extendOwn,
  filter,
  map,
  omit,
  result,
  sortBy,
} from "underscore";

const { forwardRef, useState, useImperativeHandle } = React;
const AddEditTemplate = (prop, ref) => {
  const [show, setShow] = useState(false);
  const [data, setData] = useState({ Payslip: {} });
  const [checked, setChecked] = useState(true);
  const [projects, setProjects] = useState([{ value: 0, text: "" }]);
  const afterRender = useRef(false);
  const formRef = useRef();
  const dispatch = useDispatch();
  useImperativeHandle(ref, () => ({
    openModal: async (id) => {
      const data = await WebService({
        dispatch,
        endPoint: `SalaryTemplateComp/Fetch/${id || 0}`,
      });
      await fetchTemplateComponent(
        data?.component?.TemplateId ?? 0,
        data?.component?.SalaryComponentId ?? 0
      );
      data.salary = data.salary.map((v) => {
        return {
          value: v.TemplateId,
          text: v.TemplateName,
        };
      });
      data.static = data.static.map((v) => {
        return {
          value: v.SalaryComponentsId,
          text: v.EarningOrDeductionName,
        };
      });
      data.calculation = data.calculation.map((v) => {
        return {
          value: v.CalculationMethodId,
          text: v.CalculationMethod,
        };
      });
      data.TemplateComponentId = data.component.TemplateComponentId;
      data.NumberOrAmount = data.component.NumberOrAmount;
      data.CalculationMethodId = data.component.CalculationMethodId;
      data.SalaryComponentId = data.component.SalaryComponentId;
      data.TemplateId = data.component.TemplateId;
      data.IsDependentOnCTC = data.component.IsDependentOnCTC == 1;
      data.DependentOnComponentId = data.component.DependentOnComponentId;
      setData(data);
      setShow(true);
    },
  }));

  // useEffect(() => {
  //   if (!afterRender.current) {
  //     fetchTemplateComponent();
  //   }
  //   afterRender.current = true;
  // }, []);
  const [componentDependentOptions, setComponentDependentOptions] = useState(
    []
  );
  const fetchTemplateComponent = async (
    TemplateId = null,
    SalaryComponentId = data?.SalaryComponentId
  ) => {
    if ((data?.salary ?? []).length > 0) TemplateId ??= data.salary[0].value;
    if ((data?.static ?? []).length > 0)
      SalaryComponentId ??= data.static[0].value;
    var s1 = await WebService({
      dispatch,
      endPoint: `SalaryTemplateComp/FetchDepend/${TemplateId ?? 0}`,
    }).then((c) => {
      var a1 = filter(
        c ?? [],
        (f) => f.SalaryComponentId != (SalaryComponentId ?? 0)
      );
      return map(a1, (m) => {
        return {
          value: m.TemplateComponentId,
          text: m.EarningOrDeductionName,
        };
      });
    });
    setComponentDependentOptions(s1);
  };
  const handleClose = () => setShow(false);
  const requiredMessage = "This is a required field";
  const schema = yup
    .object()
    .shape({
      TemplateId: yup.string().trim().required(requiredMessage),
      SalaryComponentId: yup.string().trim().required(requiredMessage),
      CalculationMethodId: yup.string().trim().required(requiredMessage),
      NumberOrAmount: yup
        .number()
        .label("Value")
        .typeError("Invalid value")
        .required(requiredMessage)
        .min(0)
        .when(["CalculationMethodId"], (methodId, passSchema) => {
          if (methodId.length > 0 && methodId[0] == 1) {
            return passSchema.max(100);
          } else {
            return passSchema;
          }
        }),
    })
    .required();
  const onSubmit = async (data) => {
    data.IsDependentOnCTC = data?.IsDependentOnCTC ?? false ? 1 : 0;
    data = omit(data, ["salary", "static", "component", "calculation"]);
    let endPoint = "SalaryTemplateComp";
    let method = "POST";
    if ((data.TemplateComponentId ?? 0) !== 0) {
      endPoint = `SalaryTemplateComp/${data.TemplateComponentId}`;
      method = "PUT";
    }
    await WebService({ dispatch, endPoint, body: data, method });
    // console.log(JSON.stringify(data));
    handleClose();
    prop.callBackEvent();
  };
  // useEffect(()=>{
  //   if(show==false){
  //     setComponentDependentOptions([]);
  //   }
  // },[show]);
  var dependent = !(data?.IsDependentOnCTC ?? false) ? (
    <div className="col-md-6">
      <FormInputDropdown
        name="DependentOnComponentId"
        ddOpt={componentDependentOptions ?? []}
        label="Dependent On"
      ></FormInputDropdown>
    </div>
  ) : (
    ""
  );
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
          {(data.TemplateComponentId || 0) === 0
            ? "Add Salary Template Component"
            : "Edit Salary Template Component"}
        </Modal.Title>
      </Modal.Header>
      <Form
        ref={formRef}
        defaultValues={data}
        onSubmit={onSubmit}
        validationSchema={schema}
      >
        <Modal.Body className="p-4">
          <div className="row">
            <div className="col-md-6">
              <FormInputDropdown
                name="TemplateId"
                ddOpt={data.salary}
                label="Template Name"
                isRequired="true"
                setValue={async (v) => {
                  setData({ ...data, TemplateId: v });
                  await fetchTemplateComponent(v);
                }}
              ></FormInputDropdown>
            </div>
            <div className="col-md-6">
              <FormInputDropdown
                name="SalaryComponentId"
                ddOpt={data.static}
                label="Component Name"
                isRequired="true"
                setValue={async (v) => {
                  setData({ ...data, SalaryComponentId: v });
                  await fetchTemplateComponent(data.TemplateId, v);
                }}
              ></FormInputDropdown>
            </div>
            <div className="col-md-6">
              <FormInputDropdown
                name="CalculationMethodId"
                ddOpt={sortBy(data.calculation, (f) => f.text)}
                label="Calculation Method"
                isRequired="true"
                setValue={(v) => {
                  var val = { CalculationMethodId: v, NumberOrAmount: null };
                  if (v == 2 && (data?.IsDependentOnCTC ?? false) != false) {
                    extendOwn(val, { IsDependentOnCTC: false });
                  } else if ((data?.IsDependentOnCTC ?? false) != true) {
                    extendOwn(val, { IsDependentOnCTC: true });
                  }
                  setData({ ...data, ...val });
                  formRef.current.fnReset({ ...data, ...val });
                }}
              ></FormInputDropdown>
            </div>
            <div className="col-md-6">
              <FormInputText
                label="Number/Amount"
                name="NumberOrAmount"
                type="number"
                isRequired="true"
                value={data?.NumberOrAmount ?? 0}
                setValue={(v) => setData({ ...data, NumberOrAmount: v })}
              />
            </div>
            {(data?.CalculationMethodId ??
              ((data?.calculation ?? []).length > 0
                ? data.calculation[0]["value"]
                : null)) == 1 && (
              <>
                <div className="col-md-6">
                  <FormCheckRadioInput
                    label="Dependent On CTC"
                    name="IsDependentOnCTC"
                    isRequired="true"
                    isRadio={false}
                    value={data?.IsDependentOnCTC ?? false}
                    setValue={(v) => {
                      setData({ ...data, IsDependentOnCTC: v });
                    }}
                  />
                </div>
                {dependent}
              </>
            )}
          </div>
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
            {(data.TemplateComponentId || 0) === 0 ? "Submit" : "Save Changes"}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default forwardRef(AddEditTemplate);
