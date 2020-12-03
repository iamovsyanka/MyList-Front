import React from "react";
import TaskService from "../../services/task.service";
import "./style.css"

export default class TaskList extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            list: [],
        };
    }

    componentDidMount() {
        TaskService.getAllTasks().then((response) => {
            this.setState({
                list: response.data
            });
        });
    }

    render() {
        const list = this.state.list;

        return (
            <div>
                <ul className="list-group">
                    {list && list.map((task) => (
                        <li key={task.id} className="list-group-item">
                            Task: <b>{task.name}</b> <br/>
                            Date of creation: <b>{task.dateOfCreation}</b>
                            <button className="btn-delete" onClick={ () => {
                                    TaskService.deleteTask(task.id).then()
                                }}>
                                    Delete
                                    {/*<img src={trash}  alt="Delete"/>*/}
                            </button>
                            <button className="btn-delete" onClick={ () => {
                                TaskService.getTask(task.id)
                            }}>
                                View
                                {/*<img src={trash}  alt="Delete"/>*/}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        );
    }
}
