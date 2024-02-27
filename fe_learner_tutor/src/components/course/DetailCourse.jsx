import React, { useEffect, useState } from 'react';
import Header from '../Header'
import Footer from '../Footer'
import { useParams } from 'react-router-dom'
import courseService from '../../services/course.service'
import moduleService from '../../services/module.service';

const DetailCourse = () => {


    const { courseId } = useParams();

    const [course, setCourse] = useState({
        name: ""
    });

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
                                    <h5 style={{ color: '#f58d04' , fontWeight: 'bold'}}>Tutor</h5>
                                    <p><a href="#">{course.tutor?.account?.fullName}</a></p>
                                </div>
                                <div className="course-info d-flex justify-content-between align-items-center">
                                    <h5 style={{ color: '#f58d04' , fontWeight: 'bold'}}>Course Fee</h5>
                                    <p>${course.stockPrice}</p>
                                </div>
                                <div className="course-info d-flex justify-content-between align-items-center">
                                    <h5 style={{ color: '#f58d04' , fontWeight: 'bold'}}>Enrolled Students</h5>
                                    <p>30</p>
                                </div>
                               
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
                                                    <h4 className="section-title" style={{ color: '#f58d04' }}>Lessons</h4>
                                                    {lessonList
                                                        .filter(lesson => lesson.moduleId === module.id)
                                                        .map((lesson, lessonIndex) => (
                                                            <div className="lesson" key={lessonIndex}>
                                                                <p>{lesson.name}</p>
                                                            </div>
                                                        ))}
                                                </div>
                                                <div className="assignments">
                                                    <h4 className="section-title" style={{ color: '#f58d04' }}>Assignments</h4>
                                                    {assignmentList
                                                        .filter(assignment => assignment.moduleId === module.id)
                                                        .map((assignment, assignmentIndex) => (
                                                            <div className="assignment" key={assignmentIndex}>
                                                                <p>Deadline: {assignment.deadline}  minutes</p>
                                                            </div>
                                                        ))}
                                                </div>
                                                <div className="quizzes">
                                                    <h4 className="section-title" style={{ color: '#f58d04' }}>Quizzes</h4>
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