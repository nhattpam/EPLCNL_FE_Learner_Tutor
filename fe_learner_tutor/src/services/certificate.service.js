import axios from "axios";

// const API_URL = "https://localhost:7215/api";
import { API_URL } from './apiConfig';  // Adjust the path as necessary

class CertificateService {

  token = '';

  setToken(token) {
    this.token = token;
  }
  saveCertificate(certificate) {
    return axios.post(API_URL + "/certificates/", certificate, {
      headers: {
        Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
      }
    });
  }
  getAllCertificate() {
    return axios.get(API_URL + "/certificates", {
      headers: {
        Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
      }
    });
  }


  updateCertificate(id, certificate) {
    return axios.put(API_URL + "/certificates/" + id, certificate, {
      headers: {
        Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
      }
    });
  }


  getCertificateById(id) {
    return axios.get(API_URL + "/certificates/" + id, {
      headers: {
        Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
      }
    });
  }

  
}
export default new CertificateService;