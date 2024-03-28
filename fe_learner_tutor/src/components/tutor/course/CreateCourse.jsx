import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../Footer';
import Header from '../Header';
import Sidebar from '../Sidebar';

const CreateCourse = () => {
    const [courseType, setCourseType] = useState('');
    const navigate = useNavigate();

    const handleCourseTypeChange = (type) => {
        setCourseType(type);
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        if (courseType === 'video-course') {
            navigate("/tutor/courses/create/create-video-course");
        } else if (courseType === 'class-course') {
            navigate("/tutor/courses/create/create-class-course");
        }
    };

    return (
        <>
            <div id="wrapper">
                <Header />
                <Sidebar />

                <div className="content-page">
                    <div className="content">
                        <div className="container-fluid">
                            <div className="row">
                                <div className="col-12">
                                    <div className="card-box">
                                        <h1>Create a New Course</h1>
                                        <form onSubmit={handleSubmit}>
                                            <div className="row" >
                                                {['video-course', 'class-course'].map((type) => (
                                                    <div key={type} className="col-md-6 mt-4" >
                                                        <div
                                                            className={`card cursor-pointer ${courseType === type ? 'selected' : ''}`} style={{ borderRadius: '50px', padding: `8px 25px` }}
                                                            onClick={() => handleCourseTypeChange(type)}
                                                        >
                                                            <div className="card-body text-center" >
                                                                <i className={`fas ${type === 'video-course' ? 'fa-video' : 'fa-chalkboard-teacher'} fa-3x mb-2`}></i>
                                                                <h5 className="card-title">{type === 'video-course' ? 'Video Course' : 'Class Course'}</h5>
                                                                <p className="card-text">{`Create a course with ${type === 'video-course' ? 'video' : 'class'} content.`}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="mt-3">
                                                <button type="submit" className="btn btn-success" style={{ borderRadius: '50px', padding: `8px 25px` }}>Continue</button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            <style>
                {`
                    .card.cursor-pointer:hover {
                        background-color: #f8f9fa;
                        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                    }

                    .card.selected {
                        background-color: #e2e6ea;
                        border: 2px solid #e2e6ea;
                    }
                `}
            </style>
        </>
    );
};

export default CreateCourse;
