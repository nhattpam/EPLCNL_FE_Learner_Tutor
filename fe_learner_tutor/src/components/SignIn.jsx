import React from 'react';
import Header from './Header';
import Footer from './Footer';

const SignIn = () => {
    return (
        <>
            <Header />
            <div className="container my-5">
                <div className="row">
                    <div className="col-sm-9 col-md-7 col-lg-5 mx-auto">
                        <div className="card border-0 shadow rounded-3 my-5">
                            <div className="card-body p-4">
                                <h5 className="card-title mb-4 fw-bold fs-5">Log in to your MeowLish account</h5>
                                <form>
                                    <div className="form-floating mb-3">
                                        <input type="email" className="form-control" id="floatingInput" placeholder="name@example.com" />
                                        <label htmlFor="floatingInput">Email address</label>
                                    </div>
                                    <div className="form-floating mb-3">
                                        <input type="password" className="form-control" id="floatingPassword" placeholder="Password" />
                                        <label htmlFor="floatingPassword">Password</label>
                                    </div>

                                    <div className="d-grid">
                                    <button className="btn btn-primary btn-login text-uppercase fw-bold" type="submit" style={{ backgroundColor: '#f58d04', border: '5px solid #f58d04', borderRadius: '20px', }}>
                                            Sign in
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </>
    );
};

export default SignIn;
