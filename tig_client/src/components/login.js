import React from 'react';
import '../styles/login.css';
import { Button, FormGroup, FormControl } from "react-bootstrap";
import API from "../utils/API";


export class Login extends React.Component {

    state = {
        email: "",
        password: ""
    };

    send = async () => {
        const { email, password } = this.state;
        if (!email || email.length === 0) {
          return;
        }
        if (!password || password.length === 0) {
          return;
        }
        try {
          const { data } = await API.login(email, password);
          localStorage.setItem("token", data.token);
          window.location = "/home";
        } catch (error) {
          console.error(error);
        }
      };
    
    handleChange = (event) => {
        this.setState({
            [event.target.id]: event.target.value
        });
    };

    forgotPass = () => {
        window.location = "/renewPassword";
    }

    signUp = () => {
        window.location = "/signup"
    }

    render() {
        const { email, password } = this.state;
        return (
            <div className="container-fluid">
            <h1>The Islander's Guide</h1>
            <div className="login_div">
                <h2 className="display-6">Login</h2>
                <FormGroup controlId="email" size="medium">
                <FormControl
                    autoFocus
                    type="email"
                    placeholder="Email"
                    value={email}
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
                <Button onClick={this.send} block size="medium" type="submit">
                Submit
                </Button>
                <div className="links">
                    <Button onClick={this.forgotPass} variant="link" size="small">Forgot password?</Button>
                    <Button onClick={this.signUp} block size="small" variant="link">New here? Sign up!</Button>
                </div>
            </div>
            </div>
        
        );
    }

}