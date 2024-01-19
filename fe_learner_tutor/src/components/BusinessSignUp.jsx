import React from 'react'
import Header from './Header'
import Footer from './Footer'

const BusinessSignUp = () => {
    return (
        <>
            <Header />
            <div className="form-v4">
                <div className="page-content">
                    <div className="form-v4-content">
                        <div className="form-left">
                            <h2>INFOMATION</h2>
                            <p className="text-1">Tell us your needs and we’ll start on a custom plan to drive results.</p>
                            <p className="text-2">Train your entire workforce with over 24,000+ courses in 15 languages</p>
                            <div className="form-left-last">
                                <input type="submit" name="account" className="account" defaultValue="Have An Account" />
                            </div>
                        </div>
                        <form className="form-detail" action="#" method="post" id="myform">
                            <h2>REGISTER FORM</h2>
                            <div className="form-group">
                                <div className="form-row form-row-1">
                                    <label htmlFor="first_name">First Name</label>
                                    <input type="text" name="first_name" id="first_name" className="input-text" />
                                </div>
                                <div className="form-row form-row-1">
                                    <label htmlFor="last_name">Last Name</label>
                                    <input type="text" name="last_name" id="last_name" className="input-text" />
                                </div>
                            </div>
                            <div className="form-row">
                                <label htmlFor="your_email">Your Email</label>
                                <input type="text" name="your_email" id="your_email" className="input-text" required pattern="[^@]+@[^@]+.[a-zA-Z]{2,6}" />
                            </div>
                            <div className="form-group">
                                <div className="form-row form-row-1 ">
                                    <label htmlFor="password">Password</label>
                                    <input type="password" name="password" id="password" className="input-text" required />
                                </div>
                                <div className="form-row form-row-1">
                                    <label htmlFor="comfirm-password">Comfirm Password</label>
                                    <input type="password" name="comfirm_password" id="comfirm_password" className="input-text" required />
                                </div>
                            </div>
                            <div className="form-checkbox">
                                <label className="container"><p>I agree to the <a href="#" className="text">Terms and Conditions</a></p>
                                    <input type="checkbox" name="checkbox" />
                                    <span className="checkmark" />
                                </label>
                            </div>
                            <div className="form-row-last">
                                <input type="submit" name="register" className="register" defaultValue="Register" />
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            <Footer />
        </>
    )
}

export default BusinessSignUp