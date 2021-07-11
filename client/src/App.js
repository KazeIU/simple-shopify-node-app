import React, { Component } from "react";
import axios from "axios";

import "./App.css";

class App extends Component {
  state = {
    status: {
      message: "",
      report: null,
    },
    price: "",
  };

  componentDidMount() {
    this.checkBackendStatus()
      .then(res => this.serverStatus(res?.data?.message, "OK"))
      .catch(err => this.serverStatus(err, "NG"));
  }

  checkBackendStatus = async () => {
    try {
      const res = await axios.get("/status_check");
      return res;
    } catch (err) {
      alert("Server has been disconnected.");
      console.log(err);
    }
  };

  handleNewPrice = (newPrice) => {
    this.setState({
      price: newPrice,
    });
  };

  handlePriceSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.get("/update_price", {
        params: { price: this.state.price },
      });

      alert(res.data.message);
    } catch (err) {
      alert("The server is disconnected.");
      console.log(err);
    }
  };

  serverStatus = (message, report) => {
    this.setState({
      status: {
        message,
        report: message? report: "NG",
      },
    })
  };

  render() {
    return (
      <div className="App">
        <div className="card-container">
          <div className="form-container">
            <form onSubmit={(e) => this.handlePriceSubmit(e)}>
              <input
                type="text"
                placeholder="Enter a new t-shirt price..."
                className="price-input"
                value={this.state.price}
                onInput={(e) => this.handleNewPrice(e.target.value)}
              />
              <button type="submit">Submit</button>
            </form>
            <div className="status">
              <div className={`status-icon ${this.state.status?.report? this.state.status.report: "NG"}`}></div>
              <p>
                {this.state.status?.message? this.state.status.message: "server not connected"}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
