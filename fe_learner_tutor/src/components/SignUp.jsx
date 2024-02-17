import React, { useState } from 'react'
import Header from './Header';
import Footer from './Footer';
import accountService from '../services/account.service';
import learnerService from '../services/learner.service';
import tutorService from '../services/tutor.service';

const SignUp = () => {


  const [tutor, setTutor] = useState({
    accountId: "",
    isFreelancer: true,
  });

  const [learner, setLearner] = useState({
    accountId: "",
  });


  const [account, setAccount] = useState({
    email: "",
    password: "",
    fullName: "",
    phoneNumber: "",
    roleId: "",
    isActive: false
  });


  const [errors, setErrors] = useState({});
  const [msg, setMsg] = useState("");
  const [showNotification, setShowNotification] = useState(false);



  const handleChange = (e) => {
    const value = e.target.value;
    setAccount({ ...account, [e.target.name]: value });
  }

  const validateForm = () => {
    let isValid = true;
    const errors = {};

    if (account.fullName.trim() === '') {
      errors.fullName = 'Full Name is required';
      isValid = false;
    }

    if (account.phoneNumber.trim() === '') {
      errors.phoneNumber = 'Phone Number is required';
      isValid = false;
    }

    if (account.password.trim() === '') {
      errors.password = 'Password is required';
      isValid = false;
    }
    setErrors(errors);
    return isValid;
  };


  const submitAccount = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      // Determine user type based on radio button selection
      let roleId = "";
      if (document.getElementById("learner").checked) {
        roleId = "f3db0ef2-7f03-4728-a868-aacbe76891a8";
      } else if (document.getElementById("tutor").checked) {
        roleId = "1dc7ed61-a13d-4cfc-9e3e-2159f61bad3b";
        account.isActive = false;
      }
  
      try {
        account.roleId = roleId;
        console.log("this is a cccc: " + JSON.stringify(account))
        const res = await accountService.saveAccount(account);
        console.log("Account created:", res.data);
  
        if (document.getElementById("learner").checked) {
          learner.accountId = res.data.id;
          await learnerService.saveLearner(learner);
        } else if (document.getElementById("tutor").checked) {
          tutor.accountId = res.data.id;
          await tutorService.saveTutor(tutor);
        }
  
        setMsg("Thanks for joining us. Sign In!");
        setShowNotification(true);
        
        // Reset form fields
        setAccount({
          email: "",
          password: "",
          fullName: "",
          phoneNumber: "",
          roleId: "",
          isActive: true
        });
        setErrors({}); // Clear any previous errors
  
        setTimeout(() => {
          setShowNotification(false);
        }, 5000);
      } catch (error) {
        console.error("Error creating account:", error);
        setMsg("Error: Unable to create account.");
        setShowNotification(true);
        setTimeout(() => {
          setShowNotification(false);
        }, 5000);
      }
    }
  };
  




  return (
    <>
      <Header />

      <div className="container my-5">
        <div className="row">
          <div className="col-sm-9 col-md-7 col-lg-5 mx-auto">
            <div className="card border-0 shadow rounded-3 my-5">
              <div className="card-body p-4">
                <h5 className="card-title mb-4 fw-bold fs-5">Sign up</h5>
                <form onSubmit={(e) => submitAccount(e)}>
                  <div className="form-floating mb-3">
                    <input type="text" className={`form-control ${errors.fullName ? 'is-invalid' : ''
                      }`}
                      id="fullName" placeholder="Xin chao" value={account.fullName} onChange={(e) => handleChange(e)} name='fullName' />
                    <label htmlFor="floatingInput">Full name</label>
                  </div>
                  <div className="form-floating mb-3">
                    <input type="number" className={`form-control ${errors.phoneNumber ? 'is-invalid' : ''
                      }`} id="phoneNumber" placeholder="024545" value={account.phoneNumber} onChange={(e) => handleChange(e)} name='phoneNumber' />
                    <label htmlFor="floatingInput">Phone number</label>
                  </div>
                  <div className="form-floating mb-3">
                    <input type="email" className="form-control" id="email" placeholder="name@example.com" value={account.email} onChange={(e) => handleChange(e)} name='email' />
                    <label htmlFor="floatingInput">Email address</label>
                  </div>
                  <div className="form-floating mb-3">
                    <input type="password" className={`form-control ${errors.password ? 'is-invalid' : ''
                      }`} id="password" placeholder="Password" value={account.password} onChange={(e) => handleChange(e)} name='password' />
                    <label htmlFor="floatingPassword">Password</label>
                  </div>

                  <div className="mb-4">
                    <label htmlFor="userType" className="form-label">You are:</label>
                    <div className="form-check form-check-inline">
                      <input className="form-check-input" type="radio" name="userType" id="learner" value="learner" />
                      <label className="form-check-label" htmlFor="learner">
                        <div className="circle"></div> Learner
                      </label>
                    </div>
                    <div className="form-check form-check-inline">
                      <input className="form-check-input" type="radio" name="userType" id="tutor" value="tutor" />
                      <label className="form-check-label" htmlFor="tutor">
                        <div className="circle"></div> Tutor
                      </label>
                    </div>
                  </div>

                  <div className="d-grid">
                    <button className="btn btn-primary btn-login text-uppercase fw-bold" type="submit" style={{ backgroundColor: '#f58d04', border: '5px solid #f58d04', borderRadius: '20px', }}>
                      Sign up
                    </button>
                  </div>
                </form>
                {/* Notification */}
                {showNotification && (
                  <div className="notification">
                    <p>{msg}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
      <style>
        {`
                .notification {
                  background-color: #4caf50; /* Green background color */
                  color: white;
                  text-align: center;
                  padding: 15px;
                  position: fixed;
                  top: 20px;
                  left: 50%;
                  transform: translateX(-50%);
                  z-index: 1000;
                  border-radius: 5px;
                  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                  animation: fadeInOut 2s ease-in-out; /* Add a fade-in/fade-out animation */
                
                  /* Optional: Add hover styles */
                  cursor: pointer;
                  transition: background-color 0.3s;
                }
                
                /* Optional: Add hover styles */
                .notification:hover {
                  background-color: #45a049; /* Darker green on hover */
                }
                
                /* Animation keyframes for fade-in/fade-out */
                @keyframes fadeInOut {
                  0% {
                    opacity: 0;
                  }
                  10% {
                    opacity: 1;
                  }
                  90% {
                    opacity: 1;
                  }
                  100% {
                    opacity: 0;
                  }
                }
            `}
      </style>
    </>
  );
};

export default SignUp;
