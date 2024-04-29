import React, { useEffect, useState } from 'react';
import Header from '../../Header';
import Footer from '../../Footer';
import { Link, useNavigate, useParams } from 'react-router-dom';
import courseService from '../../../services/course.service';
import moduleService from '../../../services/module.service'; // Import module service
import classLessonService from '../../../services/class-lesson.service';
import assignmentService from '../../../services/assignment.service';
import ReactQuill from 'react-quill';
import assignmentAttemptService from '../../../services/assignment-attempt.service';
import quizService from '../../../services/quiz.service';
import questionService from '../../../services/question.service';
import topicService from '../../../services/topic.service';
import quizAttemptService from '../../../services/quiz-attempt.service';
import Dropzone from 'react-dropzone';
import { CountdownCircleTimer } from 'react-countdown-circle-timer'


const StudyClass = () => {
  const storedLoginStatus = sessionStorage.getItem('isLoggedIn');

  const navigate = useNavigate();
  if (!storedLoginStatus) {
    navigate(`/login`)
  }

  const { courseId } = useParams();
  const learnerId = sessionStorage.getItem('learnerId');


  const [course, setCourse] = useState({
    name: "",
    modules: []
  });

  const [classModuleList, setClassModuleList] = useState([]);
  //dua course name che lap header
  //LOADING
  const [loading, setLoading] = useState(true); // State to track loading

  //LOADING

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
      .getAllClassModulesByCourse(courseId)
      .then((res) => {
        // Filter out class modules where isActive is true
        const activeModules = res.data.filter(module => module.isActive === true);

        // Sort the active class modules by startDate
        const sortedModules = activeModules.sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
        setClassModuleList(sortedModules);
        setLoading(false); // Set loading to false after data is fetched

      })
      .catch((error) => {
        console.log(error);
        setLoading(false); // Set loading to false after data is fetched

      });
  }, [courseId]);



  const [selectedModule, setSelectedModule] = useState(null);
  const [moduleContent, setModuleContent] = useState({
    classLesson: [],
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


    }
  }, [selectedModule]);

  // Function to handle click on a module card to toggle expansion
  const handleModuleCardClick = (moduleId) => {
    toggleModuleExpansion(moduleId);
    setSelectedModule(classModuleList.find(module => module.id === moduleId));
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

  useEffect(() => {
    if (selectedLessonId) {
      classLessonService
        .getClassLessonById(selectedLessonId)
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
    // Scroll to the top of the page
    window.scrollTo({
      top: 0,
      behavior: "smooth" // Optional: smooth scrolling animation
    });

  };

  //TAB TOPICS
  const [classTopicList, setClassTopicList] = useState([]);
  const [showQuizzes, setShowQuizzes] = useState(false);
  const [showMaterials, setShowMaterials] = useState(false);
  const [showQuestions, setShowQuestions] = useState(false);
  const [quizList, setQuizList] = useState([]);
  const [assignmentList, setAssignmentList] = useState([]);
  const [materialList, setMaterialList] = useState([]);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [quizStarted, setQuizStarted] = useState(false);
  const [showTimer, setShowTimer] = useState(false);
  const [showTimer2, setShowTimer2] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const [questionList, setQuestionList] = useState([]);
  // Retrieve the current question based on the current index
  const currentQuestion = questionList[currentQuestionIndex];
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState(null);
  const [questionAnswerList, setQuestionAnswerList] = useState([]);
  const [showAnswerColor, setShowAnswerColor] = useState(false);
  const [showScore, setShowScore] = useState(false);
  const [msg, setMsg] = useState("");
  const [point, setPoint] = useState(0);
  //display result assignment attempt
  const [showResult, setShowResult] = useState(false);
  useEffect(() => {
    if (selectedLessonId) {
      classLessonService
        .getAllClassTopicsByClassLesson(selectedLessonId)
        .then((res) => {
          // Filter out class topics where isActive is true
          const activeTopics = res.data.filter(topic => topic.isActive === true);
          setClassTopicList(activeTopics);
        })
        .catch((error) => {
          console.log(error);
        });
    }

  }, [selectedLessonId]);


  const handleShowQuizzes = (classTopicId) => {
    topicService
      .getAllQuizzesByClassTopic(classTopicId)
      .then((res) => {
        // Filter out quizzes where isActive is true
        const activeQuizzes = res.data.filter(quiz => quiz.isActive === true);

        const updatedClassTopicList = classTopicList.map((classTopic) => {
          if (classTopic.id === classTopicId) {
            return {
              ...classTopic,
              quizList: activeQuizzes, // Add active quizList to the class topic
              showQuizzes: true, // Set showQuizzes to true for the class topic
              showMaterials: false,
              showAssignments: false
            };
          }
          return classTopic;
        });
        setClassTopicList(updatedClassTopicList); // Update classTopicList state
        setQuizList(activeQuizzes); // Update quizList state
      })
      .catch((error) => {
        console.log(error);
      });
  };


  const handleShowAssignments = (classTopicId) => {
    topicService
      .getAllAssignmentsByClassTopic(classTopicId)
      .then((res) => {
        // Filter out assignments where isActive is true
        const activeAssignments = res.data.filter(assignment => assignment.isActive === true);

        const updatedClassTopicList = classTopicList.map((classTopic) => {
          if (classTopic.id === classTopicId) {
            return {
              ...classTopic,
              assignmentList: activeAssignments, // Add active assignmentList to the class topic
              showAssignments: true, // Set showAssignments to true for the class topic
              showMaterials: false,
              showQuizzes: false
            };
          }
          return classTopic;
        });
        setClassTopicList(updatedClassTopicList); // Update classTopicList state
        setAssignmentList(activeAssignments); // Update assignmentList state
      })
      .catch((error) => {
        console.log(error);
      });
  };



  const handleShowMaterials = (classTopicId) => {
    topicService
      .getAllMaterialsByClassTopic(classTopicId)
      .then((res) => {
        const updatedClassTopicList = classTopicList.map((classTopic) => {
          if (classTopic.id === classTopicId) {
            return {
              ...classTopic,
              materialList: res.data, // Add quizList to the class topic
              showMaterials: true, // Set showQuizzes to true for the class topic
              showQuizzes: false,
              showAssignments: false
            };
          }
          return classTopic;
        });
        setClassTopicList(updatedClassTopicList); // Update classTopicList state
        setMaterialList(res.data); // Update quizList state
      })
      .catch((error) => {
        console.log(error);
      });
  };
  // Format time remaining into minutes and seconds
  const formatTime = (time) => {
    const minutes = Math.floor(time / (60 * 1000));
    const seconds = Math.floor((time % (60 * 1000)) / 1000);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const [quizAttempt, setQuizAttempt] = useState({
    learnerId: "",
    quizId: "",
    totalGrade: ""
  });

  const handleStartQuiz = (quizId) => {
    quizService
      .getQuizById(quizId)
      .then((res) => {
        setSelectedQuiz(res.data);
      })
      .catch((error) => {
        console.log(error);
      });

    quizService
      .getAllQuestionsByQuiz(quizId)
      .then((res) => {
        console.log(res.data);
        setQuestionList(res.data);

      })
      .catch((error) => {
        console.log(error);
      });

    setPoint(0);
    setShowQuestions(true);
    // Set the quizStarted state to true when the quiz starts
    setQuizStarted(true);
    setShowTimer(true);
    setShowAnswerColor(false);
    setShowResult(false);
    setCurrentQuestionIndex(0); // Reset currentQuestionIndex to 0
    setShowForm(false);
    // Set the deadline time (in seconds) from now

  };






  const handleStartAssignment = (assignmentId) => {
    setShowResult(false);
    assignmentService
      .getAssignmentById(assignmentId)
      .then((res) => {
        const selectedAssignment = res.data;
        setSelectedAssignment(selectedAssignment);
        console.log("ASSS: " + JSON.stringify(selectedAssignment));

        setShowTimer2(true);
        setShowForm(true);


      })
      .catch((error) => {
        console.log(error);
      });
  };


  const [assignmentAttempt, setAssignmentAttempt] = useState({
    assignmentId: selectedAssignment?.id,
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
      assignmentId: selectedAssignment?.id
    }));
  }, [selectedAssignment?.id]);

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
      setShowTimer2(false);

      assignmentAttempt.answerText = "";
      assignmentAttempt.answerAudioUrl = "";

      // navigate(`/list-assignment-attempt/${tutorId}`);
    } catch (error) {
      console.log(error);
    }
  };



  useEffect(() => {
    if (currentQuestion) { // Ensure currentQuestion is defined before accessing its id
      questionService
        .getAllQuestionAnswersByQuestion(currentQuestion.id)
        .then((res) => {
          console.log(res.data);
          setQuestionAnswerList(res.data);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [currentQuestion?.id]); // Use optional chaining to avoid errors if currentQuestion is undefined


  // Function to handle click on the "Next" button
  const handleNextQuestion = (point) => {
    // Increment the current question index
    setCurrentQuestionIndex(prevIndex => prevIndex + 1);
    setShowScore(false);
    setShowAnswerColor(false); // Move inside the block for correct answer

    // Check if the user has reached the last question
    if (currentQuestionIndex === questionList.length - 1) {
      // If so, alert the user
      setShowResult(true);
      setShowQuestions(false);

      quizAttempt.learnerId = learnerId;
      quizAttempt.quizId = selectedQuiz.id;
      quizAttempt.totalGrade = point;

      quizAttemptService.saveQuizAttempt(quizAttempt)
        .then((res) => {
          console.log(res.data);

        })
        .catch((error) => {
          console.log(error);
        });

    }
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
        handleNextQuestion();

      }, 2000);
    }
  };


  //TIMER
  // State variable for countdown
  const timeRemaining = selectedAssignment?.deadline * 60;
  const timeRemaining2 = selectedQuiz?.deadline * 60;


  //check done assignment attempt
  const [attemptList2, setAttemptList2] = useState([]);
  //my assignment attempt
  const [myAssignmentAttempt, setMyAssignmentAttempt] = useState({
    assignmentId: "",
    learnerId: "",
    answerText: "",
    answerAudioUrl: ""
  });

  useEffect(() => {
    if (selectedAssignment?.id) {
      assignmentService.getAllAssignmentAttemptByAssignmentId(selectedAssignment?.id)
        .then((res) => {

          const list2 = res.data.filter(attempt => attempt.learnerId === learnerId).slice(0, 5);
          setAttemptList2(list2);


        })
        .catch((error) => {
          console.log(error);
        });
    }

  }, [selectedAssignment?.id]);

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


  return (
    <>
      {/* <Header /> */}
      <main >

        <div className="breadcrumbs" style={{ marginTop: '-30px', paddingBottom: '10px', position: 'fixed', top: 0, width: '100%', zIndex: 999, display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingLeft: '20px', paddingRight: '20px' }} id='nav-fixed'>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <img src={process.env.PUBLIC_URL + '/meowlish_icon.png'} alt="MeowLish" style={{ width: '30px', marginRight: '5px', paddingTop: '10px' }} />
            <Link to="/home" style={{ color: '#fff', textDecoration: 'none', fontSize: '18px', fontWeight: 'bold', marginRight: '10px' }}>MeowLish</Link><span style={{ color: '#fff' }} className='mr-2'>|</span>
            <h4 style={{ color: '#fff', fontSize: '18px', fontWeight: 'bold', margin: 0 }}>{course.name}</h4>
          </div>
          <div>
            <Link to={`/my-learning/`} style={{ color: 'white' }}><i className="fas fa-sign-out-alt"></i></Link>
          </div>
        </div>


        <section id="courses" className="courses" style={{ marginTop: '-10px', backgroundColor: `#fff` }}>
          <div className='row'>
            <div className="col-md-8">
              {/* Course Content */}
              {selectedLesson && selectedLesson.classUrl && (
                <>

                  <ul className="nav nav-tabs" id="myLearningTabs">
                    <li className="nav-item">
                      <a className="nav-link active" id="tab1" data-bs-toggle="tab" href="#tab-content-1">
                        Study Online
                      </a>
                    </li>
                    <li className="nav-item">
                      <a className="nav-link" id="tab2" data-bs-toggle="tab" href="#tab-content-2">
                        Topics
                      </a>
                    </li>

                  </ul>
                  <div className="tab-content" id="myLearningTabsContent" style={{ marginTop: '-50px', backgroundColor: '#fff' }}>

                    <div className="tab-pane  show active" id="tab-content-1" >
                      <section id="courses" className="courses" >
                        <div className="container" style={{ backgroundColor: '#fff' }} >
                          <div key={selectedLesson.id}>
                            {/* <div dangerouslySetInnerHTML={{ __html: selectedLesson.reading }}></div> */}
                            <a href={selectedLesson.classUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ backgroundColor: '#f58d04', color: '#fff', borderRadius: '50px', padding: `8px 25px`, border: 'none' }}>Join the class</a>
                          </div>
                          <img src={process.env.PUBLIC_URL + '/google_meet.jpg'} alt="google meet" style={{ width: '100%', paddingTop: '10px' }} />

                        </div>
                      </section>{/* End Courses Section */}
                    </div>



                    <div className="tab-pane fade" id="tab-content-2" >
                      <section id="courses" className="courses">
                        <div className="container">
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
                                    {showTimer && (
                                      <div className='row'>
                                        <div className="col-md-1">

                                        </div>
                                        <div className="col-md-3">
                                          <div className="d-flex align-items-center mb-2" style={{}}>
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
                                        <div className="col-md-5 mt-3">
                                          <span> <span style={{ fontWeight: 'bold', marginTop: '80px' }}>Score</span>: {point}/<span style={{ color: 'rgb(245, 141, 4)' }}>10</span>
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
                                              <p>No answers found.</p>
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
                                              <p>No answers found.</p>
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
                                style={{ backgroundColor: '#f58d04', color: '#fff', borderRadius: '50px', padding: `8px 25px`, border: 'none' }}
                              >
                                Re-Attempt Quiz
                              </button>
                            </div>

                          )}
                          {!showQuestions && (
                            <>
                              {
                                classTopicList.length > 0 && classTopicList.map((classTopic, index) => (
                                  <div key={index} className="d-block mb-3 text-left card">
                                    <h3 className="mb-1">Topic {index + 1}: {classTopic.name}</h3>
                                    <p className="mb-0">{classTopic.description}</p>
                                    <span className="badge label-table badge-primary" onClick={() => handleShowQuizzes(classTopic.id)}>  <i class="fas fa-play"></i> Start quiz</span>
                                    <span className="badge label-table badge-success ml-1" onClick={() => handleShowAssignments(classTopic.id)}>  <i class="fa-solid fa-dumbbell"></i> Start Assignment</span>
                                    <span className="badge label-table badge-warning ml-1" onClick={() => handleShowMaterials(classTopic.id)}>  <i class="far fa-file-alt"></i> Materials</span>
                                    {classTopic.showQuizzes && ( // Check if showQuizzes is true for the current class topic
                                      <div className="quizzes">
                                        {classTopic.quizList.map((quiz, index) => (
                                          <div key={index}>
                                            <p className="mb-0" style={{ color: '#f58d04', fontWeight: 'bold' }} onClick={() => handleStartQuiz(quiz.id)}>Quiz {index + 1} - {quiz.name}
                                              &nbsp; <i class="far fa-play-circle"></i></p>
                                          </div>
                                        ))}
                                      </div>
                                    )}
                                    {classTopic.showAssignments && ( // Check if showQuizzes is true for the current class topic
                                      <div className="assignments">
                                        {classTopic.assignmentList.map((assignment, index) => (
                                          <div key={index}>
                                            <p className="mb-0" style={{ color: '#f58d04', fontWeight: 'bold' }} onClick={() => handleStartAssignment(assignment.id)}>Assignment {index + 1} -  <p dangerouslySetInnerHTML={{ __html: assignment.questionText }}></p>
                                              &nbsp; <i class="far fa-play-circle"></i></p>
                                          </div>
                                        ))}
                                      </div>
                                    )}
                                    {classTopic.showMaterials && (
                                      <div className="materials">
                                        {classTopic.materialList.map((material, index) => (
                                          <div className='card-body' style={{ flex: '0 0 33.33%', width: '100%' }}>
                                            <a href={material.materialUrl} target="_blank" rel="noopener noreferrer">
                                              <figure className="figure">
                                                <i className="far fa-file-pdf fa-6x"></i>
                                                <figcaption className="figure-caption" style={{ color: '#f58d04', fontWeight: 'bold' }}>{material.name}</figcaption>
                                              </figure>
                                            </a>
                                          </div>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                ))
                              }
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
                                      {
                                        myAssignmentAttempt.answerText && (
                                          <div className='card' style={{ textAlign: 'left' }} dangerouslySetInnerHTML={{ __html: myAssignmentAttempt.answerText }}></div>

                                        )
                                      }
                                      {
                                        myAssignmentAttempt.answerAudioUrl && (
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
                                attemptList2 && attemptList2.length === 0 && (
                                  <>
                                    {showForm && (
                                      <>

                                        < form className='card' onSubmit={(e) => submitAssignmentAttempt(e)}>
                                          <div className="d-flex align-items-center" style={{ justifyContent: 'center' }}>
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
                                          <div className="tab-pane show active " id="tab-content-1" style={{ backgroundColor: '#fff' }} >
                                            <section id="courses" className="courses ">
                                              {
                                                selectedAssignment.questionText && (
                                                  <>
                                                    <div className='ml-1 ' style={{ textAlign: 'left' }} dangerouslySetInnerHTML={{ __html: selectedAssignment?.questionText }}></div>

                                                  </>
                                                )
                                              }
                                              {
                                                selectedAssignment.questionAudioUrl && (
                                                  <>
                                                    <div className='ml-1 ' style={{ textAlign: 'left' }}>
                                                      <audio controls>
                                                        <source src={selectedAssignment.questionAudioUrl} type="audio/mpeg" />
                                                        Your browser does not support the audio element.
                                                      </audio>
                                                    </div>
                                                  </>
                                                )
                                              }


                                              <div className=" ml-1">


                                                <div className="" style={{ textAlign: 'left' }}>
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
                                                </div>

                                                <label className='mt-5' htmlFor="audio" >Upload Audio *:</label>
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
                                            </section>
                                          </div>
                                          <button
                                            className="btn btn-primary"
                                            style={{ backgroundColor: '#f58d04', color: '#fff', borderRadius: '50px', padding: `8px 25px`, border: 'none' }}
                                          >
                                            Submit
                                          </button>
                                        </form>
                                      </>

                                    )}
                                  </>
                                )
                              }

                              {
                                classTopicList.length === 0 && (
                                  <>
                                    <i class="fa-solid fa-tags fa-2x"></i>
                                    <p>No topics found.</p>

                                  </>
                                )
                              }

                            </>
                          )}
                        </div>

                      </section>{/* End Courses Section */}
                    </div>



                  </div>
                </>


              )}


            </div>

            <div className="col-md-4" style={{ textAlign: 'left' }}> {/* Adjusted width for sidebar */}
              {/* Right Sidebar Content Here */}
              <div style={{ background: '#f8f9fa', padding: '20px', border: '1px solid #ddd', textAlign: 'left' }}>
                {/* Add your sidebar content here */}
                <h4 style={{ fontWeight: 'bold' }}>Course content</h4>
                {loading && (
                  <div className="loading-overlay">
                    <div className="loading-spinner" />
                  </div>
                )}
                {classModuleList && classModuleList.length > 0 && classModuleList.map((module, index) => {
                  // Parse the module's start date from the database
                  const moduleStartDate = new Date(module.startDate);

                  // Normalize to the same timezone as your JavaScript environment
                  moduleStartDate.setMinutes(moduleStartDate.getMinutes() + moduleStartDate.getTimezoneOffset());

                  // Get the current date
                  const currentDate = new Date();

                  // Compare dates
                  const isFutureModule = moduleStartDate > currentDate;

                  return (
                    <div key={module.id} className="card-container" style={{ marginBottom: '5px', pointerEvents: isFutureModule ? 'none' : 'auto', opacity: isFutureModule ? 0.5 : 1 }}>
                      <div
                        className={`card module-title ${expandedModules.includes(module.id) ? 'expanded' : ''}`}
                        onClick={() => handleModuleCardClick(module.id)}
                        style={{ marginBottom: '5px', cursor: isFutureModule ? 'not-allowed' : 'pointer' }}
                      >
                        <div className="card-body" style={{ padding: '10px' }}>
                          <h4 className="card-title">Day {index + 1}: {moduleStartDate.toLocaleDateString('en-US')}</h4>
                          <span>{expandedModules.includes(module.id) ? '-' : '+'}</span>
                        </div>
                      </div>
                      {selectedModule && selectedModule.id === module.id && expandedModules.includes(module.id) && (
                        <div className="card-content" onClick={() => handleLessonClick(selectedModule.classLesson?.id)}>
                          <div key={`lesson_${index}`} className="card" style={{ marginBottom: '5px' }}>
                            <div className="card-body">
                              <span style={{ fontWeight: 'bold', color: '#f58d04' }}>Time:</span> {selectedModule.classLesson?.classHours}
                            </div>
                            <div className="card-body" style={{ marginTop: '-40px' }}>
                              <span className="badge label-table badge-success mr-2">
                                <i className="fas fa-file-video"></i> Join Class
                              </span>
                              <span className="badge label-table badge-primary">
                                <i className="fab fa-discourse"></i> Topics
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}

                {
                  classModuleList.length === 0 && (
                    <p>No modules found.</p>
                  )
                }
              </div>
            </div>

          </div>
        </section >
      </main >
      {/* <Footer /> */}

      < style >
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

.card {
  transition: transform 0.3s ease;
}

.card:hover {
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
      </style >
    </>
  )
}

export default StudyClass;
