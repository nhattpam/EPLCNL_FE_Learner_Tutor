import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from "react-router-dom";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Import the styles
import Header from '../../Header';
import Sidebar from '../../Sidebar';
import Footer from '../../Footer';
import moduleService from '../../../../services/module.service';
import quizService from '../../../../services/quiz.service';
import DateTimePicker from 'react-datetime-picker';
import questionService from '../../../../services/question.service';
import Dropzone from 'react-dropzone';
import questionAnswerService from '../../../../services/question-answer.service';

const CreateQuiz = () => {
    const navigate = useNavigate();
    const [errors, setErrors] = useState({});
    const [msg, setMsg] = useState('');
    const { storedModuleId } = useParams();
    const [createQuizButtonClicked, setCreateQuizButtonClicked] = useState(false); // State variable to track button click
    const [storedQuizId, setStoredQuizId] = useState("");
    const [storedQuestionId, setStoredQuestionId] = useState("");

    const [showAnswerModal, setShowAnswerModal] = useState(false);
    const openAnswerModal = () => {
        setShowAnswerModal(true);
    };

    const closeAnswerModal = () => {
        setShowAnswerModal(false);
    };



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

    //tao quiz
    const [quiz, setQuiz] = useState({
        name: "",
        deadline: 5, // set a default value for minutes
        moduleId: storedModuleId,
        gradeToPass: ""
    });


    const handleQuizChange = (e) => {
        const value = e.target.value;
        setQuiz({ ...quiz, [e.target.name]: value });
    }

    const validateQuizForm = () => {
        let isValid = true;
        const errors = {};

        if (quiz.name.trim() === '') {
            errors.name = 'Quiz Name is required';
            isValid = false;
        }
        if (!quiz.deadline) {
            errors.deadline = 'Time is required';
            isValid = false;
        }

        setErrors(errors);
        return isValid;
    };


    const submitQuiz = async (e) => {
        e.preventDefault();

        if (validateQuizForm()) {
            try {
                // Save account
                console.log(JSON.stringify(quiz))
                const quizResponse = await quizService.saveQuiz(quiz);
                console.log(quizResponse.data);

                setMsg('Quiz Added Successfully');

                const quizJson = JSON.stringify(quizResponse.data);

                const quizJsonParse = JSON.parse(quizJson);

                //click quiz create
                setCreateQuizButtonClicked(true);

                // navigate(`/tutor/courses/create/create-video-course/create-question/${quizJsonParse.id}`)
                setStoredQuizId(quizJsonParse.id); // Update storedModuleId using setStoredModuleId



            } catch (error) {
                console.log(error);
            }
        }
    };


    const handleMinutesChange = (e) => {
        const minutes = parseInt(e.target.value, 10);
        setQuiz({ ...quiz, deadline: minutes });
    };

    //create question
    useEffect(() => {
        console.log("createButtonClicked:", createQuizButtonClicked);
    }, [createQuizButtonClicked]);

    const [question, setQuestion] = useState({
        questionText: "",
        questionImageUrl: "",
        questionAudioUrl: "",
        defaultGrade: 0,
        quizId: storedQuizId
    });

    const handleQuestionChange = (e) => {
        const value = e.target.value;
        setQuestion({ ...question, [e.target.name]: value });
    }

    const handleChangeQuestion = (value) => {
        setQuestion({ ...question, questionText: value });
    };

    const [file, setFile] = useState(null);
    const [file2, setFile2] = useState(null);
    const [imagePreview, setImagePreview] = useState("");


    const handleFileDrop = (acceptedFiles) => {
        if (acceptedFiles && acceptedFiles.length > 0) {
            setFile(acceptedFiles[0]);

            // Set the image preview URL
            const previewUrl = URL.createObjectURL(acceptedFiles[0]);
            setImagePreview(previewUrl);

            setQuestion({ ...question, questionImageUrl: URL.createObjectURL(acceptedFiles[0]) });

        }
    };


    const handleFileDrop2 = (acceptedFiles) => {
        if (acceptedFiles && acceptedFiles.length > 0) {
            const currentFile2 = acceptedFiles[0];

            // Log the audio file details
            console.log("Audio File: ", currentFile2);

            setFile2(currentFile2);

            // Set the audio preview URL
            setQuestion({ ...question, questionAudioUrl: URL.createObjectURL(currentFile2) });
        }
    };


    const validateForm = () => {
        let isValid = true;
        const errors = {};

        if (question.defaultGrade.trim() === '') {
            errors.defaultGrade = 'Question Text is required';
            isValid = false;
        }
        if (question.defaultGrade.trim() === '') {
            errors.defaultGrade = 'Grade is required';
            isValid = false;
        } else if (isNaN(question.defaultGrade) || +question.defaultGrade <= 0) {
            errors.defaultGrade = 'Grade should be a positive number';
            isValid = false;
        }

        setErrors(errors);
        return isValid;
    };


    useEffect(() => {
        // Update classLesson whenever storedModuleId changes
        setQuestion(prevQuestion => ({
            ...prevQuestion,
            quizId: storedQuizId
        }));
    }, [storedQuizId]);


    const submitQuestion = async (e) => {
        e.preventDefault();

        try {
            // Save account
            let questionImageUrl = question.questionImageUrl;
            let questionAudioUrl = question.questionAudioUrl;

            if (file) {
                const imageData = new FormData();
                imageData.append('file', file);
                const imageResponse = await questionService.uploadImage(imageData);
                questionImageUrl = imageResponse.data;
            }

            if (file2) {
                const audioData = new FormData();
                audioData.append('file', file2);
                const audioResponse = await questionService.uploadAudio(audioData);
                questionAudioUrl = audioResponse.data;
            }

            // Save course
            const questionData = { ...question, questionImageUrl, questionAudioUrl };
            console.log(JSON.stringify(questionData));

            if (validateForm()) {
                const questionResponse = await questionService.saveQuestion(questionData);
                console.log(questionResponse.data);

                setMsg('Question Added Successfully');

                const questionJson = JSON.stringify(questionResponse.data);
                const questionJsonParse = JSON.parse(questionJson);

                setStoredQuestionId(questionJsonParse.id); // Update storedModuleId using setStoredModuleId

                //show modal answer
                setShowAnswerModal(true);

                // navigate(`/tutor/courses/create/create-video-course/create-question-answer/${questionJsonParse.id}`);
            }

        } catch (error) {
            console.log(error);
        }
    };




    //create answer
    const [createdQuestionAnswers, setCreatedQuestionAnswers] = useState([]);
    const [questionAnswer, setQuestionAnswer] = useState({
        questionId: storedQuestionId,
        answerText: "",
        position: 1,
        isAnswer: false
    });

    const handleAnswerChange = (e) => {
        const { name, value, type, checked } = e.target;
        const inputValue = type === 'checkbox' ? checked : value;

        setQuestionAnswer({ ...questionAnswer, [name]: inputValue });
    }



    const listQuestionAnswersByQuestion = async (storedQuestionId) => {
        try {
            const listQuestionAnswersByQuestion = await questionService.getAllQuestionAnswersByQuestion(storedQuestionId);

            // console.log('this is list:', listQuestionAnswersByQuestion.data);

            setCreatedQuestionAnswers(listQuestionAnswersByQuestion.data);
        } catch (error) {
            console.log(error);
        }
    };


    useEffect(() => {
        // Update classLesson whenever storedModuleId changes
        setQuestionAnswer(prevQuestionAnswer => ({
            ...prevQuestionAnswer,
            questionId: storedQuestionId
        }));
    }, [storedQuestionId]);

    const submitQuestionAnswer = async (e) => {
        e.preventDefault();

        try {
            // Convert position to integer
            const positionAsInt = parseInt(questionAnswer.position, 10);

            // Update questionAnswer.position with the converted integer value
            questionAnswer.position = positionAsInt;

            console.log(JSON.stringify(questionAnswer));

            const questionAnswerResponse = await questionAnswerService.saveQuestionAnswer(questionAnswer);
            // console.log(questionAnswerResponse.data);

            setMsg('Answer Added Successfully');

            const questionAnswerJson = JSON.stringify(questionAnswerResponse.data);
            const questionAnswerJsonParse = JSON.parse(questionAnswerJson);

            await listQuestionAnswersByQuestion(storedQuestionId);

            // navigate(`/tutor/courses/create/create-video-course/create-question-answer/${questionJsonParse.id}`);
        } catch (error) {
            console.log(error);
        }
    };


    const handleDeleteQuestionAnswer = async (questionAnswerId) => {
        try {
            // Delete the question answer
            const response = await questionAnswerService.deleteQuestionAnswer(questionAnswerId);
            console.log(response);
            // Reload the question answer list
            await listQuestionAnswersByQuestion(storedQuestionId);
            // Optionally, display a success message
            setMsg('Question answer deleted successfully');
        } catch (error) {
            console.error('Error deleting question answer:', error);
        }
    };

    const handleClearQuestion = () => {
        setQuestion({
            questionText: "",
            questionImageUrl: "",
            questionAudioUrl: "",
            defaultGrade: 0,
        });
        setShowAnswerModal(false);
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
                                            <h4 className="header-title">MODULE - <span className='text-success'>{module.name}</span></h4>

                                            <form
                                                method="post"
                                                className="mt-3"
                                                data-plugin="dropzone"
                                                data-previews-container="#file-previews"
                                                data-upload-preview-template="#uploadPreviewTemplate"
                                                data-parsley-validate
                                                onSubmit={submitQuiz} >
                                                <div className="row" style={{ marginTop: '-20px', opacity: !createQuizButtonClicked ? 1 : 0.5, pointerEvents: !createQuizButtonClicked ? 'auto' : 'none' }}>
                                                    <div className='col-12'>
                                                        <label htmlFor="name">Quiz Name * :</label>
                                                        <input type="text" className="form-control" name="name" id="name" required value={quiz.name} onChange={(e) => handleQuizChange(e)} />
                                                    </div>
                                                    <div className='col-6'>
                                                        <label htmlFor="gradeToPass">Grade to pass * :</label>
                                                        <input type="number" className="form-control" name="gradeToPass"
                                                            id="gradeToPass" required value={quiz.gradeToPass} onChange={(e) => handleQuizChange(e)}
                                                            style={{ width: '100%' }} />
                                                    </div>
                                                    <div className='col-6'>
                                                        <label htmlFor="video">Time * :</label>
                                                        <select
                                                            value={quiz.deadline}
                                                            onChange={handleMinutesChange}
                                                            className="form-control"
                                                            style={{ width: '100%' }}
                                                        >
                                                            {[5, 10, 15, 20, 30, 45, 60, 75, 90, 120].map((minutes) => (
                                                                <option key={minutes} value={minutes}>
                                                                    {minutes} minutes
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                    {!createQuizButtonClicked && (
                                                        <div className="col">
                                                            <button type="submit" className="btn btn-success " style={{ marginTop: '10px' }} >
                                                                <i class="fas fa-check-double"></i> Create

                                                            </button>
                                                        </div>
                                                    )}

                                                </div>

                                            </form>
                                        </div>
                                    </div>

                                </div>

                            </div>

                            {/* CREATE QUESTION */}
                            <div className="row" style={{ opacity: createQuizButtonClicked ? 1 : 0.5, pointerEvents: createQuizButtonClicked ? 'auto' : 'none' }}>
                                <div className="col-12">
                                    <div className="card">
                                        <div className="card-body">
                                            <h4 className="header-title">Create Question</h4>

                                            <form
                                                method="post"
                                                className="mt-3"
                                                id="myAwesomeDropzone"
                                                data-plugin="dropzone"
                                                data-previews-container="#file-previews"
                                                data-upload-preview-template="#uploadPreviewTemplate"
                                                data-parsley-validate
                                                onSubmit={submitQuestion} >
                                                <div className="card" style={{ marginTop: '-20px' }}>
                                                    <div className='card-body'>
                                                        <label htmlFor="defaultGrade">Grade * :</label>
                                                        <input type="number" className="form-control" name="defaultGrade" id="defaultGrade" required value={question.defaultGrade} onChange={(e) => handleQuestionChange(e)} />

                                                    </div>
                                                    <div className='card-body '>
                                                        <label htmlFor="video">Question Text * :</label>
                                                        <ReactQuill
                                                            value={question.questionText}
                                                            onChange={handleChangeQuestion}
                                                            style={{ height: '300px' }}
                                                        />
                                                    </div>
                                                    <div className='card-body '>
                                                        <label htmlFor="image">Question Image * :</label>
                                                        <Dropzone
                                                            onDrop={handleFileDrop}
                                                            accept="image/*" multiple={false}
                                                            maxSize={5000000} // Maximum file size (5MB)
                                                        >
                                                            {({ getRootProps, getInputProps }) => (
                                                                <div {...getRootProps()} className="fallback">
                                                                    <input {...getInputProps()} />
                                                                    <div className="dz-message needsclick">
                                                                        <i className="h1 text-muted dripicons-cloud-upload" />
                                                                        <h3>Drop files here or click to upload.</h3>
                                                                    </div>
                                                                    {imagePreview && (
                                                                        <img src={imagePreview} alt="Preview" style={{ maxWidth: "100%", maxHeight: "200px", marginTop: "10px" }} />
                                                                    )}
                                                                </div>
                                                            )}
                                                        </Dropzone>
                                                    </div>
                                                    <div className='card-body'>
                                                        <label htmlFor="audio">Question Audio * :</label>
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
                                                <div className="form-group mb-0  ">
                                                    <button type="submit" className="btn btn-success " style={{ marginLeft: '23px', marginTop: '10px' }} >
                                                        <i class="fas fa-check-double"></i> Create

                                                    </button>
                                                </div>
                                            </form>
                                        </div>
                                    </div>

                                </div>

                            </div>

                            {showAnswerModal && (
                                <div className="modal" tabIndex="-1" role="dialog" style={{ display: 'block' }}>
                                    <div className="modal-dialog" role="document">
                                        <div className="modal-content">
                                            <div className="modal-header">
                                                <h5 className="modal-title">Create Answer...</h5>
                                                <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={closeAnswerModal}>
                                                    <span aria-hidden="true">&times;</span>
                                                </button>
                                            </div>
                                            <div className="modal-body">
                                                {/* Conditional rendering based on edit mode */}
                                                <div>
                                                    {/* Input fields for editing */}
                                                    <form
                                                        method="post"
                                                        className="dropzone"
                                                        id="myAwesomeDropzone"
                                                        data-plugin="dropzone"
                                                        data-previews-container="#file-previews"
                                                        data-upload-preview-template="#uploadPreviewTemplate"
                                                        data-parsley-validate
                                                        onSubmit={submitQuestionAnswer} >

                                                        <label htmlFor="answerText">Question Answer * :</label>
                                                        <textarea className="form-control" name="answerText" id="answerText" required value={questionAnswer.answerText} onChange={(e) => handleAnswerChange(e)} />
                                                        <label htmlFor="position">Position * :</label>
                                                        <select
                                                            className="form-control text-center"
                                                            name="position"
                                                            id="position"
                                                            required
                                                            value={questionAnswer.position}
                                                            onChange={(e) => handleAnswerChange(e)}
                                                            style={{ width: '20%' }}
                                                        >
                                                            <option value={1}>1</option>
                                                            <option value={2}>2</option>
                                                            <option value={3}>3</option>
                                                            <option value={4}>4</option>
                                                        </select>

                                                        <label htmlFor="isAnswer">Is Answer:</label> &nbsp;
                                                        <input
                                                            type="checkbox"
                                                            name="isAnswer"
                                                            id="isAnswer"
                                                            value={questionAnswer.isAnswer}
                                                            onChange={(e) => handleAnswerChange(e)}
                                                        />

                                                        <button type="submit" className="btn btn-success form-control" style={{ marginTop: '10px' }} >
                                                            <i class="fas fa-check-double"></i> Create

                                                        </button>
                                                    </form>

                                                    {/* Display created answers */}
                                                    <div>
                                                        <h4>Created Answers:</h4>
                                                        {Array.isArray(createdQuestionAnswers) && createdQuestionAnswers.length > 0 ? (
                                                            <ul>
                                                                {createdQuestionAnswers.map((answer) => (
                                                                    <li key={answer.id}>
                                                                        Answer: <span className='text-success'>{answer.answerText}</span> - Position: {answer.position} - <span className='text-success'>{answer.isAnswer ? "Is Answer" : "Not an Answer"}</span>
                                                                        <Link onClick={() => handleDeleteQuestionAnswer(answer.id)} className='text-danger'> <i className="far fa-trash-alt"></i></Link>
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        ) : (
                                                            <p>No answers created yet.</p>
                                                        )}
                                                    </div>

                                                </div>
                                            </div>
                                            <div className="modal-footer">
                                                {/* Conditional rendering of buttons based on edit mode */}
                                                <button type="button" className="btn btn-dark" onClick={{ handleClearQuestion }}>Finish</button>
                                                <button type="button" className="btn btn-danger" onClick={closeAnswerModal}>Close</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

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

export default CreateQuiz;
