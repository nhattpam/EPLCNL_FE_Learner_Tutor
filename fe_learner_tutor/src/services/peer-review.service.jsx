import axios from "axios";

// const API_URL = "https://localhost:7215/api";
import { API_URL } from './apiConfig';  // Adjust the path as necessary


class PeerReviewService {

  token = '';

  setToken(token) {
    this.token = token;
  }
  savePeerReview(peerReview) {
    return axios.post(API_URL + "/peer-reviews/", peerReview, {
      headers: {
        Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
      }
    });
  }
  getAllPeerReview() {
    return axios.get(API_URL + "/peer-reviews", {
      headers: {
        Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
      }
    });
  }


  updatePeerReview(id, peerReview) {
    return axios.put(API_URL + "/peer-reviews/" + id, peerReview, {
      headers: {
        Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
      }
    });
  }


  getPeerReviewById(id) {
    return axios.get(API_URL + "/peer-reviews/" + id, {
      headers: {
        Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
      }
    });
  }

}
export default new PeerReviewService;