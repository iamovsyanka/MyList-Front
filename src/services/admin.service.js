import axios from 'axios';
import authHeader from './auth-header';

const API_URL = 'http://localhost:8080/api/admin/';

class AdminService {
    getUser(id) {
        return axios.get(API_URL + `${id}`, { headers: authHeader() });
    }

    deleteUser(id) {
        return axios.delete(API_URL + `${id}`, { headers: authHeader() });
    }

}

export default new AdminService();
