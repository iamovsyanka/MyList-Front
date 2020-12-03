import React, { Component } from "react";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";

import AuthService from "../../services/auth.service";
import register from "../../static/register.jpg";
import './register.css'

const required = value => {
  if (!value) {
    return (
      <div className="alert alert-danger" role="alert">
        This field is required!
      </div>
    );
  }
};

const vusername = value => {
  if (value.length < 4 || value.length > 20) {
    return (
      <div className="alert alert-danger" role="alert">
        The name must be between 4 and 20 characters.
      </div>
    );
  }
};

const vpassword = value => {
  if (value.length < 8 || value.length > 40) {
    return (
      <div className="alert alert-danger" role="alert">
        The password must be between 8 and 40 characters.
      </div>
    );
  }
};

export default class Register extends Component {
  constructor(props) {
    super(props);
    this.handleRegister = this.handleRegister.bind(this);
    this.onChangeUsername = this.onChangeUsername.bind(this);
    this.onChangePassword = this.onChangePassword.bind(this);
    this.onChangeRepeatPassword = this.onChangeRepeatPassword.bind(this);

    this.state = {
      name: "",
      password: "",
      repeatPassword: "",
      successful: false,
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

  onChangeRepeatPassword(e) {
    this.setState({
      repeatPassword: e.target.value
    });
  }

  handleRegister(e) {
    e.preventDefault();

    this.setState({
      message: "",
      successful: false
    });

    this.form.validateAll();

    if (this.checkBtn.context._errors.length === 0) {
      AuthService.register(
          this.state.name,
          this.state.password,
          this.state.repeatPassword
      ).then(
        response => {
          this.setState({
            message: response.data.message,
            successful: true
          });
        },
        error => {
          const resMessage =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString();

          this.setState({
            successful: false,
            message: resMessage
          });
        }
      );
    }
  }

  render() {
    return (
        <div className="base-container">
          <div className="content">
            <div className="image">
              <img
                  src={register}
                  alt="profile-img"
              />
            </div>

            <Form
                onSubmit={this.handleRegister}
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
                      validations={[required, vusername]}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <Input
                      type="password"
                      name="password"
                      value={this.state.password}
                      onChange={this.onChangePassword}
                      validations={[required, vpassword]}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="repeatPassword">Repeat password</label>
                  <Input
                      type="password"
                      name="repeatPassword"
                      value={this.state.repeatPassword}
                      onChange={this.onChangeRepeatPassword}
                      validations={[required, vpassword]}
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
                    <span>Registration</span>
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
    );
  }
}
