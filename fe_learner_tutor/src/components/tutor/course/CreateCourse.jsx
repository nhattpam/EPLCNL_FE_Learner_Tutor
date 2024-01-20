import React, { useState } from 'react';
import Footer from '../Footer';
import Header from '../Header';
import Sidebar from '../Sidebar';
import { Link } from 'react-router-dom';

const CreateCourse = () => {
    const [courseType, setCourseType] = useState('');

    const handleCourseTypeChange = (event) => {
        setCourseType(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        // Handle the selected course type (online course or online class)
        console.log('Selected course type:', courseType);
        // Add your logic to handle the selected course type here
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
                                            <div>
                                                <label>
                                                    What type of course do you want to create:
                                                </label>
                                            </div>
                                            <div>
                                                <label>
                                                    <input
                                                        type="radio"
                                                        value="online-course"
                                                        checked={courseType === 'online-course'}
                                                        onChange={handleCourseTypeChange}
                                                    />
                                                    Online Course
                                                </label>
                                            </div>
                                            <div>
                                                <label>
                                                    <input
                                                        type="radio"
                                                        value="online-class"
                                                        checked={courseType === 'online-class'}
                                                        onChange={handleCourseTypeChange}
                                                    />
                                                    Online Class
                                                </label>
                                            </div>
                                            <div>
                                                <button type="submit">Submit</button>
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
        </>
    )
}

export default CreateCourse