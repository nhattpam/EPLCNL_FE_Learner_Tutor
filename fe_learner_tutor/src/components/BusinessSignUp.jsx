import React, { useState } from 'react'
import Header from './Header';
import Footer from './Footer';
import centerService from '../services/center.service';

const BusinessSignUp = () => {


    const [center, setCenter] = useState({
        name: "",
        address: "",
        email: "",
        address: "",
        phoneNumber: "",
        taxIdentificationNumber: ""
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
        if (center.phoneNumber.trim() === '') {
            errors.phoneNumber = 'Phone Number is required';
            isValid = false;
        }
        if (center.taxIdentificationNumber.trim() === '') {
            errors.taxIdentificationNumber = 'Tax Identification Number is required';
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

    const [showTermModal, setShowTermModal] = useState(false);
    const openTermModal = () => {
        setShowTermModal(true);
    };

    const closeWTermModal = () => {
        setShowTermModal(false);
    };


    return (
        <>
            <Header />
            <div className="form-v4">
                <div className="page-content">
                    <div className="form-v4-content">
                        <div className="form-left">
                            <h2>INFORMATION</h2>
                            <p className="text-1">This is the first step to becoming a MeowLish partner!</p>
                            <img src={"banner_business.png"} alt="Business Image" className="business-image" style={{ width: '300px' }} />
                        </div>
                        <form className="form-detail" onSubmit={(e) => submitCenter(e)} id="myform">
                            <h2>REGISTER FORM</h2>
                            <div className="form-row">
                                <div className="form-row form-row-1">
                                    <label htmlFor="name">Center Name</label>
                                    <input type="text" name="name" value={center.name} onChange={(e) => handleChange(e)} className={`form-control ${errors.name ? 'is-invalid' : ''
                                        }`} style={{ borderRadius: '50px', padding: `8px 25px` }} />
                                </div>
                            </div>
                            <div className="form-row mt-1">
                                <div className="form-row form-row-1">
                                    <label htmlFor="email">Email</label>
                                    <input type="text" name="email" value={center.email}
                                        onChange={(e) => handleChange(e)} className="input-text" required pattern="[^@]+@[^@]+.[a-zA-Z]{2,6}" style={{ borderRadius: '50px', padding: `8px 25px` }} />
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-row form-row-1">
                                    <div className='col-md-6 form-row mr-2'>
                                        <label htmlFor="phoneNumber">Phone Number</label>
                                        <input type="number" name="phoneNumber" value={center.phoneNumber} onChange={(e) => handleChange(e)} className={`form-control ${errors.name ? 'is-invalid' : ''
                                            }`} style={{ borderRadius: '50px', padding: `8px 25px` }} />
                                    </div>
                                    <div className='col-md-6 form-row'>
                                        <label htmlFor="taxIdentificationNumber">Tax Number</label>
                                        <input type="number" name="taxIdentificationNumber" value={center.taxIdentificationNumber} onChange={(e) => handleChange(e)} className={`form-control ${errors.name ? 'is-invalid' : ''
                                            }`} style={{ borderRadius: '50px', padding: `8px 25px` }} />
                                    </div>
                                </div>

                            </div>


                            <div className="form-row mt-1">
                                <div className="form-row form-row-1 ">
                                    <label htmlFor="address">Address</label>
                                    <input type="text" name="address" value={center.address} onChange={(e) => handleChange(e)} className={`form-control ${errors.address ? 'is-invalid' : ''
                                        }`} required style={{ borderRadius: '50px', padding: `8px 25px` }} />
                                </div>
                            </div>
                            <div className="form-row mt-1">
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
                                        style={{ borderRadius: '20px', padding: `8px 25px` }}
                                    />
                                </div>
                            </div>
                            <div className="form-checkbox mt-1">
                                <label className="container">
                                    <p>
                                        I agree to the <a onClick={openTermModal} className="text">Terms and Conditions</a>
                                    </p>
                                    <input type="checkbox" name="checkbox" />
                                    <span className="checkmark" />
                                </label>
                            </div>
                            <div className="d-grid">
                                <input type="submit" name="register" className="btn btn-primary" value="JOIN US" style={{ borderRadius: '50px', padding: `10px 25px`, backgroundColor: '#f58d04', color: '#fff', fontWeight: 'bold' }} />
                            </div>
                        </form>
                        {
                            showTermModal && (
                                <div className="modal" tabIndex="-1" role="dialog" style={{ display: 'block', backgroundColor: 'rgba(29, 29, 29, 0.75)' }}>
                                    <div className="modal-dialog modal-dialog-scrollable modal-lg" role="document">
                                        <div className="modal-content">
                                            <div className="modal-header">
                                                <h5 className="modal-title">Terms and Conditions</h5>
                                                <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={closeWTermModal}>
                                                    <span aria-hidden="true">&times;</span>
                                                </button>
                                            </div>
                                            <div className="modal-body">
                                                {/* Conditional rendering based on edit mode */}

                                                <p>Welcome to MeowLish!</p>

                                                <p>These terms and conditions outline the rules and regulations for the use of MeowLish's Website, located at meowlish.com.</p>

                                                <p>By accessing this website we assume you accept these terms and conditions. Do not continue to use MeowLish if you do not agree to take all of the terms and conditions stated on this page.</p>

                                                <p>The following terminology applies to these Terms and Conditions, Privacy Statement and Disclaimer Notice and all Agreements: "Client", "You" and "Your" refers to you, the person log on this website and compliant to the Company’s terms and conditions. "The Company", "Ourselves", "We", "Our" and "Us", refers to our Company. "Party", "Parties", or "Us", refers to both the Client and ourselves. All terms refer to the offer, acceptance and consideration of payment necessary to undertake the process of our assistance to the Client in the most appropriate manner for the express purpose of meeting the Client’s needs in respect of provision of the Company’s stated services, in accordance with and subject to, prevailing law of Netherlands. Any use of the above terminology or other words in the singular, plural, capitalization and/or he/she or they, are taken as interchangeable and therefore as referring to same.</p>

                                                <p>You have 7 days from the date of purchase to submit a refund request. Please note, for orders close to the last day of the month, the number of days in which a refund request can be submitted will be calculated from the time of purchase to the last day of the month.</p>


                                            </div>
                                            <div className="modal-footer">
                                                {/* Conditional rendering of buttons based on edit mode */}
                                                <button type="button" className="btn btn-dark" style={{ borderRadius: '50px', padding: `8px 25px` }} onClick={closeWTermModal}>Close</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        }
                        {/* Notification */}
                        {showNotification && (
                            <div className="notification">
                                <p>{msg}</p>
                            </div>
                        )}
                    </div>
                </div >

            </div >

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
