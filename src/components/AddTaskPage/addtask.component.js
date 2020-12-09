import React, { Component } from "react";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";

import TaskService from "../../services/task.service";

const required = value => {
    if (!value) {
        return (
            <div className="alert alert-danger" role="alert">
                This field is required!
            </div>
        );
    }
};

export default class AddTask extends Component {
    constructor(props) {
        super(props);
        this.handleAddTask = this.handleAddTask.bind(this);
        this.onChangeName = this.onChangeName.bind(this);
        this.onChangeDescription = this.onChangeDescription.bind(this);
        this.onChangeDateOfDeadline = this.onChangeDateOfDeadline.bind(this);

        this.state = {
            name: "",
            description: "",
            dateOfDeadline: null,
            message: ""
        };
    }

    onChangeName(e) {
        this.setState({
            name: e.target.value
        });
    }

    onChangeDescription(e) {
        this.setState({
            description: e.target.value
        });
    }

    onChangeDateOfDeadline(e) {
        this.setState({
            dateOfDeadline: e.target.value
        });
    }

    handleAddTask(e) {
        e.preventDefault();

        this.setState({
            message: ""
        });

        this.form.validateAll();

        if (this.checkBtn.context._errors.length === 0) {
            TaskService.addTask(this.state.name, this.state.password, this.state.dateOfDeadline).then(
                () => {
                    this.props.history.push("/tasks");
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
                    <Form
                        onSubmit={this.handleAddTask}
                        ref={(c) => {
                            this.form = c;
                        }}
                    >
                        <div className="form">
                            <div className="form-group">
                                <label htmlFor="name">Name</label>
                                <Input
                                    type="text"
                                    name="name"
                                    value={this.state.name}
                                    onChange={this.onChangeName}
                                    validations={[required]}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="description">Description</label>
                                <Input
                                    type="text"
                                    name="description"
                                    value={this.state.description}
                                    onChange={this.onChangeDescription}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="dateOfDeadline">Date of deadline</label>
                                <Input
                                    type="date"
                                    name="dateOfDeadline"
                                    value={this.state.dateOfDeadline}
                                    onChange={this.onChangeDateOfDeadline}
                                />
                            </div>

                            <div className="form-group">
                                <button  className="button" >
                                    <span>Add task</span>
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
