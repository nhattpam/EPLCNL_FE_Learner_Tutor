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
import topicService from '../../../../services/topic.service';
import questionService from '../../../../services/question.service';
import questionAnswerService from '../../../../services/question-answer.service';
import Dropzone from 'react-dropzone';

const CreateClassTopicQuiz = () => {
    const navigate = useNavigate();
    const [errors, setErrors] = useState({});
    const [msg, setMsg] = useState('');
    const { storedClassTopicId } = useParams();
    const [createQuizButtonClicked, setCreateQuizButtonClicked] = useState(false); // State variable to track button click
    const [createQuestionButtonClicked, setCreateQuestionButtonClicked] = useState(false); // State variable to track button click
    const [storedQuizId, setStoredQuizId] = useState("");
    const [storedQuestionId, setStoredQuestionId] = useState("");


    useEffect(() => {
        if (storedClassTopicId) {
            topicService
                .getClassTopicById(storedClassTopicId)
                .then((res) => {
                    setClassTopic(res.data);
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    }, [storedClassTopicId]);

    const [classTopic, setClassTopic] = useState({
        name: "",
    });

    //tao quiz
    const [quiz, setQuiz] = useState({
        name: "",
        deadline: 5, // set a default value for minutes
        topicId: storedClassTopicId,
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

                setCreateQuizButtonClicked(true);
                setStoredQuizId(quizJsonParse.id); // Update storedModuleId using setStoredModuleId

                // navigate(`/tutor/courses/create/create-class-course/create-topic-question/${quizJsonParse.id}`)


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
                setCreateQuestionButtonClicked(true);

                // navigate(`/tutor/courses/create/create-video-course/create-question-answer/${questionJsonParse.id}`);
            }

        } catch (error) {
            console.log(error);
        }
    };


    //create answer
    useEffect(() => {
        console.log("createButtonClicked:", createQuestionButtonClicked);
    }, [createQuestionButtonClicked]);


    useEffect(() => {
        // Update classLesson whenever storedModuleId changes
        setQuestionAnswer(prevQuestionAnswer => ({
            ...prevQuestionAnswer,
            questionId: storedQuestionId
        }));
    }, [storedQuestionId]);


    const [questionAnswer, setQuestionAnswer] = useState({
        questionId: storedQuestionId,
        answerText: "",
        isAnswer: false
    });

    const [questionAnswers, setQuestionAnswers] = useState([
        { answerText: "", isAnswer: false },
        { answerText: "", isAnswer: false },
        { answerText: "", isAnswer: false },
        { answerText: "", isAnswer: false }
    ]);

    const handleAnswerChange = (index, e) => {
        const { name, value, type, checked } = e.target;
        const inputValue = type === 'checkbox' ? checked : value;

        const updatedQuestionAnswers = [...questionAnswers];
        updatedQuestionAnswers[index] = { ...updatedQuestionAnswers[index], [name]: inputValue };

        setQuestionAnswers(updatedQuestionAnswers);
    };

    const submitQuestionAnswer = async (e) => {
        e.preventDefault();

        try {
            const questionAnswersData = questionAnswers.map(answer => ({
                ...answer,
                questionId: storedQuestionId // Assuming storedQuestionId is the same for all answers
            }));

            const questionAnswersResponse = await Promise.all(questionAnswersData.map(answer =>
                questionAnswerService.saveQuestionAnswer(answer)
            ));

            console.log("Question Answers Added Successfully", questionAnswersResponse);

            navigate(`/tutor/courses/edit-topic-quiz/${storedQuizId}`);

            setMsg('Question Answers Added Successfully');
        } catch (error) {
            console.log(error);
        }
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
                                            <h4 className="header-title">Topic - <span className='text-success'>{classTopic.name}</span></h4>

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
                                                        <input type="text" className="form-control" name="name" id="name" required value={quiz.name} onChange={(e) => handleQuizChange(e)} style={{ borderRadius: '50px', padding: `8px 25px` }}
                                                        />
                                                    </div>
                                                    <div className='col-6'>
                                                        <label htmlFor="gradeToPass">Grade to pass * :</label>
                                                        <select
                                                            value={quiz.gradeToPass}
                                                            onChange={(e) => setQuiz({ ...quiz, gradeToPass: e.target.value })} className="form-control"
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
                                                    <div className='col-6'>
                                                        <label htmlFor="video">Time * :</label>
                                                        <select
                                                            value={quiz.deadline}
                                                            onChange={handleMinutesChange}
                                                            className="form-control"
                                                            style={{ width: '100%', borderRadius: '50px', padding: `8px 25px` }}
                                                        >
                                                            {[1, 5, 10, 15, 20, 30, 45, 60, 75, 90, 120].map((minutes) => (
                                                                <option key={minutes} value={minutes}>
                                                                    {minutes} minutes
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                    {!createQuizButtonClicked && (
                                                        <div className="col">
                                                            <button type="submit" className="btn btn-success " style={{ marginTop: '10px', borderRadius: '50px', padding: `8px 25px` }} >
                                                                Create

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
                                                        <select
                                                            value={question.defaultGrade}
                                                            onChange={(e) => setQuestion({ ...question, defaultGrade: e.target.value })} className="form-control"
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
                                                {!createQuestionButtonClicked && (
                                                    <div className="form-group mb-0  ">
                                                        <button type="submit" className="btn btn-success " style={{ marginLeft: '23px', marginTop: '10px', borderRadius: '50px', padding: `8px 25px` }} >
                                                            Create

                                                        </button>
                                                    </div>
                                                )}

                                            </form>
                                        </div>
                                    </div>

                                </div>

                            </div>

                            {/* CREATE ANSWER */}
                            <div className="row" style={{ opacity: createQuestionButtonClicked ? 1 : 0.5, pointerEvents: createQuestionButtonClicked ? 'auto' : 'none' }}>
                                <div className="col-12">
                                    <div className="card">
                                        <div className="card-body">
                                            <h4 className="header-title">Create Answer</h4>

                                            <form
                                                method="post"
                                                className="mt-3"
                                                id="myAwesomeDropzone"
                                                data-plugin="dropzone"
                                                data-previews-container="#file-previews"
                                                data-upload-preview-template="#uploadPreviewTemplate"
                                                data-parsley-validate
                                                onSubmit={submitQuestionAnswer} >
                                                <div className="card" style={{ marginTop: '-20px' }}>
                                                    <div className='card-body'>
                                                        {
                                                            questionAnswers.length > 0 && questionAnswers.map((answer, index) => (
                                                                <div key={index} className="form-group col-12">
                                                                    <label htmlFor={`answerText${index}`}>Answer {index + 1} * :</label>
                                                                    <div className="input-group">
                                                                        <textarea
                                                                            className="form-control"
                                                                            name="answerText"
                                                                            id={`answerText${index}`}
                                                                            required
                                                                            value={answer.answerText}
                                                                            onChange={(e) => handleAnswerChange(index, e)}
                                                                            style={{ borderRadius: '20px', padding: `8px 25px` }}

                                                                        />

                                                                        <div className="input-group-append ml-2">
                                                                            <input
                                                                                type="checkbox"
                                                                                name="isAnswer"
                                                                                id={`isAnswer${index}`}
                                                                                value={answer.isAnswer}
                                                                                onChange={(e) => handleAnswerChange(index, e)}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            ))
                                                        }
                                                        {
                                                            questionAnswers.length === 0 && (
                                                                <p>No answers yet.</p>
                                                            )
                                                        }
                                                    </div>

                                                </div>
                                                <div className="form-group ml-2 mb-0  ">
                                                    <button type="submit" className="btn btn-success " style={{ marginLeft: '23px', marginTop: '10px', borderRadius: '50px', padding: `8px 25px` }} >
                                                        Finish

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

export default CreateClassTopicQuiz;
