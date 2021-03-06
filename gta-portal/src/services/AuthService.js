import axios from 'axios';

const url = 'http://localhost:3000/api/';

export default {
    login(credentials) {
        return axios
            .post(url + 'login/', credentials)
            .then(response => response.data);
    },
    signUp(credentials) {
        return axios
            .post(url + 'register/', credentials)
            .then(response => response.data);
    },
    getSecretContent() {
        return axios.get(url + 'secret-route/').then(response => response.data);
    },
    postStudent(credentials) {
        return axios
            .post(url + 'register/student', credentials)
            .then(response => response.data);
    },
    postApp(credentials) {
        return axios
            .post(url + 'send/app', credentials)
            .then(response => response.data);
    }
};