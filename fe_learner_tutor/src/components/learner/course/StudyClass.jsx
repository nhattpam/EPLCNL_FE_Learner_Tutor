import React, { useEffect, useState } from 'react';
import Header from '../../Header';
import Footer from '../../Footer';
import { Link, useParams } from 'react-router-dom';
import courseService from '../../../services/course.service';
import moduleService from '../../../services/module.service'; // Import module service
import classLessonService from '../../../services/class-lesson.service';
import assignmentService from '../../../services/assignment.service';
import ReactQuill from 'react-quill';
import assignmentAttemptService from '../../../services/assignment-attempt.service';
import quizService from '../../../services/quiz.service';
import questionService from '../../../services/question.service';
import classTopicService from '../../../services/class-topic.service';

const StudyClass = () => {
  const { courseId } = useParams();
  const learnerId = localStorage.getItem('learnerId');


  const [course, setCourse] = useState({
    name: "",
    modules: []
  });

  const [classModuleList, setClassModuleList] = useState([]);
  //dua course name che lap header


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
        console.log(res.data);
        setClassModuleList(res.data);
      })
      .catch((error) => {
        console.log(error);
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

  };

  //TAB TOPICS
  const [classTopicList, setClassTopicList] = useState([]);
  const [showQuizzes, setShowQuizzes] = useState(false);
  const [showMaterials, setShowMaterials] = useState(false);
  const [showQuestions, setShowQuestions] = useState(false);
  const [quizList, setQuizList] = useState([]);
  const [materialList, setMaterialList] = useState([]);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [quizStarted, setQuizStarted] = useState(false);
  const [showTimer, setShowTimer] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
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
    classLessonService
      .getAllClassTopicsByClassLesson(selectedLessonId)
      .then((res) => {
        console.log(res.data);
        setClassTopicList(res.data);

      })
      .catch((error) => {
        console.log(error);
      });
  }, [selectedLessonId]);

  const handleShowQuizzes = (classTopicId) => {
    classTopicService
      .getAllQuizzesByClassTopic(classTopicId)
      .then((res) => {
        const updatedClassTopicList = classTopicList.map((classTopic) => {
          if (classTopic.id === classTopicId) {
            return {
              ...classTopic,
              quizList: res.data, // Add quizList to the class topic
              showQuizzes: true, // Set showQuizzes to true for the class topic
              showMaterials: false
            };
          }
          return classTopic;
        });
        setClassTopicList(updatedClassTopicList); // Update classTopicList state
        setQuizList(res.data); // Update quizList state
      })
      .catch((error) => {
        console.log(error);
      });
  };


  const handleShowMaterials = (classTopicId) => {
    classTopicService
      .getAllMaterialsByClassTopic(classTopicId)
      .then((res) => {
        const updatedClassTopicList = classTopicList.map((classTopic) => {
          if (classTopic.id === classTopicId) {
            return {
              ...classTopic,
              materialList: res.data, // Add quizList to the class topic
              showMaterials: true, // Set showQuizzes to true for the class topic
              showQuizzes: false,
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

    // Set the deadline time (in seconds) from now

  };

  useEffect(() => {
    let timerId;

    const updateTimer = () => {
      if (selectedQuiz) {
        const deadlineInSeconds = selectedQuiz.deadline * 60; // Convert minutes to seconds
        const endTime = Date.now() + deadlineInSeconds * 1000; // Convert seconds to milliseconds

        const update = () => {
          const currentTime = Date.now();
          const remainingTime = Math.max(0, endTime - currentTime);
          setTimeRemaining(remainingTime);

          if (remainingTime === 0) {
            clearInterval(timerId); // Clear interval when time is up
          }
        };

        // Call update immediately to ensure immediate display of correct time
        update();

        // Set interval to update timer every second
        timerId = setInterval(update, 1000);
      }
    };

    updateTimer();

    return () => {
      clearInterval(timerId); // Clean up interval on component unmount
    };
  }, [selectedQuiz]);

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
  const handleNextQuestion = () => {
    // Increment the current question index
    setCurrentQuestionIndex(prevIndex => prevIndex + 1);
    setShowScore(false);
    setShowAnswerColor(false); // Move inside the block for correct answer

    // Check if the user has reached the last question
    if (currentQuestionIndex === questionList.length - 1) {
      // If so, alert the user
      setShowResult(true);
      setShowQuestions(false);
      
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
        handleNextQuestion();

      }, 2000);


    } else {
      // If the selected answer is incorrect
      setMsg("+ 0 pts");
      setShowScore(true);
      setShowAnswerColor(true); // Move inside the block for incorrect answer
      setTimeout(() => {
        setShowScore(false);
        handleNextQuestion();

      }, 2000);
    }
  };
  return (
    <>
      {/* <Header /> */}
      <main >

        <div className="breadcrumbs" style={{ marginTop: '-30px', paddingBottom: '10px', position: 'fixed', top: 0, width: '100%', zIndex: 999, display: 'flex', justifyContent: 'flex-start', alignItems: 'center', paddingLeft: '20px', paddingRight: '20px' }} id='nav-fixed'>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <img src={process.env.PUBLIC_URL + '/meowlish_icon.png'} alt="MeowLish" style={{ width: '30px', marginRight: '5px', paddingTop: '10px' }} />
            <Link to="/home" style={{ color: '#fff', textDecoration: 'none', fontSize: '18px', fontWeight: 'bold', marginRight: '10px' }}>MeowLish</Link><span style={{ color: '#fff' }} className='mr-2'>|</span>
            <h4 style={{ color: '#fff', fontSize: '18px', fontWeight: 'bold', margin: 0 }}>{course.name}</h4>
          </div>
        </div>



        <section id="courses" className="courses" style={{ marginTop: '-10px' }}>
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
                  <div className="tab-content" id="myLearningTabsContent" style={{ marginTop: '-50px' }}>

                    <div className="tab-pane  show active" id="tab-content-1">
                      <section id="courses" className="courses">
                        <div className="container">
                          <div key={selectedLesson.id}>
                            {/* <div dangerouslySetInnerHTML={{ __html: selectedLesson.reading }}></div> */}
                            <a href={selectedLesson.classUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary">Join the class</a>
                          </div>
                          <img src={process.env.PUBLIC_URL + '/google_meet.jpg'} alt="google meet" style={{ width: '100%', paddingTop: '10px' }} />

                        </div>
                      </section>{/* End Courses Section */}
                    </div>



                    <div className="tab-pane fade" id="tab-content-2">
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
                                          <i className="fas fa-clock" ></i>
                                          <span>  Time Remaining: {formatTime(timeRemaining)}
                                          </span>
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
                                          {questionAnswerList.map((questionAnswer, index) => (
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
                                          ))}
                                        </>
                                      ) : (
                                        <>
                                          {questionAnswerList.map((questionAnswer, index) => (
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
                                          ))}
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
                                style={{ backgroundColor: '#f58d04', color: '#fff' }}
                              >
                                Re-Attempt Quiz
                              </button>
                            </div>

                          )}
                          {!showQuestions && (
                            <>
                              {classTopicList.map((classTopic, index) => (
                                <div key={index} className="d-block mb-3 text-left card">
                                  <h3 className="mb-1">Topic {index + 1}: {classTopic.name}</h3>
                                  <p className="mb-0">{classTopic.description}</p>
                                  <span className="badge label-table badge-primary" onClick={() => handleShowQuizzes(classTopic.id)}>  <i class="fas fa-play"></i> Start quiz</span>
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
                              ))}
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
                {classModuleList && classModuleList.length > 0 && classModuleList.map((module, index) => (
                  <div key={module.id} className="card-container" style={{ marginBottom: '5px' }}>
                    <div
                      className={`card module-title ${expandedModules.includes(module.id) ? 'expanded' : ''}`}
                      onClick={() => handleModuleCardClick(module.id)} style={{ marginBottom: '5px' }}
                    >
                      <div className="card-body" style={{ padding: '10px' }}>
                        <h4 className="card-title" >Day {index + 1}: {module.startDate.substring(0, 10)}</h4>
                        <span>{expandedModules.includes(module.id) ? '-' : '+'}</span>
                      </div>
                    </div>
                    {selectedModule && selectedModule.id === module.id && expandedModules.includes(module.id) && (
                      <div className="card-content" onClick={() => handleLessonClick(selectedModule.classLesson.id)}>
                        <div key={`lesson_${index}`} className="card" style={{ marginBottom: '5px' }}>
                          <div className="card-body"> <span style={{ fontWeight: 'bold', color: '#f58d04' }}>Time:</span> {selectedModule.classLesson.classHours}</div>
                          <div className="card-body" style={{ marginTop: '-40px' }}>
                            <span className="badge label-table badge-success mr-2"
                            > <i className="fas fa-file-video"></i> Join Class</span>
                            <span className="badge label-table badge-primary">  <i class="fab fa-discourse"></i> Topics</span>

                          </div>
                        </div>
                      </div>
                    )}



                  </div>
                ))}
              </div>
            </div>

          </div>
        </section>
      </main>
      {/* <Footer /> */}

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

            `}
      </style>
    </>
  )
}

export default StudyClass;
