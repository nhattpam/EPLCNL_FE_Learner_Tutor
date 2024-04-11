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
    });


    const [errors, setErrors] = useState({});
    const [searchTerm, setSearchTerm] = useState('');
    const [classTopicList, setClassTopicList] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [classTopicsPerPage] = useState(2);
    const [msg, setMsg] = useState('');
    const navigate = useNavigate();
    const { moduleId } = useParams();


    useEffect(() => {
        if (moduleId) {
            classModuleService
                .getModuleById(moduleId)
                .then((res) => {
                    setModule(res.data);
                    // console.log(module)
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    }, [moduleId]);

    useEffect(() => {
        classLessonService
            .getAllClassTopicsByClassLesson(module.classLesson?.id)
            .then((res) => {
                // console.log(res.data);
                setClassTopicList(res.data);

            })
            .catch((error) => {
                console.log(error);
            });
    }, [module.classLesson?.id]);


    const goBack = () => {
        navigate(-1); // Go back one step in history
    };

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
            errors.classUrl = 'Room Link is required';
            isValid = false;
        }

        setErrors(errors);
        return isValid;
    };


    const submitClassLesson = async (e) => {
        e.preventDefault();


        classLessonService
            .updateClassLesson(classLesson.id, classLesson)
            .then((res) => {
                window.alert("Update Class Successfully!");
                window.location.reload();

            })
            .catch((error) => {
                console.log(error);
            });

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
                                        | CLASS INFORMATION &nbsp;<i class="fa-solid fa-pen-to-square" onClick={openEditClassModuleModal}></i></h4>

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
                                                                    <td>{classTopic.createdDate}</td>
                                                                    <td>{classTopic.updatedDate}</td>
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
                                                                <th style={{ width: '30%' }}>Room Link * :</th>
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
                `}
            </style>
        </>
    );
}

export default EditClassModule;
