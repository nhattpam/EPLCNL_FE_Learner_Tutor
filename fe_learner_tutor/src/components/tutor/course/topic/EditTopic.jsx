import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Header from '../../Header';
import Sidebar from '../../Sidebar';
import Footer from '../../Footer';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import classLessonService from '../../../../services/class-lesson.service';
import topicService from '../../../../services/topic.service';
import classModuleService from '../../../../services/class-module.service';
import ReactPaginate from 'react-paginate';
import { AiFillCaretLeft, AiFillCaretRight } from 'react-icons/ai';

const EditTopic = () => {
  const storedLoginStatus = sessionStorage.getItem('isLoggedIn');

  const navigate = useNavigate();
  if (!storedLoginStatus) {
    navigate(`/login`)
  }

  const { storedClassTopicId } = useParams();
  const [createdTopics, setCreatedTopics] = useState([]);
  const [quizList, setQuizList] = useState([]);
  const [assignmentList, setAssignmentList] = useState([]);

  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [currentPage2, setCurrentPage2] = useState(0);
  const [currentPage3, setCurrentPage3] = useState(0);
  const [quizsPerPage] = useState(5);
  const [materialsPerPage] = useState(5);
  const [assignmentsPerPage] = useState(5);

  //create class topic
  const [classTopic, setClassTopic] = useState({
    name: "",
    description: "",
    materialUrl: "",
    classLessonId: "",
    classLesson: "",
    isActive: false
  });


  const [classLesson, setClassLesson] = useState({
    classHours: '',
    classUrl: '',
    classModuleId: ''
  });

  const [classModule, setClassModule] = useState({
    startDate: '',
  });


  //LOADING
  const [loading, setLoading] = useState(true); // State to track loading

  //LOADING

  useEffect(() => {
    if (storedClassTopicId) {
      topicService
        .getClassTopicById(storedClassTopicId)
        .then((res) => {
          setClassTopic(res.data);
          setLoading(false);

        })
        .catch((error) => {
          console.log(error);
          setLoading(false);

        });
    }
  }, [storedClassTopicId]);


  useEffect(() => {
    if (classTopic.classLesson?.classModuleId) {
      classModuleService
        .getModuleById(classTopic.classLesson?.classModuleId)
        .then((res) => {
          setClassModule(res.data);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [classTopic.classLesson?.classModuleId]);

  const handleListTopics = () => {
    navigate(`/tutor/courses/create/create-class-course/list-topic/${classTopic.classLessonId}`);
  };



  const listTopicsByClassLessonId = async (storedClassLessonId) => {
    try {
      const listClassTopicsByClassLesson = await classLessonService.getAllClassTopicsByClassLesson(storedClassLessonId);

      //   console.log('this is list:', listClassTopicsByClassLesson.data);

      setCreatedTopics(listClassTopicsByClassLesson.data);
    } catch (error) {
      console.log(error);
    }
  };


  //list quizzes by topic
  useEffect(() => {
    topicService
      .getAllQuizzesByClassTopic(storedClassTopicId)
      .then((res) => {
        console.log(res.data);
        setQuizList(res.data);

      })
      .catch((error) => {
        console.log(error);
      });
  }, [storedClassTopicId]);

  const filteredQuizs = quizList
    .filter((quiz) => {
      return (
        quiz.id.toString().toLowerCase().includes(searchTerm.toLowerCase())

      );
    });

  const pageCount = Math.ceil(filteredQuizs.length / quizsPerPage);

  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
  };

  const offset = currentPage * quizsPerPage;
  const currentQuizs = filteredQuizs.slice(offset, offset + quizsPerPage);

  //list materials by topic
  const [materialList, setMaterialList] = useState([]);

  const filteredLessonMaterials = materialList
    .filter((material) => {
      return (
        material.id.toString().toLowerCase().includes(searchTerm.toLowerCase())

      );
    });

  const pageCount2 = Math.ceil(filteredLessonMaterials.length / materialsPerPage);


  useEffect(() => {
    if (storedClassTopicId) {
      topicService
        .getAllMaterialsByClassTopic(storedClassTopicId)
        .then((res) => {
          setMaterialList(res.data);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [storedClassTopicId]);

  const handlePageClick2 = (data) => {
    setCurrentPage2(data.selected);
  };


  const offset2 = currentPage2 * materialsPerPage;
  const currentLessonMaterials = filteredLessonMaterials.slice(offset2, offset2 + materialsPerPage);

  //list assignments by topic
  useEffect(() => {
    topicService
      .getAllAssignmentsByClassTopic(storedClassTopicId)
      .then((res) => {
        console.log(res.data);
        setAssignmentList(res.data);

      })
      .catch((error) => {
        console.log(error);
      });
  }, [storedClassTopicId]);

  const filteredAssignments = assignmentList
    .filter((assignment) => {
      return (
        assignment.id.toString().toLowerCase().includes(searchTerm.toLowerCase())

      );
    });

  const pageCount3 = Math.ceil(filteredAssignments.length / assignmentsPerPage);

  const handlePageClick3 = (data) => {
    setCurrentPage3(data.selected);
  };

  const offset3 = currentPage3 * assignmentsPerPage;
  const currentAssignments = filteredAssignments.slice(offset3, offset3 + assignmentsPerPage);


  const submitClassTopic = async (e) => {
    e.preventDefault();

    classTopic.isActive = true;
    try {
      // Save account
      const classTopicResponse = await topicService.updateClassTopic(classTopic.id, classTopic);

      // console.log(JSON.stringify(courseResponse));
      // console.log(courseResponse.data);
      const classTopicJson = JSON.stringify(classTopicResponse.data);

      const classTopicJsonParse = JSON.parse(classTopicJson);

      window.alert("Update Topic Successfully!");
      window.location.reload();


    } catch (error) {
      console.log(error);
    }
  };


  useEffect(() => {
    if (classTopic.classLessonId) {
      listTopicsByClassLessonId(classTopic.classLessonId);
    }
  }, [classTopic.classLessonId]);



  //EDIT TOPIC
  const [showEditTopicModal, setShowEditTopicModal] = useState(false);
  const [errors, setErrors] = useState({});

  const openEditTopicModal = () => {
    setShowEditTopicModal(true);
  };

  const closeEditTopicModal = () => {
    setShowEditTopicModal(false);
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setClassTopic({ ...classTopic, [e.target.name]: value });
  }

  const validateForm = () => {
    let isValid = true;
    const errors = {};

    if (classTopic.name.trim() === '') {
      errors.name = 'Name is required';
      isValid = false;
    }

    if (classTopic.description.trim() === '') {
      errors.code = 'Description is required';
      isValid = false;
    }


    setErrors(errors);
    return isValid;
  };


  //DEACTIVATE
  const handleDeactivate = async () => {
    classTopic.isActive = false;
    // Save account
    const topicResponse = await topicService.updateClassTopic(classTopic.id, classTopic);

    const topicJson = JSON.stringify(topicResponse.data);

    window.alert("Deactivate Topic Successfully!")
    window.location.reload();
  };


  return (
    <>
      <div id="wrapper">
        <Header />
        <Sidebar />
        <div className="content-page">
          <div className="content">
            <div className="container-fluid">
              <div className="row">
                <div className="col-12">
                  <div className="card">
                    <div className="card-body">
                      <h4 className="header-title">
                        DATE - <span className='text-success'>{classModule.startDate?.substring(0, 10)}</span>
                      </h4>

                      {loading && (
                        <div className="loading-overlay">
                          <div className="loading-spinner" />
                        </div>
                      )}
                      <form
                        method="post"
                        id="myAwesomeDropzone"
                        data-plugin="dropzone"
                        data-previews-container="#file-previews"
                        data-upload-preview-template="#uploadPreviewTemplate"
                        data-parsley-validate
                        onSubmit={(e) => submitClassTopic(e)}
                      >
                        <div className="form-group">
                          <label htmlFor="roomLink">Class Hours:</label>
                          <p className='ml-2'>{classTopic.classLesson?.classHours}</p>

                        </div>


                        <div className="form-group">
                          <label htmlFor="roomLink">Room Link :</label>
                          <p className='ml-2'>{classTopic.classLesson?.classUrl}</p>

                        </div>

                        <div className="form-group">
                          <h4 htmlFor="topic">Topic Information &nbsp;<i class="fa-solid fa-pen-to-square" onClick={openEditTopicModal}></i>
                            {classTopic.isActive ? (
                              <span className="badge label-table badge-success" style={{ float: 'right' }}>Active</span>
                            ) : (
                              <span className="badge label-table badge-danger" style={{ float: 'right' }}>Inactive</span>
                            )}
                          </h4>

                        </div>
                        <div className="form-group">
                          <label htmlFor="name">Name :</label>
                          <p className='ml-2'>{classTopic.name}</p>
                        </div>
                        <div className="form-group">
                          <label htmlFor="code">Description :</label>
                          <p className='ml-2'>{classTopic.description}</p>

                        </div>


                      </form>

                      {/* Display created topics */}
                      <div className='mt-2'>
                        <div className="row">
                          <div className="col-md-2">
                            <h4>Created Quizzes:</h4>
                          </div>
                          <div className="col-md-6">
                            <Link to={`/tutor/courses/create/create-class-course/create-quiz/${storedClassTopicId}`}>
                              <h4>  <i className="fas fa-plus-circle text-success"></i></h4>
                            </Link>
                          </div>
                        </div>

                        <div className="table-responsive">
                          <table id="demo-foo-filtering" className="table table-borderless table-hover table-nowrap table-centered mb-0" data-page-size={7}>
                            <thead className="thead-light">
                              <tr>
                                <th data-toggle="true">No.</th>
                                <th data-toggle="true">Quiz Name</th>
                                <th>Grade to pass</th>
                                <th>Time</th>
                                <th data-hide="phone">Created Date</th>
                                <th data-hide="phone, tablet">Updated Date</th>
                                <th>Action</th>
                              </tr>
                            </thead>
                            <tbody>
                              {
                                currentQuizs.length > 0 && currentQuizs.map((quiz, index) => (
                                  <tr key={quiz.id}>
                                    <td>{index + 1}</td>
                                    <td>{quiz.name}</td>
                                    <td>
                                      {quiz.gradeToPass}
                                    </td>
                                    <td>{quiz.deadline} mins</td>
                                    <td>{new Date(quiz.createdDate).toLocaleString('en-US')}</td>
                                    {
                                      quiz.updatedDate && (
                                        <td>{new Date(quiz.updatedDate).toLocaleString('en-US')}</td>

                                      )
                                    }
                                    {
                                      !quiz.updatedDate && (
                                        <td><i class="fa-solid fa-ban"></i></td>

                                      )
                                    }
                                    <td>
                                      <Link to={`/tutor/courses/edit-topic-quiz/${quiz.id}`} className='text-secondary'>
                                        <i class="fa-regular fa-eye"></i>
                                      </Link>
                                    </td>
                                  </tr>
                                ))
                              }

                            </tbody>

                          </table>
                        </div> {/* end .table-responsive*/}
                      </div>
                      {
                        currentQuizs.length === 0 && (
                          <p className='text-center mt-3'>No quizzes found.</p>
                        )
                      }
                      <div className='container-fluid'>
                        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                          <ReactPaginate
                            previousLabel={<AiFillCaretLeft style={{ color: "#000", fontSize: "14px" }} />}
                            nextLabel={<AiFillCaretRight style={{ color: "#000", fontSize: "14px" }} />}
                            breakLabel={'...'}
                            breakClassName={'page-item'}
                            breakLinkClassName={'page-link'}
                            pageCount={pageCount}
                            marginPagesDisplayed={2}
                            pageRangeDisplayed={5}
                            onPageChange={handlePageClick}
                            containerClassName={'pagination'}
                            activeClassName={'active'}
                            previousClassName={'page-item'}
                            nextClassName={'page-item'}
                            pageClassName={'page-item'}
                            previousLinkClassName={'page-link'}
                            nextLinkClassName={'page-link'}
                            pageLinkClassName={'page-link'}
                          />
                        </div>
                      </div>
                      <div className='mt-2'>
                        <div className="row">
                          <div className="col-md-2">
                            <h4>Created Assignments:</h4>
                          </div>
                          <div className="col-md-6">
                            <Link to={`/tutor/courses/create/create-class-course/create-topic-assignment/${storedClassTopicId}`}>
                              <h4>  <i className="fas fa-plus-circle text-success"></i></h4>
                            </Link>
                          </div>
                        </div>

                        <div className="table-responsive">
                          <table id="demo-foo-filtering" className="table table-borderless table-hover table-nowrap table-centered mb-0" data-page-size={7}>
                            <thead className="thead-light">
                              <tr>
                                <th>No.</th>
                                <th>Time</th>
                                <th>Grade To Pass</th>
                                <th data-hide="phone">Created Date</th>
                                <th data-hide="phone, tablet">Updated Date</th>
                                <th>Action</th>
                              </tr>
                            </thead>
                            <tbody>
                              {
                                currentAssignments.length > 0 && currentAssignments.map((assignment, index) => (
                                  <tr key={assignment.id}>
                                    <td>{index + 1}</td>
                                    <td>{assignment.deadline} mins</td>
                                    <td>{assignment.gradeToPass} </td>
                                    <td>{new Date(assignment.createdDate).toLocaleString('en-US')}</td>
                                    {
                                      assignment.updatedDate && (
                                        <td>{new Date(assignment.updatedDate).toLocaleString('en-US')}</td>

                                      )
                                    }
                                    {
                                      !assignment.updatedDate && (
                                        <td><i class="fa-solid fa-ban"></i></td>

                                      )
                                    }
                                    <td>
                                      <Link to={`/tutor/courses/edit-topic-assignment/${assignment.id}`} className='text-secondary'>
                                        <i class="fa-regular fa-eye"></i>
                                      </Link>
                                    </td>
                                  </tr>
                                ))
                              }
                            </tbody>

                          </table>
                        </div> {/* end .table-responsive*/}
                      </div>
                      {
                        currentAssignments.length === 0 && (
                          <p className='text-center mt-3'>No assignments found.</p>
                        )
                      }
                      <div className='container-fluid'>
                        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                          <ReactPaginate
                            previousLabel={<AiFillCaretLeft style={{ color: "#000", fontSize: "14px" }} />}
                            nextLabel={<AiFillCaretRight style={{ color: "#000", fontSize: "14px" }} />}
                            breakLabel={'...'}
                            breakClassName={'page-item'}
                            breakLinkClassName={'page-link'}
                            pageCount={pageCount3}
                            marginPagesDisplayed={2}
                            pageRangeDisplayed={5}
                            onPageChange={handlePageClick3}
                            containerClassName={'pagination'}
                            activeClassName={'active'}
                            previousClassName={'page-item'}
                            nextClassName={'page-item'}
                            pageClassName={'page-item'}
                            previousLinkClassName={'page-link'}
                            nextLinkClassName={'page-link'}
                            pageLinkClassName={'page-link'}
                          />
                        </div>
                      </div>
                      <div>
                        <div className="row">
                          <div className="col-md-2">
                            <h4>Created Materials:</h4>
                          </div>
                          <div className="col-md-6">
                            <Link to={`/tutor/courses/create-class-material/${storedClassTopicId}`}>
                              <h4>  <i className="fas fa-plus-circle text-success"></i></h4>
                            </Link>
                          </div>
                        </div>

                        <div className="table-responsive">
                          <table id="demo-foo-filtering" className="table table-borderless table-hover table-nowrap table-centered mb-0" data-page-size={7}>
                            <thead className="thead-light">
                              <tr>
                                <th data-toggle="true">Material Name</th>
                                {/* <th>Url</th> */}
                                <th data-hide="phone">Created Date</th>
                                <th>Action</th>
                              </tr>
                            </thead>
                            <tbody>
                              {
                                currentLessonMaterials.length > 0 && currentLessonMaterials.map((material) => (
                                  <tr key={material.id}>
                                    <td><Link to={material.materialUrl} target="_blank" rel="noopener noreferrer" className='text-success'>{material.name}</Link></td>
                                    {/* <td>{material.materialUrl}</td> */}
                                    <td>{new Date(material.createdDate).toLocaleString('en-US')}</td>
                                    <td>
                                      <Link to={`/tutor/courses/edit-class-material/${material.id}`} className='text-danger'>
                                        <i class="fas fa-trash-alt"></i>
                                      </Link>
                                    </td>
                                  </tr>

                                ))

                              }



                            </tbody>

                          </table>


                        </div> {/* end .table-responsive*/}
                        {
                          currentLessonMaterials.length === 0 && (
                            <p className='text-center mt-3'>No materials found.</p>
                          )
                        }
                      </div>
                      <div className='container-fluid'>
                        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                          <ReactPaginate
                            previousLabel={<AiFillCaretLeft style={{ color: "#000", fontSize: "14px" }} />}
                            nextLabel={<AiFillCaretRight style={{ color: "#000", fontSize: "14px" }} />}
                            breakLabel={'...'}
                            breakClassName={'page-item'}
                            breakLinkClassName={'page-link'}
                            pageCount={pageCount2}
                            marginPagesDisplayed={2}
                            pageRangeDisplayed={5}
                            onPageChange={handlePageClick2}
                            containerClassName={'pagination'}
                            activeClassName={'active'}
                            previousClassName={'page-item'}
                            nextClassName={'page-item'}
                            pageClassName={'page-item'}
                            previousLinkClassName={'page-link'}
                            nextLinkClassName={'page-link'}
                            pageLinkClassName={'page-link'}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="form-group mb-0">
                    <Link
                      to={`/tutor/courses/edit-class-module/${classTopic.classLesson?.classModuleId}`}
                      className="btn btn-black" style={{ borderRadius: '50px', padding: `8px 25px` }}

                    >
                      <i class="fas fa-long-arrow-alt-left"></i> Back to Class Information
                    </Link>
                  </div>
                </div>

              </div>

            </div>

            {showEditTopicModal && (
              <div className="modal" tabIndex="-1" role="dialog" style={{ display: 'block', backgroundColor: 'rgba(29, 29, 29, 0.75)' }}>
                <div className="modal-dialog modal-lg" role="document">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h5 className="modal-title">Edit Topic</h5>
                      <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={closeEditTopicModal}>
                        <span aria-hidden="true">&times;</span>
                      </button>
                    </div>
                    {/* Conditional rendering based on edit mode */}
                    <>
                      <form onSubmit={(e) => submitClassTopic(e)}>
                        <div className="modal-body" style={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}> {/* Added style for scrolling */}

                          <div className="table-responsive">
                            <table className="table table-hover mt-3">
                              <tbody>
                                <tr>
                                  <th style={{ width: '30%' }}>Name:</th>
                                  <td>
                                    <input type="text" className="form-control" name="name" value={classTopic.name} onChange={(e) => handleChange(e)} style={{ borderRadius: '50px', padding: `8px 25px` }} />
                                    {errors.name && <p className="text-danger">{errors.name}</p>}
                                  </td>
                                </tr>

                                <tr>
                                  <th>Description:</th>
                                  <td>
                                    <textarea type="text" className="form-control" name="description" value={classTopic.description} onChange={(e) => handleChange(e)} style={{ borderRadius: '20px', padding: `8px 25px`, height: '150px' }}></textarea>
                                    {errors.description && <p className="text-danger">{errors.description}</p>}
                                  </td>
                                </tr>

                              </tbody>
                            </table>
                          </div>
                        </div>
                        <div className="modal-footer">
                          <button type="submit" className="btn btn-success" style={{ borderRadius: '50px', padding: `8px 25px` }}>Save Changes</button>
                          <button
                            type="button" onClick={handleDeactivate}
                            className="btn btn-danger ml-2"
                            style={{ borderRadius: '50px', padding: `8px 25px` }}
                          >
                            Deactivate
                          </button>
                          <button type="button" className="btn btn-dark" onClick={closeEditTopicModal} style={{ borderRadius: '50px', padding: `8px 25px` }}>Close</button>
                        </div>
                      </form>
                    </>


                  </div>
                </div>
              </div>
            )}
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

          .page-item.active .page-link{
            background-color: #20c997;
            border-color: #20c997;
        }
        .truncate-text {
          max-width: 200px; /* Adjust max-width as needed */
          overflow: hidden;
          text-overflow: ellipsis;
      }

      .loading-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        backdrop-filter: blur(10px); /* Apply blur effect */
        -webkit-backdrop-filter: blur(10px); /* For Safari */
        background-color: rgba(0, 0, 0, 0.5); /* Semi-transparent black background */
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 9999; /* Ensure it's on top of other content */
    }
    
    .loading-spinner {
        border: 8px solid rgba(245, 141, 4, 0.1); /* Transparent border to create the circle */
        border-top: 8px solid #f58d04; /* Orange color */
        border-radius: 50%;
        width: 50px;
        height: 50px;
        animation: spin 1s linear infinite; /* Rotate animation */
    }
    
    @keyframes spin {
        0% {
            transform: rotate(0deg);
        }
        100% {
            transform: rotate(360deg);
        }
    }


        `}
      </style>
    </>
  );
};

export default EditTopic;
