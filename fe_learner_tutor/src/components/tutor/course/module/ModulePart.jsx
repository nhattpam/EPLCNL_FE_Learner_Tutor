import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Header from "../../Header";
import Sidebar from "../../Sidebar";
import Footer from "../../Footer";
import moduleService from "../../../../services/module.service";

const ModulePart = () => {
  const storedLoginStatus = sessionStorage.getItem('isLoggedIn');

  const navigate = useNavigate();
  if (!storedLoginStatus) {
      navigate(`/login`)
  }

  const [module, setModule] = useState({
    name: "",
    course: [],
  });

  const { storedModuleId } = useParams();

  useEffect(() => {
    if (storedModuleId) {
      moduleService
        .getModuleById(storedModuleId)
        .then((res) => {
          setModule(res.data);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [storedModuleId]);

  const handleSubmit = (event) => {
    event.preventDefault();
    navigate("/tutor/courses/create/create-video-course/create-lesson");
  };

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
                        COURSE -
                        <span className="text-success">
                          {" "}
                          {module.course ? module.course.name : "N/A"}
                        </span>{" "}
                        | MODULE -{" "}
                        <span className="text-success">{module.name}</span>{" "}
                      </h4>

                      <h4>Lesson</h4>
                      {/* ... (Add fields for lesson) */}
                      <div className="form-group mb-0 ">
                        <button
                          type="button"
                          className="btn btn-success"
                          onClick={() =>
                            navigate(
                              `/tutor/courses/create/create-video-course/create-lesson/${storedModuleId}`
                            )
                          }
                        >
                           Add Lesson
                        </button>
                      </div>
                      <hr
                        style={{
                          background: "#fff",
                          color: "#fff",
                          borderColor: "#000",
                          height: "3px",
                          width: '50%'

                        }}
                      />

                      <h4>Quiz</h4>
                      {/* ... (Add fields for quiz) */}
                      <div className="form-group mb-0">
                        <button
                          type="button"
                          className="btn btn-success"
                          onClick={() =>
                            navigate(
                              `/tutor/courses/create/create-video-course/create-quiz/${storedModuleId}`
                            )
                          }
                        >
                          Add Quiz
                        </button>
                      </div>
                      <hr
                        style={{
                          background: "#fff",
                          color: "#fff",
                          borderColor: "#000",
                          height: "3px",
                          width: '50%'
                        }}
                      />
                      <h4>Assignment</h4>
                      {/* ... (Add fields for assignment) */}
                      <div className="form-group mb-0">
                        <button
                          type="button"
                          className="btn btn-success"
                          onClick={() =>
                            navigate(
                              `/tutor/courses/create/create-video-course/create-assignment/${storedModuleId}`
                            )
                          }
                        >
                          Add Assignment
                        </button>
                      </div>
                      <hr
                        style={{
                          background: "#fff",
                          color: "#fff",
                          borderColor: "#000",
                          height: "3px",
                          width: '50%'

                        }}
                      />
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
                    width: 100%;
                    text-align: left;
                }
            `}
      </style>
    </>
  );
};

export default ModulePart;
