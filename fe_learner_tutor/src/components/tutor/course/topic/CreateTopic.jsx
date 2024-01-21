import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../Header';
import Sidebar from '../../Sidebar';
import Footer from '../../Footer';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const CreateTopic = () => {
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

  const [topics, setTopics] = useState([]); // State to store created topics

  const handleSubmit = (event) => {
    event.preventDefault();

    // Add the new topic to the topics array
    const newTopic = {
      startTime: formData.startTime,
      endTime: formData.endTime,
      roomLink: formData.roomLink,
      topic: formData.topic,
    };

    setTopics([...topics, newTopic]);
    setFormData({
      image: '',
      price: '',
      fullname: '',
      tags: '',
      description: '',
      startTime: formData.startTime,
      endTime: formData.endTime,
      roomLink: '',
      topic: '',
    });
  };


  const handleListTopics = () => {
    navigate("/tutor/courses/create/create-class-course/list-topic")
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
                          <label htmlFor="startTime">Start Time * :</label>
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
                          <label htmlFor="endTime">End Time * :</label>
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
                            value={formData.roomLink}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                roomLink: e.target.value,
                              })
                            }
                          />
                        </div>

                        <div className="form-group">
                          <label htmlFor="topic">Topic * :</label>
                          <textarea
                            id="topic"
                            className="form-control"
                            name="topic"
                            data-parsley-trigger="keyup"
                            data-parsley-minlength={20}
                            data-parsley-maxlength={100}
                            data-parsley-minlength-message="Come on! You need to enter at least a 20 character comment.."
                            data-parsley-validation-threshold={10}
                            value={formData.topic}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                topic: e.target.value,
                              })
                            }
                          />
                        </div>

                        <div className="form-group mb-0">
                          <button
                            type="submit"
                            className="btn btn-primary mr-2"
                            onClick={handleSubmit}
                          >
                            Create Topic
                          </button>
                          <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={handleListTopics}
                          >
                            List Topics
                          </button>
                        </div>
                      </form>

                      {/* Display created topics */}
                      <div>
                        <h4>Created Topics:</h4>
                        <ul>
                          {topics.map((topic, index) => (
                            <li key={index}>
                              <strong>Start Time:</strong> {topic.startTime.toLocaleTimeString()} |
                              <strong> End Time:</strong> {topic.endTime.toLocaleTimeString()} |
                              <strong> Room Link:</strong> {topic.roomLink} |
                              <strong> Topic:</strong> {topic.topic}
                            </li>
                          ))}
                        </ul>
                      </div>
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

export default CreateTopic;
