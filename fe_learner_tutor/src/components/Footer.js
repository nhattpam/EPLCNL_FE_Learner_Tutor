import React from 'react'

const Footer = () => {
    return (
        <>
            {/* ======= Footer ======= */}
            <footer id="footer" style={{backgroundColor: '#fff'}}>
                <div className="footer-top" style={{backgroundColor: '#fff'}}>
                    <div className="container" style={{backgroundColor: '#fff'}}>
                        <div className="row" style={{backgroundColor: '#fff'}}>
                            <div className="col-lg-8 col-md-6 footer-contact" style={{backgroundColor: '#fff'}}>
                                <h3>MeowLish</h3>
                                <p>
                                    A108 Adam Street <br />
                                    New York, NY 535022<br />
                                    United States <br /><br />
                                    <strong>Phone:</strong> +1 5589 55488 55<br />
                                    <strong>Email:</strong> meowlish@system.com<br />
                                </p>
                            </div>
                            <div className="col-lg-2 col-md-6 footer-links">
                                <h4>Useful Links</h4>
                                <ul>
                                    <li><i className="bx bx-chevron-right" /> <a href="/home">Home</a></li>
                                    <li><i className="bx bx-chevron-right" /> <a href="/about">About us</a></li>
                                    <li><i className="bx bx-chevron-right" /> <a href="/about">Terms of service</a></li>
                                    <li><i className="bx bx-chevron-right" /> <a href="/about">Privacy policy</a></li>
                                </ul>
                            </div>
                           
                        </div>
                    </div>
                </div>
                <div className="container d-md-flex py-4" style={{backgroundColor: '#fff'}}>
                    <div className="me-md-auto text-center text-md-start">
                        <div className="copyright">
                            © Copyright <strong><span>MeowLish</span></strong>. All Rights Reserved
                        </div>
                        <div className="credits" style={{backgroundColor: '#fff'}}>
                            {/* All the links in the footer should remain intact. */}
                            {/* You can delete the links only if you purchased the pro version. */}
                            {/* Licensing information: https://bootstrapmade.com/license/ */}
                            {/* Purchase the pro version with working PHP/AJAX contact form: https://bootstrapmade.com/mentor-free-education-bootstrap-theme/ */}
                        </div>
                    </div>
                    <div className="social-links text-center text-md-right pt-3 pt-md-0">
                        <a href="#" className="twitter"><i className="bx bxl-twitter" /></a>
                        <a href="#" className="facebook"><i className="bx bxl-facebook" /></a>
                        <a href="#" className="instagram"><i className="bx bxl-instagram" /></a>
                        <a href="#" className="google-plus"><i className="bx bxl-skype" /></a>
                        <a href="#" className="linkedin"><i className="bx bxl-linkedin" /></a>
                    </div>
                </div>
            </footer>{/* End Footer */}
        </>
    )
}

export default Footer