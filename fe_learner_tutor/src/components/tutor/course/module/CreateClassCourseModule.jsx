import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useNavigate } from 'react-router-dom';
import Header from '../../Header';
import Sidebar from '../../Sidebar';
import Footer from '../../Footer';

const CreateClassCourseModule = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    moduleName: '',
    selectedDate: null,
  });

  const handleChange = (date) => {
    setFormData({
      ...formData,
      selectedDate: date,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    navigate('/tutor/courses/create/create-class-course/create-class-lesson');
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
                      <h4 className="header-title">Create a Class Course | Course ABC</h4>
                      <form onSubmit={handleSubmit}>
                        <div className="form-group">
                          <label htmlFor="moduleName">Class Date:</label> &nbsp;
                          <DatePicker
                            className="form-control"
                            selected={formData.selectedDate}
                            onChange={handleChange}
                            dateFormat="dd/MM/yyyy"
                            placeholderText="Select Date"
                          />
                        </div>
                        <div className="form-group mb-0">
                          <button
                            type="button"
                            className="btn btn-primary"
                            onClick={handleSubmit}
                          >
                            Create Lesson
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

export default CreateClassCourseModule;
