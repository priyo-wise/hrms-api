import React, { Component } from "react";
import {WebService} from '../Services/WebService';

class DashboardComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
             Dashboard: []
        };
    }

    componentDidMount() {
        WebService({ endPoint: 'Dashboard/Fetch', method: 'GET' }).then((res) => {
        this.setState({ Dashboard: res.data });
            console.log("Response", this.state.Dashboard)
        });
    }
    
    render(){
        return (
        <div className='container'>
            <div className='row'>

                {this.state.Dashboard.map((item) => {
                    return(
                        <div className='col-md-2 card'>
                            <img src="../../../logo192.png" className="card-img-top" alt="..." />
                            <div className="card-body">
                                <h5 className="card-title">{item.FullName}</h5>
                                <p className="card-text">{item.Email}</p>
                                <p className="card-text">{item.Designation}</p>
                            </div>
                        </div>
                    )
                })}
                
            </div>
        </div>
        );
    }
}

export default DashboardComponent;
