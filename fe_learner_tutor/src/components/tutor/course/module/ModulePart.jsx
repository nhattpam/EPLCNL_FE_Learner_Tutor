import React, { useState } from 'react';

import { Link, useNavigate } from "react-router-dom";
import Header from '../../Header';
import Sidebar from '../../Sidebar';
import Footer from '../../Footer';

const ModulePart = () => {

    const navigate = useNavigate();


    const [formData, setFormData] = useState({
        image: '',
        price: '',
        fullname: '',
        tags: '',
        description: ''

    });


    const handleSubmit = (event) => {
        event.preventDefault();
        navigate("/tutor/courses/create/create-video-course/create-lesson")

    };

    return (
        <>
            <div id="wrapper">
                <Header />
                <Sidebar />
                {/* ============================================================== */}
                {/* Start Page Content here */}
                {/* ============================================================== */}
                <div className="content-page">
                    <div className="content">
                        {/* Start Content*/}
                        <div className="container-fluid">
                            {/* start page title */}
                            <div className="row">
                                <div className="col-12">
                                    <div className="card">
                                        <div className='card-body'>
                                            <h4 className="header-title">Create a Video course: Course ABC</h4>
                                            <h4>Lesson</h4>
                                            {/* ... (Add fields for lesson) */}
                                            <div className="form-group mb-0">
                                                <button
                                                    type="button"
                                                    className="btn btn-primary"
                                                    onClick={() =>
                                                        navigate("/tutor/courses/create/create-video-course/create-lesson")

                                                    }
                                                >
                                                    Add Lesson
                                                </button>
                                            </div>

                                            <h4>Quiz</h4>
                                            {/* ... (Add fields for quiz) */}
                                            <div className="form-group mb-0">
                                                <button
                                                    type="button"
                                                    className="btn btn-primary"
                                                    onClick={() =>
                                                        navigate("/tutor/courses/create/create-video-course/create-quiz")

                                                    }
                                                >
                                                    Add Quiz
                                                </button>
                                            </div>

                                            <h4>Assignment</h4>
                                            {/* ... (Add fields for assignment) */}
                                            <div className="form-group mb-0">
                                                <button
                                                    type="button"
                                                    className="btn btn-primary"
                                                    onClick={() =>
                                                        navigate("/tutor/courses/create/create-video-course/create-assignment")
                                                    }
                                                >
                                                    Add Assignment
                                                </button>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* ============================================================== */}
                {/* End Page content */}
                {/* ============================================================== */}
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
                    width: 100%;
                    text-align: left;
                }
            `}
            </style>
        </>
    );
};

export default ModulePart;
