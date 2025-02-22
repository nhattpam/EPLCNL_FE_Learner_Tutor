import axios from "axios";

// const API_URL = "https://localhost:7215/api";
import { API_URL } from './apiConfig';  // Adjust the path as necessary

class EnrollmentService {
    token = '';

    setToken(token) {
        this.token = token;
    }

    saveEnrollment(enrollment) {
        return axios.post(API_URL + "/enrollments/", enrollment, {
            headers: {
                Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
            }
        });
    }

    getEnrollmentByLearnerIdAndCourseId(learnerId, courseId) {
        return axios.get(API_URL + `/enrollments/learners/${learnerId}/courses/${courseId}`, {
          headers: {
            Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
          }
        });
      }

      getEnrollmentById(id) {
        return axios.get(API_URL + "/enrollments/" + id, {
          headers: {
            Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
          }
        });
      }

      getCourseScoreByEnrollmentId(id) {
        return axios.get(API_URL + `/enrollments/${id}/course-score`, {
          headers: {
            Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
          }
        });
      }

      getLearningScoreByEnrollmentId(id) {
        return axios.get(API_URL + `/enrollments/${id}/learning-score`, {
          headers: {
            Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
          }
        });
      }
    
}

export default new EnrollmentService;