import axios from "axios";

// const API_URL = "https://localhost:7215/api";
const API_URL = "https://nhatpmse.twentytwo.asia/api";


class LearnerService {

  token = '';

  setToken(token) {
    this.token = token;
  }
  saveLearner(learner) {
    return axios.post(API_URL + "/learners/", learner, {
      headers: {
        Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
      }
    });
  }
  getAllLearner() {
    return axios.get(API_URL + "/learners", {
      headers: {
        Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
      }
    });
  }


  updateLearner(id, learner) {
    return axios.put(API_URL + "/learners/" + id, learner, {
      headers: {
        Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
      }
    });
  }


  getLearnerById(id) {
    return axios.get(API_URL + "/learners/" + id, {
      headers: {
        Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
      }
    });
  }

  getAllEnrollmentByLearnerId(id) {
    return axios.get(API_URL + `/learners/${id}/enrollments`, {
      headers: {
        Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
      }
    });
  }

  getAllTransactionByLearnerId(id) {
    return axios.get(API_URL + `/learners/${id}/transactions`, {
      headers: {
        Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
      }
    });
  }

  
  getAllRefundRequestByLearnerId(id) {
    return axios.get(API_URL + `/learners/${id}/refund-requests`, {
      headers: {
        Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
      }
    });
  }

  getAllForumByLearnerId(id) {
    return axios.get(API_URL + `/learners/${id}/forums`, {
      headers: {
        Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
      }
    });
  }

  getAllAssignmentAttemptByLearnerId(id) {
    return axios.get(API_URL + `/learners/${id}/assignment-attempts`, {
      headers: {
        Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
      }
    });
  }

  getAllQuizAttemptByLearnerId(id) {
    return axios.get(API_URL + `/learners/${id}/quiz-attempts`, {
      headers: {
        Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
      }
    });
  }

  getAllProfileCertificateByLearnerId(id) {
    return axios.get(API_URL + `/learners/${id}/profile-certificates`, {
      headers: {
        Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
      }
    });
  }
}
export default new LearnerService;