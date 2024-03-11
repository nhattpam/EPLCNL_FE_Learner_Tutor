import React, { useEffect, useState } from 'react';
import Header from '../Header'
import Footer from '../Footer'
import { Link, useParams } from 'react-router-dom'
import courseService from '../../services/course.service'
import moduleService from '../../services/module.service';
import transactionService from '../../services/transaction.service';
import { Button } from 'bootstrap';
import enrollmentService from '../../services/enrollment.service';
import classLessonService from '../../services/class-lesson.service';

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
        // console.log("This is enrollment haha:  ", enrollment);
    }, [enrollment]);


    const [moduleList, setModuleList] = useState([]);
    const [classModuleList, setClassModuleList] = useState([]);
    const [assignmentList, setAssignmentList] = useState([]);
    const [lessonList, setLessonList] = useState([]);
    const [quizList, setQuizList] = useState([]);
    //get num of learners
    const [learnersCount, setLearnersCount] = useState({});
    //class topics by classLessonId
    const [classTopicList, setClassTopicList] = useState([]);


    //get num of learners
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
        const fetchLearnersCount = async () => {
            try {
                const learnersResponse = await courseService.getAllEnrollmentsByCourse(courseId);
                const learnersOfCourse = learnersResponse.data;
                console.log(learnersResponse.data)
                const count = learnersOfCourse.length;
                setLearnersCount(prevState => ({ ...prevState, [courseId]: count }));
            } catch (error) {
                console.error(`Error fetching learners for course ${course.name}:`, error);
            }
        };

        if (courseId) {
            fetchLearnersCount();
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
                // Ensure classModuleList is initialized with an empty array if res.data is undefined
                setClassModuleList(res.data || []);

                // Fetch class topics for each class lesson
                const promises = res.data.map(classModule =>
                    classLessonService.getAllClassTopicsByClassLesson(classModule.classLesson.id)
                );

                // Wait for all promises to resolve
                Promise.all(promises)
                    .then(topicResponses => {
                        // Extract data from each response and update classTopicList
                        const topics = topicResponses.map(response => response.data || []);
                        setClassTopicList(topics);
                        console.log("LENGTH: " + topics.length);
                    })
                    .catch((error) => {
                        console.log(error);
                    });
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

    const [combinedList, setCombinedList] = useState([]);
    useEffect(() => {
        // Combine lessons, assignments, and quizzes into a single array
        const combined = [
            ...lessonList.map(lesson => ({ ...lesson, type: 'lesson' })),
            ...assignmentList.map(assignment => ({ ...assignment, type: 'assignment' })),
            ...quizList.map(quiz => ({ ...quiz, type: 'quiz' }))
        ];
        // Sort the combined array based on your preferred logic

        setCombinedList(combined);
    }, [lessonList, assignmentList, quizList]);


    //list feedbacks
    const [feedbackList, setFeedbackList] = useState([]);
    useEffect(() => {
        if (courseId) {
            courseService.getAllFeedbacksByCourse(courseId)
                .then((res) => {
                    setFeedbackList(res.data);
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    }, [courseId]);


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
                                    <p>{learnersCount[course.id]}</p>
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
                                                    course.isOnlineClass ? (
                                                        <Link
                                                            type="button"
                                                            className="btn btn-primary btn-lg btn-block get-button"
                                                            to={`/study-class/${courseId}`}
                                                            style={{ backgroundColor: '#f58d04', color: '#fff' }}
                                                        >
                                                            Study Now
                                                        </Link>
                                                    ) : (
                                                        <Link
                                                            type="button"
                                                            className="btn btn-primary btn-lg btn-block get-button"
                                                            to={`/study-course/${courseId}`}
                                                            style={{ backgroundColor: '#f58d04', color: '#fff' }}
                                                        >
                                                            Study Now
                                                        </Link>
                                                    )
                                                ) : (
                                                    <div>
                                                        <button
                                                            type="button"
                                                            className="btn btn-primary btn-lg btn-block get-button"
                                                            onClick={handlePayClick}
                                                            style={{ backgroundColor: '#f58d04' }}
                                                        >
                                                            Get - ${course.stockPrice}
                                                        </button>
                                                        <p className='mt-2'>Powered by VnPay <img src={process.env.PUBLIC_URL + '/logo-vnpay.png'} alt="VnPay Logo" style={{ width: '25%' }} />
                                                        </p>
                                                    </div>


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
                            {
                                classModuleList.length > 0 && classModuleList.map((classModule, index) => (
                                    <div className="row">
                                        <div className="col-lg-3">

                                            <ul className="nav nav-tabs flex-column">
                                                <li className="nav-item get-button">
                                                    <a
                                                        className={`nav-link ${index === 0 ? 'active show' : ''}`}
                                                        onClick={(event) => handleTabClick(event, classModule.id)}
                                                        href={`#tab-${classModule.id}`}
                                                    > On Date:
                                                        <span style={{ color: '#f58d04' }}>{new Date(classModule.startDate).toLocaleDateString('en-US')}</span>
                                                    </a>
                                                </li>
                                            </ul>
                                        </div>
                                        <div className="col-lg-9 mt-4 mt-lg-0">
                                            <div className="tab-content card get-button" style={{ alignItems: 'center' }}>

                                                <div
                                                    className={`tab-pane ${index === 0 ? 'active show' : ''}`}
                                                    id={`tab-${classModule.id}`}
                                                >

                                                    <div>

                                                        <div>
                                                            <p style={{ textAlign: 'justify' }}> <span style={{ color: '#f58d04', fontWeight: 'bold' }}>Class Time: </span> {classModule.classLesson.classHours}</p>

                                                            <ul>
                                                                {classTopicList[index] && classTopicList[index].map((classTopic, topicIndex) => (
                                                                    <li key={topicIndex}>{classTopic.name}</li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    </div>


                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            }
                            {
                                classModuleList.length === 0 && (
                                    <p>No modules for this course.</p>
                                )
                            }


                        </div>
                    )}
                    {!course.isOnlineClass && (
                        <div className="container" data-aos="fade-up">
                            {
                                moduleList.length > 0 && moduleList.map((module, index) => (
                                    <div className="row" key={module.id}>
                                        <div className="col-lg-3">
                                            <ul className="nav nav-tabs flex-column">
                                                <li className="nav-item get-button">
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
                                        <div className="col-lg-9 mt-4 mt-lg-0 ">
                                            <div className="tab-content card get-button" style={{ alignItems: 'center' }}>
                                                <div
                                                    className={`tab-pane ${index === 0 ? 'active show' : ''}`}
                                                    id={`tab-${module.id}`}
                                                >
                                                    {
                                                        combinedList.length > 0 && combinedList.map((item, combinedIndex) => (
                                                            <div className="combined-item" key={combinedIndex}>
                                                                {item.type === 'lesson' && (
                                                                    <div className="lesson">
                                                                        <p style={{ textAlign: 'justify' }}><span style={{ color: '#f58d04', fontWeight: 'bold' }}>{combinedIndex + 1}.</span> Lesson: {item.name}</p>
                                                                    </div>
                                                                )}
                                                                {item.type === 'assignment' && (
                                                                    <div className="assignment">
                                                                        <p style={{ textAlign: 'justify' }}><span style={{ color: '#f58d04', fontWeight: 'bold' }}>{combinedIndex + 1}.</span> Assignment - Deadline: {item.deadline} minutes</p>
                                                                    </div>
                                                                )}
                                                                {item.type === 'quiz' && (
                                                                    <div className="quiz">
                                                                        <p style={{ textAlign: 'justify' }}><span style={{ color: '#f58d04', fontWeight: 'bold' }}>{combinedIndex + 1}.</span> Quiz - {item.name}</p>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        ))
                                                    }
                                                    {
                                                        combinedList.length === 0 && (
                                                            <p>Empty.</p>
                                                        )
                                                    }

                                                </div>
                                            </div>

                                        </div>

                                    </div>
                                ))}
                        </div>
                    )}



                </section>{/* End Cource Details Tabs Section */}


            </main>{/* End #main */}
            {/* ======= Cource Details Section ======= */}
            <section id="course-details" className="course-details">
                <div className="container-fluid" data-aos="fade-up">
                    <div className="row">
                        <>
                            <div className="container ">
                                <div className="row height d-flex justify-content-center align-items-center">
                                    <div className="row">
                                        <div className="card">
                                            <div className="p-3">
                                                <h2>Feedbacks</h2>
                                            </div>
                                            {
                                                feedbackList.length > 0 && feedbackList.map((feedback, index) => (
                                                    <>
                                                        {/* <div className="mt-3 d-flex flex-row align-items-center p-3 form-color"> <img src="https://i.imgur.com/zQZSWrt.jpg" width={50} className="rounded-circle mr-2" /> <input type="text" className="form-control" placeholder="Enter your comment..." /> </div> */}
                                                        < div className="mt-2" >
                                                            <div className="d-flex flex-row p-3"> <img src={feedback.learner.account.imageUrl} width={40} height={40} className="rounded-circle mr-3" />
                                                                <div className="w-100">
                                                                    <div className="d-flex justify-content-between align-items-center">
                                                                        <div className="d-flex flex-row align-items-center"> <span className="mr-2" style={{ fontWeight: 'bold' }}>{feedback.learner.account.fullName}</span> <small className="c-badge">Top Comment</small> </div> <small>{feedback.createdDate}</small>
                                                                    </div>
                                                                    <p className="text-justify comment-text mb-0" dangerouslySetInnerHTML={{ __html: feedback.feedbackContent }}></p>
                                                                    <div className="d-flex flex-row user-feed"> <span className="wish"><i className="fa fa-heartbeat mr-2" />24</span> <span className="ml-3"><i className="fa fa-comments-o mr-2" />Reply</span> </div>
                                                                </div>
                                                            </div>

                                                        </div>
                                                    </>

                                                ))
                                            }
                                            {
                                                feedbackList.length === 0 && (
                                                    <p>No feedbacks yet.</p>
                                                )
                                            }



                                        </div>
                                    </div>
                                </div>
                            </div>

                        </>
                    </div>
                </div>
            </section >


            <Footer />

            <style>
                {`
                .get-button {
                    transition: transform 0.3s ease;
                }
                
                .get-button:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
                }
                @media (min-width: 0) {
                    .g-mr-15 {
                        margin-right: 1.07143rem !important;
                    }
                }
                @media (min-width: 0){
                    .g-mt-3 {
                        margin-top: 0.21429rem !important;
                    }
                }
                
                .g-height-50 {
                    height: 50px;
                }
                
                .g-width-50 {
                    width: 50px !important;
                }
                
                @media (min-width: 0){
                    .g-pa-30 {
                        padding: 2.14286rem !important;
                    }
                }
                
                .g-bg-secondary {
                    background-color: #fafafa !important;
                }
                
                .u-shadow-v18 {
                    box-shadow: 0 5px 10px -6px rgba(0, 0, 0, 0.15);
                }
                
                .g-color-gray-dark-v4 {
                    color: #777 !important;
                }
                
                .g-font-size-12 {
                    font-size: 0.85714rem !important;
                }
                
                .media-comment {
                    margin-top:20px
                }
                .card {
                    background-color: #fff;
                    border: none
                }
                
                .form-color {
                    background-color: #fafafa
                }
                
                .form-control {
                    height: 48px;
                    border-radius: 25px
                }
                
                .form-control:focus {
                    color: #495057;
                    background-color: #fff;
                    border-color: #f58d04;
                    outline: 0;
                    box-shadow: none;
                    text-indent: 10px
                }
                
                .c-badge {
                    background-color: #f58d04;
                    color: white;
                    height: 20px;
                    font-size: 11px;
                    width: 92px;
                    border-radius: 5px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    margin-top: 2px
                }
                
                .comment-text {
                    font-size: 13px
                }
                
                .wish {
                    color: #f58d04
                }
                
                .user-feed {
                    font-size: 14px;
                    margin-top: 12px
                }
                `}
            </style>
        </>
    )
}

export default DetailCourse