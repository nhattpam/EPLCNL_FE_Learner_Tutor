import React, { useState } from 'react';
import Footer from '../Footer';
import Header from '../Header';
import Sidebar from '../Sidebar';
import { Link, useNavigate } from "react-router-dom";

const CreateClassCourse = () => {

    const navigate = useNavigate();


    const [formData, setFormData] = useState({
        image: '',
        price: '',
        fullname: '',
        tags: '',
        description: ''

    });


    const handleContinue = (event) => {
        event.preventDefault();
        // Perform any necessary form validation or processing here

        navigate("/tutor/courses/create/create-class-course/create-class-module")

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
                                        <div className="card-body">
                                            <h4 className="header-title">Create a Class course</h4>

                                            {/* Combined Form and Image Upload */}
                                                <form
                                                    method="post"
                                                    className="dropzone"
                                                    id="myAwesomeDropzone"
                                                    data-plugin="dropzone"
                                                    data-previews-container="#file-previews"
                                                    data-upload-preview-template="#uploadPreviewTemplate"
                                                    data-parsley-validate
                                                    onSubmit={handleContinue}
                                                >
                                                    <label htmlFor="image">Image * :</label>
                                                    <div className="fallback">
                                                        <input name="file" type="file" multiple />
                                                    </div>
                                                    <div className="dz-message needsclick">
                                                        <i className="h1 text-muted dripicons-cloud-upload" />
                                                        <h3>Drop files here or click to upload.</h3>
                                                    </div>
                                                    {/* Preview */}
                                                    <div className="dropzone-previews mt-3" id="file-previews" />
                                                    {/* Your existing form fields */}
                                                    <h4 className="header-title mt-4">Information</h4>
                                                    <div className="form-group">
                                                        <label htmlFor="fullname">Course name * :</label>
                                                        <input type="text" className="form-control" name="fullname" id="fullname" />
                                                    </div>
                                                    <div class="form-group">
                                                        <label for="category">Category *:</label>
                                                        <select id="category" class="form-control" required="">
                                                            <option value="">Choose..</option>
                                                            <option value="press">Ielts</option>
                                                            <option value="net">Toefl</option>
                                                            <option value="mouth">Toeic</option>
                                                        </select>
                                                    </div>
                                                    <div className="form-group">
                                                        <label htmlFor="price">Price * :</label>
                                                        <input type="number" id="price" className="form-control" name="price" data-parsley-trigger="change" />
                                                    </div>
                                                    <div className="form-group">
                                                        <label htmlFor="tags">Tags * :</label>
                                                        <input type="text" id="tags" className="form-control" name="tags" data-parsley-trigger="change" />
                                                    </div>

                                                    <div className="form-group">
                                                        <label htmlFor="message">Description * :</label>
                                                        <textarea
                                                            id="message"
                                                            className="form-control"
                                                            name="message"
                                                            data-parsley-trigger="keyup"
                                                            data-parsley-minlength={20}
                                                            data-parsley-maxlength={100}
                                                            data-parsley-minlength-message="Come on! You need to enter at least a 20 character comment.."
                                                            data-parsley-validation-threshold={10}
                                                            defaultValue={''}
                                                        />
                                                    </div>
                                                    <div className="form-group mb-0">
                                                        <button type="submit" className="btn btn-primary" >
                                                            Continue
                                                        </button>

                                                    </div>
                                                </form>


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
                    width: 85%;
                    text-align: left;
                }
            `}
            </style>
        </>
    );
};

export default CreateClassCourse;
