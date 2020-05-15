import React from 'react';
import { Route, Switch } from "react-router-dom";
import { Home } from "./components/home.js";
import { Login } from "./components/login.js";
import { Signup } from "./components/signup.js";
import { PrivateRoute } from "./components/privateRoute.js";
import './styles/App.css';


class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {testResponse: ''}
  }

  componentDidMount() {
   
  }

  render() {
    return (
      <Switch>
        <Route exact path="/" component={Login} />
        <Route exact path="/signup" component={Signup} />
        <PrivateRoute path="/home" component={Home} />
      </Switch>
       
    );
  }

}


export default App;
