import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from "react-router-dom";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import Header from '../../Header';
import Sidebar from '../../Sidebar';
import Footer from '../../Footer';
import moduleService from '../../../../services/module.service';
import lessonService from '../../../../services/lesson.service';

const EditLesson = () => {
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [msg, setMsg] = useState('');
  const { lessonId } = useParams();

  const [lesson, setLesson] = useState({
    name: "",
    moduleId: "",
    videoUrl: "",
    reading: ""
  });

  useEffect(() => {
    lessonService
      .getLessonById(lessonId)
      .then((res) => {
        setLesson(res.data);
        console.log("THIS IS NAME" + res.data.name)

      })
      .catch((error) => {
        console.log(error);
      });
  }, [lessonId]);

  useEffect(() => {
    if (lesson.moduleId) {
      moduleService
        .getModuleById(lesson.moduleId)
        .then((res) => {
          setModule(res.data);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [lesson.moduleId]);

  const [module, setModule] = useState({
    name: "",
  });

  const handleReadingChange = (value) => {
    setLesson({ ...lesson, reading: value });
  };

  const validateForm = () => {
    let isValid = true;
    const errors = {};

    if (lesson.reading.trim() === '') {
      errors.reading = 'Reading is required';
      isValid = false;
    }
    setErrors(errors);
    return isValid;
  };

  const submitLesson = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      try {
        // Save account
        console.log(JSON.stringify(lesson))
        const lessonResponse = await lessonService.savelesson(lesson);
        console.log(lessonResponse.data);

        setMsg('Lesson Added Successfully');

        const lessonJson = JSON.stringify(lessonResponse.data);

        const lessonJsonParse = JSON.parse(lessonJson);


      } catch (error) {
        console.log(error);
      }
    }
  };

  const [materialList, setMaterialList] = useState([]);


  useEffect(() => {
    if (lessonId) {
      lessonService
        .getAllMaterialsByLesson(lessonId)
        .then((res) => {
          setMaterialList(res.data);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [lessonId]);

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
                      <h4 className="header-title">EDITING LESSON - <span className='text-success'>{lesson?.name}</span></h4>

                      <form
                        method="post"
                        className="mt-4"
                        id="myAwesomeDropzone"
                        data-plugin="dropzone"
                        data-previews-container="#file-previews"
                        data-upload-preview-template="#uploadPreviewTemplate"
                        data-parsley-validate
                        onSubmit={submitLesson}>

                        <div className="card" style={{ marginTop: '-20px' }}>
                          {/* <div className='card-body'>
                            <label htmlFor="video">Video Url * :</label>
                            <input type="text" className="form-control" name="videoUrl" id="videoUrl" value={lesson.videoUrl} readOnly />
                          </div> */}

                          <div className='card-body'>
                            <label htmlFor="video">Video Preview:</label>
                            {lesson.videoUrl && (
                              <video controls width="100%" height="300">
                                <source src={lesson.videoUrl} type="video/mp4" />
                                Your browser does not support the video tag.
                              </video>
                            )}
                          </div>

                          <div className='card-body'>
                            <label htmlFor="video">Reading * :</label>
                            <ReactQuill
                              name="reading"
                              value={lesson.reading}
                              modules={{
                                toolbar: [
                                  [{ header: [1, 2, false] }],
                                  ['bold', 'italic', 'underline', 'strike'],
                                  [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                                  [{ 'indent': '-1' }, { 'indent': '+1' }],
                                  [{ 'direction': 'rtl' }],
                                  [{ 'align': [] }],
                                  ['link', 'image', 'video'],
                                  ['code-block'],
                                  [{ 'color': [] }, { 'background': [] }],
                                  ['clean']
                                ]
                              }}
                              theme="snow"
                            />
                          </div>
                          <div className="form-group mb-0  ">
                            <button type="submit" className="btn btn-success " style={{ marginLeft: '23px', marginTop: '10px', borderRadius: '50px', padding: `8px 25px` }} >
                              Update
                            </button>
                           
                            <Link
                              to={`/tutor/courses/edit-module/${lesson.moduleId}`}
                              className="btn btn-black mr-2 mt-2"
                            >
                              <i className="fas fa-long-arrow-alt-left"></i> Back to Module Information
                            </Link>
                          </div>
                        </div>


                      </form>

                      <div className='mt-2'>
                        <h5>Materials of lesson:
                          &nbsp;
                          <Link to={`/tutor/courses/create-lesson-material/${lessonId}`} >
                            <i className="fas fa-plus-circle text-success"></i>
                          </Link>
                        </h5>
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
                              materialList.length > 0 && materialList.map((material) => (
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
                      {materialList.length === 0 && (
                        <p className='text-center'>No materials yet</p>
                      )}
                    </div>



                  </div> {/* end card-box */}

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

export default EditLesson;
