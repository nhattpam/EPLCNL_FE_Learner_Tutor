import axios from "axios";

// const API_URL = "https://localhost:7215/api";
const API_URL = "https://nhatpmse.twentytwo.asia/api";

class FeedbackService {

  token = '';

  setToken(token) {
    this.token = token;
  }
  saveFeedback(feedback) {
    return axios.post(API_URL + "/feedbacks/", feedback, {
      headers: {
        Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
      }
    });
  }
  getAllFeedback() {
    return axios.get(API_URL + "/feedbacks", {
      headers: {
        Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
      }
    });
  }


  updateFeedback(id, feedback) {
    return axios.put(API_URL + "/feedbacks/" + id, feedback, {
      headers: {
        Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
      }
    });
  }


  getFeedbackById(id) {
    return axios.get(API_URL + "/feedbacks/" + id, {
      headers: {
        Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
      }
    });
  }

  
}
export default new FeedbackService;