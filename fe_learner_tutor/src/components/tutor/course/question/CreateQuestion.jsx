import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from "react-router-dom";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Import the styles
import Header from '../../Header';
import Sidebar from '../../Sidebar';
import Footer from '../../Footer';
import moduleService from '../../../../services/module.service';
import quizService from '../../../../services/quiz.service';
import questionService from '../../../../services/question.service';
import DateTimePicker from 'react-datetime-picker';
import Dropzone from 'react-dropzone';

const CreateQuestion = () => {
    const navigate = useNavigate();
    const [errors, setErrors] = useState({});
    const [msg, setMsg] = useState('');
    const { storedQuizId } = useParams();

    useEffect(() => {
        if (storedQuizId) {
            quizService
                .getQuizById(storedQuizId)
                .then((res) => {
                    setQuiz(res.data);
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    }, [storedQuizId]);

    const [quiz, setQuiz] = useState({
        name: "",
    });

    //display course name
    useEffect(() => {
        if (quiz.module?.id) {
            moduleService
                .getModuleById(quiz.module?.id)
                .then((res) => {
                    setModule(res.data);
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    }, [quiz.module?.id]);

    const [module, setModule] = useState({
        name: "",
    });


    const [question, setQuestion] = useState({
        questionText: "",
        questionImageUrl: "",
        questionAudioUrl: "",
        defaultGrade: 0,
        quizId: storedQuizId
    });

    const handleChange = (e) => {
        const value = e.target.value;
        setQuestion({ ...question, [e.target.name]: value });
    }

    const validateForm = () => {
        let isValid = true;
        const errors = {};

        if (isNaN(question.defaultGrade) || +question.defaultGrade <= 0) {
            errors.defaultGrade = 'Grade should be a positive number';
            isValid = false;
        }

        setErrors(errors);
        return isValid;
    };


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

                navigate(`/tutor/courses/create/create-video-course/create-question-answer/${questionJsonParse.id}`);
            }

        } catch (error) {
            console.log(error);
        }
    };


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
                                            <h4 className="header-title">MODULE - <span className='text-success'>{quiz.module?.name}</span> | QUIZ - <span className='text-success'>{quiz.name}</span></h4>

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
                                                        {errors.defaultGrade && (
                                                            <div className="text-danger">{errors.defaultGrade}</div>
                                                        )}
                                                        <label htmlFor="defaultGrade">Grade * :</label>
                                                        <input type="number"
                                                         className="form-control" name="defaultGrade" 
                                                         id="defaultGrade" value={question.defaultGrade} onChange={(e) => handleChange(e)} style={{ borderRadius: '50px', padding: `8px 25px` }}/>

                                                    </div>
                                                    <div className='card-body'>
                                                        <label htmlFor="video">Question Text:</label>
                                                        <ReactQuill
                                                            value={question.questionText}
                                                            onChange={handleChangeQuestion}
                                                            style={{ height: '300px' }}
                                                        />
                                                    </div>
                                                    <div className='card-body'>
                                                        <label htmlFor="image">Question Image:</label>
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
                                                        <label htmlFor="audio">Question Audio:</label>
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
                                                    <button type="submit" className="btn btn-success " style={{ marginLeft: '23px', marginTop: '10px', borderRadius: '50px', padding: `8px 25px`  }} >
                                                        Create
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

export default CreateQuestion;
