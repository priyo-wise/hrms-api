import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import {
  useForm,
  useFormContext,
  FormProvider,
  Controller,
} from "react-hook-form";
import { useAsyncDebounce } from "react-table";
import BootstrapForm from "react-bootstrap/Form";
import { ErrorMessage } from "@hookform/error-message";
import "../asset/Form.css";
import { yupResolver } from "@hookform/resolvers/yup";

export const Form = forwardRef(
  (
    {
      defaultValues,
      children,
      onSubmit,
      validationSchema,
      ...rest
    },
    ref
  ) => {
    const methods = useForm({
      defaultValues,
      mode: "onChange",
      resolver: yupResolver(validationSchema),
    });
    // useEffect(() => {
    //   onPageValid(methods.formState.isValid);
    // }, [methods.formState.isValid]);

    useEffect(() => {
      const firstError = Object.keys(methods.formState.errors).reduce((field, a) => {
        return !!methods.formState.errors[field] ? field : a;
      }, null);
      if (firstError) {
        methods.setFocus(firstError);
      }
    }, [methods.formState.errors, methods.setFocus]);

    useImperativeHandle(
      ref,
      () => ({
        fnReset: (data) => {
          methods.reset(data);
          onSubmit(data);
        },
      }),
      []
    );

    return (
      <FormProvider {...methods}>
        <BootstrapForm
          onSubmit={methods.handleSubmit(onSubmit)}
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

export const FormInputText = ({ name, ...rest }) => {
  const {
    register,
    formState: { errors },
    control,
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
          render={({
            field: {value, onBlur, onChange},
            fieldState: { invalid, isTouched, isDirty, error },
            formState,
          }) => (
            <InputText
              value={value}
              onBlur={onBlur}
              setValue={onChange}
              {...rest}
            />
          )}
        />
        <ErrorMessage errors={errors} name={name} />
      </BootstrapForm.Group>
    </>
  );
};

export const InputText = forwardRef(
  ({ value, setValue, timeSpan, label, name, ...rest }, ref) => {
    const [filter, setFilter] = useState(value);
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
      if (value !== filter) {
        setFilter(value);
      }
    }, [value]);

    return (
      <>
        <BootstrapForm.Label>{label}</BootstrapForm.Label>
        <BootstrapForm.Control
          onChange={(e) => {
            setFilter(e.target.value);
            onChange(e.target.value);
          }}
          value={filter || ""}
          {...rest}
        />
      </>
    );
  }
);

  

  export const FormInputDropdown = ({ name, ...rest }) => {
    const {
      register,
      formState: { errors },
      control,
    } = useFormContext();

    return (
      <>
        <BootstrapForm.Group
          {...register(name)}
          error={errors[name] !== undefined}
          controlId={`control_${name}`}
        >
          <Controller
            render={({
              field: { onChange, value },
              fieldState: { error },
            }) => (
                <InputDropdown onChange={onChange} value={value} {...rest} />
            )}
            control={control}
            name={name}
          />
          <ErrorMessage errors={errors} name={name} />
        </BootstrapForm.Group>
      </>
    );
  };
  const generateSingleOptions = (ddOpt) => ddOpt.map((option, index) => (<option key={index} value={option.value}>{option.text}</option>));
  export const InputDropdown = forwardRef(({ timeSpan, name, label, value, setValue, ddOpt, ...rest }, ref) => {
    const [filter, setFilter] = useState(value);
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
      if (value !== filter) {
        setFilter(value);
      }
    }, [value]);
    return (
      <>
        <BootstrapForm.Label>{label}</BootstrapForm.Label>
        <BootstrapForm.Select onChange={(e) => {
            setFilter(e.target.value);
            onChange(e.target.value);
          }}
          value={filter||null}
          {...rest}>
          {generateSingleOptions(ddOpt)}
        </BootstrapForm.Select>
      </>
    );
  });

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
