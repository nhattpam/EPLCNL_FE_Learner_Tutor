import axios from "axios";

const API_URL = "https://localhost:7215/api";


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
  


  updatecourse(id, course) {
    return axios.put(API_URL + "/courses/" + id, course, {
      headers: {
        Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
      }
    });
  }


  getcourseById(id) {
    return axios.get(API_URL + "/courses/" + id, {
      headers: {
        Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
      }
    });
  }

  getAllCoursesBycourse(id) {
    return axios.get(`${API_URL}/courses/${id}/courses`, {
      headers: {
        Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
      }
    });
  }
}
export default new CourseService;