import React from 'react';
//import logo from './logo.svg';
import './App.css';


class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {testResponse: ''}
  }

  callServerTest() {
    fetch('http://localhost:9000/test')
    .then(res => {return res.text()})
    .then(res => {this.setState({testResponse : res})})
  }

  componentWillMount() {
    this.callServerTest()
  }

  render() {
    return (
      <div className="App">
       {/*  <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header> */}
        <p>{this.state.testResponse}</p>
      </div>
    );
  }

}


export default App;
