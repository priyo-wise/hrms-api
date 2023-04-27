import React, { Component } from "react";
import "./EditProfile.css";
import { WebService } from "../../Services/WebService";
import { StandardConst } from "../../Services/StandardConst";
import axios from "axios";
class EditProfileComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      avatar: null,
      imgUpload: null,
    };
  }
  onChangeHandler = (e) => {
    debugger;
    console.log(e.target.files[0]);
    this.setState({
      avatar: e.target.files[0],
      loaded: 0,
    });

    var file = e.target.files[0];
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      console.log(reader.result);
      this.setState({
        imgUpload: reader.result,
      });
    };
    reader.onerror = function (error) {
      console.log("Error: ", error);
    };
  };

  onClickHandler = () => {
    console.log(this.state.imgUpload);
    // const data = new FormData()
    // data.append('file', this.state.avatar)

    // // WebFileUploadService({ endPoint: 'upload/upload', data:data }).then((res) => {
    // // 		console.log("Response", res)

    // // 	});
    // axios.post("http://localhost:3001/upload/upload", data, {
    //     // receive two    parameter endpoint url ,form data
    // }).then(res => { // then print response status
    //     console.log("response", res.statusText)
    // })
  };

  componentDidMount() {
    WebService({ endPoint: "UserProfile/Fetch/2", method: "GET" }).then(
      (res) => {
        debugger;
        this.setState({ users: res.data });
        console.log("Response", this.state.users[0].FullName);
      }
    );
  }

  handleSubmit = async (e) => {
    e.preventDefault();
    const {
      UserID,
      FullName,
      Email,
      Phone,
      EmergencyPhone,
      PermanentAddress,
      CommunicationAddress,
      Qualifications,
      DOB,
      DOJ,
    } = e.target.elements;
    let details = {
      UserID: UserID.value,
      FullName: FullName.value,
      Email: Email.value,
      Phone: Phone.value,
      EmergencyPhone: EmergencyPhone.value,
      PermanentAddress: PermanentAddress.value,
      CommunicationAddress: CommunicationAddress.value,
      Qualifications: Qualifications.value,
      DOB: DOB.value,
      DOJ: DOJ.value,
    };
    WebService({
      endPoint: "UserProfile/Update",
      method: "POST",
      body: details,
    }).then((res) => {
      console.log("Response", res);
    });
  };

  render() {
    return (
      <div className="h-screen flex-grow-1 overflow-y-lg-auto">
        <div className="container">
          <form onSubmit={this.handleSubmit}>
            {this.state.users.map((user) => (
              <div className="row mt-4" key={user.UserID}>
                <div className="col-md-4">
                  <div className="card">
                    <div className="card-body">
                      <div className="d-flex flex-column align-items-center text-center">
                        <div class="pic-holder">
                          <img
                            id="profilePic"
                            class="pic rounded-circle p-1 bg-primary"
                            src={`${StandardConst.images}WiseEmployeeLogo.png`}
                          />

                          <input
                            class="uploadProfileInput"
                            type="file"
                            name="profile_pic"
                            id="newProfilePhoto"
                            accept="image/*"
                            style={{ opacity: "0" }}
                            onChange={this.onChangeHandler}
                          />
                          <label
                            for="newProfilePhoto"
                            class="upload-file-block"
                          >
                            <div class="text-center">
                              <div class="mb-2">
                                <i class="fa fa-camera fa-2x"></i>
                              </div>
                              <div class="text-uppercase">
                                Update <br /> Profile Photo
                              </div>
                            </div>
                          </label>
                        </div>
                        <button
                          className="btn btn-outline-primary"
                          onClick={this.onClickHandler}
                        >
                          {" "}
                          Upload
                        </button>
                        <div className="mt-1">
                          <h4>{user.FullName}</h4>
                          <p className="text-secondary mb-1">
                            {user.Designation}
                          </p>
                          <p className="text-muted font-size-sm">
                            Code: {user.EmployeeCode}
                          </p>
                          <button className="btn btn-primary mx-2">
                            Follow
                          </button>
                          <button className="btn btn-outline-primary">
                            {" "}
                            Message
                          </button>
                        </div>
                        <hr className="my-4" />
                        <ul className="list-group list-group-flush">
                          <li className="list-group-item d-flex justify-content-between align-items-center flex-wrap">
                            <h6 className="mb-0">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                className="feather feather-globe me-2 icon-inline"
                              >
                                <circle cx="12" cy="12" r="10"></circle>
                                <line x1="2" y1="12" x2="22" y2="12"></line>
                                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                              </svg>
                              Website
                            </h6>
                            <span className="text-secondary">
                              https://bootdey.com
                            </span>
                          </li>
                          <li className="list-group-item d-flex justify-content-between align-items-center flex-wrap">
                            <h6 className="mb-0">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                className="feather feather-github me-2 icon-inline"
                              >
                                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                              </svg>
                              Github
                            </h6>
                            <span className="text-secondary">bootdey</span>
                          </li>
                          <li className="list-group-item d-flex justify-content-between align-items-center flex-wrap">
                            <h6 className="mb-0">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                className="feather feather-twitter me-2 icon-inline text-info"
                              >
                                <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
                              </svg>
                              Twitter
                            </h6>
                            <span className="text-secondary">@bootdey</span>
                          </li>
                          <li className="list-group-item d-flex justify-content-between align-items-center flex-wrap">
                            <h6 className="mb-0">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                className="feather feather-instagram me-2 icon-inline text-danger"
                              >
                                <rect
                                  x="2"
                                  y="2"
                                  width="20"
                                  height="20"
                                  rx="5"
                                  ry="5"
                                ></rect>
                                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                                <line
                                  x1="17.5"
                                  y1="6.5"
                                  x2="17.51"
                                  y2="6.5"
                                ></line>
                              </svg>
                              Instagram
                            </h6>
                            <span className="text-secondary">bootdey</span>
                          </li>
                          <li className="list-group-item d-flex justify-content-between align-items-center flex-wrap">
                            <h6 className="mb-0">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                className="feather feather-facebook me-2 icon-inline text-primary"
                              >
                                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                              </svg>
                              Facebook
                            </h6>
                            <span className="text-secondary">bootdey</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-8">
                  <div className="card">
                    <div className="card-body">
                      <div className="row mb-3">
                        <div className="col-sm-3">
                          <h6 className="mb-0">Full Name</h6>
                        </div>
                        <div className="col-sm-9 text-secondary">
                          <input
                            type="hidden"
                            id="UserID"
                            value={user.UserID}
                          />

                          <input
                            type="text"
                            className="form-control"
                            id="FullName"
                            defaultValue={user.FullName}
                          />
                        </div>
                      </div>
                      <div className="row mb-3">
                        <div className="col-sm-3">
                          <h6 className="mb-0">Email</h6>
                        </div>
                        <div className="col-sm-9 text-secondary">
                          <input
                            type="text"
                            className="form-control"
                            id="Email"
                            defaultValue={user.Email}
                          />
                        </div>
                      </div>
                      <div className="row mb-3">
                        <div className="col-sm-3">
                          <h6 className="mb-0">Phone</h6>
                        </div>
                        <div className="col-sm-9 text-secondary">
                          <input
                            type="text"
                            className="form-control"
                            id="Phone"
                            defaultValue={user.Phone}
                          />
                        </div>
                      </div>
                      <div className="row mb-3">
                        <div className="col-sm-3">
                          <h6 className="mb-0">Mobile</h6>
                        </div>
                        <div className="col-sm-9 text-secondary">
                          <input
                            type="text"
                            className="form-control"
                            id="EmergencyPhone"
                            defaultValue={user.EmergencyPhone}
                          />
                        </div>
                      </div>
                      <div className="row mb-3">
                        <div className="col-sm-3">
                          <h6 className="mb-0">Permanent Address</h6>
                        </div>
                        <div className="col-sm-9 text-secondary">
                          <input
                            type="text"
                            className="form-control"
                            id="PermanentAddress"
                            defaultValue={user.PermanentAddress}
                          />
                        </div>
                      </div>
                      <div className="row mb-3">
                        <div className="col-sm-3">
                          <h6 className="mb-0">Address</h6>
                        </div>
                        <div className="col-sm-9 text-secondary">
                          <input
                            type="text"
                            className="form-control"
                            id="CommunicationAddress"
                            defaultValue={user.CommunicationAddress}
                          />
                        </div>
                      </div>
                      <div className="row mb-3">
                        <div className="col-sm-3">
                          <h6 className="mb-0">Qualification</h6>
                        </div>
                        <div className="col-sm-9 text-secondary">
                          <input
                            type="text"
                            className="form-control"
                            id="Qualifications"
                            defaultValue={user.Qualifications}
                          />
                        </div>
                      </div>
                      <div className="row mb-3">
                        <div className="col-sm-3">
                          <h6 className="mb-0">DOB</h6>
                        </div>
                        <div className="col-sm-9 text-secondary">
                          <input
                            type="text"
                            className="form-control"
                            id="DOB"
                            defaultValue={user.DOB}
                          />
                        </div>
                      </div>
                      <div className="row mb-3">
                        <div className="col-sm-3">
                          <h6 className="mb-0">DOJ</h6>
                        </div>
                        <div className="col-sm-9 text-secondary">
                          <input
                            type="text"
                            className="form-control"
                            id="DOJ"
                            defaultValue={user.DOJ}
                          />
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-sm-3"></div>
                        <div className="col-sm-9 text-secondary">
                          <input
                            type="submit"
                            className="btn btn-primary px-4"
                            value="Save Changes"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-sm-12">
                    <div className="card">
                      <div className="card-body">
                        <h5 className="d-flex align-items-center mb-3">
                          Project Status
                        </h5>
                        <p>Web Design</p>
                        <div
                          className="progress mb-3"
                          style={{ height: "5px" }}
                        >
                          <div
                            className="progress-bar bg-primary"
                            role="progressbar"
                            style={{ width: "80%" }}
                            aria-valuenow="80"
                            aria-valuemin="0"
                            aria-valuemax="100"
                          ></div>
                        </div>
                        <p>Website Markup</p>
                        <div
                          className="progress mb-3"
                          style={{ height: "5px" }}
                        >
                          <div
                            className="progress-bar bg-danger"
                            role="progressbar"
                            style={{ width: "72%" }}
                            aria-valuenow="72"
                            aria-valuemin="0"
                            aria-valuemax="100"
                          ></div>
                        </div>
                        <p>One Page</p>
                        <div
                          className="progress mb-3"
                          style={{ height: "5px" }}
                        >
                          <div
                            className="progress-bar bg-success"
                            role="progressbar"
                            style={{ width: "80%" }}
                            aria-valuenow="89"
                            aria-valuemin="0"
                            aria-valuemax="100"
                          ></div>
                        </div>
                        <p>Mobile Template</p>
                        <div
                          className="progress mb-3"
                          style={{ height: "5px" }}
                        >
                          <div
                            className="progress-bar bg-warning"
                            role="progressbar"
                            style={{ width: "55%" }}
                            aria-valuenow="55"
                            aria-valuemin="0"
                            aria-valuemax="100"
                          ></div>
                        </div>
                        <p>Backend API</p>
                        <div className="progress" style={{ height: "5px" }}>
                          <div
                            className="progress-bar bg-info"
                            role="progressbar"
                            style={{ width: "65%" }}
                            aria-valuenow="66"
                            aria-valuemin="0"
                            aria-valuemax="100"
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </form>
        </div>
      </div>
    );
  }
}

<script></script>;

export default EditProfileComponent;
