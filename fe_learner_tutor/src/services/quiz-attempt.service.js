import axios from "axios";

// const API_URL = "https://localhost:7215/api";
const API_URL = "https://nhatpmse.twentytwo.asia/api";



class QuizAttemptService {

  token = '';

  setToken(token) {
    this.token = token;
  }

  saveQuizAttempt(quizAttempt) {
    return axios.post(API_URL + "/quiz-attempts/", quizAttempt, {
      headers: {
        Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
      }
    });
  }
 
  getAllQuizAttempt() {
    return axios.get(API_URL + "/quiz-attempts", {
      headers: {
        Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
      }
    });
  }

  updateQuizAttempt(id, quizAttempt) {
    return axios.put(API_URL + "/quiz-attempts/" + id, quizAttempt, {
      headers: {
        Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
      }
    });
  }


  getQuizAttemptById(id) {
    return axios.get(API_URL + "/quiz-attempts/" + id, {
      headers: {
        Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
      }
    });
  }


 

}
export default new QuizAttemptService;