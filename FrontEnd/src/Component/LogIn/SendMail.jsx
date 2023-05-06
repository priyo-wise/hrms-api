import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Modal from "react-bootstrap/Modal";
import { WebService } from "../../Services/WebService";
import { useDispatch } from "react-redux";
import { Form } from "../Form";
import * as yup from "yup";
import { FormInputText } from "../Form";
import SweetAlert from "sweetalert2";

function MydModalWithGrid(props) {
  const dispatch = useDispatch();
  const requiredMessage = "This is required field";
  const schema = yup
    .object()
    .shape({
      Email: yup.string().trim().required(requiredMessage),
    })
    .required();
  const successAlert = (res) => {
    SweetAlert.fire({
      text: res,
    });
  };
  const submit = async (data) => {
    await WebService({
      endPoint: "LogIn/SendMail",
      body: data,
      dispatch,
    }).then((res) => {
      successAlert(res);
      props.onHide();
    });
  };
  return (
    <Modal {...props} aria-labelledby="contained-modal-title-vcenter">
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Forgot Password
        </Modal.Title>
      </Modal.Header>
      <Form onSubmit={submit} validationSchema={schema}>
        <Modal.Body className="show-grid">
          <div className="col-md-12">
            <FormInputText
              label="Enter Registered Email"
              name="Email"
              type="text"
            />
          </div>
          
          
        </Modal.Body>
        
          <div className="row m-2  mb-4">
            <div className="col-6 px-2 mt-2">
              <Button
                className="btn-block b-app p-2 radius bg-light text-dark rounded btn-md  col-12"
                id="btnMailCancel"
                onClick={props.onHide}
              >
                Cancel
              </Button>
            </div>
            <div className="col-6 text-end mt-2">
              <Button
                className="btn-block b-app  p-2 radius text-light rounded btn-md col-12"
                id="btnMailSubmit"
                type="submit"
              >
                Submit
              </Button>
            </div>
          </div>
      </Form>
    </Modal>
  );
}

export default MydModalWithGrid;
