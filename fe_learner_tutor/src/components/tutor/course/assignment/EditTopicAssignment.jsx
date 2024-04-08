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

const EditTopicAssignment = () => {
    const navigate = useNavigate();
    const [errors, setErrors] = useState({});
    const [msg, setMsg] = useState('');
    // const { storedModuleId } = useParams();
    const { assignmentId } = useParams();

    //tao assignment
    const [assignment, setAssignment] = useState({
        gradeToPass: "",
        questionText: "",
        deadline: "", // set a default value for minutes
        topicId: "",
        topic: []
    });

    useEffect(() => {
        if (assignmentId) {
            assignmentService
                .getAssignmentById(assignmentId)
                .then((res) => {
                    setAssignment(res.data);
                })
                .catch((error) => {
                    console.log(error);
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


    const handleMinutesChange = (e) => {
        const minutes = parseInt(e.target.value, 10);
        setAssignment({ ...assignment, deadline: minutes });
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
                                            <h4 className="header-title">EDITTING ASSIGNMENT... </h4>

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
                                                            <label htmlFor="video">Question * :</label>
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
                                                            <label htmlFor="video">Question Audio* :</label>
                                                            <div>
                                                                <audio controls>
                                                                    <source src={assignment?.questionAudioUrl} type="audio/mpeg" />
                                                                    Your browser does not support the audio element.
                                                                </audio>
                                                            </div>

                                                        </div>
                                                    )}

                                                </div>
                                                <div className="form-group mb-0  ">
                                                    <button type="submit" className="btn btn-success " style={{ marginLeft: '23px', marginTop: '10px', borderRadius: '50px', padding: `8px 25px` }} >
                                                        Update
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
            `}
            </style>
        </>
    );
};

export default EditTopicAssignment;
