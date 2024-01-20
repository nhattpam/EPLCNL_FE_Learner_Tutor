import React, { useState } from 'react';

import { Link, useNavigate } from "react-router-dom";
import Header from '../../Header';
import Sidebar from '../../Sidebar';
import Footer from '../../Footer';

const CreateAssignment = () => {

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
                            <div>
                                <div className="row">
                                    <div className="col-12">
                                        <div className="card">
                                            <div className="card-body">
                                                Text Editor
                                                <input type="text" name="document"/>
                                            </div> {/* end card-body*/}
                                        </div> {/* end card*/}
                                    </div>{/* end col */}
                                </div>
                                {/* end row */}

                           
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

export default CreateAssignment;
