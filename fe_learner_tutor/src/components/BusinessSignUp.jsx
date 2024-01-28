import React, { useState } from 'react'
import Header from './Header';
import Footer from './Footer';
import centerService from '../services/center.service';

const BusinessSignUp = () => {


    const [center, setCenter] = useState({
        name: "",
        address: "",
        email: "",
        address: ""
    });

    const [errors, setErrors] = useState({});
    const [msg, setMsg] = useState("");
    const [showNotification, setShowNotification] = useState(false);



    const handleChange = (e) => {
        const value = e.target.value;
        setCenter({ ...center, [e.target.name]: value });
    }

    const validateForm = () => {
        let isValid = true;
        const errors = {};

        if (center.name.trim() === '') {
            errors.name = 'Center Name is required';
            isValid = false;
        }

        if (center.description.trim() === '') {
            errors.description = 'Description is required';
            isValid = false;
        }

        if (center.address.trim() === '') {
            errors.address = 'Address is required';
            isValid = false;
        }
        setErrors(errors);
        return isValid;
    };


    const submitCenter = (e) => {
        e.preventDefault();
        if (validateForm()) {
            centerService
                .saveCenter(center)
                .then((res) => {
                    console.log(center);
                    setMsg('Thanks for joining us. We will contact you soon through your email!');
                    setShowNotification(true);
                    // Hide notification after 2 seconds
                    setTimeout(() => {
                        setShowNotification(false);
                    }, 5000);
                })
                .catch((error) => {
                    console.log(error);
                    setMsg('Thanks for joining us. We will contact you soon through your email!');
                    setShowNotification(true);
                    // Hide notification after 2 seconds
                    setTimeout(() => {
                        setShowNotification(false);
                    }, 5000);
                });
        }
    }

    return (
        <>
            <Header />
            <div className="form-v4">
                <div className="page-content">
                    <div className="form-v4-content">
                        <div className="form-left">
                            <h2>INFORMATION</h2>
                            <p className="text-1">This is the first step to becoming a MeowLish partner!</p>
                            <img src={"banner_business.png"} alt="Business Image" className="business-image" />
                        </div>
                        <form className="form-detail" onSubmit={(e) => submitCenter(e)} id="myform">
                            <h2>REGISTER FORM</h2>
                            <div className="form-row">
                                <div className="form-row form-row-1">
                                    <label htmlFor="name">Center Name</label>
                                    <input type="text" name="name" value={center.name} onChange={(e) => handleChange(e)} className={`form-control ${errors.name ? 'is-invalid' : ''
                                        }`} />
                                </div>
                            </div>
                            <div className="form-row">
                                <label htmlFor="email">Email</label>
                                <input type="text" name="email" value={center.email} onChange={(e) => handleChange(e)} className="input-text" required pattern="[^@]+@[^@]+.[a-zA-Z]{2,6}" />
                            </div>
                            <div className="form-row">
                                <div className="form-row form-row-1 ">
                                    <label htmlFor="address">Address</label>
                                    <input type="text" name="address" value={center.address} onChange={(e) => handleChange(e)} className={`form-control ${errors.address ? 'is-invalid' : ''
                                        }`} required />
                                </div>
                            </div>
                            <div className="form-row">
                                <label htmlFor="description">Description</label>

                                <div className="form-row form-row-1 ">
                                    <textarea
                                        rows="4"
                                        cols={"60"} // Customize the number of visible rows
                                        placeholder="Enter a brief description..."
                                        name="description"
                                        value={center.description} onChange={(e) => handleChange(e)}
                                        className={`form-control ${errors.description ? 'is-invalid' : ''
                                            }`}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="form-checkbox">
                                <label className="container">
                                    <p>
                                        I agree to the <a href="#" className="text">Terms and Conditions</a>
                                    </p>
                                    <input type="checkbox" name="checkbox" />
                                    <span className="checkmark" />
                                </label>
                            </div>
                            <div className="form-row-last">
                                <input type="submit" name="register" className="register" value="Register" />
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
}

export default BusinessSignUp;
