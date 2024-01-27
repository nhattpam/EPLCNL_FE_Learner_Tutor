import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '../../Header';
import Sidebar from '../../Sidebar';
import Footer from '../../Footer';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import classModuleService from '../../../../services/class-module.service';
import classLessonService from '../../../../services/class-lesson.service';

const CreateClassLesson = () => {
  const navigate = useNavigate();
  const { storedModuleId } = useParams();


  const [classLesson, setClassLesson] = useState({
    classHours: '',
    classUrl: '',
    classModuleId: storedModuleId,
  });

  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const handleChangeStartTime = (date) => {
    setStartTime(date);
  };

  const handleChangeEndTime = (date) => {
    setEndTime(date);
  };

  const [module, setModule] = useState({
    name: '',
  });


  const handleChange = (e) => {
    const { value } = e.target;
    setClassLesson({ ...classLesson, classUrl: value });
  };


  useEffect(() => {
    if (storedModuleId) {
      classModuleService
        .getModuleById(storedModuleId)
        .then((res) => {
          setModule(res.data);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [storedModuleId]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const classHours = `${startTime.toLocaleTimeString([], {
      hour: 'numeric',
      minute: '2-digit',
    })} - ${endTime.toLocaleTimeString([], {
      hour: 'numeric',
      minute: '2-digit',
    })}`;
    setClassLesson({ ...classLesson, classHours });


    console.log(classLesson)
    // Save class lesson
    const classLessonResponse = await classLessonService.saveClassLesson(classLesson);

    // console.log(JSON.stringify(courseResponse));
    // console.log(courseResponse.data);
    const classLessonJson = JSON.stringify(classLessonResponse.data);

    const classLessonJsonParse = JSON.parse(classLessonJson);

    console.log('thanh cong: ' + classLessonJsonParse.id)

    // navigate(`/tutor/course/list-course-by-tutor/${tutorId}`);
    navigate(`/tutor/courses/create/create-class-course/create-topic/${classLessonJsonParse.id}`);
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
                        Create a Class course: Course ABC | Class {module.startDate}
                      </h4>
                      <form
                        method="post"
                        className="dropzone"
                        id="myAwesomeDropzone"
                        data-plugin="dropzone"
                        data-previews-container="#file-previews"
                        data-upload-preview-template="#uploadPreviewTemplate"
                        data-parsley-validate
                      >

                        <div className="form-group">
                          <label htmlFor="startTime">Start Time * :</label>&nbsp;
                          <DatePicker
                            selected={startTime}
                            onChange={(date) =>
                              handleChangeStartTime(date)
                            }
                            showTimeSelect
                            showTimeSelectOnly
                            dateFormat="h:mm aa"
                            timeIntervals={15}
                            className="form-control"
                          />
                        </div>

                        <div className="form-group">
                          <label htmlFor="endTime">End Time * :</label>&nbsp;
                          <DatePicker
                            selected={endTime}
                            onChange={(date) =>
                              handleChangeEndTime(date)
                            }
                            showTimeSelect
                            showTimeSelectOnly
                            dateFormat="h:mm aa"
                            timeIntervals={15}
                            className="form-control"
                          />
                        </div>



                        <div className="form-group">
                          <label htmlFor="classUrl">Room Link * :</label>
                          <input
                            type="text"
                            className="form-control"
                            name="classUrl"
                            id="classUrl"
                            value={classLesson.classUrl}
                            onChange={handleChange} // Pass the function directly
                          />
                        </div>

                        <div className="form-group mb-0">
                          <button
                            type="submit"
                            className="btn btn-primary"
                            onClick={handleSubmit}
                          >
                            Continue
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

export default CreateClassLesson;
