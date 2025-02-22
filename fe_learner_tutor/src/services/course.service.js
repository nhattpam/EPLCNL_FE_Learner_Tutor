import axios from "axios";

// const API_URL = "https://localhost:7215/api";
import { API_URL } from './apiConfig';  // Adjust the path as necessary


class CourseService {

  token = '';

  setToken(token) {
    this.token = token;
  }

  savecourse(course) {
    return axios.post(API_URL + "/courses/", course, {
      headers: {
        Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
      }
    });
  }

  getAllcourse() {
    return axios.get(API_URL + "/courses", {
      headers: {
        Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
      }
    });
  }



  updateCourse(id, course) {
    return axios.put(API_URL + "/courses/" + id, course, {
      headers: {
        Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
      }
    });
  }


  getCourseById(id) {
    return axios.get(API_URL + "/courses/" + id, {
      headers: {
        Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
      }
    });
  }

  getAllModulesByCourse(id) {
    const url = `${API_URL}/courses/${id}/modules`; // Construct the URL string
    return axios.get(url, {
      headers: {
        Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
      }
    });
  }


  getAllClassModulesByCourse(id) {
    return axios.get(`${API_URL}/courses/${id}/class-modules`, {
      headers: {
        Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
      }
    });
  }



  uploadImage(course) {
    return axios.post(API_URL + "/courses/image/", course, {
      headers: {
        Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
      }
    });
  }

  getAllEnrollmentsByCourse(id) {
    const url = `${API_URL}/courses/${id}/enrollments`; // Construct the URL string
    return axios.get(url, {
      headers: {
        Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
      }
    });
  }

  getAllFeedbacksByCourse(id) {
    const url = `${API_URL}/courses/${id}/feedbacks`; // Construct the URL string
    return axios.get(url, {
      headers: {
        Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
      }
    });
  }

  getCertificateByCourse(id) {
    const url = `${API_URL}/courses/${id}/certificates`; // Construct the URL string
    return axios.get(url, {
      headers: {
        Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
      }
    });
  }



}
export default new CourseService;