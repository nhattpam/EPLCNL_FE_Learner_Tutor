import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Header from "../../Header";
import Sidebar from "../../Sidebar";
import Footer from "../../Footer";
import courseService from "../../../../services/course.service";
import moduleService from "../../../../services/module.service";

const CreateVideoCourseModule = () => {
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [msg, setMsg] = useState("");

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

  const submitModule = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      try {
        // Save account
        console.log(JSON.stringify(module));
        const moduleResponse = await moduleService.saveModule(module);
        console.log(moduleResponse.data);

        setMsg("Module Added Successfully");

        const moduleJson = JSON.stringify(moduleResponse.data);

        const moduleJsonParse = JSON.parse(moduleJson);

        handleContinue(moduleJsonParse.id);
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
                          <input
                            type="text"
                            className="form-control"
                            id="name"
                            name="name"
                            value={module.name}
                            onChange={(e) => handleChange(e)}
                          />
                        </div>
                        <div className="form-group mb-0">
                          <button
                            type="submit"
                            className="btn btn-success"
                            // onClick={handleSubmit}
                          >
                            <i class="fas fa-check-double"></i> Create
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
