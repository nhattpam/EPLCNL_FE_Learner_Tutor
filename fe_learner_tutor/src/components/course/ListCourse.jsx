import React, { useEffect, useState } from 'react';
import Header from '../Header'
import Footer from '../Footer'
import { Link } from 'react-router-dom'
import courseService from '../../services/course.service'
import accountService from '../../services/account.service';
import centerService from '../../services/center.service';

const ListCourse = () => {

    const [courseList, setCourseList] = useState([]);
    const [accounts, setAccounts] = useState([]);
    const [learnersCount, setLearnersCount] = useState({});

    //LOADING
    const [loading, setLoading] = useState(true); // State to track loading

    //LOADING

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const res = await courseService.getAllcourse();
                const activeCourses = res.data.filter((course) => course.isActive === true);
                setCourseList(activeCourses);

                const learnersCounts = {}; // Object to store number of learners for each course
                for (const course of activeCourses) {
                    try {
                        const learnersResponse = await courseService.getAllEnrollmentsByCourse(course.id);
                        const learnersOfCourse = learnersResponse.data;
                        learnersCounts[course.id] = learnersOfCourse.length; // Store learner count for the course
                        console.log(`Number of learners for course ${course.name}: ` + learnersOfCourse.length);
                    } catch (error) {
                        console.error(`Error fetching learners for course ${course.name}:`, error);
                    }
                }
                setLearnersCount(learnersCounts); // Update state with learners count
                setLoading(false);
            } catch (error) {
                console.log(error);
                setLoading(false);
            }
        };

        fetchCourses();
    }, []); // Empty dependency array to fetch courses only once when the component mounts

    useEffect(() => {
        const fetchAccountInfo = async () => {
            try {
                const accountPromises = courseList.map((course) =>
                    accountService.getAccountById(course.tutor?.accountId)
                );

                const accountResponses = await Promise.all(accountPromises);
                const accountData = accountResponses.map((response) => response.data);
                setAccounts(accountData);
            } catch (error) {
                console.log(error);
            }
        };

        if (courseList.length > 0) {
            fetchAccountInfo();
        }
    }, [courseList]);


    //CENTER DETAIL
    const [showCenterModal, setShowCenterModal] = useState(false);
    const [centerCourseList, seCenterCourseList] = useState([]);

    const [center, setCenter] = useState({
        id: '',
        name: "",
        address: "",
        description: "",
        isActive: true,
        staffId: "",
        accountId: ""
    });

    const openCenterModal = (event, centerId) => {
        event.preventDefault();
        centerService
            .getCenterById(centerId)
            .then((res) => {
                setCenter(res.data);
            })
            .catch((error) => {
                console.log(error);
            });
        centerService
            .getAllCourseByCenterId(centerId)
            .then((res) => {
                const filteredCourseList = res.data.filter(x => x.isActive === true);
                const sortedCourseList = [...filteredCourseList].sort((a, b) => {
                    // Assuming requestedDate is a string in ISO 8601 format
                    return new Date(b.createdDate) - new Date(a.createdDate);
                });

                seCenterCourseList(sortedCourseList);
            })
            .catch((error) => {
                // console.log(error);
            });
        setShowCenterModal(true);
    };

    const closeCenterModal = () => {
        setShowCenterModal(false);
    };


    return (
        <>
            <Header />
            <main id="main" data-aos="fade-in" style={{ backgroundColor: '#fff' }}>
                {/* ======= Breadcrumbs ======= */}
                <div className="breadcrumbs">
                    <div className="container">
                        <h2 style={{ color: '#fff' }}>Courses</h2>
                        <p style={{ color: '#000' }}>Learn English online as well as offline with Linearthinking method, dedicated teachers, supporting technology platform, guaranteed output. </p>
                    </div>
                </div>{/* End Breadcrumbs */}
                {/* ======= Courses Section ======= */}
                <section id="courses" className="courses">
                    {loading && (
                        <div className="loading-overlay">
                            <div className="loading-spinner" />
                        </div>
                    )}
                    <div className="container" data-aos="fade-up">

                        <div className="row" data-aos="zoom-in" data-aos-delay={100}>
                            {
                                courseList.length > 0 && courseList.map((course, index) => (
                                    <div key={course.id} className="col-lg-4 col-md-6 d-flex align-items-stretch">
                                        <div className="course-item mt-4" style={{ borderRadius: '50px', width: '600px' }}>
                                            <img src={course.imageUrl} className="img-fluid" alt="..." />
                                            <div className="course-content">
                                                <div className="d-flex justify-content-between align-items-center mb-3">
                                                    <h4 className="mr-1">{course.category?.name}</h4>
                                                    <div className="d-flex align-items-center mr-1"> {/* New div to contain the rating and star icon */}
                                                        <p className="price">{parseFloat(course.rating).toFixed(0)}</p> {/* Added mr-1 class for small right margin */}
                                                        <i className="fas fa-star text-warning "></i>
                                                    </div>
                                                    <p className="price">{`$${course.stockPrice}`}</p>
                                                </div>

                                                <h3><Link to={`/detail-course/${course.id}`}>{course.name}</Link></h3>
                                                <p>{course.description}</p>
                                                <div className="trainer d-flex justify-content-between align-items-center">
                                                    <div className="trainer-profile d-flex align-items-center">
                                                        {accounts[index] && (
                                                            <div key={accounts[index].id}>
                                                                <img src={accounts[index].imageUrl} className="img-fluid " alt="" />
                                                                <span>{accounts[index].fullName}</span>
                                                                {
                                                                    !course.tutor?.isFreelancer && (
                                                                        <>
                                                                            <div>
                                                                                <button style={{ backgroundColor: '#f58d04', color: '#fff', border: 'none' }} onClick={(event) => openCenterModal(event, course.tutor?.center?.id)}>{course.tutor?.center?.name}</button>
                                                                            </div>
                                                                        </>

                                                                    )
                                                                }
                                                            </div>
                                                        )}
                                                    </div>

                                                    <div className="trainer-rank d-flex align-items-center">
                                                        <i className="bx bx-user" />&nbsp;{learnersCount[course.id]}
                                                        &nbsp;
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            }
                            {
                                courseList.length === 0 && (
                                    <h5>There are no courses.</h5>
                                )
                            }

                        </div>
                    </div>
                </section>{/* End Courses Section */}
                {
                    showCenterModal && (
                        <div className="modal" tabIndex="-1" role="dialog" style={{ display: 'block', backgroundColor: 'rgba(29, 29, 29, 0.75)' }}>
                            <div className="modal-dialog modal-dialog-scrollable modal-lg" role="document">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h5 className="modal-title">Center Information</h5>
                                        <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={closeCenterModal}>
                                            <span aria-hidden="true">&times;</span>
                                        </button>
                                    </div>
                                    <div className="modal-body">
                                        {/* Conditional rendering based on edit mode */}
                                        <h3 style={{ fontWeight: 'bold' }}>{center.name}</h3>
                                        <h4>Address: {center.address}</h4>
                                        <section id="courses" className="courses">
                                            <div className="container" data-aos="fade-up">
                                                <div className="row" data-aos="zoom-in" data-aos-delay={100}>
                                                    {
                                                        centerCourseList.length > 0 && centerCourseList.map((course, index) => (
                                                            <div key={course.id} className="col-lg-4 col-md-6 d-flex align-items-baseline">
                                                                <div className="course-item mt-4" style={{ borderRadius: '50px', width: '600px' }}>
                                                                    <img src={course.imageUrl} className="img-fluid" alt="..." />
                                                                    <div className="course-content">
                                                                        <div className="d-flex justify-content-between align-items-center mb-3">
                                                                            <h4>{course.category?.name}</h4>
                                                                        </div>
                                                                        <h3><Link to={`/detail-course/${course.id}`}>{course.name}</Link></h3>
                                                                        <p>{course.description}</p>

                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))
                                                    }
                                                    {
                                                        courseList.length === 0 && (
                                                            <h5>No courses found.</h5>
                                                        )
                                                    }

                                                </div>
                                            </div>
                                        </section>{/* End Courses Section */}
                                    </div>

                                    <div className="modal-footer">
                                        {/* Conditional rendering of buttons based on edit mode */}
                                        <button type="button" className="btn btn-dark" style={{ borderRadius: '50px', padding: `8px 25px` }} onClick={closeCenterModal}>Close</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                }
            </main>{/* End #main */}

            <Footer />
            <style>
                {`
                .course-item {
                    transition: transform 0.3s ease;
                }
                
                .course-item:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
                }

                .loading-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    backdrop-filter: blur(10px); /* Apply blur effect */
                    -webkit-backdrop-filter: blur(10px); /* For Safari */
                    background-color: rgba(0, 0, 0, 0.5); /* Semi-transparent black background */
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    z-index: 9999; /* Ensure it's on top of other content */
                }
                
                .loading-spinner {
                    border: 8px solid rgba(245, 141, 4, 0.1); /* Transparent border to create the circle */
                    border-top: 8px solid #f58d04; /* Orange color */
                    border-radius: 50%;
                    width: 50px;
                    height: 50px;
                    animation: spin 1s linear infinite; /* Rotate animation */
                }
                
                @keyframes spin {
                    0% {
                        transform: rotate(0deg);
                    }
                    100% {
                        transform: rotate(360deg);
                    }
                }
                
                
                `}
            </style>
        </>
    )
}

export default ListCourse