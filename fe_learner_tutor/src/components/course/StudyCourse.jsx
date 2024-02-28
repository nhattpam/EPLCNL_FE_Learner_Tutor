import React, { useEffect, useState } from 'react';
import Header from '../Header';
import Footer from '../Footer';
import { useParams } from 'react-router-dom';
import courseService from '../../services/course.service';
import moduleService from '../../services/module.service'; // Import module service

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

    return (
        <>
            <Header />
            <main id="main" data-aos="fade-in">
                <div className="breadcrumbs">
                    <div style={{ float: 'left' }} className='ml-4'>
                        <h4 style={{ color: '#fff' }}>{course.name}</h4>
                    </div>
                </div>
                <section id="courses" className="courses">
                    <div className='row'>
                        <div className="col-md-8">
                            {/* Course Content */}
                        </div>

                        <div className="col-md-4" style={{ textAlign: 'left' , marginTop: '-60px'}}> {/* Adjusted width for sidebar */}
                            {/* Right Sidebar Content Here */}
                            <div style={{ background: '#f8f9fa', padding: '20px', border: '1px solid #ddd', textAlign: 'left' }}>
                                {/* Add your sidebar content here */}
                                <h4 style={{ fontWeight: 'bold' }}>Course content</h4>
                                {moduleList && moduleList.length > 0 && moduleList.map((module, index) => (
                                    <div key={module.id}>
                                        <h4
                                            className="module-title" // Add CSS class for styling
                                            onClick={() => setSelectedModule(module)}
                                        >
                                            <span>Section {index + 1}: {module.name}</span>
                                            <span onClick={() => toggleModuleExpansion(module.id)}>
                                                {expandedModules.includes(module.id) ? '-' : '+'}
                                            </span>
                                        </h4>
                                        {selectedModule && selectedModule.id === module.id && expandedModules.includes(module.id) && (
                                            <>
                                                {moduleContent.lessons && moduleContent.lessons.length > 0 && (
                                                    <ul className="module-list"> {/* Add CSS class for styling */}
                                                        {moduleContent.lessons.map((lesson, index) => (
                                                            <li key={index}>{lesson.name}</li>
                                                        ))}
                                                    </ul>
                                                )}

                                                {moduleContent.assignments && moduleContent.assignments.length > 0 && (
                                                    <ul className="module-list"> {/* Add CSS class for styling */}
                                                        {moduleContent.assignments.map((assignment, index) => (
                                                            <li key={index}>{assignment.questionText}</li>
                                                        ))}
                                                    </ul>
                                                )}

                                                {moduleContent.quizzes && moduleContent.quizzes.length > 0 && (
                                                    <ul className="module-list"> {/* Add CSS class for styling */}
                                                        {moduleContent.quizzes.map((quiz, index) => (
                                                            <li key={index}>{quiz.name}</li>
                                                        ))}
                                                    </ul>
                                                )}
                                            </>
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
                
                
            `}
            </style>
        </>
    )
}

export default StudyCourse;
