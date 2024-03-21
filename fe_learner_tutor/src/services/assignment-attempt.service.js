import axios from "axios";

// const API_URL = "https://localhost:7215/api";
const API_URL = "https://nhatpmse.twentytwo.asia/api";



class AssignmentAttemptService {

  token = '';

  setToken(token) {
    this.token = token;
  }

  saveAssignmentAttempt(assignmentAttempt) {
    return axios.post(API_URL + "/assignment-attempts/", assignmentAttempt, {
      headers: {
        Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
      }
    });
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

  getAllPeerReviewByAssignmentAttemptId(id) {
    return axios.get(API_URL + `/assignment-attempts/${id}/peer-reviews`, {
      headers: {
        Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
      }
    });
  }

  getAllAssignmentAttemptNotGradeYetByAssignment(assignmentId, learnerId) {
    return axios.get(API_URL + `/assignment-attempts/${assignmentId}/assignments/${learnerId}/learners`, {
      headers: {
        Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
      }
    });
  }
 

}
export default new AssignmentAttemptService;