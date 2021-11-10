import axios from 'axios';

const API_BASE_URL = "http://localhost:8080/";


class jamService{
    login(data){
        return axios.post(API_BASE_URL+"api/login/internal", data);
    }

}
export default new jamService();