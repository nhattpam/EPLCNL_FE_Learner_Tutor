import React, { useState } from 'react';

import { Link, useNavigate } from "react-router-dom";
import Header from '../../Header';
import Sidebar from '../../Sidebar';
import Footer from '../../Footer';

const CreateVideoCourseModule = () => {

  const navigate = useNavigate();


  const [formData, setFormData] = useState({
    image: '',
    price: '',
    fullname: '',
    tags: '',
    description: ''

  });


  const handleSubmit = (event) => {
    event.preventDefault();
    navigate("/tutor/courses/create/create-video-course/create-module/module-part")

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
                    <div className='card-body'>
                      <h4 className="header-title">Create a Video course: Course ABC</h4>
                      <form onSubmit={handleSubmit}>
                        <div className="form-group">
                          <label htmlFor="moduleName">Module Name * :</label>
                          <input
                            type="text"
                            className="form-control"
                            id="moduleName"
                            name="moduleName"
                            value={formData.moduleName}
                          />
                        </div>
                        <div className="form-group mb-0">
                          <button
                            type="button"
                            className="btn btn-primary"
                            onClick={handleSubmit}
                          >
                            Create Module
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
                    width: 100%;
                    text-align: left;
                }
            `}
      </style>
    </>
  );
};

export default CreateVideoCourseModule;
