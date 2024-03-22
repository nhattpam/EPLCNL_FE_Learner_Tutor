import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // Import the styles
import Header from "../../Header";
import Sidebar from "../../Sidebar";
import Footer from "../../Footer";
import moduleService from "../../../../services/module.service";
import assignmentService from "../../../../services/assignment.service";
import DateTimePicker from "react-datetime-picker";

const CreateAssignment = () => {
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [msg, setMsg] = useState("");
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

  const [module, setModule] = useState({
    name: "",
  });

  //tao assignment
  const [assignment, setAssignment] = useState({
    questionText: "",
    deadline: 5, // set a default value for minutes
    moduleId: storedModuleId,
  });

  const handleChange = (e) => {
    const value = e.target.value;
    setModule({ ...module, [e.target.name]: value });
  };
  const handleChangeAssignment = (value) => {
    setAssignment({ ...assignment, questionText: value });
  };

  const validateForm = () => {
    let isValid = true;
    const errors = {};

    if (assignment.questionText.trim() === "") {
      errors.questionText = "Question is required";
      isValid = false;
    }
    if (!assignment.deadline) {
      errors.deadline = "Time is required";
      isValid = false;
    }

    setErrors(errors);
    return isValid;
  };

  const submitAssignment = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      try {
        // Save account
        console.log(JSON.stringify(assignment));
        const assignmentResponse = await assignmentService.saveAssignment(
          assignment
        );
        console.log(assignmentResponse.data);

        setMsg("Assignment Added Successfully");

        const assignmentJson = JSON.stringify(assignmentResponse.data);

        const assignmentJsonParse = JSON.parse(assignmentJson);

        navigate(`/tutor/courses/edit-module/${storedModuleId}`);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleMinutesChange = (e) => {
    const minutes = parseInt(e.target.value, 10);
    setAssignment({ ...assignment, deadline: minutes });
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
                      <h4 className="header-title">
                        COURSE -
                        <span className="text-success">
                          {" "}
                          {module.course ? module.course.name : "N/A"}
                        </span>{" "}
                        | MODULE -
                        <span className="text-success"> {module.name}</span> | CREATING ASSIGNMENT
                      </h4>

                      <form
                        method="post"
                        className="mt-3"
                        id="myAwesomeDropzone"
                        data-plugin="dropzone"
                        data-previews-container="#file-previews"
                        data-upload-preview-template="#uploadPreviewTemplate"
                        data-parsley-validate
                        onSubmit={submitAssignment}
                      >
                        <div className="card" style={{ marginTop: "-20px" }}>
                          <div className="card-body">
                            <label htmlFor="video">Time * :</label>
                            <select
                              value={assignment.deadline}
                              onChange={handleMinutesChange}
                              className="form-control"
                            >
                              {[1, 5, 10, 15, 20, 30, 45, 60, 75, 90, 120].map(
                                (minutes) => (
                                  <option key={minutes} value={minutes}>
                                    {minutes} minutes
                                  </option>
                                )
                              )}
                            </select>
                          </div>
                          <div className="card-body">
                            <label htmlFor="video">Question * :</label>
                            <ReactQuill
                              value={assignment.questionText}
                              onChange={handleChangeAssignment}
                              style={{ height: "300px" }}
                              modules={{
                                toolbar: [
                                    [{ header: [1, 2, false] }],
                                    ['bold', 'italic', 'underline', 'strike'],
                                    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                                    [{ 'indent': '-1' }, { 'indent': '+1' }],
                                    [{ 'direction': 'rtl' }],
                                    [{ 'align': [] }],
                                    ['link', 'image', 'video'],
                                    ['code-block'],
                                    [{ 'color': [] }, { 'background': [] }],
                                    ['clean']
                                ]
                            }}
                            theme="snow"
                            />
                          </div>
                        </div>
                        <div className="form-group mb-0  ">
                          <button
                            type="submit"
                            className="btn btn-success "
                            style={{ marginLeft: "23px", marginTop: "10px" }}
                          >
                             Create
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

export default CreateAssignment;
