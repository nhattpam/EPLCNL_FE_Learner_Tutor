import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from "react-router-dom";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Import the styles
import Header from '../../Header';
import Sidebar from '../../Sidebar';
import Footer from '../../Footer';
import moduleService from '../../../../services/module.service';
import assignmentService from '../../../../services/assignment.service';

const CreateAssignment = () => {
    const navigate = useNavigate();
    const [errors, setErrors] = useState({});
    const [msg, setMsg] = useState('');
    const { storedModuleId } = useParams();

    useEffect(() => {
        if (storedModuleId) {
            moduleService
                .getModuleById(storedModuleId)
                .then((res) => {
                    setModule(res.data);
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    }, [storedModuleId]);

    const [module, setModule] = useState({
        name: "",
    });

    //tao assignment
    const [assignment, setAssignment] = useState({
        questionText: "",
        moduleId: storedModuleId
    });

    const handleChange = (e) => {
        const value = e.target.value;
        setModule({ ...module, [e.target.name]: value });
    }
    const handleChangeAssignment = (value) => {
        setAssignment({ ...assignment, questionText: value });
    };

    const validateForm = () => {
        let isValid = true;
        const errors = {};
    
        if (assignment.questionText.trim() === '') {
          errors.questionText = 'Question is required';
          isValid = false;
        }
    
    
        setErrors(errors);
        return isValid;
      };
    
    
      const submitAssignment = async (e) => {
        e.preventDefault();
    
        if (validateForm()) {
          try {
            // Save account
            console.log(JSON.stringify(assignment))
            const assignmentResponse = await assignmentService.saveAssignment(assignment);
            console.log(assignmentResponse.data);
    
            setMsg('Assignment Added Successfully');
    
            const assignmentJson = JSON.stringify(assignmentResponse.data);
    
            const assignmentJsonParse = JSON.parse(assignmentJson);
    
            
          } catch (error) {
            console.log(error);
          }
        }
      };
    




    const handleSubmit = (event) => {
        event.preventDefault();
        // Add your form submission logic here if needed
        navigate('/tutor/courses/create/create-video-course/create-lesson');
    };

    return (
        <>
            <div id="wrapper">
                <Header />
                <Sidebar />
                <div className="content-page">
                    <div className="content">
                        {/* Start Content*/}
                        <div className="container-fluid">
                            {/* start page title */}
                            <div className="row">
                                <div className="col-12">
                                    <div className="card">
                                        <div className="card-body">
                                            <h4 className="header-title">Create a Video course: Course ABC | Module {module.name} </h4>

                                            <form
                                                method="post"
                                                className="dropzone"
                                                id="myAwesomeDropzone"
                                                data-plugin="dropzone"
                                                data-previews-container="#file-previews"
                                                data-upload-preview-template="#uploadPreviewTemplate"
                                                data-parsley-validate
                                                onSubmit={(e) => submitAssignment(e)}>
                                                <div className="card">
                                                    <div className='card-body'>
                                                        <label htmlFor="video">Question * :</label>
                                                        <ReactQuill
                                                            value={assignment.questionText}
                                                            onChange={handleChangeAssignment}
                                                            style={{ height: '300px' }}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="form-group mb-0  ">
                                                    <button type="submit" className="btn btn-primary " style={{ marginLeft: '23px', marginTop: '10px' }} >
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

export default CreateAssignment;
