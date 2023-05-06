import React from "react";
import { Form, FormInputText } from "./CustomeForm";
import * as yup from "yup";
import { useDispatch } from "react-redux";
import { setToken, useToken } from "./authSlice";
import { WebService } from "./WebService";
import './wiseInput.css';

const SettingComponent = ({ ChangeTabByIndex }) => {
  const token = useToken();
  const dispatch = useDispatch();
  const schema = yup.object().shape({
    Token: yup.string().trim().label("Token").required(),
  });
  const onSubmit = async (data) => {
    const refereshToken = await WebService({
      endPoint: "User/Token/Referesh",
      dispatch,
      token: data.Token,
    });
    dispatch(setToken(refereshToken));
    ChangeTabByIndex(0);
  };
  return (
    <div>
      <Form
        validationSchema={schema}
        onSubmit={onSubmit}
        defaultValues={{ Token: token }}
      >
        <div>
          <FormInputText label="Bearer Token" name="Token" type="password" className="wiseTime_Solution" />
        </div>
        <div>
          <button type="submit" style={{border: '1px solid #000', color: '#000', padding: '15px 32px', margin: '4px 2px',cursor: 'pointer', width: '100%',height: '42px' }}>
            Submit
          </button>
        </div>
      </Form>
    </div>
  );
};

export default SettingComponent;
