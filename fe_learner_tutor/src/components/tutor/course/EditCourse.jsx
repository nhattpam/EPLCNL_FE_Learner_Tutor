import React, { useEffect, useState } from 'react';
import Header from '../Header';
import Sidebar from '../Sidebar';
import Footer from '../Footer';
import { useNavigate, useParams } from 'react-router-dom';
import courseService from '../../../services/course.service';

const EditCourse = () => {

    const [course, setCourse] = useState({
        name: "",
        description: "",
        code: "",
        imageUrl: "",
        stockPrice: "",
        rating: "",
        categoryId: "",
        tags: "",
        createdDate: "",
        updatedDate: "",
        modules: [],
        classModules: []
    });


    const [errors, setErrors] = useState({});
    const [msg, setMsg] = useState('');
    const navigate = useNavigate();

    const { courseId } = useParams();

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


    const handleEditModule = (moduleId) => {
        // Add logic to navigate to the module edit page with the moduleId
        navigate(`/tutor/courses/edit-module/${moduleId}`);
    };


    const handleEditClassModule = (moduleId) => {
        // Add logic to navigate to the module edit page with the moduleId
        navigate(`/tutor/courses/edit-class-module/${moduleId}`);
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
                                    <h4 className="header-title">Course Information</h4>

                                    <form id="demo-form" data-parsley-validate>
                                        <div className="form-group">
                                            <label htmlFor="name">Course Name * :</label>
                                            <input type="text" className="form-control" name="name" id="name" value={course.name} readOnly />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="code">Code * :</label>
                                            <input type="text" id="code" className="form-control" name="code" data-parsley-trigger="change" value={course.code} readOnly />
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="stockPrice">Price * :</label>
                                            <input type="number" id="stockPrice" className="form-control" name="stockPrice" data-parsley-trigger="change" value={course.stockPrice} readOnly />
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="tags">Tags * :</label>
                                            <input type="text" id="tags" className="form-control" name="tags" data-parsley-trigger="change" value={course.tags} readOnly />
                                        </div>

                                        <div className="form-group">
                                            <label>Modules:</label>
                                            <ul className="list-group">
                                                {course.modules.map((module) => (
                                                    <li key={module.id} className="list-group-item d-flex justify-content-between align-items-center">
                                                        {module.name}
                                                        <button
                                                            type="button"
                                                            className="btn btn-secondary btn-sm"
                                                            onClick={() => handleEditModule(module.id)}
                                                        >
                                                            Edit
                                                        </button>
                                                    </li>
                                                ))}

                                                {course.classModules.map((module) => (
                                                    <li key={module.id} className="list-group-item d-flex justify-content-between align-items-center">
                                                        {module.startDate}
                                                        <button
                                                            type="button"
                                                            className="btn btn-secondary btn-sm"
                                                            onClick={() => handleEditClassModule(module.id)}
                                                        >
                                                            Edit
                                                        </button>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>


                                        <div className="form-group mb-0">
                                            <button
                                                type="submit"
                                                className="btn btn-danger"
                                            >
                                                <i className="bi bi-x-lg"></i> Request to delete
                                            </button>



                                        </div>
                                    </form>
                                </div> {/* end card-box*/}
                            </div> {/* end col*/}
                        </div>
                        {/* end row*/}

                    </div> {/* container */}
                </div>
                <Footer />
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
    )
}

export default EditCourse;
