import React, { Component } from "react";
import "./App.css";

class App extends Component {
  state = {
    status: {
      message: "",
      report: null
    },
    price: ""
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

  handleNewPrice = newPrice => {
    this.setState({ 
      price: newPrice
    });
  };

  handlePriceSubmit = (e) => {
    e.preventDefault();
    console.log(this.state.price);
  };

  render() {
    return (
      <div className="App">
        <div className="card-container">
          <div className="form-container">
            <form onSubmit={e => this.handlePriceSubmit(e)}>
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
