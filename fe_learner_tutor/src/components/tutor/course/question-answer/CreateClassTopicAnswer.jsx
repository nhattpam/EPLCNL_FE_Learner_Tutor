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

const CreateClassTopicAnswer = () => {
  const storedLoginStatus = sessionStorage.getItem('isLoggedIn');

  const navigate = useNavigate();
  if (!storedLoginStatus) {
    navigate(`/login`)
  }
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




  const listQuestionAnswersByQuestion = async (storedQuestionId) => {
    try {
      const listQuestionAnswersByQuestion = await questionService.getAllQuestionAnswersByQuestion(storedQuestionId);

      // console.log('this is list:', listQuestionAnswersByQuestion.data);

      setCreatedQuestionAnswers(listQuestionAnswersByQuestion.data);
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



  const [questionAnswers, setQuestionAnswers] = useState([
    { answerText: "", isAnswer: false },
    { answerText: "", isAnswer: false },
    { answerText: "", isAnswer: false },
    { answerText: "", isAnswer: false }
  ]);

  const handleAnswerChange = (index, e) => {
    const { name, value, type, checked } = e.target;

    const updatedQuestionAnswers = [...questionAnswers];

    if (type === 'checkbox') {
      updatedQuestionAnswers[index] = { ...updatedQuestionAnswers[index], [name]: checked };

      // Uncheck all other checkboxes
      updatedQuestionAnswers.forEach((answer, i) => {
        if (i !== index) {
          updatedQuestionAnswers[i] = { ...updatedQuestionAnswers[i], [name]: false };
        }
      });
    } else if (type === 'radio') {
      // Uncheck all other radio buttons
      updatedQuestionAnswers.forEach((answer, i) => {
        updatedQuestionAnswers[i] = { ...updatedQuestionAnswers[i], [name]: false };
      });

      // Check the selected radio button
      updatedQuestionAnswers[index] = { ...updatedQuestionAnswers[index], [name]: checked };
    } else {
      updatedQuestionAnswers[index] = { ...updatedQuestionAnswers[index], [name]: value };
    }

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

      navigate(`/tutor/courses/edit-topic-question/${storedQuestionId}`);

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
                      <h4 className="header-title">CREATING ANSWER FOR QUESTION</h4>

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
                                      value={answer.answerText}
                                      onChange={(e) => handleAnswerChange(index, e)} // Pass both index and event (e)
                                      style={{ borderRadius: '20px', padding: `8px 25px` }}
                                    />


                                    <input
                                      className='ml-2'
                                      type="radio"
                                      name={`isAnswer`}
                                      id={`isAnswer${index}`}
                                      checked={answer.isAnswer}
                                      onChange={(e) => handleAnswerChange(index, e)} // Pass both index and event (e)
                                    />
                                  </div>
                                </div>
                              ))
                            }
                          </div>
                          <div className="form-group ml-2 mb-0  ">
                            <button type="submit" className="btn btn-success " style={{ marginLeft: '23px', marginTop: '10px', borderRadius: '50px', padding: `8px 25px` }} >
                              Finish

                            </button>
                          </div>

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

export default CreateClassTopicAnswer;
