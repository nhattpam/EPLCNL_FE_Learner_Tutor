import axios from "axios";

// const API_URL = "https://localhost:7215/api";
import { API_URL } from './apiConfig';  // Adjust the path as necessary

class ReportService {

  token = '';

  setToken(token) {
    this.token = token;
  }
  saveReport(report) {
    return axios.post(API_URL + "/reports/", report, {
      headers: {
        Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
      }
    });
  }
  getAllReport() {
    return axios.get(API_URL + "/reports", {
      headers: {
        Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
      }
    });
  }


  updateReport(id, report) {
    return axios.put(API_URL + "/reports/" + id, report, {
      headers: {
        Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
      }
    });
  }


  getReportById(id) {
    return axios.get(API_URL + "/reports/" + id, {
      headers: {
        Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
      }
    });
  }

  
}
export default new ReportService;