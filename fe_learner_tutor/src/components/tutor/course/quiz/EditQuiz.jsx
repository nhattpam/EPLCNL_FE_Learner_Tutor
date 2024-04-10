import React, { useEffect, useState } from 'react';
import Header from '../../Header';
import Sidebar from '../../Sidebar';
import Footer from '../../Footer';
import { Link, useNavigate, useParams } from 'react-router-dom';
import quizService from '../../../../services/quiz.service';

const EditQuiz = () => {

  const [quiz, setQuiz] = useState({
    moduleId: "",
    topicId: "",
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



  //EDIT QUIZ
  const [showEditQuizModal, setShowEditQuizModal] = useState(false);

  const openEditQuizModal = () => {
    setShowEditQuizModal(true);
  };

  const closeEditQuizModal = () => {
    setShowEditQuizModal(false);
  };

  const handleQuizChange = (e) => {
    const value = e.target.value;
    setQuiz({ ...quiz, [e.target.name]: value });
  }

  const handleMinutesChange = (e) => {
    const minutes = parseInt(e.target.value, 10);
    setQuiz({ ...quiz, deadline: minutes });
  };

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
        // Save quiz
        console.log(JSON.stringify(quiz))
        const quizResponse = await quizService.updateQuiz(quiz.id, quiz);
        console.log(quizResponse.data);

        const quizJson = JSON.stringify(quizResponse.data);

        const quizJsonParse = JSON.parse(quizJson);

        window.alert("Update Quiz Successfully!");
        window.location.reload();


      } catch (error) {
        console.log(error);
      }
    }
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
                  <h4 className="header-title">QUIZ INFORMATION &nbsp;<i class="fa-solid fa-pen-to-square" onClick={openEditQuizModal}></i></h4>
                  <div className="table-responsive">
                    <table className="table table-borderless table-hover table-nowrap table-centered mb-0">
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
                          <td>{quiz.deadline} minutes</td>
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

                    <div className="table-responsive">
                      <table id="demo-foo-filtering" className="table table-borderless table-hover table-nowrap table-centered mb-0" data-page-size={7}>
                        <thead className="thead-light">
                          <tr>
                            <th data-toggle="true">No.</th>
                            <th data-toggle="true">Question</th>
                            <th>Grade</th>
                            <th data-hide="phone">Created Date</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {
                            questionList.length > 0 && questionList.map((question, index) => (
                              <tr key={question.id}>
                                <td>{index + 1}</td>
                                <td>
                                  Question {index + 1}
                                </td>
                                <td>{question.defaultGrade}</td>
                                <td>{question.createdDate}</td>
                                <td>
                                  <Link to={`/tutor/courses/edit-question/${question.id}`} className='text-secondary'>
                                    <i class="fa-regular fa-eye"></i>
                                  </Link>
                                </td>
                              </tr>
                            ))
                          }


                        </tbody>

                      </table>


                    </div>


                  </div>
                  {
                    questionList.length === 0 && (
                      <p className='text-center'>No questions found.</p>
                    )
                  }
                  <div className="form-group mb-2">
                    <>

                      <Link
                        type="button"
                        className="btn btn-success mr-2"
                        to={`/tutor/courses/create/create-video-course/create-question/${quiz.id}`}
                        style={{ borderRadius: '50px', padding: `8px 25px` }}
                      >
                        Create new question
                      </Link>
                      <Link
                        type="button"
                        className="btn btn-black mr-2"
                        to={`/tutor/courses/edit-module/${quiz.moduleId}`}
                      >
                        <i class="fas fa-long-arrow-alt-left"></i> Back to Module Infomation
                      </Link>

                    </>


                  </div>


                </div> {/* end card-box*/}
              </div> {/* end col*/}
            </div>
            {/* end row*/}

          </div> {/* container */}
          {showEditQuizModal && (
            <div className="modal" tabIndex="-1" role="dialog" style={{ display: 'block', backgroundColor: 'rgba(29, 29, 29, 0.75)' }}>
              <div className="modal-dialog" role="document">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">Edit Quiz</h5>
                    <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={closeEditQuizModal}>
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </div>
                  {/* Conditional rendering based on edit mode */}
                  <>
                    <form
                      method="post"
                      className="mt-3"
                      data-plugin="dropzone"
                      data-previews-container="#file-previews"
                      data-upload-preview-template="#uploadPreviewTemplate"
                      data-parsley-validate
                      onSubmit={submitQuiz} >
                      <div className="modal-body" style={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}>
                        <div className="table-responsive">
                          <table className="table table-hover">
                            <tbody>
                              <tr>
                                <th style={{ width: '30%' }}>Quiz Name * :</th>
                                <td>
                                  <input type="text" className="form-control"
                                    name="name" id="name" required value={quiz.name}
                                    onChange={(e) => handleQuizChange(e)} style={{ borderRadius: '50px', padding: `8px 25px` }}
                                  />
                                </td>
                              </tr>
                              <tr>
                                <th style={{ width: '30%' }}>Grade to pass * :</th>
                                <td>
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
                                </td>
                              </tr>
                              <tr>
                                <th style={{ width: '30%' }}>Time * :</th>
                                <td>
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
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                      <div className="modal-footer">
                        <button type="submit" className="btn btn-success" style={{ borderRadius: '50px', padding: `8px 25px` }}>Save Changes</button>
                        <button type="button" className="btn btn-dark" onClick={closeEditQuizModal} style={{ borderRadius: '50px', padding: `8px 25px` }}>Close</button>
                      </div>
                    </form>
                  </>


                </div>
              </div>
            </div>
          )}
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
                      max-width: 500px; /* Adjust max-width as needed */
                      white-space: nowrap;
                      overflow: hidden;
                      text-overflow: ellipsis;
                  }
                `}
      </style>
    </>
  )
}

export default EditQuiz;
