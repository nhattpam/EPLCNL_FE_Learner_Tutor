import axios from "axios";

// const API_URL = "https://localhost:7215/api";
const API_URL = "https://nhatpmse.twentytwo.asia/api";



class AssignmentAttemptService {

  token = '';

  setToken(token) {
    this.token = token;
  }
 
  getAllAssignmentAttempt() {
    return axios.get(API_URL + "/assignment-attempts", {
      headers: {
        Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
      }
    });
  }

  updateAssignmentAttempt(id, assignmentAttempt) {
    return axios.put(API_URL + "/assignment-attempts/" + id, assignmentAttempt, {
      headers: {
        Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
      }
    });
  }


  getAssignmentAttemptById(id) {
    return axios.get(API_URL + "/assignment-attempts/" + id, {
      headers: {
        Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
      }
    });
  }

 

}
export default new AssignmentAttemptService;