import axios from "axios";

// const API_URL = "https://localhost:7215/api";
import { API_URL } from './apiConfig';  // Adjust the path as necessary

class CertificateCourseService {

  token = '';

  setToken(token) {
    this.token = token;
  }
  saveCertificateCourse(certificate) {
    return axios.post(API_URL + "/certificate-courses/", certificate, {
      headers: {
        Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
      }
    });
  }
  getAllCertificateCourse() {
    return axios.get(API_URL + "/certificate-courses", {
      headers: {
        Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
      }
    });
  }


  updateCertificateCourse(id, certificate) {
    return axios.put(API_URL + "/certificate-courses/" + id, certificate, {
      headers: {
        Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
      }
    });
  }


  getCertificateCourseById(id) {
    return axios.get(API_URL + "/certificate-courses/" + id, {
      headers: {
        Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
      }
    });
  }

  
}
export default new CertificateCourseService;