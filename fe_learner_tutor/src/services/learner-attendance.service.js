import axios from "axios";

// const API_URL = "https://localhost:7215/api";
import { API_URL } from './apiConfig';  // Adjust the path as necessary

class LearnerAttendanceService {

  token = '';

  setToken(token) {
    this.token = token;
  }
  saveLearnerAttendance(learnerAttendance) {
    return axios.post(API_URL + "/learner-attendances/", learnerAttendance, {
      headers: {
        Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
      }
    });
  }
  getAllLearnerAttendance() {
    return axios.get(API_URL + "/learner-attendances", {
      headers: {
        Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
      }
    });
  }


  updateLearnerAttendance(id, learnerAttendance) {
    return axios.put(API_URL + "/learner-attendances/" + id, learnerAttendance, {
      headers: {
        Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
      }
    });
  }


  getLearnerAttendanceById(id) {
    return axios.get(API_URL + "/learner-attendances/" + id, {
      headers: {
        Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
      }
    });
  }
  
}
export default new LearnerAttendanceService;