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
          if (response.data.token) {
              localStorage.setItem("user", JSON.stringify(response.data));
          }

          return response.data;
      });
  }

  logout() {
    localStorage.removeItem("user");
  }

  register(name, email, password, repeatPassword) {
    return axios.post(API_URL + "register", {
      name,
      email,
      password,
      repeatPassword
    });
  }

  getCurrentUser() {
    return JSON.parse(localStorage.getItem("user"))
  }
}

export default new AuthService();
