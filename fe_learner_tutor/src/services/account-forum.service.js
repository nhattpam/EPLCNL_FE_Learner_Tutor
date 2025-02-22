import axios from "axios";

// const API_URL = "https://localhost:7215/api";
import { API_URL } from './apiConfig';  // Adjust the path as necessary


class AccountForumService {

  token = '';

  setToken(token) {
    this.token = token;
  }

  saveAccountForum(accForum) {
    return axios.post(API_URL + "/account-forums/", accForum, {
      headers: {
        Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
      }
    });
  }

  
}
export default new AccountForumService;