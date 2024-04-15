import React, { useEffect, useState } from 'react';

import { Link, useNavigate, useParams } from 'react-router-dom';
import assignmentAttemptService from '../../../../services/assignment-attempt.service';
import Header from '../../Header';
import Sidebar from '../../Sidebar';
import accountService from '../../../../services/account.service';
import learnerService from '../../../../services/learner.service';
import assignmentService from '../../../../services/assignment.service';
import ReactQuill from 'react-quill';

const EditAssignmentAttempt = () => {

    const tutorId = localStorage.getItem("tutorId");

    const [errors, setErrors] = useState({});
    const [msg, setMsg] = useState('');
    const navigate = useNavigate();


    const { assignmentAttemptId } = useParams();

    const [assignmentAttempt, setAssignmentAttempt] = useState({
        id: assignmentAttemptId,
        assignmentId: "",
        learnerId: "",
        answerText: "",
        attemptedDate: "",
        totalGrade: "",
        assignment: []
    });

    const [updateAssignmentAttempt, setUpdateAssignmentAttempt] = useState({
        assignmentId: assignmentAttempt.assignment?.id,
        learnerId: assignmentAttempt.learnerId,
        answerText: assignmentAttempt.answerText,
        attemptedDate: assignmentAttempt.attemptedDate,
        totalGrade: assignmentAttempt.totalGrade,
    });

    const [account, setAccount] = useState({
        fullName: "",
    });

    const [assignment, setAssignment] = useState({
        questionText: "",
    });

    const handleChangeAnswerText = (value) => {
        setAssignmentAttempt(prevState => ({
            ...prevState,
            answerText: value
        }));
    };



    useEffect(() => {
        if (assignmentAttemptId) {
            assignmentAttemptService
                .getAssignmentAttemptById(assignmentAttemptId)
                .then((res) => {
                    setAssignmentAttempt(res.data);
                    // Assuming learnerId is directly under res.data
                    const learnerId = res.data.learnerId;
                    const assignmentId = res.data.assignmentId;
                    // Perform further operations with learnerId
                    learnerService.getLearnerById(learnerId)
                        .then((res) => {
                            // Assuming you intended to use learnerId here
                            accountService.getAccountById(res.data.accountId)
                                .then((res) => {
                                    setAccount(res.data)
                                })
                        })
                        .catch((error) => {
                            console.log(error);
                        });
                    assignmentService.getAssignmentById(assignmentId)
                        .then((res) => {
                            setAssignment(res.data)
                        })

                })
                .catch((error) => {
                    console.log(error);
                });
        }
    }, [assignmentAttemptId]);


    const getGradeColor = (grade) => {
        if (grade >= 1 && grade <= 4) {
            return "red";
        } else if (grade >= 5 && grade <= 7) {
            return "yellow";
        } else if (grade >= 8 && grade <= 10) {
            return "green";
        }
    };


    const handleGradeChange = (value) => {
        setAssignmentAttempt(prevState => ({
            ...prevState,
            totalGrade: value
        }));
    };



    useEffect(() => {
        setUpdateAssignmentAttempt({
            assignmentId: assignmentAttempt.assignmentId,
            learnerId: assignmentAttempt.learnerId,
            answerText: assignmentAttempt.answerText,
            attemptedDate: assignmentAttempt.attemptedDate,
            totalGrade: assignmentAttempt.totalGrade,
        });
    }, [assignmentAttempt]);

    const submitAssignmentAttempt = async (e) => {
        e.preventDefault();

        try {
            console.log("Updated Assignment Attempt: ", updateAssignmentAttempt);
            await assignmentAttemptService.updateAssignmentAttempt(assignmentAttemptId, updateAssignmentAttempt);
            navigate(`/list-assignment-attempt/${tutorId}`);
        } catch (error) {
            console.error("Error updating assignment attempt: ", error);
            // Handle error appropriately (e.g., show error message to user)
        }
    };


    //list peer review
    const [peerReviewLish, setPeerReviewList] = useState([]);
    useEffect(() => {
        if (assignmentAttemptId) {
            assignmentAttemptService
                .getAllPeerReviewByAssignmentAttemptId(assignmentAttemptId)
                .then((res) => {
                    setPeerReviewList(res.data);
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    }, [assignmentAttemptId]);



    return (
        <>
            <div id="wrapper">
                <Header />
                <Sidebar />
                <div className="content-page">
                    {/* Start Content*/}
                    <div className="container-fluid">
                        {
                            assignmentAttempt.assignment?.moduleId !== null && (
                                <>
                                    <div className="row">
                                        <div className="col-12">
                                            <div className="card-box">
                                                <form
                                                    method="post"
                                                    id="myAwesomeDropzone"
                                                    data-plugin="dropzone"
                                                    data-previews-container="#file-previews"
                                                    data-upload-preview-template="#uploadPreviewTemplate"
                                                    data-parsley-validate
                                                    onSubmit={(e) => submitAssignmentAttempt(e)}
                                                >
                                                    <div className="form-group">
                                                        <h4 className="header-title">ASSIGNMENT ATTEMPT INFORMATION</h4>
                                                        <div className="table-responsive">
                                                            <table id="demo-foo-filtering" className="table table-borderless table-hover table-wrap table-centered mb-0" data-page-size={7}>
                                                                <tbody>
                                                                    <tr>
                                                                        <th>Learner:</th>
                                                                        <td>{account.fullName}</td>
                                                                    </tr>
                                                                    <tr>
                                                                        <th>Assignment Question:</th>
                                                                        <td dangerouslySetInnerHTML={{ __html: assignment.questionText }} />
                                                                    </tr>
                                                                    <tr>
                                                                        <th>Answer:</th>

                                                                        <td>
                                                                            <div dangerouslySetInnerHTML={{ __html: assignmentAttempt.answerText }}></div>

                                                                        </td>

                                                                    </tr>
                                                                    <tr>
                                                                        <th>Attempted Date:</th>
                                                                        <td>{assignmentAttempt.attemptedDate}</td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    </div>


                                                    <div className="form-group ">
                                                        <h5>Grade:</h5>
                                                        <input
                                                            type="range"
                                                            min="0"
                                                            max="10"
                                                            step="1"
                                                            value={assignmentAttempt.totalGrade}
                                                            onChange={(e) => handleGradeChange(e.target.value)}
                                                            className={`form-control-range ${getGradeColor(assignmentAttempt.totalGrade)}`}
                                                        />
                                                        <span>{assignmentAttempt.totalGrade} Point</span>
                                                    </div>

                                                </form>

                                                <h5>Grade histories:</h5>
                                                <div className="table-responsive">
                                                    <table id="demo-foo-filtering" className="table table-borderless table-hover table-nowrap table-centered mb-0" data-page-size={7}>
                                                        <thead className="thead-light">
                                                            <tr>
                                                                <th data-toggle="true">Learner</th>
                                                                <th data-hide="phone, tablet">Grade</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {
                                                                peerReviewLish.length > 0 && peerReviewLish.map((peerReview) => (
                                                                    <tr key={peerReview.id}>
                                                                        <td>{peerReview.learner?.account?.fullName}</td>
                                                                        <td>{peerReview.grade}</td>

                                                                    </tr>
                                                                ))
                                                            }

                                                        </tbody>

                                                    </table>

                                                </div> {/* end .table-responsive*/}
                                                {peerReviewLish.length === 0 && (
                                                    <p className='text-center mt-3'>No one grades yet.</p>
                                                )}
                                            </div> {/* end card-box*/}


                                        </div> {/* end col*/}

                                    </div>
                                </>
                            )

                        }
                        {
                            assignmentAttempt.assignment?.topicId !== null && (
                                <>
                                    <div className="row">
                                        <div className="col-12">
                                            <div className="card-box">
                                                <form
                                                    method="post"
                                                    id="myAwesomeDropzone"
                                                    data-plugin="dropzone"
                                                    data-previews-container="#file-previews"
                                                    data-upload-preview-template="#uploadPreviewTemplate"
                                                    data-parsley-validate
                                                    onSubmit={(e) => submitAssignmentAttempt(e)}
                                                >
                                                    <div className="form-group">
                                                        <h4 className="header-title">ASSIGNMENT ATTEMPT INFORMATION</h4>
                                                        <div className="table-responsive">
                                                            <table id="demo-foo-filtering" className="table table-borderless table-hover table-wrap table-centered mb-0" data-page-size={7}>
                                                                <tbody>
                                                                    <tr>
                                                                        <th>Learner:</th>
                                                                        <td>{account.fullName}</td>
                                                                    </tr>
                                                                    <tr>
                                                                        <th>Assignment Question:</th>
                                                                        <td dangerouslySetInnerHTML={{ __html: assignment.questionText }} />
                                                                    </tr>
                                                                    <tr>
                                                                        <th>Attempted Date:</th>
                                                                        <td>{assignmentAttempt.attemptedDate}</td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    </div>
                                                    <div className="mb-5" style={{ textAlign: 'left' }}>
                                                        <ReactQuill
                                                            value={assignmentAttempt.answerText}
                                                            onChange={handleChangeAnswerText}
                                                            style={{ height: "300px" }}
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
                                                    <div className="form-group ">
                                                        <h5>Grade:</h5>
                                                        <input
                                                            type="range"
                                                            min="0"
                                                            max="10"
                                                            step="1"
                                                            value={assignmentAttempt.totalGrade}
                                                            onChange={(e) => handleGradeChange(e.target.value)}
                                                            className={`form-control-range ${getGradeColor(assignmentAttempt.totalGrade)}`}
                                                        />
                                                        <span>{assignmentAttempt.totalGrade} Point</span>
                                                    </div>
                                                    <div className="form-group mb-0">
                                                        <button
                                                            type="submit"
                                                            className="btn btn-success"
                                                            style={{ marginTop: '10px', borderRadius: '50px', padding: `8px 25px` }}
                                                        >
                                                            Save
                                                        </button>
                                                    </div>

                                                </form>

                                            </div> {/* end card-box*/}

                                        </div> {/* end col*/}

                                    </div>
                                </>
                            )

                        }



                    </div> {/* container */}
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

                    .grid-container {
                        display: grid;
                        grid-template-columns: repeat(2, 1fr);
                        grid-gap: 10px;
                    }
                    
                    .grid-item {
                        margin-bottom: 15px;
                    }
                    
                    /* Adjustments for small screens */
                    @media (max-width: 768px) {
                        .grid-container {
                            grid-template-columns: 1fr;
                        }
                    }

                    .score-bar {
                        width: 100%;
                        height: 20px;
                        background-color: #f2f2f2;
                        border-radius: 10px;
                        overflow: hidden;
                    }
                    
                    .score-fill {
                        height: 100%;
                        background-color: #4caf50;
                        transition: width 0.3s ease;
                    }
                    /* Track styles */
                    .form-control-range::-webkit-slider-runnable-track {
                        width: 100%;
                        height: 16px; /* Increase the height as needed */
                        background: linear-gradient(to right, red, yellow, green); /* Gradient background */
                        border-radius: 8px; /* Adjust border-radius for rounded corners */
                    }
                    
                    /* Thumb styles */
                    .form-control-range::-webkit-slider-thumb {
                        width: 20px; /* Adjust width and height as needed */
                        height: 20px;
                        background-color: #fff !important; /* Thumb background color */
                        border: 2px solid #ccc; /* Thumb border */
                        border-radius: 50%; /* Rounded thumb */
                        cursor: pointer; /* Change cursor to pointer */
                        -webkit-appearance: none; /* Remove default appearance */
                        margin-top: -8px; /* Center the thumb vertically */
                    }
                    
                    
                    
                    /* Thumb styles */
                    .red::-webkit-slider-thumb {
                        background-color: red;
                    }
                    
                    .yellow::-webkit-slider-thumb {
                        background-color: yellow;
                    }
                    
                    .green::-webkit-slider-thumb {
                        background-color: green;
                    }
                    
                    
                    .red::-webkit-slider-thumb {
                        background-color: red;
                    }
                    
                    .yellow::-webkit-slider-thumb {
                        background-color: yellow;
                    }
                    
                    .green::-webkit-slider-thumb {
                        background-color: green;
                    }
                    
                `}
            </style>
        </>
    )
}

export default EditAssignmentAttempt;
