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
import Dropzone from 'react-dropzone';
import lessonMaterialService from '../../../services/material.service';

const EditCourse = () => {

    const tutorId = localStorage.getItem('tutorId');

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
        classModules: [],
        certificate: []
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

    const [file, setFile] = useState(null);
    const [pdfPreview, setPdfPreview] = useState("");


    const handleFileDrop = (acceptedFiles) => {
        if (acceptedFiles && acceptedFiles.length > 0) {
            setFile(acceptedFiles[0]);

            // Set the PDF preview URL
            const previewUrl = URL.createObjectURL(acceptedFiles[0]);
            setPdfPreview(previewUrl);
        }
    };

    const [certificate, setCertificate] = useState({
        name: "",
        courseId: "",
        description: ""
    });


    const submitCertificate = async (e) => {
        e.preventDefault();

        try {
            // Save course
            let description = certificate.description; // Keep the existing imageUrl if available

            if (file) {
                // Upload image and get the link
                const materialData = new FormData();
                materialData.append('file', file);
                const materialResponse = await lessonMaterialService.uploadMaterial(materialData);

                // Update the imageUrl with the link obtained from the API
                description = materialResponse.data;
            }

            const certificateData = {
                name: `Thanks for your time, this is certificate for course ${course.name}`,
                courseId: courseId,
                description: description
            }; // Create a new object with updated imageUrl

            console.log(JSON.stringify(certificateData))

            if (certificateData.description === null) {
                window.alert("Certificate is empty");
                return;
            }
            const responseCertificate = await certificateService.saveCertificate(certificateData);
            if (responseCertificate.status === 201) {
                window.alert("Create Certificate Successfully!");
                // Optionally, you can navigate to another page or perform any other action upon successful creation
                window.location.reload();
            }
        } catch (error) {
            console.log(error);
        }
    };


    //EDIT COURSE
    const [showEditCourseModal, setShowEditCourseModal] = useState(false);
    const [fileImage, setFileImage] = useState(null);
    const [imagePreview, setImagePreview] = useState("");

    const handleFileDropImage = (acceptedFiles) => {
        if (acceptedFiles && acceptedFiles.length > 0) {
            setFileImage(acceptedFiles[0]);

            // Set the image preview URL
            const previewUrl = URL.createObjectURL(acceptedFiles[0]);
            setImagePreview(previewUrl);
        }
    };

    const openEditCourseModal = () => {
        setShowEditCourseModal(true);
    };

    const closeEditCourseModal = () => {
        setShowEditCourseModal(false);
    };

    const handleChange = (e) => {
        const value = e.target.value;
        setCourse({ ...course, [e.target.name]: value });
    };

    const validateForm = () => {
        let isValid = true;
        const errors = {};

        if (course.name.trim() === '') {
            errors.name = 'Name is required';
            isValid = false;
        }

        if (course.code.trim() === '') {
            errors.code = 'Code is required';
            isValid = false;
        }

        if (course.tags.trim() === '') {
            errors.code = 'Tags is required';
            isValid = false;
        }

        setErrors(errors);
        return isValid;
    };

    const submitCourse = async (e) => {
        e.preventDefault();

        if (validateForm()) {
            // Save account
            let imageUrl = course.imageUrl; // Keep the existing imageUrl if available

            if (fileImage) {
                // Upload image and get the link
                const imageData = new FormData();
                imageData.append("file", fileImage);
                const imageResponse = await courseService.uploadImage(imageData);

                // Update the imageUrl with the link obtained from the API
                let imageUrl = imageResponse.data;

                // Log the imageUrl after updating
                console.log("this is url: " + imageUrl);
                course.imageUrl = imageResponse.data;
            }

            // Update course
            const courseData = { ...course, imageUrl }; // Create a new object with updated imageUrl
            console.log(JSON.stringify(courseData))

            courseService
                .updateCourse(course.id, courseData)
                .then((res) => {
                    window.alert("Update Course Successfully");
                    window.location.reload();

                })
                .catch((error) => {
                    console.log(error);
                });
                
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
                                        <h4 className="header-title">COURSE INFORMATION &nbsp;<i class="fa-solid fa-pen-to-square" onClick={openEditCourseModal}></i></h4>
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
                                                        <td>{course.stockPrice}$</td>
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
                                                            <i class="far fa-eye"></i>
                                                        </button>
                                                    </li>
                                                ))
                                            }
                                            {
                                                classModuleList.length > 0 && classModuleList.map((module) => (
                                                    <li key={module.id} className="list-group-item d-flex justify-content-between align-items-center" style={{ border: 'none', borderBottom: '1px solid #dee2e6' }}>
                                                        Class Date: {module.startDate ? new Date(module.startDate).toLocaleDateString('en-US') : "No start date"}
                                                        <button
                                                            type="button"
                                                            // className="btn btn-secondary btn-sm"
                                                            className="btn btn-link text-dark"
                                                            onClick={() => handleEditClassModule(module.id)}
                                                        >
                                                            <i class="far fa-eye"></i>

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
                                                    style={{ borderRadius: '50px', padding: `8px 25px` }}
                                                >
                                                    Create new module
                                                </Link>


                                                {/* <button
                                                    type="submit"
                                                    className="btn btn-danger"
                                                >
                                                    Request to delete
                                                </button> */}

                                                <Link
                                                    type="button"
                                                    className="btn btn-black mr-2"
                                                    to={`/tutor/courses/list-video-course/${tutorId}`}
                                                >
                                                    <i class="fas fa-long-arrow-alt-left"></i> Back to List Course
                                                </Link>
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
                                                    style={{ borderRadius: '50px', padding: `8px 25px` }}
                                                >
                                                    Create new module
                                                </Link>

                                                <Link
                                                    type="button"
                                                    className="btn btn-black mr-2"
                                                    to={`/tutor/courses/list-class-course/${tutorId}`}
                                                >
                                                    <i class="fas fa-long-arrow-alt-left"></i> Back to List Course
                                                </Link>
                                            </>


                                        </div>

                                    )}

                                    <div className="form-group mt-4">
                                        <h5>Certificate:</h5>

                                        {
                                            course.certificate?.description != null && (
                                                <embed src={course.certificate?.description} type="application/pdf" width="100%" height="500px" />

                                            )
                                        }


                                        {
                                            course.certificate == null && (
                                                <>
                                                    <form
                                                        method="post"
                                                        data-parsley-validate
                                                        onSubmit={(e) => submitCertificate(e)}
                                                    >
                                                        <div className="card">
                                                            <div className="card-body">

                                                                <input type='hidden' value={`Thanks for your time, this is certificate for course ${course.name}`} name='name' />
                                                                <input type='hidden' value={courseId} name='courseId' />
                                                                <div className="form-group">
                                                                    <Dropzone
                                                                        onDrop={handleFileDrop}
                                                                        accept="application/pdf" multiple={false}
                                                                        maxSize={5000000} // Maximum file size (5MB)
                                                                    >
                                                                        {({ getRootProps, getInputProps }) => (
                                                                            <div {...getRootProps()} className="fallback">
                                                                                <input {...getInputProps()} />
                                                                                <div className="dz-message needsclick">
                                                                                    <i className="h1 text-muted dripicons-cloud-upload" />
                                                                                    <h3>Drop files here or click to upload.</h3>
                                                                                </div>
                                                                                {pdfPreview && (
                                                                                    <div>
                                                                                        {/* PDF Preview */}
                                                                                        <embed src={pdfPreview} type="application/pdf" width="100%" height="500px" />
                                                                                    </div>
                                                                                )}

                                                                            </div>
                                                                        )}
                                                                    </Dropzone>
                                                                    <div className="dropzone-previews mt-3" id="file-previews" />
                                                                </div>

                                                                <div className="form-group mb-0">
                                                                    <button
                                                                        type="submit"
                                                                        className="btn btn-success"
                                                                        style={{
                                                                            marginLeft: "-2px",
                                                                            marginTop: "50px",
                                                                            borderRadius: '50px', padding: `8px 25px`
                                                                        }}
                                                                    >
                                                                        Create
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </form>
                                                </>
                                            )
                                        }

                                    </div>

                                    {showEditCourseModal && (
                                        <div className="modal" tabIndex="-1" role="dialog" style={{ display: 'block', backgroundColor: 'rgba(29, 29, 29, 0.75)' }}>
                                            <div className="modal-dialog" role="document">
                                                <div className="modal-content">
                                                    <div className="modal-header">
                                                        <h5 className="modal-title">Edit Course</h5>
                                                        <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={closeEditCourseModal}>
                                                            <span aria-hidden="true">&times;</span>
                                                        </button>
                                                    </div>
                                                    {/* Conditional rendering based on edit mode */}
                                                    <>
                                                        <form onSubmit={(e) => submitCourse(e)}>
                                                            <div className="modal-body" style={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}> {/* Added style for scrolling */}
                                                                {/* Input fields for editing */}
                                                                <label htmlFor="imageUrl">
                                                                    <img src={course.imageUrl} alt="avatar"  style={{ width: '100%', cursor: 'pointer' }} />
                                                                </label>
                                                                <Dropzone
                                                                    onDrop={handleFileDropImage}
                                                                    accept="image/*"
                                                                    multiple={false}
                                                                    maxSize={5000000} // Maximum file size (5MB)

                                                                >
                                                                    {({ getRootProps, getInputProps }) => (
                                                                        <div {...getRootProps()} className="fallback">
                                                                            <input {...getInputProps()} />
                                                                            <div className="dz-message needsclick">
                                                                                <i className="h1 text-muted dripicons-cloud-upload" />
                                                                            </div>
                                                                            {imagePreview && (
                                                                                <img
                                                                                    src={imagePreview}
                                                                                    alt="Preview"
                                                                                    style={{
                                                                                        width: '100%', cursor: 'pointer'
                                                                                    }}
                                                                                />
                                                                            )}
                                                                        </div>

                                                                    )}
                                                                </Dropzone>

                                                                <div className="table-responsive">
                                                                    <table className="table table-hover mt-3">
                                                                        <tbody>
                                                                            <tr>
                                                                                <th style={{ width: '30%' }}>Course Name:</th>
                                                                                <td>
                                                                                    <input type="text" className="form-control" name="name" value={course.name} onChange={(e) => handleChange(e)} style={{ borderRadius: '50px', padding: `8px 25px` }} />
                                                                                    {errors.name && <p className="text-danger">{errors.name}</p>}
                                                                                </td>
                                                                            </tr>
                                                                            <tr>
                                                                                <th>Price:</th>
                                                                                <td>
                                                                                    <input type="number" className="form-control" name="price" value={course.stockPrice} onChange={(e) => handleChange(e)} style={{ borderRadius: '50px', padding: `8px 25px` }} />
                                                                                    {errors.stockPrice && <p className="text-danger">{errors.stockPrice}</p>}
                                                                                </td>
                                                                            </tr>
                                                                            <tr>
                                                                                <th>Code:</th>
                                                                                <td>
                                                                                    <input type="text" className="form-control" name="code" value={course.code} onChange={(e) => handleChange(e)} style={{ borderRadius: '50px', padding: `8px 25px` }} />
                                                                                    {errors.code && <p className="text-danger">{errors.code}</p>}
                                                                                </td>
                                                                            </tr>
                                                                            <tr>
                                                                                <th>Tags:</th>
                                                                                <td>
                                                                                    <input type="text" className="form-control" name="tags" value={course.tags} onChange={(e) => handleChange(e)} style={{ borderRadius: '50px', padding: `8px 25px` }} />
                                                                                    {errors.tags && <p className="text-danger">{errors.tags}</p>}
                                                                                </td>
                                                                            </tr>
                                                                        </tbody>
                                                                    </table>
                                                                </div>
                                                            </div>
                                                            <div className="modal-footer">
                                                                <button type="submit" className="btn btn-success" style={{ borderRadius: '50px', padding: `8px 25px` }}>Save Changes</button>
                                                                <button type="button" className="btn btn-dark" onClick={closeEditCourseModal} style={{ borderRadius: '50px', padding: `8px 25px` }}>Close</button>
                                                            </div>
                                                        </form>
                                                    </>


                                                </div>
                                            </div>
                                        </div>
                                    )}


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
