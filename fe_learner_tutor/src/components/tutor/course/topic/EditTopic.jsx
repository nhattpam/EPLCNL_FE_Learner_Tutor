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
  const navigate = useNavigate();

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
    classLesson: ""
  });


  const [classLesson, setClassLesson] = useState({
    classHours: '',
    classUrl: '',
    classModuleId: ''
  });

  const [classModule, setClassModule] = useState({
    startDate: '',
  });




  useEffect(() => {
    if (storedClassTopicId) {
      topicService
        .getClassTopicById(storedClassTopicId)
        .then((res) => {
          setClassTopic(res.data);
          console.log(classTopic)
        })
        .catch((error) => {
          console.log(error);
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

  const handleChange = (e) => {
    const value = e.target.value;
    setClassTopic({ ...classTopic, [e.target.name]: value });
  }

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

    try {
      // Save account
      const classTopicResponse = await topicService.saveClassTopic(classTopic);

      // console.log(JSON.stringify(courseResponse));
      // console.log(courseResponse.data);
      const classTopicJson = JSON.stringify(classTopicResponse.data);

      const classTopicJsonParse = JSON.parse(classTopicJson);

      console.log(classTopicJsonParse)

      await listTopicsByClassLessonId(classTopic.classLessonId);

    } catch (error) {
      console.log(error);
    }
  };


  useEffect(() => {
    if (classTopic.classLessonId) {
      listTopicsByClassLessonId(classTopic.classLessonId);
    }
  }, [classTopic.classLessonId]);
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
                      <form
                        method="post"
                        className="mt-3"
                        id="myAwesomeDropzone"
                        data-plugin="dropzone"
                        data-previews-container="#file-previews"
                        data-upload-preview-template="#uploadPreviewTemplate"
                        data-parsley-validate
                        onSubmit={(e) => submitClassTopic(e)}
                      >
                        <div className="form-group">
                          <label htmlFor="roomLink">Class Date:</label>
                          <p className='ml-2'>{classTopic.classLesson?.classHours}</p>

                        </div>


                        <div className="form-group">
                          <label htmlFor="roomLink">Room Link :</label>
                          <p className='ml-2'>{classTopic.classLesson?.classUrl}</p>

                        </div>

                        <div className="form-group">
                          <h2 htmlFor="topic">Topic</h2>

                        </div>
                        <div className="form-group">
                          <label htmlFor="name">Name :</label>
                          <p className='ml-2'>{classTopic.name}</p>
                        </div>
                        <div className="form-group">
                          <label htmlFor="code">Description :</label>
                          <p className='ml-2'>{classTopic.description}</p>

                        </div>

                        <div className="form-group mb-0">
                          <button
                            type="submit"
                            className="btn btn-success mr-2" style={{ borderRadius: '50px', padding: `8px 25px` }}

                          >
                            Update
                          </button>

                          <Link
                            to={`/tutor/courses/edit-class-module/${classTopic.classLesson?.classModuleId}`}
                            className="btn btn-black" style={{ borderRadius: '50px', padding: `8px 25px` }}

                          >
                            <i class="fas fa-long-arrow-alt-left"></i> Back to Class Information
                          </Link>
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
                                      <span className="badge label-table badge-success">{quiz.gradeToPass} </span>
                                    </td>
                                    <td>{quiz.deadline} mins</td>
                                    <td>{quiz.createdDate}</td>
                                    <td>{quiz.updatedDate}</td>
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
                          <p className='text-center'>No quizzes found.</p>
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
                                <th>Question</th>
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
                                    <td className='truncate-text' dangerouslySetInnerHTML={{ __html: assignment.questionText }} />
                                    <td>{assignment.createdDate}</td>
                                    <td>{assignment.updatedDate}</td>
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
                          <p className='text-center'>No assignments found.</p>
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
                                <th data-hide="phone, tablet">Updated Date</th>
                                <th>Action</th>
                              </tr>
                            </thead>
                            <tbody>
                              {
                                currentLessonMaterials.length > 0 && currentLessonMaterials.map((material) => (
                                  <tr key={material.id}>
                                    <td>{material.name}</td>
                                    {/* <td>{material.materialUrl}</td> */}
                                    <td>{material.createdDate}</td>
                                    <td>{material.updatedDate}</td>
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
                            <p className='text-center'>No materials found.</p>
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

          .page-item.active .page-link{
            background-color: #20c997;
            border-color: #20c997;
        }
        .truncate-text {
          max-width: 200px; /* Adjust max-width as needed */
          overflow: hidden;
          text-overflow: ellipsis;
      }
        `}
      </style>
    </>
  );
};

export default EditTopic;
