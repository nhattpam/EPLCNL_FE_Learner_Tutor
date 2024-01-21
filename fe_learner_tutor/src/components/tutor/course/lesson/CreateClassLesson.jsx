import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../Header';
import Sidebar from '../../Sidebar';
import Footer from '../../Footer';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const CreateClassLesson = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    image: '',
    price: '',
    fullname: '',
    tags: '',
    description: '',
    startTime: new Date(),
    endTime: new Date(),
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    navigate('/tutor/courses/create/create-class-course/create-topic');
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
                        Create a Class course: Course ABC | Class 20-01-2024
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
                            selected={formData.startTime}
                            onChange={(date) =>
                              setFormData({ ...formData, startTime: date })
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
                            selected={formData.endTime}
                            onChange={(date) =>
                              setFormData({ ...formData, endTime: date })
                            }
                            showTimeSelect
                            showTimeSelectOnly
                            dateFormat="h:mm aa"
                            timeIntervals={15}
                            className="form-control"
                          />
                        </div>

                        <div className="form-group">
                          <label htmlFor="roomLink">Room Link * :</label>
                          <input
                            type="text"
                            className="form-control"
                            name="roomLink"
                            id="roomLink"
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
