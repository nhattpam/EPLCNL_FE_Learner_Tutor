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
                          className="form-control text-center"
                          name="position"
                          id="position"
                          required
                          value={questionAnswer.position}
                          onChange={(e) => handleChange(e)}
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
                          onChange={(e) => handleChange(e)}
                        />

                        <div className="row">
                          <div className="col-md-6">
                            <button type="submit" className="btn btn-success form-control" style={{ marginTop: '10px' }} >
                              <i class="fas fa-check-double"></i> Create

                            </button>
                          </div>
                          <div className="col-md-2">
                            <Link to={`/tutor/courses/edit-topic-question/${storedQuestionId}`} className="btn btn-black form-control" style={{ marginTop: '10px' }} >
                              <i class="fas fa-long-arrow-alt-left"></i> Back

                            </Link>
                          </div>
                        </div>
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
