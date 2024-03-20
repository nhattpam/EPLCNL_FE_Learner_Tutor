import axios from "axios";

// const API_URL = "https://localhost:7215/api";
const API_URL = "https://nhatpmse.twentytwo.asia/api";



class TransactionService {

  token = '';

  setToken(token) {
    this.token = token;
  }
  saveTransaction(transaction) {
    return axios.post(API_URL + "/transactions/", transaction, {
      headers: {
        Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
      }
    });
  }
  getAllTransaction() {
    return axios.get(API_URL + "/transactions", {
      headers: {
        Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
      }
    });
  }


  updateTransaction(id, transaction) {
    return axios.put(API_URL + "/transactions/" + id, transaction, {
      headers: {
        Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
      }
    });
  }


  getTransactionById(id) {
    return axios.get(API_URL + "/transactions/" + id, {
      headers: {
        Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
      }
    });
  }

  payTransaction(id){
    return axios.post(API_URL + `/transactions/${id}/pay`, {
      headers: {
        Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
      }
    });
  }

  payByWallet(id){
    return axios.post(API_URL + `/transactions/${id}/wallet-payment`, {
      headers: {
        Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
      }
    });
  }

  
  
 

}
export default new TransactionService;