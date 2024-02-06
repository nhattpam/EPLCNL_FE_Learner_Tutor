import axios from "axios";

// const API_URL = "https://localhost:7215/api";
const API_URL = "https://nhatpmse.twentytwo.asia/api";


class ForumService {

  token = '';

  setToken(token) {
    this.token = token;
  }
  saveForum(forum) {
    return axios.post(API_URL + "/forums/", forum, {
      headers: {
        Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
      }
    });
  }
  getAllForum() {
    return axios.get(API_URL + "/forums", {
      headers: {
        Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
      }
    });
  }


  updateForum(id, forum) {
    return axios.put(API_URL + "/forums/" + id, forum, {
      headers: {
        Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
      }
    });
  }


  getForumById(id) {
    return axios.get(API_URL + "/forums/" + id, {
      headers: {
        Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
      }
    });
  }

  getAllClassForumsByForum(id) {
    return axios.get(`${API_URL}/forums/${id}/account-forums`, {
      headers: {
        Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
      }
    });
  }
}
export default new ForumService;