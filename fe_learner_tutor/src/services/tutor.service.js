import axios from "axios";

// const API_URL = "https://localhost:7215/api";
import { API_URL } from './apiConfig';  // Adjust the path as necessary


class TutorService {

  token = '';

  setToken(token) {
    this.token = token;
  }
  saveTutor(tutor) {
    return axios.post(API_URL + "/tutors/", tutor, {
      headers: {
        Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
      }
    });
  }

  getAllTutor() {
    return axios.get(API_URL + "/tutors", {
      headers: {
        Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
      }
    });
  }
  


  updateTutor(id, tutor) {
    return axios.put(API_URL + "/tutors/" + id, tutor, {
      headers: {
        Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
      }
    });
  }


  getTutorById(id) {
    return axios.get(API_URL + "/tutors/" + id, {
      headers: {
        Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
      }
    });
  }


  getAllCoursesByTutor(id) {
    return axios.get(`${API_URL}/tutors/${id}/courses`, {
      headers: {
        Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
      }
    });
  }

  getAllForumsByTutor(id) {
    return axios.get(`${API_URL}/tutors/${id}/forums`, {
      headers: {
        Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
      }
    });
  }

  getAllAssignmentAttemptsByTutor(id) {
    return axios.get(`${API_URL}/tutors/${id}/assignment-attempts`, {
      headers: {
        Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
      }
    });
  }

  getAllPaperWorksByTutor(id) {
    return axios.get(`${API_URL}/tutors/${id}/paper-works`, {
      headers: {
        Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
      }
    });
  }

  getAllEnrollmentsByTutor(id) {
    return axios.get(`${API_URL}/tutors/${id}/enrollments`, {
      headers: {
        Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
      }
    });
  }

  getAllLearnersByTutor(id) {
    return axios.get(`${API_URL}/tutors/${id}/learners`, {
      headers: {
        Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
      }
    });
  }
}
export default new TutorService;