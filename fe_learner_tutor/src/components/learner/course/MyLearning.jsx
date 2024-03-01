import React from 'react';
import Header from '../../Header';
import Footer from '../../Footer';
import { Link } from 'react-router-dom';
import learnerService from '../../../services/learner.service';
import { useState } from 'react';
import { useEffect } from 'react';
import { useRef } from 'react';

const MyLearning = () => {

    const learnerId = localStorage.getItem('learnerId');


    const [enrollmentList, setEnrollmentList] = useState([]);


    const contentRef = useRef(null);


    useEffect(() => {
        learnerService
            .getAllEnrollmentByLearnerId(learnerId)
            .then((res) => {
                setEnrollmentList(res.data);

            })
            .catch((error) => {
                console.log(error);
            });
    }, [learnerId]);

    const scroll = (scrollOffset) => {
        contentRef.current.scrollLeft += scrollOffset;
    };

    return (
        <>
            <Header />
            <main id="main" data-aos="fade-in">
                {/* ======= Breadcrumbs ======= */}
                <div className="breadcrumbs">
                    <div className="container">
                        <h2 style={{ color: '#fff' }}>My learning</h2>
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
                                    Certificates
                                </a>
                            </li>

                        </ul>
                        {/* Tab Content */}
                        <div className="tab-content mt-4" id="myLearningTabsContent">

                            <div className="tab-pane fade show active" id="tab-content-1">
                                <section id="courses" className="courses">
                                    <div className="container" data-aos="fade-up">
                                        <div className="row " data-aos="zoom-in" data-aos-delay={100}>
                                            {enrollmentList.map((enrollment, index) => (
                                                <div key={enrollment.courseId} className="col-lg-4 col-md-6 d-flex align-items-stretch">
                                                    <div className="course-item">
                                                        <img src={enrollment.course.imageUrl} className="img-fluid" alt="..." />
                                                        <div className="course-content">
                                                            <div className="d-flex justify-content-between align-items-center mb-3">
                                                                <h4>{enrollment.course.category?.name}</h4>
                                                                <p className="price">{`$${enrollment.course.stockPrice}`}</p>
                                                            </div>
                                                            {enrollment.course.isOnlineClass && (
                                                                <h3><Link to={`/study-class/${enrollment.courseId}`}>{enrollment.course.name}</Link></h3>

                                                            )}
                                                            {!enrollment.course.isOnlineClass && (
                                                                <h3><Link to={`/study-course/${enrollment.courseId}`}>{enrollment.course.name}</Link></h3>

                                                            )}
                                                            <p>{enrollment.course.description}</p>
                                                            <div className="trainer d-flex justify-content-between align-items-center">
                                                                <div className="trainer-profile d-flex align-items-center">
                                                                    <img src={enrollment.course.tutor.account.imageUrl} className="img-fluid" alt="" />
                                                                    <span>{enrollment.course.tutor.account.fullName}</span>
                                                                </div>

                                                                <div className="trainer-rank d-flex align-items-center">
                                                                    <i className="bx bx-user" />&nbsp;30
                                                                    &nbsp;&nbsp;
                                                                    <i className="bx bx-heart" />&nbsp;52
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </section>{/* End Courses Section */}
                            </div>


                            <div className="tab-pane fade" id="tab-content-2">
                                {/* Course Content for Tab 2 */}
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

export default MyLearning;
