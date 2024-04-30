import React, { useEffect, useState } from 'react';
import Header from '../../Header';
import Sidebar from '../../Sidebar';
import Footer from '../../Footer';
import { Link, useNavigate, useParams } from 'react-router-dom';
import moduleService from '../../../../services/module.service';
import classModuleService from '../../../../services/class-module.service';
import classLessonService from '../../../../services/class-lesson.service';
import DatePicker from 'react-datepicker';

const EditClassModule = () => {

    const [module, setModule] = useState({
        isActive: false
    });


    const [errors, setErrors] = useState({});
    const [searchTerm, setSearchTerm] = useState('');
    const [classTopicList, setClassTopicList] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [classTopicsPerPage] = useState(2);
    const [msg, setMsg] = useState('');
    const storedLoginStatus = sessionStorage.getItem('isLoggedIn');

    const navigate = useNavigate();
    if (!storedLoginStatus) {
        navigate(`/login`)
    }
    const { moduleId } = useParams();

    //LOADING
    const [loading, setLoading] = useState(true); // State to track loading

    //LOADING
    useEffect(() => {
        if (moduleId) {
            classModuleService
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
        if (module.classLesson?.id) {
            classLessonService
                .getAllClassTopicsByClassLesson(module.classLesson?.id)
                .then((res) => {
                    // console.log(res.data);
                    setClassTopicList(res.data);

                })
                .catch((error) => {
                    console.log(error);
                });
        }

    }, [module.classLesson?.id]);




    const filteredClassTopics = classTopicList
        .filter((classTopic) => {
            return (
                classTopic.id.toString().toLowerCase().includes(searchTerm.toLowerCase())

            );
        });
    const pageCount = Math.ceil(filteredClassTopics.length / classTopicsPerPage);


    const offset = currentPage * classTopicsPerPage;
    const currentClassTopics = filteredClassTopics.slice(offset, offset + classTopicsPerPage);


    //EDIT CLASS MODULE
    const [showEditClassModuleModal, setShowEditClassModuleModal] = useState(false);
    const openEditClassModuleModal = () => {
        setShowEditClassModuleModal(true);
    };

    const closeEditCourseModal = () => {
        setShowEditClassModuleModal(false);
    };

    //class lesson
    const [classLesson, setClassLesson] = useState({
        classHours: '',
        classUrl: '',
        classModuleId: module.id,
    });

    useEffect(() => {
        if (module.classLesson?.id) {
            classLessonService
                .getClassLessonById(module.classLesson?.id)
                .then((res) => {
                    setClassLesson(res.data);
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    }, [module.classLesson?.id]);

    const handleClassLessonChange = (e) => {
        const { value } = e.target;
        setClassLesson({ ...classLesson, classUrl: value });
    };

    const validateForm = () => {
        let isValid = true;
        const errors = {};

        if (classLesson.classUrl.trim() === '') {
            errors.classUrl = 'Class Url is required';
            isValid = false;
        }

        setErrors(errors);
        return isValid;
    };


    const submitClassLesson = async (e) => {
        e.preventDefault();

        module.isActive = true;
        classLessonService
            .updateClassLesson(classLesson.id, classLesson)
            .then((res) => {
                window.alert("Update Class Successfully!");
                window.location.reload();
            })
            .catch((error) => {
                console.log(error);
            });
        classModuleService.updateModule(module.id, module)
            .then((res) => {
            })
            .catch((error) => {
                console.log(error);
            });
    };

    //DEACTIVATE
    const handleDeactivate = async () => {
        module.isActive = false;
        // Save account
        const moduleResponse = await classModuleService.updateModule(module.id, module);

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
                                    <h4 className="header-title">COURSE -
                                        <span className='text-success'> {module.course?.name} </span>
                                        | CLASS INFORMATION &nbsp;<i class="fa-solid fa-pen-to-square" onClick={openEditClassModuleModal}></i>
                                        {module.isActive ? (
                                            <span className="badge label-table badge-success" style={{ float: 'right' }}>Active</span>
                                        ) : (
                                            <span className="badge label-table badge-danger" style={{ float: 'right' }}>Inactive</span>
                                        )}
                                    </h4>

                                    {loading && (
                                        <div className="loading-overlay">
                                            <div className="loading-spinner" />
                                        </div>
                                    )}
                                    <form id="demo-form" data-parsley-validate>
                                        <div className="form-group">
                                            <h5 htmlFor="name">Start Date:</h5>
                                            <ul>
                                                {module.startDate ? new Date(module.startDate).toLocaleDateString('en-US') : "No start date"}
                                            </ul>
                                        </div>

                                        <div className="form-group">
                                            <h5>Class Hours: </h5>
                                            <ul>
                                                {module.classLesson?.classHours}
                                            </ul>
                                        </div>

                                        <div className="form-group">
                                            <h5>Class Url:</h5>
                                            <ul>
                                                {module.classLesson?.classUrl}
                                            </ul>
                                        </div>

                                        <div className="form-group">
                                            <h5>Topics:</h5>

                                            <div className="table-responsive">
                                                <table id="demo-foo-filtering" className="table table-borderless table-hover table-wrap table-centered mb-0" data-page-size={7}>
                                                    <thead className="thead-light">
                                                        <tr>
                                                            <th data-toggle="true">No.</th>
                                                            <th data-toggle="true">Topic Name</th>
                                                            <th>Description</th>
                                                            <th data-hide="phone">Created Date</th>
                                                            <th data-hide="phone, tablet">Updated Date</th>
                                                            <th>Action</th>
                                                            {/* <th>Quizzes</th> */}
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {
                                                            currentClassTopics.length > 0 && currentClassTopics.map((classTopic, index) => (
                                                                <tr key={classTopic.id}>
                                                                    <td>{index + 1}</td>
                                                                    <td>{classTopic.name}</td>
                                                                    <td>{classTopic.description}</td>
                                                                    <td>{new Date(classTopic.createdDate).toLocaleString('en-US')}</td>
                                                                    {
                                                                        classTopic.updatedDate && (
                                                                            <td>{new Date(classTopic.updatedDate).toLocaleString('en-US')}</td>

                                                                        )
                                                                    }
                                                                    {
                                                                        !classTopic.updatedDate && (
                                                                            <td><i class="fa-solid fa-ban"></i></td>

                                                                        )
                                                                    }
                                                                    <td>
                                                                        <Link to={`/tutor/courses/edit-topic/${classTopic.id}`} className='text-secondary'>
                                                                            <i class="fa-regular fa-eye"></i>
                                                                        </Link>
                                                                    </td>
                                                                    {/* <td>
                                                                    <Link to={`/tutor/courses/edit-topic/${classTopic.id}`} className='text-secondary'>
                                                                        <i class="fa-regular fa-eye"></i>
                                                                    </Link>
                                                                </td> */}
                                                                </tr>
                                                            ))}
                                                    </tbody>

                                                </table>
                                            </div> {/* end .table-responsive*/}

                                        </div>

                                        <div className="form-group mb-0">
                                            <Link
                                                to={`/tutor/courses/create/create-class-course/create-topic/${module.classLesson?.id}`}
                                                className="btn btn-success" style={{ borderRadius: '50px', padding: `8px 25px` }}
                                            >
                                                Create new topic
                                            </Link>
                                            <button
                                                type="button" onClick={handleDeactivate}
                                                className="btn btn-danger ml-2"
                                                style={{ borderRadius: '50px', padding: `8px 25px` }}
                                            >
                                                Deactivate
                                            </button>
                                            <Link
                                                to={`/tutor/courses/edit-course/${module.course?.id}`}
                                                className="btn btn-black mr-2"
                                            >
                                                <i className="fas fa-long-arrow-alt-left"></i> Back to Course Infomation
                                            </Link>
                                        </div>
                                    </form>
                                </div> {/* end card-box*/}
                            </div> {/* end col*/}
                        </div>
                        {/* end row*/}
                    </div> {/* container */}
                    {showEditClassModuleModal && (
                        <div className="modal" tabIndex="-1" role="dialog" style={{ display: 'block', backgroundColor: 'rgba(29, 29, 29, 0.75)' }}>
                            <div className="modal-dialog modal-lg" role="document">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h5 className="modal-title">Edit Module</h5>
                                        <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={closeEditCourseModal}>
                                            <span aria-hidden="true">&times;</span>
                                        </button>
                                    </div>
                                    {/* Conditional rendering based on edit mode */}
                                    <>
                                        <form onSubmit={(e) => submitClassLesson(e)}>
                                            <div className="modal-body" style={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}> {/* Added style for scrolling */}

                                                <div className="table-responsive">
                                                    <table className="table table-hover mt-3">
                                                        <tbody>
                                                            <tr>
                                                                <th style={{ width: '30%' }}>Class Url * :</th>
                                                                <td>
                                                                    <input
                                                                        type="text"
                                                                        className="form-control"
                                                                        name="classUrl"
                                                                        id="classUrl"
                                                                        value={classLesson.classUrl}
                                                                        onChange={handleClassLessonChange} // Pass the function directly
                                                                        required
                                                                        style={{ borderRadius: '50px', padding: `8px 25px` }}
                                                                    />
                                                                </td>
                                                            </tr>

                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                            <div className="modal-footer">
                                                <button type="submit" className="btn btn-success" style={{ borderRadius: '50px', padding: `8px 25px` }}>Save Changes</button>

                                                <button type="button" className="btn btn-dark" onClick={closeEditCourseModal} style={{ borderRadius: '50px', padding: `8px 25px` }}>Close</button>
                                            </div>
                                        </form>
                                    </>


                                </div>
                            </div>
                        </div>
                    )}
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

export default EditClassModule;
