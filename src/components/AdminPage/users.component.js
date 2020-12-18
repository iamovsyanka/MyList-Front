import React from "react";
import AdminService from "../../services/admin.service";
import axios from 'axios';
import authHeader from '../../services/auth-header';
import {Card, Table, ButtonGroup, Button, InputGroup, FormControl} from 'react-bootstrap';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faList, faTrash, faStepBackward, faFastBackward, faStepForward, faFastForward, faSearch, faTimes} from '@fortawesome/free-solid-svg-icons';
import ErrorBoundary from "../ErrorPage/error.component";

const API_URL = 'http://localhost:8080/api/admin/';

export default class UserList extends React.Component {
    constructor(props) {
        super(props);
        this.deleteUser = this.deleteUser.bind(this);

        this.state = {
            list: [],
            search : '',
            currentPage : 1,
            usersPerPage : 5,
            sortDir: "asc",
            sortBy: "name"
        };
    }

    componentDidMount() {
        this.findAllUsers(this.state.currentPage);
    }

    findAllUsers(currentPage) {
        currentPage -= 1;

        return axios.get(
            API_URL + 'list?page='+currentPage
            + "&size=" + this.state.usersPerPage
            + "&sortBy=" + this.state.sortBy
            + "&sortDir="+this.state.sortDir,
            { headers: authHeader() })
            .then(response => response.data)
            .then((data) => {
                this.setState({
                    list: data.content,
                    totalPages: data.totalPages,
                    totalElements: data.totalElements,
                    currentPage: data.number + 1
                });
            });
    };

    deleteUser(userId) {
        AdminService.deleteUser(userId).then((response) => {
            const list = this.state.list.filter((user) => user.id !== userId);
            this.setState({
                list: list
            });
        });
    };

    cancelSearch = () => {
        this.setState({"search" : ''});
        this.findAllUsers(this.state.currentPage);
    };

    searchData = currentPage => {
        currentPage -= 1;
        axios.get(
            API_URL+"search/"+this.state.search+"?page="+currentPage+"&size="+this.state.usersPerPage,
            { headers: authHeader() })
            .then(response => response.data)
            .then((data) => {
                this.setState({
                    list: data.content,
                    totalPages: data.totalPages,
                    totalElements: data.totalElements,
                    currentPage: data.number + 1
                });
            });
    };

    changePage = event => {
        let targetPage = parseInt(event.target.value);
        this.state.search ?
            this.searchData(targetPage) :
            this.findAllUsers(targetPage);
        this.setState({
            [event.target.name]: targetPage
        });
    };

    firstPage = () => {
        let firstPage = 1;
        if(this.state.currentPage > firstPage) {
            this.state.search ?
                this.searchData(firstPage) :
                this.findAllUsers(firstPage);
        }
    };

    prevPage = () => {
        let prevPage = 1;
        if(this.state.currentPage > prevPage) {
            if(this.state.search) {
                this.searchData(this.state.currentPage - prevPage);
            } else {
                this.findAllUsers(this.state.currentPage - prevPage);
            }
        }
    };

    lastPage = () => {
        let condition = Math.ceil(this.state.totalElements / this.state.usersPerPage);
        if(this.state.currentPage < condition) {
            if(this.state.search) {
                this.searchData(condition);
            } else {
                this.findAllUsers(condition);
            }
        }
    };

    nextPage = () => {
        if(this.state.currentPage < Math.ceil(this.state.totalElements / this.state.usersPerPage)) {
            if(this.state.search) {
                this.searchData(this.state.currentPage + 1);
            } else {
                this.findAllUsers(this.state.currentPage + 1);
            }
        }
    };

    searchChange = event => {
        this.setState({
            [event.target.name] : event.target.value
        });
    };

    render() {
        const {list, currentPage, totalPages, search} = this.state;

        return (
            <div>
                <ErrorBoundary>
                <Card className={"border"}>
                    <Card.Header>
                        <div style={{"float":"left"}}>
                            <FontAwesomeIcon icon={faList} /> Users list
                        </div>
                        <div style={{"float":"right"}}>
                            <ButtonGroup>
                                    <InputGroup>
                                        <FormControl placeholder="Search" name="search" value={search}
                                                     className="info-border"
                                                     onChange={this.searchChange}/>
                                        <InputGroup.Append className="info-border">
                                            <Button size="sm" variant="outline-info" type="button" onClick={this.searchData}>
                                                <FontAwesomeIcon icon={faSearch}/>
                                            </Button>
                                            <Button size="sm" variant="outline-danger" type="button" onClick={this.cancelSearch}>
                                                <FontAwesomeIcon icon={faTimes} />
                                            </Button>
                                        </InputGroup.Append>
                                    </InputGroup>
                            </ButtonGroup>
                        </div>
                    </Card.Header>
                    <Card.Body>
                        <Table bordered hover>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                            {
                                list.length === 0 ?
                                    <tr align="center">
                                        <td colSpan="7">No user Available.</td>
                                    </tr> :
                                    list.map((user) => (
                                        <tr key={user.id}>
                                            <td>{user.id}</td>
                                            <td>{user.name}</td>
                                            <td>{user.email}</td>
                                            <td>
                                                <ButtonGroup>
                                                     <Button size="sm" variant="outline-danger" onClick={() => {
                                                        this.deleteUser(user.id)}}><FontAwesomeIcon icon={faTrash} /></Button>
                                                </ButtonGroup>
                                            </td>
                                        </tr>
                                    ))
                            }
                            </tbody>
                        </Table>
                    </Card.Body>
                    {list.length > 0 ?
                        <Card.Footer>
                            <div style={{"float":"left"}}>
                                Showing Page {currentPage} of {totalPages}
                            </div>
                            <div style={{"float":"right"}}>
                                <InputGroup size="sm">
                                    <InputGroup.Prepend>
                                        <Button type="button" variant="outline-info" disabled={currentPage === 1}
                                                onClick={this.firstPage}>
                                            <FontAwesomeIcon icon={faFastBackward} /> First
                                        </Button>
                                        <Button type="button" variant="outline-info" disabled={currentPage === 1}
                                                onClick={this.prevPage}>
                                            <FontAwesomeIcon icon={faStepBackward} /> Prev
                                        </Button>
                                    </InputGroup.Prepend>
                                    <FormControl className={"page-num"} name="currentPage" value={currentPage}
                                                 onChange={this.changePage}/>
                                    <InputGroup.Append>
                                        <Button type="button" variant="outline-info" disabled={currentPage === totalPages}
                                                onClick={this.nextPage}>
                                            <FontAwesomeIcon icon={faStepForward} /> Next
                                        </Button>
                                        <Button type="button" variant="outline-info" disabled={currentPage === totalPages}
                                                onClick={this.lastPage}>
                                            <FontAwesomeIcon icon={faFastForward} /> Last
                                        </Button>
                                    </InputGroup.Append>
                                </InputGroup>
                            </div>
                        </Card.Footer> : null
                    }
                </Card>
                </ErrorBoundary>
            </div>
        );
    }
}
