import {
  IWorkItemFormService,
  WorkItemTrackingServiceIds,
} from "azure-devops-extension-api/WorkItemTracking";
import * as SDK from "azure-devops-extension-sdk";
import React, { useEffect, useRef, useState } from "react";
import {
  Form,
  FormDatePicker,
  FormDropDown,
  FormInputText,
} from "./CustomeForm";
import { DateTime } from "luxon";
import { useProjectList, useTaskList, useToken } from "./authSlice";
import { extend, map, pick } from "underscore";
import * as yup from "yup";
import {WebService} from './WebService';
import { useDispatch } from "react-redux";
import './wiseInput.css';

const TimeTrakingComponent = ({ChangeTabByIndex}) => {
  const formRef=useRef();
  const projectList = useProjectList();
  const taskList = useTaskList();
  const token = useToken();
  const dispatch=useDispatch();
  const afterRender = useRef(false);
  const [durationOption, setDurationOption] = useState([]);
  useEffect(() => {
    if (!afterRender.current) initActtion();
    afterRender.current = true;
  }, []);
  const initActtion = () => {
    SDK.init();
    //#region Duration
    var opts = [];
    for (var i = 0.25; i <= 8; i += 0.25) {
      var format = "H 'h' mm 'm'";
      if (i < 1) format = "mm 'm'";
      else if ((i * 10) % 10 === 0) format = "H 'h'";
      var opt = {
        value: i,
        label: DateTime.fromSeconds(i * 60 * 60, { zone: "UTC" }).toFormat(
          format
        ),
      };
      opts.push(opt);
    }
    setDurationOption(opts);
    //#endregion
  };
  const schema = yup.object().shape({
    Project: yup.string().trim().label("Project").required(),
    Task: yup.string().trim().label("Task").required(),
    Duration: yup.string().trim().label("Duration").required(),
    Date: yup.date().typeError().label("Date").required(),
  });
  const onSubmit = async (data) => {
    data.Date = DateTime.fromJSDate(data.Date).toSQLDate();
    //await SDK.ready();
    // var workItemFormService = await SDK.getService<IWorkItemFormService>(WorkItemTrackingServiceIds.WorkItemFormService);
    // var workItemId = await workItemFormService.getId();
    data.ExternalLink = "http://localhost:3002/";//await workItemFormService.getWorkItemResourceUrl(
    //   workItemId
    // );
    // var workItemTitle= await workItemFormService.getFieldValue("System.Title");
    // data.LogNote=`Azure DevOps Item #${workItemId} - ${workItemTitle} :: ${data.LogNote}`;
    //console.log(data);
    await WebService({endPoint:"TimeSheet/External",token,dispatch,body:data});
    formRef.current.fnReset(extend(defaultValue,pick(data,["Duration","Project","Task"])));
    ChangeTabByIndex(1);
  };
  const [defaultValue, setDefaultValue]=useState({
    Date: DateTime.now()
      .set({ hour: 0, minute: 0, second: 0, millisecond: 0 })
      .setZone("utc")
      .toISO(),
      Duration:null
  });
  return (
    <div>
      <Form
        defaultValues={defaultValue}
        onSubmit={onSubmit}
        validationSchema={schema}
        ref={formRef}
      >
        <div>
          <FormDropDown
            placeholder="Project"
            name="Project"
            options={map(projectList, (m) => ({
              value: m.ProjectId,
              label: m.ProjectName,
            }))}
          />
        </div>
        <div style={{ marginTop: "3px" }}>
          <FormDropDown
            placeholder="Task"
            name="Task"
            options={map(taskList, (m) => ({
              value: m.TaskCategoryId,
              label: m.TaskCategoryName,
            }))}
          />
        </div>
        <div style={{ marginTop: "3px" }}>
          <FormDatePicker placeholder="Date" name="Date"  className="wiseTime_Solution" />
        </div>
        <div style={{ marginTop: "3px" }}>
          <FormDropDown
            placeholder="Duration"
            name="Duration"
            options={durationOption}
          />
        </div>
        <div style={{ marginTop: "3px" }}>
          <FormInputText placeholder="Log Note" name="LogNote" className="wiseTime_Solution" as="textarea"  />
        </div>
        <div>
          <button style={{border: '1px solid #000', color: '#000', padding: '15px 32px', margin: '4px 2px',cursor: 'pointer', width: '100%',height: '42px' }} type="submit">
            Submit
          </button>
        </div>
      </Form>
    </div>
  );
};

export default TimeTrakingComponent;
