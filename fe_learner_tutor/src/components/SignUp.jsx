import React from 'react';
import Header from './Header';
import Footer from './Footer';

const SignUp = () => {
  return (
    <>
      <Header />

      <div className="container my-5">
        <div className="row">
          <div className="col-sm-9 col-md-7 col-lg-5 mx-auto">
            <div className="card border-0 shadow rounded-3 my-5">
              <div className="card-body p-4">
                <h5 className="card-title mb-4 fw-bold fs-5">Sign up</h5>
                <form>
                  <div className="form-floating mb-3">
                    <input type="text" className="form-control" id="floatingInput" placeholder="Xin chao" />
                    <label htmlFor="floatingInput">Full name</label>
                  </div>
                  <div className="form-floating mb-3">
                    <input type="number" className="form-control" id="floatingInput" placeholder="024545" />
                    <label htmlFor="floatingInput">Phone number</label>
                  </div>
                  <div className="form-floating mb-3">
                    <input type="email" className="form-control" id="floatingInput" placeholder="name@example.com" />
                    <label htmlFor="floatingInput">Email address</label>
                  </div>
                  <div className="form-floating mb-3">
                    <input type="password" className="form-control" id="floatingPassword" placeholder="Password" />
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
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default SignUp;
