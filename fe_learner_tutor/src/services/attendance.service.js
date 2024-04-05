import axios from "axios";

// const API_URL = "https://localhost:7215/api";
const API_URL = "https://nhatpmse.twentytwo.asia/api";

class AttendanceService {

  token = '';

  setToken(token) {
    this.token = token;
  }
 
  getAllLearnerAttendanceByAttendance(id) {
    return axios.get(API_URL + `/attendances/${id}/learner-attendances` , {
      headers: {
        Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
      }
    });
  }
  
}
export default new AttendanceService;