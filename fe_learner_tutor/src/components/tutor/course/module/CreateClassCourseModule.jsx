import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from "react-router-dom";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Header from '../../Header';
import Sidebar from '../../Sidebar';
import Footer from '../../Footer';
import courseService from '../../../../services/course.service';
import classModuleService from '../../../../services/class-module.service';

const CreateClassCourseModule = () => {
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [msg, setMsg] = useState('');


  const [course, setCourse] = useState({
    name: "",
  });

  const { storedCourseId } = useParams();

  useEffect(() => {
    if (storedCourseId) {
      courseService
        .getCourseById(storedCourseId)
        .then((res) => {
          setCourse(res.data);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [storedCourseId]);

  const [module, setModule] = useState({
    startDate: new Date(), // Initialize startDate with the current date
    courseId: storedCourseId
  });

  const handleChange = (date) => {
    setModule({ ...module, startDate: date });
  };

  const handleSubmit = (storedModuleId) => {
    // Handle your form submission logic here
    // Redirect to the next page or perform any other actions
    navigate(`/tutor/courses/create/create-class-course/create-class-lesson/${storedModuleId}`);
  };

  const validateForm = () => {
    let isValid = true;
    const errors = {};


    setErrors(errors);
    return isValid;
  };


  const submitModule = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      try {
        // Save account
        console.log(JSON.stringify(module))
        const moduleResponse = await classModuleService.saveModule(module);
        console.log(moduleResponse.data);

        setMsg('Module Added Successfully');

        const moduleJson = JSON.stringify(moduleResponse.data);

        const moduleJsonParse = JSON.parse(moduleJson);

        handleSubmit(moduleJsonParse.id);

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
            <div className="container-fluid">
              <div className="row">
                <div className="col-12">
                  <div className="card">
                    <div className="card-body">
                      <h4 className="header-title">COURSE - <span className='text-success'>{course.name}</span> </h4>
                      <form onSubmit={(e) => submitModule(e)}>
                        <div className="form-group">
                          <label htmlFor="moduleName">Class Date:</label> &nbsp;
                          <DatePicker
                            className="form-control"
                            selected={module.startDate} // Use selected instead of value
                            onChange={(date) => handleChange(date)}
                            dateFormat="dd/MM/yyyy"
                            placeholderText="Select Date"
                          />
                        </div>
                        <div className="form-group mb-0">
                          <button type="submit" className="btn btn-success">
                            <i class="fas fa-forward"></i> Continue
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
