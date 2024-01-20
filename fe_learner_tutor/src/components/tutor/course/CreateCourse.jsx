import React, { useState } from 'react';
import Footer from '../Footer';
import Header from '../Header';
import Sidebar from '../Sidebar';
import { useNavigate, useParams } from 'react-router-dom';


const CreateCourse = () => {
    const [courseType, setCourseType] = useState('');
    const navigate = useNavigate();


    const handleCourseTypeChange = (type) => {
        setCourseType(type);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        // Handle the selected course type (video course or class course)
        console.log('Selected course type:', courseType);
        // Add your logic to handle the selected course type here
        if (courseType === 'video-course') {
            // Handle video course logic
            navigate("/tutor/courses/create/create-video-course");

        } else if (courseType === 'class-course') {
            // Handle class course logic
            navigate("/tutor/courses/create/create-class-course");
        }
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

                            {/* end page title */}
                            <div className="row">
                                <div className="col-12">
                                    <div className="card-box">
                                        <h1>Create a New Course</h1>
                                        <form onSubmit={handleSubmit}>
                                            <div className="row">
                                                <div className="col-md-6">
                                                    <div
                                                        className={`card cursor-pointer ${courseType === 'video-course' ? 'selected' : ''}`}
                                                        onClick={() => handleCourseTypeChange('video-course')}
                                                    >
                                                        <div className="card-body text-center">
                                                            <i className="fas fa-video fa-3x mb-2"></i>
                                                            <h5 className="card-title">Video Course</h5>
                                                            <p className="card-text">Create a course with video content.</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div
                                                        className={`card cursor-pointer ${courseType === 'class-course' ? 'selected' : ''}`}
                                                        onClick={() => handleCourseTypeChange('class-course')}
                                                    >
                                                        <div className="card-body text-center">
                                                            <i className="fas fa-chalkboard-teacher fa-3x mb-2"></i>
                                                            <h5 className="card-title">Class Course</h5>
                                                            <p className="card-text">Create a course with class content.</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="mt-3">
                                                <button type="submit" className="btn btn-primary">Continue</button>
                                            </div>
                                        </form>
                                    </div> {/* end card-box */}
                                </div> {/* end col */}
                            </div>
                            {/* end row */}
                        </div> {/* container */}
                    </div> {/* content */}
                </div>
                {/* ============================================================== */}
                {/* End Page content */}
                {/* ============================================================== */}
                <Footer />
            </div>


            //Hover when move mouse
            <style>
                {`
                  .card.cursor-pointer:hover {
                   background-color: #f8f9fa; /* Change this to your desired hover background color */
                      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); /* Change this to your desired box shadow */
                     }
                `}
            </style>


        </>
    )
}

export default CreateCourse;
