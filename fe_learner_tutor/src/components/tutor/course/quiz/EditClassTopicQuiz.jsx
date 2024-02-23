import React, { useEffect, useState } from 'react';
import Header from '../../Header';
import Sidebar from '../../Sidebar';
import Footer from '../../Footer';
import { Link, useNavigate, useParams } from 'react-router-dom';
import quizService from '../../../../services/quiz.service';
import { Button } from 'bootstrap';

const EditClassTopicQuiz = () => {

  const [quiz, setQuiz] = useState({
    moduleId: "",
    classTopicId: "",
    name: "",
    gradeToPass: "",
    deadline: "",
    createdDate: "",
    updatedDate: "",
    module: []
  });


  const [errors, setErrors] = useState({});
  const [msg, setMsg] = useState('');
  const navigate = useNavigate();

  const [questionList, setQuestionList] = useState([]);


  const { quizId } = useParams();

  useEffect(() => {
    if (quizId) {
      quizService
        .getQuizById(quizId)
        .then((res) => {
          setQuiz(res.data);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [quizId]);

  useEffect(() => {
    quizService
      .getAllQuestionsByQuiz(quizId)
      .then((res) => {
        console.log(res.data);
        setQuestionList(res.data);

      })
      .catch((error) => {
        console.log(error);
      });
  }, [quizId]);




  const handleEditQuestion = (questionId) => {
    // Add logic to navigate to the module edit page with the moduleId
    navigate(`/tutor/courses/edit-topic-question/${questionId}`);
  };


  return (
    <>
      <div id="wrapper">
        <Header />
        <Sidebar />
        <div className="content-page">
          {/* Start Content*/}
          <div className="container-fluid">
            <div className="row">
              <div className="col-12">
                <div className="card-box">
                  <h4 className="header-title">QUIZ INFORMATION</h4>
                  <div className="table-responsive">
                    <table className="table table-bordered">
                      <tbody>
                        <tr>
                          <th>Quiz Name:</th>
                          <td>{quiz.name}</td>
                        </tr>
                        <tr>
                          <th>Grade to Pass:</th>
                          <td><span className="badge label-table badge-success">{quiz.gradeToPass}</span></td>
                        </tr>
                        <tr>
                          <th>Times:</th>
                          <td>{quiz.deadline}</td>
                        </tr>
                        <tr>
                          <th>Created Date:</th>
                          <td>{quiz.createdDate}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div className="form-group">
                    <h5>Questions:</h5>

                    <ul className="list-group">
                      {/* <li key={question.id} className="list-group-item d-flex justify-content-between align-items-center">
                        {question.questionImageUrl} {question.questionAudioUrl} {question.questionText}
                        <button
                          type="button"
                          className="btn btn-link btn-sm text-secondary"
                          onClick={() => handleEditQuestion(question.id)}
                        >
                          <i class="fa-regular fa-eye"></i>
                        </button>
                      </li> */}


                      <div className="table-responsive">
                        <table id="demo-foo-filtering" className="table table-bordered toggle-circle mb-0" data-page-size={7}>
                          <thead>
                            <tr>
                              <th data-toggle="true">No.</th>
                              <th data-toggle="true">Question</th>
                              <th>Grade</th>
                              <th data-hide="phone">Created Date</th>
                              <th>Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {questionList.map((question, index) => (
                              <tr key={question.id}>
                                <td>{index + 1}</td>
                                <td className='truncate-text'>
                                  {question.questionImageUrl} {question.questionAudioUrl} {question.questionText}
                                </td>
                                <td>{question.defaultGrade}</td>
                                <td>{question.createdDate}</td>
                                <td>
                                  <Link to={`/tutor/courses/edit-topic-question/${question.id}`} className='text-secondary'>
                                    <i class="fa-regular fa-eye"></i>
                                  </Link>
                                </td>
                              </tr>
                            ))}
                          </tbody>

                        </table>
                      </div>

                    </ul>
                  </div>

                  <div className="form-group mb-2">
                    <>
                      {questionList.length === 0 && (
                        <p>No questions available.</p>
                      )}
                      <Link
                        type="button"
                        className="btn btn-success mr-2"
                        to={`/tutor/courses/create/create-class-course/create-topic-question/${quiz.id}`}
                      >
                        <i className="bi bi-plus"></i> Create new question
                      </Link>

                      <Link to={`/tutor/courses/edit-topic/${quiz.classTopicId}`} className="btn btn-black"  >
                        <i class="fas fa-long-arrow-alt-left"></i> Back to Topic Information

                      </Link>


                      {/* <button
                        type="submit"
                        className="btn btn-danger"
                      >
                        <i className="bi bi-x-lg"></i> Request to delete
                      </button> */}
                    </>


                  </div>





                </div> {/* end card-box*/}
              </div> {/* end col*/}
            </div>
            {/* end row*/}

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

                    .truncate-text {
                      max-width: 200px; /* Adjust max-width as needed */
                      white-space: nowrap;
                      overflow: hidden;
                      text-overflow: ellipsis;
                  }
                `}
      </style>
    </>
  )
}

export default EditClassTopicQuiz;
