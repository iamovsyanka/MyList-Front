import React, { Component } from "react";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";

import AuthService from "../../services/auth.service";
import './login.css'
import login from '../../static/login.jpg';

const required = value => {
  if (!value) {
    return (
      <div className="alert alert-danger" role="alert">
        This field is required!
      </div>
    );
  }
};

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.handleLogin = this.handleLogin.bind(this);
    this.onChangeUsername = this.onChangeUsername.bind(this);
    this.onChangePassword = this.onChangePassword.bind(this);

    this.state = {
      name: "",
      password: "",
      loading: false,
      message: ""
    };
  }

  onChangeUsername(e) {
    this.setState({
      name: e.target.value
    });
  }

  onChangePassword(e) {
    this.setState({
      password: e.target.value
    });
  }

  handleLogin(e) {
    e.preventDefault();

    this.setState({
      message: "",
      loading: true
    });

    this.form.validateAll();

    if (this.checkBtn.context._errors.length === 0) {
      AuthService.login(this.state.name, this.state.password).then(
        () => {
          this.props.history.push("/profile");
          window.location.reload();
        },
        error => {
          const resMessage =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString();

          this.setState({
            loading: false,
            message: resMessage
          });
        }
      );
    } else {
      this.setState({
        loading: false
      });
    }
  }

  render() {
    return (
        <div className="base-container">
          <div className="content">
            <div className="image">
              <img
                  src={login}
                  alt="profile-img"
              />
            </div>

            <Form
                onSubmit={this.handleLogin}
                ref={(c) => {
                  this.form = c;
                }}
            >
              <div className="form">
                <div className="form-group">
                  <label htmlFor="name">Username</label>
                  <Input
                      type="text"
                      name="name"
                      value={this.state.name}
                      onChange={this.onChangeUsername}
                      validations={[required]}
                  />
                </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <Input
                    type="password"
                    name="password"
                    value={this.state.password}
                    onChange={this.onChangePassword}
                    validations={[required]}
                />
              </div>

              <div className="form-group">
                <button
                    className="button"
                    disabled={this.state.loading}
                >
                  {this.state.loading && (
                      <span className="spinner-border spinner-border-sm"/>
                  )}
                  <span>Login</span>
                </button>
              </div>

              {this.state.message && (
                  <div className="form-group">
                    <div className="alert alert-danger" role="alert">
                      {this.state.message}
                    </div>
                  </div>
              )}
              <CheckButton
                  style={{ display: "none" }}
                  ref={(c) => {
                    this.checkBtn = c;
                  }}
              />
              </div>
            </Form>
          </div>
        </div>
    )
  }
}
