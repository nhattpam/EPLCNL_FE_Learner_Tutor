import axios from "axios";

// const API_URL = "https://localhost:7215/api";
const API_URL = "https://nhatpmse.twentytwo.asia/api";

class CenterService {

  token = '';

  saveCenter(center) {
    return axios.post(API_URL + "/centers/", center);
  }

  getCenterById(id) {
    return axios.get(API_URL + "/centers/" + id, {
      headers: {
        Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
      }
    });
  }
  
  getAllCourseByCenterId(id) {
    return axios.get(API_URL + `/centers/${id}/courses` , {
      headers: {
        Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
      }
    });
  }

  
}
export default new CenterService;