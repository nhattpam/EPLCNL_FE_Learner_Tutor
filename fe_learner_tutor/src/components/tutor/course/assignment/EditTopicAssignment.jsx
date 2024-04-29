import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from "react-router-dom";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Import the styles
import Header from '../../Header';
import Sidebar from '../../Sidebar';
import Footer from '../../Footer';
import moduleService from '../../../../services/module.service';
import assignmentService from '../../../../services/assignment.service';
import topicService from '../../../../services/topic.service';
import questionService from '../../../../services/question.service';
import Dropzone from 'react-dropzone';

const EditTopicAssignment = () => {
    const navigate = useNavigate();
    const [errors, setErrors] = useState({});
    const [msg, setMsg] = useState('');
    // const { storedModuleId } = useParams();
    const { assignmentId } = useParams();

    const storedLoginStatus = sessionStorage.getItem('isLoggedIn');

   
    if (!storedLoginStatus) {
        navigate(`/login`)
    }

    //LOADING
    const [loading, setLoading] = useState(true); // State to track loading

    //LOADING


    //tao assignment
    const [assignment, setAssignment] = useState({
        gradeToPass: "",
        questionText: "",
        questionAudioUrl: "",
        deadline: "", // set a default value for minutes
        topicId: "",
        topic: [],
        isActive: false
    });

    useEffect(() => {
        if (assignmentId) {
            assignmentService
                .getAssignmentById(assignmentId)
                .then((res) => {
                    setAssignment(res.data);
                    setLoading(false);

                })
                .catch((error) => {
                    console.log(error);
                    setLoading(false);

                });
        }
    }, [assignmentId]);


    useEffect(() => {
        topicService
            .getClassTopicById(assignment.topicId)
            .then((res) => {
                setTopic(res.data);
            })
            .catch((error) => {
                console.log(error);
            });
    }, [assignment.topicId]);



    const [topic, setTopic] = useState({
        name: "",
    });


    const handleChange = (e) => {
        const value = e.target.value;
        setTopic({ ...topic, [e.target.name]: value });
    }
    const handleChangeAssignment = (value) => {
        setAssignment({ ...assignment, questionText: value });
    };

    const [file2, setFile2] = useState(null);

    const handleFileDrop2 = (acceptedFiles) => {
        if (acceptedFiles && acceptedFiles.length > 0) {
            const currentFile2 = acceptedFiles[0];

            // Log the audio file details
            console.log("Audio File: ", currentFile2);

            setFile2(currentFile2);

            // Set the audio preview URL
            setAssignment({ ...assignment, questionAudioUrl: URL.createObjectURL(currentFile2) });
        }
    };

    const validateForm = () => {
        let isValid = true;
        const errors = {};

        if (assignment.questionText.trim() === '') {
            errors.questionText = 'Question is required';
            isValid = false;
        }
        if (!assignment.deadline) {
            errors.deadline = 'Time is required';
            isValid = false;
        }

        setErrors(errors);
        return isValid;
    };


    const submitAssignment = async (e) => {
        e.preventDefault();

        let questionAudioUrl = assignment.questionAudioUrl;

        if (file2) {
            const audioData = new FormData();
            audioData.append('file', file2);
            const audioResponse = await questionService.uploadAudio(audioData);
            questionAudioUrl = audioResponse.data;
        }

        assignment.isActive = true;
        const assignmentData = { ...assignment, questionAudioUrl };

        if (validateForm()) {
            try {
                // Save account
                console.log(JSON.stringify(assignmentData))
                const assignmentResponse = await assignmentService.updateAssignment(assignment.id, assignmentData);
                console.log(assignmentResponse.data);

                const assignmentJson = JSON.stringify(assignmentResponse.data);

                const assignmentJsonParse = JSON.parse(assignmentJson);

                window.alert("Update Assignment Successfully!");
                window.location.reload();

            } catch (error) {
                console.log(error);
            }
        }
    };


    const handleMinutesChange = (e) => {
        const minutes = parseInt(e.target.value, 10);
        setAssignment({ ...assignment, deadline: minutes });
    };

    //DEACTIVATE
    const handleDeactivate = async () => {
        assignment.isActive = false;
        // Save account
        const assignmentResponse = await assignmentService.updateAssignment(assignment.id, assignment);

        window.alert("Deactivate Assignment Successfully!")
        window.location.reload();
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
                                            <h4 className="header-title">EDITTING ASSIGNMENT...
                                                {assignment.isActive ? (
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
                                            <form
                                                method="post"
                                                id="myAwesomeDropzone"
                                                data-plugin="dropzone"
                                                data-previews-container="#file-previews"
                                                data-upload-preview-template="#uploadPreviewTemplate"
                                                data-parsley-validate
                                                onSubmit={submitAssignment} >
                                                <div className="card" style={{}}>
                                                    <div className="card-body">
                                                        <label htmlFor="video">Grade To Pass * :</label>
                                                        <select
                                                            value={assignment.gradeToPass}
                                                            onChange={(e) => setAssignment({ ...assignment, gradeToPass: e.target.value })} className="form-control"
                                                            required
                                                            style={{ borderRadius: '50px', padding: `8px 25px` }}

                                                        >
                                                            <option value={1}>
                                                                1
                                                            </option>
                                                            <option value={2}>
                                                                2
                                                            </option>
                                                            <option value={3}>
                                                                3
                                                            </option>
                                                            <option value={4}>
                                                                4
                                                            </option>
                                                            <option value={5}>
                                                                5
                                                            </option>
                                                            <option value={6}>
                                                                6
                                                            </option>
                                                            <option value={7}>
                                                                7
                                                            </option>
                                                            <option value={8}>
                                                                8
                                                            </option>
                                                            <option value={9}>
                                                                9
                                                            </option>
                                                            <option value={10}>
                                                                10
                                                            </option>
                                                        </select>
                                                    </div>
                                                    <div className='card-body'>
                                                        <label htmlFor="video">Time * :</label>
                                                        <select
                                                            value={assignment.deadline}
                                                            onChange={handleMinutesChange}
                                                            className="form-control"
                                                            style={{ borderRadius: '50px', padding: `8px 25px` }}
                                                        >
                                                            {[1, 5, 10, 15, 20, 30, 45, 60, 75, 90, 120].map((minutes) => (
                                                                <option key={minutes} value={minutes}>
                                                                    {minutes} minutes
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                    {assignment.questionText !== "" && (
                                                        <div className='card-body'>
                                                            <label htmlFor="video">Question Text :</label>
                                                            <ReactQuill
                                                                value={assignment.questionText}
                                                                onChange={handleChangeAssignment}
                                                                style={{ height: '300px' }}
                                                                modules={{
                                                                    toolbar: [
                                                                        [{ header: [1, 2, false] }],
                                                                        ['bold', 'italic', 'underline', 'strike'],
                                                                        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                                                                        [{ 'indent': '-1' }, { 'indent': '+1' }],
                                                                        [{ 'direction': 'rtl' }],
                                                                        [{ 'align': [] }],
                                                                        ['link', 'image', 'video'],
                                                                        ['code-block'],
                                                                        [{ 'color': [] }, { 'background': [] }],
                                                                        ['clean']
                                                                    ]
                                                                }}
                                                                theme="snow"
                                                            />
                                                        </div>
                                                    )}

                                                    {assignment.questionAudioUrl !== "" && (
                                                        <div className='card-body mt-3'>
                                                            <label htmlFor="video">Question Audio :</label>
                                                            <div>
                                                                <audio controls>
                                                                    <source src={assignment?.questionAudioUrl} type="audio/mpeg" />
                                                                    Your browser does not support the audio element.
                                                                </audio>
                                                                <Dropzone
                                                                    onDrop={handleFileDrop2}
                                                                    accept="audio/*"
                                                                    multiple={false}
                                                                    maxSize={5000000}
                                                                >
                                                                    {({ getRootProps, getInputProps }) => (
                                                                        <div {...getRootProps()} className="fallback">
                                                                            <input {...getInputProps()} />
                                                                            <div className="dz-message needsclick">
                                                                                <i className="h1 text-muted dripicons-cloud-upload" />
                                                                                <h3>Drop files here or click to upload.</h3>
                                                                            </div>
                                                                            {file2 && (
                                                                                <div>
                                                                                    <audio controls style={{ marginTop: "10px" }}>
                                                                                        <source src={URL.createObjectURL(file2)} type="audio/*" />
                                                                                        Your browser does not support the audio tag.
                                                                                    </audio>
                                                                                    <p>Audio Preview:</p>
                                                                                    <audio controls src={URL.createObjectURL(file2)} />
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    )}
                                                                </Dropzone>
                                                            </div>

                                                        </div>
                                                    )}
                                                    {assignment.questionAudioUrl === "" && (
                                                        <div className='card-body mt-3'>
                                                            <label htmlFor="video">Question Audio :</label>
                                                            <Dropzone
                                                                onDrop={handleFileDrop2}
                                                                accept="audio/*"
                                                                multiple={false}
                                                                maxSize={5000000}
                                                            >
                                                                {({ getRootProps, getInputProps }) => (
                                                                    <div {...getRootProps()} className="fallback">
                                                                        <input {...getInputProps()} />
                                                                        <div className="dz-message needsclick">
                                                                            <i className="h1 text-muted dripicons-cloud-upload" />
                                                                            <h3>Drop files here or click to upload.</h3>
                                                                        </div>

                                                                    </div>
                                                                )}
                                                            </Dropzone>
                                                        </div>

                                                    )}


                                                </div>
                                                <div className="form-group mb-0  ">
                                                    <button type="submit" className="btn btn-success " style={{ marginLeft: '23px', marginTop: '10px', borderRadius: '50px', padding: `8px 25px` }} >
                                                        Update
                                                    </button>
                                                    <button
                                                        type="button" onClick={handleDeactivate}
                                                        className="btn btn-danger ml-2 mt-2"
                                                        style={{ borderRadius: '50px', padding: `8px 25px` }}
                                                    >
                                                        Deactivate
                                                    </button>
                                                    <Link
                                                        type="button"
                                                        className="btn btn-black mr-2 mt-2"
                                                        to={`/tutor/courses/edit-topic/${assignment.topicId}`}
                                                    >
                                                        <i class="fas fa-long-arrow-alt-left"></i> Back to Topic Infomation
                                                    </Link>
                                                </div>

                                            </form>
                                        </div>
                                    </div>

                                </div>

                            </div>

                        </div>
                    </div>
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
};

export default EditTopicAssignment;
