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

const CreateTopic = () => {
  const storedLoginStatus = sessionStorage.getItem('isLoggedIn');

  const navigate = useNavigate();
  if (!storedLoginStatus) {
      navigate(`/login`)
  }
const { storedClassLessonId } = useParams();
  const [createdTopics, setCreatedTopics] = useState([]);

  const [classLesson, setClassLesson] = useState({
    classHours: '',
    classUrl: '',
  });

  const [classModule, setClassModule] = useState({
    startDate: '',
  });



  useEffect(() => {
    if (storedClassLessonId) {
      classLessonService
        .getClassLessonById(storedClassLessonId)
        .then((res) => {
          setClassLesson(res.data);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [storedClassLessonId]);


  useEffect(() => {
    if (classLesson.classModuleId) {
      classModuleService
        .getModuleById(classLesson.classModuleId)
        .then((res) => {
          setClassModule(res.data);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [classLesson.classModuleId]);

  //create class topic
  const [classTopic, setClassTopic] = useState({
    name: "",
    description: "",
    materialUrl: "",
    classLessonId: storedClassLessonId
  });

  const handleListTopics = () => {
    navigate(`/tutor/courses/create/create-class-course/list-topic/${storedClassLessonId}`);
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setClassTopic({ ...classTopic, [e.target.name]: value });
  }

  const listTopicsByClassLessonId = async (storedClassLessonId) => {
    try {
      const listClassTopicsByClassLesson = await classLessonService.getAllClassTopicsByClassLesson(storedClassLessonId);

      console.log('this is list:', listClassTopicsByClassLesson.data);

      setCreatedTopics(listClassTopicsByClassLesson.data);
    } catch (error) {
      console.log(error);
    }
  };




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

      await listTopicsByClassLessonId(storedClassLessonId);

    } catch (error) {
      console.log(error);
    }
  };


  useEffect(() => {
    if (storedClassLessonId) {
      listTopicsByClassLessonId(storedClassLessonId);
    }
  }, [storedClassLessonId]);
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
                        CLASS - <span className='text-success'>{classModule.startDate ? new Date(classModule.startDate).toLocaleDateString('en-US') : "No start date"}</span>  | LESSON - <span className='text-success'>{classLesson.classHours}</span>
                      </h4>
                      <form
                        method="post"
                        data-parsley-validate
                        onSubmit={(e) => submitClassTopic(e)}
                      >
                        <div className="form-group">
                          <label htmlFor="classHours">Class Hours * :</label>
                          <input
                            type="text"
                            className="form-control"
                            name="classHours"
                            id="classHours"
                            value={classLesson.classHours}
                            readOnly
                            style={{ borderRadius: '50px', padding: `8px 25px` }}

                          />
                        </div>


                        <div className="form-group">
                          <label htmlFor="roomLink">Room Link * :</label>
                          <input
                            type="text"
                            className="form-control"
                            name="roomLink"
                            id="roomLink"
                            value={classLesson.classUrl}
                            readOnly
                            style={{ borderRadius: '50px', padding: `8px 25px` }}

                          />
                        </div>

                        <div className="form-group">
                          <h2 htmlFor="topic">Topic</h2>

                        </div>
                        <div className="form-group">
                          <label htmlFor="name">Name * :</label>
                          <input type="text" className="form-control" name="name" id="name"
                            value={classTopic.name} onChange={(e) => handleChange(e)} required style={{ borderRadius: '50px', padding: `8px 25px` }}
                          />
                        </div>
                        <div className="form-group">
                          <label htmlFor="code">Description * :</label>
                          <textarea type="text" className="form-control" name="description"
                            id="description" value={classTopic.description} onChange={(e) => handleChange(e)} required style={{ borderRadius: '8px', padding: `8px 25px`}}
                          ></textarea>
                        </div>
                        {/* <div className="form-group">
                          <label htmlFor="code">Materials * :</label>
                          <input type="text" className="form-control" name="materialUrl" id="materialUrl" value={classTopic.materialUrl} onChange={(e) => handleChange(e)} />
                        </div> */}
                        <div className="form-group mb-0">
                          <button
                            type="submit"
                            className="btn btn-success mr-2" style={{ borderRadius: '50px', padding: `8px 25px` }}

                          >
                            Create
                          </button>
                          {/* <button
                            type="button"
                            className="btn btn-dark"
                            onClick={handleListTopics}
                          >
                            List Topics
                          </button> */}
                        </div>
                      </form>

                      {/* Display created topics */}
                      <div>
                        <h4>Created Topics:</h4>
                        {/* {Array.isArray(createdTopics) && createdTopics.length > 0 ? (
                          <ul className='text-success'>
                            {createdTopics.map((topic) => (
                              <li key={topic.id}>Topic: <span style={{ fontWeight: 'bold' }}>{topic.name}</span>
                                &nbsp;&nbsp;&nbsp;&nbsp;
                                <span>
                                  <Link to={`/tutor/courses/list-material-by-topic/${topic.id}`}>
                                    <span className='text-dark mr-2'><i class="fas fa-file-alt"></i> View materials</span></Link>
                                </span>
                                <Link to={`/tutor/courses/create/create-class-course/create-quiz/${topic.id}`}>
                                  <span className='text-success'><i class="fas fa-long-arrow-alt-right"></i> Create Quiz</span>
                                </Link>

                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p>No topics created yet.</p>
                        )} */}
                        <div className="table-responsive">
                          <table id="demo-foo-filtering" className="table table-borderless table-hover table-wrap table-centered mb-0" data-page-size={7}>
                            <thead className="thead-light">
                              <tr>
                                <th data-toggle="true">No.</th>
                                <th data-toggle="true">Topic Name</th>
                                <th>Description</th>
                                <th data-hide="phone">Created Date</th>
                                <th data-hide="phone, tablet">Updated Date</th>
                                <th>Action</th>
                              </tr>
                            </thead>
                            <tbody>
                              {
                                createdTopics.length > 0 && createdTopics.map((classTopic, index) => (
                                  <tr key={classTopic.id}>
                                    <td>{index + 1}</td>
                                    <td>{classTopic.name}</td>
                                    <td>{classTopic.description}</td>
                                    <td>{classTopic.createdDate}</td>
                                    <td>{classTopic.updatedDate}</td>
                                    <td>
                                      <Link to={`/tutor/courses/edit-topic/${classTopic.id}`} className='text-secondary'>
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

                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div >
      </div >

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

export default CreateTopic;
