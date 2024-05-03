import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from "react-router-dom";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Header from '../../Header';
import Sidebar from '../../Sidebar';
import Footer from '../../Footer';
import courseService from '../../../../services/course.service';
import classModuleService from '../../../../services/class-module.service';
import classLessonService from '../../../../services/class-lesson.service';

const CreateClassCourseModule = () => {
  const storedLoginStatus = sessionStorage.getItem('isLoggedIn');

  const navigate = useNavigate();
  if (!storedLoginStatus) {
    navigate(`/login`)
  }
  const [errors, setErrors] = useState({});
  const [msg, setMsg] = useState('');
  const [createButtonClicked, setCreateButtonClicked] = useState(false); // State variable to track button click


  const [course, setCourse] = useState({
    name: "",
  });

  const [classModuleList, setClassModuleList] = useState([]);


  const { storedCourseId } = useParams();
  const [storedModuleId, setStoredModuleId] = useState("");


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
      courseService
        .getAllClassModulesByCourse(storedCourseId)
        .then((res) => {
          setClassModuleList(res.data);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [storedCourseId]);


  const initialStartDate = new Date();
  console.log(initialStartDate); // Check if this prints a valid date object
  const [module, setModule] = useState({
    startDate: initialStartDate,
    courseId: storedCourseId
  });

  const handleChange = (date) => {
    // Check if the selected date is in the past
    const currentDate = new Date();
    if (date < currentDate) {
      window.alert("Please select a date in the future.");
      return;
    }
  
    // Check if the selected date coincides with existing startDate values
    const startDateExists = classModuleList.some(module => {
      // Convert database startDate to Date object
      const moduleStartDate = new Date(module.startDate);
      // Check if the selected date matches any existing startDate
      return moduleStartDate.getFullYear() === date.getFullYear() &&
             moduleStartDate.getMonth() === date.getMonth() &&
             moduleStartDate.getDate() === date.getDate();
    });
  
    if (startDateExists) {
      window.alert("Please select a date that does not coincide with existing class dates.");
      return;
    }
  
    // Update the module with the selected date
    setModule(prevModule => ({
      ...prevModule,
      startDate: date
    }));
  };
  
  


  // const handleSubmit = (storedModuleId) => {
  //   // Handle your form submission logic here
  //   // Redirect to the next page or perform any other actions
  //   navigate(`/tutor/courses/create/create-class-course/create-class-lesson/${storedModuleId}`);
  // };

  const validateForm = () => {
    let isValid = true;
    const errors = {};


    if (classLesson.classUrl.trim() === "") {
      errors.classUrl = "Link is required";
      isValid = false;
    }

    setErrors(errors);
    return isValid;
  };


  const submitModule = async (e) => {
    e.preventDefault();

    if (!module.startDate) {
      console.error("Please select a valid date.");
      return;
    }


    try {
      // Save module
      console.log(JSON.stringify(module));
      const moduleResponse = await classModuleService.saveModule(module);
      console.log(moduleResponse.data);

      setMsg('Module Added Successfully');

      const moduleJson = JSON.stringify(moduleResponse.data);
      const moduleJsonParse = JSON.parse(moduleJson);

      setCreateButtonClicked(true);

      console.log('this is module IDDDD: ' + moduleJsonParse.id)

      setStoredModuleId(moduleJsonParse.id); // Update storedModuleId using setStoredModuleId

    } catch (error) {
      console.log(error);
    }
  };


  //class lesson
  const [classLesson, setClassLesson] = useState({
    classHours: '',
    classUrl: '',
    classModuleId: '',
  });

  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const handleChangeStartTime = (date) => {
    setStartTime(date);
  };

  const handleChangeEndTime = (date) => {
    setEndTime(date);
  };


  useEffect(() => {
    console.log("createButtonClicked:", createButtonClicked);
  }, [createButtonClicked]);


  const handleClassLessonChange = (e) => {
    const { value } = e.target;
    setClassLesson({ ...classLesson, classUrl: value });
  };

  useEffect(() => {
    // Update classLesson whenever storedModuleId changes
    setClassLesson(prevClassLesson => ({
      ...prevClassLesson,
      classModuleId: storedModuleId
    }));
  }, [storedModuleId]);

  useEffect(() => {
    const classHours = `${startTime.toLocaleTimeString([], {
      hour: 'numeric',
      minute: '2-digit',
    })} - ${endTime.toLocaleTimeString([], {
      hour: 'numeric',
      minute: '2-digit',
    })}`;

    // Use the callback function to ensure the latest state is used
    setClassLesson((prevClassLesson) => ({
      ...prevClassLesson,
      classHours: classHours,
    }));
  }, [startTime, endTime]);



  const handleClassLessonSubmit = async (event) => {
    event.preventDefault();


    console.log(classLesson);
    if (validateForm()) {
      // Save class lesson
      const classLessonResponse = await classLessonService.saveClassLesson(classLesson);

      // console.log(JSON.stringify(courseResponse));
      // console.log(courseResponse.data);
      const classLessonJson = JSON.stringify(classLessonResponse.data);

      const classLessonJsonParse = JSON.parse(classLessonJson);

      console.log('thanh cong: ' + classLessonJsonParse.id)


      // navigate(`/tutor/course/list-course-by-tutor/${tutorId}`);
      navigate(`/tutor/courses/create/create-class-course/create-topic/${classLessonJsonParse.id}`);
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
                          <div className="row" style={{ opacity: !createButtonClicked ? 1 : 0.5, pointerEvents: !createButtonClicked ? 'auto' : 'none' }}>
                            <div className="col-md-4" >
                              <DatePicker
                                className="form-control custom-datepicker"
                                selected={module.startDate} // Use selected instead of value
                                onChange={(date) => handleChange(date)}
                                dateFormat="dd/MM/yyyy"
                                placeholderText="Select Date"
                                style={{ borderRadius: '50px', padding: `8px 25px` }}
                              />
                            </div>
                            {!createButtonClicked && (
                              <div className="col-md-2" style={{ marginLeft: '-200px' }}>
                                <button type="submit" className="btn btn-success" style={{ borderRadius: '50px', padding: `8px 25px` }}>
                                  Select
                                </button>
                              </div>
                            )}
                          </div>

                        </div>

                      </form>
                      <div className="row" style={{ opacity: createButtonClicked ? 1 : 0.5, pointerEvents: createButtonClicked ? 'auto' : 'none' }}>

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
                            className="form-control custom-datepicker"

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
                            className="form-control custom-datepicker"
                          />
                        </div>



                        <div className="form-group">
                          {errors.classUrl && (
                            <div className="text-danger">{errors.classUrl}</div>
                          )}
                          <label htmlFor="classUrl">Room Link * :</label>
                          <input
                            type="text"
                            className="form-control"
                            name="classUrl"
                            id="classUrl"
                            value={classLesson.classUrl}
                            onChange={handleClassLessonChange} // Pass the function directly
                            required
                            style={{ borderRadius: '50px', padding: `8px 25px` }}
                          />
                        </div>

                        <div className="form-group mb-0">
                          <button
                            type="submit"
                            className="btn btn-success"
                            onClick={handleClassLessonSubmit}
                            style={{ borderRadius: '50px', padding: `8px 25px` }}
                          >
                            Continue

                          </button>
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
          .custom-datepicker {
            border-radius: 50px;
            padding: 8px 25px;
        }
        
        `}
      </style>
    </>
  );
};

export default CreateClassCourseModule;
