import axios from 'axios';
import authHeader from './auth-header';

const API_URL = 'http://localhost:8080/api/tasks/';

class TaskService {
    getAllTasks() {
        return axios.get(API_URL + 'list', { headers: authHeader() });
    }

    getTask(id) {
        return axios.get(API_URL + `${id}`, { headers: authHeader() });
    }

    addTask(name, description, dateOfDeadline) {
        return axios.post(API_URL + 'newTask',
            { name, description, dateOfDeadline },
            { headers: authHeader() });
    }

    deleteTask(id) {
        return axios.delete(API_URL + `${id}`, { headers: authHeader() });
    }
}

export default new TaskService();
