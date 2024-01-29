import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from "react-router-dom";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Import the styles
import Header from '../../Header';
import Sidebar from '../../Sidebar';
import Footer from '../../Footer';
import moduleService from '../../../../services/module.service';
import lessonService from '../../../../services/lesson.service';

const EditLesson = () => {
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [msg, setMsg] = useState('');
  // const { storedModuleId } = useParams();
  const { lessonId } = useParams();

  //tao lesson
  const [lesson, setLesson] = useState({
    name: "",
    moduleId: "",
    videoUrl: "",
    reading: ""
  });

  useEffect(() => {
    if (lessonId) {
      lessonService
        .getLessonById(lessonId)
        .then((res) => {
          setLesson(res.data);
        })
        .catch((error) => {
          console.log(error);
        });
    }
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



  const handleChangeLesson = (value) => {
    setLesson({ ...lesson, questionText: value });
  };

  const validateForm = () => {
    let isValid = true;
    const errors = {};

    if (lesson.questionText.trim() === '') {
      errors.questionText = 'Question is required';
      isValid = false;
    }
    if (!lesson.deadline) {
      errors.deadline = 'Time is required';
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
                      <h4 className="header-title">Create a Video course: Course {module.course?.name} | Module {module.name} </h4>

                      <form
                        method="post"
                        className="dropzone"
                        id="myAwesomeDropzone"
                        data-plugin="dropzone"
                        data-previews-container="#file-previews"
                        data-upload-preview-template="#uploadPreviewTemplate"
                        data-parsley-validate
                        onSubmit={submitLesson} >
                        <div className="card">
                          <div className='card-body'>
                            <label htmlFor="video">Video Url * :</label>
                            <input type="text" className="form-control" name="videoUrl" id="videoUrl" value={lesson.videoUrl} readOnly />
                          </div>
                          <div className='card-body'>
                            <label htmlFor="video">Reading * :</label>
                            <ReactQuill
                              value={lesson.reading}
                              onChange={handleChangeLesson}
                              style={{ height: '300px' }}
                            />
                          </div>
                        </div>
                        <div className="form-group mb-0  ">
                          <button type="submit" className="btn btn-primary " style={{ marginLeft: '23px', marginTop: '10px' }} >
                            Edit
                          </button>
                        </div>
                      </form>
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

export default EditLesson;
