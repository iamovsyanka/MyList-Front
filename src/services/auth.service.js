import axios from "axios";

const API_URL = "http://localhost:8080/api/";

class AuthService {
  login(name, password) {
    return axios
      .post(API_URL + "login", {
        name,
        password
      })
      .then(response => {
        if (response.data.accessToken) {
          localStorage.setItem("user", JSON.stringify(response.data));
        }

        return response.data;
      });
  }

  logout() {
    localStorage.removeItem("user");
  }

  register(name, password, repeatPassword) {
    return axios.post(API_URL + "register", {
      name,
      password, repeatPassword
    });
  }

  getCurrentUser() {
    return JSON.parse(localStorage.getItem('username'));
  }
}

export default new AuthService();
