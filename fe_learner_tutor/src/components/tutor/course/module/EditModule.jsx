import React, { useEffect, useState } from 'react';
import Header from '../../Header';
import Sidebar from '../../Sidebar';
import Footer from '../../Footer';
import { Link, useNavigate, useParams } from 'react-router-dom';
import moduleService from '../../../../services/module.service';
import ReactPaginate from 'react-paginate';
import { AiFillCaretLeft, AiFillCaretRight } from 'react-icons/ai';

const EditModule = () => {
    const [module, setModule] = useState({
        name: "",
        assignments: [],
        lessons: [],
        quizzes: [],
        isActive: false
    });

    const [errors, setErrors] = useState({});
    const [msg, setMsg] = useState('');
    const storedLoginStatus = sessionStorage.getItem('isLoggedIn');

    const navigate = useNavigate();
    if (!storedLoginStatus) {
        navigate(`/login`)
    }
    const { moduleId } = useParams();
    //get number of lessons, assignments, quizzes
    const [lessonList, setLessonList] = useState([]);
    const [quizList, setQuizList] = useState([]);
    const [assignmentList, setAssignmentList] = useState([]);

    //LOADING
    const [loading, setLoading] = useState(true); // State to track loading

    //LOADING

    useEffect(() => {
        if (moduleId) {
            moduleService
                .getModuleById(moduleId)
                .then((res) => {
                    setModule(res.data);
                    setLoading(false);

                })
                .catch((error) => {
                    console.log(error);
                    setLoading(false);

                });
        }
    }, [moduleId]);

    useEffect(() => {
        moduleService
            .getAllLessonsByModule(moduleId)
            .then((res) => {
                console.log(res.data);
                setLessonList(res.data);

            })
            .catch((error) => {
                console.log(error);
            });
    }, [moduleId]);

    useEffect(() => {
        moduleService
            .getAllAssignmentsByModule(moduleId)
            .then((res) => {
                console.log(res.data);
                setAssignmentList(res.data);

            })
            .catch((error) => {
                console.log(error);
            });
    }, [moduleId]);

    useEffect(() => {
        moduleService
            .getAllQuizzesByModule(moduleId)
            .then((res) => {
                console.log(res.data);
                setQuizList(res.data);

            })
            .catch((error) => {
                console.log(error);
            });
    }, [moduleId]);

    const handleEditModule = (moduleId) => {
        // Add logic to navigate to the module edit page with the moduleId
        navigate(`/edit-module/${moduleId}`);
    };


    //paginate
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(0);
    const [lessonsPerPage] = useState(2);

    const [searchTerm2, setSearchTerm2] = useState('');
    const [currentPage2, setCurrentPage2] = useState(0);
    const [assignmentsPerPage] = useState(2);

    const [searchTerm3, setSearchTerm3] = useState('');
    const [currentPage3, setCurrentPage3] = useState(0);
    const [quizsPerPage] = useState(2);


    const filteredLessons = lessonList
        .filter((lesson) => {
            return (
                lesson.id.toString().toLowerCase().includes(searchTerm.toLowerCase())

            );
        });

    const pageCount = Math.ceil(filteredLessons.length / lessonsPerPage);

    const handlePageClick = (data) => {
        setCurrentPage(data.selected);
    };

    const offset = currentPage * lessonsPerPage;
    const currentLessons = filteredLessons.slice(offset, offset + lessonsPerPage);

    const filteredAssignments = assignmentList
        .filter((assignment) => {
            return (
                assignment.id.toString().toLowerCase().includes(searchTerm2.toLowerCase())

            );
        });

    const pageCount2 = Math.ceil(filteredAssignments.length / assignmentsPerPage);

    const handlePageClick2 = (data) => {
        setCurrentPage2(data.selected);
    };

    const offset2 = currentPage2 * assignmentsPerPage;
    const currentAssignments = filteredAssignments.slice(offset2, offset2 + assignmentsPerPage);



    const filteredQuizs = quizList
        .filter((quiz) => {
            return (
                quiz.id.toString().toLowerCase().includes(searchTerm3.toLowerCase())

            );
        });

    const pageCount3 = Math.ceil(filteredQuizs.length / quizsPerPage);

    const handlePageClick3 = (data) => {
        setCurrentPage3(data.selected);
    };

    const offset3 = currentPage3 * quizsPerPage;
    const currentQuizs = filteredQuizs.slice(offset3, offset3 + quizsPerPage);
    //paginate


    //EDIT MODULE
    const [showEditModuleModal, setShowEditModuleModal] = useState(false);
    const openEditModuleModal = () => {
        setShowEditModuleModal(true);
    };

    const closeEditModuleModal = () => {
        setShowEditModuleModal(false);
    };

    const handleChange = (e) => {
        const value = e.target.value;
        setModule({ ...module, [e.target.name]: value });
    };

    const validateForm = () => {
        let isValid = true;
        const errors = {};

        if (module.name.trim() === '') {
            errors.name = 'Name is required';
            isValid = false;
        }

        setErrors(errors);
        return isValid;
    };

    const submitModule = async (e) => {
        e.preventDefault();
        module.isActive = true;
        if (validateForm()) {
            moduleService
                .updateModule(module.id, module)
                .then((res) => {
                    window.alert("Update Module Successfully");
                    window.location.reload();

                })
                .catch((error) => {
                    console.log(error);
                });

        }
    };

    //ACTIVATE
    const handleActivate = async () => {
        module.isActive = true;
        // Save account
        const moduleResponse = await moduleService.updateModule(module.id, module);

        const moduleJson = JSON.stringify(moduleResponse.data);

        const moduleJsonParse = JSON.parse(moduleJson);

        window.alert("Activate Module Successfully!")
        window.location.reload();
    };


    //DEACTIVATE
    const handleDeactivate = async () => {
        module.isActive = false;
        // Save account
        const moduleResponse = await moduleService.updateModule(module.id, module);

        const moduleJson = JSON.stringify(moduleResponse.data);

        const moduleJsonParse = JSON.parse(moduleJson);

        window.alert("Deactivate Module Successfully!")
        window.location.reload();
    };



    return (
        <>
            <div id="wrapper">
                <Header />
                <Sidebar />
                <div className="content-page">
                    {/* Start Content*/}
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-12">
                                <div className="card-box">

                                    {loading && (
                                        <div className="loading-overlay">
                                            <div className="loading-spinner" />
                                        </div>
                                    )}
                                    <h4 className="header-title">COURSE - <span className='text-success'>{module.course?.name}</span> | MODULE INFORMATION  &nbsp;<i class="fa-solid fa-pen-to-square" onClick={openEditModuleModal}></i>
                                        {module.isActive ? (
                                            <span className="badge label-table badge-success" style={{ float: 'right' }}>Active</span>
                                        ) : (
                                            <span className="badge label-table badge-danger" style={{ float: 'right' }}>Inactive</span>
                                        )}
                                    </h4>


                                    <div className="mb-3 mt-3">
                                        <h5>Module Name: {module.name}</h5>
                                    </div>


                                    <div className="row">
                                        <div className="col-12">
                                            <h5>List of Lessons &nbsp;
                                                <Link to={`/tutor/courses/create/create-video-course/create-lesson/${moduleId}`} >
                                                    <i className="fas fa-plus-circle text-success"></i>
                                                </Link>
                                            </h5>
                                            <div className="table-responsive">
                                                <table id="demo-foo-filtering" className="table table-borderless table-hover table-nowrap table-centered mb-0" data-page-size={7}>
                                                    <thead className="thead-light">
                                                        <tr>
                                                            <th data-toggle="true">No.</th>
                                                            <th data-toggle="true">Lesson Name</th>
                                                            {/* <th>Video Url</th> */}
                                                            <th data-hide="phone">Created Date</th>
                                                            <th data-hide="phone, tablet">Updated Date</th>
                                                            <th>Action</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {
                                                            currentLessons.length > 0 && currentLessons.map((lesson, index) => (
                                                                <tr key={lesson.id}>
                                                                    <td>{index + 1}</td>
                                                                    <td>{lesson.name}</td>
                                                                    {/* <td>{lesson.videoUrl}</td> */}
                                                                    <td>{new Date(lesson.createdDate).toLocaleString('en-US')}</td>
                                                                    {
                                                                        lesson.updatedDate && (
                                                                            <td>{new Date(lesson.updatedDate).toLocaleString('en-US')}</td>

                                                                        )
                                                                    }
                                                                    {
                                                                        !lesson.updatedDate && (
                                                                            <td><i class="fa-solid fa-ban"></i></td>

                                                                        )
                                                                    }                                                                    <td>
                                                                        <Link to={`/tutor/courses/edit-lesson/${lesson.id}`} className='text-dark'>
                                                                            <i class="fa-regular fa-eye"></i>
                                                                        </Link>
                                                                    </td>

                                                                </tr>
                                                            ))
                                                        }

                                                    </tbody>

                                                </table>
                                                {
                                                    currentLessons.length === 0 && (
                                                        <p className='text-center mt-3'>No lessons yet.</p>
                                                    )
                                                }
                                            </div> {/* end .table-responsive*/}

                                        </div>

                                        <div className='container-fluid'>
                                            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                                                <ReactPaginate
                                                    previousLabel={<AiFillCaretLeft style={{ color: "#000", fontSize: "14px" }} />}
                                                    nextLabel={<AiFillCaretRight style={{ color: "#000", fontSize: "14px" }} />}
                                                    breakLabel={'...'}
                                                    breakClassName={'page-item'}
                                                    breakLinkClassName={'page-link'}
                                                    pageCount={pageCount}
                                                    marginPagesDisplayed={2}
                                                    pageRangeDisplayed={5}
                                                    onPageChange={handlePageClick}
                                                    containerClassName={'pagination'}
                                                    activeClassName={'active'}
                                                    previousClassName={'page-item'}
                                                    nextClassName={'page-item'}
                                                    pageClassName={'page-item'}
                                                    previousLinkClassName={'page-link'}
                                                    nextLinkClassName={'page-link'}
                                                    pageLinkClassName={'page-link'}
                                                />
                                            </div>
                                        </div>
                                        <div className="col-12">
                                            <h5>List of Assignments &nbsp;
                                                <Link to={`/tutor/courses/create/create-video-course/create-assignment/${moduleId}`} >
                                                    <i className="fas fa-plus-circle text-success"></i>
                                                </Link>
                                            </h5>
                                            <div className="table-responsive">
                                                <table id="demo-foo-filtering" className="table table-borderless table-hover table-wrap table-centered mb-0" data-page-size={7}>
                                                    <thead className="thead-light">
                                                        <tr>
                                                            <th>No.</th>
                                                            <th>Time</th>
                                                            <th>Grade To Pass</th>
                                                            <th data-hide="phone">Created Date</th>
                                                            <th data-hide="phone, tablet">Updated Date</th>
                                                            <th>Action</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {
                                                            currentAssignments.length > 0 && currentAssignments.map((assignment, index) => (
                                                                <tr key={assignment.id}>
                                                                    <td>{index + 1}</td>
                                                                    <td>{assignment.deadline} mins</td>
                                                                    <td>{assignment.gradeToPass}</td>
                                                                    <td>{new Date(assignment.createdDate).toLocaleString('en-US')}</td>
                                                                    {
                                                                        assignment.updatedDate && (
                                                                            <td>{new Date(assignment.updatedDate).toLocaleString('en-US')}</td>

                                                                        )
                                                                    }
                                                                    {
                                                                        !assignment.updatedDate && (
                                                                            <td><i class="fa-solid fa-ban"></i></td>

                                                                        )
                                                                    }
                                                                    <td>
                                                                        <Link to={`/tutor/courses/edit-assignment/${assignment.id}`} className='text-secondary'>
                                                                            <i class="fa-regular fa-eye"></i>
                                                                        </Link>
                                                                    </td>
                                                                </tr>
                                                            ))
                                                        }
                                                    </tbody>

                                                </table>
                                                {
                                                    currentAssignments.length === 0 && (
                                                        <p className='text-center mt-3'>No assignments yet.</p>
                                                    )
                                                }
                                            </div> {/* end .table-responsive*/}
                                        </div>

                                        <div className='container-fluid'>
                                            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                                                <ReactPaginate
                                                    previousLabel={<AiFillCaretLeft style={{ color: "#000", fontSize: "14px" }} />}
                                                    nextLabel={<AiFillCaretRight style={{ color: "#000", fontSize: "14px" }} />}
                                                    breakLabel={'...'}
                                                    breakClassName={'page-item'}
                                                    breakLinkClassName={'page-link'}
                                                    pageCount={pageCount2}
                                                    marginPagesDisplayed={2}
                                                    pageRangeDisplayed={5}
                                                    onPageChange={handlePageClick2}
                                                    containerClassName={'pagination'}
                                                    activeClassName={'active'}
                                                    previousClassName={'page-item'}
                                                    nextClassName={'page-item'}
                                                    pageClassName={'page-item'}
                                                    previousLinkClassName={'page-link'}
                                                    nextLinkClassName={'page-link'}
                                                    pageLinkClassName={'page-link'}
                                                />
                                            </div>
                                        </div>
                                        <div className="col-12">
                                            <h5>List of Quizzes &nbsp;
                                                <Link to={`/tutor/courses/create/create-video-course/create-quiz/${moduleId}`}>
                                                    <i className="fas fa-plus-circle text-success"></i>
                                                </Link>
                                            </h5>
                                            <div className="table-responsive">
                                                <table id="demo-foo-filtering" className="table table-borderless table-hover table-nowrap table-centered mb-0" data-page-size={7}>
                                                    <thead className="thead-light">
                                                        <tr>
                                                            <th data-toggle="true">No.</th>
                                                            <th data-toggle="true">Quiz Name</th>
                                                            <th>Grade to pass</th>
                                                            <th>Times</th>
                                                            <th data-hide="phone">Created Date</th>
                                                            <th data-hide="phone, tablet">Updated Date</th>
                                                            <th>Action</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {
                                                            currentQuizs.length > 0 && currentQuizs.map((quiz, index) => (
                                                                <tr key={quiz.id}>
                                                                    <td>{index + 1}</td>
                                                                    <td>{quiz.name}</td>
                                                                    <td>{quiz.gradeToPass}</td>
                                                                    <td>{quiz.deadline} mins</td>
                                                                    <td>{new Date(quiz.createdDate).toLocaleString('en-US')}</td>
                                                                    {
                                                                        quiz.updatedDate && (
                                                                            <td>{new Date(quiz.updatedDate).toLocaleString('en-US')}</td>

                                                                        )
                                                                    }
                                                                    {
                                                                        !quiz.updatedDate && (
                                                                            <td><i class="fa-solid fa-ban"></i></td>

                                                                        )
                                                                    }
                                                                    <td>
                                                                        <Link to={`/tutor/courses/edit-quiz/${quiz.id}`} className='text-secondary'>
                                                                            <i class="fa-regular fa-eye"></i>
                                                                        </Link>
                                                                    </td>
                                                                </tr>
                                                            ))
                                                        }

                                                    </tbody>

                                                </table>
                                                {
                                                    currentQuizs.length === 0 && (
                                                        <p className='text-center mt-3'>No quizzes yet.</p>
                                                    )
                                                }
                                            </div> {/* end .table-responsive*/}

                                        </div>

                                        <div className='container-fluid'>
                                            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                                                <ReactPaginate
                                                    previousLabel={<AiFillCaretLeft style={{ color: "#000", fontSize: "14px" }} />}
                                                    nextLabel={<AiFillCaretRight style={{ color: "#000", fontSize: "14px" }} />}
                                                    breakLabel={'...'}
                                                    breakClassName={'page-item'}
                                                    breakLinkClassName={'page-link'}
                                                    pageCount={pageCount3}
                                                    marginPagesDisplayed={2}
                                                    pageRangeDisplayed={5}
                                                    onPageChange={handlePageClick3}
                                                    containerClassName={'pagination'}
                                                    activeClassName={'active'}
                                                    previousClassName={'page-item'}
                                                    nextClassName={'page-item'}
                                                    pageClassName={'page-item'}
                                                    previousLinkClassName={'page-link'}
                                                    nextLinkClassName={'page-link'}
                                                    pageLinkClassName={'page-link'}
                                                />
                                            </div>
                                        </div>

                                    </div>
                                </div> {/* end card-box*/}
                                <button
                                    type="button" onClick={handleActivate}
                                    className="btn btn-success ml-2"
                                    style={{ borderRadius: '50px', padding: `8px 25px` }}
                                >
                                    Activate
                                </button>
                                <button
                                    type="button" onClick={handleDeactivate}
                                    className="btn btn-danger ml-2"
                                    style={{ borderRadius: '50px', padding: `8px 25px` }}
                                >
                                    Deactivate
                                </button>
                                <Link
                                    type="button"
                                    className="btn btn-black mr-2"
                                    to={`/tutor/courses/edit-course/${module.courseId}`}
                                >
                                    <i class="fas fa-long-arrow-alt-left"></i> Back to Course Infomation
                                </Link>
                            </div> {/* end col*/}
                            {showEditModuleModal && (
                                <div className="modal" tabIndex="-1" role="dialog" style={{ display: 'block', backgroundColor: 'rgba(29, 29, 29, 0.75)' }}>
                                    <div className="modal-dialog modal-lg" role="document">
                                        <div className="modal-content">
                                            <div className="modal-header">
                                                <h5 className="modal-title">Edit Module</h5>
                                                <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={closeEditModuleModal}>
                                                    <span aria-hidden="true">&times;</span>
                                                </button>
                                            </div>
                                            {/* Conditional rendering based on edit mode */}
                                            <>
                                                <form onSubmit={(e) => submitModule(e)}>
                                                    <div className="modal-body" style={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}> {/* Added style for scrolling */}
                                                        <div className="table-responsive">
                                                            <table className="table table-hover">
                                                                <tbody>
                                                                    <tr>
                                                                        <th style={{ width: '30%' }}>Name:</th>
                                                                        <td>
                                                                            <input type="text" className="form-control" name="name" value={module.name} onChange={(e) => handleChange(e)} style={{ borderRadius: '50px', padding: `8px 25px` }} />
                                                                            {errors.name && <p className="text-danger">{errors.name}</p>}
                                                                        </td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    </div>
                                                    <div className="modal-footer">
                                                        <button type="submit" className="btn btn-success" style={{ borderRadius: '50px', padding: `8px 25px` }}>Save Changes</button>

                                                        <button type="button" className="btn btn-dark" onClick={closeEditModuleModal} style={{ borderRadius: '50px', padding: `8px 25px` }}>Close</button>
                                                    </div>
                                                </form>
                                            </>


                                        </div>
                                    </div>
                                </div>
                            )}

                        </div>
                        {/* end row*/}
                    </div> {/* container */}
                </div>
            </div>
            <style>
                {`
                    body, #wrapper {
                        height: 100%;
                        margin: 0;
                    }

                    #wrapper {
                        display: flex;
                        flex-direction: column;
                    }

                    .content-page {
                        flex: 1;
                        width: 85%;
                        text-align: left;
                    }

                    .page-item.active .page-link{
                        background-color: #20c997;
                        border-color: #20c997;
                    }

                    .truncate-text {
                        max-width: 200px; /* Adjust max-width as needed */
                        white-space: nowrap;
                        overflow: hidden;
                        text-overflow: ellipsis;
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
    );
}

export default EditModule;
