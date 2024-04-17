import React, { useEffect, useState } from 'react';
import Header from '../../Header';
import Footer from '../../Footer';
import { Link, useParams } from 'react-router-dom';
import courseService from '../../../services/course.service';
import moduleService from '../../../services/module.service'; // Import module service
import lessonService from '../../../services/lesson.service';
import assignmentService from '../../../services/assignment.service';
import ReactQuill from 'react-quill';
import assignmentAttemptService from '../../../services/assignment-attempt.service';
import quizAttemptService from '../../../services/quiz-attempt.service';
import quizService from '../../../services/quiz.service';
import questionService from '../../../services/question.service';
import learnerService from '../../../services/learner.service';
import peerReviewService from '../../../services/peer-review.service';
import Dropzone from 'react-dropzone';
import { CountdownCircleTimer } from 'react-countdown-circle-timer'

const StudyCourse = () => {
    const { courseId } = useParams();
    const learnerId = localStorage.getItem('learnerId');


    const [course, setCourse] = useState({
        name: "",
        modules: []
    });

    const [moduleList, setModuleList] = useState([]);
    //dua course name che lap header
    const [fixedCourseName, setFixedCourseName] = useState(false);


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
                setModuleList(res.data);
            })
            .catch((error) => {
                console.log(error);
            });
    }, [courseId]);

    const [selectedModule, setSelectedModule] = useState(null);
    const [moduleContent, setModuleContent] = useState({
        lessons: [],
        assignments: [],
        quizzes: []
    });

    // State to track expanded/collapsed state of modules
    const [expandedModules, setExpandedModules] = useState([]);


    // Function to toggle expansion state of a module
    const toggleModuleExpansion = (moduleId) => {
        if (expandedModules.includes(moduleId)) {
            setExpandedModules(expandedModules.filter(id => id !== moduleId));
        } else {
            setExpandedModules([...expandedModules, moduleId]);
        }
    };


    useEffect(() => {
        if (selectedModule) {
            // Fetch lessons, assignments, and quizzes based on the selected module
            moduleService.getAllLessonsByModule(selectedModule.id)
                .then((res) => {
                    setModuleContent(prevState => ({ ...prevState, lessons: res.data }));
                })
                .catch((error) => {
                    console.log(error);
                });

            moduleService.getAllAssignmentsByModule(selectedModule.id)
                .then((res) => {
                    setModuleContent(prevState => ({ ...prevState, assignments: res.data }));
                })
                .catch((error) => {
                    console.log(error);
                });

            moduleService.getAllQuizzesByModule(selectedModule.id)
                .then((res) => {
                    setModuleContent(prevState => ({ ...prevState, quizzes: res.data }));
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    }, [selectedModule]);

    useEffect(() => {
        try {
            // Check if moduleContent and moduleContent.assignments are defined
            if (moduleContent && moduleContent.assignments) {
                // Iterate over assignments array using forEach
                moduleContent.assignments.forEach(assignment => {
                    learnerService
                        .getAllAssignmentAttemptByLearnerId(learnerId)
                        .then((res) => {
                            // console.log("Response data:", res.data); // Log the entire response data to inspect its structure
                            // console.log("List assignment attempts:", res.data.length); // Log the length of the assignment attempts
                            setAssignmentAttemptList(res.data);


                            if (res.data.length > 0) {
                                res.data.forEach(assignmentAttempt => {
                                    if (assignmentAttempt.assignmentId === assignment.id) {
                                        // if (assignmentAttempt.totalGrade >= assignment.gradeToPass) {
                                        //     console.log("TOTAL: " + assignmentAttempt.totalGrade);
                                        //     console.log("PASS: " + assignment.gradeToPass);
                                        //     setIsDoneAssignment(true);
                                        // }
                                        console.log("assignmentID: " + assignment.id)
                                    } else {
                                        console.log("NOT FOUND")
                                    }
                                });
                            }
                        })
                        .catch((error) => {
                            console.log("Error fetching assignment attempts:", error); // Log any errors that occur during the request
                        });
                });
            }
        } catch (error) {
            console.log("Error fetching data:", error);
        }
    }, [moduleContent]); // Include moduleContent in the dependency array if it might change

    useEffect(() => {
        try {
            // Check if moduleContent and moduleContent.assignments are defined
            if (moduleContent && moduleContent.quizzes) {
                // Iterate over assignments array using forEach
                moduleContent.quizzes.forEach(quiz => {
                    learnerService
                        .getAllQuizAttemptByLearnerId(learnerId)
                        .then((res) => {
                            // console.log("Response data:", res.data); // Log the entire response data to inspect its structure
                            // console.log("List quiz attempts:", res.data.length); // Log the length of the assignment attempts
                            setQuizAttemptList(res.data);


                            if (res.data.length > 0) {
                                res.data.forEach(quizAttempt => {
                                    if (quizAttempt.quizId === quiz.id) {
                                        if (quizAttempt.totalGrade >= quiz.gradeToPass) {
                                            setIsDoneQuiz(true);
                                        }
                                    } else {
                                        console.log("NOT FOUND")
                                    }
                                });
                            }
                        })
                        .catch((error) => {
                            console.log("Error fetching quiz attempts:", error); // Log any errors that occur during the request
                        });
                });
            }
        } catch (error) {
            console.log("Error fetching data:", error);
        }
    }, [moduleContent]); // Include moduleContent in the dependency array if it might change


    // Function to handle click on a module card to toggle expansion
    const handleModuleCardClick = (moduleId) => {
        toggleModuleExpansion(moduleId);
        setSelectedModule(moduleList.find(module => module.id === moduleId));
    };


    //scroll

    //chi tiet module (lesson, assignment, quiz)
    //LESSON
    const [lesson, setLesson] = useState({
        name: "",
        moduleId: "",
        videoUrl: "",
        reading: ""
    });

    // State for lesson
    const [selectedLessonId, setSelectedLessonId] = useState(null);
    const [selectedLesson, setSelectedLesson] = useState(null);
    const [materialList, setMaterialList] = useState([]);

    useEffect(() => {
        if (selectedLessonId) {
            lessonService
                .getLessonById(selectedLessonId)
                .then((res) => {
                    setSelectedLesson(res.data);
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    }, [selectedLessonId]);

    // Function to handle click on a lesson card to show details
    const handleLessonClick = (lessonId) => {
        setSelectedLessonId(lessonId);
        setSelectedAssignmentId(null); // Reset selected assignment
        setSelectedAssignment(null);
        setSelectedQuizId(null);
        setSelectedQuiz(null);
        setShowForm(false);
        setQuizStarted(false);
        setShowQuestions(false);
        setShowResult(false);
    };

    const [lessonMaterial, setLessonMaterial] = useState({
        name: '',
        materialUrl: '',
        createdDate: '',
        updatedDate: ''
    });

    useEffect(() => {
        if (selectedLessonId) {
            lessonService
                .getAllMaterialsByLesson(selectedLessonId)
                .then((res) => {
                    setMaterialList(res.data);
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    }, [selectedLessonId]);

    //ASSIGNMENT
    const [assignment, setAssignment] = useState({
        questionText: "",
        deadline: "", // set a default value for minutes
        moduleId: ""
    });

    // State for lesson
    const [selectedAssignmentId, setSelectedAssignmentId] = useState(null);
    const [selectedAssignment, setSelectedAssignment] = useState(null);
    const [isDoneAssignment, setIsDoneAssignment] = useState(false);
    const [isDoneQuiz, setIsDoneQuiz] = useState(false);
    const [assignmentAttemptList, setAssignmentAttemptList] = useState([]);
    const [quizAttemptList, setQuizAttemptList] = useState([]);

    //check neu trong list peer review co assignment id
    const [notReviewYetList, setNotReviewList] = useState([]);
    const [showNotReviewYetList, setShowReviewYetList] = useState(false);

    // Function to handle click on a assignment card to show details
    const handleAssignmentClick = async (assignmentId) => {
        setSelectedAssignmentId(assignmentId);
        console.log("THIS IS ASS: " + assignmentId);
        setSelectedLessonId(null);
        setSelectedLesson(null);
        setSelectedQuizId(null);
        setSelectedQuiz(null);
        setShowTimer(false);
        setQuizStarted(false);
        setShowQuestions(false);
        setShowResult(false);
        setShowTimer2(false);

        if (assignmentId) {
            try {
                setSelectedAssignmentId(assignmentId); // Await the state update

                const resAss = await assignmentService.getAssignmentById(assignmentId);
                setSelectedAssignment(resAss.data);

                const res = await assignmentAttemptService.getAllAssignmentAttemptNotGradeYetByAssignment(assignmentId, learnerId);
                setNotReviewList(res.data.slice(0, 5));
                res.data.forEach(element => {
                    // console.log(JSON.stringify(element));
                });
            } catch (error) {
                console.log("Error fetching assignment attempts:", error);
            }
        }
        //PEER REVIEW
    };


    // State to track whether the form should be displayed or not
    const [showForm, setShowForm] = useState(false);
    // State to track whether the timer should be displayed or not
    const [showTimer, setShowTimer] = useState(false);

   

    const [showTimer2, setShowTimer2] = useState(false);

 

    // Function to handle click on the "Start Assignment" button
    const handleStartAssignment = () => {
        setShowTimer(true);
        setShowForm(true);
        setShowTimer2(false);
        setSelectedQuiz(null);
        setSelectedQuizId(null);

    };

   

  

    const [assignmentAttempt, setAssignmentAttempt] = useState({
        assignmentId: selectedAssignmentId,
        learnerId: learnerId,
        answerText: "",
        answerAudioUrl: ""
    });


    const handleChangeAnswerText = (value) => {
        setAssignmentAttempt(prevState => ({
            ...prevState,
            answerText: value
        }));
    };

    useEffect(() => {
        setAssignmentAttempt(prevState => ({
            ...prevState,
            assignmentId: selectedAssignmentId
        }));
    }, [selectedAssignmentId]);

    const [file2, setFile2] = useState(null);

    const handleFileDrop2 = (acceptedFiles) => {
        if (acceptedFiles && acceptedFiles.length > 0) {
            const currentFile2 = acceptedFiles[0];

            // Log the audio file details
            console.log("Audio File: ", currentFile2);

            setFile2(currentFile2);

            // Set the audio preview URL
            setAssignmentAttempt({ ...assignmentAttempt, answerAudioUrl: URL.createObjectURL(currentFile2) });
        }
    };

    const submitAssignmentAttempt = async (e) => {
        e.preventDefault();

        let answerAudioUrl = assignmentAttempt.answerAudioUrl;

        if (file2) {
            const audioData = new FormData();
            audioData.append('file', file2);
            const audioResponse = await questionService.uploadAudio(audioData);
            answerAudioUrl = audioResponse.data;
        }

        const assignmentAttemptData = { ...assignmentAttempt, answerAudioUrl };
        console.log(JSON.stringify(assignmentAttemptData));


        try {
            // Save assignmentAttempt
            const assignmentAttemptResponse = await assignmentAttemptService.saveAssignmentAttempt(assignmentAttemptData);

            // console.log(courseResponse.data);
            const assignmentAttemptJson = JSON.stringify(assignmentAttemptResponse.data);

            // const assignmentAttemptJsonParse = JSON.parse(assignmentAttemptJson);

            // console.log(assignmentAttemptJsonParse);
            window.alert('Your assignment is submited!');
            setShowForm(false);
            setShowTimer(false);
            setShowTimer2(false);
            setShowAttempts(true);

            // navigate(`/list-assignment-attempt/${tutorId}`);
        } catch (error) {
            console.log(error);
        }
    };

    const [showAttempts, setShowAttempts] = useState(false);
    const [attemptList, setAttemptList] = useState([]);
    const [attemptList2, setAttemptList2] = useState([]);
    //my assignment attempt
    const [myAssignmentAttempt, setMyAssignmentAttempt] = useState({
        assignmentId: "",
        learnerId: "",
        answerText: "",
        answerAudioUrl: ""
    });
    useEffect(() => {
        if (selectedAssignmentId) {
            assignmentService.getAllAssignmentAttemptByAssignmentId(selectedAssignmentId)
                .then((res) => {

                    const list = res.data.filter(attempt => attempt.learnerId !== learnerId).slice(0, 5);
                    const list2 = res.data.filter(attempt => attempt.learnerId === learnerId).slice(0, 5);
                    setAttemptList(list);
                    setAttemptList2(list2);
                    if (list2.length > 0) {
                        setShowReviewYetList(true);
                    }

                })
                .catch((error) => {
                    console.log(error);
                });
        }

    }, [selectedAssignmentId]);

    useEffect(() => {
        if (attemptList2.length === 0) return; // Do nothing if attemptList2 is empty

        const learnerAttempt = attemptList2.find(attempt => attempt.learnerId === learnerId);
        if (learnerAttempt) {
            assignmentAttemptService.getAssignmentAttemptById(learnerAttempt.id)
                .then((res) => {
                    setMyAssignmentAttempt(res.data);
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    }, [attemptList2, learnerId]);


    // State for lesson
    const [selectedQuizId, setSelectedQuizId] = useState(null);
    const [selectedQuiz, setSelectedQuiz] = useState(null);
    const [questionList, setQuestionList] = useState([]);
    const [showQuestions, setShowQuestions] = useState(false);
    // Initialize state to track the current question index
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [quizStarted, setQuizStarted] = useState(false);
    const [questionAnswerList, setQuestionAnswerList] = useState([]);
    //display result assignment attempt
    const [showResult, setShowResult] = useState(false);
    const [point, setPoint] = useState(0);
    // Retrieve the current question based on the current index
    const currentQuestion = questionList[currentQuestionIndex];
    const [selectedAnswerIndex, setSelectedAnswerIndex] = useState(null);
    const [showAnswerColor, setShowAnswerColor] = useState(false);
    const [showScore, setShowScore] = useState(false);
    const [msg, setMsg] = useState("");

    useEffect(() => {
        if (selectedQuizId) {
            quizService
                .getQuizById(selectedQuizId)
                .then((res) => {
                    setSelectedQuiz(res.data);
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    }, [selectedQuizId]);

    const handleQuizClick = (quizId) => {
        setSelectedQuizId(quizId);
        setSelectedLessonId(null);
        setSelectedLesson(null);
        setSelectedAssignmentId(null);
        setSelectedAssignment(null);
        setShowForm(false);
        setShowTimer(false);
        setShowTimer2(false);
    };

    useEffect(() => {
        if (selectedQuizId) {
            quizService
                .getAllQuestionsByQuiz(selectedQuizId)
                .then((res) => {
                    // console.log(res.data);
                    setQuestionList(res.data);

                })
                .catch((error) => {
                    console.log(error);
                });
        }

    }, [selectedQuizId]);


    useEffect(() => {
        if (currentQuestion) { // Ensure currentQuestion is defined before accessing its id
            questionService
                .getAllQuestionAnswersByQuestion(currentQuestion.id)
                .then((res) => {
                    // console.log(res.data);
                    setQuestionAnswerList(res.data);
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    }, [currentQuestion?.id]); // Use optional chaining to avoid errors if currentQuestion is undefined

    const handleStartQuiz = () => {
        setPoint(0);

        setShowQuestions(true);
        // Set the quizStarted state to true when the quiz starts
        setQuizStarted(true);
        setShowTimer2(true);
        setShowTimer(false);

        setShowAnswerColor(false);
        setShowResult(false);
        setCurrentQuestionIndex(0); // Reset currentQuestionIndex to 0
        setSelectedAssignment(null);
        setSelectedAssignmentId(null);
    };

    const handleAnswerClick = (questionAnswer, index) => {
        setSelectedAnswerIndex(index);

        if (questionAnswer.isAnswer) {
            // If the selected answer is correct
            setMsg("+ " + questionAnswer.question.defaultGrade + "pts");
            const newPoint = point + questionAnswer.question.defaultGrade;
            setPoint(newPoint);
            setShowScore(true);
            setShowAnswerColor(true); // Move inside the block for correct answer
            setTimeout(() => {
                setShowScore(false);
                handleNextQuestion(newPoint);

            }, 2000);


        } else {
            // If the selected answer is incorrect
            setMsg("+ 0 pts");
            const newPoint = point;
            setPoint(newPoint);
            setShowScore(true);
            setShowAnswerColor(true); // Move inside the block for incorrect answer
            setTimeout(() => {
                setShowScore(false);
                handleNextQuestion(newPoint);

            }, 2000);
        }
    };



    // Function to handle click on the "Next" button
    const handleNextQuestion = async (point) => {
        // Increment the current question index
        setCurrentQuestionIndex(prevIndex => prevIndex + 1);
        setShowScore(false);
        setShowAnswerColor(false); // Move inside the block for correct answer

        // Check if the user has reached the last question
        if (currentQuestionIndex === questionList.length - 1) {
            // If so, alert the user
            setShowResult(true);
            setShowQuestions(false);

            const quizAttempt = {
                learnerId: learnerId,
                quizId: selectedQuizId,
                totalGrade: point
            };

            console.log(JSON.stringify(quizAttempt))
            if (quizAttempt) {
                await quizAttemptService.saveQuizAttempt(quizAttempt)
                    .then((res) => {
                        console.log(res.data);
                        setShowTimer2(false);
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            }



            //load lai trang 
            try {
                // Check if moduleContent and moduleContent.assignments are defined
                if (moduleContent && moduleContent.quizzes) {
                    // Iterate over assignments array using forEach
                    moduleContent.quizzes.forEach(quiz => {
                        learnerService
                            .getAllQuizAttemptByLearnerId(learnerId)
                            .then((res) => {
                                // console.log("Response data:", res.data); // Log the entire response data to inspect its structure
                                // console.log("List quiz attempts:", res.data.length); // Log the length of the assignment attempts
                                setQuizAttemptList(res.data);


                                if (res.data.length > 0) {
                                    res.data.forEach(quizAttempt => {
                                        if (quizAttempt.quizId === quiz.id) {
                                            if (quizAttempt.totalGrade >= quiz.gradeToPass) {
                                                setIsDoneQuiz(true);
                                            }
                                        } else {
                                            console.log("NOT FOUND")
                                        }
                                    });
                                }
                            })
                            .catch((error) => {
                                console.log("Error fetching quiz attempts:", error); // Log any errors that occur during the request
                            });
                    });
                }
            } catch (error) {
                console.log("Error fetching data:", error);
            }
        }
    };


    //PEER REVIEW
    const [peerReviews, setPeerReviews] = useState([]);
    const [submitting, setSubmitting] = useState(false);


    const submitPeerReviews = async (e) => {
        e.preventDefault();
        setSubmitting(true); // Start submission process

        try {
            await Promise.all(peerReviews.map(async (review) => {
                console.log("Before saving peer review:", JSON.stringify(review)); // First console.log
                try {
                    await peerReviewService.savePeerReview(review);
                    console.log("After saving peer review:", JSON.stringify(review)); // Second console.log
                } catch (error) {
                    console.error('Error saving peer review:', error);
                }
            }));

            // Clear the peer reviews array
            setPeerReviews([]);
            // Reload the page or perform any other necessary actions
            setShowAttempts(true);
            window.alert("Thank you!");
            window.location.reload();
        } catch (error) {
            console.error('Error submitting peer reviews:', error);
            window.alert("Error submitting peer reviews");
        } finally {
            setSubmitting(false); // Submission process completed
        }
    };

    // Update peer reviews array instead of peer review state
    const handleGradeChange = (e, attemptId) => {
        const grade = e.target.value;
        const updatedPeerReviews = [...peerReviews];

        // Find existing peer review for the attempt
        const existingReviewIndex = updatedPeerReviews.findIndex(review => review.assignmentAttemptId === attemptId);

        // If peer review already exists, update its grade; otherwise, create a new one
        if (existingReviewIndex !== -1) {
            updatedPeerReviews[existingReviewIndex].grade = grade;
        } else {
            updatedPeerReviews.push({
                assignmentAttemptId: attemptId,
                learnerId: learnerId,
                grade: grade
            });
        }

        // Update the peer reviews array state
        setPeerReviews(updatedPeerReviews);
    }




    //TIMER
    // State variable for countdown
    const timeRemaining = selectedAssignment?.deadline * 60;
    const timeRemaining2 = selectedQuiz?.deadline * 60;


    const autoSubmitAssignmentAttempt =  (e) => {
        e.preventDefault();
        submitAssignmentAttempt(e);

    }

    return (
        <>
            {/* <Header /> */}
            <main style={{ backgroundColor: '#fff' }}>

                <div className="breadcrumbs" style={{ marginTop: '-30px', paddingBottom: '10px', position: 'fixed', top: 0, width: '100%', zIndex: 999, display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingLeft: '20px', paddingRight: '20px' }} id='nav-fixed'>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <img src={process.env.PUBLIC_URL + '/meowlish_icon.png'} alt="MeowLish" style={{ width: '30px', marginRight: '5px', paddingTop: '10px' }} />
                        <Link to="/home" style={{ color: '#fff', textDecoration: 'none', fontSize: '18px', fontWeight: 'bold', marginRight: '10px' }}>MeowLish</Link><span style={{ color: '#fff' }} className='mr-2'>|</span>
                        <h4 style={{ color: '#fff', fontSize: '18px', fontWeight: 'bold', margin: 0 }}>{course.name}</h4>
                    </div>
                    <div>
                        <Link to={`/my-learning/${learnerId}`} style={{ color: 'white' }}><i className="fas fa-sign-out-alt"></i></Link>
                    </div>
                </div>



                <section id="courses" className="courses" style={{ marginTop: '-10px' }}>
                    <div className='row'>
                        <div className="col-md-8">
                            {/* Course Content */}
                            {selectedLesson && selectedLesson.videoUrl && (
                                <>
                                    <video controls style={{ width: '100%' }}>
                                        <source src={selectedLesson.videoUrl} type="video/mp4" />
                                        Your browser does not support the video tag.
                                    </video>
                                    <ul className="nav nav-tabs" id="myLearningTabs">
                                        <li className="nav-item">
                                            <a className="nav-link active" id="tab1" data-bs-toggle="tab" href="#tab-content-1">
                                                Reading
                                            </a>
                                        </li>
                                        <li className="nav-item">
                                            <a className="nav-link" id="tab2" data-bs-toggle="tab" href="#tab-content-2">
                                                Lesson Materials
                                            </a>
                                        </li>

                                    </ul>
                                    <div className="tab-content" id="myLearningTabsContent" style={{ marginTop: '-50px' }}>

                                        <div className="tab-pane  show active" id="tab-content-1">
                                            <section id="courses" className="courses">
                                                <div className="container">
                                                    <div className="card" style={{ textAlign: 'left' }}>
                                                        <div key={selectedLesson.id}>
                                                            <div dangerouslySetInnerHTML={{ __html: selectedLesson.reading }}></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </section>{/* End Courses Section */}
                                        </div>


                                        <div className="tab-pane fade" id="tab-content-2">
                                            {/* Course Content for Tab 2 */}
                                            <div className="tab-pane  show active" id="tab-content-1">
                                                <section id="courses" className="courses">
                                                    <div className="container" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-start' }}>
                                                        <div className="card" style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', textAlign: 'left' }}>
                                                            {
                                                                materialList.length > 0 && materialList.map((material, index) => (
                                                                    <div className='card-body' style={{ flex: '0 0 33.33%', width: '100%' }}>
                                                                        <a href={material.materialUrl} target="_blank" rel="noopener noreferrer">
                                                                            <figure className="figure">
                                                                                <i className="far fa-file-pdf fa-6x"></i>
                                                                                <figcaption className="figure-caption" style={{ color: '#f58d04', fontWeight: 'bold' }}>{material.name}</figcaption>
                                                                            </figure>
                                                                        </a>
                                                                    </div>
                                                                ))
                                                            }
                                                            {
                                                                materialList.length === 0 && (
                                                                    <p>No materials found.</p>
                                                                )
                                                            }


                                                        </div>
                                                    </div>

                                                </section>{/* End Courses Section */}
                                            </div>
                                        </div>

                                    </div>
                                </>


                            )}
                            {selectedAssignment && selectedAssignment.questionText && (
                                <>

                                    <div className="tab-content" id="myLearningTabsContent" style={{ marginTop: '-50px' }}>
                                        <div className="tab-pane show active" id="tab-content-1">
                                            <section id="courses" className="courses">
                                                <div className='container'>
                                                    <h4 style={{ textAlign: 'left' }}>Question:</h4>

                                                </div>
                                                <div className="card ml-1">
                                                    <div className="container" style={{ textAlign: 'left' }}>
                                                        <div dangerouslySetInnerHTML={{ __html: selectedAssignment.questionText }}></div>
                                                    </div>
                                                </div>
                                                {
                                                    selectedAssignment.questionAudioUrl !== null && selectedAssignment.questionAudioUrl !== '' && (
                                                        <div className="card ml-1">
                                                            <audio controls>
                                                                <source src={selectedAssignment.questionAudioUrl} type="audio/mpeg" />
                                                                Your browser does not support the audio element.
                                                            </audio>
                                                        </div>
                                                    )
                                                }

                                            </section>
                                        </div>
                                        {
                                            attemptList2 && attemptList2.length > 0 && (
                                                <>
                                                    <div>
                                                        Grade: <span style={{ fontWeight: 'bold', color: '#f58d04' }}>{myAssignmentAttempt.totalGrade}</span>
                                                    </div>
                                                    <div className='container'>
                                                        <h4 style={{ textAlign: 'left' }}>My Answer:</h4>
                                                    </div>
                                                    <div className='container ml-1'>
                                                        <div className='card' style={{ textAlign: 'left' }} dangerouslySetInnerHTML={{ __html: myAssignmentAttempt.answerText }}></div>
                                                        {
                                                            myAssignmentAttempt.answerAudioUrl !== '' && myAssignmentAttempt.answerAudioUrl !== null && (
                                                                <div className='card' >
                                                                    <audio controls>
                                                                        <source src={myAssignmentAttempt.answerAudioUrl} type="audio/mpeg" />
                                                                        Your browser does not support the audio element.
                                                                    </audio>
                                                                </div>
                                                            )
                                                        }

                                                    </div>


                                                </>
                                            )
                                        }
                                        {
                                            showNotReviewYetList && (
                                                <>
                                                    <div className='container'>
                                                        <h4 style={{ textAlign: 'left' }}>Review for another students:</h4>

                                                    </div>
                                                    {notReviewYetList.map((attempt, index) => (
                                                        <>


                                                            <div className='row' key={index}>
                                                                <div className='col-md-4' style={{ fontWeight: 'bold' }}>
                                                                    <div className='mb-1' style={{ color: '#f58d04' }}>{attempt.learner?.account?.fullName}</div>
                                                                    <div style={{ /* your container styles */ }}>
                                                                        <form>
                                                                            &nbsp; <input type="radio" id="2" name={`grade-${attempt.id}`} defaultValue="2" style={{ display: 'inline-block' }} value="2" onChange={(e) => handleGradeChange(e, attempt.id)} />
                                                                            &nbsp; <label htmlFor="html">2</label><br />
                                                                            &nbsp; <input type="radio" id="4" name={`grade-${attempt.id}`} defaultValue="4" style={{ display: 'inline-block' }} value="4" onChange={(e) => handleGradeChange(e, attempt.id)} />
                                                                            &nbsp; <label htmlFor="css">4</label><br />
                                                                            &nbsp; <input type="radio" id="6" name={`grade-${attempt.id}`} defaultValue="6" style={{ display: 'inline-block' }} value="6" onChange={(e) => handleGradeChange(e, attempt.id)} />
                                                                            &nbsp; <label htmlFor="css">6</label><br />
                                                                            &nbsp; <input type="radio" id="8" name={`grade-${attempt.id}`} defaultValue="8" style={{ display: 'inline-block' }} value="8" onChange={(e) => handleGradeChange(e, attempt.id)} />
                                                                            &nbsp; <label htmlFor="css">8</label><br />
                                                                            &nbsp; <input type="radio" id="10" name={`grade-${attempt.id}`} defaultValue="10" style={{ display: 'inline-block' }} value="10" onChange={(e) => handleGradeChange(e, attempt.id)} />
                                                                            &nbsp; <label htmlFor="css">10</label><br />
                                                                        </form>
                                                                    </div>
                                                                </div>
                                                                <div className='col-md-8 card'>
                                                                    <div style={{ textAlign: 'left' }} dangerouslySetInnerHTML={{ __html: attempt.answerText }}></div>
                                                                </div>
                                                                {/* Add a line below each item */}
                                                                {index !== notReviewYetList.length - 1 && <hr style={{ margin: '20px 0', borderWidth: '20px' }} />}
                                                            </div>
                                                        </>

                                                    ))}
                                                    {notReviewYetList.length > 0 && (
                                                        <button type='submit' className="btn btn-primary" style={{ backgroundColor: '#f58d04', color: '#fff', borderRadius: '50px', padding: `8px 25px` }} onClick={submitPeerReviews} disabled={submitting}>
                                                            {submitting ? "Submitting..." : "Send"}
                                                        </button>
                                                    )}

                                                </>
                                            )
                                        }

                                        {
                                            attemptList2 && attemptList2.length === 0 && (
                                                <>
                                                    {/* Render the timer if showTimer state is true */}
                                                    {showTimer ? (
                                                        <div className="d-flex align-items-center" style={{ marginTop: '-60px', justifyContent: 'center' }}>
                                                            <span className=''>
                                                                <div className="timer-wrapper">
                                                                    <CountdownCircleTimer
                                                                        isPlaying
                                                                        duration={timeRemaining}
                                                                        colors="#f58d04"
                                                                        size={80}
                                                                    >
                                                                        {({ remainingTime }) => {
                                                                            if (remainingTime === 0) {
                                                                                return <span>End!</span>;
                                                                            } else {
                                                                                return remainingTime;
                                                                            }
                                                                        }}
                                                                    </CountdownCircleTimer>
                                                                </div>
                                                            </span>

                                                        </div>
                                                    ) : (
                                                        // Render the "Start Assignment" button if showTimer state is false
                                                        !showAttempts && (
                                                            <button
                                                                className="btn btn-primary"
                                                                style={{ backgroundColor: '#f58d04', color: '#fff', borderRadius: '50px', padding: `8px 25px` }}
                                                                onClick={handleStartAssignment}
                                                            >
                                                                Start Assignment
                                                            </button>
                                                        )
                                                    )}

                                                    {/* Render the form if showForm state is true */}
                                                    {showForm && (
                                                        <form onSubmit={(e) => submitAssignmentAttempt(e)}>
                                                            <div className="tab-pane show active" id="tab-content-1">
                                                                <section id="courses" className="courses">
                                                                    <div className="card ml-1">
                                                                        <div className="card" style={{ textAlign: 'left' }}>
                                                                            <ReactQuill
                                                                                value={assignmentAttempt.answerText}
                                                                                onChange={handleChangeAnswerText}
                                                                                style={{ height: "300px" }}
                                                                                modules={{
                                                                                    toolbar: [
                                                                                        [{ header: [1, 2, false] }],
                                                                                        ['bold', 'italic', 'underline', 'strike'],
                                                                                        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                                                                                        [{ 'indent': '-1' }, { 'indent': '+1' }],
                                                                                        [{ 'direction': 'rtl' }],
                                                                                        [{ 'align': [] }],
                                                                                        ['link', 'image', 'video'],
                                                                                        ['code-block'],
                                                                                        [{ 'color': [] }, { 'background': [] }],
                                                                                        ['clean']
                                                                                    ]
                                                                                }}
                                                                                theme="snow"
                                                                            />
                                                                            <label className='mt-5' htmlFor="audio">Upload Audio :</label>
                                                                            <Dropzone
                                                                                onDrop={handleFileDrop2}
                                                                                accept="audio/*"
                                                                                multiple={false}
                                                                                maxSize={5000000}
                                                                            >
                                                                                {({ getRootProps, getInputProps }) => (
                                                                                    <div {...getRootProps()} className="fallback">
                                                                                        <input {...getInputProps()} />
                                                                                        <div className="dz-message needsclick">
                                                                                            <i className="h1 text-muted dripicons-cloud-upload" />
                                                                                        </div>
                                                                                        {file2 && (
                                                                                            <div>
                                                                                                <audio controls style={{ marginTop: "10px" }}>
                                                                                                    <source src={URL.createObjectURL(file2)} type="audio/*" />
                                                                                                    Your browser does not support the audio tag.
                                                                                                </audio>
                                                                                                <p>Audio Preview:</p>
                                                                                                <audio controls src={URL.createObjectURL(file2)} />
                                                                                            </div>
                                                                                        )}
                                                                                    </div>
                                                                                )}
                                                                            </Dropzone>
                                                                        </div>
                                                                    </div>
                                                                </section>
                                                            </div>
                                                            <button
                                                                className="btn btn-primary"
                                                                style={{ backgroundColor: '#f58d04', color: '#fff', borderRadius: '50px', padding: `8px 25px` }}
                                                            >
                                                                Submit
                                                            </button>
                                                        </form>
                                                    )}
                                                    {showAttempts && (

                                                        <>
                                                            <div className='container'>
                                                                <h4 style={{ textAlign: 'left' }}>Review for another students:</h4>

                                                            </div>
                                                            {attemptList.map((attempt, index) => (
                                                                <>
                                                                    <div className='row'>
                                                                        <div className='col-md-4' style={{ fontWeight: 'bold' }}>
                                                                            <div className='mb-1' style={{ color: '#f58d04' }}>
                                                                                {attempt.learner?.account?.fullName}

                                                                            </div>
                                                                            <div style={{ /* your container styles */ }}>
                                                                                <form onSubmit={submitPeerReviews}>
                                                                                    &nbsp; <input type="radio" id="2" name={`grade-${attempt.id}`} defaultValue="2" style={{ display: 'inline-block' }} value="2" onChange={(e) => handleGradeChange(e, attempt.id)} />
                                                                                    &nbsp; <label htmlFor="html">2</label><br />
                                                                                    &nbsp; <input type="radio" id="4" name={`grade-${attempt.id}`} defaultValue="4" style={{ display: 'inline-block' }} value="4" onChange={(e) => handleGradeChange(e, attempt.id)} />
                                                                                    &nbsp; <label htmlFor="css">4</label><br />
                                                                                    &nbsp; <input type="radio" id="6" name={`grade-${attempt.id}`} defaultValue="6" style={{ display: 'inline-block' }} value="6" onChange={(e) => handleGradeChange(e, attempt.id)} />
                                                                                    &nbsp; <label htmlFor="css">6</label><br />
                                                                                    &nbsp; <input type="radio" id="8" name={`grade-${attempt.id}`} defaultValue="8" style={{ display: 'inline-block' }} value="8" onChange={(e) => handleGradeChange(e, attempt.id)} />
                                                                                    &nbsp; <label htmlFor="css">8</label><br />
                                                                                    &nbsp; <input type="radio" id="10" name={`grade-${attempt.id}`} defaultValue="10" style={{ display: 'inline-block' }} value="10" onChange={(e) => handleGradeChange(e, attempt.id)} />
                                                                                    &nbsp; <label htmlFor="css">10</label><br />
                                                                                </form>
                                                                            </div>

                                                                        </div>
                                                                        <div className='col-md-8 card'>
                                                                            <div dangerouslySetInnerHTML={{ __html: attempt.answerText }}></div>
                                                                        </div>
                                                                        {index !== notReviewYetList.length - 1 && <hr style={{ margin: '20px 0', borderWidth: '20px' }} />}

                                                                    </div>
                                                                </>

                                                            ))}
                                                            <button type='submit' className="btn btn-primary" style={{ backgroundColor: '#f58d04', color: '#fff', borderRadius: '50px', padding: `8px 25px` }} onClick={submitPeerReviews} disabled={submitting}>
                                                                {submitting ? "Submitting..." : "Send"}
                                                            </button>                                                        </>
                                                    )}
                                                </>
                                            )
                                        }


                                    </div>
                                </>
                            )}
                            {selectedQuiz && selectedQuiz.name && (
                                <>

                                    <div className="tab-content" id="myLearningTabsContent" style={{ marginTop: '-50px' }}>

                                        <div className="tab-pane  show active" id="tab-content-1" >
                                            <section id="courses" className="courses">
                                                <div className="container">
                                                    <h1><span style={{ color: '#f58d04' }}>Quiz: </span>{selectedQuiz.name}</h1>
                                                </div>
                                            </section>{/* End Courses Section */}
                                        </div>

                                        {!quizStarted && (
                                            <button
                                                className="btn btn-primary"
                                                style={{ backgroundColor: '#f58d04', color: '#fff', borderRadius: '50px', padding: `8px 25px` }}
                                                onClick={handleStartQuiz}
                                            >
                                                Start Quiz
                                            </button>
                                        )}
                                        {showQuestions && (
                                            <div>
                                                <div className="tab-pane show active" id="tab-content-1" style={{ marginTop: '-80px' }}>
                                                    <section id="courses" className="courses">
                                                        <div className="container">
                                                            {showScore && (
                                                                <div className="notification">
                                                                    <h5 style={{ color: '#f58d04', fontWeight: 'bold' }} data-aos="fade-in">{msg}</h5>
                                                                </div>
                                                            )}
                                                            {showTimer2 && (
                                                                <div className='row'>
                                                                    <div className="col-md-1">

                                                                    </div>
                                                                    <div className="col-md-3">
                                                                        <div className="d-flex align-items-center" style={{ marginTop: '-40px' }}>
                                                                            <div className="timer-wrapper">
                                                                                <CountdownCircleTimer
                                                                                    isPlaying
                                                                                    duration={timeRemaining2}
                                                                                    colors="#f58d04"
                                                                                    size={80} // Adjust the size here

                                                                                >
                                                                                    {({ remainingTime }) => {
                                                                                        if (remainingTime === 0) {
                                                                                            return <span>End!</span>; // or any other content you want to display when time is up
                                                                                        } else {
                                                                                            return remainingTime;
                                                                                        }
                                                                                    }}
                                                                                </CountdownCircleTimer>
                                                                            </div>

                                                                        </div>
                                                                    </div>
                                                                    <div className="col-md-3">

                                                                    </div>
                                                                    <div className="col-md-5">
                                                                        <span> <span style={{ fontWeight: 'bold' }}>Score</span>: {point}/<span style={{ color: 'rgb(245, 141, 4)' }}>10</span>
                                                                        </span>
                                                                    </div>
                                                                </div>

                                                            )}

                                                            {currentQuestion && (
                                                                <div >
                                                                    <div key={currentQuestion.id}>
                                                                        {currentQuestion.questionImageUrl && ( // Check if questionImageUrl exists and is not falsy
                                                                            <img src={currentQuestion.questionImageUrl} style={{ width: '600px', height: '300px' }} />
                                                                        )}
                                                                        {currentQuestion.questionAudioUrl && ( // Check if questionAudioUrl exists and is not falsy
                                                                            <audio src={currentQuestion.questionAudioUrl} controls></audio>
                                                                        )}
                                                                        <div style={{ fontWeight: 'bold' }} dangerouslySetInnerHTML={{ __html: currentQuestion.questionText }}></div>

                                                                    </div>
                                                                </div>

                                                            )}
                                                            <div className="game-options-container">


                                                                {showAnswerColor ? (
                                                                    <>
                                                                        {
                                                                            questionAnswerList.length > 0 && questionAnswerList.map((questionAnswer, index) => (
                                                                                <span key={index}>
                                                                                    <input
                                                                                        type="radio"
                                                                                        id={`option-${index}`}
                                                                                        name="option"
                                                                                        className="radio"
                                                                                        value="optionA"
                                                                                        readOnly
                                                                                    />
                                                                                    <label
                                                                                        htmlFor={`option-${index}`}
                                                                                        className={`option ${questionAnswer.isAnswer ? 'correct-answer' : 'incorrect-answer'}`}
                                                                                    >
                                                                                        {questionAnswer.answerText}
                                                                                    </label>
                                                                                </span>
                                                                            ))
                                                                        }
                                                                        {
                                                                            questionAnswerList.length === 0 && (
                                                                                <p>No answers yet.</p>
                                                                            )
                                                                        }

                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        {
                                                                            questionAnswerList.length > 0 && questionAnswerList.map((questionAnswer, index) => (
                                                                                <span key={index} className='span1'>
                                                                                    <input
                                                                                        type="radio"
                                                                                        id={`option-${index}`}
                                                                                        name="option"
                                                                                        className="radio"
                                                                                        value="optionA"
                                                                                        onClick={() => handleAnswerClick(questionAnswer)} // Pass a function reference
                                                                                    />
                                                                                    <label
                                                                                        htmlFor={`option-${index}`}
                                                                                        className={`option ${questionAnswer.isAnswer ? 'green' : 'red'}`}
                                                                                    >
                                                                                        {questionAnswer.answerText}
                                                                                    </label>
                                                                                </span>
                                                                            ))
                                                                        }
                                                                        {
                                                                            questionAnswerList.length === 0 && (
                                                                                <p>No answers yet.</p>
                                                                            )
                                                                        }

                                                                    </>
                                                                )}

                                                            </div>

                                                        </div>
                                                    </section>
                                                </div>
                                            </div>
                                        )}
                                        {showResult && (
                                            <div>
                                                <div className="tab-pane show active text-center" id="tab-content-1" style={{ marginTop: '-80px' }}>
                                                    <section id="courses" className="courses ml-4 mr-2">
                                                        <div className="card" >
                                                            Your Result
                                                            <span>{point}/<span style={{ color: '#f58d04' }}>10</span></span>
                                                        </div>
                                                    </section>
                                                </div>
                                                <button
                                                    className="btn btn-primary" onClick={() => handleStartQuiz(selectedQuiz.id)}
                                                    style={{ backgroundColor: '#f58d04', color: '#fff', borderRadius: '50px', padding: `8px 25px` }}
                                                >
                                                    Re-Attempt Quiz
                                                </button>
                                            </div>

                                        )}

                                    </div>
                                </>


                            )}

                        </div>

                        <div className="col-md-4" style={{ textAlign: 'left' }}> {/* Adjusted width for sidebar */}
                            {/* Right Sidebar Content Here */}
                            <div style={{ background: '#f8f9fa', padding: '20px', border: '1px solid #ddd', textAlign: 'left' }}>
                                {/* Add your sidebar content here */}
                                <h4 style={{ fontWeight: 'bold' }}>Course content</h4>
                                {moduleList && moduleList.length > 0 && moduleList.map((module, index) => (
                                    <div key={module.id} className="card-container" style={{ marginBottom: '5px' }}>
                                        <div
                                            className={`card module-title ${expandedModules.includes(module.id) ? 'expanded' : ''}`}
                                            onClick={() => handleModuleCardClick(module.id)} style={{ marginBottom: '5px' }}
                                        >
                                            <div className="card-body " style={{ padding: '10px' }}>
                                                <h4 className="card-title" >Section {index + 1}: {module.name}</h4>
                                                <span>{expandedModules.includes(module.id) ? '-' : '+'}</span>
                                            </div>
                                        </div>
                                        {selectedModule && selectedModule.id === module.id && expandedModules.includes(module.id) && (
                                            <div className="card-content ">
                                                {/* Combine all items into a single array */}
                                                {moduleContent.lessons.map((lesson, index) => (
                                                    <div key={`lesson_${index}`} className="card iitem" style={{ marginBottom: '5px' }} onClick={() => handleLessonClick(lesson.id)}>
                                                        <div className="card-body">{index + 1}. {lesson.name}</div>
                                                        <div className="card-body" style={{ marginTop: '-40px' }}>
                                                            <i className="fas fa-file-video"></i>
                                                        </div>
                                                    </div>
                                                ))}
                                                {moduleContent.assignments.map((assignment, index) => (
                                                    <div key={`assignment_${index}`} className="card iitem" style={{ marginBottom: '5px' }} onClick={() => handleAssignmentClick(assignment.id)}>
                                                        <div className="card-body" >{moduleContent.lessons.length + index + 1}. Question: <span className='truncate-text' dangerouslySetInnerHTML={{ __html: assignment.questionText }} ></span></div>
                                                        <div className="card-body" style={{ marginTop: '-40px' }}>
                                                            <i className="fab fa-wpforms"></i> {assignment.deadline} mins

                                                            {
                                                                assignmentAttemptList.length > 0 && assignmentAttemptList.map((attempt) => {
                                                                    if (attempt.assignmentId === assignment.id) {
                                                                        if (attempt.totalGrade >= assignment.gradeToPass) {
                                                                            return <i className="fas fa-check-circle text-success ml-1"></i>;
                                                                        }
                                                                    } else {
                                                                        return null; // or any other JSX element if needed
                                                                    }
                                                                })
                                                            }

                                                        </div>
                                                    </div>
                                                ))}
                                                {moduleContent.quizzes.map((quiz, index) => (
                                                    <div key={`quiz_${index}`} className="card iitem" style={{ marginBottom: '5px' }} onClick={() => handleQuizClick(quiz.id)}>
                                                        <div className="card-body">{moduleContent.lessons.length + moduleContent.assignments.length + index + 1}. {quiz.name}</div>
                                                        <div className="card-body" style={{ marginTop: '-40px' }}>
                                                            <i className="far fa-question-circle"></i> {quiz.deadline} mins
                                                            {isDoneQuiz && (
                                                                <i class="fas fa-check-circle text-success ml-1"></i>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}


                                    </div>
                                ))}
                                {
                                    moduleList.length === 0 && (
                                        <p>No modules found.</p>
                                    )
                                }
                            </div>
                        </div>

                    </div>
                </section>
            </main>
            {/* <Footer /> */}
            <script>
                {`
                    document.addEventListener("DOMContentLoaded", function () {
                        window.addEventListener('scroll', function () {
                            if (window.scrollY > 50) {
                                document.getElementById('nav-fixed').classList.add('fixed-top');
                                // add padding top to show content behind navbar
                                navbar_height = document.querySelector('.navbar').offsetHeight;
                                document.body.style.paddingTop = navbar_height + 'px';
                            } else {
                                document.getElementById('nav-fixed').classList.remove('fixed-top');
                                // remove padding top from body
                                document.body.style.paddingTop = '0';
                            }
                        });
                    });
                `}
            </script>
            <style>
                {`
                
                .module-title:hover {
                    background-color: #333;
                    color: #fff;
                    cursor: pointer;
                }
                
                .module-list li:hover {
                    background-color: #f0f0f0;
                    cursor: pointer;
                }
                
                .card.module-title {
    background-color: #FFF0D6; /* Darker background color */
    color: #000; /* White text color */
    transition: background-color 0.3s ease; /* Smooth transition effect */
}

.card.module-title:hover {
    background-color: #E7E3DC; /* Darker background color on hover */
    color: #fff
}
.game-options-container{
    width: 100%;
    height: 12rem;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-around;
}

.game-options-container span{
    width: 45%;
    height: 3rem;
    border: 2px solid darkgray;
    border-radius: 20px;
    overflow: hidden;
}
span label{
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: transform 0.3s;
    font-weight: 600;
    color: rgb(22, 22, 22);
}


.span1 label:hover{
    -ms-transform: scale(1.12);
    -webkit-transform: scale(1.12);
    transform: scale(1.12);
    color: #f58d04;
    background-color: #FFF0D6
}

input[type="radio"] {
    position: relative;
    display: none;
}



.next-button-container{
    width: 50%;
    height: 3rem;
    display: flex;
    justify-content: center;
}
.next-button-container button{
    width: 8rem;
    height: 2rem;
    border-radius: 10px;
    background: none;
    color: rgb(25, 25, 25);
    font-weight: 600;
    border: 2px solid gray;
    cursor: pointer;
    outline: none;
}
.next-button-container button:hover{
    background-color: rgb(143, 93, 93);
}

.modal-container{
    display: none;
    position: fixed;
    z-index: 1; 
    left: 0;
    top: 0;
    width: 100%; 
    height: 100%; 
    overflow: auto; 
    background-color: rgb(0,0,0); 
    background-color: rgba(0,0,0,0.4); 
    flex-direction: column;
    align-items: center;
    justify-content: center; 
    -webkit-animation: fadeIn 1.2s ease-in-out;
    animation: fadeIn 1.2s ease-in-out;
}

.modal-content-container{
    height: 20rem;
    width: 25rem;
    background-color: rgb(43, 42, 42);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-around;
    border-radius: 25px;
}

.modal-content-container h1{
    font-size: 1.3rem;
    height: 3rem;
    color: lightgray;
    text-align: center;
}

.grade-details{
    width: 15rem;
    height: 10rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-around;
}

.grade-details p{
    color: white;
    text-align: center;
}

.modal-button-container{
    height: 2rem;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
}

.modal-button-container button{
    width: 10rem;
    height: 2rem;
    background: none;
    outline: none;
    border: 1px solid rgb(252, 242, 241);
    color: white;
    font-size: 1.1rem;
    cursor: pointer;
    border-radius: 20px;
}
.modal-button-container button:hover{
    background-color: rgb(83, 82, 82);
}

@media(min-width : 300px) and (max-width : 350px){
    .game-quiz-container{
        width: 90%;
        height: 80vh;
     }
     .game-details-container h1{
        font-size: 0.8rem;
     }

     .game-question-container{
        height: 6rem;
     }
     .game-question-container h1{
       font-size: 0.9rem;
    }

    .game-options-container span{
        width: 90%;
        height: 2.5rem;
    }
    .game-options-container span label{
        font-size: 0.8rem;
    }
    .modal-content-container{
        width: 90%;
        height: 25rem;
    }

    .modal-content-container h1{
        font-size: 1.2rem;
    }
}
.correct-answer {
    background-color: green;
}

.incorrect-answer {
    background-color: red;
}
.fixed-course-name {
    position: fixed;
    top: 0;
    width: 100%;
    z-index: 1000;
    background-color: #333;
    padding: 10px 0;
}

.iitem {
    transition: transform 0.3s ease;
}

.iitem:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.truncate-text {
    max-width: 200px; /* Adjust max-width as needed */
    overflow: hidden;
    text-overflow: ellipsis;
}


  
            `}
            </style>
        </>
    )
}

export default StudyCourse;