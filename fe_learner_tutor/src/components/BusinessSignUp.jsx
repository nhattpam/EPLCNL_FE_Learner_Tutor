import React from 'react';
import Header from './Header';
import Footer from './Footer';

const BusinessSignUp = () => {
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
                        <form className="form-detail" action="#" method="post" id="myform">
                            <h2>REGISTER FORM</h2>
                            <div className="form-row">
                                <div className="form-row form-row-1">
                                    <label htmlFor="first_name">Center Name</label>
                                    <input type="text" name="first_name" id="first_name" className="input-text" />
                                </div>
                            </div>
                            <div className="form-row">
                                <label htmlFor="your_email">Email</label>
                                <input type="text" name="your_email" id="your_email" className="input-text" required pattern="[^@]+@[^@]+.[a-zA-Z]{2,6}" />
                            </div>
                            <div className="form-row">
                                <div className="form-row form-row-1 ">
                                    <label htmlFor="address">Address</label>
                                    <input type="text" name="address" id="address" className="input-text" required />
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
                                        id="description"
                                        className="input-text"
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
                    </div>
                </div>
            </div>

            <Footer />
        </>
    );
}

export default BusinessSignUp;
