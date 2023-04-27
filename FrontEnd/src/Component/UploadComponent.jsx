import React, { Component } from "react";

import { WebService, WebFileUploadService } from "../Services/WebService"
import axios from 'axios';
class UploadComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            avatar: null
        };
    }
    onClickHandler = () => {
        const data = new FormData()
        data.append('file', this.state.avatar)

        // WebFileUploadService({ endPoint: 'upload/upload', data:data }).then((res) => {
        // 		console.log("Response", res)

        // 	});
        axios.post("http://localhost:3001/upload/upload", data, {
            // receive two    parameter endpoint url ,form data
        }).then(res => { // then print response status
            console.log("response", res.statusText)
        })
    }
    onChangeHandler = async (e) => {
        console.log(e.target.files[0])

        this.setState({
            avatar: e.target.files[0],
            loaded: 0,
        })
    };

    render() {
        return (
            <div className="h-screen flex-grow-1 overflow-y-lg-auto">
                <div className="container">


                    <span>Upload Profile Picture:</span>
                    <input type="file" id="avatar" required onChange={this.onChangeHandler} /> <br />
                    <input type="submit" onClick={this.onClickHandler} value="submit" />

                </div>
            </div>
        );
    }
}

export default UploadComponent;
