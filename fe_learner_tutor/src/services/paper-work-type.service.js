import axios from "axios";

// const API_URL = "https://localhost:7215/api";
const API_URL = "https://nhatpmse.twentytwo.asia/api";

class PaperWorkTypeService {

  token = '';

  setToken(token) {
    this.token = token;
  }
  savePaperWorkType(paperWorkType) {
    return axios.post(API_URL + "/paper-work-types/", paperWorkType, {
      headers: {
        Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
      }
    });
  }
  getAllPaperWorkType() {
    return axios.get(API_URL + "/paper-work-types", {
      headers: {
        Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
      }
    });
  }


  updatePaperWorkType(id, paperWorkType) {
    return axios.put(API_URL + "/paper-work-types/" + id, paperWorkType, {
      headers: {
        Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
      }
    });
  }


  getPaperWorkTypeById(id) {
    return axios.get(API_URL + "/paper-work-types/" + id, {
      headers: {
        Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
      }
    });
  }

  
}
export default new PaperWorkTypeService;