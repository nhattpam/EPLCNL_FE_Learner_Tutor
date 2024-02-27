import axios from "axios";

// const API_URL = "https://localhost:7215/api";
const API_URL = "https://nhatpmse.twentytwo.asia/api";

class EnrollmentService {
    token = '';

    setToken(token) {
        this.token = token;
    }

    saveEnrollment(enrollment) {
        return axios.post(API_URL + "/enrollments/", enrollment, {
            headers: {
                Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
            }
        });
    }
}

export default new EnrollmentService;