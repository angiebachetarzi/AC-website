
import React from "react";
import { Button, FormGroup, FormControl } from "react-bootstrap";
import API from "../utils/API";

export class Signup extends React.Component {
  state = {
    email: "",
    username: "",
    password: "",
    cpassword: "",
    islandCode: ""
  };
  send = async () => {
    const { email, username, password, cpassword, islandCode } = this.state;
    if (!email || email.length === 0) return;
    if (!username || username.length === 0) return;
    if (!password || password.length === 0 || password !== cpassword) return;
    if (!islandCode || islandCode.length === 0) return;
    try {
      const { data } = await API.signup({ email, username, password, islandCode });
      localStorage.setItem("token", data.token);
      window.location = "/";
    } catch (error) {
      console.error(error);
    }
  };
  handleChange = (event) => {
    this.setState({
      [event.target.id]: event.target.value
    });
  };
  render() {
    const { email, username, password, cpassword, islandCode } = this.state;
    return (
    <div className="container-fluid">
        <h1>The Islander's Guide</h1>
        <div className="login_div">
            <h2 className="display-6">Sign Up</h2>
            <FormGroup controlId="email" size="medium">
            <FormControl
                autoFocus
                type="email"
                placeholder="Email"
                value={email}
                onChange={this.handleChange}
            />
            </FormGroup>
            <FormGroup controlId="username" size="medium">
            <FormControl
                autoFocus
                type="name"
                placeholder="Username"
                value={username}
                onChange={this.handleChange}
            />
            </FormGroup>
            <FormGroup controlId="password" size="medium">
            <FormControl
                value={password}
                placeholder="Password"
                onChange={this.handleChange}
                type="password"
            />
            </FormGroup>
            <FormGroup controlId="cpassword" size="medium">
            <FormControl
                value={cpassword}
                placeholder="Confirm password"
                onChange={this.handleChange}
                type="password"
            />
            </FormGroup>
            <FormGroup controlId="islandCode" size="medium">
            <FormControl
                type="text"
                placeholder="Island code"
                value={islandCode}
                onChange={this.handleChange}
            />
            </FormGroup>
            <Button onClick={this.send} block size="medium" type="submit">
            Sign up
            </Button>
        </div>
    </div>
    );
  }
}