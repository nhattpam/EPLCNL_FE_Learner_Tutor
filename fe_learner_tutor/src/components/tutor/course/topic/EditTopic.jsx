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

  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [currentPage2, setCurrentPage2] = useState(0);
  const [quizsPerPage] = useState(2);
  const [materialsPerPage] = useState(2);

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


  const offset2 = currentPage2 * materialsPerPage;
  const currentLessonMaterials = filteredLessonMaterials.slice(offset, offset + materialsPerPage);


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
                        DATE - <span className='text-success'>{classModule.startDate}</span>
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
                          <label htmlFor="roomLink">Class Time :</label>
                          <input
                            type="text"
                            className="form-control"
                            name="classHours"
                            id="classHours"
                            value={classTopic.classLesson?.classHours}
                          />
                        </div>


                        <div className="form-group">
                          <label htmlFor="roomLink">Room Link :</label>
                          <input
                            type="text"
                            className="form-control"
                            name="roomLink"
                            id="roomLink"
                            value={classTopic.classLesson?.classUrl}
                            o
                          />
                        </div>

                        <div className="form-group">
                          <h2 htmlFor="topic">Topic</h2>

                        </div>
                        <div className="form-group">
                          <label htmlFor="name">Name :</label>
                          <input type="text" className="form-control" name="name" id="name" value={classTopic.name} onChange={(e) => handleChange(e)} />
                        </div>
                        <div className="form-group">
                          <label htmlFor="code">Description :</label>
                          <input type="text" className="form-control" name="description" id="description" value={classTopic.description} onChange={(e) => handleChange(e)} />
                        </div>
                        {/* <div className="form-group">
                          <label htmlFor="code">Materials * :</label>
                          <input type="text" className="form-control" name="materialUrl" id="materialUrl" value={classTopic.materialUrl} onChange={(e) => handleChange(e)} />
                        </div> */}
                        <div className="form-group mb-0">
                          <button
                            type="submit"
                            className="btn btn-warning mr-2"
                          >
                            Update
                          </button>
                          <button
                            type="button"
                            className="btn btn-secondary mr-2"
                            onClick={handleListTopics}
                          >
                             List Topics
                          </button>
                          <Link
                            to={`/tutor/courses/edit-class-module/${classTopic.classLesson?.classModuleId}`}
                            className="btn btn-black"
                          >
                            <i class="fas fa-long-arrow-alt-left"></i> Back to Class Information
                          </Link>
                        </div>
                      </form>

                      {/* Display created topics */}
                      <div>
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
                        {/* {Array.isArray(createdTopics) && createdTopics.length > 0 ? (
                          <ul>
                            {createdTopics.map((topic) => (
                              <li key={topic.id}>{topic.name}</li>
                            ))}
                          </ul>
                        ) : (
                          <p>No topics created yet.</p>
                        )} */}
                        <div className="table-responsive">
                          <table id="demo-foo-filtering" className="table table-borderless table-hover table-nowrap table-centered mb-0" data-page-size={7}>
                            <thead className="thead-light">
                              <tr>
                                <th data-toggle="true">No.</th>
                                <th data-toggle="true">Quiz Name</th>
                                <th>Grade to pass</th>
                                <th>Times</th>
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
                                    <td>{quiz.deadline}</td>
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
                          <p>No quizzes found.</p>
                        )
                      }

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

                        {/* {Array.isArray(createdTopics) && createdTopics.length > 0 ? (
                          <ul>
                            {createdTopics.map((topic) => (
                              <li key={topic.id}>{topic.name}</li>
                            ))}
                          </ul>
                        ) : (
                          <p>No topics created yet.</p>
                        )} */}
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
                              {
                                currentLessonMaterials.length === 0 && (
                                  <p>No materials found.</p>
                                )
                              }


                            </tbody>

                          </table>

                        </div> {/* end .table-responsive*/}
                      </div>
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
        `}
      </style>
    </>
  );
};

export default EditTopic;
