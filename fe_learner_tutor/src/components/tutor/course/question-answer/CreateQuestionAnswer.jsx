import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from "react-router-dom";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Import the styles
import Header from '../../Header';
import Sidebar from '../../Sidebar';
import Footer from '../../Footer';
import questionService from '../../../../services/question.service';
import questionAnswerService from '../../../../services/question-answer.service';
import DateTimePicker from 'react-datetime-picker';
import Dropzone from 'react-dropzone';

const CreateQuestionAnswer = () => {
    const navigate = useNavigate();
    const [errors, setErrors] = useState({});
    const [msg, setMsg] = useState('');
    const { storedQuestionId } = useParams();

    const [createdQuestionAnswers, setCreatedQuestionAnswers] = useState([]);


    useEffect(() => {
        if (storedQuestionId) {
            questionService
                .getQuestionById(storedQuestionId)
                .then((res) => {
                    setQuestion(res.data);
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    }, [storedQuestionId]);

    const [question, setQuestion] = useState({
        questionText: "",
        questionImageUrl: "",
        questionAudioUrl: "",
        defaultGrade: 0,
    });


    const [module, setModule] = useState({
        name: "",
    });


    const [questionAnswer, setQuestionAnswer] = useState({
        questionId: storedQuestionId,
        answerText: "",
        position: 1,
        isAnswer: false
    });

    const handleChange = (e) => {
        const value = e.target.value;
        setQuestionAnswer({ ...questionAnswer, [e.target.name]: value });
    }


    const listQuestionAnswersByQuestion = async (storedQuestionId) => {
        try {
            const listQuestionAnswersByQuestion = await questionService.getAllQuestionAnswersByQuestion(storedQuestionId);

            console.log('this is list:', listQuestionAnswersByQuestion.data);

            setCreatedQuestionAnswers(listQuestionAnswersByQuestion.data);
        } catch (error) {
            console.log(error);
        }
    };


    const submitQuestionAnswer = async (e) => {
        e.preventDefault();

        try {

            // Convert position to integer
            const positionAsInt = parseInt(questionAnswer.position, 10);

            // Update questionAnswer.position with the converted integer value
            questionAnswer.position = positionAsInt;

            questionAnswer.isAnswer = questionAnswer.isAnswer === "true";


            console.log(JSON.stringify(questionAnswer))


            const questionAnswerResponse = await questionAnswerService.saveQuestionAnswer(questionAnswer);
            console.log(questionAnswerResponse.data);

            setMsg('Answer Added Successfully');

            const questionJson = JSON.stringify(questionAnswerResponse.data);
            const questionJsonParse = JSON.parse(questionJson);

            navigate(`/tutor/courses/create/create-video-course/create-question-answer/${questionJsonParse.id}`);

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
                                            <h4 className="header-title">Information</h4>

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
                                                <textarea className="form-control" name="answerText" id="answerText" required value={questionAnswer.answerText} onChange={(e) => handleChange(e)} />
                                                <label htmlFor="position">Position * :</label>
                                                <select
                                                    className="form-control"
                                                    name="position"
                                                    id="position"
                                                    required
                                                    value={questionAnswer.position}
                                                    onChange={(e) => handleChange(e)}
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
                                                    onChange={(e) => handleChange(e)}
                                                />

                                                <button type="submit" className="btn btn-primary form-control" style={{ marginTop: '10px' }} >
                                                    Create
                                                </button>
                                            </form>

                                            {/* Display created answers */}
                                            <div>
                                                <h4>Created Answers:</h4>
                                                {Array.isArray(createdQuestionAnswers) && createdQuestionAnswers.length > 0 ? (
                                                    <ul>
                                                        {createdQuestionAnswers.map((answer) => (
                                                            <li key={answer.id}>{answer.answerText}</li>
                                                        ))}
                                                    </ul>
                                                ) : (
                                                    <p>No answers created yet.</p>
                                                )}
                                            </div>
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

export default CreateQuestionAnswer;
