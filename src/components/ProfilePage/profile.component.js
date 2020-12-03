import React, { Component } from "react";
import {BrowserRouter, Link, Redirect, Route, Switch} from "react-router-dom";
import AuthService from "../../services/auth.service";
import Tasks from "../TaskPage/task.component";
import AddTask from "../AddTaskPage/addtask.component";

export default class Profile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      redirect: null,
      userReady: false,
      currentUser: { name: "" }
    };
  }

  componentDidMount() {
    const currentUser = AuthService.getCurrentUser();
    if (!currentUser) this.setState({ redirect: "/home" });
    this.setState({ currentUser: currentUser, userReady: true })
  }

  render() {
    if (this.state.redirect) {
      return <Redirect to={this.state.redirect} />
    }

    return (
      <div className="container">
        {(this.state.userReady) ?
        <div>
          <BrowserRouter>
              <Link to={"/tasks"}>
                To do list
              </Link>
            <Link to={"/newTask"}>
              Add new task
            </Link>
            <Switch>
              <Route exact path="/tasks" component={Tasks} />
              <Route exact path="/newTask" component={AddTask} />
            </Switch>
          </BrowserRouter>
      </div>: null}
      </div>
    );
  }
}
