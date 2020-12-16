import axios from 'axios';
import authHeader from './auth-header';

const API_URL = 'http://localhost:8080/api/tasks/';

class TaskService {
    getTask(id) {
        return axios.get(API_URL + `${id}`, { headers: authHeader() });
    }

    addTask(name, description, dateOfDeadline) {
        return axios.post(API_URL + 'newTask',
            { name, description, dateOfDeadline },
            { headers: authHeader() });
    }

    editTask(id, name, description, dateOfDeadline) {
        return axios.put(API_URL + `${id}`,
            { name, description, dateOfDeadline },
            { headers: authHeader() });
    }

    deleteTask(id) {
        return axios.delete(API_URL + `${id}`, { headers: authHeader() });
    }
}

export default new TaskService();
