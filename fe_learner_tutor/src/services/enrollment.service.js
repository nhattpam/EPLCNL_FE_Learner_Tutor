import axios from "axios";

// const API_URL = "https://localhost:7215/api";
const API_URL = "https://nhatpmse.twentytwo.asia/api";

class EnrollmentService {
    token = '';

    saveEnrollment(enrollment) {
        return axios.post(API_URL + "/enrollments/", enrollment);
    }

}
export default new EnrollmentService;