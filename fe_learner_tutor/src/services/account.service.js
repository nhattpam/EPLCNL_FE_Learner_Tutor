import axios from "axios";

// const API_URL = "https://localhost:7215/api";
import { API_URL } from './apiConfig';  // Adjust the path as necessary

class AccountService {

  token = '';

  setToken(token) {
    this.token = token;
  }
  saveAccount(account) {
    return axios.post(API_URL + "/accounts/", account, {
      headers: {
        Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
      }
    });
  }
  getAllAccount() {
    return axios.get(API_URL + "/accounts", {
      headers: {
        Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
      }
    });
  }


  updateAccount(id, account) {
    return axios.put(API_URL + "/accounts/" + id, account, {
      headers: {
        Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
      }
    });
  }


  getAccountById(id) {
    return axios.get(API_URL + "/accounts/" + id, {
      headers: {
        Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
      }
    });
  }

  getLearnerByAccountId(id) {
    return axios.get(API_URL + `/accounts/${id}/learners`, {
      headers: {
        Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
      }
    });
  }

  sendMail(id, data) {
    return axios.post(API_URL + `/accounts/${id}/mail`, data, {
      headers: {
        Authorization: `Bearer ${this.token}`,
        'Content-Type': 'application/json', // Add this line to specify the content type
      },
    });
  }

  uploadImage(account) {
    return axios.post(API_URL + "/accounts/image/", account, {
      headers: {
        Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
      }
    });
  }

  getAllSalariesByAccount(id) {
    return axios.get(`${API_URL}/accounts/${id}/salaries`, {
      headers: {
        Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
      }
    });
  }

}
export default new AccountService;