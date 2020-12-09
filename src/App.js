import React, { Component } from "react";
import { BrowserRouter, Switch, Route, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import logo from './static/logo.png';

import AuthService from "./services/auth.service";

import Login from "./components/LoginPage/login.component";
import Register from "./components/RegisterPage/register.component";
import Home from "./components/HomePage/home.component";
import Tasks from "./components/TaskPage/task.component"

class App extends Component {

    constructor(props) {
        super(props);
        this.logOut = this.logOut.bind(this);

        this.state = {
            currentUser: undefined
        };
    }

    componentDidMount() {
        const user = AuthService.getCurrentUser();

        if (user) {
            this.setState({
                currentUser: user,
                // showAdminBoard: user.roles.includes("admin"),
            });
        }
    }

    logOut() {
        AuthService.logout();
    }

    render() {
        const { currentUser } = this.state;

        return (
            <BrowserRouter>
                <div>
                    <nav className="nav navbar navbar-expand">
                        <Link to={"/home"} className="navbar-brand">
                            <img
                                src={logo}
                                alt="MyList"
                            />
                        </Link>

                        {currentUser ? (
                            <div className="navbar-nav ml-auto">
                                <li className="nav-item">
                                    <Link to={"/tasks"} className="nav-link">
                                        {currentUser.username}
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <a href="/login" className="nav-link" onClick={this.logOut}>
                                        LogOut
                                    </a>
                                </li>
                            </div>
                        ) : (
                            <div className="navbar-nav ml-auto">
                                <li className="nav-item">
                                    <Link to={"/login"} className="nav-link">
                                        Login
                                    </Link>
                                </li>

                                <li className="nav-item">
                                    <Link to={"/register"} className="nav-link">
                                        Sign Up
                                    </Link>
                                </li>
                            </div>
                        )}
                    </nav>
                    <div>
                        <Switch>
                            <Route exact path={["/", "/home"]} component={Home} />
                            <Route exact path="/login" component={Login} />
                            <Route exact path="/register" component={Register} />
                            <Route exact path="/tasks" component={Tasks} />
                        </Switch>
                    </div>
                </div>
            </BrowserRouter>
        )
    }
}

export default App;
