import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Header from "../../Header";
import Sidebar from "../../Sidebar";
import Footer from "../../Footer";
import courseService from "../../../../services/course.service";
import moduleService from "../../../../services/module.service";
import ReactPaginate from "react-paginate";
import { AiFillCaretLeft, AiFillCaretRight } from "react-icons/ai";

const CreateVideoCourseModule = () => {
  const storedLoginStatus = sessionStorage.getItem('isLoggedIn');

  const navigate = useNavigate();
  if (!storedLoginStatus) {
      navigate(`/login`)
  }
const [errors, setErrors] = useState({});
  const [msg, setMsg] = useState("");
  const [createButtonClicked, setCreateButtonClicked] = useState(false); // State variable to track button click

  const [course, setCourse] = useState({
    name: "",
  });

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
    }
  }, [storedCourseId]);

  //tao module
  const [module, setModule] = useState({
    name: "",
    courseId: storedCourseId,
  });

  const handleChange = (e) => {
    const value = e.target.value;
    setModule({ ...module, [e.target.name]: value });
  };

  const handleContinue = (storedModuleId) => {
    navigate(
      `/tutor/courses/create/create-video-course/create-module/module-part/${storedModuleId}`
    );
  };

  const validateForm = () => {
    let isValid = true;
    const errors = {};

    if (module.name.trim() === "") {
      errors.name = "Name is required";
      isValid = false;
    }

    setErrors(errors);
    return isValid;
  };
  useEffect(() => {
    if (storedModuleId !== "") {
      moduleService
        .getAllLessonsByModule(storedModuleId)
        .then((res) => {
          console.log(res.data);
          setLessonList(res.data);
        })
        .catch((error) => {
          console.log(error);
        });

      moduleService
        .getAllAssignmentsByModule(storedModuleId)
        .then((res) => {
          console.log(res.data);
          setAssignmentList(res.data);
        })
        .catch((error) => {
          console.log(error);
        });

      moduleService
        .getAllQuizzesByModule(storedModuleId)
        .then((res) => {
          console.log(res.data);
          setQuizList(res.data);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [storedModuleId]);

  const submitModule = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      try {
        // Save account
        console.log(JSON.stringify(module));
        const moduleResponse = await moduleService.saveModule(module);
        console.log(moduleResponse.data);

        setMsg("Module Added Successfully");
        console.log("Submit button clicked"); // Add this line

        // handleContinue(moduleJsonParse.id);
        setCreateButtonClicked(true);
        console.log("createButtonClicked:", createButtonClicked); // Add this line to check the state

        const moduleJson = JSON.stringify(moduleResponse.data);

        const moduleJsonParse = JSON.parse(moduleJson);

        setStoredModuleId(moduleJsonParse.id); // Update storedModuleId using setStoredModuleId


      } catch (error) {
        console.log(error);
      }
    }
  };
  useEffect(() => {
    console.log("createButtonClicked:", createButtonClicked);
  }, [createButtonClicked]);




  //paginate
  //get number of lessons, assignments, quizzes
  const [lessonList, setLessonList] = useState([]);
  const [quizList, setQuizList] = useState([]);
  const [assignmentList, setAssignmentList] = useState([]);

  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [lessonsPerPage] = useState(2);

  const [searchTerm2, setSearchTerm2] = useState('');
  const [currentPage2, setCurrentPage2] = useState(0);
  const [assignmentsPerPage] = useState(2);

  const [searchTerm3, setSearchTerm3] = useState('');
  const [currentPage3, setCurrentPage3] = useState(0);
  const [quizsPerPage] = useState(2);


  const filteredLessons = lessonList
    .filter((lesson) => {
      return (
        lesson.id.toString().toLowerCase().includes(searchTerm.toLowerCase())

      );
    });

  const pageCount = Math.ceil(filteredLessons.length / lessonsPerPage);

  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
  };

  const offset = currentPage * lessonsPerPage;
  const currentLessons = filteredLessons.slice(offset, offset + lessonsPerPage);

  const filteredAssignments = assignmentList
    .filter((assignment) => {
      return (
        assignment.id.toString().toLowerCase().includes(searchTerm2.toLowerCase())

      );
    });

  const pageCount2 = Math.ceil(filteredAssignments.length / assignmentsPerPage);

  const handlePageClick2 = (data) => {
    setCurrentPage2(data.selected);
  };

  const offset2 = currentPage2 * assignmentsPerPage;
  const currentAssignments = filteredAssignments.slice(offset2, offset2 + assignmentsPerPage);



  const filteredQuizs = quizList
    .filter((quiz) => {
      return (
        quiz.id.toString().toLowerCase().includes(searchTerm3.toLowerCase())

      );
    });

  const pageCount3 = Math.ceil(filteredQuizs.length / quizsPerPage);

  const handlePageClick3 = (data) => {
    setCurrentPage3(data.selected);
  };

  const offset3 = currentPage3 * quizsPerPage;
  const currentQuizs = filteredQuizs.slice(offset3, offset3 + quizsPerPage);
  //paginate

  return (
    <>
      <div id="wrapper">
        <Header />
        <Sidebar />
        {/* ============================================================== */}
        {/* Start Page Content here */}
        {/* ============================================================== */}
        <div className="content-page">
          <div className="content">
            {/* Start Content*/}
            <div className="container-fluid">
              {/* start page title */}
              <div className="row">
                <div className="col-12">
                  <div className="card">
                    <div className="card-body">
                      <h4 className="header-title">
                        COURSE - <span className="text-success">{course.name}</span>
                      </h4>
                      <form onSubmit={(e) => submitModule(e)}>
                        <div className="form-group">
                          <label htmlFor="moduleName">Module Name * :</label>
                          <div className="row">
                            <div className="col-md-8">
                              <input
                                type="text"
                                className="form-control"
                                id="name"
                                name="name"
                                value={module.name}
                                onChange={(e) => handleChange(e)}
                                required
                                style={{ borderRadius: '50px', padding: `8px 25px` }}
                              />
                            </div>
                            {!createButtonClicked && (
                              <div className="col-md-4"> {/* Adjust column size as needed */}
                                <button
                                  type="submit"
                                  className="btn btn-success"
                                  // onClick={handleSubmit}
                                  style={{ borderRadius: '50px', padding: `8px 25px` }}
                                >
                                  Create
                                </button>
                              </div>
                            )}

                          </div>
                        </div>

                        <div className="row" style={{ opacity: createButtonClicked ? 1 : 0.5, pointerEvents: createButtonClicked ? 'auto' : 'none' }}>
                          <div className="col-12">
                            <h5>List of Lessons &nbsp;
                              <Link to={`/tutor/courses/create/create-video-course/create-lesson/${storedModuleId}`} >
                                <i className="fas fa-plus-circle text-success"></i>
                              </Link>
                            </h5>
                            <div className="table-responsive">
                              <table id="demo-foo-filtering" className="table table-borderless table-hover table-nowrap table-centered mb-0" data-page-size={7}>
                                <thead className="thead-light">
                                  <tr>
                                    <th data-toggle="true">No.</th>
                                    <th data-toggle="true">Lesson Name</th>
                                    {/* <th>Video Url</th> */}
                                    <th data-hide="phone">Created Date</th>
                                    <th data-hide="phone, tablet">Updated Date</th>
                                    <th>Action</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {
                                    currentLessons.length > 0 && currentLessons.map((lesson, index) => (
                                      <tr key={lesson.id}>
                                        <td>{index + 1}</td>
                                        <td>{lesson.name}</td>
                                        {/* <td>{lesson.videoUrl}</td> */}
                                        <td>{lesson.createdDate}</td>
                                        <td>{lesson.updatedDate}</td>
                                        <td>
                                          <Link to={`/tutor/courses/edit-lesson/${lesson.id}`} className='text-dark'>
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
                            currentLessons.length === 0 && (
                              <>
                                <p className="text-center">No lessons yet.</p>

                              </>
                            )
                          }
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
                          <div className="col-12">
                            <h5>List of Assignments &nbsp;
                              <Link to={`/tutor/courses/create/create-video-course/create-assignment/${storedModuleId}`} >
                                <i className="fas fa-plus-circle text-success"></i>
                              </Link>
                            </h5>                                            <div className="table-responsive">
                              <table id="demo-foo-filtering" className="table table-borderless table-hover table-nowrap table-centered mb-0" data-page-size={7}>
                                <thead className="thead-light">
                                  <tr>
                                    <th>No.</th>
                                    <th>Time</th>
                                    <th>Question</th>
                                    <th data-hide="phone">Created Date</th>
                                    <th data-hide="phone, tablet">Updated Date</th>
                                    <th>Action</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {
                                    currentAssignments.length > 0 && currentAssignments.map((assignment, index) => (
                                      <tr key={assignment.id}>
                                        <td>{index + 1}</td>
                                        <td>{assignment.deadline}</td>
                                        <td className="truncate-text">{assignment.questionText}</td>
                                        <td>{assignment.createdDate}</td>
                                        <td>{assignment.updatedDate}</td>
                                        <td>
                                          <Link to={`/tutor/courses/edit-assignment/${assignment.id}`} className='text-secondary'>
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
                            currentAssignments.length === 0 && (
                              <>
                                <p className="text-center">No assignments yet.</p>

                              </>
                            )
                          }
                          <div className='container-fluid'>
                            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                              <ReactPaginate
                                previousLabel={<AiFillCaretLeft style={{ color: "#000", fontSize: "14px" }} />}
                                nextLabel={<AiFillCaretRight style={{ color: "#000", fontSize: "14px" }} />}
                                breakLabel={'...'}
                                breakClassName={'page-item'}
                                breakLinkClassName={'page-link'}
                                pageCount={pageCount2}
                                marginPagesDisplayed={2}
                                pageRangeDisplayed={5}
                                onPageChange={handlePageClick2}
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
                          <div className="col-12">
                            <h5>List of Quizzes &nbsp;
                              <Link to={`/tutor/courses/create/create-video-course/create-quiz/${storedModuleId}`}>
                                <i className="fas fa-plus-circle text-success"></i>
                              </Link>
                            </h5>                                            <div className="table-responsive">
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
                                        <td>{quiz.gradeToPass}</td>
                                        <td>{quiz.deadline}</td>
                                        <td>{quiz.createdDate}</td>
                                        <td>{quiz.updatedDate}</td>
                                        <td>
                                          <Link to={`/tutor/courses/edit-quiz/${quiz.id}`} className='text-secondary'>
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
                              <>
                                <p className="text-center">No quizzes yet.</p>
                              </>
                            )
                          }
                          <div className='container-fluid'>
                            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                              <ReactPaginate
                                previousLabel={<AiFillCaretLeft style={{ color: "#000", fontSize: "14px" }} />}
                                nextLabel={<AiFillCaretRight style={{ color: "#000", fontSize: "14px" }} />}
                                breakLabel={'...'}
                                breakClassName={'page-item'}
                                breakLinkClassName={'page-link'}
                                pageCount={pageCount3}
                                marginPagesDisplayed={2}
                                pageRangeDisplayed={5}
                                onPageChange={handlePageClick3}
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

                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* ============================================================== */}
        {/* End Page content */}
        {/* ============================================================== */}
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

export default CreateVideoCourseModule;
