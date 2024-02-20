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

const CreateQuiz = () => {
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

    //tao quiz
    const [quiz, setQuiz] = useState({
        name: "",
        deadline: 5, // set a default value for minutes
        moduleId: storedModuleId,
        gradeToPass: ""
    });

 
    const handleChange = (e) => {
      const value = e.target.value;
      setQuiz({ ...quiz, [e.target.name]: value });
  }

    const validateForm = () => {
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

        if (validateForm()) {
            try {
                // Save account
                console.log(JSON.stringify(quiz))
                const quizResponse = await quizService.saveQuiz(quiz);
                console.log(quizResponse.data);

                setMsg('Quiz Added Successfully');

                const quizJson = JSON.stringify(quizResponse.data);

                const quizJsonParse = JSON.parse(quizJson);

                navigate(`/tutor/courses/create/create-video-course/create-question/${quizJsonParse.id}`)


            } catch (error) {
                console.log(error);
            }
        }
    };


   const handleMinutesChange = (e) => {
        const minutes = parseInt(e.target.value, 10);
        setQuiz({ ...quiz, deadline: minutes });
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
                                                className="dropzone"
                                                id="myAwesomeDropzone"
                                                data-plugin="dropzone"
                                                data-previews-container="#file-previews"
                                                data-upload-preview-template="#uploadPreviewTemplate"
                                                data-parsley-validate
                                                onSubmit={submitQuiz} >
                                                <div className="card" style={{marginTop: '-20px'}}>
                                                    
                                                    <div className='card-body'>
                                                        <label htmlFor="name">Quiz Name * :</label>
                                                        <input type="text" className="form-control" name="name" id="name" required value={quiz.name} onChange={(e) => handleChange(e)} />

                                                    </div>
                                                    <div className='card-body'>
                                                        <label htmlFor="gradeToPass">Grade to pass * :</label>
                                                        <input type="number" className="form-control" name="gradeToPass" id="gradeToPass"
                                                         required value={quiz.gradeToPass} onChange={(e) => handleChange(e)}
                                                         style={{width: '20%'}}
                                                         />

                                                    </div>
                                                    <div className='card-body'>
                                                        <label htmlFor="video">Time * :</label>
                                                        <select
                                                            value={quiz.deadline}
                                                            onChange={handleMinutesChange}
                                                            className="form-control"
                                                            style={{width: '20%'}}

                                                        >
                                                            {[5, 10, 15, 20, 30, 45, 60, 75, 90, 120].map((minutes) => (
                                                                <option key={minutes} value={minutes}>
                                                                    {minutes} minutes
                                                                </option>
                                                            ))}
                                                        </select>
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
