import React from 'react';
import Header from '../../Header';
import Footer from '../../Footer';
import { Link } from 'react-router-dom';

const Learning = () => {
    return (
        <>
            <Header />
            <main id="main" data-aos="fade-in">
                {/* ======= Breadcrumbs ======= */}
                <div className="breadcrumbs">
                    <div className="container">
                        <h2>My learning</h2>
                    </div>
                </div>
                {/* End Breadcrumbs */}
                {/* ======= Courses Section ======= */}
                <section id="courses" className="courses">
                    <div className="container" data-aos="fade-up">
                        {/* Nav Tabs */}
                        <ul className="nav nav-tabs" id="myLearningTabs">
                            <li className="nav-item">
                                <a className="nav-link active" id="tab1" data-bs-toggle="tab" href="#tab-content-1">
                                    All courses
                                </a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" id="tab2" data-bs-toggle="tab" href="#tab-content-2">
                                    Tab 2
                                </a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" id="tab3" data-bs-toggle="tab" href="#tab-content-3">
                                    Tab 3
                                </a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" id="tab4" data-bs-toggle="tab" href="#tab-content-4">
                                    Tab 4
                                </a>
                            </li>
                        </ul>
                        {/* Tab Content */}
                        <div className="tab-content mt-4" id="myLearningTabsContent">
                            <div className="tab-pane fade show active" id="tab-content-1">
                                {/* Course Content for Tab 1 */}
                                {/* You can customize this content based on your needs */}
                                <div className="col-lg-4 col-md-6 d-flex align-items-stretch mt-4 mt-md-0">
                                    <div className="course-item">
                                        <img src="assets/img/course-2.jpg" className="img-fluid" alt="..." />
                                        <div className="course-content">
                                            <div className="d-flex justify-content-between align-items-center mb-3">
                                                <h4>Marketing</h4>
                                                <p className="price">$250</p>
                                            </div>
                                            <h3>
                                                <li>
                                                    <Link to="/detail-course">Search Engine Optimization</Link>
                                                </li>
                                            </h3>
                                            <p>Et architecto provident deleniti facere repellat nobis iste. Id facere quia quae dolores dolorem tempore.</p>
                                            <div className="trainer d-flex justify-content-between align-items-center">
                                                <div className="trainer-profile d-flex align-items-center">
                                                    <img src="assets/img/trainers/trainer-2.jpg" className="img-fluid" alt />
                                                    <span>Lana</span>
                                                </div>
                                                <div className="trainer-rank d-flex align-items-center">
                                                    <i className="bx bx-user" />&nbsp;35
                                                    &nbsp;&nbsp;
                                                    <i className="bx bx-heart" />&nbsp;42
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div> {/* End Course Item*/}
                            </div>
                            <div className="tab-pane fade" id="tab-content-2">
                                {/* Course Content for Tab 2 */}
                                {/* You can customize this content based on your needs */}
                            </div>
                            <div className="tab-pane fade" id="tab-content-3">
                                {/* Course Content for Tab 3 */}
                                {/* You can customize this content based on your needs */}
                            </div>
                            <div className="tab-pane fade" id="tab-content-4">
                                {/* Course Content for Tab 4 */}
                                {/* You can customize this content based on your needs */}
                            </div>
                        </div>
                    </div>
                </section>
                {/* End Courses Section */}
            </main>
            {/* End #main */}
            <Footer />
        </>
    );
};

export default Learning;
