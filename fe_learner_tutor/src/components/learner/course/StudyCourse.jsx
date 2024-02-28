import React, { useEffect, useState } from 'react';
import Header from '../../Header';
import Footer from '../../Footer';
import { useParams } from 'react-router-dom';
import courseService from '../../../services/course.service';
import moduleService from '../../../services/module.service'; // Import module service
import lessonService from '../../../services/lesson.service';
import assignmentService from '../../../services/assignment.service';
import ReactQuill from 'react-quill';

const StudyCourse = () => {
    const { courseId } = useParams();

    const [course, setCourse] = useState({
        name: "",
        modules: []
    });

    const [moduleList, setModuleList] = useState([]);

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
                console.log(res.data);
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

    // Function to handle click on a module card to toggle expansion
    const handleModuleCardClick = (moduleId) => {
        toggleModuleExpansion(moduleId);
        setSelectedModule(moduleList.find(module => module.id === moduleId));
    };


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
    };

    //ASSIGNMENT
    const [assignment, setAssignment] = useState({
        questionText: "",
        deadline: "", // set a default value for minutes
        moduleId: ""
    });

    // State for lesson
    const [selectedAssignmentId, setSelectedAssignmentId] = useState(null);
    const [selectedAssignment, setSelectedAssignment] = useState(null);

    useEffect(() => {
        if (selectedAssignmentId) {
            assignmentService
                .getAssignmentById(selectedAssignmentId)
                .then((res) => {
                    setSelectedAssignment(res.data);
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    }, [selectedAssignmentId]);

    // Function to handle click on a assignment card to show details
    const handleAssignmentClick = (assignmentId) => {
        setSelectedAssignmentId(assignmentId);
    };

    // State to track whether the form should be displayed or not
    const [showForm, setShowForm] = useState(false);
    // State to track whether the timer should be displayed or not
    const [showTimer, setShowTimer] = useState(false);

    // State variable for countdown
    const [timeRemaining, setTimeRemaining] = useState(0);

    // Function to handle click on the "Start Assignment" button
    const handleStartAssignment = () => {
        setShowTimer(true);
        setShowForm(true);

        // Set the deadline time (in seconds) from now
        const deadlineInSeconds = Date.now() + selectedAssignment.deadline * 60 * 1000;

        // Update time remaining every second
        const interval = setInterval(() => {
            const currentTime = Date.now();
            const remaining = Math.max(0, deadlineInSeconds - currentTime);
            setTimeRemaining(remaining);

            // If time runs out, clear the interval
            if (remaining === 0) {
                clearInterval(interval);
            }
        }, 1000);
    };

    // Format time remaining into minutes and seconds
    const formatTime = (time) => {
        const minutes = Math.floor(time / (60 * 1000));
        const seconds = Math.floor((time % (60 * 1000)) / 1000);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };


    //QUIZ

    return (
        <>
            <Header />
            <main id="main" data-aos="fade-in">
                <div className="breadcrumbs">
                    <div style={{ float: 'left' }} className='ml-4'>
                        <h4 style={{ color: '#fff' }}>{course.name}</h4>
                    </div>
                </div>
                <section id="courses" className="courses" style={{ marginTop: '-60px' }}>
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
                                                    <div className="row" style={{ textAlign: 'left' }}>
                                                        <div dangerouslySetInnerHTML={{ __html: selectedLesson.reading }}></div>
                                                    </div>
                                                </div>
                                            </section>{/* End Courses Section */}
                                        </div>


                                        <div className="tab-pane fade" id="tab-content-2">
                                            {/* Course Content for Tab 2 */}
                                            {/* You can customize this content based on your needs */}
                                        </div>

                                    </div>
                                </>


                            )}
                            {selectedAssignment && selectedAssignment.questionText && (
                                <>
                                    <div className="tab-content" id="myLearningTabsContent" style={{ marginTop: '-50px' }}>
                                        <div className="tab-pane show active" id="tab-content-1">
                                            <section id="courses" className="courses">
                                                <div className="container">
                                                    <div className="row" style={{ textAlign: 'left' }}>
                                                        <div dangerouslySetInnerHTML={{ __html: selectedAssignment.questionText }}></div>
                                                    </div>
                                                </div>
                                            </section>
                                        </div>
                                        {/* Render the timer if showTimer state is true */}
                                        {showTimer ? (
                                            // Render the timer component here
                                            // You can implement the countdown logic inside this component
                                            // For now, just display a simple timer
                                            <div className="d-flex align-items-center">
                                                <i className="fas fa-clock" style={{ marginRight: '5px' }}></i>
                                                <span>  Time Remaining: {formatTime(timeRemaining)}
                                                </span>
                                            </div>
                                        ) : (
                                            // Render the "Start Assignment" button if showTimer state is false
                                            <button
                                                className="btn btn-primary"
                                                style={{ backgroundColor: '#f58d04', color: '#fff' }}
                                                onClick={handleStartAssignment}
                                            >
                                                Start Assignment
                                            </button>
                                        )}
                                        {/* Render the form if showForm state is true */}
                                        {showForm && (
                                            <form>
                                                <div className="tab-pane show active" id="tab-content-1">
                                                    <section id="courses" className="courses">
                                                        <div className="container">
                                                            <div className="row" style={{ textAlign: 'left' }}>
                                                                <ReactQuill
                                                                    // value={assignment.questionText}
                                                                    // onChange={handleChangeAssignment}
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
                                                        </div>
                                                    </section>
                                                </div>
                                                <button
                                                    className="btn btn-primary"
                                                    style={{ backgroundColor: '#f58d04', color: '#fff' }}
                                                >
                                                    Submit
                                                </button>
                                            </form>
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
                                            <div className="card-body" style={{ padding: '10px' }}>
                                                <h4 className="card-title" >Section {index + 1}: {module.name}</h4>
                                                <span>{expandedModules.includes(module.id) ? '-' : '+'}</span>
                                            </div>
                                        </div>
                                        {selectedModule && selectedModule.id === module.id && expandedModules.includes(module.id) && (
                                            <div className="card-content">
                                                {/* Combine all items into a single array */}
                                                {moduleContent.lessons.map((lesson, index) => (
                                                    <div key={`lesson_${index}`} className="card" style={{ marginBottom: '5px' }} onClick={() => handleLessonClick(lesson.id)}>
                                                        <div className="card-body">{index + 1}. {lesson.name}</div>
                                                        <div className="card-body" style={{ marginTop: '-40px' }}>
                                                            <i className="fas fa-file-video"></i>
                                                        </div>
                                                    </div>
                                                ))}
                                                {moduleContent.assignments.map((assignment, index) => (
                                                    <div key={`assignment_${index}`} className="card" style={{ marginBottom: '5px' }} onClick={() => handleAssignmentClick(assignment.id)}>
                                                        <div className="card-body">{moduleContent.lessons.length + index + 1}. {assignment.questionText}</div>
                                                        <div className="card-body" style={{ marginTop: '-40px' }}>
                                                            <i className="fab fa-wpforms"></i> {assignment.deadline} mins
                                                        </div>
                                                    </div>
                                                ))}
                                                {moduleContent.quizzes.map((quiz, index) => (
                                                    <div key={`quiz_${index}`} className="card" style={{ marginBottom: '5px' }}>
                                                        <div className="card-body">{moduleContent.lessons.length + moduleContent.assignments.length + index + 1}. {quiz.name}</div>
                                                        <div className="card-body" style={{ marginTop: '-40px' }}>
                                                            <i className="far fa-question-circle"></i> {quiz.deadline} mins
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}


                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>
                </section>
            </main>
            <Footer />
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

            `}
            </style>
        </>
    )
}

export default StudyCourse;
