import React, { useEffect, useState } from 'react';
import Header from '../Header';
import Sidebar from '../Sidebar';
import Footer from '../Footer';
import { Link, useNavigate, useParams } from 'react-router-dom';
import courseService from '../../../services/course.service';
import moduleService from '../../../services/module.service';
import ReactQuill from 'react-quill';
import certificateService from '../../../services/certificate.service';
import certificateCourseService from '../../../services/certificate-course.service';

const EditCourse = () => {

    const [course, setCourse] = useState({
        name: "",
        description: "",
        code: "",
        imageUrl: "",
        stockPrice: "",
        rating: "",
        categoryId: "",
        tags: "",
        createdDate: "",
        updatedDate: "",
        modules: [],
        classModules: []
    });

    const [certificate, setCertificate] = useState({
        name: "",
        courseId: "",
        description: ""
    });

    const [errors, setErrors] = useState({});
    const [msg, setMsg] = useState('');
    const navigate = useNavigate();

    const [moduleList, setModuleList] = useState([]);
    const [classModuleList, setClassModuleList] = useState([]);


    const { courseId } = useParams();

    useEffect(() => {
        if (courseId) {
            courseService
                .getCourseById(courseId)
                .then((res) => {
                    setCourse(res.data);
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    }, [courseId]);

    useEffect(() => {
        courseService
            .getAllModulesByCourse(courseId)
            .then((res) => {
                // console.log(res.data);
                setModuleList(res.data);

            })
            .catch((error) => {
                console.log(error);
            });
    }, [courseId]);

    useEffect(() => {
        courseService
            .getAllClassModulesByCourse(courseId)
            .then((res) => {
                // console.log(res.data);
                setClassModuleList(res.data);

            })
            .catch((error) => {
                console.log(error);
            });
    }, [courseId]);

    useEffect(() => {
        if (courseId) {
            courseService
                .getCertificateByCourse(courseId)
                .then((res) => {
                    setCertificate(res.data);
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    }, [courseId]);



    const handleEditModule = (moduleId) => {
        // Add logic to navigate to the module edit page with the moduleId
        navigate(`/tutor/courses/edit-module/${moduleId}`);
    };


    const handleEditClassModule = (moduleId) => {
        // Add logic to navigate to the module edit page with the moduleId
        navigate(`/tutor/courses/edit-class-module/${moduleId}`);
    };


    //certificate
    const handleCertificateChange = (e) => {
        const value = e.target.value;
        setCertificate({ ...certificate, [e.target.name]: value });
    };

    const handleDescriptionChange = (value) => {
        setCertificate({ ...certificate, description: value });
    };


    const submitCertificate = async (e) => {
        e.preventDefault();

        try {
            certificate.name = `Thanks for your time, this is certificate for course ${course.name}`;
            certificate.courseId = courseId;
            console.log(JSON.stringify(certificate))
            const responseCertificate = await certificateService.saveCertificate(certificate);
            if (responseCertificate.status == 201) {
                window.alert("Sent ok")
            }

        } catch (error) {
            console.log(error);
        }
    };

    return (
        <>
            <div id="wrapper">
                <Header />
                <Sidebar />
                <div className="content-page">
                    {/* Start Content*/}
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-12">
                                <div className="card-box">
                                    <div className="form-group">
                                        <h4 className="header-title">COURSE INFORMATION</h4>
                                        <div className="table-responsive">
                                            <table className="table table-borderless table-hover table-wrap table-centered m-0">
                                                <tbody>
                                                    <tr>
                                                        <th>Course Name:</th>
                                                        <td>{course.name}</td>
                                                    </tr>
                                                    <tr>
                                                        <th>Code:</th>
                                                        <td>{course.code}</td>
                                                    </tr>
                                                    <tr>
                                                        <th>Price:</th>
                                                        <td>{course.stockPrice}</td>
                                                    </tr>
                                                    <tr>
                                                        <th>Tags:</th>
                                                        <td>
                                                            <span className="badge label-table badge-warning">{course.tags}</span>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>


                                    <div className="form-group">
                                        <h5>Modules:</h5>

                                        <ul className="list-group">
                                            {
                                                moduleList.length > 0 && moduleList.map((module) => (
                                                    <li key={module.id} className="list-group-item d-flex justify-content-between align-items-center" style={{ border: 'none', borderBottom: '1px solid #dee2e6' }}>

                                                        {module.name}
                                                        <button
                                                            type="button"
                                                            onClick={() => handleEditModule(module.id)}
                                                            className="btn btn-link text-dark"
                                                        >
                                                            <i className="far fa-edit"></i>
                                                        </button>
                                                    </li>
                                                ))
                                            }
                                            {
                                                classModuleList.length > 0 && classModuleList.map((module) => (
                                                    <li key={module.id} className="list-group-item d-flex justify-content-between align-items-center" style={{ border: 'none', borderBottom: '1px solid #dee2e6' }}>
                                                        Class Date: {module.startDate !== null ? module.startDate.substring(0, 10) : "No start date"}
                                                        <button
                                                            type="button"
                                                            // className="btn btn-secondary btn-sm"
                                                            className="btn btn-link text-dark"
                                                            onClick={() => handleEditClassModule(module.id)}
                                                        >
                                                            <i className="far fa-edit"></i>

                                                        </button>
                                                    </li>
                                                ))
                                            }

                                        </ul>
                                    </div>

                                    {(!course.isOnlineClass) && (
                                        <div className="form-group mb-4">
                                            <>
                                                {moduleList.length === 0 && (
                                                    <p>No modules available.</p>
                                                )}
                                                <Link
                                                    type="button"
                                                    className="btn btn-success mr-2"
                                                    to={`/tutor/courses/create/create-video-course/create-module/${course.id}`}
                                                >
                                                    Create new module
                                                </Link>


                                                <button
                                                    type="submit"
                                                    className="btn btn-danger"
                                                >
                                                    Request to delete
                                                </button>
                                            </>


                                        </div>

                                    )}
                                    {(course.isOnlineClass) && (
                                        <div className="form-group mb-2">
                                            <>
                                                {classModuleList.length === 0 && (
                                                    <p>No modules available.</p>
                                                )}
                                                <Link
                                                    type="button"
                                                    className="btn btn-success mr-2"
                                                    to={`/tutor/courses/create/create-class-course/create-class-module/${course.id}`}
                                                >
                                                    Create new module
                                                </Link>


                                                <button
                                                    type="submit"
                                                    className="btn btn-danger"
                                                >
                                                   Request to delete
                                                </button>
                                            </>


                                        </div>

                                    )}

                                    <div className="form-group mt-2">
                                        <h5>Certificate:</h5>

                                        <form
                                            method="post"
                                            data-parsley-validate
                                            onSubmit={(e) => submitCertificate(e)}
                                        >
                                            <div className="card">
                                                <div className="card-body">
                                                    <div className="form-group">
                                                        <ReactQuill
                                                            value={certificate.description}
                                                            onChange={handleDescriptionChange}
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

                                                    <div className="form-group mb-0">
                                                        <button
                                                            type="submit"
                                                            className="btn btn-success"
                                                            style={{
                                                                marginLeft: "-2px",
                                                                marginTop: "50px",
                                                            }}
                                                        >
                                                             Create
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </form>
                                    </div>




                                </div> {/* end card-box*/}
                            </div> {/* end col*/}
                        </div>
                        {/* end row*/}

                    </div> {/* container */}
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

                    .grid-container {
                        display: grid;
                        grid-template-columns: repeat(2, 1fr);
                        grid-gap: 10px;
                    }
                    
                    .grid-item {
                        margin-bottom: 15px;
                    }
                    
                    /* Adjustments for small screens */
                    @media (max-width: 768px) {
                        .grid-container {
                            grid-template-columns: 1fr;
                        }
                    }
                    
                `}
            </style>
        </>
    )
}

export default EditCourse;
