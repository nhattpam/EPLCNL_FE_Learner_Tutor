import React, { useEffect, useState } from 'react';
import Header from '../Header'
import Footer from '../Footer'
import { Link, useNavigate, useParams } from 'react-router-dom'
import courseService from '../../services/course.service'
import moduleService from '../../services/module.service';
import transactionService from '../../services/transaction.service';
import { Button } from 'bootstrap';
import enrollmentService from '../../services/enrollment.service';
import classLessonService from '../../services/class-lesson.service';
import accountService from '../../services/account.service';

const DetailCourse = () => {


    const { courseId } = useParams();

    const learnerId = localStorage.getItem('learnerId');
    const [showNotification, setShowNotification] = useState(false);
    const [loading, setLoading] = useState(false); // State to track loading status
    const [isEnrolled, setIsEnrolled] = useState(false);
    const accountId = localStorage.getItem('accountId');


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
    const [activeModuleId, setActiveModuleId] = useState(moduleList.length > 0 ? moduleList[0].id : null);


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

    const [combinedList, setCombinedList] = useState([]);
    const [filteredCombinedList, setFilteredCombinedList] = useState([]);
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

        // Filter the combined list based on the clicked module ID
        const filteredList = combinedList.filter(item => item.moduleId === moduleId);
        setFilteredCombinedList(filteredList);
    };

    // Function to handle tab switching
    const handleTabClick2 = (event, moduleId) => {
        // Prevent the default behavior of the link
        event.preventDefault();
        // Set the active moduleId to the clicked moduleId
        setActiveModuleId(moduleId);

        // Remove the "active" class from all tab links
        const filteredList = combinedList.filter(item => item.moduleId === moduleId);
        setFilteredCombinedList(filteredList);
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
                                                    window.location.reload();
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

    //pay by wallet
    const [account, setAccount] = useState({
        email: "",
        password: "",
        fullName: "",
        phoneNumber: "",
        imageUrl: "",
        gender: "",
        wallet: []
    });

    useEffect(() => {
        if (accountId) {
            accountService
                .getAccountById(accountId)
                .then((res) => {
                    setAccount(res.data);
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    }, [accountId]);

    const [showPayBalanceModal, setShowPayBalanceModal] = useState(false);

    const openPayBalanceModal = () => {
        setShowPayBalanceModal(true);
    };

    const closePayBalanceModal = () => {
        setShowPayBalanceModal(false);
    };
    const handlePayBalance = (event) => {
        event.preventDefault();

        openPayBalanceModal();
    }
    const navigate = useNavigate();

    const PayBalance = () => {
        try {
            const transactionData = {
                courseId: courseId,
                learnerId: learnerId,
                amount: course.stockPrice * 24000,
                paymentMethodId: "2968c869-dceb-4b3e-8c6d-720fccb89a88"
            };

            transactionService
                .saveTransaction(transactionData)
                .then((response) => {
                    transactionService.payByWallet(response.data.id);
                    window.alert("Pay successfully")
                    navigate(`/my-learning/${learnerId}`)
                })
                .catch((error) => {
                    console.error("Error while saving transaction:", error);
                    window.alert("Payment failed. Please try again later.");
                });
        } catch (error) {
            console.error("Error during payment process:", error);
            window.alert("Payment failed. Please try again later.");
        }
    }


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
            <main id="main" style={{ backgroundColor: '#fff' }}>
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
                            <div className="col-lg-4" style={{ backgroundColor: '#fff' }}>
                                <div className="course-info d-flex justify-content-between align-items-center" style={{ backgroundColor: '#fff' }}>
                                    <h5 style={{ color: '#f58d04', fontWeight: 'bold' }}>Tutor</h5>
                                    <p><a href="#">{course.tutor?.account?.fullName}</a></p>
                                </div>
                                <div className="course-info d-flex justify-content-between align-items-center" style={{ backgroundColor: '#fff' }}>
                                    <h5 style={{ color: '#f58d04', fontWeight: 'bold' }}>Course Fee</h5>
                                    <p>${course.stockPrice}</p>
                                </div>
                                <div className="course-info d-flex justify-content-between align-items-center" style={{ backgroundColor: '#fff' }}>
                                    <h5 style={{ color: '#f58d04', fontWeight: 'bold' }}>Enrolled Students</h5>
                                    <p>{learnersCount[course.id]}</p>
                                </div>
                                {/* Notification */}
                                {showNotification && (
                                    <div className="notification fixed-top w-100 bg-warning text-center" style={{ backgroundColor: '#fff' }}>
                                        <p className="m-0">You need to login first</p>
                                    </div>
                                )}
                                {!loading ? (
                                    <>
                                        {enrollment === null ? (
                                            <>
                                                <div className="course-info d-flex justify-content-between align-items-center" style={{ backgroundColor: '#fff' }}>
                                                    <button
                                                        type="button"
                                                        className="btn btn-primary btn-lg btn-block"
                                                        onClick={handlePayClick}
                                                        style={{ backgroundColor: '#f58d04', borderRadius: '50px', padding: `8px 25px` }}
                                                    >
                                                        Get - ${course.stockPrice}
                                                    </button>
                                                </div>
                                                <p>Powered by <img src={process.env.PUBLIC_URL + '/logo-vnpay.png'} alt="VnPay Logo" style={{ width: '25%' }} />
                                                </p>
                                                <div className="course-info d-flex justify-content-between align-items-center" style={{ backgroundColor: '#fff' }}>
                                                    <button
                                                        type="button"
                                                        className="btn btn-primary btn-lg btn-block"
                                                        onClick={handlePayBalance}
                                                        style={{ backgroundColor: '#fff', color: '#000', borderRadius: '50px', padding: `8px 25px` }}
                                                    >
                                                        Or use your balance - ${course.stockPrice}
                                                    </button>
                                                </div>
                                            </>


                                        ) : (
                                            <div className="course-info d-flex justify-content-between align-items-center" style={{ backgroundColor: '#fff' }}>
                                                {isEnrolled ? (
                                                    course.isOnlineClass ? (
                                                        <Link
                                                            type="button"
                                                            className="btn btn-primary btn-lg btn-block get-button"
                                                            to={`/study-class/${courseId}`}
                                                            style={{ backgroundColor: '#f58d04', color: '#fff', borderRadius: '50px', padding: `8px 25px` }}
                                                        >
                                                            Study Now
                                                        </Link>
                                                    ) : (
                                                        <Link
                                                            type="button"
                                                            className="btn btn-primary btn-lg btn-block get-button"
                                                            to={`/study-course/${courseId}`}
                                                            style={{ backgroundColor: '#f58d04', color: '#fff', borderRadius: '50px', padding: `8px 25px` }}
                                                        >
                                                            Study Now
                                                        </Link>
                                                    )
                                                ) : (
                                                    <>
                                                        <button
                                                            type="button"
                                                            className="btn btn-primary btn-lg btn-block get-button"
                                                            onClick={handlePayClick}
                                                            style={{ backgroundColor: '#f58d04', borderRadius: '50px', padding: `8px 25px` }}
                                                        >
                                                            Get - ${course.stockPrice}
                                                        </button>
                                                        <p className='mt-2'>Powered by <img src={process.env.PUBLIC_URL + '/logo-vnpay.png'} alt="VnPay Logo" style={{ width: '25%' }} />
                                                        </p>
                                                        <div className="course-info d-flex justify-content-between align-items-center">
                                                            <button
                                                                type="button"
                                                                className="btn btn-primary btn-lg btn-block"
                                                                onClick={handlePayBalance}
                                                                style={{ backgroundColor: '#fff', color: '#000', borderRadius: '50px', padding: `8px 25px` }}
                                                            >
                                                                Or use your balance - ${course.stockPrice}
                                                            </button>
                                                        </div>
                                                    </>



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
                                                style={{ backgroundColor: '#f58d04', cursor: 'not-allowed', borderRadius: '50px', padding: `8px 25px` }}
                                            >
                                                Loading...
                                            </button>
                                        </div>
                                        <p>Powered by <img src={process.env.PUBLIC_URL + '/logo-vnpay.png'} alt="VnPay Logo" style={{ width: '25%' }} />
                                        </p>
                                    </>

                                )}


                            </div>
                            {
                                showPayBalanceModal && (
                                    <div className="modal" tabIndex="-1" role="dialog" style={{ display: 'block', backgroundColor: 'rgba(29, 29, 29, 0.75)' }}>
                                        <div className="modal-dialog" role="document">
                                            <div className="modal-content">
                                                <div className="modal-header">
                                                    <h5 className="modal-title">Do you want to use your balance - <span style={{ fontWeight: 'bold', color: '#f58d04' }}>${account.wallet?.balance}</span></h5>
                                                    <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={closePayBalanceModal}>
                                                        <span aria-hidden="true">&times;</span>
                                                    </button>
                                                </div>
                                                <div className="modal-body">
                                                    <div className="table-responsive">
                                                        <table id="demo-foo-filtering" className="table table-borderless table-hover table-wrap table-centered mb-0" data-page-size={7}>
                                                            <thead className="thead-light">
                                                                <tr>
                                                                    <th>Image</th>
                                                                    <th>Name</th>
                                                                    <th>Price</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                <tr>
                                                                    <td>
                                                                        <img src={course.imageUrl} style={{ width: '100px', height: '60px' }}></img>
                                                                    </td>
                                                                    <td>{course.name}</td>
                                                                    <td><span style={{ fontWeight: 'bold' }}>$</span>{course.stockPrice}</td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </div>
                                                <div className="modal-footer">
                                                    {/* Conditional rendering of buttons based on edit mode */}
                                                    <button type="button" className="btn btn-dark" onClick={closePayBalanceModal} style={{ borderRadius: '50px', padding: `8px 25px` }}>Close</button>
                                                    {
                                                        course.stockPrice < account.wallet?.balance && (
                                                            <button type="button" className="btn btn-secondary" style={{ backgroundColor: '#f58d04', borderRadius: '50px', padding: `8px 25px` }} onClick={() => PayBalance()}>Pay</button>
                                                        )
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            }
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
                                                <li className="nav-item get-button" style={{ borderRadius: '50px', padding: `8px 25px` }}>
                                                    <a
                                                        className={`nav-link ${index === 0 ? 'active show' : ''}`}
                                                        onClick={(event) => handleTabClick(event, classModule.id)}
                                                        href={`#tab-${classModule.id}`} style={{ borderRadius: '50px', padding: `8px 25px` }}
                                                    > On Date:
                                                        <span style={{ color: '#f58d04' }}>{new Date(classModule.startDate).toLocaleDateString('en-US')}</span>
                                                    </a>
                                                </li>
                                            </ul>
                                        </div>
                                        <div className="col-lg-9 mt-4 mt-lg-0">
                                            <div className="tab-content card get-button" style={{ alignItems: 'center',  borderRadius: '50px', padding: `8px 25px` }}>

                                                <div
                                                    className={`tab-pane ${index === 0 ? 'active show' : ''}`}
                                                    id={`tab-${classModule.id}`} 
                                                >

                                                    <div>

                                                        <div>
                                                            <p style={{ textAlign: 'justify' }}> <span style={{ color: '#f58d04', fontWeight: 'bold' }}>Class Time: </span> {classModule.classLesson.classHours}</p>

                                                            <ul>
                                                                {classTopicList[index] && classTopicList[index].map((classTopic, topicIndex) => (
                                                                    <span key={topicIndex}>
                                                                        <span style={{ fontWeight: 'bold' }}>Topic - </span>{classTopic.name}<br />
                                                                    </span>
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
                                    <>
                                        <i class="fas fa-puzzle-piece fa-2x"></i>
                                        <p>No modules for this course.</p>
                                    </>
                                )
                            }


                        </div>
                    )}
                    {!course.isOnlineClass && (
                        <div className="container" data-aos="fade-up">
                            {moduleList.length > 0 && moduleList.map((module, index) => (
                                <div className="row" key={module.id}>
                                    <div className="col-lg-3">
                                        <ul className="nav nav-tabs flex-column">
                                            <li className="nav-item get-button" style={{ borderRadius: '50px', padding: `8px 25px` }}> 
                                                <a
                                                    className={`nav-link ${module.id === activeModuleId ? 'active show' : ''}`}
                                                    onClick={(event) => handleTabClick2(event, module.id)}
                                                    href={`#tab-${module.id}`}  style={{ borderRadius: '50px', padding: `8px 25px` }}
                                                >
                                                    {module.name}
                                                </a>
                                            </li>
                                        </ul>
                                    </div>
                                    <div className="col-lg-9 mt-4 mt-lg-0 ">
                                        <div className="tab-content card get-button" style={{ alignItems: 'center',  borderRadius: '50px', padding: `8px 25px` }}>
                                            <div
                                                className={`tab-pane ${module.id === activeModuleId ? 'active show' : ''}`}
                                                id={`tab-${module.id}`}
                                            >
                                                {
                                                    filteredCombinedList.length > 0 && filteredCombinedList.map((item, combinedIndex) => (
                                                        <div className="combined-item" key={combinedIndex} style={{ borderRadius: '50px', padding: `8px 25px` }}>
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
                                                    filteredCombinedList.length === 0 && (
                                                        <>
                                                            <i class="fas fa-puzzle-piece fa-2x"></i>
                                                            <p>Empty.</p>
                                                        </>
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
            <section id="course-details" className="course-details" style={{ backgroundColor: '#fff' }}>
                <div className="container-fluid" data-aos="fade-up">
                    <div className="row">
                        <>
                            <div className="container ">
                                <div className="row height d-flex justify-content-center align-items-center">
                                    <div className="row">
                                        <div className="">
                                            <div className="p-3">
                                                <h2>Feedbacks</h2>
                                            </div>
                                            {
                                                feedbackList.length > 0 && feedbackList.map((feedback, index) => (
                                                    <>
                                                        {/* <div className="mt-3 d-flex flex-row align-items-center p-3 form-color"> <img src="https://i.imgur.com/zQZSWrt.jpg" width={50} className="rounded-circle mr-2" /> <input type="text" className="form-control" placeholder="Enter your comment..." /> </div> */}
                                                        < div className="mt-2" >
                                                            <div className="d-flex flex-row p-3"> <img src={feedback.learner?.account?.imageUrl} width={40} height={40} className="rounded-circle mr-3" />
                                                                <div className="w-100">
                                                                    <div className="d-flex justify-content-between align-items-center">
                                                                        <div className="d-flex flex-row align-items-center"> <span className="mr-2" style={{ fontWeight: 'bold' }}>{feedback.learner?.account?.fullName}</span> <small className="c-badge">Top Comment</small> </div> <small>{feedback.createdDate}</small>
                                                                    </div>
                                                                    <p className="text-justify comment-text mb-0" dangerouslySetInnerHTML={{ __html: feedback.feedbackContent }}></p>
                                                                </div>
                                                            </div>

                                                        </div>
                                                    </>

                                                ))
                                            }
                                            {
                                                feedbackList.length === 0 && (
                                                    <>
                                                        <i class="fas fa-comments fa-2x"></i>
                                                        <p>No feedbacks yet.</p>

                                                    </>
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