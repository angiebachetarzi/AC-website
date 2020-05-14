import React from 'react';
import Header from './components/header.js';
import './styles/App.css';


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

  componentDidMount() {
    //this.callServerTest()
  }

  render() {
    return (
      <div className="App">
       <Header />
        <p>{this.state.testResponse}</p>
      </div>
    );
  }

}


export default App;
