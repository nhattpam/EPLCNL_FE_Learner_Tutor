import axios from "axios";

const API_URL = "https://localhost:7215/api";

class CenterService {

  token = '';

  saveCenter(center) {
    return axios.post(API_URL + "/centers/", center);
  }


  
}
export default new CenterService;