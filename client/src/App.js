import React, { Component } from "react";
import "./App.css";

class App extends Component {
  state = {
    status: {
      message: "",
      report: null
    },
  };

  componentDidMount() {
    this.checkBackendStatus()
      .then((res) => this.setState({ 
        status: {
          message: res.express,
          report: "OK"
        } 
      }))
      .catch((err) => this.setState({ 
        status: {
          message: "server not connected",
          report: "NG"
        }
      }));
  }

  checkBackendStatus = async () => {
    const response = await fetch("/status_check");
    const body = await response.json();

    if (response.status !== 200) {
      throw Error(body.message);
    }
    return body;
  };

  render() {
    return (
      <div className="App">
        <div className="card-container">
          <div className="form-container">
            <form>
              <input />
              <button>Submit</button>
            </form>
            <div className="status">
              <div className={`status-icon ${this.state.status.report}`}></div>
              <p>{this.state.status?.message? this.state.status.message: "server not connected"}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
