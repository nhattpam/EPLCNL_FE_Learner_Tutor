import axios from "axios";

// const API_URL = "https://localhost:7215/api";
const API_URL = "https://nhatpmse.twentytwo.asia/api";

class PaperWorkService {

  token = '';

  setToken(token) {
    this.token = token;
  }
  savePaperWork(paperWork) {
    return axios.post(API_URL + "/paper-works/", paperWork, {
      headers: {
        Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
      }
    });
  }
  getAllPaperWork() {
    return axios.get(API_URL + "/paper-works", {
      headers: {
        Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
      }
    });
  }


  updatePaperWork(id, paperWork) {
    return axios.put(API_URL + "/paper-works/" + id, paperWork, {
      headers: {
        Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
      }
    });
  }


  getPaperWorkById(id) {
    return axios.get(API_URL + "/paper-works/" + id, {
      headers: {
        Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
      }
    });
  }

  deletePaperWorkById(id) {
    return axios.delete(API_URL + "/paper-works/" + id, {
      headers: {
        Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
      }
    });
  }

  uploadMaterial(lessonMaterial) {
    return axios.post(API_URL + "/lesson-materials/material/", lessonMaterial, {
      headers: {
        Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
      }
    });
  }

  
}
export default new PaperWorkService;