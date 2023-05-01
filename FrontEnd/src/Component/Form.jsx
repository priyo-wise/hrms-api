import React, {
  createContext,
  forwardRef,
  useContext,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import {
  useForm,
  useFormContext,
  FormProvider,
  Controller,
  useFieldArray,
} from "react-hook-form";
import { useAsyncDebounce } from "react-table";
import BootstrapForm from "react-bootstrap/Form";
import { ErrorMessage } from "@hookform/error-message";
import "../asset/Form.css";
import { yupResolver } from "@hookform/resolvers/yup";
import _ from "underscore";
import Button from "@mui/material/Button";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import Col from "react-bootstrap/esm/Col";
import InputGroup from "react-bootstrap/InputGroup";
import { DateTime } from "luxon";

export const Context = createContext(null);

export const ComposableContext = ({ children, ...otherProps }) => {
  const context = useContext(Context);
  return (
    <Context.Provider {...context} value={{ ...context, ...otherProps }}>
      {children}
    </Context.Provider>
  );
};

export const Form = forwardRef(
  ({ defaultValues, children, onSubmit, validationSchema, ...rest }, ref) => {
    const methods = useForm({
      defaultValues,
      mode: "onChange",
      resolver: yupResolver(validationSchema),
    });

    useEffect(() => {
      const firstError = Object.keys(methods.formState.errors).reduce(
        (field, a) => {
          return !!methods.formState.errors[field] ? field : a;
        },
        null
      );
      if (firstError) {
        methods.setFocus(firstError);
      }
    }, [methods.formState.errors, methods.setFocus]);
    useImperativeHandle(
      ref,
      () => ({
        fnReset: (data) => {
          methods.reset(data);
        },
      }),
      []
    );
    const fnSubmit = (data) => {
      var x1 = _.mapObject(data, (value, key) => {
        if ((value ?? "") === "") return null;
        return value;
      });
      onSubmit(x1);
    };
    return (
      <FormProvider {...methods}>
        <BootstrapForm
          onSubmit={methods.handleSubmit((d) => fnSubmit(d))}
          {...rest}
          className="needs-validation"
          noValidate
        >
          {children}
        </BootstrapForm>
      </FormProvider>
    );
  }
);

export const FormCheckRadioInput = ({ name, setValue, isRadio, ...rest }) => {
  const {
    register,
    formState: { errors },
    control,
    trigger,
  } = useFormContext();
  return (
    <>
      <BootstrapForm.Check
        {...register(name)}
        error={errors[name] !== undefined}
        className={errors[name] !== undefined ? "error" : null}
        id={`control_${name}`}
        type={isRadio ? "radio" : "checkbox"}
      >
        <Controller
          name={name}
          control={control}
          rules={{ required: true }}
          render={({ field: { value, onChange } }) => (
            <CheckRadioInput
              type={isRadio ? "radio" : "checkbox"}
              value={value}
              onBlur={async () => await trigger(name, { shouldFocus: false })}
              setValue={(val) => {
                onChange(val);
                setValue(val);
              }}
              {...rest}
            />
          )}
        />

        <div className="float-start col-md-5">&nbsp;</div>
        <div className="errCls">
          <div className="float-end mb-2 col-md-7 text-truncate">
            <ErrorMessage className="marginLeft" errors={errors} name={name} />{" "}
          </div>{" "}
        </div>
      </BootstrapForm.Check>
    </>
  );
};
export const CheckRadioInput = forwardRef(
  ({ value, setValue, timeSpan, label, name, ...rest }, ref) => {
    const [filter, setFilter] = useState(value);
    var classNameMdNone = "";
    var classNameMd = "";
    if ((label || "") == "") {
      classNameMdNone = "float-start col-md-5 text-wrap d-none";
      classNameMd = "float-end col-md-12";
    } else {
      classNameMdNone = "float-start col-md-5 text-wrap";
      classNameMd = "float-end col-md-7";
    }

    const onChange = useAsyncDebounce((val) => {
      setValue(val ?? undefined);
    }, timeSpan || 0);
    useImperativeHandle(ref, () => ({
      fnReset: (data) => {
        setFilter(data);
        setValue(data || null);
      },
    }));

    useEffect(() => {
      if (value !== filter) {
        setFilter(value);
      }
    }, [value]);

    return (
      <>
        <div className={classNameMdNone}>
          {" "}
          <BootstrapForm.Check.Label>{label}</BootstrapForm.Check.Label>{" "}
        </div>

        <div className={classNameMd}>
          {" "}
          <BootstrapForm.Check.Input
            onChange={(e) => {
              setFilter(e.target.checked);
              onChange(e.target.checked);
            }}
            checked={filter || false}
            {...rest}
          />
        </div>
      </>
    );
  }
);

export const FormFields = ({ name, children, ...rest }) => {
  const { control } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name,
  });

  return (
    <>
      {fields.map((item, index) => (
        <>
          <ComposableContext indexNo={index} parentItem={item} listOf={name}>
            {children}
          </ComposableContext>
        </>
      ))}
    </>
  );
};

export const FormInputText = ({
  name,
  setValue,
  label,
  dynamicLabel,
  ...rest
}) => {
  const context = useContext(Context);
  if ((context?.indexNo ?? -1) > -1) {
    name = `${context?.listOf ?? "list"}.${context?.indexNo}.${name}`;
    if ((dynamicLabel ?? "") != "") {
      label ??= context.parentItem[dynamicLabel];
    }
  }
  const {
    register,
    formState: { errors },
    control,
    trigger,
  } = useFormContext();

  return (
    <>
      <BootstrapForm.Group
        {...register(name)}
        error={errors[name] !== undefined}
        className={errors[name] !== undefined ? "error" : null}
        controlId={`control_${name}`}
      >
        <Controller
          name={name}
          control={control}
          rules={{ required: true }}
          render={({ field: { value, onBlur, onChange } }) => (
            <InputGroup>
              <InputText
                value={value}
                onBlur={onBlur}
                setValue={(val) => {
                  onChange(val);
                  setValue(val);
                }}
                label={label}
                {...rest}
              />
              <div className="search-icon">
                <div
                  className={`${errors[name] !== undefined ? "" : "d-none"}`}
                >
                  <Tooltip
                    arrow
                    title={
                      <ErrorMessage
                        className="marginLeft"
                        errors={errors}
                        name={name}
                      />
                    }
                  >
                    <i className="fa fa-exclamation-circle me-2"></i>
                  </Tooltip>
                </div>
              </div>
            </InputGroup>
          )}
        />

        <div className="float-start col-md-5">&nbsp;</div>
        {/* <div className="float-start col-md-5">&nbsp;</div>
        <div className="errCls">
          <div className="float-end mb-2 col-md-7 text-truncate">
            <ErrorMessage className="marginLeft" errors={errors} name={name} />{" "}
          <div className=" d-flex float-end mb-2 col-md-7 text-truncate">
            <div className={`${errors[name] !== undefined ? "" : "d-none"}`}>
              <Tooltip
                title={
                  <ErrorMessage
                    className="marginLeft"
                    errors={errors}
                    name={name}
                  />
                }
              >
                <i className="fa fa-question-circle me-2"></i>
              </Tooltip>
            </div>
            <div className={`${errors[name] !== undefined ? "" : "d-none"}`}>
              <span>This is a required Field</span>
            </div>
          </div>{" "}
        </div>
        </div> */}
      </BootstrapForm.Group>
    </>
  );
};
export const FormInputFile = ({
  name,
  setValue,
  label,
  dynamicLabel,
  ...rest
}) => {
  const context = useContext(Context);
  if ((context?.indexNo ?? -1) > -1) {
    name = `${context?.listOf ?? "list"}.${context?.indexNo}.${name}`;
    if ((dynamicLabel ?? "") != "") {
      label ??= context.parentItem[dynamicLabel];
    }
  }
  const {
    register,
    formState: { errors },
    control,
    trigger,
  } = useFormContext();

  return (
    <>
      <BootstrapForm.Group
        {...register(name)}
        error={errors[name] !== undefined}
        className={errors[name] !== undefined ? "error" : null}
        controlId={`control_${name}`}
      >
        <Controller
          name={name}
          control={control}
          rules={{ required: true }}
          render={({ field: { value, onBlur, onChange } }) => (
            <InputGroup>
              <InputFile
                value={value}
                //onBlur={onBlur}
                setValue={(val) => {
                  onChange(val);
                  setValue(val);
                }}
                label={label}
                {...rest}
              />
              {/* <BootstrapForm.Control type="file" /> */}
              <div className="search-icon">
                <div
                  className={`${errors[name] !== undefined ? "" : "d-none"}`}
                >
                  <Tooltip
                    arrow
                    title={
                      <ErrorMessage
                        className="marginLeft"
                        errors={errors}
                        name={name}
                      />
                    }
                  >
                    <i className="fa fa-exclamation-circle me-2"></i>
                  </Tooltip>
                </div>
              </div>
            </InputGroup>
          )}
        />

        <div className="float-start col-md-5">&nbsp;</div>
      </BootstrapForm.Group>
    </>
  );
};

export const FormInputDatePicker = ({
  name,
  setValue,
  label,
  dynamicLabel,
  ...rest
}) => {
  const context = useContext(Context);
  if ((context?.indexNo ?? -1) > -1) {
    name = `${context?.listOf ?? "list"}.${context?.indexNo}.${name}`;
    if ((dynamicLabel ?? "") != "") {
      label ??= context.parentItem[dynamicLabel];
    }
  }
  const {
    register,
    formState: { errors },
    control,
    trigger,
  } = useFormContext();

  return (
    <>
      <BootstrapForm.Group
        {...register(name)}
        error={errors[name] !== undefined}
        className={errors[name] !== undefined ? "error" : null}
        controlId={`control_${name}`}
      >
        <Controller
          name={name}
          control={control}
          rules={{ required: true }}
          render={({ field: { value, onChange } }) => (
            <InputGroup>
              <InputDatePicker
                value={value}
                onBlur={async () => await trigger(name, { shouldFocus: false })}
                setValue={(val) => {
                  onChange(val);
                  setValue(val);
                }}
                label={label}
                {...rest}
              />
              <div className="search-icon">
                <div
                  className={`${errors[name] !== undefined ? "" : "d-none"}`}
                >
                  <Tooltip
                    arrow
                    title={
                      <ErrorMessage
                        className="marginLeft"
                        errors={errors}
                        name={name}
                      />
                    }
                  >
                    <i className="fa fa-exclamation-circle me-2"></i>
                  </Tooltip>
                </div>
              </div>
            </InputGroup>
          )}
        />

        <div className="float-start col-md-5">&nbsp;</div>
        {/* <div className="errCls">
          <div className="float-end mb-2 col-md-7 text-truncate">
            <ErrorMessage className="marginLeft" errors={errors} name={name} />{" "}
          </div>{" "}
        </div> */}
      </BootstrapForm.Group>
    </>
  );
};

export const InputDatePicker = forwardRef(
  (
    {
      value,
      setValue,
      timeSpan,
      label,
      name,
      labelCss,
      isRequired,
      max,
      min,
      ...rest
    },
    ref
  ) => {
    labelCss ??= "";
    const [filter, setFilter] = useState(value);
    var classNameMdNone = "";
    var isRequiredClass = "";
    if (isRequired === "true") {
      isRequiredClass = "text-danger";
    } else {
      isRequiredClass = "d-none";
    }
    var classNameMd = "";
    if ((label || "") == "") {
      classNameMdNone = "float-start col-md-5 text-wrap d-none";
      classNameMd = "float-end col-md-12";
    } else {
      classNameMdNone = "float-start col-md-5 text-wrap";
      classNameMd = "float-end col-md-7";
    }

    const onChange = useAsyncDebounce((val) => {
      setValue(val ?? undefined);
    }, timeSpan || 0);
    useImperativeHandle(ref, () => ({
      fnReset: (data) => {
        setFilter(data);
        setValue(data || null);
      },
    }));

    useEffect(() => {
      if (value !== filter) {
        setFilter(value);
      }
    }, [value]);
    const fnIsoToSqlDate = (dt) => {
      try {
        return DateTime.fromISO(dt).toSQLDate();
      } catch {
        return undefined;
      }
    };

    return (
      <>
        <div className={classNameMdNone}>
          <BootstrapForm.Label>
            <div className={`d-flex justify-content-start  ${labelCss}`}>
              <div>{label}</div>
              <div className={isRequiredClass}>＊</div>
            </div>
          </BootstrapForm.Label>{" "}
        </div>

        <div className={classNameMd}>
          <BootstrapForm.Control
            type="date"
            max={fnIsoToSqlDate(max ?? null)}
            min={fnIsoToSqlDate(min ?? null)}
            onChange={(e) => {
              const val = DateTime.fromSQL(e.target.value).toUTC();
              setFilter(val);
              onChange(val);
            }}
            value={fnIsoToSqlDate(filter ?? null)}
            {...rest}
          />
        </div>
      </>
    );
  }
);
export const InputText = forwardRef(
  (
    { value, setValue, timeSpan, label, labelCss, name, isRequired, ...rest },
    ref
  ) => {
    labelCss ??= "";
    const [filter, setFilter] = useState(value);
    var classNameMdNone = "";
    var isRequiredClass = "";
    if (isRequired === "true") {
      isRequiredClass = "text-danger";
    } else {
      isRequiredClass = "d-none";
    }
    var classNameMd = "";
    if ((label || "") == "") {
      classNameMdNone = "float-start col-md-5 text-wrap d-none";
      classNameMd = "float-end col-md-12";
    } else {
      classNameMdNone = "float-start col-md-5 text-wrap";
      classNameMd = "float-end col-md-7";
    }

    const onChange = useAsyncDebounce((val) => {
      setValue(val ?? undefined);
    }, timeSpan || 0);
    useImperativeHandle(ref, () => ({
      fnReset: (data) => {
        setFilter(data);
        setValue(data || null);
      },
    }));

    useEffect(() => {
      if (value !== filter) {
        setFilter(value);
      }
    }, [value]);

    return (
      <>
        <div className={`${classNameMdNone}`}>
          <BootstrapForm.Label>
            <div className={`d-flex justify-content-start  ${labelCss}`}>
              <div>{label}</div>
              <div className={isRequiredClass}>＊</div>
            </div>
          </BootstrapForm.Label>{" "}
        </div>

        <div className={classNameMd}>
          <BootstrapForm.Control
            onChange={(e) => {
              setFilter(e.target.value);
              onChange(e.target.value);
            }}
            value={filter || ""}
            {...rest}
          />
        </div>
      </>
    );
  }
);
export const InputFile = forwardRef(
  (
    { value, setValue, timeSpan, label, labelCss, name, isRequired, ...rest },
    ref
  ) => {
    labelCss ??= "";
    timeSpan ??= 0;
    label ??= "";
    name ??= "";
    isRequired ??= "false";
    value ??= null;
    setValue ??= () => {};

    const [filter, setFilter] = useState(value);
    var classNameMdNone = "";
    var isRequiredClass = "";
    if (isRequired === "true") {
      isRequiredClass = "text-danger";
    } else {
      isRequiredClass = "d-none";
    }
    var classNameMd = "";
    if ((label || "") == "") {
      classNameMdNone = "float-start col-md-5 text-wrap d-none";
      classNameMd = "float-end col-md-12";
    } else {
      classNameMdNone = "float-start col-md-5 text-wrap";
      classNameMd = "float-end col-md-7";
    }

    const onChange = useAsyncDebounce((val) => {
      setValue(val ?? undefined);
    }, timeSpan || 0);
    useImperativeHandle(ref, () => ({
      fnReset: (data) => {
        setFilter(data);
        setValue(data || null);
      },
    }));

    useEffect(() => {
      if (value !== filter) {
        setFilter(value);
      }
    }, [value]);

    return (
      <>
        <div className={classNameMdNone}>
          <BootstrapForm.Label>
            <div className={`d-flex justify-content-start  ${labelCss}`}>
              <div>{label}</div>
              <div className={isRequiredClass}>＊</div>
            </div>
          </BootstrapForm.Label>{" "}
        </div>

        <div className={classNameMd}>
          <BootstrapForm.Control
            onChange={(e) => {
              setFilter(e.target.files[0]);
              onChange(e.target.files[0]);
            }}
            type="file"
            files={filter ?? null == null ? [] : [filter]}
            {...rest}
          />
        </div>
      </>
    );
  }
);

export const FormInputDropdown = ({ name, setValue, ...rest }) => {
  setValue ??= (val) => {};
  const {
    register,
    formState: { errors },
    control,
    trigger,
  } = useFormContext();

  return (
    <>
      <BootstrapForm.Group
        {...register(name)}
        error={errors[name] !== undefined}
        className={errors[name] !== undefined ? "error" : null}
        controlId={`control_${name}`}
      >
        <Controller
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <InputGroup>
              <InputDropdown
                setValue={(val) => {
                  onChange(val);
                  setValue(val);
                }}
                value={value}
                onBlur={async () => await trigger(name, { shouldFocus: false })}
                {...rest}
              />
              <div className="search-icon">
                <div
                  className={`${errors[name] !== undefined ? "" : "d-none"}`}
                >
                  <Tooltip
                    arrow
                    title={
                      <ErrorMessage
                        className="marginLeft"
                        errors={errors}
                        name={name}
                      />
                    }
                  >
                    <i className="fa fa-exclamation-circle me-2"></i>
                  </Tooltip>
                </div>
              </div>
            </InputGroup>
          )}
          control={control}
          name={name}
        />

        <div className="float-start col-md-5">&nbsp;</div>
        {/* <div className="errCls">
          <div className="float-end col-md-7 text-truncate">
            <ErrorMessage className="marginLeft" errors={errors} name={name} />{" "}
          </div>{" "}
        </div> */}
      </BootstrapForm.Group>
    </>
  );
};
const generateSingleOptions = (ddOpt) =>
  ddOpt.map((option, index) => (
    <option key={index} value={option?.value??null}>
      {option?.text??""}
    </option>
  ));
export const InputDropdown = forwardRef(
  (
    {
      timeSpan,
      name,
      label,
      value,
      setValue,
      ddOpt,
      isRequired,
      labelCss,
      changeEvent,
      className,
      ...rest
    },
    ref
  ) => {
    labelCss ??= "";
    className ??= "";
    className += " form-control";
    var isRequiredClass = "";
    if (isRequired === "true") {
      isRequiredClass = "text-danger";
    } else {
      isRequiredClass = "d-none";
    }

    const [filter, setFilter] = useState(value);
    var classNameMdNone = "";
    var classNameMd = "";
    if ((label || "") == "") {
      classNameMdNone = "float-start col-md-5  text-wrap d-none";
      classNameMd = "float-end col-md-12";
    } else {
      classNameMdNone = "float-start col-md-5 text-wrap";
      classNameMd = "float-end col-md-7";
    }
    const onChange = useAsyncDebounce((val) => {
      setValue(val ?? undefined);
    }, timeSpan || 0);
    useImperativeHandle(ref, () => ({
      fnReset: (data) => {
        setFilter(data);
        setValue(data || "");
      },
    }));
    useEffect(() => {
      if ((filter ?? null) === null && (ddOpt ?? []).length > 0) {
        setTimeout(() => setValue(ddOpt[0].value));
      }
    }, [ddOpt, filter]);
    useEffect(() => {
      if (value !== filter) {
        setFilter(value);
      }
    }, [value]);
    return (
      <>
        <div className={classNameMdNone}>
          {" "}
          <BootstrapForm.Label>
            {" "}
            <div className={`d-flex justify-content-start  ${labelCss}`}>
              <div>{label}</div>
              <div className={isRequiredClass}>＊</div>
            </div>
          </BootstrapForm.Label>
        </div>
        <div className={classNameMd}>
          <BootstrapForm.Select
            className={className}
            onChange={(e) => {
              onChange(e.target.value);
              setFilter(e.target.value);
            }}
            value={filter || null}
            {...rest}
          >
            {generateSingleOptions(ddOpt)}
          </BootstrapForm.Select>
        </div>
      </>
    );
  }
);

//   export interface TabCompotent {
//     TabName: string;
//     component: ReactNode;
//   }
//   interface TabProps {
//     components: TabCompotent[];
//     select?: number;
//   }
//   export const HTabs = ({ components, select }: TabProps) => {
//     const [value, setValue] = useState((select ?? 0).toString());

//     const handleChange = (event: React.SyntheticEvent, newValue: number) => {
//       setValue(newValue.toString());
//     };
//     return (
//       <>
//         <Box sx={{ width: "100%", typography: "body1" }}>
//           <TabContext value={value}>
//             <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
//               <TabList onChange={handleChange} aria-label="lab API tabs example">
//                 {components.map((m: any, i: number) => {
//                   return <Tab label={m.TabName} value={i.toString()} key={i} />;
//                 })}
//               </TabList>
//             </Box>
//             {components.map((m: any, i: number) => {
//               return (
//                 <TabPanel value={i.toString()} key={i}>
//                   {m.component}
//                 </TabPanel>
//               );
//             })}
//           </TabContext>
//         </Box>
//       </>
//     );
//   };
