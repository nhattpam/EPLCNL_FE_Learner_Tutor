import React, { useEffect, useState } from 'react';
import Header from '../Header'
import Footer from '../Footer'
import { Link, useParams } from 'react-router-dom'
import courseService from '../../services/course.service'
import moduleService from '../../services/module.service';
import transactionService from '../../services/transaction.service';
import { Button } from 'bootstrap';
import enrollmentService from '../../services/enrollment.service';

const DetailCourse = () => {


    const { courseId } = useParams();

    const learnerId = localStorage.getItem('learnerId');
    const [showNotification, setShowNotification] = useState(false);
    const [loading, setLoading] = useState(false); // State to track loading status
    const [isEnrolled, setIsEnrolled] = useState(false);


    const [course, setCourse] = useState({
        name: ""
    });

    const [enrollment, setEnrollment] = useState({
        learnerId: "",
        courseId: ""
    });

    useEffect(() => {
        console.log("This is enrollment haha:  ", enrollment);
    }, [enrollment]);

    //transaction
    // const [transaction, setTransaction] = useState({
    //     courseId: courseId,
    //     learnerId: learnerId,
    //     amount: course.stockPrice * 24000,
    //     paymentMethodId: "1dffb0d3-f5a5-4725-98fc-b4dea22f4b0e"
    // });

    const [moduleList, setModuleList] = useState([]);
    const [classModuleList, setClassModuleList] = useState([]);
    const [assignmentList, setAssignmentList] = useState([]);
    const [lessonList, setLessonList] = useState([]);
    const [quizList, setQuizList] = useState([]);

    useEffect(() => {
        if (courseId) {
            courseService
                .getCourseById(courseId)
                .then((res) => {
                    setCourse(res.data);
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    }, [courseId]);

    useEffect(() => {
        courseService
            .getAllModulesByCourse(courseId)
            .then((res) => {
                setModuleList(res.data || []); // Ensure moduleList is initialized with an empty array if res.data.data is undefined

            })
            .catch((error) => {
                console.log(error);
            });
    }, [courseId]);

    useEffect(() => {
        courseService
            .getAllClassModulesByCourse(courseId)
            .then((res) => {
                setClassModuleList(res.data || []); // Ensure classModuleList is initialized with an empty array if res.data is undefined
            })
            .catch((error) => {
                console.log(error);
            });
    }, [courseId]);


    useEffect(() => {
        // Fetch lessons, assignments, and quizzes for each module
        Promise.all(moduleList.map(module => {
            return Promise.all([
                moduleService.getAllLessonsByModule(module.id),
                moduleService.getAllAssignmentsByModule(module.id),
                moduleService.getAllQuizzesByModule(module.id)
            ]);
        })).then(responses => {
            const allLessons = responses.flatMap(response => response[0].data);
            const allAssignments = responses.flatMap(response => response[1].data);
            const allQuizzes = responses.flatMap(response => response[2].data);
            setLessonList(allLessons);
            setAssignmentList(allAssignments);
            setQuizList(allQuizzes);
        }).catch((error) => {
            console.log(error);
        });
    }, [moduleList]);

    // Function to handle tab switching
    const handleTabClick = (event, moduleId) => {
        // Prevent the default behavior of the link
        event.preventDefault();
        // Remove the "active" class from all tab links
        document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
        // Add the "active" class to the clicked tab link
        event.target.classList.add('active');
        // Hide all tab content
        document.querySelectorAll('.tab-pane').forEach(tab => tab.classList.remove('active', 'show'));
        // Show the tab content corresponding to the clicked tab link
        document.getElementById(`tab-${moduleId}`).classList.add('active', 'show');
    };

    // Function to handle tab pay
    // Function to handle tab pay
    const handlePayClick = (event) => {
        event.preventDefault();
        const learnerId = localStorage.getItem('learnerId');
        if (!learnerId) {
            setShowNotification(true);
            setTimeout(() => {
                setShowNotification(false);
            }, 3000);
            return;
        }
        setLoading(true);

        const transactionData = {
            courseId: courseId,
            learnerId: learnerId,
            amount: course.stockPrice * 24000,
            paymentMethodId: "1dffb0d3-f5a5-4725-98fc-b4dea22f4b0e"
        };

        transactionService
            .saveTransaction(transactionData)
            .then((response) => {
                transactionService
                    .payTransaction(response.data.id)
                    .then((res) => {
                        window.open(res.data, '_blank');
                        const checkTransactionStatus = setInterval(() => {
                            transactionService.getTransactionById(response.data.id)
                                .then((transactionRes) => {
                                    if (transactionRes.data.status === 'DONE') {
                                        setLoading(false);
                                        clearInterval(checkTransactionStatus);
                                        // Check if the user is enrolled
                                        enrollmentService.getEnrollmentByLearnerIdAndCourseId(learnerId, courseId)
                                            .then((enrollmentRes) => {
                                                setEnrollment(enrollmentRes.data);
                                                // Update isEnrolled state if enrollment is not null
                                                if (enrollmentRes.data !== null) {
                                                    setIsEnrolled(true);
                                                }
                                            })
                                            .catch((error) => {
                                                if (error.response && error.response.status === 404) {
                                                    setEnrollment(null);
                                                } else {
                                                    console.log(error);
                                                }
                                            });
                                    }
                                })
                                .catch((error) => {
                                    console.log(error);
                                });
                        }, 5000);
                    })
                    .catch((error) => {
                        console.log(error);
                        setLoading(false);
                    });
            })
            .catch((error) => {
                console.log(error);
                setLoading(false);
            });
    };



    //check enrollment by learner and course
    useEffect(() => {
        if (courseId) {
            enrollmentService.getEnrollmentByLearnerIdAndCourseId(learnerId, courseId)
                .then((res) => {
                    setEnrollment(res.data);
                    // Update isEnrolled state if enrollment is not null
                    if (res.data !== null) {
                        setIsEnrolled(true);
                    }
                })
                .catch((error) => {
                    if (error.response && error.response.status === 404) {
                        setEnrollment(null);
                    } else {
                        console.log(error);
                    }
                });
        }
    }, [courseId, learnerId]);





    return (
        <>
            <Header />
            <main id="main">
                {/* ======= Breadcrumbs ======= */}
                <div className="breadcrumbs" data-aos="fade-in">
                    <div className="container">
                        <h2 style={{ color: '#fff' }}>Detail Of Course</h2>
                    </div>
                </div>{/* End Breadcrumbs */}
                {/* ======= Cource Details Section ======= */}
                <section id="course-details" className="course-details">
                    <div className="container" data-aos="fade-up">
                        <div className="row">
                            <div className="col-lg-8">
                                <img src={course.imageUrl} className="img-fluid" alt />
                                <h3>{course.name}</h3>
                                <p>
                                    {course.description}
                                </p>
                            </div>
                            <div className="col-lg-4">
                                <div className="course-info d-flex justify-content-between align-items-center">
                                    <h5 style={{ color: '#f58d04', fontWeight: 'bold' }}>Tutor</h5>
                                    <p><a href="#">{course.tutor?.account?.fullName}</a></p>
                                </div>
                                <div className="course-info d-flex justify-content-between align-items-center">
                                    <h5 style={{ color: '#f58d04', fontWeight: 'bold' }}>Course Fee</h5>
                                    <p>${course.stockPrice}</p>
                                </div>
                                <div className="course-info d-flex justify-content-between align-items-center">
                                    <h5 style={{ color: '#f58d04', fontWeight: 'bold' }}>Enrolled Students</h5>
                                    <p>30</p>
                                </div>
                                {/* Notification */}
                                {showNotification && (
                                    <div className="notification fixed-top w-100 bg-warning text-center">
                                        <p className="m-0">You need to login first</p>
                                    </div>
                                )}
                                {!loading ? (
                                    <>
                                        {enrollment === null ? (
                                            <>
                                                <div className="course-info d-flex justify-content-between align-items-center">
                                                    <button
                                                        type="button"
                                                        className="btn btn-primary btn-lg btn-block"
                                                        onClick={handlePayClick}
                                                        style={{ backgroundColor: '#f58d04' }}
                                                    >
                                                        Get - ${course.stockPrice}
                                                    </button>
                                                </div>
                                                <p>Powered by VnPay <img src={process.env.PUBLIC_URL + '/logo-vnpay.png'} alt="VnPay Logo" style={{ width: '25%' }} />
                                                </p>
                                            </>


                                        ) : (
                                            <div className="course-info d-flex justify-content-between align-items-center">
                                                {isEnrolled ? (
                                                    <Link
                                                        type="button"
                                                        className="btn btn-primary btn-lg btn-block"
                                                        to={`/learner/study-course/${courseId}`}
                                                        style={{ backgroundColor: '#f58d04', color: '#fff' }}
                                                    >
                                                        Study Now
                                                    </Link>
                                                ) : (
                                                    <button
                                                        type="button"
                                                        className="btn btn-primary btn-lg btn-block"
                                                        onClick={handlePayClick}
                                                        style={{ backgroundColor: '#f58d04' }}
                                                    >
                                                        Get - ${course.stockPrice}
                                                    </button>

                                                )}
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <>
                                        <div className="course-info d-flex justify-content-between align-items-center">
                                            <button
                                                type="button"
                                                className="btn btn-primary btn-lg btn-block"
                                                disabled
                                                style={{ backgroundColor: '#f58d04', cursor: 'not-allowed' }}
                                            >
                                                Loading...
                                            </button>
                                        </div>
                                        <p>Powered by VnPay <img src={process.env.PUBLIC_URL + '/logo-vnpay.png'} alt="VnPay Logo" style={{ width: '25%' }} />
                                        </p>
                                    </>

                                )}




                            </div>
                        </div>
                    </div>
                </section>{/* End Cource Details Section */}
                {/* ======= Cource Details Tabs Section ======= */}

                <section id="cource-details-tabs" className="cource-details-tabs">
                    {course.isOnlineClass && (

                        <div className="container" data-aos="fade-up">
                            {classModuleList.map((classModule, index) => (
                                <div className="row">
                                    <div className="col-lg-3">

                                        <ul className="nav nav-tabs flex-column">
                                            <li className="nav-item">
                                                <a
                                                    className={`nav-link ${index === 0 ? 'active show' : ''}`}
                                                    onClick={(event) => handleTabClick(event, classModule.id)}
                                                    href={`#tab-${classModule.id}`}
                                                > On Date:
                                                    <span style={{ color: '#f58d04' }}> {classModule.startDate.substring(0, 10)}</span>
                                                </a>
                                            </li>
                                        </ul>
                                    </div>
                                    <div className="col-lg-9 mt-4 mt-lg-0">
                                        <div className="tab-content">

                                            <div
                                                className={`tab-pane ${index === 0 ? 'active show' : ''}`}
                                                id={`tab-${classModule.id}`}
                                            >

                                                <div>
                                                    <span style={{ color: '#f58d04', fontWeight: 'bold' }}>Class Time</span>
                                                    <div>
                                                        {classModule.classLesson.classHours}

                                                    </div>
                                                </div>


                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}


                        </div>
                    )}
                    {!course.isOnlineClass && (
                        <div className="container" data-aos="fade-up">
                            {moduleList.map((module, index) => (
                                <div className="row" key={module.id}>
                                    <div className="col-lg-3">
                                        <ul className="nav nav-tabs flex-column">
                                            <li className="nav-item">
                                                <a
                                                    className={`nav-link ${index === 0 ? 'active show' : ''}`}
                                                    onClick={(event) => handleTabClick(event, module.id)}
                                                    href={`#tab-${module.id}`}
                                                >
                                                    {module.name}
                                                </a>
                                            </li>
                                        </ul>
                                    </div>
                                    <div className="col-lg-9 mt-4 mt-lg-0">
                                        <div className="tab-content">
                                            <div
                                                className={`tab-pane ${index === 0 ? 'active show' : ''}`}
                                                id={`tab-${module.id}`}
                                            >
                                                <div className="lessons">
                                                    <h4 style={{ color: '#f58d04' }}>Lessons</h4>
                                                    {lessonList
                                                        .filter(lesson => lesson.moduleId === module.id)
                                                        .map((lesson, lessonIndex) => (
                                                            <div className="lesson" key={lessonIndex}>
                                                                <p>{lesson.name}</p>
                                                            </div>
                                                        ))}
                                                </div>
                                                <div className="assignments">
                                                    <h4 style={{ color: '#f58d04' }}>Assignments</h4>
                                                    {assignmentList
                                                        .filter(assignment => assignment.moduleId === module.id)
                                                        .map((assignment, assignmentIndex) => (
                                                            <div className="assignment" key={assignmentIndex}>
                                                                <p>Deadline: {assignment.deadline}  minutes</p>
                                                            </div>
                                                        ))}
                                                </div>
                                                <div className="quizzes">
                                                    <h4 style={{ color: '#f58d04' }}>Quizzes</h4>
                                                    {quizList
                                                        .filter(quiz => quiz.moduleId === module.id)
                                                        .map((quiz, quizIndex) => (
                                                            <div className="quiz" key={quizIndex}>
                                                                <p>{quiz.name}</p>
                                                            </div>
                                                        ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}



                </section>{/* End Cource Details Tabs Section */}
            </main>{/* End #main */}

            <Footer />
        </>
    )
}

export default DetailCourse