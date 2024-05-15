import axios from "axios";

// const API_URL = "https://localhost:7215/api";
import { API_URL } from './apiConfig';  // Adjust the path as necessary


class CategoryService {

  token = '';

  setToken(token) {
    this.token = token;
  }
  savecategory(category) {
    return axios.post(API_URL + "/categories/", category, {
      headers: {
        Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
      }
    });
  }

  getAllcategory() {
    return axios.get(API_URL + "/categories", {
      headers: {
        Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
      }
    });
  }
  


  updatecategory(id, category) {
    return axios.put(API_URL + "/categories/" + id, category, {
      headers: {
        Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
      }
    });
  }


  getcategoryById(id) {
    return axios.get(API_URL + "/categories/" + id, {
      headers: {
        Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
      }
    });
  }

  getAllCourseByCategoryId(id) {
    return axios.get(API_URL + `/categories/${id}/courses` , {
      headers: {
        Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
      }
    });
  }

}
export default new CategoryService;