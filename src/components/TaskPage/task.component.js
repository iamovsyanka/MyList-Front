import React from "react";
import TaskService from "../../services/task.service";
import axios from 'axios';
import "./style.css"
import authHeader from '../../services/auth-header';
// eslint-disable-next-line no-unused-vars
import {Card, Table, Image, ButtonGroup, Button, InputGroup, FormControl} from 'react-bootstrap';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
// eslint-disable-next-line no-unused-vars
import {faList, faEdit, faTrash, faStepBackward, faFastBackward, faStepForward, faFastForward, faSearch, faTimes} from '@fortawesome/free-solid-svg-icons';

const API_URL = 'http://localhost:8080/api/tasks/';

export default class TaskList extends React.Component {
    constructor(props) {
        super(props);
        this.deleteTask = this.deleteTask.bind(this);

        this.state = {
            list: [],
            search : '',
            currentPage : 1,
            tasksPerPage : 5,
            sortDir: "asc"
        };
    }

    componentDidMount() {
        this.findAllTasks(this.state.currentPage);
    }

    sortData = () => {
        setTimeout(() => {
            this.state.sortDir === "asc" ? this.setState({sortDir: "desc"}) : this.setState({sortDir: "asc"});
            this.findAllTasks(this.state.currentPage);
        }, 500);
    };

    findAllTasks(currentPage) {
        currentPage -= 1;

        return axios.get(
            API_URL + 'list?page='+currentPage+"&size="+this.state.tasksPerPage+"&sortBy=name&sortDir="+this.state.sortDir,
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

    cancelSearch = () => {
        this.setState({"search" : ''});
        this.findAllTasks(this.state.currentPage);
    };

    searchData = currentPage => {
        currentPage -= 1;
        axios.get(
            API_URL+"search/"+this.state.search+"?page="+currentPage+"&size="+this.state.tasksPerPage,
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
            this.findAllTasks(targetPage);
        this.setState({
            [event.target.name]: targetPage
        });
    };

    firstPage = () => {
        let firstPage = 1;
        if(this.state.currentPage > firstPage) {
            this.state.search ?
                this.searchData(firstPage) :
                this.findAllTasks(firstPage);
        }
    };

    prevPage = () => {
        let prevPage = 1;
        if(this.state.currentPage > prevPage) {
            if(this.state.search) {
                this.searchData(this.state.currentPage - prevPage);
            } else {
                this.findAllTasks(this.state.currentPage - prevPage);
            }
        }
    };

    lastPage = () => {
        let condition = Math.ceil(this.state.totalElements / this.state.tasksPerPage);
        if(this.state.currentPage < condition) {
            if(this.state.search) {
                this.searchData(condition);
            } else {
                this.findAllTasks(condition);
            }
        }
    };

    nextPage = () => {
        if(this.state.currentPage < Math.ceil(this.state.totalElements / this.state.tasksPerPage)) {
            if(this.state.search) {
                this.searchData(this.state.currentPage + 1);
            } else {
                this.findAllTasks(this.state.currentPage + 1);
            }
        }
    };

    searchChange = event => {
        this.setState({
            [event.target.name] : event.target.value
        });
    };

    deleteTask(taskId) {
        TaskService.deleteTask(taskId).then((response) => {
            const list = this.state.list.filter((task) => task.id !== taskId);
            this.setState({
                list: list
            });
        });
    }

    render() {
        const {list, currentPage, totalPages, search} = this.state;

        return (
            <div>
                <Card className={"border"}>
                    <Card.Header>
                        <div style={{"float":"left"}}>
                            <FontAwesomeIcon icon={faList} /> To do list
                        </div>
                        <div style={{"float":"right"}}>
                            <InputGroup size="sm">
                                <FormControl placeholder="Search" name="search" value={search}
                                             className={"info-border"}
                                             onChange={this.searchChange}/>
                                <InputGroup.Append>
                                    <Button size="sm" variant="outline-info" type="button" onClick={this.searchData}>
                                        <FontAwesomeIcon icon={faSearch}/>
                                    </Button>
                                    <Button size="sm" variant="outline-danger" type="button" onClick={this.cancelSearch}>
                                        <FontAwesomeIcon icon={faTimes} />
                                    </Button>
                                </InputGroup.Append>
                            </InputGroup>
                        </div>
                    </Card.Header>
                    <Card.Body>
                        <Table bordered hover striped>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Date of creation</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                            {
                                list.length === 0 ?
                                    <tr align="center">
                                        <td colSpan="7">No task Available.</td>
                                    </tr> :
                                    list.map((task) => (
                                        <tr key={task.id}>
                                            <td>{task.name}</td>
                                            <td>{task.dateOfCreation}</td>
                                            <td>
                                                <ButtonGroup>
                                                    {/*<Link to={"edit/"+task.id} className="btn btn-sm btn-outline-primary"><FontAwesomeIcon icon={faEdit} /></Link>{' '}*/}
                                                    <Button size="sm" variant="outline-danger" onClick={() => {
                                                        this.deleteTask(task.id)}}><FontAwesomeIcon icon={faTrash} /></Button>
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
                                        <Button type="button" className="btn-pag" disabled={currentPage === 1}
                                                onClick={this.prevPage}>
                                            <FontAwesomeIcon icon={faStepBackward} color="pink" /> Prev
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
            </div>

            // <div>
            //
            //     <ul className="list-group">
            //         {list && list.map((task) => (
            //             <li key={task.id} className="list-group-item">
            //                 Task: <b>{task.name}</b> <br/>
            //                 Date of creation: <b>{task.dateOfCreation}</b>
            //                 <button className="btn-delete" onClick={ () => {
            //                         TaskService.deleteTask(task.id).then()
            //                     }}>
            //                         Delete
            //                         {/*<img src={trash}  alt="Delete"/>*/}
            //                 </button>
            //                 <button className="btn-delete" onClick={ () => {
            //                     TaskService.getTask(task.id)
            //                 }}>
            //                     View
            //                     {/*<img src={trash}  alt="Delete"/>*/}
            //                 </button>
            //             </li>
            //         ))}
            //     </ul>
            // </div>
        );
    }
}
